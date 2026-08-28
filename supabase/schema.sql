-- ============================================================================
-- Schéma de base de données pour le site du club de tennis de table
-- À exécuter dans Supabase : Dashboard > SQL Editor > New query > coller > Run
-- ============================================================================

-- Extension utile pour générer des identifiants uniques
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Réglages généraux du site (nom du club, logo, couleurs, contact...)
--    Une seule ligne dans cette table = les réglages actuels du site.
-- ----------------------------------------------------------------------------
create table if not exists site_settings (
  id int primary key default 1,
  club_name text not null default 'Mon Club de Tennis de Table',
  logo_url text,
  primary_color text not null default '#1d4ed8',
  secondary_color text not null default '#f97316',
  address text,
  contact_email text,
  contact_phone text,
  facebook_url text,
  instagram_url text,
  about_text text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 2. Équipes du club
-- ----------------------------------------------------------------------------
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,              -- ex: "Équipe 1", "Équipe Féminine"
  division text,                   -- ex: "Régionale 2", "Départementale 1"
  color text default '#1d4ed8',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3. Matchs (à venir et joués) par équipe
-- ----------------------------------------------------------------------------
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  opponent text not null,
  is_home boolean not null default true,
  match_date timestamptz not null,
  location text,
  competition_type text default 'Championnat', -- Championnat / Coupe / Amical
  status text not null default 'a_venir',      -- a_venir / joue / reporte / annule
  score_us int,
  score_them int,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists matches_team_idx on matches(team_id);
create index if not exists matches_date_idx on matches(match_date);

-- ----------------------------------------------------------------------------
-- 4. Compétitions (tournois, coupes, événements du club)
-- ----------------------------------------------------------------------------
create table if not exists competitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  start_date date,
  end_date date,
  location text,
  is_upcoming boolean not null default true,
  created_at timestamptz not null default now()
);

-- Photos d'archives liées à une compétition
create table if not exists competition_photos (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid references competitions(id) on delete cascade,
  photo_url text not null,
  caption text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists competition_photos_comp_idx on competition_photos(competition_id);

-- ----------------------------------------------------------------------------
-- 5. Pages / onglets personnalisables (créés depuis l'admin, sans coder)
--    Chaque page a une URL (slug), un titre, un contenu texte, et peut
--    apparaître ou non dans le menu de navigation.
-- ----------------------------------------------------------------------------
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text,              -- texte (markdown simple : titres, gras, listes, liens)
  show_in_nav boolean not null default true,
  nav_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Photos rattachées à une page personnalisée
create table if not exists page_photos (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade,
  photo_url text not null,
  caption text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists page_photos_page_idx on page_photos(page_id);

-- ============================================================================
-- SÉCURITÉ (Row Level Security)
-- Règle simple : tout le monde peut LIRE le contenu publié.
-- Seule une personne connectée (l'administrateur) peut CRÉER / MODIFIER / SUPPRIMER.
-- ============================================================================

alter table site_settings enable row level security;
alter table teams enable row level security;
alter table matches enable row level security;
alter table competitions enable row level security;
alter table competition_photos enable row level security;
alter table pages enable row level security;
alter table page_photos enable row level security;

-- Lecture publique
create policy "public read site_settings" on site_settings for select using (true);
create policy "public read teams" on teams for select using (true);
create policy "public read matches" on matches for select using (true);
create policy "public read competitions" on competitions for select using (true);
create policy "public read competition_photos" on competition_photos for select using (true);
create policy "public read published pages" on pages for select using (is_published = true);
create policy "public read page_photos" on page_photos for select using (true);

-- Écriture réservée aux utilisateurs connectés (l'admin)
create policy "admin write site_settings" on site_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write teams" on teams for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write matches" on matches for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write competitions" on competitions for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write competition_photos" on competition_photos for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write pages" on pages for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all read pages" on pages for select
  using (auth.role() = 'authenticated');
create policy "admin write page_photos" on page_photos for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================================
-- STOCKAGE DES PHOTOS
-- Crée un bucket public "club-photos" pour héberger toutes les images
-- (logo du club, photos de compétitions, photos des pages personnalisées).
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('club-photos', 'club-photos', true)
on conflict (id) do nothing;

create policy "public read club-photos" on storage.objects
  for select using (bucket_id = 'club-photos');

create policy "admin upload club-photos" on storage.objects
  for insert with check (bucket_id = 'club-photos' and auth.role() = 'authenticated');

create policy "admin update club-photos" on storage.objects
  for update using (bucket_id = 'club-photos' and auth.role() = 'authenticated');

create policy "admin delete club-photos" on storage.objects
  for delete using (bucket_id = 'club-photos' and auth.role() = 'authenticated');

-- ============================================================================
-- Quelques données d'exemple pour démarrer (tu pourras tout modifier/supprimer
-- depuis l'espace admin du site une fois en ligne).
-- ============================================================================
insert into teams (name, division, color, display_order) values
  ('Équipe 1', 'Régionale 1', '#1d4ed8', 1),
  ('Équipe 2', 'Départementale 2', '#f97316', 2)
on conflict do nothing;
