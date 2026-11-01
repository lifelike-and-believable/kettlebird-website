---
status: draft
# tests-commit: recorded when the failing tests are committed
---

# Clear the placeholders

<!-- Technical spec for story-content-editing-clear-placeholders, from design-clear-placeholders.
A plan-feature spec without an id. -->

## Problem

The site shows placeholder copy (lorem ipsum, "coming soon" stand-ins) and, with an empty CMS, sample portfolio items titled after other studios' shows. Star's real work must never appear beside these.

## User stories

- As Star, I want the site to show only my own work, with honest empty states where I haven't added anything yet, so that nothing I publish appears beside stock art or other studios' titles. (story-content-editing-clear-placeholders)

## Acceptance criteria

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | The home page has no "About the artist" block, no "Lorem ipsum", and no "[Insert Portrait Here]"; its tiles and social links remain. | test: e2e "home" | S.3; design-clear-placeholders#what-changes-page-by-page |
| AC-2 | The about page has no portrait placeholder, no **Hello!** or **The Work** section while their text is empty, and no "coming soon" text; **At a glance**, the four social links, and **Get in touch** remain. | test: e2e "about" | S.4; design-clear-placeholders#what-changes-page-by-page |
| AC-3 | With no art in the CMS, the portfolio shows "No artwork yet — check back soon!" and a line linking Star's Bluesky, Tumblr, and Instagram, no sample items, and no **Index** filter bar. | test: e2e "portfolio empty" | S.1; design-clear-placeholders#layout-after-the-change |
| AC-4 | The commissions page has no terms-of-service placeholder. | test: e2e "commissions" | S.2; design-clear-placeholders#what-changes-page-by-page |
| AC-5 | No page in the build contains "Lorem ipsum", "[Insert", "Portrait coming soon", "Bio coming soon", "Artist statement coming soon", "terms of service coming soon", or the sample titles. | test: unit "no placeholder copy in the build" (scans dist/) | S.2 |
| AC-6 | `public/assets/images/logo-primary_Placeholder.jpg` no longer exists. | test: unit "placeholder logo removed" | S.5 |
| AC-7 | Every page builds and renders with an empty CMS. | command: `npm run build` and the end-to-end suite | S.6; REQ-site-5 |

## Scope

- In: `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/portfolio.astro`, `src/components/GalleryGrid.tsx`, `src/pages/commissions.astro`, the placeholder logo file, `tests/e2e/clear-placeholders.spec.ts`, `tests/unit/no-placeholders.test.ts`.
- Out: making any of this editable (story-content-editing-site-settings); Star's getting-started doc (with the sign-in story).

## Delivery

- Plan item: epic-content-editing, story 1.

## Risks and decisions

- The home and about sections are removed from the markup, not hidden, and come back when the Site settings story reads them from the CMS. Their old markup is not kept commented out.
