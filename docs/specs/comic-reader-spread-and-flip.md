---
status: draft
tests-commit: 361da635dbf727c09cabbdc05507b53bc424b53d
unlocks:
  - tests/e2e/comic-spread-and-flip.spec.ts: three corrections found by the first run against the build. The pair-layout accessibility check counted a moderate heading-order finding in the site's footer; it now counts serious and critical findings, like the other reader tests. The sideways-phone check wanted the spread within 40 px of the window's width, but the site's side margins are wider; it now compares with the reader's own width. The flip recorder read a transition's types before the page's handler had added them; it now reads them once the transition is ready. The criteria are unchanged.
  - tests/unit/comic-spreads-edges.test.ts (new): mutation testing showed nothing checked a pair's announcement in a series without chapter names, blank or missing alt text in a pair, a page alone that isn't before a spread, or reading a picture's size from its asset id. Added; the criteria are unchanged.
---

# Comic reader: two-page spreads and the page-flip

<!-- Technical spec for story-comic-reader-flip-and-panels-two-page-spread (story 1) and
story-comic-reader-flip-and-panels-page-flip (story 2) of epic-comic-reader-flip-and-panels, which go
live together, from design-comic-spread-and-flip (with its mock-ups), docs-publishing-comics and
docs-reading-comics. A plan-feature spec without an id. -->

## Problem

The reader shows one page at a time on every screen, and a page change is an instant swap. On a laptop, fans want to see facing pages side by side, as in a printed comic, with Star's two-page spreads across both sides, and a turn that looks like a page turning over. Star needs to say how each chapter's pages pair up and which pages are spreads.

## User stories

- As a fan on a wide screen, I want to see two pages side by side, like an open comic, so that spreads and facing pages read the way Star drew them. (story-comic-reader-flip-and-panels-two-page-spread)
- As a fan, I want turning a page to look like turning a page in a printed comic, so that reading on the site feels like reading Star's book. (story-comic-reader-flip-and-panels-page-flip)

## Acceptance criteria

Source: S1.n and S2.n are the two stories' nth criteria; design and docs sections as named. "Wide" means the width test in AC-3 passes; "narrow" means it doesn't.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | A chapter has **Open on**, after **Title**: radio choices **The right, like a printed comic** (`right`, the default, also for chapters saved before) and **The left, pairing from page 1** (`left`), with the design's help text. A page has **Two-page spread**, a tick box under **Alt text**, with the design's help text. The site reads both. Neither changes any page's address, so neither adds a publish warning. | test: unit "fields", "addresses don't change" | S1.2, S1.3; design-comic-spread-and-flip#what-star-enters, #flow-star |
| AC-2 | A chapter's wide view groups its pages in order: a page alone on the right, a pair, a page alone on the left, or a spread. With **Open on** right, page 1 is alone on the right; with left, pages 1 and 2 pair. A spread page is a group of its own; a page that would have waited on the left for a partner before it is alone on the left, and the page after a spread starts a new pair on the left. A last page with no partner is alone on its side. A chapter of one page shows it on the side **Open on** names. | test: unit "pairing" | S1.2–S1.4; design-comic-spread-and-flip#how-it-works, #states-and-errors |
| AC-3 | The wide view shows when the window is at least 62.5em wide and in landscape; otherwise the reader shows one page, exactly as before. Resizing the window or turning a tablet switches without reloading or changing the address. At text size 200% on a 1280 × 800 window, the reader is narrow; at no size does it scroll sideways. | test: e2e "width test", "switches without reloading", "enlarged text is narrow" | S1.1; design-comic-spread-and-flip#how-it-works, #accessibility |
| AC-4 | Every page is still built at `/comics/<series>/<chapter>/<page>`; on a wide screen it shows its group. Each reader page carries both sets of links and states and the width test picks one, with no script: wide **Next** goes to the first page of the next group (into the next chapter after a chapter's last group), wide **Previous** to the first page of the previous group; **First** and **Newest** keep their addresses and are unusable on a wide screen when the group holds the series' first or newest page; the end note shows when the group holds the newest page. Arrow keys, swipes and the edge arrows follow the set that shows. | test: unit "wide links", "wide controls"; e2e "a link opens its pair", "turning by pairs", "the newest page in a pair", "no script" | S1.5, S1.6; design-comic-spread-and-flip#page-addresses, #flow-a-fan |
| AC-5 | The location line reads "Pages 2–3 of 12" for a pair (after the chapter label as before) and "Page 5 of 12 · two-page spread" for a spread page, on both views. A pair is announced as "Chapter 2: The Long Road, pages 2 and 3 of 12." then each page's alt text, left first; a spread page as "…, page 5 of 12, two-page spread." then its alt text. The end note follows, as before, when it shows. | test: unit "location", "announcements"; e2e "a link opens its pair" | S1.6; design-comic-spread-and-flip#accessibility |
| AC-6 | On a wide screen, **Previous** and **Next** keep their captions; their full names are "Previous pages" and "Next pages" when they lead to a pair, and "Previous page" and "Next page" when they lead to a page alone or a spread. | test: unit "wide controls" | design-comic-spread-and-flip#accessibility |
| AC-7 | A pair shows two pages of the same height, meeting at the spine with a shadow down the middle; a page alone sits on its own side with the other side empty; a spread covers both sides with no shadow. In a pair, each page is its own image with its own alt text, left before right. The edge arrows sit at the outer edges. On the newest group, the pages are shortened so the end note and its **Back to series** are on the first screen of a 1280 × 800 window. | test: e2e "pair layout", "the newest page in a pair" | S1.1, S1.3, S1.4; design-comic-spread-and-flip#layout |
| AC-8 | On a narrow screen a spread page is shrunk to fit like every page. In portrait, "Turn your phone sideways to see it bigger." shows under it, hidden from screen readers; in landscape, the hint is gone and the spread fills the width. | test: e2e "a spread on a phone" | S1.3; design-comic-spread-and-flip#how-it-works |
| AC-9 | On a contact sheet, a spread's picture is twice as wide (two of the three places on a phone), numbered "5 · spread", its link named "Page 5, two-page spread" (then ": " and its alt text, if any). | test: unit "sheet"; e2e "a spread on the sheet" | S1.6; design-comic-spread-and-flip#flow-a-fan |
| AC-10 | In the editor, a spread page shows in the pages grid marked "Two-page spread". In the page panel, under the tick box: on a spread that leaves the page before it alone, "This chapter opens on the right, so page 4 shows alone on the left, before this spread." ("on the left" for a chapter opening on the left); on a picture wider than tall that isn't ticked, "This picture is wider than it is tall. Is it a two-page spread? If so, tick Two-page spread; otherwise it shows small, on one side." | test: unit "editor notes" | design-comic-spread-and-flip#flow-star, #states-and-errors |
| AC-11 | A turn to the next or previous reader page by **Previous**, **Next**, the edge arrows, the arrow keys or a swipe plays the page-flip, as a cross-document view transition: forward or back, about 0.4 s and never more than 0.5 s. Other navigations (**First**, **Newest**, links, history) don't play it. It doesn't play under reduced motion, or when the new page's picture isn't ready. The address, focus, announcements and preloading are the same as without it, and the next group's pictures are fetched ahead. | test: unit "turn direction"; e2e "the page-flip", "no flip under reduced motion" | S2.1–S2.5; design-comic-spread-and-flip#the-page-flip |
| AC-12 | The preview's **Computer** frame is never taller than it is wide, so a chapter's preview shows pairs whatever the size of the pane. | test: unit "preview frame" | design-comic-spread-and-flip#flow-star |

## Scope

- In:
  - `src/lib/comics/pairing.ts` (new, pure, no imports): the groups, shared with the editor. `src/lib/comics/spreads.ts` (new, pure): the wide view's links, controls, location and announcements, and the turn's direction.
  - `src/lib/comics/model.ts`: `openOn` on chapters and `spread` on pages; the location line for a spread. `src/lib/comics/sharing.ts`: the announcement for a spread. `src/lib/comics/navigation.ts`: the sheet's spread pictures.
  - `src/lib/comics/source.ts`: `openOn` and `spread` from Sanity.
  - `src/components/pages/ReaderPage.astro`: the group's pages, both sets of links, the width test, the page-flip. `src/components/comics/ContactSheet.astro`: wide pictures.
  - `sanity-studio/schemas/objects/comicChapter.ts`, `sanity-studio/lib/comic-pages.ts`, `sanity-studio/components/SpreadInput.tsx` (new), `sanity-studio/components/PagesInput.tsx`: the fields, the grid mark and width, and the notes. `sanity-studio/lib/preview.ts`, `sanity-studio/components/PreviewPane.tsx`: the frame's height.
  - `tests/fixtures/comics.ts`: a series with spreads, **Open on** left, and a pair holding the newest page.
  - Tests: `tests/unit/comic-spreads.test.ts`, `tests/e2e/comic-spread-and-flip.spec.ts`. The other comic e2e files check one page at a time, so they run in a window narrower than the width test (recorded under those specs' unlocks). `docs/tutorials/reading-comics.md`: the runner's browser is laptop-sized, so the tutorial turns by pairs.
- Out: panels (stories 3 to 5).

## APIs and assumptions

- Cross-document view transitions (`@view-transition { navigation: auto }`, the `pageswap` and `pagereveal` events, and view transition types) in Chrome, Edge and Safari 18.2+. Other browsers ignore them and change pages as before.
- `display: none` removes an element from the accessibility tree, so each view's links and text can be in the page with only one exposed. A lazily loaded image that isn't displayed isn't fetched.
- Media queries in `em` use the browser's default text size, so enlarged text narrows the reader.

## Non-functional requirements

- No script is needed to read either view; scripts add keys, swipes, the flip's direction and preloading.
- The flip adds no request: it animates snapshots of the two pages.

## Delivery

- Plan item: epic-comic-reader-flip-and-panels, stories 1 and 2. No set-up by the lead: the new fields are optional, and existing chapters open on the right.

## Risks and decisions

- A page reached from a link shows the whole group it's in, and its address stays as it is; **Next** then goes to the next group's first page, so after one turn the address names the left-hand page.
- The wide view's links are computed for every page, not only the first of a group, so a shared link to a right-hand page works without a redirect.
- The flip's direction is decided as the old page leaves (`pageswap`), from whether the new address is the page's wide or narrow previous or next link; any other address skips the flip.
- The preview's **Computer** frame is capped at the height of a laptop (800 px) for chapters only; other items keep the pane's full height.
- Each reader page puts the wide controls before the narrow ones. Only one set shows, and the hidden set is out of the Tab order and the accessibility tree; tools that find a control by its visible word and take the first match (the tutorial runner) find the laptop's.
- The page-flip turns snapshots of the pages with `rotateY`, in two halves: the leaving page turns edge-on, then the arriving one turns flat. A page that has no partner on the other side (a page alone, a spread) turns the same way on its own.
- A spread's page in the editor's grid spans two columns by a style that matches a marked tile (`:has()`), since the grid's cells belong to Sanity.
