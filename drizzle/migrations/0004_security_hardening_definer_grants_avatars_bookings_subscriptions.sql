-- 1/2. Tighten EXECUTE on SECURITY DEFINER functions
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
        'loyalty_rule_for','has_role','owns_salon','subscription_state'
      ) then
        execute format('grant execute on function %s to anon, authenticated', f.sig);
      elsif f.proname not in ('expire_stale_bookings') then
        execute format('grant execute on function %s to authenticated', f.sig);
      end if;
    end if;
  end loop;
end $$;

-- 3. Avatars: only the owner (or a super admin) may read an avatar object
drop policy if exists "avatars_read_authenticated" on storage.objects;
create policy "avatars_read_own" on storage.objects
for select to authenticated
using (
  bucket_id = 'avatars'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.has_role(auth.uid(), 'super_admin')
  )
);

-- 4. Bookings: customers may only touch safe fields / cancel
create or replace function public.bookings_guard_customer_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if auth.uid() is null
     or public.has_role(auth.uid(), 'super_admin')
     or exists (select 1 from public.salons s where s.id = old.salon_id and s.owner_id = auth.uid()) then
    return new;
  end if;

  if old.customer_id <> auth.uid() then
    raise exception 'Not allowed to change this booking.';
  end if;

  new.amount := old.amount;
  new.discount_amount := old.discount_amount;
  new.travel_fee := old.travel_fee;
  new.coupon_code := old.coupon_code;
  new.customer_id := old.customer_id;
  new.salon_id := old.salon_id;
  new.checked_in_at := old.checked_in_at;
  new.started_at := old.started_at;
  new.completed_at := old.completed_at;
  new.resource_id := old.resource_id;
  new.staff_id := old.staff_id;

  if new.status <> old.status then
    if new.status <> 'cancelled'::booking_status
       or old.status in ('completed'::booking_status, 'cancelled'::booking_status, 'no_show'::booking_status) then
      raise exception 'Only cancelling your own upcoming appointment is allowed.';
    end if;
    new.cancelled_by := auth.uid();
  end if;

  return new;
end $fn$;

revoke all on function public.bookings_guard_customer_update() from public, anon, authenticated;

drop trigger if exists bookings_guard_customer_update on public.bookings;
create trigger bookings_guard_customer_update
before update on public.bookings
for each row execute function public.bookings_guard_customer_update();

-- 5. Subscriptions: no raw public read; minimal public state via a view
drop policy if exists "salon_subscriptions_public_state" on public.salon_subscriptions;

drop view if exists public.salon_subscription_states;
create view public.salon_subscription_states
with (security_invoker = false) as
select salon_id, status, expires_at, trial_end_date
from public.salon_subscriptions;

grant select on public.salon_subscription_states to anon, authenticated;