export type Profile = {
  id: number;
  full_name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string | null;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  cv_url: string | null;
  avatar_url: string | null;
};

export type Skill = { id: string; category: string; name: string; sort_order: number };

export type Project = {
  id: string;
  title: string;
  summary: string | null;
  problem: string | null;
  method: string | null;
  result: string | null;
  stack: string[];
  image_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  report_url: string | null;
  kpis: string[] | null;
  architecture: string[] | null;
  featured: boolean;
  sort_order: number;
};

export type Experience = {
  id: string;
  title: string;
  organization: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  sort_order: number;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  sort_order: number;
};

export type Certificate = {
  id: string;
  name: string;
  issuer: string | null;
  issued_on: string | null;
  credential_url: string | null;
  badge_url: string | null;
  sort_order: number;
};

export type Architecture = {
  id: string;
  title: string;
  kind: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};
