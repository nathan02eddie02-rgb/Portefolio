"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "up" | "left" | "right" | "zoom";

/* Un seul écouteur de défilement partagé par tous les éléments Reveal de la page :
   les vérifications sont regroupées une fois par image affichée (requestAnimationFrame). */
const pending = new Set<() => boolean>();
let frame = 0;
let listening = false;

function runChecks() {
  frame = 0;
  pending.forEach((check) => {
    if (check()) pending.delete(check);
  });
  if (pending.size === 0) stopListening();
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(runChecks);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

/**
 * Fait apparaître son contenu quand le défilement l'atteint (une seule fois) :
 * fondu + léger flou qui se dissipe (sur ordinateur) + déplacement selon `variant`.
 * `delay` (ms) permet d'enchaîner les éléments en cascade.
 * Un élément atteint ou déjà dépassé est toujours affiché, même en défilement très rapide.
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

    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        setVisible(true);
        return true;
      }
      return false;
    };

    if (check()) return;
    pending.add(check);
    startListening();
    return () => {
      pending.delete(check);
    };
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
