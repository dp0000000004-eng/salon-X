CREATE UNIQUE INDEX IF NOT EXISTS loyalty_rules_salon_unique
  ON public.loyalty_rules (salon_id) WHERE salon_id IS NOT NULL;

CREATE POLICY "loyalty_rules owner read own"
  ON public.loyalty_rules FOR SELECT
  TO authenticated
  USING (salon_id IS NOT NULL AND public.owns_salon(salon_id));

CREATE OR REPLACE FUNCTION public.owner_loyalty_rule(_salon_id uuid)
RETURNS public.loyalty_rules
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT * FROM public.loyalty_rules
   WHERE salon_id = _salon_id
     AND (public.owns_salon(_salon_id) OR public.has_role(auth.uid(), 'super_admin'::app_role))
   LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.owner_save_loyalty_rule(
  _salon_id uuid,
  _points_per_hundred integer,
  _point_value_rupees numeric,
  _min_redeem_points integer,
  _max_redeem_percent integer,
  _is_active boolean
)
RETURNS public.loyalty_rules
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  row public.loyalty_rules;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Please sign in.'; END IF;
  IF NOT (public.owns_salon(_salon_id) OR public.has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'You can only change your own salon settings.';
  END IF;

  IF _points_per_hundred IS NULL OR _points_per_hundred < 0 OR _points_per_hundred > 100 THEN
    RAISE EXCEPTION 'Points per ₹100 must be between 0 and 100.';
  END IF;
  IF _point_value_rupees IS NULL OR _point_value_rupees <= 0 OR _point_value_rupees > 100 THEN
    RAISE EXCEPTION 'Point value must be between 0.01 and 100.';
  END IF;
  IF _min_redeem_points IS NULL OR _min_redeem_points < 1 OR _min_redeem_points > 100000 THEN
    RAISE EXCEPTION 'Minimum redeem points must be between 1 and 100000.';
  END IF;
  IF _max_redeem_percent IS NULL OR _max_redeem_percent < 1 OR _max_redeem_percent > 100 THEN
    RAISE EXCEPTION 'Maximum discount percent must be between 1 and 100.';
  END IF;

  INSERT INTO public.loyalty_rules AS lr
    (salon_id, points_per_hundred, point_value_rupees, min_redeem_points, max_redeem_percent, is_active)
  VALUES
    (_salon_id, _points_per_hundred, _point_value_rupees, _min_redeem_points, _max_redeem_percent, _is_active)
  ON CONFLICT (salon_id) WHERE salon_id IS NOT NULL
  DO UPDATE SET
    points_per_hundred = EXCLUDED.points_per_hundred,
    point_value_rupees = EXCLUDED.point_value_rupees,
    min_redeem_points = EXCLUDED.min_redeem_points,
    max_redeem_percent = EXCLUDED.max_redeem_percent,
    is_active = EXCLUDED.is_active,
    updated_at = now()
  RETURNING * INTO row;

  RETURN row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.owner_loyalty_rule(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.owner_save_loyalty_rule(uuid, integer, numeric, integer, integer, boolean) TO authenticated;