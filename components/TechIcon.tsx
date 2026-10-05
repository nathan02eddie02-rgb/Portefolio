import { BRAND_ICONS } from "@/lib/techIcons";

/* Icônes génériques (pas de marque) pour les compétences sans logo officiel. Tracés : lucide (ISC). */
const GENERIC: Record<string, { color: string; paths: string[] }> = {
  sql: {
    color: "#60A5FA",
    paths: ["M3 5a9 3 0 1 0 18 0a9 3 0 1 0 -18 0", "M3 5V19A9 3 0 0 0 21 19V5", "M3 12A9 3 0 0 0 21 12"]
  },
  dw: {
    color: "#34D399",
    paths: [
      "M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z",
      "M6 18h12",
      "M6 14h12",
      "M6 10h12v12H6z"
    ]
  },
  dax: { color: "#FBBF24", paths: ["M18 7V4H6l6 8-6 8h12v-3"] },
  etl: { color: "#A78BFA", paths: ["m16 3 4 4-4 4", "M20 7H4", "m8 21-4-4 4-4", "M4 17h16"] },
  ml: {
    color: "#F472B6",
    paths: ["M16 16h6v6h-6z", "M2 16h6v6H2z", "M9 2h6v6H9z", "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", "M12 12V8"]
  }
};

// Nom saisi dans l'admin → clé d'icône (« g: » = icône générique)
const ALIASES: Record<string, string> = {
  "power bi": "powerbi",
  "microsoft power bi": "powerbi",
  "excel avancé": "excel",
  "microsoft excel": "excel",
  "sql server": "sqlserver",
  "scikit-learn": "scikitlearn",
  sklearn: "scikitlearn",
  "node.js": "nodejs",
  "next.js": "nextjs",
  "git / github": "github",
  "google cloud": "googlecloud",
  gcp: "googlecloud",
  "apache airflow": "airflow",
  "apache spark": "spark",
  pyspark: "spark",
  "apache kafka": "kafka",
  "notebooks (jupyter)": "jupyter",
  "looker studio": "looker",
  "nlp / rag": "openai",
  llm: "openai",
  "apache superset": "superset",
  sql: "g:sql",
  "t-sql": "g:sql",
  "pl/sql": "g:sql",
  dax: "g:dax",
  "power query": "g:dax",
  etl: "g:etl",
  "data warehousing": "g:dw",
  "data warehouse": "g:dw",
  "entrepôt de données": "g:dw",
  "modélisation de données": "g:dw",
  "machine learning": "g:ml",
  "modèles prédictifs": "g:ml"
};

export function resolveIcon(name: string): string | null {
  const n = name.trim().toLowerCase();
  if (ALIASES[n]) return ALIASES[n];
  const compact = n.replace(/[\s.\-_/]/g, "");
  if (BRAND_ICONS[compact]) return compact;
  // « Python (pandas, numpy) » → python ; clés courtes exclues pour éviter les faux positifs
  const brand = Object.keys(BRAND_ICONS).find((k) => k.length >= 4 && n.includes(k));
  if (brand) return brand;
  if (n.includes("warehous") || n.includes("entrepôt")) return "g:dw";
  if (n.includes("machine learning")) return "g:ml";
  return null;
}

/**
 * Logo d'une technologie : logo de marque, icône générique, ou pastille texte (si fallback).
 * size : classes Tailwind de taille (ex. "h-8 w-8").
 */
export function TechIcon({
  name,
  size = "h-8 w-8",
  fallback = true
}: {
  name: string;
  size?: string;
  fallback?: boolean;
}) {
  const key = resolveIcon(name);

  if (key?.startsWith("g:")) {
    const g = GENERIC[key.slice(2)];
    return (
      <svg viewBox="0 0 24 24" className={`tech-icon shrink-0 ${size}`} fill="none" stroke={g.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {g.paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    );
  }

  if (key && BRAND_ICONS[key]) {
    const icon = BRAND_ICONS[key];
    return (
      <svg viewBox="0 0 24 24" className={`tech-icon shrink-0 ${size}`} fill={icon.color} role="img" aria-label={icon.title}>
        <path d={icon.path} />
      </svg>
    );
  }

  if (!fallback) return null;
  const label = name.trim().length <= 4 ? name.trim().toUpperCase() : name.trim().slice(0, 2).toUpperCase();
  return (
    <span className={`tech-icon grid shrink-0 place-items-center rounded-lg bg-white/10 px-1.5 font-mono text-xs font-bold text-slate-200 ${size}`}>
      {label}
    </span>
  );
}

