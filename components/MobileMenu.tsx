"use client";

import { useState } from "react";

export default function MobileMenu({ items }: { items: readonly (readonly [string, string])[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md border border-line"
      >
        <span className={`h-px w-4 bg-text transition ${open ? "translate-y-[3px] rotate-45" : ""}`} />
        <span className={`h-px w-4 bg-text transition ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border border-line bg-surface p-2 shadow-xl shadow-black/30">
          {items.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-surface2 hover:text-text"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
