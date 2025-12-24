# Kettlebird Creations • Astro + Sanity

Milestone 1 lays the foundation for Star Goldberg’s portfolio: Astro with React islands, Sanity Studio schemas, and deployment wiring for Vercel/Netlify.

## Highlights

- 🚀 **Astro 5.x + React islands** scaffolded with Base layout and global UPA-inspired tokens.
- 🗂️ **Sanity Studio** schemas for gallery items, comic series/pages, written works, merch, and commission tiers.
- 🔒 **Deployment ready** configs for Vercel (`vercel.json`) and Netlify (`netlify.toml`) with security headers.
- 🧭 **Documentation** updated with development workflow, branching strategy, and initial wireframes.

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

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`

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

- **Vercel:** Uses `vercel.json`, build `npm run build`, output `dist`.
- **Netlify:** Uses `netlify.toml`, build `npm run build`, publish `dist`.

Add the Sanity project ID/dataset as environment variables in your hosting provider before enabling previews.

## Documentation

- `docs/PROJECT_PLAN.md` – milestone roadmap (Milestone 1 complete)
- `docs/TECHNICAL_ARCHITECTURE.md` – stack & patterns
- `docs/CONTENT_STRATEGY.md` – content taxonomy and migration
- `docs/DEVELOPMENT.md` – setup, scripts, branching workflow
- `docs/WIREFRAMES.md` – initial page sketches for milestone 1

## License

MIT — see [LICENSE](LICENSE).
