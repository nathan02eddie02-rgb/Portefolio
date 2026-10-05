import { createClient } from "@/lib/supabase/server";
import { updateProject } from "@/app/actions/projects";
import { notFound } from "next/navigation";

const input =
  "mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal";

export default async function EditProject({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: proj } = await supabase.from("projects").select("*").eq("id", params.id).single();
  if (!proj) notFound();

  const update = updateProject.bind(null, params.id);

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Modifier le projet</h1>
      <form action={update} className="mt-6 max-w-xl space-y-4">
        <Field label="Titre" name="title" defaultValue={proj.title} required />
        <Field label="Résumé (1 phrase)" name="summary" defaultValue={proj.summary ?? ""} />
        <Field
          label="Architecture (étapes séparées par des virgules)"
          name="architecture"
          defaultValue={(proj.architecture ?? []).join(", ")}
        />
        <div>
          <label className="text-xs text-muted">KPI du projet (un par ligne, format « Libellé: valeur »)</label>
          <textarea name="kpis" rows={3} defaultValue={(proj.kpis ?? []).join("\n")} className={input} />
        </div>
        <Field label="Problème" name="problem" defaultValue={proj.problem ?? ""} />
        <Field label="Méthode" name="method" defaultValue={proj.method ?? ""} />
        <Field label="Résultat" name="result" defaultValue={proj.result ?? ""} />
        <Field label="Stack (séparée par des virgules)" name="stack" defaultValue={(proj.stack ?? []).join(", ")} />
        <Field label="Lien GitHub" name="repo_url" defaultValue={proj.repo_url ?? ""} />
        <Field label="Lien démo" name="demo_url" defaultValue={proj.demo_url ?? ""} />
        <Field label="Lien du rapport interactif" name="report_url" defaultValue={proj.report_url ?? ""} />

        <div>
          <label className="text-xs text-muted">Image / capture (laisser vide pour garder l'actuelle)</label>
          {proj.image_url && <img src={proj.image_url} alt="" className="mt-2 h-24 w-40 rounded object-cover" />}
          <input type="file" name="image" accept="image/*" className="mt-2 block text-sm text-muted" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="featured" id="featured" defaultChecked={proj.featured} />
          <label htmlFor="featured" className="text-sm text-muted">Mettre en avant</label>
        </div>
        <Field label="Ordre" name="sort_order" type="number" defaultValue={proj.sort_order} />
        <button className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink">Enregistrer</button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  defaultValue
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  defaultValue?: string | number;
}) {
  return (
    <div>
      <label className="text-xs text-muted">{label}</label>
      <input name={name} required={required} type={type} defaultValue={defaultValue} className={input} />
    </div>
  );
}
