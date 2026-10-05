"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = createClient();

  const payload = {
    full_name: String(formData.get("full_name") || ""),
    title: String(formData.get("title") || ""),
    tagline: String(formData.get("tagline") || ""),
    bio: String(formData.get("bio") || ""),
    location: String(formData.get("location") || ""),
    email: String(formData.get("email") || ""),
    linkedin_url: String(formData.get("linkedin_url") || ""),
    github_url: String(formData.get("github_url") || "")
  };

  // Upload optionnel de l'avatar et/ou du CV
  const avatar = formData.get("avatar") as File | null;
  if (avatar && avatar.size > 0) {
    const path = `avatar-${Date.now()}-${avatar.name}`;
    const { error: upErr } = await supabase.storage
      .from("portfolio-assets")
      .upload(path, avatar, { upsert: true });
    if (!upErr) {
      const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
      (payload as any).avatar_url = data.publicUrl;
    }
  }

  const cv = formData.get("cv") as File | null;
  if (cv && cv.size > 0) {
    const path = `cv-${Date.now()}-${cv.name}`;
    const { error: upErr } = await supabase.storage
      .from("portfolio-assets")
      .upload(path, cv, { upsert: true });
    if (!upErr) {
      const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
      (payload as any).cv_url = data.publicUrl;
    }
  }

  await supabase.from("profile").update(payload).eq("id", 1);
  revalidatePath("/");
  revalidatePath("/admin/profile");
}
