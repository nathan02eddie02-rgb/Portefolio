import { createClient } from "@/lib/supabase/server";
import { updateEducation } from "@/app/actions/education";
import { notFound } from "next/navigation";

export default async function EditEducation({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: ed } = await supabase.from("education").select("*").eq("id", params.id).single();
  if (!ed) notFound();

  const update = updateEducation.bind(null, params.id);

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Modifier la formation</h1>
      <form action={update} className="mt-6 max-w-xl space-y-4">
        <Field label="Diplôme" name="degree" defaultValue={ed.degree} required />
        <Field label="Établissement" name="institution" defaultValue={ed.institution} required />
        <Field label="Localisation" name="location" defaultValue={ed.location ?? ""} />
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-muted">Début</label>
            <input type="date" name="start_date" defaultValue={ed.start_date ?? ""} className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted">Fin</label>
            <input type="date" name="end_date" defaultValue={ed.end_date ?? ""} className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted">Description</label>
          <textarea name="description" rows={3} defaultValue={ed.description ?? ""} className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
        </div>
        <Field label="Ordre" name="sort_order" type="number" defaultValue={ed.sort_order} />
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
