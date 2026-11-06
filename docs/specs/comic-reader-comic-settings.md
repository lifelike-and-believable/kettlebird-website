---
status: implemented
tests-commit: 0ce321fdcfd6a7cb30431a5c8ff79063416f0797
unlocks:
  - tests/unit/comic-settings-edges.test.ts (new): mutation testing showed nothing checked a preview turn to an address in the chapter that isn't a page number (its sheet, page 0, a padded number, a page's own sheet). Added; the criteria are unchanged.
  - tests/unit/comic-settings.test.ts: AC-1 checked How it reads' description in full; comic-reader-page-size (2026-11-06) adds a line naming the preview's frame to it, so it now checks the description starts with this spec's line. The criterion is unchanged.
---

# Comic reader: settings per comic

<!-- Technical spec for story-comic-reader-flip-and-panels-comic-settings (story 6 of
epic-comic-reader-flip-and-panels), from design-comic-spread-and-flip ("Settings per comic", with
mock-ups 13 to 15), docs-publishing-comics and docs-reading-comics. Builds on
comic-reader-spread-and-flip (implemented). A plan-feature spec without an id. -->

## Problem

Two pages side by side and the page-flip now apply to every comic. The lead decided they should be Star's choice, comic by comic, and off until Star turns them on: some comics weren't drawn as facing pages, and the flip doesn't suit every comic.

## User stories

- As Star, I want to choose for each comic whether a wide screen shows two pages side by side and whether pages turn with the page-flip, so that each comic reads the way it was drawn. (story-comic-reader-flip-and-panels-comic-settings)

## Acceptance criteria

Source: S6.n is the story's nth criterion; design and docs sections as named. "Pairs" means **Two pages side by side**; "the flip" means **Page-flip**.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | A comic has **How it reads**, after **Kind**: two tick boxes, **Two pages side by side** (`twoUp`) and **Page-flip** (`pageFlip`), with the design's help text, both unticked for a new comic, and the line "Preview a chapter to see how it reads." The site reads both; a comic without them (every comic saved before) has both off. | test: unit "fields", "defaults" | S6.1; design-comic-spread-and-flip#settings-per-comic |
| AC-2 | With pairs off, every screen shows one page at a time: each reader page carries one set of links and states (the narrow one), so turning, the controls, the end note, the bar and the announcements are as before comic-reader-spread-and-flip, with no script needed. | test: unit "pairs off"; e2e "pairs off on a laptop", "no script" | S6.2; design-comic-spread-and-flip#settings-per-comic |
| AC-3 | With pairs off, a page marked **Two-page spread** shows alone, on a wide screen as wide as the reader allows (up to the width of two pages) and on a narrow one shrunk to fit, with the hint to turn the phone sideways, as now. The bar reads "Page 5 of 12 · two-page spread". **All pages** still shows it twice as wide. | test: e2e "a spread alone" | S6.2; design-comic-spread-and-flip#settings-per-comic |
| AC-4 | With pairs on, the comic reads as comic-reader-spread-and-flip specifies, with each chapter's **Open on**. | test: e2e "pairs on" (the existing comic-spread-and-flip tests, on a comic with pairs on) | S6.3 |
| AC-5 | With the flip off, a reader page doesn't opt in to cross-document view transitions, so pages change at once whatever the system's motion setting. With it on, turns play the flip as comic-reader-spread-and-flip AC-11 specifies, still skipped under reduced motion. With the flip on and pairs off, every turn is the single-page turn (`kb-page`), on every screen. | test: e2e "flip off", "flip on, pairs off" | S6.4; design-comic-spread-and-flip#settings-per-comic, #the-page-flip |
| AC-6 | Turning either setting on or off changes no page's address, and publishing the comic asks nothing about shared links. | test: unit "addresses don't change" | S6.5 |
| AC-7 | In a chapter of a comic with pairs off (the comic's current setting, published or not), **Open on** keeps its choice and stays changeable, under the note "Two pages side by side is off for this comic, so this has no effect. Turn it on in the comic's How it reads."; the page panel's note about a page left alone before a spread doesn't show; the question about a wide picture that isn't ticked still does. | test: unit "editor notes" | S6.6; design-comic-spread-and-flip#settings-per-comic |
| AC-8 | A chapter's preview uses its comic's settings as they are now, its draft's if it has one. **Computer** shows pairs only when pairs are on. | test: unit "preview settings" | S6.7; design-comic-spread-and-flip#settings-per-comic |
| AC-9 | In a chapter's preview, **Previous** and **Next**, the edge arrows, the arrow keys and swipes move between that chapter's pages within the preview (its address with `page=N`), with the flip when it's on; a turn to another chapter, and every other link, stays inactive, as before. | test: unit "preview turns"; e2e "turning in the preview" | S6.7; design-comic-spread-and-flip#settings-per-comic |

## Scope

- In:
  - `src/lib/comics/model.ts`: `twoUp` and `pageFlip` on a series. `src/lib/comics/source.ts`: read them (`true` only when set).
  - `src/lib/comics/spreads.ts`: the wide view only when pairs are on. `src/lib/comics/navigation.ts`, `sharing.ts`: unchanged.
  - `src/components/pages/ReaderPage.astro`: one view when pairs are off; the spread alone at the reader's width; the view-transition opt-in and the flip scripts only when the flip is on; turn links in the preview.
  - `src/lib/preview/load.ts`, `src/components/PreviewFrame.astro`: the comic's current settings in a chapter's preview; turn links that work.
  - `sanity-studio/schemas/objects/comicSeries.ts`, `sanity-studio/lib/comic-pages.ts`, `sanity-studio/components/SpreadInput.tsx`, the chapter's **Open on**: the fields, the note, the hidden page-alone note.
  - `tests/fixtures/comics.ts`: Kettle Tales and Open Book with both on (so the reading tutorial and the spread tests keep their pairs); One Shot with both off; a new series, Single Sheets, with pairs off, the flip on, and a spread.
  - Tests: `tests/unit/comic-settings.test.ts`, `tests/e2e/comic-settings.spec.ts`.
- Out: panels (stories 3 to 5).

## APIs and assumptions

- `@view-transition` is a document-wide rule, so it is written into the page only when the flip is on; there's no per-element opt-out.
- The preview's reader page is in an iframe on the editor's own origin; cross-document view transitions run within it.
- Sanity's `fieldset` groups the two tick boxes under a heading without changing how they're stored.

## Non-functional requirements

- A comic with pairs off ships no second set of links and no wide-view styles' effects: its pages are as small as before comic-reader-spread-and-flip.

## Delivery

- Plan item: epic-comic-reader-flip-and-panels, story 6. Once live, every comic shows one page at a time without the flip until Star turns the settings on; the guides already say so.

## Risks and decisions

- Fixture comics turn the settings on where tests and the tutorial rely on pairs, rather than rewriting those tests, so the earlier specs' criteria stay checked as they were.
- In the preview, turn links are rewritten to the preview address only for pages of the same chapter; the preview never shows another chapter.
