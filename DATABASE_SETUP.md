# 🗄️ Guide d'Activation de la Base de Données Vercel Postgres (Neon)
## Routini eWorld MLM — Version 4 (Cosmétiques & Soins d'Excellence)

L'architecture de base de données de Routini eWorld est optimisée pour **Neon Serverless Postgres**, le partenaire officiel et natif de Vercel pour les bases de données SQL.

---

## 🏆 Pourquoi Neon Serverless Postgres est le meilleur choix sur Vercel ?

1. **Intégration Native Vercel :** Connexion en 1 clic directement dans votre tableau de bord Vercel (onglet *Storage*).
2. **Architecture Serverless (Scale-to-Zero) :** 
   - Démarre en quelques millisecondes à la demande via le driver HTTP ultra-rapide.
   - Ne consomme rien lorsqu'il n'y a pas de trafic.
   - Tier gratuit généreux inclus (512 Mo de stockage, bande passante importante).
3. **Parfait pour le MLM & E-Commerce :**
   - Schéma relationnel strict (ACID) pour garantir l'intégrité des calculs de PV, CV, commissions N1/N2/N3 et portefeuilles distributeurs.
   - Support des requêtes hiérarchiques récursives (arbres généalogiques descendants).
4. **Zéro Rupture de Service (Dual-Persistence) :**
   - L'application fonctionne immédiatement en mode local (`localStorage`) avec les 51 membres du réseau.
   - Dès que Neon Postgres est relié sur Vercel, la synchronisation Cloud s'active automatiquement avec indicateur en direct dans l'interface Direction Générale.

---

## 🚀 Activation en 3 Étapes Simples (2 minutes)

### Étape 1 : Créer la base dans votre projet Vercel
1. Rendez-vous sur votre compte [vercel.com](https://vercel.com) et ouvrez votre projet **routini-eworld-mlm**.
2. Cliquez sur l'onglet **Storage** dans le menu supérieur du projet.
3. Cliquez sur le bouton **Create Database** (ou *Connect Store*).
4. Sélectionnez **Neon (Postgres)** dans la liste.
5. Choisissez une région proche de vos utilisateurs (ex: *Frankfurt `fra1`* ou *Paris `cdg1`*), puis cliquez sur **Create**.

### Étape 2 : Lier la base au projet
1. Vercel injecte automatiquement la variable d'environnement `POSTGRES_URL` (ainsi que `DATABASE_URL`).
2. Si vous utilisez la CLI en local, vous pouvez récupérer les identifiants avec :
   ```bash
   npx vercel env pull .env.local
   ```

### Étape 3 : Initialiser les Tables et les Données (1-Clic)
Deux options simples :
- **Option A (Depuis l'application) :**
  Connectez-vous avec le compte Direction Fondatrice (`admin` / `admin123`), ouvrez l'onglet **Administration**, et cliquez sur le bouton **Sync Base Vercel**.
- **Option B (Depuis l'URL directe) :**
  Ouvrez simplement l'adresse de votre application déployée :  
  `https://votre-projet.vercel.app/api/init-db`  
  Cette route crée immédiatement les 5 tables (`members`, `products`, `orders`, `transactions`, `system_state`) et injecte les 51 partenaires du réseau.

---

## 📊 Endpoints Serverless Inclus

| Route API | Méthode | Rôle |
|---|---|---|
| `/api/status` | `GET` | Teste la connectivité et renvoie le nombre de membres et commandes enregistrés. |
| `/api/init-db` | `GET / POST` | Exécute les migrations DDL (`schema.sql`) et injecte les données initiales. |
| `/api/members` | `GET / POST` | Récupère ou met à jour les membres et leurs rangs/portefeuilles. |
| `/api/orders` | `GET / POST` | Enregistre les nouvelles commandes et factures acquittées. |
| `/api/sync` | `POST` | Synchronisation bidirectionnelle complète entre le front et Neon Postgres. |

---

## 📁 Schéma SQL Disponible
Le fichier DDL complet est disponible dans [database/schema.sql](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/dxn-eworld-mlm/database/schema.sql).
