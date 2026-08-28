-- ============================================================================
-- Migration 002 : blocs de contenu (texte + photo dans l'ordre que tu veux),
-- page d'accueil personnalisable, ordre des onglets, bandeau vertical.
--
-- À exécuter APRÈS le schema.sql initial : Dashboard Supabase > SQL Editor
-- > New query > coller ce fichier > Run.
-- Cette migration ne supprime aucune donnée existante.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Table générique de "blocs" : un bloc est soit du texte, soit une photo.
--    Utilisée à la fois pour la page d'accueil (owner_type = 'home') et pour
--    chaque page personnalisée (owner_type = 'page', page_id renseigné).
--    L'ordre d'affichage vient de la colonne "position".
-- ----------------------------------------------------------------------------
create table if not exists blocks (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('home', 'page')),
  page_id uuid references pages(id) on delete cascade,
  block_type text not null check (block_type in ('text', 'photo')),
  content text,        -- pour les blocs de type "text" (markdown simple)
  photo_url text,       -- pour les blocs de type "photo"
  caption text,         -- légende optionnelle pour les blocs "photo"
  position int not null default 0,
  created_at timestamptz not null default now(),
  constraint page_id_required_for_page check (
    (owner_type = 'page' and page_id is not null) or
    (owner_type = 'home' and page_id is null)
  )
);

create index if not exists blocks_owner_idx on blocks(owner_type, page_id, position);

alter table blocks enable row level security;

drop policy if exists "public read blocks" on blocks;
create policy "public read blocks" on blocks for select using (true);

drop policy if exists "admin write blocks" on blocks;
create policy "admin write blocks" on blocks for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- 2. Reprise des anciens contenus (pages.content et page_photos) dans le
--    nouveau système de blocs, pour ne rien perdre de ce qui existe déjà.
--    (Si tu n'as encore rien rempli, ces requêtes ne feront rien.)
-- ----------------------------------------------------------------------------
insert into blocks (owner_type, page_id, block_type, content, position)
select 'page', id, 'text', content, 0
from pages
where content is not null and trim(content) <> ''
  and not exists (select 1 from blocks b where b.page_id = pages.id);

insert into blocks (owner_type, page_id, block_type, photo_url, caption, position)
select 'page', pp.page_id, 'photo', pp.photo_url, pp.caption, pp.display_order + 1
from page_photos pp
where not exists (
  select 1 from blocks b
  where b.page_id = pp.page_id and b.photo_url = pp.photo_url
);

-- ----------------------------------------------------------------------------
-- 3. Réglages supplémentaires : afficher/masquer les sections automatiques
--    de l'accueil, et bandeau vertical fixe (logo/texte permanent à gauche).
-- ----------------------------------------------------------------------------
alter table site_settings add column if not exists show_upcoming_matches boolean not null default true;
alter table site_settings add column if not exists show_upcoming_competitions boolean not null default true;
alter table site_settings add column if not exists show_past_matches boolean not null default true;

alter table site_settings add column if not exists sidebar_enabled boolean not null default false;
alter table site_settings add column if not exists sidebar_image_url text;
alter table site_settings add column if not exists sidebar_link_url text;
alter table site_settings add column if not exists sidebar_text text;
alter table site_settings add column if not exists sidebar_background_color text not null default '#0f172a';

-- ============================================================================
-- C'est terminé ! Tu peux maintenant :
-- - Gérer la page d'accueil (blocs + sections) depuis /admin/accueil
-- - Gérer le contenu de chaque page onglet par blocs depuis /admin/pages
-- - Réordonner les onglets depuis /admin/pages (flèches haut/bas)
-- - Activer et configurer le bandeau vertical depuis /admin/reglages
-- ============================================================================
