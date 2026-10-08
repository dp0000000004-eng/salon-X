import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertSuperAdmin(context: { supabase: ReturnType<typeof Object> } & { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "super_admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Access denied. Super Admin access is restricted.");
}

/** Creates a salon-admin account (auth user + profile + role). Super Admin only. */
export const createAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string; password: string; fullName: string; phone?: string; salonId?: string }) => {
    if (!input.email?.includes("@")) throw new Error("A valid email is required.");
    if (!input.password || input.password.length < 8) throw new Error("Password must be at least 8 characters.");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    if (error) throw new Error(error.message);
    const userId = created.user!.id;

    await supabaseAdmin
      .from("profiles")
      .upsert({ id: userId, full_name: data.fullName, phone: data.phone ?? null, email: data.email }, { onConflict: "id" });
    await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "salon_owner" });
    if (data.salonId) {
      await supabaseAdmin.from("salons").update({ owner_id: userId }).eq("id", data.salonId);
    }
    return { id: userId };
  });

/** Sets a new password for an existing admin account. Super Admin only. */
export const resetAdminPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; password: string }) => {
    if (!input.password || input.password.length < 8) throw new Error("Password must be at least 8 characters.");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, { password: data.password });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
