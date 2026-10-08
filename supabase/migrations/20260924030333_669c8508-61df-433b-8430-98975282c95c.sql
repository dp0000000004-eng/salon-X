
-- 1. Odisha districts
INSERT INTO public.locations (level, name, code, is_active)
SELECT 'state', 'Odisha', 'OD', true
WHERE NOT EXISTS (SELECT 1 FROM public.locations WHERE level='state' AND name ILIKE 'Odisha');

INSERT INTO public.locations (level, name, parent_id, is_active)
SELECT 'district', d, (SELECT id FROM public.locations WHERE level='state' AND name ILIKE 'Odisha' LIMIT 1), true
FROM unnest(ARRAY['Angul','Balangir','Balasore','Bargarh','Bhadrak','Boudh','Cuttack','Deogarh','Dhenkanal','Gajapati','Ganjam','Jagatsinghpur','Jajpur','Jharsuguda','Kalahandi','Kandhamal','Kendrapara','Keonjhar','Khordha','Koraput','Malkangiri','Mayurbhanj','Nabarangpur','Nayagarh','Nuapada','Puri','Rayagada','Sambalpur','Subarnapur','Sundargarh']) AS d
WHERE NOT EXISTS (
  SELECT 1 FROM public.locations l WHERE l.level='district' AND l.name = d
    AND l.parent_id = (SELECT id FROM public.locations WHERE level='state' AND name ILIKE 'Odisha' LIMIT 1));

-- 2. Demo requests
ALTER TABLE public.demo_requests ADD COLUMN IF NOT EXISTS state text, ADD COLUMN IF NOT EXISTS district text;

-- 3. Subscription history detail
ALTER TABLE public.subscription_status_history
  ADD COLUMN IF NOT EXISTS action text,
  ADD COLUMN IF NOT EXISTS previous_status subscription_status,
  ADD COLUMN IF NOT EXISTS plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS start_at timestamptz,
  ADD COLUMN IF NOT EXISTS end_at timestamptz;

-- plan validation
CREATE OR REPLACE FUNCTION public.plan_validate() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.price < 0 THEN RAISE EXCEPTION 'Price cannot be negative.'; END IF;
  IF NEW.trial_days < 0 THEN RAISE EXCEPTION 'Trial days cannot be negative.'; END IF;
  IF NEW.billing_days IS NOT NULL AND NEW.billing_days < 1 THEN RAISE EXCEPTION 'Subscription duration must be at least 1 day.'; END IF;
  IF length(trim(NEW.name)) = 0 THEN RAISE EXCEPTION 'Plan name is required.'; END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS plan_validate ON public.subscription_plans;
CREATE TRIGGER plan_validate BEFORE INSERT OR UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION public.plan_validate();

-- trial uses configured plan
CREATE OR REPLACE FUNCTION public.start_salon_trial(_salon_id uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE _plan public.subscription_plans%ROWTYPE; _owner uuid; _sub uuid; _days int; _status subscription_status;
BEGIN
  SELECT * INTO _plan FROM public.subscription_plans WHERE code = 'all_in_one' AND is_active LIMIT 1;
  IF _plan.id IS NULL THEN RETURN; END IF;
  SELECT owner_id INTO _owner FROM public.salons WHERE id = _salon_id;
  SELECT id INTO _sub FROM public.salon_subscriptions WHERE salon_id = _salon_id;
  IF _sub IS NOT NULL THEN RETURN; END IF;
  _days := CASE WHEN _plan.trial_enabled THEN GREATEST(_plan.trial_days,0) ELSE 0 END;
  _status := CASE WHEN _days > 0 THEN 'trialing'::subscription_status ELSE 'expired'::subscription_status END;
  INSERT INTO public.salon_subscriptions (salon_id, owner_id, plan_id, status, started_at, expires_at, trial_start_date, trial_end_date)
  VALUES (_salon_id, _owner, _plan.id, _status, now(), now() + make_interval(days => _days),
          CASE WHEN _days > 0 THEN now() END, CASE WHEN _days > 0 THEN now() + make_interval(days => _days) END)
  RETURNING id INTO _sub;
  INSERT INTO public.subscription_status_history (subscription_id, salon_id, status, note, changed_by, action, plan_id, start_at, end_at)
  VALUES (_sub, _salon_id, _status,
    CASE WHEN _days > 0 THEN _days || '-day free trial started on approval' ELSE 'Approved — no trial configured' END,
    auth.uid(), 'trial_start', _plan.id, now(), now() + make_interval(days => _days));
END;
$function$;

-- admin renew with explicit dates
CREATE OR REPLACE FUNCTION public.admin_renew_subscription(_salon_id uuid, _start timestamptz, _end timestamptz, _plan_id uuid DEFAULT NULL, _note text DEFAULT NULL)
 RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE _plan uuid; _owner uuid; _sub public.salon_subscriptions%ROWTYPE; _prev subscription_status;
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN RAISE EXCEPTION 'Access denied. Super Admin access is restricted.'; END IF;
  IF _start IS NULL OR _end IS NULL OR _end <= _start THEN RAISE EXCEPTION 'Expiry must be after the start date.'; END IF;
  SELECT id INTO _plan FROM public.subscription_plans WHERE id = COALESCE(_plan_id, (SELECT id FROM public.subscription_plans WHERE code='all_in_one' LIMIT 1));
  IF _plan IS NULL THEN RAISE EXCEPTION 'Plan not found.'; END IF;
  SELECT owner_id INTO _owner FROM public.salons WHERE id = _salon_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Salon not found.'; END IF;
  SELECT * INTO _sub FROM public.salon_subscriptions WHERE salon_id = _salon_id;
  IF _sub.id IS NULL THEN
    INSERT INTO public.salon_subscriptions (salon_id, owner_id, plan_id, status, started_at, expires_at)
    VALUES (_salon_id, _owner, _plan, 'active', _start, _end) RETURNING * INTO _sub;
    _prev := NULL;
  ELSE
    _prev := _sub.status;
    UPDATE public.salon_subscriptions SET status='active', plan_id=_plan, owner_id=COALESCE(owner_id,_owner),
      started_at=_start, expires_at=_end, cancelled_at=NULL, suspended_at=NULL, updated_at=now()
    WHERE id=_sub.id;
  END IF;
  INSERT INTO public.subscription_status_history (subscription_id, salon_id, status, note, changed_by, action, previous_status, plan_id, start_at, end_at)
  VALUES (_sub.id, _salon_id, 'active', COALESCE(NULLIF(trim(_note),''), 'Renewed by Super Admin'), auth.uid(), 'renew', _prev, _plan, _start, _end);
  INSERT INTO public.audit_logs (actor_id, action, target_type, target_id, metadata)
  VALUES (auth.uid(), 'subscription.renew', 'salon', _salon_id::text,
    jsonb_build_object('previous_status', _prev, 'previous_expiry', _sub.expires_at, 'new_start', _start, 'new_expiry', _end, 'note', _note));
  IF _owner IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, body, category, link)
    VALUES (_owner, 'Subscription renewed', 'Your SalonX subscription is active until ' || to_char(_end, 'DD Mon YYYY') || '.', 'subscription', '/owner');
  END IF;
  RETURN true;
END $$;
REVOKE EXECUTE ON FUNCTION public.admin_renew_subscription(uuid, timestamptz, timestamptz, uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_renew_subscription(uuid, timestamptz, timestamptz, uuid, text) TO authenticated;

-- booking lock message
CREATE OR REPLACE FUNCTION public.enforce_booking_subscription()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF public.has_role(auth.uid(), 'super_admin') THEN RETURN NEW; END IF;
  IF NOT public.has_active_subscription(NEW.salon_id) THEN
    RAISE EXCEPTION 'Booking is temporarily unavailable. This salon''s subscription has expired.' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$function$;

-- 4. Public contact settings
INSERT INTO public.platform_settings (key, value) VALUES ('contact', '{"platform_name":"SalonX"}'::jsonb) ON CONFLICT (key) DO NOTHING;
GRANT SELECT ON public.platform_settings TO anon, authenticated;
DROP POLICY IF EXISTS "public_contact_read" ON public.platform_settings;
CREATE POLICY "public_contact_read" ON public.platform_settings FOR SELECT TO anon, authenticated USING (key = 'contact');

-- 5. Contact messages
CREATE SEQUENCE IF NOT EXISTS public.contact_message_seq;
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id text NOT NULL UNIQUE DEFAULT ('CM-' || lpad(nextval('public.contact_message_seq')::text, 6, '0')),
  user_id uuid,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  is_read boolean NOT NULL DEFAULT false,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
GRANT USAGE ON SEQUENCE public.contact_message_seq TO anon, authenticated;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone_send" ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'new' AND is_read = false AND admin_notes IS NULL AND (user_id IS NULL OR user_id = auth.uid()));
CREATE POLICY "admin_read" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "admin_update" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "admin_delete" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE OR REPLACE FUNCTION public.contact_message_validate() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.name := trim(NEW.name); NEW.phone := trim(NEW.phone); NEW.subject := trim(NEW.subject); NEW.message := trim(NEW.message);
  NEW.email := NULLIF(trim(COALESCE(NEW.email,'')), '');
  IF length(NEW.name) = 0 OR length(NEW.name) > 100 THEN RAISE EXCEPTION 'Name is required (max 100 characters).'; END IF;
  IF NEW.phone !~ '^[0-9+ ()-]{7,20}$' THEN RAISE EXCEPTION 'Enter a valid phone number.'; END IF;
  IF NEW.email IS NOT NULL AND (NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(NEW.email) > 255) THEN RAISE EXCEPTION 'Enter a valid email address.'; END IF;
  IF length(NEW.subject) = 0 OR length(NEW.subject) > 150 THEN RAISE EXCEPTION 'Subject is required (max 150 characters).'; END IF;
  IF length(NEW.message) = 0 OR length(NEW.message) > 2000 THEN RAISE EXCEPTION 'Message is required (max 2000 characters).'; END IF;
  IF NEW.status NOT IN ('new','in_progress','resolved','closed') THEN RAISE EXCEPTION 'Invalid status.'; END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER contact_message_validate BEFORE INSERT OR UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.contact_message_validate();

ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscription_status_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscription_plans;
