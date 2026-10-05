import { Fragment } from "react";

const COLORS = [
  "border-sky-400/40 bg-sky-400/10 text-sky-200",
  "border-indigo-400/40 bg-indigo-400/10 text-indigo-200",
  "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  "border-blue-400/40 bg-blue-400/10 text-blue-200"
];

/** Pipeline du projet : Sources → ETL → Data Warehouse → Power BI … */
export default function ArchitectureFlow({ steps }: { steps: string[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Architecture du projet">
      {steps.map((step, i) => (
        <Fragment key={`${step}-${i}`}>
          <span
            className={`step-hover cursor-default rounded-lg border px-3 py-1.5 font-mono text-xs font-medium ${COLORS[i % COLORS.length]}`}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <svg
              className="h-4 w-4 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          )}
        </Fragment>
      ))}
    </div>
  );
}
