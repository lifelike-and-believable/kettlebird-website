---
id: design-comic-panels-two-up
status: approved
derived-from:
  - design-comic-panels#decisions: ace7e1b001af
  - design-comic-panels#flow-a-fan: c81bc4915a90
  - design-comic-panels#the-panel-view-reader: f40b7f9e2817
  - design-comic-panels#states-and-errors: 065f4c45926d
  - design-comic-panels#accessibility: 939d94d8c7e4
  - design-comic-spread-and-flip#how-it-works: c145d0b6b751
  - design-comic-spread-and-flip#accessibility: a08b94a31151
  - persona-fan#context-of-use: 38883e5abc09
---

# Panel by panel with two pages side by side: design

<!-- docs/design/comic-panels-two-up.md. A design amendment asked for by the lead (2026-11-06), after testing
panel-by-panel reading on a laptop: in a comic that shows two pages side by side, the Panel by panel button
wasn't there. The lead decided panel by panel should be offered with one or two pages showing, and that turning
it on switches the reader to one page at a time. Mock-ups are in docs/design/mockups/comic-panels-two-up/ (PNG
images, and mockups.html, the source they are rendered from with render.mjs, using the placeholder pages of
design-comic-panels' mock-ups). -->

## Personas

- persona-fan: reads in short sessions and comes back when Star posts something new (#context-of-use). A fan who reads panel by panel should find it wherever they read. Today, in a comic that shows two pages side by side, a wide screen (a laptop, or a tablet held sideways) never shows **Panel by panel**, so the way they read depends on the screen they happen to be on.

## The change

design-comic-panels decided "Panel by panel is for one page at a time": with two pages side by side, the button isn't shown (#decisions, #states-and-errors). This design replaces that decision.

**Offered with one or two pages showing.** In a chapter where at least one page has panels, **Panel by panel** is in the reader bar beside **All pages** on any screen, wide or narrow (mock-up 1).

**Turning it on switches to one page at a time.**
- The reader shows the page in the address, zoomed into its first panel, exactly as panel by panel works on a narrow screen (design-comic-panels#the-panel-view-reader). The panel fits the page area for one page, with its 4% margin in the page area's colour, and nothing else of the page shows (mock-up 2).
- In a pair, the page in the address is usually the first one, page 4 of pages 4 and 5. A fan who arrived from a link to page 5, or turned a tablet sideways on it, sees page 5. The address and **Share** stay on the page shown.
- While it's on, the reader is the one-page reader on every screen, in every way:
  - **Next**, **Previous**, the arrow keys and swipes go a page at a time, and links and their names say "page";
  - the bar reads "… · Page 4 of 12 · panel 1 of 5";
  - announcements are those of a single page;
  - the end note follows the one-page rules;
  - pages are fetched ahead one at a time.
- **Before the first frame.** The choice is read before the page is first drawn, so the reader never shows a pair and then collapses to one page, on turning pages or on loading.

**Reading goes page by page.**
- After page 4's last panel, **Next** turns to page 5 at its first panel, then page 6, and so on (mock-ups 3 and 4).
- The turn between pages is the one-page page-flip, when the comic has the page-flip on.
- A spread (two pages drawn as one picture) shows as it does on a narrow screen: scaled into the one-page area and stepped through on its single picture.
- The page and panel sizes need the page's picture at the size a one-page view fetches, at least twice the page area's width, so lettering stays sharp when a panel is zoomed in. On a wide screen today, a page in a pair is fetched at half the screen's width, which is too small.

**Turning it off goes back to two pages side by side** (mock-up 5).
- The reader shows the pair that holds the page the fan was on. On page 5, the fan sees pages 4 and 5. A page that shows alone in pairs shows alone, as the pairing rules place it (design-comic-spread-and-flip#how-it-works): the first page when the comic opens on the right, a spread, or a last page with no partner.
- The address stays on the page the fan was on; switching adds no history entry. After turning it off on page 5, **Back** goes to the page before, as it would from page 5 with pairs showing.
- Switching from a pair to one page, or back, is instant: no slide or zoom between the two layouts, with or without reduced motion.

**The choice is remembered** in that browser, as now (`kb-panels`). Turned on in a narrow window, it's still on when the window is widened, and the other way round.

**Unchanged:** the bar's words in panel view, the controls' names, swipes and arrow keys, pinch-zoom, **First**, **Newest**, **All pages** and links opening at a page's first panel, the page's address and history entry while panel by panel is on, and the announcements of design-comic-panels#accessibility.

## Mock-ups

The reader at a laptop's 1280 × 800, as it opens, scrolled past the site's header. Placeholder pages from design-comic-panels' mock-ups. Source: `mockups/comic-panels-two-up/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | Two pages side by side, with **Panel by panel** in the bar | `mockups/comic-panels-two-up/1-two-up-button.png` |
| 2 | Panel by panel on, at page 4 (the page in the address): one page at a time, its first panel | `mockups/comic-panels-two-up/2-panel-view-one-page.png` |
| 3 | The reading order across a pair: page 4's panels 1 to 5, then page 5's (numbered here for clarity) | `mockups/comic-panels-two-up/3-reading-order.png` |
| 4 | After page 4's last panel, **Next** opens page 5 at its first panel | `mockups/comic-panels-two-up/4-next-page.png` |
| 5 | Panel by panel off, on page 5: back to pages 4 and 5 side by side, the address still page 5 | `mockups/comic-panels-two-up/5-back-to-two-up.png` |

## States and errors

| Situation | What happens |
|---|---|
| Two pages side by side, panel by panel off | **Panel by panel** shows, not pressed; pages pair as now. |
| Panel by panel on, on a wide screen | The one-page reader, as on a narrow screen. |
| Turned on with page 5, the second of a pair, in the address | Page 5 at its first panel. |
| The newest page, shown in a pair beside the page before it | Panel by panel opens the page in the address; **Next** on its last panel can't be used, and the end note shows, as on a narrow screen. |
| Turned off on a page that pairs | The pair that holds it; the address doesn't change. |
| Turned off on a page that shows alone in pairs | That page alone. |
| The window is resized, or a tablet turned, while panel by panel is on | Nothing changes: it stays one page at a time. |
| A chapter with no panels on any page | No **Panel by panel**, on any screen, as now. |
| No script | Whole pages, paired as now; no **Panel by panel**. |

## Accessibility

- The toggle button, its announcements on switching it on, at each panel and on arrival at a page, and the page's description are unchanged from design-comic-panels#accessibility.
- Switching it off announces what arriving at that view announces: for a pair, "Chapter 2: The Long Road, pages 4 and 5 of 12." (design-comic-spread-and-flip#accessibility); for a page alone, "Whole page", as now; for a spread, "Page 5 of 12, two-page spread."
- Focus stays on **Panel by panel** when it's switched on or off.

## For the guide

The fans' guide `reading-comics.md`, **Read panel by panel**:
- The opening, "When the reader shows one page at a time, as it does on a phone", no longer limits where the button is: it's there whenever the chapter has panels.
- The line "Panel by panel isn't offered when the reader shows two pages side by side…" becomes: with two pages side by side, choosing **Panel by panel** shows one page at a time, and choosing it again goes back to two pages.
- "You stay on the same page" stays true.

## For the spec to check

- With two pages side by side (1280 × 800, a comic with pairs on), **Panel by panel** shows in a chapter with panels and not in one without.
- Turning it on at a pair shows the page in the address, at its first panel, with the one-page bar, controls, links and names; arriving at the second page of a pair from its address and turning it on shows that page.
- **Next** from page 4's last panel goes to page 5's first panel, not page 6.
- Turning it off on page 5 shows pages 4 and 5, keeps the address on page 5 and adds no history entry; on a page that shows alone, that page alone.
- A page loaded or turned to with panel by panel on, on a wide screen, never shows two pages first.
- The choice survives a reload, and a narrow window widened (and the other way round) in the same browser.
- Resizing the window with panel by panel on keeps one page at a time.
- Switching it off with two pages announces the pair; focus stays on the button.
- With panel by panel on at 1280 × 800, the page's picture is fetched at least twice the page area's width.
- These change from the panels spec (docs/specs/comic-reader-panels.md): AC-11's "It isn't shown with two pages side by side", the end-to-end test "the button", which checks it isn't, and the Scope's "Out: panels for two pages side by side".
- Everything else checked for panel by panel at one page at a time passes unchanged.

## Decisions at review

None open: the lead decided both parts (2026-11-06): panel by panel is offered with one or two pages showing, and it switches to one page at a time.

## Persona walkthrough

A walkthrough for persona-fan (2026-11-06), on a laptop, a tablet turned between portrait and landscape, a shared link to a right-hand page, the keyboard, a screen reader and reduced motion, checked the design against the reader's code. It found three blocking problems, five misleading ones and four slower ones. All are addressed above:
- **Blocking:**
  - turning it on at the left-hand page would have jumped a fan on page 5 back to page 4, with the address and **Share** still on 5 (now the page in the address);
  - the wide screen's links and states would have stayed in charge, so **Next** from page 4's last panel would have skipped page 5 (now the one-page reader in every way);
  - the reader drew the pair first and then collapsed it, and the page-flip used the pair's names (now applied before the first frame, with the one-page flip).
- **Misleading:**
  - the choice is remembered per browser, not across devices;
  - the persona's context was overstated;
  - the switch-off announcement now matches the pair's own;
  - the panels spec's checks that change are named;
  - mock-ups 2 and 4 showed a sliver of the next panel, and mock-up 5 didn't show the fan was on page 5 (both redrawn).
- **Slower:**
  - history on switching (none added; Back as from that page);
  - the newest page in a pair, a page alone, and a spread (states added);
  - the picture's size for zooming (at least twice the page area's width);
  - the switch between layouts (instant).
