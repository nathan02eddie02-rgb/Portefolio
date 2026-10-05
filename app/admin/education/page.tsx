import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addEducation, deleteEducation } from "@/app/actions/education";
import type { Education } from "@/lib/types";

export default async function EducationAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("education").select("*").order("sort_order");
  const education = (data as Education[]) ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Parcours scolaire</h1>

      <form action={addEducation} className="mt-6 max-w-xl space-y-4">
        <Field label="Diplôme" name="degree" required />
        <Field label="Établissement" name="institution" required />
        <Field label="Localisation" name="location" />
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-muted">Début</label>
            <input type="date" name="start_date" className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted">Fin</label>
            <input type="date" name="end_date" className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted">Description</label>
          <textarea name="description" rows={3} className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
        </div>
        <Field label="Ordre" name="sort_order" type="number" defaultValue={0} />
        <button className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink">Ajouter</button>
      </form>

      <ul className="mt-8 max-w-xl divide-y divide-line">
        {education.map((e) => (
          <li key={e.id} className="flex items-center justify-between py-2 text-sm">
            <span className="text-text">
              {e.degree} <span className="text-muted">· {e.institution}</span>
            </span>
            <span className="flex gap-3 text-xs">
              <Link href={`/admin/education/${e.id}`} className="text-muted hover:text-signal">Modifier</Link>
              <form action={deleteEducation.bind(null, e.id)}>
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
      <input
        name={name}
        required={required}
        type={type}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal"
      />
    </div>
  );
}
