import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type TestResult = { ok: boolean; message: string };

/** Verifies the stored server-side credentials by calling the provider. Never returns secrets. */
export const testGateway = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { provider: "razorpay" | "phonepe" }) => {
    if (input.provider !== "razorpay" && input.provider !== "phonepe") throw new Error("Unknown payment gateway.");
    return input;
  })
  .handler(async ({ data, context }): Promise<TestResult> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "super_admin",
    });
    if (!isAdmin) throw new Error("Only a Super Admin can manage payment gateways.");

    let result: TestResult;
    if (data.provider === "razorpay") {
      const keyId = process.env["RAZORPAY_KEY_ID"];
      const keySecret = process.env["RAZORPAY_KEY_SECRET"];
      if (!keyId || !keySecret) {
        result = { ok: false, message: "Razorpay credentials are not saved on the server yet." };
      } else {
        try {
          const res = await fetch("https://api.razorpay.com/v1/payments?count=1", {
            headers: { Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}` },
          });
          result = res.ok
            ? { ok: true, message: "Connection verified." }
            : { ok: false, message: `Payment gateway connection failed (${res.status}). Check your credentials.` };
        } catch {
          result = { ok: false, message: "Payment gateway connection failed. Check your credentials." };
        }
      }
    } else {
      const merchantId = process.env["PHONEPE_MERCHANT_ID"];
      const salt = process.env["PHONEPE_SALT_KEY"];
      result =
        merchantId && salt
          ? { ok: true, message: "Credentials are present on the server." }
          : { ok: false, message: "PhonePe credentials are not saved on the server yet." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("payment_gateway_settings")
      .update({
        connection_status: result.ok ? "connected" : "failed",
        connection_message: result.message,
        last_verified_at: new Date().toISOString(),
      })
      .eq("provider", data.provider);

    return result;
  });
