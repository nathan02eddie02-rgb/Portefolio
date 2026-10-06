"use client";

import { useEffect, useState } from "react";
import SmartImage from "@/components/SmartImage";

/**
 * Miniature cliquable (optimisée) qui s'ouvre en plein écran (Échap ou clic pour fermer).
 * className : taille du cadre (ex. "h-[320px]") ; imgClassName : ajustement de l'image.
 */
export default function ZoomImage({
  src,
  alt,
  className = "",
  imgClassName = "object-cover",
  sizes = "(max-width: 1023px) 100vw, 480px"
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
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
        className={`group relative block w-full cursor-zoom-in overflow-hidden ${className}`}
      >
        <SmartImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={`${imgClassName} transition duration-500 group-hover:scale-105`}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
        >
          {/* image d'origine, chargée seulement à l'ouverture */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="max-h-full max-w-full rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
}
