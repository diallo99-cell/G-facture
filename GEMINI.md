# G-Facture : Documentation du Projet & Instructions IA

Ce document sert de point de référence ("cerveau") pour tout modèle d'Intelligence Artificielle (ou développeur) qui rejoint le projet. Il résume l'état actuel de l'application, son architecture, et les règles strictes de design à respecter.

---

## 1. Ce que fait l'application
**G-Facture** est une application web moderne de facturation et de gestion de clients (mini-CRM) destinée aux freelances et petites entreprises. Elle permet de :
- Créer, éditer, et suivre des factures et des devis.
- Gérer un répertoire de clients.
- Consulter un tableau de bord récapitulatif (revenus, factures en attente, etc.).
- Gérer les paramètres légaux de l'entreprise (Nom, NINEA, RC, TVA, etc.).

---

## 2. Fonctionnalités Implémentées (État Actuel)
L'application est fonctionnelle côté client grâce à un stockage temporaire dans le navigateur (`localStorage`).

- **Dashboard (`/`)** : Métriques clés, graphiques (simulés), et liste des dernières factures.
- **Factures (`/factures`)** : 
  - Liste filtrable et triable (Statuts : Tous, Brouillon, Envoyée, Payée, En retard).
  - Création/Modification avec calcul automatique des totaux (HT, TVA 18%, Remise, TTC) et ajout dynamique de lignes.
  - Vue détaillée avec un rendu visuel au format A4 (prêt pour l'impression/PDF).
  - Changement rapide de statut via un menu déroulant ou directement depuis la vue détaillée.
- **Devis (`/devis`)** : Fonctionnalités similaires aux factures (Création, liste).
- **Clients (`/clients`)** : CRUD complet (Créer, Lire, Modifier, Supprimer) lié au contexte global.
- **Paramètres (`/parametres`)** : Sauvegarde des informations de l'entreprise.
- **Stockage Local** : Un `DataProvider` centralise les données (Factures, Clients, Paramètres) et les persiste dans le `localStorage` du navigateur.

---

## 3. Structure des Fichiers
Le projet utilise le framework **Next.js (App Router)**.

```text
G-facture/
├── app/                      # Routes de l'application (Pages)
│   ├── clients/              # Page de gestion des clients
│   ├── devis/                # Pages liées aux devis
│   ├── factures/             # Pages des factures (liste, creer, [id], modifier)
│   ├── parametres/           # Configuration globale
│   ├── globals.css           # Styles globaux Tailwind
│   └── layout.tsx            # Root layout
├── components/               # Composants réutilisables
│   ├── layout/               # AppLayout, Sidebar (Navigation)
│   ├── providers/            # DataProvider (Gestion de l'état global et LocalStorage)
│   └── ui/                   # Composants UI (Boutons, Inputs, Selects, Cards, Badges)
├── lib/                      # Utilitaires
│   ├── format.ts             # Formatage des dates et devises (FCFA / GNF)
│   └── mock-data.ts          # Données initiales pour peupler le localStorage
└── tailwind.config.ts        # Configuration du design system
```

---

## 4. Technologies Utilisées
- **Framework** : Next.js 14 (App Router)
- **Librairie UI** : React 18
- **Langage** : TypeScript
- **Styling** : Tailwind CSS (Vanilla CSS pour les détails complexes)
- **Icônes** : Lucide React
- **Base de données (Actuelle)** : LocalStorage (via React Context)
- **Base de données (Future cible)** : Supabase (PostgreSQL)

---

## 5. Décisions de Design & Règles d'Esthétique
Le design a été itéré pour être **ultra-premium, fluide et moderne**. Il est impératif de maintenir ces standards lors des futurs développements.

### Règles UI / UX à respecter obligatoirement :
1. **Boutons et Inputs (Effet "Pilule") :** Tous les boutons, champs de texte (`Input`), barres de recherche, et menus déroulants doivent utiliser la classe `rounded-full`. Fuyez les coins rectangulaires ou légèrement arrondis (`rounded-md`).
2. **Inversion des couleurs au CLIC (Boutons) :** Les boutons principaux (ex: noirs avec texte blanc) ne doivent **pas** s'inverser au survol (`hover`). Ils s'inversent uniquement à l'état actif (`active:bg-white active:text-black active:border-black`). Le survol doit rester subtil (ex: `hover:opacity-90`).
3. **Animations et Transitions :** Tout élément interactif doit posséder des transitions fluides (`transition-all duration-200`). Les boutons secondaires et les cartes peuvent utiliser un effet de pression (`active:scale-[0.98]`) ou un léger soulèvement au survol (`hover:-translate-y-1`).
4. **Bordures et Couleurs :**
   - Fonds principaux : `bg-slate-50` ou `bg-slate-100/50`.
   - Cartes : `bg-white` avec de légères bordures `border-slate-200` et une ombre douce `shadow-sm`.
   - Supprimez les focus natifs bleus des navigateurs (utiliser `focus-visible:ring-slate-200` ou `outline-none`).
5. **Composants d'Overlay :** Les modales de confirmation (Suppression) utilisent un fond flou (`backdrop-blur-sm bg-black/50`) et s'animent doucement (ex: `animate-in fade-in zoom-in-95`).

---

## 6. Instructions pour la future IA (Migration Supabase)
Lorsque l'utilisateur demandera de migrer vers Supabase, voici la marche à suivre :
1. **Schéma SQL :** Basez-vous sur les interfaces TypeScript de `lib/mock-data.ts` (`Invoice`, `InvoiceItem`, `Client`, `Settings`) pour concevoir les tables relationnelles.
2. **Transition Server-Side :** Détruisez progressivement le `DataProvider` (côté client) au profit de **Server Components** pour la lecture (`fetch`) et de **Server Actions** pour les mutations (Créer/Modifier/Supprimer).
3. **Auth :** Intégrez Supabase Auth de façon transparente. Assurez-vous d'injecter un `user_id` lié à chaque entité pour garantir la sécurité et la séparation des données.
4. **Prudence :** Migrez section par section (ex: Commencer par `Paramètres`, puis `Clients`, et finir par `Factures` en raison des tables liées).
