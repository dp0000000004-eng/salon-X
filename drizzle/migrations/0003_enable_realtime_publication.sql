ALTER TABLE public.salons REPLICA IDENTITY FULL;
ALTER TABLE public.services REPLICA IDENTITY FULL;
ALTER TABLE public.service_categories REPLICA IDENTITY FULL;
ALTER TABLE public.salon_categories REPLICA IDENTITY FULL;
ALTER TABLE public.hairstyles REPLICA IDENTITY FULL;
ALTER TABLE public.hairstyle_catalog REPLICA IDENTITY FULL;
ALTER TABLE public.wedding_packages REPLICA IDENTITY FULL;
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.payments REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.loyalty_accounts REPLICA IDENTITY FULL;
ALTER TABLE public.loyalty_transactions REPLICA IDENTITY FULL;
ALTER TABLE public.salon_hours REPLICA IDENTITY FULL;
ALTER TABLE public.salon_resources REPLICA IDENTITY FULL;
ALTER TABLE public.salon_closures REPLICA IDENTITY FULL;
ALTER TABLE public.salon_blocks REPLICA IDENTITY FULL;
ALTER TABLE public.staff REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.demo_requests REPLICA IDENTITY FULL;
ALTER TABLE public.salon_subscriptions REPLICA IDENTITY FULL;
ALTER TABLE public.locations REPLICA IDENTITY FULL;
ALTER TABLE public.coupons REPLICA IDENTITY FULL;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'salons','services','service_categories','salon_categories','hairstyles',
    'hairstyle_catalog','wedding_packages','bookings','payments','reviews',
    'notifications','loyalty_accounts','loyalty_transactions','salon_hours',
    'salon_resources','salon_closures','salon_blocks','staff','profiles',
    'demo_requests','salon_subscriptions','locations','coupons'
  ]
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;
