-- ============================================================================
-- Migration 003 : largeur des blocs, pour construire des mises en page en
-- grille façon "journal" (colonnes côte à côte).
--
-- À exécuter dans Supabase : SQL Editor > New query > coller > Run.
-- ============================================================================

alter table blocks add column if not exists width text not null default 'full'
  check (width in ('full', 'two_thirds', 'half', 'third'));

-- ============================================================================
-- C'est terminé ! Dans l'admin (page d'accueil ou pages/onglets), chaque
-- bloc a maintenant un réglage "Largeur" : Pleine largeur, Deux tiers,
-- Moitié ou Tiers. En mettant par exemple deux blocs "Moitié" à la suite,
-- ils s'affichent côte à côte — de quoi construire des mises en page en
-- grille, comme dans un journal.
-- ============================================================================
