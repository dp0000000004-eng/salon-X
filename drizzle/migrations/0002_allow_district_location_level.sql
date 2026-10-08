ALTER TABLE public.locations DROP CONSTRAINT IF EXISTS locations_level_check;
ALTER TABLE public.locations ADD CONSTRAINT locations_level_check
  CHECK (level = ANY (ARRAY['state'::text, 'district'::text, 'city'::text, 'area'::text, 'pin'::text]));
