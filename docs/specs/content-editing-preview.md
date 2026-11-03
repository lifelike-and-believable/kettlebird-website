---
status: draft
tests-commit: []
unlocks: []
---

# Preview before publishing

<!-- Technical spec for story-content-editing-preview, from design-preview (with its mock-ups, as
amended 2026-11-03) and docs-previewing. A plan-feature spec without an id. -->

## Problem

Star publishes and then finds a bad crop or a broken line on the live site. The story gives Star a preview beside the form: the real site page, with this item's unpublished changes in place and outlined, at computer and phone width, never visible to visitors.

## User stories

- As Star, I want to see a piece, page, or text change as it will look on the site before I publish it, so that I catch crops and mistakes first. (story-content-editing-preview)

## Acceptance criteria

Source: S5.n is the story's nth criterion; design and docs sections as named.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | Every item Star can preview (art piece, chapter, series, the four Site settings items, story, product, commission type) has **Preview** at the top of the item, as a button of its own. It opens the preview beside the form, and turns into **Hide preview**, which closes it. Other kinds of item have no **Preview**. | test: unit "previewable types"; manual (tutorial) | S5.1; design-preview#flow (amended) |
| AC-2 | The preview shows `/preview/<kind>/<id>` from the site in a frame, at **Computer** (1280 px wide, scaled to fit) or **Phone** (375 px, full size), with the choice remembered; above it, the page's name and "Updated just now" (refreshed with each update), and the fixed line "Preview: not on the site yet. This item's unpublished changes are shown, outlined; everything else is as published." After **Publish**, the line turns green and reads "Published. The site matches this preview once the status at the top right says Live." | test: unit "preview pane text"; manual | S5.1, S5.4; design-preview#flow |
| AC-3 | The preview page is the site's own page, made by the same components, from published content with only this item's draft in place of its published version. The one exception: a chapter whose series has never been published also uses the series' draft, and says "The series isn't published yet; it's shown as it will be." | test: unit "overlay"; e2e "preview pages" | S5.1; design-preview#how-it-works, #states-and-errors |
| AC-4 | The page, and where it scrolls, follow the design's table: art piece (portfolio, first section, carousel at the piece; **Show it opened** opens it), chapter (the reader at the open page, or page 1), series, Commissions, About page (the changed part), Home page (the artist text), Contact and social links (the links and footer), story, product, commission type. | test: unit "preview targets"; e2e "preview pages" | design-preview#which-page-the-preview-shows-and-where-it-scrolls |
| AC-5 | Each changed top-level part is outlined in dashes; changes the page can't show (alt text, the contact email, panel regions) and removals ("Removed: Instagram link", "Removed from the page: How it works") are listed in the yellow line; an art piece's other sections are named ("Also in: Featured"). | test: unit "changes"; e2e "preview pages" | S5.1; design-preview#flow |
| AC-6 | The preview catches up after Star pauses, once the draft is saved (about one to two seconds); the old preview stays, dimmed, until the new one has loaded; "Preview updated" is announced politely only then. | test: unit "update timing"; manual | S5.2; design-preview#flow, #accessibility |
| AC-7 | Links in the preview don't navigate; pointing at one says "Links don't work in the preview". The preview page never scrolls the editor or takes focus from the form. | test: e2e "preview pages"; manual | design-preview#flow, #accessibility |
| AC-8 | Without a valid key, `/preview/…` answers **Page not found** (404). The key is a Sanity preview secret the editor creates when the preview opens, valid for an hour and renewed while it's open. Preview pages send `Cache-Control: private, no-store`, `X-Robots-Tag: noindex, nofollow` and `Referrer-Policy: no-referrer`. | test: unit "access"; e2e "access and headers" | S5.3; design-preview#how-it-works |
| AC-9 | The public site reads published content only (`perspective: 'published'`, no token). The draft-reading token is read only at request time by the preview route, never during the build. A check after every build finds no draft documents and not the token's value in the built files. | test: unit "public client"; command: `node scripts/check-no-drafts.mjs` in CI | S5.3; design-preview#how-it-works (amended) |
| AC-10 | The design's messages for what can't be shown: no portfolio section, no picture, no web address ("Add a web address so readers can find this comic. The preview needs it too."), a chapter with no pages, a duplicate chapter number (in the yellow line, page still shown), can't load (with **Try again**, and "Your changes are saved. You can still publish."). | test: unit "preview targets", "preview pane text"; manual | design-preview#states-and-errors; docs-previewing |
| AC-11 | **Preview**, **Hide preview**, **Computer**, **Phone** and **Show it opened** are buttons reachable by keyboard; the chosen width is marked as chosen (`aria-pressed`); the frame is a region named "Preview of the <page>". | test: unit "preview pane text"; manual | design-preview#accessibility |
| AC-12 | The site still builds and deploys with the editor at `/studio`, the build info at `/build-info.json` (`no-store`), the security headers on every response (`X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Content-Security-Policy: frame-ancestors 'self'`, `X-XSS-Protection`), `noindex` on `/studio`, and every `/studio/…` address serving the editor. After `astro build`, a script adds these headers and the `/studio` rewrite to the adapter's routing (before its catch-all **Page not found**) and copies the editor into the deployed files. The end-to-end tests and tutorials run against a fixture build that includes the preview route. | test: unit "deploy routes"; command: CI build and e2e; manual: check a pull request deployment | design-preview#for-the-spec-to-check |
| AC-13 | A manual tutorial (`docs/tutorials/previewing.md`, `runner: manual`) walks Star through previewing an art piece and a Site settings item. | manual: the lead or Star | docs-previewing |

## Scope

- In:
  - **Site:**
    - `astro.config.mjs`: `@astrojs/vercel` 9.0.5 for deployed builds, `@astrojs/node` 9.5.3 (standalone) for fixture builds; `astro:env` with `SANITY_PREVIEW_TOKEN` (server, secret, optional).
    - `src/pages/preview/[kind]/[id].astro` (new, `prerender = false`): checks the key, loads published content and this item's draft in one query, and renders the real page's component with the outlines and the preview bar. Fixture builds use fixture drafts and a fixture key.
    - `src/lib/preview/` (new): what page an item previews and where it scrolls, overlaying the draft, which parts changed, what the page can't show; pure functions. `src/lib/preview/source.ts`: the one query.
    - Refactors so pages render from data passed in: the series page, the reader page, the portfolio (opening a given piece and moving its carousel), writing, shop and commissions. Site settings components already take props.
    - `src/lib/sanity.ts`: `perspective: 'published'`. `scripts/check-no-drafts.mjs` (new).
    - `scripts/vercel-output.mjs` (new), run by `npm run build:site` after the editor's build: copies `dist/studio` to `.vercel/output/static/studio` and adds the headers, the `/studio` rewrite and the `/build-info.json` rule to `.vercel/output/config.json`, from `src/lib/deploy-routes.ts` (pure). `vercel.json` keeps only the build and install commands. CI's build checks look in the new folders.
  - **Editor:**
    - `sanity-studio/components/PreviewPane.tsx` (new): the frame, widths, bars, key creation and renewal, reloading after saves.
    - `sanity-studio/components/PreviewButton.tsx` (new): **Preview** and **Hide preview** at the top of the item, opening the preview as a second pane with the `preview` view.
    - `structure.ts`: the `preview` view on previewable types, through `defaultDocumentNode` and the existing `S.document()` calls.
    - `sanity-studio/lib/preview.ts` (new): which types are previewable, the pane's words, and update timing; pure.
  - **Tests:** `tests/unit/preview*.test.ts`, `tests/e2e/preview.spec.ts`, `tests/fixtures/drafts.ts`; `docs/tutorials/previewing.md`.
- Out: previewing the home page's other sections, the news page, or a release of several items together; marking changes inside a part (one word in the bio).

## What the lead sets up (once)

1. At sanity.io/manage, project **Kettlebird**, **API → Tokens**, add a token named "site preview" with the **Viewer** role. Copy it.
2. In Vercel, project **kettlebird-website**, **Settings → Environment Variables**, add `SANITY_PREVIEW_TOKEN` with that value, marked **Sensitive**, for **Production** only (not Preview or Development).
3. After this work's pull request is deployed, check its preview deployment: `/studio` opens the editor, `/build-info.json` loads, and a page's response has the `X-Frame-Options` and `Content-Security-Policy` headers.

Until step 2 is done, **Preview** shows "Can't show the preview right now." on the live site; nothing else changes.

## APIs and assumptions

- Sanity 5.1: `S.view.component()` views receive `document.{draft, published, displayed}`; `usePaneRouter()` offers `duplicateCurrent({ params: { view } })` and `closeCurrent()`. Only the first document action is drawn as a footer button, so **Preview** is a form-level component at the top of the item (the root input, as `FixSummary` is for Site settings).
- `@sanity/preview-url-secret` 4.0.1: `createPreviewSecret` (editor, with the signed-in user's client) writes a draft `sanity.previewUrlSecret` with a one-hour life; `validatePreviewUrl` (site) needs a token that can read drafts, so a **Viewer** token is enough. The secret query can be combined with the content query, so one update costs about one API request.
- Perspectives are `published`, `drafts` and `raw`; none overlays a single document, so the route reads `drafts.<id>` with `raw` and swaps it in.
- `@astrojs/vercel` 9.0.5, checked with a trial build: one on-demand route turns the build into server output, with static files in `dist/client` and `.vercel/output/static` (the build info included) and routing in `.vercel/output/config.json`. That routing has only the adapter's own routes, ending in a catch-all 404, so `vercel.json`'s headers and rewrite would be lost; `scripts/vercel-output.mjs` restores them (AC-12).
- `astro preview` fails with the Vercel adapter ("does not support the preview command", checked), so fixture builds use the Node adapter and Playwright starts its standalone server (`node dist/server/entry.mjs`). The Node build serves the fixture 404 page for missing addresses with status 404, as now.
- Free plan: 250,000 API requests a month; an hour of preview with an update every ten seconds is about 360 requests.

## Non-functional requirements

- An update reaches the preview within two seconds of the draft being saved, on the live site.
- The public pages are still built ahead of time; only `/preview/` is made on request.
- No change to what visitors see.

## Delivery

- Plan item: epic-content-editing, story 5. Needs the lead's set-up above before it works on the live site.

## Risks and decisions

- The adapter changes the build's output folders, and Vercel then ignores `vercel.json`'s headers and rewrites. The routes script restores them and has a unit test; the first pull request deployment is also checked by hand (AC-12) before merging.
- Outlines mark whole top-level parts, and changes inside lists (a fact, a link, a page) mark the list (lead, 2026-11-03).
- Preview pages reuse the public components through props. Where a page fetched its own data (portfolio, writing, shop, series, reader), the fetch moves into its page file and the component takes the data, so preview and public pages share one component.
- The preview route uses `scrollTo` on its own window and never calls `focus()` or `scrollIntoView`, so it can't move the editor around it.
