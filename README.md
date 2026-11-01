# Kettlebird Creations • Astro + Sanity

Milestone 2 locks the visual system: UPA-inspired palette, hand-drawn typography, textured paper kit, and branding directions layered onto the Astro + Sanity foundation.

## Highlights

- 🚀 **Astro 5.x + React islands** scaffolded with Base layout and global UPA-inspired tokens.
- 🗂️ **Sanity Studio** schemas for gallery items, comic series/pages, written works, merch, and commission tiers.
- 🔒 **Deployment ready** config for Vercel (`vercel.json`) with security headers.
- 🧭 **Documentation + style guide** updated with palette, typography, texture, motion, and component treatments.

## Quick start

```bash
npm install
npm run dev           # http://localhost:4321
```

Sanity Studio:

```bash
cd sanity-studio
npm install
npm run dev           # http://localhost:3333/studio
```

Environment variables (see `.env.example`):

- `SANITY_PROJECT_ID` (the site; defaults to `1p6w5n0l`)
- `SANITY_DATASET` (the site; defaults to `production`)
- `SANITY_STUDIO_DATASET` (the editor; defaults to `production`, set it to `test` to try things out)

## Scripts

- `npm run dev` / `npm run start` – Astro dev server
- `npm run build` – production build to `dist/`
- `npm run preview` – preview the built site
- `npm run check` / `npm test` – Astro type/integration check

Sanity (inside `sanity-studio/`):

- `npm run dev` – Studio local server
- `npm run build` – static Studio build
- `npm run deploy` – deploy Studio to Sanity managed hosting

## Deployment

- **Vercel** (production): uses `vercel.json`, build `npm run build`, output `dist`. Preview builds set `KETTLEBIRD_FIXTURES=1`, so they show the test comics.

## Documentation

- `docs/PROJECT_PLAN.md` – milestone roadmap (Milestone 2 complete)
- `docs/TECHNICAL_ARCHITECTURE.md` – stack & patterns
- `docs/STYLE_GUIDE.md` – approved colors, type, texture, motion, and component rules
- `docs/CONTENT_STRATEGY.md` – content taxonomy and migration
- `docs/DEVELOPMENT.md` – setup, scripts, branching workflow
- `docs/WIREFRAMES.md` – initial page sketches for milestone 1

## License

MIT — see [LICENSE](LICENSE).
