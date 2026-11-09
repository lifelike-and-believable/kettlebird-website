---
status: draft
---

# Oldest first in a subfolder

<!-- Technical spec for design-portfolio-order (approved 2026-11-09: a subfolder's Order of pieces, Newest first
or Oldest first, its own; the sections stay newest first; an oldest-first thumbnail shows its oldest; undated
last; no sign of the order on the site). Amends portfolio-folders AC-4 (ties), AC-8 (the grid's pieces) and
AC-18 (the subfolder's fields). A plan-feature spec without an id. -->

## Problem

Every Portfolio subfolder shows its pieces newest first. Some tell a story from the start (a comic's pages, a client's covers in the order they were made), and Star can't show them that way.

## User stories

- As Star, I want to set a subfolder to show its pieces oldest first, so that work that tells a story reads from its start. (design-portfolio-order#personas)
- As a fan, I want the Portfolio's sections to keep showing what's new first. (design-portfolio-order#personas)

## Acceptance criteria

Source: design-portfolio-order sections as named.

| # | Criterion | Verified by | Source |
| --- | --- | --- | --- |
| AC-1 | `orderPieces(pieces, order)` puts dated pieces newest first for `'newest'` (and when `order` is unset) and oldest first for `'oldest'`; pieces with the same date in title order (A to Z) in both; undated pieces after every dated one, in title order, in both. `sortPieces` is `orderPieces(pieces, 'newest')`. (Ties by title amend portfolio-folders AC-4.) | test: unit "order" | #on-the-site |
| AC-2 | `buildFolders`: each section's row stays newest first; a subfolder sits where its newest piece would be (by `newestPiece`, the first of its pieces newest first), whatever its order; its `pieces` are in its own order. | test: unit "folders"; component "the thumbnail" | #on-the-site |
| AC-3 | A subfolder's thumbnail shows the first pieces in its order: an oldest-first subfolder of twelve pieces at 3 × 3 shows its oldest nine; its count is all twelve. | test: unit "grid"; component "the thumbnail" | #on-the-site |
| AC-4 | An open subfolder's row shows its pieces in its order, and full screen (`folderTurnOrder`) turns through them in that order; "1 of 2 · Book covers" is its first piece. | test: unit "folders"; component "the open row" | #on-the-site |
| AC-5 | A subfolder's page keeps its newest piece as the link picture, whatever its order. | test: unit "link picture" | #on-the-site |
| AC-6 | The editor: a subfolder's fields are Name, Web address, Section, Grid size, **Order of pieces**. Order of pieces is a radio choice, **Newest first** (`newest`) or **Oldest first** (`oldest`), starting at Newest first, with help "The order its pieces show in when it's open, and which of them its thumbnail shows. Pieces without a date come last." Its list row adds " · Oldest first" when it's set: "Fan Work · 2 × 2 · 4 pieces · Oldest first". | test: unit "editor" | #in-the-editor |
| AC-7 | Grid size's help is "How many of its pieces its thumbnail shows, starting from the first in its order. Computers show at most 3 × 3, phones 2 × 2."; the hint says "shows the first 9" where it said "the newest 9"; the Date help is "When you made it. The portfolio shows newest first, except in a subfolder set to oldest first; pieces without a date come last." | test: unit "editor" | #words |
| AC-8 | The site's and Preview's subfolders carry `order`; Preview of a subfolder shows its draft order. | test: unit "query and preview" | #on-the-site |
| AC-9 | `docs/user/editing-your-site.md` has the Order of pieces row, "a grid of its first pieces" and the new Date and Grid size text; `docs/user/viewing-artwork.md` has "one square of its first pieces" and the sentence about order; `docs/design/portfolio-folders.md` notes at "Subfolders" that design-portfolio-order adds the choice. | test: unit "documents" | #words |

## Scope

- In: `src/lib/portfolio/folders.ts`; `src/lib/queries.ts` (`SUBFOLDERS_QUERY`); `src/components/pages/PortfolioPage.astro` (the link picture); `sanity-studio/schemas/objects/portfolioSubfolder.ts`; `sanity-studio/lib/editor-content.ts`; the guides; `docs/design/portfolio-folders.md`.
- Tests: `tests/unit/portfolio-order.test.ts` and `tests/unit/portfolio-order-grid.test.tsx` (new), and the unlocks below.
- Out: an order for the sections; any sign of the order on the site.

## APIs and assumptions

- Sanity's `initialValue` sets Newest first on new subfolders only; older ones have no value, read as newest.
- Dates are `YYYY-MM-DD` strings, compared as strings.

## Non-functional requirements

- `orderPieces`, `newestPiece` and the changed parts of `buildFolders` are mutation tested.

## Delivery

- Plan item: design-portfolio-order (PR 200).

## Risks and decisions

- The shared fixture is unchanged: Book covers' Preview is used by many end-to-end tests, so the Preview check uses its own small fixture in the unit test, and the page's order is checked in the component test.
- Existing tests that name the old words are unlocked; see the front matter.
