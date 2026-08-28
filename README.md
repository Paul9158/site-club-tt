# Site du club de tennis de table

Site public + espace d'administration pour gérer ton club de tennis de
table, sans jamais toucher au code : équipes, matchs (à venir et passés),
compétitions avec archives photos, et des pages personnalisables (onglets)
que tu peux créer toi-même.

Le site est construit avec **Next.js** (le code) et **Supabase** (la base
de données + les photos + la connexion admin), puis mis en ligne
gratuitement avec **Vercel**.

Ce guide t'accompagne pas à pas, même si tu n'as jamais fait ça. Compte
environ 20 à 30 minutes pour la première mise en ligne.

---

## Étape 1 — Créer ton projet Supabase (la base de données)

1. Va sur [supabase.com](https://supabase.com) et crée un compte gratuit
   (avec Google ou GitHub, c'est le plus rapide).
2. Clique sur **New project**.
   - Donne-lui un nom, par exemple `club-tennis-de-table`.
   - Choisis un mot de passe pour la base de données et **note-le
     quelque part** (tu n'en auras normalement plus besoin après, mais
     mieux vaut le garder).
   - Choisis une région proche de toi (ex: `Europe West (Paris)` ou
     `Europe West (Frankfurt)`).
   - Clique sur **Create new project** et attends 1 à 2 minutes que le
     projet soit prêt.
3. Une fois dans ton projet, ouvre le menu **SQL Editor** (dans la barre
   de gauche), clique sur **New query**.
4. Ouvre le fichier `supabase/schema.sql` (fourni avec ce projet), copie
   tout son contenu, colle-le dans l'éditeur SQL de Supabase, puis clique
   sur **Run** (ou Ctrl/Cmd + Entrée).
   - Cela crée toutes les tables nécessaires (équipes, matchs,
     compétitions, photos, pages, réglages) avec des exemples de
     données de démonstration que tu pourras modifier ou supprimer.
5. Va dans **Project Settings** (icône engrenage) > **API**. Note deux
   informations, tu en auras besoin à l'étape 3 :
   - **Project URL** (ressemble à `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public key** (une longue chaîne de caractères)

### Créer ton compte administrateur

1. Toujours dans Supabase, va dans **Authentication** > **Users**.
2. Clique sur **Add user** > **Create new user**.
3. Renseigne ton email et un mot de passe (au moins 6 caractères). Coche
   **Auto Confirm User** pour ne pas avoir besoin de valider par email.
4. Clique sur **Create user**.

C'est cet email et ce mot de passe qui te serviront à te connecter sur
`/admin/login` une fois le site en ligne. Tu peux créer d'autres comptes
plus tard de la même façon si besoin.

---

## Étape 2 — Tester le site en local (optionnel mais recommandé)

Si tu es à l'aise avec un terminal :

1. Installe les dépendances : `npm install`
2. Copie `.env.example` en `.env.local` et remplis les deux valeurs avec
   celles notées à l'étape 1 :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ta-cle-anon-publique
   ```
3. Lance `npm run dev` puis ouvre [http://localhost:3000](http://localhost:3000).
4. Connecte-toi sur [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   avec le compte créé à l'étape 1 pour commencer à personnaliser le
   contenu (nom du club, logo, couleurs, équipes, matchs...).

Si tu ne veux pas passer par cette étape, tu peux directement déployer en
ligne (étape 3) et faire tes réglages une fois le site accessible sur
internet.

---

## Étape 3 — Mettre le site en ligne avec Vercel (gratuit)

1. Mets ce projet sur GitHub :
   - Crée un compte sur [github.com](https://github.com) si tu n'en as
     pas.
   - Crée un nouveau dépôt (repository), par exemple `site-club-tt`.
   - Envoie les fichiers de ce projet dedans (tu peux glisser-déposer le
     dossier décompressé directement sur la page du dépôt GitHub, ou
     utiliser `git push` si tu connais).
2. Va sur [vercel.com](https://vercel.com) et crée un compte (tu peux te
   connecter directement avec ton compte GitHub, c'est le plus simple).
3. Clique sur **Add New** > **Project**, puis choisis ton dépôt GitHub
   `site-club-tt`.
4. Avant de cliquer sur Deploy, ouvre la section **Environment
   Variables** et ajoute les deux mêmes variables que tout à l'heure :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique sur **Deploy**. Après 1 à 2 minutes, Vercel te donne une
   adresse du type `https://site-club-tt.vercel.app` — ton site est en
   ligne !

Tu pourras plus tard relier un nom de domaine personnalisé (ex:
`www.monclub.fr`) depuis les réglages du projet sur Vercel, dans l'onglet
**Domains**.

---

## Étape 4 — Personnaliser le site depuis l'espace admin

Va sur `https://ton-site.vercel.app/admin/login` et connecte-toi avec le
compte créé à l'étape 1. Depuis le tableau de bord, tu peux tout gérer
sans toucher au code :

- **Équipes** : ajouter/modifier/supprimer les équipes du club.
- **Matchs** : ajouter les prochains matchs, renseigner les scores une
  fois joués (ils basculent alors automatiquement dans "Passés").
- **Compétitions** : créer les compétitions à venir, les archiver après,
  et ajouter des photos pour chacune.
- **Pages / Onglets** : créer de nouveaux onglets pour le menu du site
  (ex: "Le Club", "Horaires d'entraînement", "Partenaires"...), avec du
  texte mis en forme et des photos. Chaque page peut être affichée ou
  non dans le menu, publiée ou mise en brouillon.
- **Réglages du site** : nom du club, logo, couleurs du site, texte de
  présentation, adresse, contact, réseaux sociaux.

Toute modification apparaît immédiatement sur le site public, sans
redéploiement.

---

## Comment fonctionne le site (pour référence)

- `supabase/schema.sql` — le schéma complet de la base de données à
  exécuter une fois dans Supabase.
- `src/app/` — les pages du site (accueil, matchs, compétitions, pages
  personnalisées, espace admin).
- `src/app/admin/` — l'espace d'administration protégé par mot de passe.
- `src/lib/` — la connexion à Supabase et les fonctions de récupération
  de données.
- Les photos sont stockées dans le bucket Supabase `club-photos` (créé
  automatiquement par le script SQL).

## Besoin d'aide ?

- Si une page affiche une erreur après le déploiement, vérifie d'abord
  que les deux variables d'environnement Supabase sont bien renseignées
  sur Vercel (Project Settings > Environment Variables), puis redéploie.
- Si tu n'arrives pas à te connecter à `/admin/login`, vérifie que
  l'utilisateur a bien été créé dans Supabase (Authentication > Users)
  avec "Auto Confirm User" coché.
