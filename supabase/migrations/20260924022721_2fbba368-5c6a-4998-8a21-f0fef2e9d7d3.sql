CREATE OR REPLACE FUNCTION public.salons_nearby(_lat double precision, _lng double precision, _limit int DEFAULT 200)
RETURNS TABLE(salon_id uuid, distance_km double precision)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path=public AS $$
  SELECT s.id,
    6371 * 2 * asin(sqrt(
      power(sin(radians(s.latitude - _lat)/2),2) +
      cos(radians(_lat)) * cos(radians(s.latitude)) * power(sin(radians(s.longitude - _lng)/2),2)
    )) AS distance_km
  FROM public.salons s
  WHERE s.status='approved'
    AND s.latitude IS NOT NULL AND s.longitude IS NOT NULL
    AND s.latitude BETWEEN -90 AND 90 AND s.longitude BETWEEN -180 AND 180
    AND NOT (s.latitude = 0 AND s.longitude = 0)
    AND _lat BETWEEN -90 AND 90 AND _lng BETWEEN -180 AND 180
  ORDER BY distance_km
  LIMIT LEAST(GREATEST(_limit,1),500);
$$;
GRANT EXECUTE ON FUNCTION public.salons_nearby(double precision,double precision,int) TO anon, authenticated;