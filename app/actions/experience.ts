"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addExperience(formData: FormData) {
  const supabase = createClient();
  await supabase.from("experiences").insert({
    title: String(formData.get("title") || ""),
    organization: String(formData.get("organization") || ""),
    location: String(formData.get("location") || ""),
    start_date: String(formData.get("start_date") || "") || null,
    end_date: String(formData.get("end_date") || "") || null,
    is_current: formData.get("is_current") === "on",
    description: String(formData.get("description") || ""),
    sort_order: Number(formData.get("sort_order") || 0)
  });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("experiences")
    .update({
      title: String(formData.get("title") || ""),
      organization: String(formData.get("organization") || ""),
      location: String(formData.get("location") || ""),
      start_date: String(formData.get("start_date") || "") || null,
      end_date: String(formData.get("end_date") || "") || null,
      is_current: formData.get("is_current") === "on",
      description: String(formData.get("description") || ""),
      sort_order: Number(formData.get("sort_order") || 0)
    })
    .eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function deleteExperience(id: string) {
  const supabase = createClient();
  await supabase.from("experiences").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/experience");
}
