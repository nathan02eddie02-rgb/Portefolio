import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/app/actions/profile";
import type { Profile } from "@/lib/types";

export default async function ProfileAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("profile").select("*").eq("id", 1).single();
  const p = data as Profile;

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Profil & Hero</h1>
      <p className="mt-1 text-sm text-muted">Ces champs alimentent le bandeau latéral et la section À propos.</p>

      <form action={updateProfile} className="mt-6 max-w-xl space-y-4">
        <Field label="Nom complet" name="full_name" defaultValue={p?.full_name} />
        <Field label="Titre (ex: Data Analyst & BI Analyst)" name="title" defaultValue={p?.title} />
        <Field label="Accroche courte" name="tagline" defaultValue={p?.tagline} />
        <div>
          <label className="text-xs text-muted">Bio / À propos</label>
          <textarea
            name="bio"
            rows={6}
            defaultValue={p?.bio}
            className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal"
          />
        </div>
        <Field label="Localisation" name="location" defaultValue={p?.location ?? ""} />
        <Field label="Email de contact" name="email" defaultValue={p?.email ?? ""} />
        <Field label="Lien LinkedIn" name="linkedin_url" defaultValue={p?.linkedin_url ?? ""} />
        <Field label="Lien GitHub" name="github_url" defaultValue={p?.github_url ?? ""} />

        <div>
          <label className="text-xs text-muted">Photo / avatar</label>
          <input type="file" name="avatar" accept="image/*" className="mt-1 block text-sm text-muted" />
          {p?.avatar_url && (
            <img src={p.avatar_url} alt="Avatar actuel" className="mt-2 h-16 w-16 rounded-full border border-line object-cover" />
          )}
        </div>
        <div>
          <label className="text-xs text-muted">CV (PDF)</label>
          <input type="file" name="cv" accept="application/pdf" className="mt-1 block text-sm text-muted" />
          {p?.cv_url && <p className="mt-1 text-xs text-muted">Actuel : {p.cv_url}</p>}
        </div>

        <button className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink">Enregistrer</button>
      </form>
    </div>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <div>
      <label className="text-xs text-muted">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal"
      />
    </div>
  );
}
