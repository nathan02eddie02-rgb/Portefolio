import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addProject, deleteProject } from "@/app/actions/projects";
import type { Project } from "@/lib/types";

const input =
  "mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal";

export default async function ProjectsAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("projects").select("*").order("sort_order");
  const projects = (data as Project[]) ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Projets</h1>

      <form action={addProject} className="mt-6 max-w-xl space-y-4">
        <Field label="Titre" name="title" required />
        <Field label="Résumé (1 phrase)" name="summary" />
        <Field
          label="Architecture (étapes séparées par des virgules)"
          name="architecture"
          placeholder="Sources, ETL Talend, Data Warehouse, Power BI"
        />
        <div>
          <label className="text-xs text-muted">KPI du projet (un par ligne, format « Libellé: valeur »)</label>
          <textarea
            name="kpis"
            rows={3}
            placeholder={"Volume traité: 1,2M lignes\nTemps de refresh: -60%\nDashboards livrés: 5"}
            className={input}
          />
        </div>
        <Field label="Problème" name="problem" />
        <Field label="Méthode" name="method" />
        <Field label="Résultat" name="result" />
        <Field label="Stack (séparée par des virgules)" name="stack" placeholder="Power BI, DAX, SQL, Talend" />
        <Field label="Lien GitHub" name="repo_url" />
        <Field label="Lien démo" name="demo_url" />
        <Field label="Lien du rapport interactif (Power BI « publier sur le web »)" name="report_url" />
        <div>
          <label className="text-xs text-muted">Image / capture</label>
          <input type="file" name="image" accept="image/*" className="mt-1 block text-sm text-muted" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="featured" id="featured" />
          <label htmlFor="featured" className="text-sm text-muted">Mettre en avant</label>
        </div>
        <Field label="Ordre" name="sort_order" type="number" defaultValue={0} />
        <button className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink">Ajouter le projet</button>
      </form>

      <ul className="mt-8 max-w-xl divide-y divide-line">
        {projects.map((p) => (
          <li key={p.id} className="flex items-center justify-between py-2 text-sm">
            <span className="flex items-center gap-3 text-text">
              {p.image_url && <img src={p.image_url} alt="" className="h-8 w-12 rounded object-cover" />}
              {p.title}
            </span>
            <span className="flex gap-3 text-xs">
              <Link href={`/admin/projects/${p.id}`} className="text-muted hover:text-signal">Modifier</Link>
              <form action={deleteProject.bind(null, p.id)}>
                <button className="text-muted hover:text-signal">Supprimer</button>
              </form>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  defaultValue,
  placeholder
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-muted">{label}</label>
      <input
        name={name}
        required={required}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={input}
      />
    </div>
  );
}
