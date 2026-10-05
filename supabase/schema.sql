-- =========================================================
-- Schéma du portfolio — à exécuter dans Supabase SQL Editor
-- =========================================================

create table if not exists profile (
  id int primary key default 1,
  full_name text not null default 'Ton Nom',
  title text not null default 'Data Analyst & BI Analyst | IA appliquée',
  tagline text not null default 'Je transforme des données brutes en décisions, avec un peu d''IA en plus.',
  bio text not null default 'Décris ici ton parcours, ta transition vers la data, et ce qui te motive. Modifie ce texte depuis l''admin.',
  location text default 'Ouagadougou, Burkina Faso',
  email text,
  linkedin_url text,
  github_url text,
  cv_url text,
  avatar_url text,
  constraint singleton check (id = 1)
);
insert into profile (id) values (1) on conflict (id) do nothing;

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  problem text,
  method text,
  result text,
  stack text[] default '{}',
  image_url text,
  demo_url text,
  repo_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  location text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  location text,
  start_date date,
  end_date date,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text,
  issued_on date,
  credential_url text,
  badge_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- =========================================================
-- Contenu par défaut (générique) — à modifier depuis l'admin
-- =========================================================
insert into skills (category, name, sort_order) values
  ('Analyse de données', 'SQL', 1),
  ('Analyse de données', 'Python (pandas, numpy)', 2),
  ('Analyse de données', 'Excel avancé', 3),
  ('BI & Visualisation', 'Power BI', 1),
  ('BI & Visualisation', 'Tableau', 2),
  ('BI & Visualisation', 'Looker Studio', 3),
  ('IA & Machine Learning', 'scikit-learn', 1),
  ('IA & Machine Learning', 'Modèles prédictifs', 2),
  ('IA & Machine Learning', 'NLP / RAG', 3),
  ('Outils & Data Engineering', 'Git / GitHub', 1),
  ('Outils & Data Engineering', 'ETL & bases de données', 2),
  ('Outils & Data Engineering', 'Notebooks (Jupyter)', 3)
on conflict do nothing;

insert into projects (title, summary, problem, method, result, stack, featured, sort_order) values
  ('Nom du projet 1', 'Résumé en une phrase de ce que fait le projet.',
   'Quel problème ce projet résout-il ?', 'Quelles données et méthode as-tu utilisées ?',
   'Quel résultat concret (chiffré si possible) ?', array['Python','SQL','Power BI'], true, 1)
on conflict do nothing;

insert into experiences (title, organization, location, description, is_current, sort_order) values
  ('Intitulé du poste', 'Nom de l''organisation', 'Ville, Pays', 'Décris tes responsabilités et résultats.', true, 1)
on conflict do nothing;

insert into education (degree, institution, location, description, sort_order) values
  ('Intitulé du diplôme', 'Nom de l''établissement', 'Ville, Pays', 'Détails optionnels.', 1)
on conflict do nothing;

insert into certificates (name, issuer, sort_order) values
  ('Nom du certificat', 'Organisme émetteur', 1)
on conflict do nothing;

-- =========================================================
-- Row Level Security : lecture publique, écriture réservée aux
-- utilisateurs authentifiés (ton seul compte admin)
-- =========================================================
alter table profile enable row level security;
alter table skills enable row level security;
alter table projects enable row level security;
alter table experiences enable row level security;
alter table education enable row level security;
alter table certificates enable row level security;

create policy "public read profile" on profile for select using (true);
create policy "public read skills" on skills for select using (true);
create policy "public read projects" on projects for select using (true);
create policy "public read experiences" on experiences for select using (true);
create policy "public read education" on education for select using (true);
create policy "public read certificates" on certificates for select using (true);

create policy "admin write profile" on profile for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write skills" on skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write projects" on projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write experiences" on experiences for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write education" on education for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write certificates" on certificates for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =========================================================
-- Storage : buckets pour avatar, CV, images de projets, badges
-- (à créer aussi manuellement dans Supabase > Storage si le SQL
-- ci-dessous ne s'exécute pas selon ton plan Supabase)
-- =========================================================
insert into storage.buckets (id, name, public) values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

create policy "public read assets" on storage.objects for select using (bucket_id = 'portfolio-assets');
create policy "admin write assets" on storage.objects for all using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated') with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');
