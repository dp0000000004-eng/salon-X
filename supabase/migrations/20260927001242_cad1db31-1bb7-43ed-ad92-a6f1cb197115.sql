DROP POLICY IF EXISTS "public_homepage_read" ON public.platform_settings;
CREATE POLICY "public_homepage_read" ON public.platform_settings FOR SELECT TO anon, authenticated USING (key = 'homepage');