import { createClient } from "@/lib/supabase/server";
import { updateSkill } from "@/app/actions/skills";
import { notFound } from "next/navigation";

export default async function EditSkill({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: skill } = await supabase.from("skills").select("*").eq("id", params.id).single();
  if (!skill) notFound();

  const update = updateSkill.bind(null, params.id);

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Modifier la compétence</h1>
      <form action={update} className="mt-6 flex max-w-xl flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-muted">Catégorie</label>
          <input name="category" defaultValue={skill.category} required className="mt-1 w-48 rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
        </div>
        <div>
          <label className="text-xs text-muted">Compétence</label>
          <input name="name" defaultValue={skill.name} required className="mt-1 w-48 rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
        </div>
        <div>
          <label className="text-xs text-muted">Ordre</label>
          <input name="sort_order" type="number" defaultValue={skill.sort_order} className="mt-1 w-20 rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
        </div>
        <button className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink">Enregistrer</button>
      </form>
    </div>
  );
}
