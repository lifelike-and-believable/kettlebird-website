---
status: draft
tests-commit: []
unlocks: []
---

# Comic reader: contact sheet and player-style controls

<!-- Technical spec for story-comic-reader-contact-sheet (story 6) and
story-comic-reader-play-controls (story 7), which go live together, from
design-comic-sheet-and-controls (with its mock-ups) and docs-reading-comics. A plan-feature spec
without an id. -->

## Problem

Fans turn pages with a **Previous page** and **Next page** pair, and can't see a chapter at a glance. Star asked for player-style controls (one arrowhead for a page, two for the start and the newest page) and a contact sheet of a chapter's pages. The design adds both, and a way to move between chapters' sheets.

## User stories

- As a fan, I want to see all of a chapter's pages as small pictures and open any of them, so that I can find a scene again or see how far a chapter goes. (story-comic-reader-contact-sheet)
- As a fan, I want player-style controls to go one page back or forward, or straight to the first or newest page, so that I can catch up or start over in one tap. (story-comic-reader-play-controls)

## Acceptance criteria

Source: S6.n and S7.n are the contact-sheet and play-controls stories' nth criteria; design and docs sections as named.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | Under each reader page, in a navigation region named "Page navigation", four links in order: **First**, **Previous**, **Next**, **Newest**, named "First page of the series", "Previous page", "Next page", "Newest page of the series". Each has a drawn (SVG) icon hidden from screen readers above its always-visible caption; the full name shows in a label above the control on hover and on keyboard focus. All four are the same width and colour, at least 56 px tall. | test: unit "controls"; e2e "controls", "the full name shows on hover and on focus" | S7.1, S7.2; design-comic-sheet-and-controls#layout, #accessibility |
| AC-2 | **Previous** and **Next** turn one page, across chapters as before. **First** opens the series' first page and **Newest** its newest page, skipping empty chapters. On a complete series the last control reads **Last**, named "Last page of the series". | test: unit "first and newest"; e2e "first and newest" | S7.1, S7.3; design-comic-sheet-and-controls#flow |
| AC-3 | A control that can't be used is `<a role="link" aria-disabled="true">` with its name and no address, faded with a dashed border, in its place: **First** and **Previous** on the series' first page, **Next** and **Newest** on its newest page (where the end note shows as before). A series with one page has no controls, only the end note. The arrow keys and swipes ignore unusable controls. | test: unit "controls that cannot be used"; e2e "controls that cannot be used" | S7.4; design-comic-sheet-and-controls#states-and-errors, #accessibility |
| AC-4 | Home and End are not used by the reader; Tab skips unusable controls. | test: e2e "Home and End scroll; Tab skips unusable controls" | design-comic-sheet-and-controls#states-and-errors (lead's decision) |
| AC-5 | On a 360 × 640 phone, **All pages** and all four controls are on the first screen with the page. On a 320 px phone with text at 200%, the controls wrap two by two (**Previous** and **Next** on top, **First** and **Newest** under them), and neither the reader nor the sheet scrolls sideways. | test: e2e "phone layout", "enlarged text on a narrow phone wraps two by two" | design-comic-sheet-and-controls#layout, #for-the-spec-to-check |
| AC-6 | In the reader bar, **All pages** (named "All pages in this chapter") links to the page's sheet at `<page address>/pages#page-N`. A chapter with one page has no **All pages** and no page sheet. | test: unit "sheet addresses"; e2e "All pages" | S6.1; design-comic-sheet-and-controls#addresses |
| AC-7 | A page's sheet, built ahead of time: tab title "Chapter 2, all pages · <series> · Kettlebird Creations" ("All pages · <series> · …" without visible chapters); asked not to be listed by search engines; heading "<series> · <chapter label>" (the series alone without visible chapters); "N pages"; a list named "Pages" of every page in order, each a link to the reader named "Page N: <alt text>" (or "Page N"), with its number under its picture; the page the fan came from marked "N · You were here", "You were here" in its name, not `aria-current`, and scrolled into view; three a row on a phone; small images, `loading="lazy"`, with width and height; **← Back to page N** and **Back to series** above and under the pictures. | test: unit "page sheet"; e2e "page sheet", "a series without chapter names" | S6.1–S6.4; design-comic-sheet-and-controls#layout, #accessibility |
| AC-8 | Each chapter with pages has a sheet at `<chapter address>/pages` that marks nothing, opens at the top, and has **Back to series** without **← Back to page**. A chapter with no pages has none. | test: unit "chapter sheet"; e2e "chapter sheet" | design-comic-sheet-and-controls#addresses |
| AC-9 | On a sheet of a series with visible chapters and more than one chapter with pages: a fold-out (`<details>`), folded by default, whose line reads "Chapter 2 of 4 · All chapters" (the prologue's title for chapter 0; "of" the highest chapter number with pages), listing every chapter with pages in a navigation region named "Chapters", each with its page count; the current one is marked "you're here" and isn't a link; the others open their chapter sheets. | test: unit "chapter list"; e2e "chapter list" | S6 (amended); design-comic-sheet-and-controls#layout, #accessibility |
| AC-10 | Under the pictures, **← Chapter 1** and **Chapter 3 →** link to the chapter sheets either side, named "Previous chapter: Chapter 1" and "Next chapter: Chapter 3", skipping chapters without pages; none before the first, after the last, or on a series without visible chapters or with one chapter that has pages. | test: unit "chapters either side"; e2e "chapters either side" | S6 (amended); design-comic-sheet-and-controls#layout |
| AC-11 | Reader pages and sheets have no serious or critical axe issues. | test: e2e "accessibility" | design-comic-sheet-and-controls#accessibility |
| AC-12 | The reading tutorial reaches **All pages**, a chapter sheet and **First**, and passes on the fixture build. | command: `node .rfr/checks/tutorial-run.mjs . --base-url <preview>` | docs-reading-comics |

## Scope

- In:
  - `src/lib/comics/navigation.ts` (new): the controls, sheet addresses and the sheets' contents; pure functions. `src/lib/comics/model.ts`: `thumb` on images, `chapterShortLabel` exported.
  - `src/lib/comics/source.ts`: small images for the sheet (150 and 300 px wide) from the image service.
  - `src/pages/comics/[slug]/[chapter]/[page].astro`: the controls, **All pages**, the page's height.
  - `src/pages/comics/[slug]/[chapter]/[page]/pages.astro` (new): a page's sheet. `src/pages/comics/[slug]/[chapter]/pages.astro` (new): a chapter's sheet. `src/components/comics/ContactSheet.astro` (new): what both draw.
  - `src/layouts/BaseLayout.astro`: an optional `noindex` property.
  - Tests: `tests/unit/comic-navigation.test.ts`, `tests/e2e/comic-sheet-and-controls.spec.ts`; `tests/e2e/comic-reader.spec.ts` changes for the unusable controls (recorded under that spec's unlocks); `docs/tutorials/reading-comics.md`.
- Out: the series page's **Read the newest page** link, sharing and link previews (story 3); screen reader notes in the guide (story 4).

## APIs and assumptions

- Astro's static routes: `[page]/pages.astro` sits beside `[page].astro`, and the static `pages.astro` segment wins over `[page]` for `/comics/<series>/<chapter>/pages`.
- `<details>` and `<summary>` give the fold-out's button and its collapsed and expanded states without a script.
- `aria-disabled="true"` on `role="link"` is announced as unavailable by the major screen readers; an `<a>` without `href` is not a Tab stop.
- `astro preview` serves the 404 page with status 404 for addresses that weren't built.

## Non-functional requirements

- The sheet never loads full pages: pictures use the 150 and 300 px images, lazily.
- No script is needed to read a sheet, open the chapter list or see the full names (CSS `:hover` and `:focus-visible`).

## Delivery

- Plan item: epic-comic-reader, stories 6 and 7. No set-up by the lead.

## Risks and decisions

- "Chapter N of M" counts to the highest chapter number with pages, so Kettle Tales (chapters 1, 2 and 4) reads "Chapter 2 of 4", following the series' own numbering; a prologue (chapter 0) reads by its title, "Prologue · All chapters".
- A marked picture's name ends "You were here" after its alt text ("Page 3: It falls. You were here").
- Page sheets exist only for pages in chapters with more than one page, so there's no sheet for a page the reader doesn't link from.
