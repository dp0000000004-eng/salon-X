import { createServerFn } from "@tanstack/react-start";

export type DemoSubmission = {
  // Step 1 — salon information
  salonName: string;
  salonType: string;
  ownerName: string;
  phone: string;
  email: string;
  whatsapp?: string | undefined;
  description?: string | undefined;
  seats?: number | undefined;
  yearsInBusiness?: number | undefined;
  // Step 2 — location
  address: string;
  state: string;
  district: string;
  city: string;
  area?: string | undefined;
  pinCode: string;
  mapsUrl?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  // Step 3 — business
  openingTime: string;
  closingTime: string;
  weeklyClosedDay?: number | undefined;
  servicesOffered?: string | undefined;
  startingPrice?: number | undefined;
  instagramUrl?: string | undefined;
  facebookUrl?: string | undefined;
  websiteUrl?: string | undefined;
  // credentials
  password: string;
};

function slugify(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function req(value: string | undefined, label: string) {
  if (!value || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}

/**
 * Public onboarding endpoint for "Book a Demo".
 * Creates the owner account, profile, salon record and demo request in one pass.
 * The salon stays pending + inactive until a Super Admin approves it.
 */
export const submitDemoRequest = createServerFn({ method: "POST" })
  .inputValidator((input: DemoSubmission) => {
    req(input.salonName, "Salon name");
    req(input.salonType, "Salon type");
    req(input.ownerName, "Owner name");
    req(input.phone, "Mobile number");
    req(input.address, "Full address");
    req(input.state, "State");
    req(input.district, "District");
    req(input.pinCode, "Pincode");
    req(input.openingTime, "Opening time");
    req(input.closingTime, "Closing time");
    if (!input.email?.includes("@")) throw new Error("A valid email is required.");
    if (!input.password || input.password.length < 8) throw new Error("Password must be at least 8 characters.");
    return input;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.trim().toLowerCase();

    // District must be one of the active districts of the selected state (no free text).
    const { data: stateRow } = await supabaseAdmin
      .from("locations").select("id, name").eq("level", "state").eq("is_active", true).ilike("name", data.state.trim()).maybeSingle();
    if (!stateRow) throw new Error("Please select a valid state.");
    const { data: districtRow } = await supabaseAdmin
      .from("locations").select("name").eq("level", "district").eq("is_active", true)
      .eq("parent_id", stateRow.id).eq("name", data.district.trim()).maybeSingle();
    if (!districtRow) throw new Error("Please select a district from the list.");

    const { data: created, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.ownerName },
    });
    if (authError || !created?.user) {
      const msg = authError?.message ?? "Could not create the owner account.";
      if (/already/i.test(msg)) {
        throw new Error("An account with this email already exists. Please sign in instead.");
      }
      throw new Error(msg);
    }
    const userId = created.user.id;

    const cleanup = async () => {
      await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => undefined);
    };

    try {
      await supabaseAdmin
        .from("profiles")
        .upsert({ id: userId, full_name: data.ownerName, phone: data.phone, email, city: data.city }, { onConflict: "id" });

      await supabaseAdmin.from("user_roles").upsert(
        { user_id: userId, role: "salon_owner" },
        { onConflict: "user_id,role", ignoreDuplicates: true },
      );

      const slug = `${slugify(data.salonName)}-${userId.slice(0, 6)}`;

      const { data: salon, error: salonError } = await supabaseAdmin
        .from("salons")
        .insert({
          owner_id: userId,
          name: data.salonName.trim(),
          slug,
          salon_type: data.salonType,
          phone: data.phone,
          email,
          whatsapp_number: data.whatsapp ?? null,
          about: data.description ?? null,
          seats: data.seats ?? null,
          years_in_business: data.yearsInBusiness ?? null,
          address: data.address,
          state: data.state,
          district: data.district,
          city: data.district,
          area: data.area ?? null,
          pin_code: data.pinCode,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          website_url: data.mapsUrl ? data.websiteUrl ?? null : data.websiteUrl ?? null,
          opening_time: data.openingTime,
          closing_time: data.closingTime,
          weekly_closed_day: data.weeklyClosedDay ?? null,
          services_offered: data.servicesOffered ?? null,
          starting_price: data.startingPrice ?? 0,
          instagram_url: data.instagramUrl ?? null,
          facebook_url: data.facebookUrl ?? null,
          status: "pending",
          is_active: false,
        })
        .select("id")
        .single();
      if (salonError || !salon) throw new Error(salonError?.message ?? "Could not create the salon record.");

      await supabaseAdmin.from("demo_requests").insert({
        owner_name: data.ownerName,
        salon_name: data.salonName,
        phone: data.phone,
        email,
        city: data.city || data.district,
        state: stateRow.name,
        district: districtRow.name,
        address: data.address,
        branches: 1,
        message: data.description ?? null,
        status: "pending",
        created_salon_id: salon.id,
      });

      return { salonId: salon.id as string };
    } catch (err) {
      await cleanup();
      throw err instanceof Error ? err : new Error("Could not submit your demo request.");
    }
  });
