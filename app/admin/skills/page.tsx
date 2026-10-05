import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addSkill, deleteSkill } from "@/app/actions/skills";
import type { Skill } from "@/lib/types";

export default async function SkillsAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("skills").select("*").order("category").order("sort_order");
  const skills = (data as Skill[]) ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Compétences</h1>

      <form action={addSkill} className="mt-6 flex max-w-xl flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-muted">Catégorie</label>
          <input name="category" required className="mt-1 w-48 rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
        </div>
        <div>
          <label className="text-xs text-muted">Compétence</label>
          <input name="name" required className="mt-1 w-48 rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
        </div>
        <div>
          <label className="text-xs text-muted">Ordre</label>
          <input name="sort_order" type="number" defaultValue={0} className="mt-1 w-20 rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
        </div>
        <button className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink">Ajouter</button>
      </form>

      <ul className="mt-8 max-w-xl divide-y divide-line">
        {skills.map((s) => (
          <li key={s.id} className="flex items-center justify-between py-2 text-sm">
            <span className="text-text">
              {s.name} <span className="text-muted">· {s.category}</span>
            </span>
            <span className="flex gap-3 text-xs">
              <Link href={`/admin/skills/${s.id}`} className="text-muted hover:text-signal">Modifier</Link>
              <form action={deleteSkill.bind(null, s.id)}>
                <button className="text-muted hover:text-signal">Supprimer</button>
              </form>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
