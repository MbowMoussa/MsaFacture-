# MsaFacture — Documentation & Context IA (Master Guide)

Ce document constitue la référence centrale du projet **MsaFacture**. Il contient la description du projet, les fonctionnalités implémentées, la structure des fichiers, les choix de technologies, les règles de design et les instructions strictes pour tous les modèles IA intervenant sur le codebase.

---

## 1. Vue d'ensemble du Projet & Mission

**MsaFacture** est une application SaaS moderne de facturation et de gestion de clientèle adaptée spécifiquement aux entreprises, indépendants et PME d'Afrique de l'Ouest (Sénégal, Côte d'Ivoire, etc.).

- **Devise par défaut** : Franc CFA (`FCFA` / `F CFA`).
- **Taux de TVA par défaut** : 18%.
- **Moyens de paiement gérés** : Wave, Orange Money, MTN MoMo, Espèces, Virement bancaire, Chèque.
- **Utilisateur principal** : Moussa Mbow (Fondateur / Administrateur).

---

## 2. Fonctionnalités Implémentées

### 📊 1. Tableau de bord (Dashboard)
- Synthèse financière en temps réel avec cartes KPI :
  - Total facturé
  - Encaissé / Payé
  - En attente de paiement
  - Montants en retard
- Graphiques interactifs d'évolution du chiffre d'affaires mensuel (développés avec **Recharts**).
- Tableau des factures récentes avec accès rapide aux détails.

### 📄 2. Gestion des Factures
- **Cycle de vie complet** : `Brouillon`, `Envoyée`, `Payée`, `En retard`, `Annulée`.
- **Formulaire de création / édition** dynamique de facture :
  - Sélection du client ou ajout rapide.
  - Gestion des lignes d'articles/services (Quantité, Prix unitaire, Calcul automatique des sous-totaux et de la TVA à 18%).
  - Calcul et affichage dynamique des montants arrondis à l'unité en FCFA.
- **Page détaillée de la facture** (`/factures/[id]`) :
  - Affichage du statut avec badge coloré adapté.
  - Enregistrement des paiements (partiels ou totaux) avec choix du mode de paiement.
  - Export et impression : Génération PDF, Impression directe, Export CSV.

### 👤 3. Gestion des Clients (`/clients`)
- Annuaire et fiches clients complets (Nom, Email, Téléphone, Adresse, Ville, Pays, Notes).
- Suivi financier par client (Total facturé, Total payé, Solde en attente, Nombre de factures).
- Recherche, filtrage et tri dynamiques.

### 📈 4. Rapports & Analytics (`/rapports`)
- Analyste des revenus et statistiques d'impayés pour un meilleur suivi de la trésorerie.

### ⚙️ 5. Paramètres d'Entreprise (`/parametres`)
- Configuration des données de l'entreprise (Nom, Adresse, Numéro fiscal / RCCM, Logo, Taux TVA par défaut, coordonnées bancaires et mentions légales).

### 🔐 6. Authentification (`/auth`)
- Interfaces d'accès utilisateur : Connexion, Inscription, Récupération de mot de passe.

---

## 3. Structure des Fichiers & Répertoires

```
MsaFacture/
├── app/
│   ├── (auth)/                 # Pages d'authentification (login, register, forgot-password)
│   ├── (dashboard)/            # Application SaaS principale
│   │   ├── clients/            # Gestion de la clientèle (/clients)
│   │   ├── dashboard/          # Vue synthétique KPI (/dashboard)
│   │   ├── factures/           # Factures (/factures, /factures/nouvelle, /factures/[id])
│   │   ├── parametres/         # Paramètres de l'entreprise (/parametres)
│   │   └── rapports/           # Rapports financiers (/rapports)
│   ├── api/                    # Handlers API Next.js
│   ├── fonts/                  # Typographies personnalisées
│   ├── globals.css             # Design system CSS & variables Tailwind
│   ├── layout.tsx              # Layout racine HTML & Providers
│   ├── not-found.tsx           # Page 404 sur-mesure
│   └── page.tsx                # Page d'accueil / Landing page
├── components/
│   ├── layout/                 # Header.tsx, Sidebar.tsx, SidebarContext.tsx
│   └── shared/                 # StatsCard.tsx, InvoiceStatusBadge.tsx, Modals, Badges
├── hooks/                      # Custom React Hooks
├── lib/
│   ├── exportUtils.ts          # Utilitaires d'export (CSV, PDF, Print)
│   ├── mock-data.ts            # Données de démonstration et de secours
│   ├── store.ts                # Gestion d'état global Zustand
│   └── utils.ts                # Formratage FCFA (formatCFA), dates et helper clsx/tailwind-merge
├── supabase/
│   └── migrations/             # Schémas et migrations SQL Supabase
├── types/
│   └── index.ts                # Modèles et interfaces TypeScript (Invoice, Client, Payment, etc.)
└── GEMINI.md                   # Ce fichier de contexte et directives pour l'IA
```

---

## 4. Technologies Utilisées

| Domaine | Technologie |
| :--- | :--- |
| **Framework Web** | Next.js 14 (App Router, React 18, TypeScript) |
| **Styling & UI** | Tailwind CSS (v3.4), Lucide React (icônes) |
| **Gestion d'état** | Zustand (v5) |
| **Graphiques** | Recharts (v3) |
| **Formulaires & Validation** | React Hook Form & Zod |
| **Base de données** | Supabase (PostgreSQL & SQL Migrations) |

---

## 5. Directives de Design System & Standards UI

Toute modification ou création de composant DOIT respecter les règles d'UI ci-dessous :

### Palette de Couleurs
- **Marque / Action Principale** : Indigo (`indigo-600`). Button: `bg-indigo-600 hover:bg-indigo-700 text-white`. Focus: `focus:ring-indigo-500/20`.
- **Succès / Payé** : Émeraude (`bg-emerald-50 text-emerald-700 border border-emerald-200/60`).
- **Avertissement** : Ambre doux (`bg-amber-50 text-amber-800 border border-amber-200/80`).
- **En retard / Danger** : Rose/Rouge doux (`bg-rose-50 text-rose-700 border border-rose-200/60`). **Pas de rouge foncé agressif !**
- **Fond & Cartes** : Fond `bg-slate-50/60`, Cartes `bg-white border border-slate-200/80 shadow-xs rounded-2xl`.

### Layout & En-tête (`Header.tsx`)
- Hauteur `h-[58px]`, `sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80`.
- Pas de bouton de création principal en double dans l'en-tête (le CTA principal "+ Nouvelle facture" reste dans la sidebar gauche).

### Formatage des Devises
- Toujours utiliser `formatCFA(amount)` depuis `@/lib/utils`.
- Tous les montants en FCFA doivent être arrondis à l'entier le plus proche (`Math.round(...)`). Exemple : `125 000 F CFA`.

---

## 6. Instructions Strictes pour les Modèles IA Futurs

À l'attention de l'agent ou modèle d'IA travaillant sur ce projet :

1. **Salutation Obligatoire** :
   Chaque réponse adressée à l'utilisateur DOIT impérativement commencer par :
   ```text
   Salam Moussa
   ```

2. **Validation avant Publication** :
   Si l'utilisateur demande de publier ou déployer le site, vous devez TOUJOURS demander d'abord :
   ```text
   Est ce que tu peux le faire?
   ```

3. **Consultation de ce Fichier (`GEMINI.md`)** :
   Consultez régulièrement ce fichier pour maintenir une cohérence absolue avec la structure du projet, les types TypeScript, la charte graphique et la vision SaaS de MsaFacture.
