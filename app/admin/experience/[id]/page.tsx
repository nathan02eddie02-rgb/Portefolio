import { createClient } from "@/lib/supabase/server";
import { updateExperience } from "@/app/actions/experience";
import { notFound } from "next/navigation";

export default async function EditExperience({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: exp } = await supabase.from("experiences").select("*").eq("id", params.id).single();
  if (!exp) notFound();

  const update = updateExperience.bind(null, params.id);

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Modifier l'expérience</h1>
      <form action={update} className="mt-6 max-w-xl space-y-4">
        <Field label="Intitulé du poste" name="title" defaultValue={exp.title} required />
        <Field label="Organisation" name="organization" defaultValue={exp.organization} required />
        <Field label="Localisation" name="location" defaultValue={exp.location ?? ""} />
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-muted">Début</label>
            <input type="date" name="start_date" defaultValue={exp.start_date ?? ""} className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted">Fin</label>
            <input type="date" name="end_date" defaultValue={exp.end_date ?? ""} className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_current" id="is_current" defaultChecked={exp.is_current} />
          <label htmlFor="is_current" className="text-sm text-muted">Poste actuel</label>
        </div>
        <div>
          <label className="text-xs text-muted">Description</label>
          <textarea name="description" rows={4} defaultValue={exp.description ?? ""} className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
        </div>
        <Field label="Ordre" name="sort_order" type="number" defaultValue={exp.sort_order} />
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
