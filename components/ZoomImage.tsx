"use client";

import { useEffect, useState } from "react";

/** Miniature cliquable qui s'ouvre en plein écran (Échap ou clic pour fermer). */
export default function ZoomImage({
  src,
  alt,
  className = ""
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Agrandir : ${alt}`}
        className="group block w-full cursor-zoom-in overflow-hidden"
      >
        <img src={src} alt={alt} className={`${className} transition duration-500 group-hover:scale-105`} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
        >
          <img src={src} alt={alt} className="max-h-full max-w-full rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
}
