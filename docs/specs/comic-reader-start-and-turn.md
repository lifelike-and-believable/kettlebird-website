---
status: draft
# tests-commit: (recorded when the failing tests are committed)
---

# Comic reader: start reading and turn pages

<!-- Technical spec for story-comic-reader-start-reading and story-comic-reader-turn-pages, which go
live together (design-comic-start-reading, "Release with story 2"). Written from the approved
designs and user documentation; a plan-feature spec without an id, so not a linked process
artifact during the pilot. -->

## Problem

Fans can't read Star's comics on the site: every series card links to a page that is never built. Stories 1 and 2 give each series a page with its chapters, and a reader that opens at any chapter and turns pages across chapters, on phones and computers.

## User stories

- As a fan, I want to open a series from the comics page, see its chapters, and start at the first page of any chapter, so that I can read from the beginning or pick up a chapter I haven't read. (story-comic-reader-start-reading)
- As a fan, I want to go to the next and previous page by tapping, swiping, clicking, or using the arrow keys, moving into the next chapter at the end of one, so that I can read at my own pace on any device. (story-comic-reader-turn-pages)

## Acceptance criteria

Source names the story criterion (S1 = start-reading, S2 = turn-pages, by bullet number) and the design or user documentation section it comes from.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | Every series card on `/comics` links to that series' page at `/comics/<series>`, which exists; series without a web address get no link. | test: e2e "series cards open series pages" | S1.1; design-comic-start-reading#page-addresses |
| AC-2 | The series page shows the title (main heading), cover, status and type tags read as "Status: Ongoing" and "Type: Original", and the description. | test: e2e "series page shows details" | S1.2; design-comic-start-reading#layout, #accessibility |
| AC-3 | The series page lists chapters with pages in number order as "Chapter N: Title" (or "Chapter N" untitled; title alone for chapter 0), each with its page count, each a link to its first page. Chapters with no pages are not shown. | test: unit "chapter labels and visible chapters"; e2e "chapter list" | S1.3, S1.5; design-comic-start-reading#states-and-errors |
| AC-4 | **Start reading** opens the first page of the first chapter that has pages. | test: e2e "start reading" | S1.4; docs-reading-comics#start-a-comic |
| AC-5 | A series that is a single untitled chapter shows **Start reading** and no chapter list. | test: unit "hidden chapters"; e2e "one-shot series" | S1.6; design-comic-start-reading#what-star-enters |
| AC-6 | A series with no pages shows "Pages coming soon." and no **Start reading**. | test: e2e "series without pages" | S1.7; design-comic-start-reading#states-and-errors |
| AC-7 | Each page is built at `/comics/<series>/<chapter number>/<page number>` and shows the page image with its alt text (or "Chapter N, page M" when it has none), and a location line as the page's main heading: "Chapter 2: The Long Road · Page 1 of 24", or "Page 1 of 12" for a one-shot. | test: unit "page addresses and location lines"; e2e "reader page" | S1.8; design-comic-start-reading#page-addresses, #layout |
| AC-8 | The browser tab title is "Chapter 2, page 1 · <series> · Kettlebird Creations" (or "Page 1 · ..." for a one-shot). | test: e2e "reader page" | design-comic-start-reading#accessibility |
| AC-9 | **Previous page** and **Next page** are links to the adjacent pages, crossing chapter boundaries in both directions and skipping chapters with no pages. The first page has no **Previous page**. | test: unit "neighbours across chapters"; e2e "turn pages with links" | S2.1, S2.2, S2.5, S2.6; design-comic-turn-pages#states-and-errors |
| AC-10 | On the last page, **Next page** is replaced by **You're all caught up!** with the status line ("New pages are on the way.", "This comic is on a break.", "That's the end of the story.") and **Back to series**; **Previous page** stays. | test: unit "end notes"; e2e "last page" | S2.7; docs-reading-comics#when-you-reach-the-end |
| AC-11 | The right and left arrow keys follow **Next page** and **Previous page**, except with a modifier key held, in a text field, or while zoomed in. | test: e2e "arrow keys" | S2.4; design-comic-turn-pages#states-and-errors |
| AC-12 | A horizontal swipe left or right on a touch screen follows **Next page** or **Previous page**; mostly vertical swipes do not. | test: e2e "swipe" | S2.3; design-comic-turn-pages#states-and-errors |
| AC-13 | Every reader page has **Back to series**, and the page image reserves its space with the "Loading page… If it doesn't appear, try refreshing." message behind it. | test: e2e "reader page" | S1.8; docs-reading-comics#if-something-doesnt-look-right |
| AC-14 | An unknown series, chapter, or page address shows **Page not found** with a link to **Comics**. | test: e2e "not found" | design-comic-start-reading#states-and-errors; docs-reading-comics#if-something-doesnt-look-right |
| AC-15 | On a 360 by 640 screen, **Start reading** is visible on the series page without scrolling. | test: e2e "phone layout" | design-comic-start-reading#layout |
| AC-16 | The series page and a reader page have no serious or critical axe issues, and every link and button is reachable with Tab. | test: e2e "accessibility" | S1.9; design-comic-start-reading#accessibility |
| AC-17 | The editor has a Chapter type (series, number, optional title, pages with alt text and panel regions); a series' web address is required. | command: `npm run check` in `sanity-studio/` (schema compiles); review of the schema files | design-comic-start-reading#what-star-enters |
| AC-18 | A runnable tutorial walks a fan from **Comics** to the second chapter. | command: `node .rfr/checks/tutorial-run.mjs . --base-url <preview>` | process stage 12 |

## Scope

- In:
  - `src/lib/comics/model.ts` (new): types, page addresses, labels, neighbours, end notes; pure functions.
  - `src/lib/comics/source.ts` (new): loads series with chapters from Sanity, or from test fixtures when `KETTLEBIRD_FIXTURES=1`.
  - `src/pages/comics/[slug].astro` (replaces the stub): series page.
  - `src/pages/comics/[slug]/[chapter]/[page].astro` (new): reader page, with a small script for arrow keys, swipes, and background fetching.
  - `src/pages/404.astro` (new): **Page not found**.
  - `src/pages/comics.astro`: link only series with a web address; page counts from chapters.
  - `sanity-studio/schemas/objects/`: new `comicChapter`; `comicSeries` loses `pages` and requires `slug`; `comicPage` removed (no content exists, so nothing is migrated).
  - Tests: `tests/unit/` (Vitest), `tests/e2e/` (Playwright against `astro preview` of a fixture build), `tests/fixtures/comics.ts`.
  - `docs/tutorials/reading-comics.md`.
- Out: page addresses beyond what story 1 needs (sharing, newest page: story 3), announcements and focus handling (story 4), Star's bulk upload and publish status (story 5 and the content-editing epic), page-flip and panels (second comic epic), Netlify config.

## APIs and assumptions

- APIs used: Astro 5 `getStaticPaths` with nested dynamic routes (installed `astro` 5.16); `@sanity/client` `fetch` and `@sanity/image-url` (installed); Sanity schema `defineType`/`defineField` (studio `sanity` 5.x); Playwright 1.63.0 (the version installed with this environment's browsers, and the one rules-for-robots' tutorial runner is tested with); Vitest 5.
- Assumptions that could be wrong:
  - The site builds with no Sanity content, so tests use fixtures; confirmed by the empty dataset (design-cms).
  - Screen readers in browse mode keep arrow keys, so the arrow-key handler doesn't interfere; to be checked in story 4's manual screen reader pass.

## Non-functional requirements

- WCAG 2.1 AA (REQ-site constraint); axe check in AC-16.
- No script is needed to read: every page turn is a link (design-comic-turn-pages).
- Page images are requested at screen widths through the Sanity image service, never the original file.

## Delivery

- Plan item: epic-comic-reader, stories 1 and 2.
- Pull requests: added when opened.

## Risks and decisions

- Removing `comicPage` and `comicSeries.pages` is a schema change, safe only because the dataset is empty (checked 2026-11-01). If content appears first, this needs a migration.
- Adds the project's first test setup (Vitest, Playwright) and a `test` script that runs them; `npm run check` keeps `astro check`.
