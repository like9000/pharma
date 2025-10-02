# Pharma Import Platform

Plateforme full-stack pour orchestrer l'ingestion de fiches produits WooCommerce à partir d'URLs externes. Le monorepo est structuré pour un déploiement production-ready et couvre scraping, nettoyage HTML, génération IA, mirroring Cloudflare R2, import WooCommerce et supervision temps réel.

## Structure du monorepo

```
.
├── apps/
│   └── web/              # Interface Next.js (App Router) + API REST
├── packages/
│   └── shared/           # Schemas Zod, clients, utilitaires communs
├── workers/              # BullMQ workers (provision + import produits)
├── prisma/               # Schéma, migrations, seeds
├── docker-compose.yml    # Postgres + Redis pour le dev
└── pnpm-workspace.yaml   # Déclaration des workspaces
```

## Démarrage rapide

```bash
cp .env.example .env
pnpm install
pnpm generate
pnpm migrate
pnpm seed
pnpm dev
```

La commande `pnpm dev` démarre l'application Next.js (port 3000) et les workers BullMQ en parallèle. Postgres (5432) et Redis (6379) peuvent être lancés via `docker-compose up`.

## Scripts clés

| Script        | Description |
| ------------- | ----------- |
| `pnpm dev`    | Lancement simultané de l'app web et des workers |
| `pnpm build`  | Build complet Next.js + packages + workers |
| `pnpm lint`   | ESLint sur l'ensemble du repo |
| `pnpm test`   | Vitest (unitaires) + Playwright (E2E) |
| `pnpm migrate`| `prisma migrate deploy` |
| `pnpm seed`   | Seeds des données par défaut |

## Fonctionnalités principales

- **Scraping configurable** (Playwright + Cheerio) avec profils dynamiques
- **Nettoyage HTML** paramétrable (tags, neutralisation des attributs sensibles)
- **Réécriture IA** (LLM générique, OpenAI par défaut) avec prompts versionnés
- **Mirroring d'images** optionnel vers Cloudflare R2
- **Import WooCommerce** via REST API, upsert par SKU
- **Orchestration BullMQ** avec timeline temps réel (SSE), retries, rate limit, idempotence
- **Back-office complet** pour administrer secrets, profils, prompts, mappings, overrides site
- **Audit & observabilité** : logs Pino JSON, audit trail, statut détaillé des jobs/produits

## Environnements & dépendances

- **Frontend** : Next.js 14 (App Router), Tailwind CSS, React Hook Form, Zod
- **Auth** : NextAuth (magic link email)
- **API** : Route handlers, validation Zod, SSE pour le streaming de logs
- **DB** : Postgres + Prisma (migrations et seeds inclus)
- **Queue** : BullMQ + Redis (workers séparés)
- **Scraping** : Playwright (navigateur headless) + Cheerio (parsing)
- **LLM** : Client générique branché sur OpenAI (extensible)
- **Stockage** : AWS SDK v3 pour R2 / S3 compatibles
- **Tests** : Vitest + Playwright (E2E de preview du scraping)

## Seeds inclus

- Profils de scraping par défaut (sélecteurs, nettoyeurs, règles image/prix)
- Prompts IA (description longue / courte)
- Mapping WooCommerce (correspondance champs)
- Utilisateur admin initial (login magic link)

## DevOps & bonnes pratiques

- **Configuration centralisée** en base : aucune variable codée en dur
- **Encryption AES-256-GCM** pour les secrets (clé dérivée de `NEXTAUTH_SECRET`)
- **RBAC** simple (Admin, Ops, Viewer) piloté côté API/UI
- **Rate limit & retries** intégrés dans les clients Cloudflare/Woo/LLM
- **Idempotence** : verrous Redis par site & SKU, `ensure*` sur les opérations externes

## Tests

- `vitest` : parsing prix, extraction `<noscript>`, nettoyage HTML, mapping Woo
- `playwright` : endpoint `/api/settings/scrape-profiles/:id/test` sur HTML mocké

## Runbook (résumé)

1. Créer/valider les secrets globaux (Woo, Cloudflare, LLM, R2, SSH)
2. Configurer les profils de scraping et prompts via l'UI
3. Définir les mappings WooCommerce
4. Renseigner les sites & overrides spécifiques
5. Depuis le dashboard, lancer un job (URLs collées ou fichier .txt)
6. Suivre la timeline en temps réel, télécharger les logs/JSON finaux
7. Vérifier les produits dans WooCommerce (avec images éventuellement mirroir R2)

## Arborescence détaillée (extrait)

Le dépôt contient déjà les premiers modules structurants (schemas, API jobs, worker skeleton, UI de base). Les étapes suivantes consistent à implémenter progressivement :

1. Paramétrage des providers (Cloudflare, WooCommerce, LLM, R2)
2. Gestion des profils de scraping + playground
3. Gestion des prompts (versioning, rollback)
4. Gestion des mappings + visual builder
5. Overrides par site & provisioning
6. Pipeline complet du worker (scrape → clean → IA → mirror → Woo)
7. Tests unitaires & E2E

Toutes les contributions futures doivent respecter cette architecture et s'appuyer sur les packages partagés (`@pharma/shared`).
