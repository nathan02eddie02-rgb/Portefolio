import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addArchitecture, deleteArchitecture } from "@/app/actions/architectures";
import type { Architecture } from "@/lib/types";

const input =
  "mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal";

export default async function ArchitecturesAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("architectures").select("*").order("sort_order");
  const items = (data as Architecture[]) ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Modélisation & architectures</h1>
      <p className="mt-1 text-sm text-muted">Schémas en étoile, modèles dimensionnels, pipelines ETL.</p>

      <form action={addArchitecture} className="mt-6 max-w-xl space-y-4">
        <div>
          <label className="text-xs text-muted">Titre</label>
          <input name="title" required className={input} />
        </div>
        <div>
          <label className="text-xs text-muted">Type (ex : Data Warehouse, Pipeline ETL)</label>
          <input name="kind" className={input} />
        </div>
        <div>
          <label className="text-xs text-muted">Description</label>
          <textarea name="description" rows={4} className={input} />
        </div>
        <div>
          <label className="text-xs text-muted">Image du schéma</label>
          <input type="file" name="image" accept="image/*" className="mt-1 block text-sm text-muted" />
        </div>
        <div>
          <label className="text-xs text-muted">Ordre</label>
          <input name="sort_order" type="number" defaultValue={0} className={input} />
        </div>
        <button className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink">Ajouter</button>
      </form>

      <ul className="mt-8 max-w-xl divide-y divide-line">
        {items.map((a) => (
          <li key={a.id} className="flex items-center justify-between py-2 text-sm">
            <span className="flex items-center gap-3 text-text">
              {a.image_url && <img src={a.image_url} alt="" className="h-8 w-12 rounded object-cover" />}
              {a.title} {a.kind && <span className="text-muted">· {a.kind}</span>}
            </span>
            <span className="flex gap-3 text-xs">
              <Link href={`/admin/architectures/${a.id}`} className="text-muted hover:text-signal">Modifier</Link>
              <form action={deleteArchitecture.bind(null, a.id)}>
                <button className="text-muted hover:text-signal">Supprimer</button>
              </form>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
