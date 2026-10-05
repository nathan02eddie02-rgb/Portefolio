"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCertificate(formData: FormData) {
  const supabase = createClient();

  let badge_url: string | null = null;
  const badge = formData.get("badge") as File | null;
  if (badge && badge.size > 0) {
    const path = `badge-${Date.now()}-${badge.name}`;
    const { error } = await supabase.storage.from("portfolio-assets").upload(path, badge);
    if (!error) {
      badge_url = supabase.storage.from("portfolio-assets").getPublicUrl(path).data.publicUrl;
    }
  }

  await supabase.from("certificates").insert({
    name: String(formData.get("name") || ""),
    issuer: String(formData.get("issuer") || ""),
    issued_on: String(formData.get("issued_on") || "") || null,
    credential_url: String(formData.get("credential_url") || ""),
    badge_url,
    sort_order: Number(formData.get("sort_order") || 0)
  });

  revalidatePath("/");
  revalidatePath("/admin/certificates");
}

export async function updateCertificate(id: string, formData: FormData) {
  const supabase = createClient();

  const payload: Record<string, unknown> = {
    name: String(formData.get("name") || ""),
    issuer: String(formData.get("issuer") || ""),
    issued_on: String(formData.get("issued_on") || "") || null,
    credential_url: String(formData.get("credential_url") || ""),
    sort_order: Number(formData.get("sort_order") || 0)
  };

  const badge = formData.get("badge") as File | null;
  if (badge && badge.size > 0) {
    const path = `badge-${Date.now()}-${badge.name}`;
    const { error } = await supabase.storage.from("portfolio-assets").upload(path, badge);
    if (!error) {
      payload.badge_url = supabase.storage.from("portfolio-assets").getPublicUrl(path).data.publicUrl;
    }
  }

  await supabase.from("certificates").update(payload).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/certificates");
}

export async function deleteCertificate(id: string) {
  const supabase = createClient();
  await supabase.from("certificates").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/certificates");
}
