-- =========================================================
-- Migration v2 — refonte du portfolio (KPI, architecture, rapports)
-- À exécuter UNE FOIS dans Supabase > SQL Editor
-- =========================================================

-- 1. Nouveaux champs sur les projets
alter table projects add column if not exists kpis text[] default '{}';
alter table projects add column if not exists architecture text[] default '{}';
alter table projects add column if not exists report_url text;

-- 2. Nouvelle table : schémas de modélisation / architectures data
create table if not exists architectures (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text,
  description text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table architectures enable row level security;

drop policy if exists "public read architectures" on architectures;
drop policy if exists "admin write architectures" on architectures;
create policy "public read architectures" on architectures for select using (true);
create policy "admin write architectures" on architectures for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- 3. Contenu d'exemple (à remplacer depuis l'admin)
insert into architectures (title, kind, description, sort_order)
select 'Schéma en étoile — à personnaliser', 'Data Warehouse',
       'Décris ton modèle dimensionnel : table de faits, dimensions, grain, mesures. Ajoute ton schéma depuis l''admin (section Architectures).', 1
where not exists (select 1 from architectures);

update projects
set architecture = array['Sources','ETL Talend','Data Warehouse','Power BI'],
    kpis = array['Volume traité: [X]','Gain de temps: [X]%','Dashboards livrés: [X]']
where title = 'Nom du projet 1' and (architecture is null or architecture = '{}');
