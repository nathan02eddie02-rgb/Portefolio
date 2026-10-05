import { login } from "@/app/actions/auth";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form action={login} className="w-full max-w-sm space-y-4">
        <h1 className="font-display text-2xl text-text">Connexion admin</h1>
        {searchParams.error && (
          <p className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-signal">
            {searchParams.error}
          </p>
        )}
        <div>
          <label className="text-xs text-muted">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal"
          />
        </div>
        <div>
          <label className="text-xs text-muted">Mot de passe</label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-signal"
          />
        </div>
        <button className="w-full rounded-md bg-signal px-3 py-2 text-sm font-medium text-ink">
          Se connecter
        </button>
      </form>
    </div>
  );
}
