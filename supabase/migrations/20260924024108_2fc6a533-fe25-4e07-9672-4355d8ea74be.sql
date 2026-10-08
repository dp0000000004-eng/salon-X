DROP POLICY IF EXISTS plans_public_read ON public.subscription_plans;
CREATE POLICY plans_public_read ON public.subscription_plans FOR SELECT TO anon, authenticated
  USING (is_active OR public.has_role(auth.uid(),'super_admin'));

DROP POLICY IF EXISTS app_features_read ON public.app_features;
CREATE POLICY app_features_read ON public.app_features FOR SELECT TO anon, authenticated
  USING (is_active OR public.has_role(auth.uid(),'super_admin'));

DROP POLICY IF EXISTS plan_features_read ON public.subscription_plan_features;
CREATE POLICY plan_features_read ON public.subscription_plan_features FOR SELECT TO anon, authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR (
    EXISTS (SELECT 1 FROM public.subscription_plans p WHERE p.id = plan_id AND p.is_active)
    AND EXISTS (SELECT 1 FROM public.app_features f WHERE f.id = feature_id AND f.is_active)));

DROP POLICY IF EXISTS svc_cat_read ON public.service_categories;
CREATE POLICY svc_cat_read ON public.service_categories FOR SELECT TO anon, authenticated
  USING (is_active OR public.has_role(auth.uid(),'super_admin'));

DROP POLICY IF EXISTS loc_read ON public.locations;
CREATE POLICY loc_read ON public.locations FOR SELECT TO anon, authenticated
  USING (is_active OR public.has_role(auth.uid(),'super_admin'));

DROP POLICY IF EXISTS "salon_categories public read" ON public.salon_categories;
CREATE POLICY "salon_categories public read" ON public.salon_categories FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.salons s WHERE s.id = salon_id AND s.status = 'approved')
         OR public.owns_salon(salon_id) OR public.has_role(auth.uid(),'super_admin'));

DROP POLICY IF EXISTS "Anyone can submit a demo request" ON public.demo_requests;
CREATE POLICY "Anyone can submit a demo request" ON public.demo_requests FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending' AND admin_notes IS NULL AND created_salon_id IS NULL
    AND length(coalesce(owner_name,'')) BETWEEN 1 AND 120
    AND length(coalesce(salon_name,'')) BETWEEN 1 AND 160
    AND length(coalesce(phone,'')) BETWEEN 6 AND 20
    AND length(coalesce(email,'')) <= 255
    AND length(coalesce(message,'')) <= 2000);

DROP POLICY IF EXISTS salon_media_public_read ON storage.objects;
CREATE POLICY salon_media_public_read ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'salon-media'
    AND (storage.foldername(name))[1] ~ '^[0-9a-fA-F-]{36}$'
    AND (storage.foldername(name))[2] = ANY (ARRAY['logo','cover','gallery','services','packages','hairstyles'])
    AND EXISTS (SELECT 1 FROM public.salons s WHERE s.id = ((storage.foldername(name))[1])::uuid AND s.status = 'approved'));