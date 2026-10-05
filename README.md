# Portfolio Data Analyst / BI Analyst — Next.js + Supabase

Site public + espace admin (login email/mot de passe) pour gérer tout le
contenu du portfolio sans toucher au code : profil, compétences, projets,
expérience, formation, certificats.

## 1. Créer le projet Supabase

1. Va sur https://supabase.com → New project.
2. Une fois créé, ouvre **SQL Editor** et exécute tout le contenu de
   `supabase/schema.sql` (tables, contenu par défaut, sécurité RLS, bucket
   de stockage).
3. Va dans **Storage** et vérifie qu'un bucket `portfolio-assets` existe et
   qu'il est **public** (le script le crée normalement automatiquement).
4. Va dans **Authentication → Users → Add user**, crée TON compte admin
   (email + mot de passe). C'est le seul compte qui pourra se connecter à
   `/admin` — il n'y a pas de page d'inscription publique, volontairement.
5. Va dans **Project Settings → API** et récupère :
   - `Project URL`
   - `anon public key`

## 2. Configurer le projet en local

```bash
cp .env.local.example .env.local
# colle ton Project URL et ta clé anon dans .env.local
npm install
npm run dev
```

- Site public : http://localhost:3000
- Admin : http://localhost:3000/admin/login

Le contenu par défaut (compétences génériques, un projet exemple, une
expérience exemple, etc.) est déjà en base grâce au script SQL — modifie ou
supprime-le depuis l'admin.

## 3. Déployer sur Vercel

1. Pousse ce dossier sur un repo GitHub.
2. Sur https://vercel.com → New Project → importe le repo.
3. Dans **Environment Variables**, ajoute :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. C'est tout — le site et l'admin sont sur le même déploiement.

## 4. Ajouter du contenu au fil du temps

Connecte-toi sur `/admin` et utilise les pages :
- **Profil & Hero** — nom, titre, bio, avatar, CV (PDF), liens sociaux
- **Compétences** — ajoute une compétence par catégorie
- **Projets** — titre, problème/méthode/résultat, stack, image, liens démo/code
- **Expérience** — postes avec dates
- **Formation** — diplômes
- **Certificats** — nom, organisme, lien de vérification, badge

Chaque ajout/suppression met à jour le site public immédiatement (pas de
rebuild nécessaire).

## Structure du projet

```
app/
  page.tsx              → site public (lit les données Supabase)
  admin/                → espace admin protégé par middleware.ts
  actions/              → Server Actions (CRUD + auth)
lib/supabase/           → clients Supabase (serveur / navigateur)
supabase/schema.sql     → tables, RLS, contenu par défaut, bucket storage
middleware.ts           → protège /admin/* si non connecté
```

## Prochaines améliorations possibles

- Réordonnancement drag-and-drop des sections (actuellement via le champ "Ordre")
- Édition inline (actuellement : ajout + suppression, pas de modification en place)
- Mode brouillon/publié pour les projets
