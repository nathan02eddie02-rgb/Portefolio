import { createClient } from "@/lib/supabase/server";
import { updateArchitecture } from "@/app/actions/architectures";
import { notFound } from "next/navigation";

const input =
  "mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal";

export default async function EditArchitecture({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: a } = await supabase.from("architectures").select("*").eq("id", params.id).single();
  if (!a) notFound();

  const update = updateArchitecture.bind(null, params.id);

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Modifier l'architecture</h1>
      <form action={update} className="mt-6 max-w-xl space-y-4">
        <div>
          <label className="text-xs text-muted">Titre</label>
          <input name="title" defaultValue={a.title} required className={input} />
        </div>
        <div>
          <label className="text-xs text-muted">Type</label>
          <input name="kind" defaultValue={a.kind ?? ""} className={input} />
        </div>
        <div>
          <label className="text-xs text-muted">Description</label>
          <textarea name="description" rows={4} defaultValue={a.description ?? ""} className={input} />
        </div>
        <div>
          <label className="text-xs text-muted">Image du schéma (laisser vide pour garder l'actuelle)</label>
          {a.image_url && <img src={a.image_url} alt="" className="mt-2 h-24 w-40 rounded object-cover" />}
          <input type="file" name="image" accept="image/*" className="mt-2 block text-sm text-muted" />
        </div>
        <div>
          <label className="text-xs text-muted">Ordre</label>
          <input name="sort_order" type="number" defaultValue={a.sort_order} className={input} />
        </div>
        <button className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink">Enregistrer</button>
      </form>
    </div>
  );
}
