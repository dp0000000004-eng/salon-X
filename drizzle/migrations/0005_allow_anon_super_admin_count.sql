-- The Super Admin console must decide between first-time setup and the login
-- screen before anyone signs in, so the count (a single integer) stays public.
grant execute on function public.super_admin_count() to anon, authenticated;