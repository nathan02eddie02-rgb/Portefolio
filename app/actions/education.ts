"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addEducation(formData: FormData) {
  const supabase = createClient();
  await supabase.from("education").insert({
    degree: String(formData.get("degree") || ""),
    institution: String(formData.get("institution") || ""),
    location: String(formData.get("location") || ""),
    start_date: String(formData.get("start_date") || "") || null,
    end_date: String(formData.get("end_date") || "") || null,
    description: String(formData.get("description") || ""),
    sort_order: Number(formData.get("sort_order") || 0)
  });
  revalidatePath("/");
  revalidatePath("/admin/education");
}

export async function updateEducation(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("education")
    .update({
      degree: String(formData.get("degree") || ""),
      institution: String(formData.get("institution") || ""),
      location: String(formData.get("location") || ""),
      start_date: String(formData.get("start_date") || "") || null,
      end_date: String(formData.get("end_date") || "") || null,
      description: String(formData.get("description") || ""),
      sort_order: Number(formData.get("sort_order") || 0)
    })
    .eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/education");
}

export async function deleteEducation(id: string) {
  const supabase = createClient();
  await supabase.from("education").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/education");
}
