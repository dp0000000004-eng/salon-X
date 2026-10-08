-- 1. Replace the SECURITY DEFINER view with a narrow SECURITY DEFINER function
drop view if exists public.salon_subscription_states;

create or replace function public.salon_subscription_states_for(_salon_ids uuid[])
returns table (salon_id uuid, status subscription_status, expires_at timestamptz, trial_end_date timestamptz)
language sql
stable
security definer
set search_path = public
as $fn$
  select s.salon_id, s.status, s.expires_at, s.trial_end_date
  from public.salon_subscriptions s
  where s.salon_id = any(coalesce(_salon_ids, '{}'::uuid[]))
$fn$;

-- 2. Salon owner contact details are no longer readable by anonymous visitors
revoke select (email, phone, whatsapp_number) on public.salons from anon;

-- 3. Realtime: stop streaming full old row images of sensitive tables
alter table public.payments replica identity default;
alter table public.profiles replica identity default;
alter table public.loyalty_accounts replica identity default;
alter table public.loyalty_transactions replica identity default;
alter table public.bookings replica identity default;
alter table public.notifications replica identity default;

-- 4. Re-tighten EXECUTE on every SECURITY DEFINER function in public
do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig, p.prorettype = 'trigger'::regtype::oid as is_trigger, p.proname
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prosecdef
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    if not f.is_trigger then
      if f.proname in (
        'booking_settings','expired_salons_visible','has_active_subscription','hairstyle_trending',
        'trending_hairstyles','salon_available_slots','salon_open_now','salon_has_feature',
        'has_role','owns_salon','super_admin_count','salon_subscription_states_for'
      ) then
        execute format('grant execute on function %s to anon, authenticated', f.sig);
      elsif f.proname not in ('expire_stale_bookings') then
        execute format('grant execute on function %s to authenticated', f.sig);
      end if;
    end if;
  end loop;
end $$;