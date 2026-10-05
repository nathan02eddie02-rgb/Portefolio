"use client";

import { useState } from "react";

/**
 * Aperçu interactif d'un rapport (Power BI « publier sur le web », etc.).
 * L'iframe n'est chargée qu'au clic pour ne pas alourdir la page.
 */
export default function ReportEmbed({
  url,
  title,
  imageUrl
}: {
  url: string;
  title: string;
  imageUrl?: string | null;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface2">
      {loaded ? (
        <iframe
          src={url}
          title={title}
          loading="lazy"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="h-[320px] w-full"
        />
      ) : (
        <div className="relative h-[320px] w-full">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-indigo-500/15 to-emerald-500/10">
              <svg className="absolute bottom-0 left-0 h-2/3 w-full opacity-45" viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true">
                <rect x="20" y="70" width="28" height="50" fill="#38BDF8" />
                <rect x="64" y="40" width="28" height="80" fill="#6366F1" />
                <rect x="108" y="58" width="28" height="62" fill="#10B981" />
                <rect x="152" y="22" width="28" height="98" fill="#38BDF8" />
                <rect x="196" y="50" width="28" height="70" fill="#6366F1" />
                <rect x="240" y="30" width="28" height="90" fill="#10B981" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 grid place-items-center bg-ink/30">
            <button type="button" onClick={() => setLoaded(true)} className="btn-primary">
              Charger l'aperçu interactif
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
