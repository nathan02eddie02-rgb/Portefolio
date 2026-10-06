import { createClient } from "@/lib/supabase/server";
import type {
  Certificate,
  Education,
  Experience,
  Profile,
  Project,
  Skill
} from "@/lib/types";
import Reveal from "@/components/Reveal";
import TechMarquee from "@/components/TechMarquee";
import MobileMenu from "@/components/MobileMenu";
import ArchitectureFlow from "@/components/ArchitectureFlow";
import ReportEmbed from "@/components/ReportEmbed";
import ZoomImage from "@/components/ZoomImage";
import HeroDashboardBg from "@/components/HeroDashboardBg";
import { TechIcon } from "@/components/TechIcon";

export const revalidate = 0;

// Nombre maximum de technologies dans le bandeau défilant, et de badges dans le hero.
const MAX_TECH = 12;
const MAX_HERO_BADGES = 5;

const NAV = [
  ["about", "À propos"],
  ["stack", "Technologies"],
  ["projects", "Projets"],
  ["parcours", "Parcours"],
  ["certificates", "Certificats"],
  ["contact", "Contact"]
] as const;

const ACCENTS = [
  { bar: "bg-sky-400", title: "text-sky-300" },
  { bar: "bg-indigo-400", title: "text-indigo-300" },
  { bar: "bg-emerald-400", title: "text-emerald-300" },
  { bar: "bg-amber-400", title: "text-amber-300" }
] as const;

// Icônes des cartes « À propos » (tracés lucide, ISC)
const INFO_ICONS = {
  location: ["M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0", "M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"],
  email: ["M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z", "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"],
  linkedin: ["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z", "M2 9h4v12H2z", "M2 4a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"],
  cv: ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4", "M12 18v-6", "m9 15 3 3 3-3"]
} as const;

function InfoIcon({ paths }: { paths: readonly string[] }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function formatRange(start: string | null, end: string | null, current: boolean) {
  const fmt = (d: string) =>
    new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric" }).format(new Date(d));
  const startLabel = start ? fmt(start) : "";
  const endLabel = current ? "présent" : end ? fmt(end) : "";
  return [startLabel, endLabel].filter(Boolean).join(" — ");
}

// "Volume traité: 1,2M lignes" → { label: "Volume traité", value: "1,2M lignes" }
function parseKpi(raw: string) {
  const i = raw.indexOf(":");
  if (i === -1) return { label: raw.trim(), value: "" };
  return { label: raw.slice(0, i).trim(), value: raw.slice(i + 1).trim() };
}

// Choisit au plus `max` technologies en piochant à tour de rôle dans chaque catégorie.
function pickBalanced(byCategory: Record<string, Skill[]>, max: number) {
  const queues = Object.values(byCategory).map((items) => [...items]);
  const picked: string[] = [];
  while (picked.length < max && queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift();
      if (next && !picked.includes(next.name) && picked.length < max) picked.push(next.name);
    }
  }
  return picked;
}

function SectionHeading({ title, subtitle, center = true }: { title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 className="section-title font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-muted">{subtitle}</p>}
    </div>
  );
}

export default async function Home() {
  const supabase = createClient();

  const [
    { data: profile },
    { data: skills },
    { data: projects },
    { data: experiences },
    { data: education },
    { data: certificates }
  ] = await Promise.all([
    supabase.from("profile").select("*").eq("id", 1).single(),
    supabase.from("skills").select("*").order("category").order("sort_order"),
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("experiences").select("*").order("sort_order"),
    supabase.from("education").select("*").order("sort_order"),
    supabase.from("certificates").select("*").order("sort_order")
  ]);

  const p = (profile as Profile) ?? null;
  const allSkills = (skills as Skill[]) ?? [];
  const projectList = (projects as Project[]) ?? [];
  const experienceList = (experiences as Experience[]) ?? [];
  const educationList = (education as Education[]) ?? [];
  const certificateList = (certificates as Certificate[]) ?? [];

  const skillsByCategory = allSkills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});
  const uniqueSkillNames = Array.from(new Set(allSkills.map((s) => s.name)));
  const techNames = pickBalanced(skillsByCategory, MAX_TECH);
  const heroTools = techNames.slice(0, MAX_HERO_BADGES);

  const bioParagraphs = (p?.bio ?? "")
    .split(/\n\s*\n/)
    .map((t) => t.trim())
    .filter(Boolean);

  const infoCards = [
    p?.location && { key: "location", label: "Localisation", value: p.location, href: null as string | null },
    p?.email && { key: "email", label: "Email", value: p.email, href: `mailto:${p.email}` },
    p?.linkedin_url && { key: "linkedin", label: "LinkedIn", value: "Voir mon profil", href: p.linkedin_url },
    p?.cv_url && { key: "cv", label: "Curriculum vitæ", value: "Télécharger le PDF", href: p.cv_url }
  ].filter(Boolean) as { key: keyof typeof INFO_ICONS; label: string; value: string; href: string | null }[];

  const stats = [
    [projectList.length, "Projets"],
    [uniqueSkillNames.length, "Technologies"],
    [certificateList.length, "Certifications"]
  ] as const;

  return (
    <div className="w-full">
      {/* ================= Navigation ================= */}
      <header className="sticky top-0 z-40 w-full border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="container-x flex items-center justify-between py-4">
          <a href="#top" className="font-display text-base font-bold tracking-tight text-text">
            {p?.full_name ?? "Portfolio"}
          </a>
          <nav className="hidden items-center gap-7 text-sm lg:flex">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="link-underline text-muted transition hover:text-text">
                {label}
              </a>
            ))}
            {p?.cv_url && (
              <a href={p.cv_url} target="_blank" className="btn-ghost !px-4 !py-1.5 !text-xs">
                CV
              </a>
            )}
          </nav>
          <MobileMenu items={NAV} />
        </div>
      </header>

      {/* ================= Hero ================= */}
      <section id="top" className="relative w-full overflow-hidden border-b border-line">
        <div className="aurora" aria-hidden="true" />
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <HeroDashboardBg />

        <div className="container-x relative grid items-center gap-14 py-24 lg:grid-cols-[1.35fr_1fr] lg:py-32">
          <div>
            <p
              className="fade-up inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-sm font-medium text-slate-200"
              style={{ animationDelay: "0ms" }}
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              {p?.full_name}
            </p>

            <h1
              className="fade-up mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "100ms" }}
            >
              <span className="gradient-text">{p?.title}</span>
            </h1>

            <p
              className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-slate-300"
              style={{ animationDelay: "200ms" }}
            >
              {p?.tagline}
            </p>

            {heroTools.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2.5">
                {heroTools.map((tool, i) => (
                  <span
                    key={tool}
                    className="badge-float glass rounded-full px-4 py-1.5 text-sm font-medium text-slate-200"
                    style={{ animationDelay: `${i * 350}ms` }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}

            <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: "320ms" }}>
              {p?.cv_url && (
                <a href={p.cv_url} target="_blank" className="btn-primary">
                  Télécharger mon CV
                </a>
              )}
              <a href="#projects" className="btn-ghost">
                Voir mes projets
              </a>
              <a href="#contact" className="btn-ghost">
                Me contacter
              </a>
            </div>
          </div>

          {/* Carte profil */}
          <div className="fade-up glass rounded-3xl p-6" style={{ animationDelay: "250ms" }}>
            {p?.avatar_url && (
              <div className="avatar-frame mx-auto mb-6 w-full max-w-[23rem] rounded-3xl bg-gradient-to-br from-sky-400 via-indigo-400 to-emerald-400 p-[3px]">
                <img
                  src={p.avatar_url}
                  alt={p.full_name}
                  className="aspect-square w-full rounded-[21px] object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-3 gap-3 text-center">
              {stats.map(([value, label]) => (
                <div key={label} className="tile-hover cursor-default rounded-xl border border-line bg-ink/40 px-2 py-4">
                  <p className="gradient-text font-display text-3xl font-bold">{value}</p>
                  <p className="mt-1 text-xs text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= À propos (centré) ================= */}
      <section id="about" className="w-full border-b border-line">
        <div className="container-x py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="section-title font-display text-3xl font-bold tracking-tight sm:text-4xl">À propos</h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" />
            </Reveal>
            {bioParagraphs.map((para, i) => (
              <Reveal key={i} delay={150 + i * 150}>
                <p
                  className={
                    i === 0
                      ? "mt-8 text-xl leading-relaxed text-text"
                      : "mt-5 text-base leading-relaxed text-slate-300"
                  }
                >
                  {para}
                </p>
              </Reveal>
            ))}
          </div>

          {infoCards.length > 0 && (
            <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {infoCards.map((card, i) => {
                const content = (
                  <>
                    <span className="info-icon grid h-12 w-12 place-items-center rounded-2xl bg-sky-400/10 text-sky-300">
                      <InfoIcon paths={INFO_ICONS[card.key]} />
                    </span>
                    <span className="text-sm text-muted">{card.label}</span>
                    <span
                      className={`font-medium text-text transition-colors [overflow-wrap:anywhere] group-hover:text-pbi ${
                        card.key === "email" ? "text-sm" : ""
                      }`}
                    >
                      {card.value}
                    </span>
                  </>
                );
                const cls = "group glass glass-hover flex h-full flex-col items-center gap-2 rounded-2xl p-6 text-center";
                return (
                  <Reveal key={card.key} delay={i * 130} variant="zoom">
                    {card.href ? (
                      <a href={card.href} target="_blank" className={cls}>
                        {content}
                      </a>
                    ) : (
                      <div className={cls}>{content}</div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= Technologies ================= */}
      <section id="stack" className="band-tech relative w-full overflow-hidden border-b border-line">
        <div className="container-x pt-20">
          <Reveal>
            <SectionHeading
              center
              title="Outils & technologies"
              subtitle="Les outils que j'utilise dans mes stages et mes projets."
            />
          </Reveal>
        </div>

        {techNames.length > 0 && (
          <div className="mt-8 pb-20">
            <TechMarquee names={techNames} />
          </div>
        )}
      </section>

      {/* ================= Compétences par domaine : fiche technique ================= */}
      <section id="skills" className="w-full border-b border-line">
        <div className="container-x py-24">
          <Reveal>
            <SectionHeading title="Compétences par domaine" />
          </Reveal>

          <div className="glass mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl">
            {Object.entries(skillsByCategory).map(([category, items], i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <Reveal key={category} delay={i * 140} variant="right" className="border-b border-line last:border-b-0">
                  <div className="group relative grid gap-4 px-7 py-6 transition-colors hover:bg-white/[0.03] sm:grid-cols-[14rem_minmax(0,1fr)] sm:items-center">
                    <span
                      className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${accent.bar} opacity-50 transition-all duration-300 group-hover:inset-y-0 group-hover:opacity-100`}
                    />
                    <div>
                      <h3 className={`font-display text-lg font-semibold ${accent.title}`}>{category}</h3>
                      <p className="mt-0.5 text-sm text-muted">
                        {items.length} compétence{items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {items.map((sk) => (
                        <span
                          key={sk.id}
                          className="chip-hover inline-flex cursor-default items-center gap-2 rounded-xl border border-line bg-ink/50 px-3.5 py-2 text-sm font-medium text-slate-200"
                        >
                          <TechIcon name={sk.name} size="h-5 w-5" fallback={false} />
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= Projets de bout en bout ================= */}
      <section id="projects" className="w-full border-b border-line bg-surface2/60">
        <div className="container-x py-24">
          <Reveal>
            <SectionHeading
              title="Projets de bout en bout"
              subtitle="Du jeu de données brut au tableau de bord décisionnel : sources, ETL, entrepôt de données, restitution."
            />
          </Reveal>

          <div className="mt-12 space-y-8">
            {projectList.map((proj, i) => {
              const kpis = (proj.kpis ?? []).map(parseKpi);
              const steps = proj.architecture ?? [];
              const hasPreview = Boolean(proj.report_url || proj.image_url);

              return (
                <Reveal key={proj.id} delay={i * 120}>
                  <article className="glass glass-hover overflow-hidden rounded-3xl">
                    <div className={`grid gap-8 p-7 ${hasPreview ? "lg:grid-cols-5" : ""}`}>
                      <div className={hasPreview ? "lg:col-span-3" : ""}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="font-display text-xl font-bold text-text">{proj.title}</h3>
                          <div className="flex gap-2">
                            {proj.repo_url && (
                              <a href={proj.repo_url} target="_blank" className="btn-ghost !px-3.5 !py-1.5 !text-xs">
                                GitHub
                              </a>
                            )}
                            {proj.demo_url && (
                              <a href={proj.demo_url} target="_blank" className="btn-ghost !px-3.5 !py-1.5 !text-xs">
                                Démo
                              </a>
                            )}
                            {proj.report_url && (
                              <a href={proj.report_url} target="_blank" className="btn-primary !px-3.5 !py-1.5 !text-xs">
                                Rapport interactif
                              </a>
                            )}
                          </div>
                        </div>

                        {proj.summary && <p className="mt-3 text-base leading-relaxed text-slate-300">{proj.summary}</p>}

                        {steps.length > 0 && (
                          <div className="mt-5">
                            <p className="mb-2 text-sm font-medium text-muted">Architecture</p>
                            <ArchitectureFlow steps={steps} />
                          </div>
                        )}

                        {kpis.length > 0 && (
                          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {kpis.map((k, idx) => (
                              <Reveal key={`${k.label}-${idx}`} delay={250 + idx * 120} variant="zoom">
                              <div className="tile-hover h-full cursor-default rounded-xl border border-line bg-ink/40 p-3.5">
                                {k.value ? (
                                  <>
                                    <p className="gradient-text font-display text-xl font-bold leading-tight">{k.value}</p>
                                    <p className="mt-1 text-xs text-muted">{k.label}</p>
                                  </>
                                ) : (
                                  <p className="text-sm text-slate-300">{k.label}</p>
                                )}
                              </div>
                              </Reveal>
                            ))}
                          </div>
                        )}

                        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
                          {proj.problem && (
                            <div>
                              <dt className="font-semibold text-sky-300">Problème</dt>
                              <dd className="mt-1 leading-relaxed text-muted">{proj.problem}</dd>
                            </div>
                          )}
                          {proj.method && (
                            <div>
                              <dt className="font-semibold text-indigo-300">Méthode</dt>
                              <dd className="mt-1 leading-relaxed text-muted">{proj.method}</dd>
                            </div>
                          )}
                          {proj.result && (
                            <div>
                              <dt className="font-semibold text-emerald-300">Résultat</dt>
                              <dd className="mt-1 leading-relaxed text-muted">{proj.result}</dd>
                            </div>
                          )}
                        </dl>

                        {proj.stack?.length > 0 && (
                          <div className="mt-6 flex flex-wrap gap-2">
                            {proj.stack.map((t) => (
                              <span
                                key={t}
                                className="chip-hover cursor-default rounded-md border border-line bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {hasPreview && (
                        <Reveal delay={200} variant="right" className="lg:col-span-2">
                          {proj.report_url ? (
                            <ReportEmbed url={proj.report_url} title={proj.title} imageUrl={proj.image_url} />
                          ) : (
                            <div className="overflow-hidden rounded-xl border border-line">
                              <ZoomImage src={proj.image_url!} alt={proj.title} className="h-[320px] w-full object-cover" />
                            </div>
                          )}
                        </Reveal>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= Parcours ================= */}
      <section id="parcours" className="w-full border-b border-line bg-surface2/60">
        <div className="container-x py-24">
          <Reveal>
            <SectionHeading title="Expérience & formation" />
          </Reveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            {(
              [
                [
                  "Expérience",
                  experienceList.map((e) => ({
                    id: e.id,
                    title: e.title,
                    org: e.organization,
                    range: formatRange(e.start_date, e.end_date, e.is_current),
                    desc: e.description
                  }))
                ],
                [
                  "Formation",
                  educationList.map((e) => ({
                    id: e.id,
                    title: e.degree,
                    org: e.institution,
                    range: formatRange(e.start_date, e.end_date, false),
                    desc: e.description
                  }))
                ]
              ] as const
            ).map(([heading, items]) => (
              <div key={heading}>
                <Reveal>
                  <h3 className="font-display text-xl font-semibold text-text">{heading}</h3>
                </Reveal>
                <div className="relative mt-6 space-y-5 border-l-2 border-line pl-6">
                  {items.map((it, idx) => (
                    <Reveal key={it.id} delay={idx * 150} variant={heading === "Expérience" ? "left" : "right"}>
                    <div className="group glass glass-hover relative rounded-2xl p-5">
                      <span className="absolute -left-[33px] top-6 h-3 w-3 rounded-full bg-gradient-to-br from-sky-400 to-indigo-400 ring-4 ring-ink transition duration-300 group-hover:scale-[1.7]" />
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-semibold text-text transition-colors group-hover:text-pbi">{it.title}</h4>
                        <span className="text-xs font-medium text-muted">{it.range}</span>
                      </div>
                      <p className="mt-0.5 text-sm font-medium text-sky-300">{it.org}</p>
                      {it.desc && <p className="mt-2 text-sm leading-relaxed text-muted">{it.desc}</p>}
                    </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Certificats ================= */}
      <section id="certificates" className="w-full border-b border-line">
        <div className="container-x py-24">
          <Reveal>
            <SectionHeading title="Certificats & badges" />
          </Reveal>
          <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-4">
            {certificateList.map((c, i) => (
              <Reveal key={c.id} delay={i * 100} variant="zoom" className="w-[calc(50%-0.5rem)] sm:w-56">
                <a
                  href={c.credential_url || undefined}
                  target="_blank"
                  className="group glass glass-hover flex h-full flex-col items-center gap-3 rounded-2xl p-5 text-center"
                >
                  {c.badge_url ? (
                    <img
                      src={c.badge_url}
                      alt={c.name}
                      className="h-14 w-14 object-contain transition duration-300 group-hover:-rotate-6 group-hover:scale-125"
                    />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-sky-500/25 to-indigo-500/25 font-mono text-xs font-semibold text-sky-100 transition duration-300 group-hover:-rotate-6 group-hover:scale-125">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-text transition-colors group-hover:text-pbi">{c.name}</p>
                    {c.issuer && <p className="mt-1 text-xs text-muted">{c.issuer}</p>}
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Contact ================= */}
      <section id="contact" className="relative w-full overflow-hidden">
        <div className="aurora" aria-hidden="true" />
        <div className="container-x relative py-28 text-center">
          <Reveal>
            <h2 className="section-title mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Transformons vos données en décisions.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-slate-300">
              Ouvert aux opportunités en analyse de données et Business Intelligence.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              {p?.email && (
                <a href={`mailto:${p.email}`} className="btn-primary">
                  {p.email}
                </a>
              )}
              {p?.linkedin_url && (
                <a href={p.linkedin_url} target="_blank" className="btn-ghost">
                  LinkedIn
                </a>
              )}
              {p?.github_url && (
                <a href={p.github_url} target="_blank" className="btn-ghost">
                  GitHub
                </a>
              )}
            </div>
          </Reveal>
        </div>
        <div className="relative border-t border-line py-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} {p?.full_name}
        </div>
      </section>
    </div>
  );
}
