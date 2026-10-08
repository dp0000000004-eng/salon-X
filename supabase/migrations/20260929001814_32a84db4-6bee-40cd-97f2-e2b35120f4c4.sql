REVOKE EXECUTE ON FUNCTION public.owner_loyalty_rule(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.owner_save_loyalty_rule(uuid, integer, numeric, integer, integer, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owner_loyalty_rule(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.owner_save_loyalty_rule(uuid, integer, numeric, integer, integer, boolean) TO authenticated;