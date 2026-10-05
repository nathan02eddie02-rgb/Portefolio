import { createClient } from "@/lib/supabase/server";
import { updateCertificate } from "@/app/actions/certificates";
import { notFound } from "next/navigation";

export default async function EditCertificate({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: cert } = await supabase.from("certificates").select("*").eq("id", params.id).single();
  if (!cert) notFound();

  const update = updateCertificate.bind(null, params.id);

  return (
    <div>
      <h1 className="font-display text-2xl text-text">Modifier le certificat</h1>
      <form action={update} className="mt-6 max-w-xl space-y-4">
        <Field label="Nom du certificat" name="name" defaultValue={cert.name} required />
        <Field label="Organisme émetteur" name="issuer" defaultValue={cert.issuer ?? ""} />
        <div>
          <label className="text-xs text-muted">Date d'obtention</label>
          <input type="date" name="issued_on" defaultValue={cert.issued_on ?? ""} className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal" />
        </div>
        <Field label="Lien de vérification" name="credential_url" defaultValue={cert.credential_url ?? ""} />

        <div>
          <label className="text-xs text-muted">Badge / logo (laisser vide pour garder l'actuel)</label>
          {cert.badge_url && <img src={cert.badge_url} alt="" className="mt-2 h-14 w-14 rounded object-contain" />}
          <input type="file" name="badge" accept="image/*" className="mt-2 block text-sm text-muted" />
        </div>

        <Field label="Ordre" name="sort_order" type="number" defaultValue={cert.sort_order} />
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
