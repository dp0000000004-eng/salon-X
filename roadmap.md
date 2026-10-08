# SalonX Remix Roadmap

## Done
- Fixed preview build errors (missing `@supabase/supabase-js` dependency)
- Added the live data foundation, real customer discovery, salon profiles, booking, accounts, favourites, notifications, and realtime refreshes

- Master hairstyle catalogue (super admin), per-salon hairstyle selection with own price/duration/availability, hairstyle and service based salon discovery, real-activity trending with Editor's Picks fallback

- Single All-in-One Unlimited plan, 14-day trial started on approval, backend-enforced subscription locks, Super Admin subscription management, expired-salon visibility setting, duplicate Salons admin page removed

## Open

- Razorpay and PhonePe checkout + webhook verification (blocked: needs merchant credentials from the user)

- Replace the sample owner dashboard with protected live management workflows
- Replace the sample admin dashboard with protected live moderation and catalog workflows
- Remove remaining hardcoded business records
- Verify booking conflicts, realtime updates, access control, and responsive layouts
- Add payments after completing the required payment enablement flow
- Add the AI hairstyle assistant as a separate integration milestone

## Booking engine (done)
- Chair-based availability, 10-min start interval, buffer, closures, full-duration checks (backend RPCs).
- Owner Dashboard → Booking Settings: chairs, start interval, buffer, holidays.
- Customer salon page: stepped booking flow (category → item → date → time → summary), responsive 320px+, realtime.
- Stored images now resolved via signed URLs on all customer pages (StoredImage).

## Production spec (Sep 24) — phased
- [done] P1: Near Me (server-side distance, permission message) + state/district/area/pincode search
- P2: Public salon page contact/social/open status; booking lock UI + realtime unlock
- P3: Owner dashboard live: subscription card, renewal flow, revenue, Mark as Paid (server-side, idempotent)
- P4: Payment gateway admin config + test connection + webhooks (blocked: merchant credentials)
- P5: Payouts (real records only), admin subscription audit log
- [done] P6: Support tickets (owner/customer/admin, internal notes, subscription context + renew/extend, notifications)
- [done] Live updates were switched off in the backend — now on for all business tables
- [done] Owner "Renew Subscription" sends a renewal ticket until online payment is connected
- P7: Cover/logo crop + storage upload
- [partial] P8: Language system + picker live (saved on device and account). Translated: menu, homepage headline/search, salon search, booking lock message, support. Remaining: other homepage sections, footer, auth, account, owner + admin dashboards
- P9: Loading/error/retry states everywhere ("Could not load data" fixes)

## Sept 26 brief
- [x] Subscriptions display-only (owner + Super Admin), single plan, trial states, expired message
- [x] Owner Payment History: live revenue (total/today/week/month), All/Paid/Unpaid filter, Mark as Paid; payouts removed
- [x] Super Admin: Payments, Transactions, Commission removed (Payment Gateway kept); old /admin redirects
- [x] Super Admin Settings → Homepage Sections toggles (wedding, categories, hairstyles, top rated, trusted), live
