"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function uploadImage(file: FormDataEntryValue | null): Promise<string | null> {
  const f = file as File | null;
  if (!f || f.size === 0) return null;
  const supabase = createClient();
  const path = `architecture-${Date.now()}-${f.name}`;
  const { error } = await supabase.storage.from("portfolio-assets").upload(path, f);
  if (error) return null;
  return supabase.storage.from("portfolio-assets").getPublicUrl(path).data.publicUrl;
}

function buildPayload(formData: FormData) {
  return {
    title: String(formData.get("title") || ""),
    kind: String(formData.get("kind") || ""),
    description: String(formData.get("description") || ""),
    sort_order: Number(formData.get("sort_order") || 0)
  };
}

export async function addArchitecture(formData: FormData) {
  const supabase = createClient();
  const image_url = await uploadImage(formData.get("image"));
  await supabase.from("architectures").insert({ ...buildPayload(formData), image_url });
  revalidatePath("/");
  revalidatePath("/admin/architectures");
}

export async function updateArchitecture(id: string, formData: FormData) {
  const supabase = createClient();
  const payload: Record<string, unknown> = buildPayload(formData);
  const image_url = await uploadImage(formData.get("image"));
  if (image_url) payload.image_url = image_url;
  await supabase.from("architectures").update(payload).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/architectures");
}

export async function deleteArchitecture(id: string) {
  const supabase = createClient();
  await supabase.from("architectures").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/architectures");
}
