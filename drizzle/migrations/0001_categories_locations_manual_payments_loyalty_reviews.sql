-- ============================================================
-- 0. Helper: does the current user own this salon?
-- ============================================================
CREATE OR REPLACE FUNCTION public.owns_salon(_salon_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.salons
    WHERE id = _salon_id AND owner_id = auth.uid()
  );
$$;

-- ============================================================
-- 1. Service categories: description + image
-- ============================================================
ALTER TABLE public.service_categories ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.service_categories ADD COLUMN IF NOT EXISTS image_url text;

-- ============================================================
-- 2. Salon -> platform category selection
-- ============================================================
CREATE TABLE IF NOT EXISTS public.salon_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id uuid NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (salon_id, category_id)
);

GRANT SELECT ON public.salon_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.salon_categories TO authenticated;
GRANT ALL ON public.salon_categories TO service_role;

ALTER TABLE public.salon_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "salon_categories public read"
  ON public.salon_categories FOR SELECT USING (true);

CREATE POLICY "salon_categories owner manage"
  ON public.salon_categories FOR ALL TO authenticated
  USING (public.owns_salon(salon_id) OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.owns_salon(salon_id) OR public.has_role(auth.uid(), 'super_admin'));

CREATE INDEX IF NOT EXISTS salon_categories_category_idx ON public.salon_categories (category_id);

-- ============================================================
-- 3. Standardised location system (State -> District)
-- ============================================================
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS code text;
CREATE UNIQUE INDEX IF NOT EXISTS locations_level_parent_name_key
  ON public.locations (level, COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), lower(name));

ALTER TABLE public.salons ADD COLUMN IF NOT EXISTS district text;

CREATE OR REPLACE FUNCTION public.salon_validate_location()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE st public.locations;
BEGIN
  IF NEW.district IS NOT NULL AND btrim(NEW.district) <> '' THEN
    IF NEW.state IS NULL OR btrim(NEW.state) = '' THEN
      RAISE EXCEPTION 'Select a state before selecting a district.';
    END IF;

    SELECT * INTO st FROM public.locations
     WHERE level = 'state' AND lower(name) = lower(btrim(NEW.state)) AND is_active
     LIMIT 1;
    IF st.id IS NULL THEN
      RAISE EXCEPTION 'Unsupported state: %', NEW.state;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM public.locations
       WHERE level = 'district' AND parent_id = st.id
         AND lower(name) = lower(btrim(NEW.district)) AND is_active
    ) THEN
      RAISE EXCEPTION 'Unsupported district for %: %', st.name, NEW.district;
    END IF;

    NEW.state := st.name;
    NEW.district := btrim(NEW.district);
    IF NEW.city IS NULL OR btrim(NEW.city) = '' THEN
      NEW.city := NEW.district;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS salons_validate_location ON public.salons;
CREATE TRIGGER salons_validate_location
  BEFORE INSERT OR UPDATE OF state, district, city ON public.salons
  FOR EACH ROW EXECUTE FUNCTION public.salon_validate_location();

-- ============================================================
-- 4. Manual payment support
-- ============================================================
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS confirmed_by uuid;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS note text;

CREATE UNIQUE INDEX IF NOT EXISTS payments_booking_unique ON public.payments (booking_id);

CREATE OR REPLACE FUNCTION public.booking_create_pending_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE rate numeric := 0;
BEGIN
  SELECT COALESCE(commission_rate, 0) INTO rate FROM public.salons WHERE id = NEW.salon_id;
  INSERT INTO public.payments (
    booking_id, salon_id, customer_id, method, status, amount,
    commission_rate, commission_amount, salon_earning
  ) VALUES (
    NEW.id, NEW.salon_id, NEW.customer_id, 'pay_at_salon', 'pending',
    GREATEST(COALESCE(NEW.amount, 0) - COALESCE(NEW.discount_amount, 0) + COALESCE(NEW.travel_fee, 0), 0),
    rate, 0, 0
  )
  ON CONFLICT (booking_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_pending_payment ON public.bookings;
CREATE TRIGGER bookings_pending_payment
  AFTER INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.booking_create_pending_payment();

-- ============================================================
-- 5. Salon-scoped loyalty
-- ============================================================
CREATE TABLE IF NOT EXISTS public.loyalty_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id uuid REFERENCES public.salons(id) ON DELETE CASCADE,
  points_per_hundred integer NOT NULL DEFAULT 10,
  point_value_rupees numeric NOT NULL DEFAULT 1,
  min_redeem_points integer NOT NULL DEFAULT 50,
  max_redeem_percent integer NOT NULL DEFAULT 50,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS loyalty_rules_salon_key
  ON public.loyalty_rules (COALESCE(salon_id, '00000000-0000-0000-0000-000000000000'::uuid));

GRANT SELECT ON public.loyalty_rules TO anon;
GRANT SELECT ON public.loyalty_rules TO authenticated;
GRANT ALL ON public.loyalty_rules TO service_role;
ALTER TABLE public.loyalty_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loyalty_rules public read"
  ON public.loyalty_rules FOR SELECT USING (is_active);
CREATE POLICY "loyalty_rules admin manage"
  ON public.loyalty_rules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE TABLE IF NOT EXISTS public.loyalty_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  salon_id uuid NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  balance integer NOT NULL DEFAULT 0,
  total_earned integer NOT NULL DEFAULT 0,
  total_redeemed integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (customer_id, salon_id)
);

GRANT SELECT ON public.loyalty_accounts TO authenticated;
GRANT ALL ON public.loyalty_accounts TO service_role;
ALTER TABLE public.loyalty_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loyalty_accounts scoped read"
  ON public.loyalty_accounts FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR public.owns_salon(salon_id) OR public.has_role(auth.uid(), 'super_admin'));

CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  salon_id uuid NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  points integer NOT NULL,
  kind text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS loyalty_tx_earn_once
  ON public.loyalty_transactions (payment_id) WHERE kind = 'earn';
CREATE INDEX IF NOT EXISTS loyalty_tx_customer_salon_idx
  ON public.loyalty_transactions (customer_id, salon_id, created_at DESC);

GRANT SELECT ON public.loyalty_transactions TO authenticated;
GRANT ALL ON public.loyalty_transactions TO service_role;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loyalty_tx scoped read"
  ON public.loyalty_transactions FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR public.owns_salon(salon_id) OR public.has_role(auth.uid(), 'super_admin'));

CREATE OR REPLACE FUNCTION public.loyalty_rule_for(_salon_id uuid)
RETURNS public.loyalty_rules
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.loyalty_rules
   WHERE is_active AND (salon_id = _salon_id OR salon_id IS NULL)
   ORDER BY salon_id NULLS LAST
   LIMIT 1;
$$;

-- ============================================================
-- 6. Owner confirms a manual payment (loyalty awarded exactly once)
-- ============================================================
CREATE OR REPLACE FUNCTION public.owner_mark_booking_paid(
  _booking_id uuid,
  _method public.payment_method DEFAULT 'cash',
  _note text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  bk public.bookings;
  pay public.payments;
  rule public.loyalty_rules;
  pts integer := 0;
  rate numeric := 0;
  is_admin boolean;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Please sign in.'; END IF;
  IF _method NOT IN ('cash','upi','card','other','pay_at_salon') THEN
    RAISE EXCEPTION 'Only manual payment methods can be recorded.';
  END IF;

  SELECT * INTO bk FROM public.bookings WHERE id = _booking_id;
  IF bk.id IS NULL THEN RAISE EXCEPTION 'Booking not found.'; END IF;

  is_admin := public.has_role(uid, 'super_admin');
  IF NOT is_admin AND NOT EXISTS (
    SELECT 1 FROM public.salons WHERE id = bk.salon_id AND owner_id = uid
  ) THEN
    RAISE EXCEPTION 'You can only confirm payments for your own salon.';
  END IF;

  IF bk.status IN ('cancelled','no_show','expired') THEN
    RAISE EXCEPTION 'This booking cannot be marked as paid.';
  END IF;

  SELECT COALESCE(commission_rate, 0) INTO rate FROM public.salons WHERE id = bk.salon_id;

  SELECT * INTO pay FROM public.payments WHERE booking_id = _booking_id FOR UPDATE;
  IF pay.id IS NULL THEN
    INSERT INTO public.payments (
      booking_id, salon_id, customer_id, method, status, amount,
      commission_rate, commission_amount, salon_earning
    ) VALUES (
      bk.id, bk.salon_id, bk.customer_id, _method, 'pending',
      GREATEST(COALESCE(bk.amount,0) - COALESCE(bk.discount_amount,0) + COALESCE(bk.travel_fee,0), 0),
      rate, 0, 0
    )
    RETURNING * INTO pay;
  END IF;

  IF pay.status = 'paid' THEN
    RAISE EXCEPTION 'This payment is already confirmed.';
  END IF;
  IF pay.status IN ('refunded','cancelled') THEN
    RAISE EXCEPTION 'This payment can no longer be confirmed.';
  END IF;

  UPDATE public.payments SET
    method = _method,
    status = 'paid',
    paid_at = now(),
    confirmed_by = uid,
    confirmed_at = now(),
    note = COALESCE(_note, note),
    commission_rate = rate,
    commission_amount = ROUND(amount * rate / 100.0),
    salon_earning = amount - ROUND(amount * rate / 100.0),
    updated_at = now()
  WHERE id = pay.id
  RETURNING * INTO pay;

  INSERT INTO public.audit_logs (actor_id, action, target_type, target_id, metadata)
  VALUES (uid, 'payment_marked_paid', 'payment', pay.id::text,
          jsonb_build_object('booking_id', bk.id, 'salon_id', bk.salon_id,
                             'amount', pay.amount, 'method', _method, 'note', _note));

  rule := public.loyalty_rule_for(bk.salon_id);
  IF rule.id IS NOT NULL AND pay.amount > 0 THEN
    pts := FLOOR(pay.amount::numeric / 100.0 * rule.points_per_hundred);
    IF pts > 0 THEN
      BEGIN
        INSERT INTO public.loyalty_transactions
          (customer_id, salon_id, booking_id, payment_id, points, kind, reason)
        VALUES (bk.customer_id, bk.salon_id, bk.id, pay.id, pts, 'earn', 'Payment confirmed by salon');

        INSERT INTO public.loyalty_accounts (customer_id, salon_id, balance, total_earned)
        VALUES (bk.customer_id, bk.salon_id, pts, pts)
        ON CONFLICT (customer_id, salon_id) DO UPDATE
          SET balance = public.loyalty_accounts.balance + pts,
              total_earned = public.loyalty_accounts.total_earned + pts,
              updated_at = now();

        INSERT INTO public.notifications (user_id, title, body, category)
        VALUES (bk.customer_id, 'Loyalty points earned',
                pts || ' points added to your balance at this salon.', 'loyalty');
      EXCEPTION WHEN unique_violation THEN
        NULL;
      END;
    END IF;
  END IF;

  INSERT INTO public.notifications (user_id, title, body, category)
  VALUES (bk.customer_id, 'Payment confirmed',
          'The salon has confirmed your payment.', 'payment');

  RETURN pay.id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.owner_mark_booking_paid(uuid, public.payment_method, text) TO authenticated;

-- ============================================================
-- 7. Loyalty redemption (issuing salon only)
-- ============================================================
CREATE OR REPLACE FUNCTION public.redeem_loyalty_points(
  _salon_id uuid,
  _points integer,
  _booking_id uuid DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  acct public.loyalty_accounts;
  rule public.loyalty_rules;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Please sign in.'; END IF;
  IF _points IS NULL OR _points <= 0 THEN RAISE EXCEPTION 'Enter how many points to redeem.'; END IF;

  IF _booking_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.bookings
     WHERE id = _booking_id AND customer_id = uid AND salon_id = _salon_id
  ) THEN
    RAISE EXCEPTION 'Points can only be redeemed at the salon that issued them.';
  END IF;

  rule := public.loyalty_rule_for(_salon_id);
  IF rule.id IS NULL THEN RAISE EXCEPTION 'This salon does not accept point redemption.'; END IF;
  IF _points < rule.min_redeem_points THEN
    RAISE EXCEPTION 'You need at least % points to redeem.', rule.min_redeem_points;
  END IF;

  SELECT * INTO acct FROM public.loyalty_accounts
   WHERE customer_id = uid AND salon_id = _salon_id FOR UPDATE;
  IF acct.id IS NULL OR acct.balance < _points THEN
    RAISE EXCEPTION 'Not enough points at this salon.';
  END IF;

  UPDATE public.loyalty_accounts SET
    balance = balance - _points,
    total_redeemed = total_redeemed + _points,
    updated_at = now()
  WHERE id = acct.id;

  INSERT INTO public.loyalty_transactions
    (customer_id, salon_id, booking_id, points, kind, reason)
  VALUES (uid, _salon_id, _booking_id, -_points, 'redeem', 'Redeemed at salon');

  RETURN acct.balance - _points;
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_loyalty_points(uuid, integer, uuid) TO authenticated;

-- ============================================================
-- 8. Verified reviews + real ratings
-- ============================================================
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES public.services(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS reviews_one_per_booking
  ON public.reviews (booking_id) WHERE booking_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.review_validate()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE bk public.bookings;
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5.';
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.customer_id IS DISTINCT FROM auth.uid() AND NOT public.has_role(auth.uid(), 'super_admin') THEN
      RAISE EXCEPTION 'You can only review your own appointment.';
    END IF;

    IF NEW.booking_id IS NULL THEN
      RAISE EXCEPTION 'Reviews can only be left for a completed appointment.';
    END IF;

    SELECT * INTO bk FROM public.bookings WHERE id = NEW.booking_id;
    IF bk.id IS NULL THEN RAISE EXCEPTION 'Appointment not found.'; END IF;
    IF bk.customer_id IS DISTINCT FROM NEW.customer_id THEN
      RAISE EXCEPTION 'You can only review your own appointment.';
    END IF;
    IF bk.salon_id IS DISTINCT FROM NEW.salon_id THEN
      RAISE EXCEPTION 'This appointment belongs to a different salon.';
    END IF;
    IF bk.status <> 'completed' THEN
      RAISE EXCEPTION 'You can review once the appointment is completed.';
    END IF;
    NEW.service_id := COALESCE(NEW.service_id, bk.service_id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_validate ON public.reviews;
CREATE TRIGGER reviews_validate
  BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.review_validate();

CREATE OR REPLACE FUNCTION public.salon_recount_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE sid uuid := COALESCE(NEW.salon_id, OLD.salon_id);
BEGIN
  UPDATE public.salons s SET
    rating = COALESCE((
      SELECT ROUND(AVG(r.rating)::numeric, 1) FROM public.reviews r
       WHERE r.salon_id = sid AND NOT r.is_hidden
    ), 0),
    review_count = COALESCE((
      SELECT count(*) FROM public.reviews r
       WHERE r.salon_id = sid AND NOT r.is_hidden
    ), 0),
    updated_at = now()
  WHERE s.id = sid;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS reviews_recount ON public.reviews;
CREATE TRIGGER reviews_recount
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.salon_recount_rating();
