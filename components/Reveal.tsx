"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "up" | "left" | "right" | "zoom";

/**
 * Fait apparaître son contenu quand le défilement l'atteint (une seule fois) :
 * fondu + léger flou qui se dissipe + déplacement selon `variant`.
 * `delay` (ms) permet d'enchaîner les éléments en cascade.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up"
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Animations réduites demandées par l'appareil : on affiche tout de suite.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    // Affiché dès que l'élément est atteint (ou déjà dépassé) par le défilement.
    // Plus fiable qu'un simple « est-il visible ? » : un élément traversé trop vite
    // (défilement rapide, appareil lent, clic sur un lien du menu) ne reste jamais caché.
    let frame = 0;
    let done = false;

    const stop = () => {
      done = true;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };

    function check() {
      frame = 0;
      if (done || !el) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        setVisible(true);
        stop();
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(check);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    check();
    return stop;
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={variant}
      data-visible={visible ? "true" : "false"}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}
