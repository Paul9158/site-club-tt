# Site du club de tennis de table

Site public + espace d'administration pour gérer ton club de tennis de
table, sans jamais toucher au code : équipes, matchs (à venir et passés),
compétitions avec archives photos, et des pages personnalisables (onglets)
que tu peux créer toi-même.

Le site est construit avec **Next.js** (le code) et **Supabase** (la base
de données + les photos + la connexion admin), puis mis en ligne
gratuitement avec **Netlify**.

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

## Étape 3 — Mettre le site en ligne avec Netlify (gratuit)

1. Mets ce projet sur GitHub :
   - Crée un compte sur [github.com](https://github.com) si tu n'en as
     pas.
   - Crée un nouveau dépôt (repository), par exemple `site-club-tt`
     (laisse-le vide, sans README).
   - Envoie les fichiers de ce projet dedans (tu peux glisser-déposer le
     dossier décompressé directement sur la page du dépôt GitHub via
     "uploading an existing file", ou utiliser `git push` si tu
     connais).
2. Va sur [app.netlify.com](https://app.netlify.com) et connecte-toi
   (avec ton compte GitHub, c'est le plus simple).
3. Clique sur **Add new site** > **Import an existing project** >
   **Deploy with GitHub**, puis choisis ton dépôt `site-club-tt`.
4. Netlify détecte automatiquement Next.js (grâce au fichier
   `netlify.toml` fourni dans le projet). Avant de cliquer sur Deploy,
   ouvre **Add environment variables** et ajoute les deux mêmes
   variables que tout à l'heure :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique sur **Deploy site**. Après 1 à 2 minutes, Netlify te donne une
   adresse du type `https://nom-au-hasard.netlify.app` — ton site est en
   ligne !

Tu peux renommer cette adresse (Site configuration > General > Site
details > Change site name) et plus tard relier un nom de domaine
personnalisé (ex: `www.monclub.fr`) depuis **Domain management**.

---

## Étape 4 — Personnaliser le site depuis l'espace admin

Va sur `https://ton-site.netlify.app/admin/login` et connecte-toi avec le
compte créé à l'étape 1. Depuis le tableau de bord, tu peux tout gérer
sans toucher au code :

- **Page d'accueil** : choisis quelles sections automatiques afficher
  (prochains matchs, prochaines compétitions, derniers résultats), et
  ajoute ton propre contenu — des blocs de texte et de photo, **dans
  l'ordre que tu veux** (texte puis photo puis texte, etc.), affiché en
  haut de l'accueil.
- **Équipes** : ajouter/modifier/supprimer les équipes du club.
- **Matchs** : ajouter les prochains matchs, renseigner les scores une
  fois joués (ils basculent alors automatiquement dans "Passés").
- **Compétitions** : créer les compétitions à venir, les archiver après,
  et ajouter des photos pour chacune.
- **Pages / Onglets** : créer de nouveaux onglets pour le menu du site
  (ex: "Le Club", "Horaires d'entraînement", "Partenaires"...). Chaque
  page se construit avec des blocs de texte et de photo, dans l'ordre de
  ton choix (flèches ↑ ↓ pour réorganiser). Tu peux aussi réordonner les
  onglets eux-mêmes dans le menu du site, et choisir s'ils sont affichés
  dans le menu et/ou publiés.
- **Réglages du site** : nom du club, logo, couleurs du site, texte de
  présentation, adresse, contact, réseaux sociaux, et le **bandeau
  vertical fixe à gauche** (image + texte + lien, visible sur toutes les
  pages du site — utile pour un sponsor, une affiche, un lien vers les
  réseaux sociaux...).

Toute modification apparaît immédiatement sur le site public, sans
redéploiement.

---

## Mettre à jour le site après une nouvelle version du code

Si je te renvoie un nouveau zip du projet (nouvelle fonctionnalité, correctif...) :

1. S'il y a un nouveau fichier `supabase/migration_XXX....sql`, exécute-le
   d'abord dans Supabase (SQL Editor > New query > coller > Run), comme à
   l'étape 1.
2. Dézippe le nouveau projet.
3. Va sur ton dépôt GitHub, clique **Add file** > **Upload files**, puis
   glisse-dépose à nouveau tout le contenu du dossier extrait. GitHub
   remplace automatiquement les fichiers qui existent déjà et ajoute les
   nouveaux. Clique **Commit changes**.
4. Netlify redéploie automatiquement le site en 1-2 minutes (tu peux
   suivre la progression dans l'onglet **Deploys** de ton site sur
   Netlify).

---

## Comment fonctionne le site (pour référence)

- `supabase/schema.sql` — le schéma initial de la base de données.
- `supabase/migration_002_blocks_and_sidebar.sql` — ajoute les blocs de
  contenu (texte/photo réordonnables), les réglages de l'accueil et le
  bandeau vertical.
- `src/app/(site)/` — les pages publiques du site (accueil, matchs,
  compétitions, pages personnalisées).
- `src/app/admin/` — l'espace d'administration protégé par mot de passe.
- `src/lib/` — la connexion à Supabase et les fonctions de récupération
  de données.
- Les photos sont stockées dans le bucket Supabase `club-photos` (créé
  automatiquement par le script SQL).

## Besoin d'aide ?

- Si une page affiche une erreur après le déploiement, vérifie d'abord
  que les deux variables d'environnement Supabase sont bien renseignées
  sur Netlify (Site configuration > Environment variables), puis redéploie
  (Deploys > Trigger deploy).
- Si tu n'arrives pas à te connecter à `/admin/login`, vérifie que
  l'utilisateur a bien été créé dans Supabase (Authentication > Users)
  avec "Auto Confirm User" coché.
