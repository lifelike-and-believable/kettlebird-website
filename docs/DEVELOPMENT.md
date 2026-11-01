# Development Guide

Milestone 1 establishes the Astro + React front-end scaffold and Sanity Studio for content. Use this guide to run, develop, and deploy.

## Prerequisites

- Node.js ≥ 18.17
- npm 9+ (or pnpm/yarn if preferred)
- Sanity CLI (`npm install -g sanity`, optional if running scripts locally)

## Quick start

```bash
# Install Astro workspace dependencies
npm install

# Start Astro dev server
npm run dev
```

Astro runs at `http://localhost:4321` by default.

## Sanity Studio

```bash
cd sanity-studio
npm install
npm run dev   # starts Studio at http://localhost:3333/studio
```

Environment variables expected (see `.env.example`):

```
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
```

### Sanity document types
- `galleryItem` – images with categories, tags, alt text
- `comicSeries` / `comicPage` – panel coordinates for guided reading
- `writtenWork` – cover, excerpt, content blocks, external link
- `product` – merch/Ko-fi listings
- `commissionType` – tiers, pricing, examples

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Astro development server |
| `npm run build` | Production build (`dist/`) |
| `npm run preview` | Preview built site |
| `npm run check` | Type and integration checks |
| `npm run test` | Alias for `astro check` |
| `npm run dev -- --host` | Expose dev server on local network |

Sanity (inside `sanity-studio/`):

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run Studio locally |
| `npm run build` | Build static Studio output |
| `npm run deploy` | Deploy Studio to Sanity-managed hosting |

## Project structure (updated)

```
.
├── src/                  # Astro source
│   ├── layouts/          # Base layout + shared chrome
│   ├── pages/            # Astro pages (index scaffolded)
│   └── styles/           # Global tokens/styles
├── public/               # Static assets (place images/fonts here)
├── sanity-studio/        # Sanity CMS workspace + schemas
├── vercel.json           # Vercel build output + headers
└── package.json          # Astro workspace scripts/deps
```

Legacy static assets (`assets/`, `css/`, `js/`) are retained for reference and can be migrated into Astro as components.

## Branching & PR workflow

1. Create feature branches from `main`: `feature/<topic>` (e.g., `feature/gallery-grid`).
2. Keep PRs scoped to a milestone task.
3. Run `npm run check` and `npm run build` before opening a PR.
4. Request review; deploy previews via Vercel/Netlify once secrets are set.

## Deployment targets

- **Vercel:** uses `vercel.json` (`npm run build`, output `dist`).
- **Netlify:** `netlify.toml` (`npm run build`, publish `dist`).

Set `SANITY_PROJECT_ID` and `SANITY_DATASET` in the hosting dashboard; add optional `SANITY_STUDIO_URL` for previews.

## Accessibility & performance guardrails

- Honor `prefers-reduced-motion`.
- Provide alt text on every image (enforced in Sanity schema).
- Keep images < 500KB where possible (Sanity CDN + WebP).
- Use semantic headings and focus-visible styles from the base layout.

## Troubleshooting

- **Port conflict:** run `npm run dev -- --port 4000`.
- **Env missing:** ensure `.env` or host secrets provide `SANITY_PROJECT_ID` / `SANITY_DATASET`.
- **Sanity schema changes not appearing:** restart `npm run dev` inside `sanity-studio`.
