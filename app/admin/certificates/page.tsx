import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addCertificate, deleteCertificate } from "@/app/actions/certificates";
import type { Certificate } from "@/lib/types";

export default async function CertificatesAdmin() {
  const supabase = createClient();
  const { data } = await supabase.from("certificates").select("*").order("sort_order");
  const certificates = (data as Certificate[]) ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Certificats & badges</h1>

      <form action={addCertificate} className="mt-6 max-w-xl space-y-4">
        <Field label="Nom du certificat" name="name" required />
        <Field label="Organisme émetteur" name="issuer" />
        <div>
          <label className="text-xs text-muted">Date d'obtention</label>
          <input type="date" name="issued_on" className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
        </div>
        <Field label="Lien de vérification" name="credential_url" />
        <div>
          <label className="text-xs text-muted">Badge / logo</label>
          <input type="file" name="badge" accept="image/*" className="mt-1 block text-sm text-muted" />
        </div>
        <Field label="Ordre" name="sort_order" type="number" defaultValue={0} />
        <button className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink">Ajouter</button>
      </form>

      <ul className="mt-8 max-w-xl divide-y divide-line">
        {certificates.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-2 text-sm">
            <span className="flex items-center gap-3 text-text">
              {c.badge_url && <img src={c.badge_url} alt="" className="h-8 w-8 rounded object-contain" />}
              {c.name} {c.issuer && <span className="text-muted">· {c.issuer}</span>}
            </span>
            <span className="flex gap-3 text-xs">
              <Link href={`/admin/certificates/${c.id}`} className="text-muted hover:text-signal">Modifier</Link>
              <form action={deleteCertificate.bind(null, c.id)}>
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
