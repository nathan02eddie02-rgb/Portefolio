import { createClient } from "@/lib/supabase/server";

export default async function AdminHome() {
  const supabase = createClient();
  const [{ count: skills }, { count: projects }, { count: experiences }, { count: education }, { count: certificates }] =
    await Promise.all([
      supabase.from("skills").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("experiences").select("*", { count: "exact", head: true }),
      supabase.from("education").select("*", { count: "exact", head: true }),
      supabase.from("certificates").select("*", { count: "exact", head: true })
    ]);

  const stats = [
    ["Compétences", skills],
    ["Projets", projects],
    ["Expériences", experiences],
    ["Formations", education],
    ["Certificats", certificates]
  ] as const;

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Aperçu</h1>
      <p className="mt-1 text-sm text-muted">Contenu actuellement publié sur le site.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-line p-4">
            <p className="font-display text-2xl text-signal">{value ?? 0}</p>
            <p className="mt-1 text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
