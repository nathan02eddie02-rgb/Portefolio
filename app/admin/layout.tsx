import Link from "next/link";
import { logout } from "@/app/actions/auth";

const links = [
  ["/admin", "Aperçu"],
  ["/admin/profile", "Profil & Hero"],
  ["/admin/skills", "Compétences"],
  ["/admin/projects", "Projets"],
  ["/admin/experience", "Expérience"],
  ["/admin/education", "Formation"],
  ["/admin/certificates", "Certificats"]
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl gap-10 px-6 py-8">
      <aside className="w-52 shrink-0">
        <p className="font-display text-lg font-bold text-text">Admin</p>
        <nav className="mt-6 flex flex-col gap-1 text-sm">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-md px-2 py-1.5 text-muted hover:bg-surface hover:text-text">
              {label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="mt-8">
          <button className="text-xs text-muted hover:text-signal">Se déconnecter</button>
        </form>
        <Link href="/" className="mt-2 block text-xs text-muted hover:text-signal">
          Voir le site public
        </Link>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
