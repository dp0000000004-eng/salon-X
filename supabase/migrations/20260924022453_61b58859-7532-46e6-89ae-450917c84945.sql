ALTER TYPE public.ticket_status ADD VALUE IF NOT EXISTS 'waiting_user' BEFORE 'resolved';

ALTER TABLE public.support_tickets
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS salon_id uuid REFERENCES public.salons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS raised_as text NOT NULL DEFAULT 'customer',
  ADD COLUMN IF NOT EXISTS payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL;
UPDATE public.support_tickets SET priority='medium' WHERE priority='normal';
ALTER TABLE public.support_tickets ALTER COLUMN priority SET DEFAULT 'medium';
ALTER TABLE public.ticket_messages ADD COLUMN IF NOT EXISTS is_internal boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_tickets_user ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tmsg_ticket ON public.ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_salons_loc ON public.salons(state, district, city);
CREATE INDEX IF NOT EXISTS idx_salons_pin ON public.salons(pin_code);

CREATE OR REPLACE FUNCTION public.ticket_validate()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NEW.category NOT IN ('subscription','renewal','payment','booking','account','technical','salon_profile','other') THEN
    RAISE EXCEPTION 'Invalid ticket category'; END IF;
  IF NEW.priority NOT IN ('low','medium','high','urgent') THEN RAISE EXCEPTION 'Invalid priority'; END IF;
  IF TG_OP='INSERT' THEN
    IF NEW.salon_id IS NOT NULL AND NOT public.owns_salon(NEW.salon_id) AND NOT public.has_role(auth.uid(),'super_admin') THEN
      RAISE EXCEPTION 'You can only link your own salon'; END IF;
    NEW.raised_as := CASE WHEN NEW.salon_id IS NOT NULL THEN 'owner' ELSE 'customer' END;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_ticket_validate ON public.support_tickets;
CREATE TRIGGER trg_ticket_validate BEFORE INSERT OR UPDATE ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION public.ticket_validate();

-- internal notes: admins only
DROP POLICY IF EXISTS tmsg_read ON public.ticket_messages;
CREATE POLICY tmsg_read ON public.ticket_messages FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(),'super_admin')
  OR (NOT is_internal AND EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id=ticket_id AND t.user_id=auth.uid())));
DROP POLICY IF EXISTS tmsg_insert ON public.ticket_messages;
CREATE POLICY tmsg_insert ON public.ticket_messages FOR INSERT TO authenticated WITH CHECK (
  author_id=auth.uid() AND (
    public.has_role(auth.uid(),'super_admin')
    OR (NOT is_internal AND EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id=ticket_id AND t.user_id=auth.uid() AND t.status <> 'closed'))));

-- notifications
CREATE OR REPLACE FUNCTION public.notify_ticket_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE a record;
BEGIN
  IF TG_OP='INSERT' THEN
    FOR a IN SELECT user_id FROM public.user_roles WHERE role='super_admin' LOOP
      INSERT INTO public.notifications(user_id,title,body,category,link)
      VALUES (a.user_id, CASE WHEN NEW.priority='urgent' THEN 'Urgent support ticket' ELSE 'New support ticket' END,
              NEW.subject, 'support', '/master-dashboard/support');
    END LOOP;
    INSERT INTO public.notifications(user_id,title,body,category,link)
    VALUES (NEW.user_id,'Support ticket created',NEW.subject,'support',NULL);
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.notifications(user_id,title,body,category,link)
    VALUES (NEW.user_id,'Ticket status: '||replace(NEW.status::text,'_',' '),NEW.subject,'support',NULL);
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_notify_ticket ON public.support_tickets;
CREATE TRIGGER trg_notify_ticket AFTER INSERT OR UPDATE ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION public.notify_ticket_change();

CREATE OR REPLACE FUNCTION public.notify_ticket_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE t record; a record;
BEGIN
  SELECT * INTO t FROM public.support_tickets WHERE id=NEW.ticket_id;
  UPDATE public.support_tickets SET updated_at=now() WHERE id=NEW.ticket_id;
  IF NEW.is_internal THEN RETURN NEW; END IF;
  IF NEW.author_id = t.user_id THEN
    FOR a IN SELECT user_id FROM public.user_roles WHERE role='super_admin' LOOP
      INSERT INTO public.notifications(user_id,title,body,category,link)
      VALUES (a.user_id,'New reply on ticket',t.subject,'support','/master-dashboard/support');
    END LOOP;
  ELSE
    INSERT INTO public.notifications(user_id,title,body,category,link)
    VALUES (t.user_id,'Support replied',t.subject,'support',NULL);
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_notify_tmsg ON public.ticket_messages;
CREATE TRIGGER trg_notify_tmsg AFTER INSERT ON public.ticket_messages
FOR EACH ROW EXECUTE FUNCTION public.notify_ticket_message();

-- enable realtime on business tables
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['salons','salon_subscriptions','bookings','payments','payouts','services','hairstyles','wedding_packages','salon_hours','salon_closures','salon_blocks','support_tickets','ticket_messages','notifications','reviews','service_categories','hairstyle_catalog'] LOOP
    IF to_regclass('public.'||t) IS NOT NULL AND NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename=t) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;