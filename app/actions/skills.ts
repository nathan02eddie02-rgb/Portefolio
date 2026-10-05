"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addSkill(formData: FormData) {
  const supabase = createClient();
  await supabase.from("skills").insert({
    category: String(formData.get("category") || ""),
    name: String(formData.get("name") || ""),
    sort_order: Number(formData.get("sort_order") || 0)
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function updateSkill(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("skills")
    .update({
      category: String(formData.get("category") || ""),
      name: String(formData.get("name") || ""),
      sort_order: Number(formData.get("sort_order") || 0)
    })
    .eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function deleteSkill(id: string) {
  const supabase = createClient();
  await supabase.from("skills").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/skills");
}
