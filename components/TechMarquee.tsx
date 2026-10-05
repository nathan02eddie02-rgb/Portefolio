import { TechIcon } from "@/components/TechIcon";

/** Deux rangées (technologies différentes sur chacune, comme la référence), répétées pour boucler. */
function buildRows(names: string[]) {
  const unique = Array.from(new Set(names.map((n) => n.trim()))).filter(Boolean);
  if (unique.length === 0) return [];
  const rowCount = unique.length >= 6 ? 2 : 1;
  const rows: string[][] = Array.from({ length: rowCount }, () => []);
  unique.forEach((n, i) => rows[i % rowCount].push(n));
  return rows.map((row) => {
    let list = row;
    while (list.length < 6) list = [...list, ...row];
    return list;
  });
}

export default function TechMarquee({ names }: { names: string[] }) {
  const rows = buildRows(names);
  if (rows.length === 0) return null;

  return (
    <div className="space-y-2">
      {rows.map((list, r) => (
        <div
          key={r}
          className="marquee-row overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        >
          <div
            className={`marquee-track flex w-max items-center ${r % 2 === 1 ? "marquee-track--reverse" : ""}`}
            style={{ "--dur": `${34 + r * 8}s` } as React.CSSProperties}
          >
            {[...list, ...list].map((name, i) => (
              <div key={`${name}-${i}`} className="tech-pill" title={name}>
                <TechIcon name={name} />
                <span className="tech-name whitespace-nowrap text-lg font-semibold">{name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
