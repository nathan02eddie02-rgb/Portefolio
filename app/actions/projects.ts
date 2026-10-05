"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const splitComma = (v: FormDataEntryValue | null) =>
  String(v || "").split(",").map((s) => s.trim()).filter(Boolean);

const splitLines = (v: FormDataEntryValue | null) =>
  String(v || "").split("\n").map((s) => s.trim()).filter(Boolean);

async function uploadImage(file: FormDataEntryValue | null, prefix: string): Promise<string | null> {
  const f = file as File | null;
  if (!f || f.size === 0) return null;
  const supabase = createClient();
  const path = `${prefix}-${Date.now()}-${f.name}`;
  const { error } = await supabase.storage.from("portfolio-assets").upload(path, f);
  if (error) return null;
  return supabase.storage.from("portfolio-assets").getPublicUrl(path).data.publicUrl;
}

function buildPayload(formData: FormData) {
  return {
    title: String(formData.get("title") || ""),
    summary: String(formData.get("summary") || ""),
    problem: String(formData.get("problem") || ""),
    method: String(formData.get("method") || ""),
    result: String(formData.get("result") || ""),
    stack: splitComma(formData.get("stack")),
    architecture: splitComma(formData.get("architecture")),
    kpis: splitLines(formData.get("kpis")),
    demo_url: String(formData.get("demo_url") || ""),
    repo_url: String(formData.get("repo_url") || ""),
    report_url: String(formData.get("report_url") || ""),
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") || 0)
  };
}

export async function addProject(formData: FormData) {
  const supabase = createClient();
  const image_url = await uploadImage(formData.get("image"), "project");
  await supabase.from("projects").insert({ ...buildPayload(formData), image_url });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = createClient();
  const payload: Record<string, unknown> = buildPayload(formData);
  const image_url = await uploadImage(formData.get("image"), "project");
  if (image_url) payload.image_url = image_url;
  await supabase.from("projects").update(payload).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
