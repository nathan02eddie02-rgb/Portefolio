import { createClient } from "@supabase/supabase-js";

// Client Supabase « lecture publique », sans cookies de session.
// Permet à la page publique d'être générée à l'avance et mise en cache
// (au lieu d'être recalculée à chaque visite). L'admin garde lib/supabase/server.ts.
export function createPublicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
