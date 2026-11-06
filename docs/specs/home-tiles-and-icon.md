---
status: draft
tests-commit: 946ff511a60a8a03d00d5dad3f5d134ec2a14096
---

# Home tiles and the site's icon

<!-- Technical spec for design-home-tiles-and-icon (approved 2026-11-06, with the lead's review: the labels
stay white with their shadow, the bird alone at 48 px and under, no theme-color). A plan-feature spec without an id. -->

## Problem

The home page's tile labels sit on a 20% black box. The logo tile is set to yellow, but the logo picture (the mark on its own orange square) covers it, so the picture, not the tile, decides how the logo sits. The site sets no icon: browsers show a blank globe in tabs and bookmarks, and phones use a screenshot or a letter on their home screens.

## User stories

- As a fan, I want to find Kettlebird by its own bird in my tabs, bookmarks and home screen, so that I can come back to it quickly. (design-home-tiles-and-icon#personas)
- As Star, I want the logo shown on its own orange and whole, so that the site looks like my work. (design-home-tiles-and-icon#personas)

## Acceptance criteria

Source: design-home-tiles-and-icon sections as named.

### Home tiles

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | No tile label has a background of its own: each label's box (`.tile-content`) is transparent. The labels keep Nunito 700, white, and their text shadow `2px 2px 4px rgba(0, 0, 0, 0.5)`. | test: e2e "labels" | #the-change, #for-the-spec-to-check |
| AC-2 | The logo tile's background is #ffbb58. Its picture is `/assets/images/kettlebird-mark.png` with the text alternative "Kettlebird Logo", and the picture's box is at least 12% of the tile's width inside the tile on every side, at 1280 × 800 and at 390 × 844. | test: e2e "logo tile" | #the-change, #accessibility |
| AC-3 | The logo tile is square, and every tile's position and size in the grid is the same as before, within 1 px, at 1280 × 800 and at 390 × 844, where the logo tile is first. | test: e2e "the grid doesn't move" | #the-change |
| AC-4 | Under reduced motion, a tile doesn't move on hover. | test: e2e "reduced motion" | #the-change; REQ-site-4 |

### The site's icon

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-5 | Every page's `<head>` names `/favicon.ico`, PNG icons at 16, 32 and 48 (`/favicon-16.png`, `/favicon-32.png`, `/favicon-48.png`, each with its `sizes`), `/apple-touch-icon.png` and `/site.webmanifest`, and no `theme-color`. | test: e2e "the head" | #the-change, #decisions-at-review |
| AC-6 | Each icon is served, square and its stated size: the PNGs at 16, 32, 48, 180, 192 and 512, the maskable 512, and `favicon.ico` holding 16, 32 and 48. Each has #ffbb58 at its four corners; the 48 and smaller have #ffbb58 along every edge. | test: unit "the icon files"; e2e "the head" | #the-change, #for-the-spec-to-check |
| AC-7 | The 48 px and smaller icons are the bird alone: where the mark has its K and B, they show only #ffbb58. The 180 px and larger show the K and B. The maskable icon has only #ffbb58 outside its central circle of 40% of its width in radius, the safe zone Android keeps. | test: unit "the icon files" | #the-change |
| AC-8 | The manifest has `name` "Kettlebird Creations", `short_name` "Kettlebird", `start_url` "/", `display` "browser", `background_color` "#ffbb58", and the 192, 512 and maskable 512 icons, the last with `purpose` "maskable". | test: unit "the manifest" | #the-change |
| AC-9 | The mark files are the logo lifted off its square, not redrawn: `kettlebird-mark.png` is transparent where `kblogo.png` shows #ffbb58, and opaque where it shows the bird, the eye and the letters; `kettlebird-bird.png` is the same without K and B. | test: unit "the mark" | #the-change |
| AC-10 | Link previews, and everything else on the home page, are unchanged. | manual: review that the existing tests pass unchanged (sharing, preview, reflow, site settings) | #where-it-applies |

## Scope

- In:
  - `scripts/make-logo.py` (from the design's `make-logo.py`): writes the mark, the bird and the icons into `public/` from `public/assets/images/kblogo.png`;
  - `public/assets/images/kettlebird-mark.png`, `public/assets/images/kettlebird-bird.png`, `public/favicon.ico`, `public/favicon-16.png`, `public/favicon-32.png`, `public/favicon-48.png`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`;
  - `public/site.webmanifest`, written by hand;
  - `src/components/pages/HomePage.astro`: the labels' box, the logo tile, reduced motion;
  - `src/layouts/BaseLayout.astro`: the icon links;
  - Tests: `tests/unit/site-icon.test.ts`, `tests/e2e/home-tiles-and-icon.spec.ts`.
- Out: the labels' colour (to be discussed with Star), link previews, the Studio's icon, `theme-color`.

## Design values

- Logo tile: `background: #ffbb58; aspect-ratio: 1`; the picture `position: absolute; inset: 12%; width: 76%; height: 76%; object-fit: contain`.
- The tiles' positions at 1280 × 800, relative to the grid, as `[x, y, width, height]`: portfolio [0, 0, 395, 189], logo [411, 0, 395, 395], shop [821, 0, 395, 189], comics [0, 205, 395, 280], commissions [821, 205, 395, 189], writing [0, 502, 395, 166], contact [411, 411, 395, 257], about [821, 411, 189, 257], news [1027, 411, 189, 257].
- At 390 × 844: logo [0, 0, 326, 326], portfolio [0, 342, 326, 76], comics [0, 434, 326, 76], writing [0, 527, 326, 76], commissions [0, 619, 326, 76], shop [0, 712, 326, 76], about [0, 804, 155, 76], news [171, 804, 155, 76], contact [0, 896, 326, 76].
- The K and B in `kettlebird-mark.png`, as fractions of its width (it is square): K from (0.186, 0.638) to (0.308, 0.928), B from (0.684, 0.668) to (0.810, 0.934). In an icon, the mark fills 88% (48 and under) or 84% (180, 192, 512), centred.

## Delivery

- Plan item: design-home-tiles-and-icon (PR 157).
- The design system's Logo component and Changes entry are updated after this merges.

## Risks and decisions

- The unit tests read the icons with `sharp`, which Astro already installs for its own image handling.
- The positions were measured on the fixture build on 2026-11-06, with the fonts loaded; the grid's rows depend on the logo tile staying square, which is what AC-3 guards.
