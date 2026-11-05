---
id: design-comic-spread-and-flip
status: draft
derived-from:
  - story-comic-reader-flip-and-panels-two-page-spread: 3bd1fa1fe9f5
  - story-comic-reader-flip-and-panels-page-flip: 81730e39874b
  - epic-comic-reader-flip-and-panels#decisions-from-the-lead: 23c96219e6c7
  - design-comic-turn-pages#how-a-page-turn-works: e347e19f1496
  - design-comic-sheet-and-controls#flow: 54dc5fcac36b
  - design-comic-publish-pages#flow: 954976ba8278
  - persona-fan#context-of-use: 38883e5abc09
  - persona-artist#skills-and-tools: 4e28d5374320
---

# Two-page spread and page-flip: design

<!-- docs/design/comic-spread-and-flip.md. Design for stories 1 and 2 of epic-comic-reader-flip-and-panels.
Mock-ups are in docs/design/mockups/comic-spread-and-flip/ (PNG images, and mockups.html, the source they
are rendered from with render.mjs). Cross-document view transitions checked in Chromium 153 (2026-11-05). -->

## Personas

- persona-fan: reads on a phone most of the time, and on a laptop or tablet when there's time for a long read. On a wide screen, the reader should look like an open comic; on a phone, it stays one page at a time, as now.
- persona-artist: Star draws some scenes across two facing pages, as one picture, and wants them shown that way. Star thinks in printed pages: a chapter opens on the right.

## Decisions from the lead

- A page image can be marked as a two-page spread; it covers both sides on a wide screen and is shrunk to fit on a narrow one (2026-11-05).
- Each chapter chooses how its pages pair: opening on the right like a printed comic, or pairing from page 1 (2026-11-05).

## How it works

- **Wide and narrow.** A screen at least 1000 px wide and wider than it is tall shows two pages side by side; any other screen shows one page at a time, exactly as now. Turning a phone or tablet sideways can switch between the two.
- **Pairs.** Each chapter's **Open on** setting decides how its pages pair on a wide screen:
  - **The right, like a printed comic** (the default): page 1 alone on the right, then 2 and 3, 4 and 5 (mock-up 2).
  - **Both sides**: 1 and 2, 3 and 4.
- **A two-page spread page** (one picture across two facing pages, which Star marks) always takes both sides (mock-up 3). If the page before it would have been left alone on the left, that page shows alone on the left. The pairing then carries on after the spread: the next page starts a new pair on the left.
- **The last page** of a chapter, when it has no facing page, shows alone on its own side (mock-up 6). The next chapter starts with its own pairing, on the next turn.
- **Narrow screens** never pair pages. A spread page is shrunk to fit the screen like every page, with "Turn your phone sideways to see it bigger." under it on a phone held upright (mock-up 4).

## Page addresses

- Every page keeps its own address, `/comics/<series>/<chapter>/<page>`, as now. A spread page is one page, with one address.
- On a wide screen, a page's address shows the pair it's in. **Next** goes to the first page of the next pair, so the address bar shows the left-hand page of what's on screen (or the only page).
- A link to page 3 opens pages 2 and 3 on a wide screen, and page 3 on a phone. Nothing about a shared link depends on the screen it was shared from.
- The contact sheet's pictures, **First**, **Newest** and the chapter links keep their addresses.

## Flow: a fan

1. On a laptop, a page opens as a pair: "Chapter 2: The Long Road · Pages 2–3 of 12" in the bar (mock-up 1).
2. **Next**, swiping left, or the right arrow key turns to the next pair; **Previous**, swiping right, or the left arrow key turns back. They move by a pair on a wide screen and by a page on a narrow one, across chapters as now.
3. The turn looks like a page turning over (mock-up 5): turning forward, the right-hand page lifts at its outer edge and turns over to the left around the spine, about 0.4 seconds; turning back, the left-hand page turns over to the right. On a narrow screen, the single page turns over the same way.
4. A spread page reads "Page 5 of 12 · two-page spread" in the bar.
5. **All pages** shows a spread as one picture twice as wide, numbered "5 · spread" (mock-up 7).
6. At the end of the series, the end note shows under the controls, as now (mock-up 6).

## Flow: Star

1. In a chapter, Star chooses **Open on**: **The right, like a printed comic** (already chosen) or **Both sides** (mock-up 8). Most chapters need nothing.
2. For a two-page spread, Star uploads it as one wide picture, in its place among the pages, opens it, and ticks **Two-page spread** (mock-up 9). In the pages grid, it shows twice as wide, marked "Two-page spread" (mock-up 8).
3. **Preview** shows the reader as it will be on a wide screen when the preview pane is wide enough, and as on a phone when it isn't. (Star can widen the pane, or open the preview in its own window.)
4. Publishing works as now. Ticking or unticking **Two-page spread**, or changing **Open on**, changes no page's address, so it needs no shared-link warning.

## What Star enters

**A chapter**, after **Title**:

| Field | Help text | Choices |
|---|---|---|
| Open on | How pages pair up on a wide screen. A printed comic opens on the right, so its facing pages are 2 and 3, 4 and 5. | **The right, like a printed comic**: Page 1 alone on the right, then 2 and 3, 4 and 5. (default) · **Both sides**: Pages 1 and 2 together, then 3 and 4. |

**A page**, in the page panel, under **Alt text**:

| Field | Help text |
|---|---|
| Two-page spread (a tick box) | One picture drawn across two facing pages. On a wide screen it covers both pages; on a phone it's shrunk to fit. It's never split across a page turn. |

## The page-flip

- **Where it plays:** in browsers with cross-document view transitions (Chrome, Edge, Safari 18.2 and later, and others as they add them). Other browsers change pages without it, as now.
- **Reduced motion:** when the system asks for reduced motion, pages change without it.
- **Never a blank page:** the next pages are fetched ahead, as now. If the picture still isn't ready when the turn would start, the page changes without the turn and shows its loading state, as now.
- **Turning quickly:** a second turn during the animation finishes the first at once and starts the second, so no turn is lost.
- **Everything else stays:** the turn is drawn over an ordinary move to the next address, so focus, announcements, the address bar, the back button and preloading work as they do now.

## Layout

- **The pair:** two pages of the same height, edge to edge at the spine, centred, with a soft shadow down the middle like an open book (mock-up 1). The pair fills the space between the bar and the controls; if the pages' shapes differ, each is shown whole, top-aligned to the spine.
- **A page alone on one side:** the other side is left empty, so it reads as the right or left page it is (mock-ups 2 and 6).
- **A spread page:** one picture across both sides, the width of two pages, no shadow (mock-up 3).
- **The bar and the controls** stay where they are now. "Pages 2–3 of 12" replaces "Page 2 of 12" for a pair.

## States and errors

| Situation | What happens |
|---|---|
| A spread page that isn't wide (Star ticked it by mistake) | It still takes both sides, shown whole and centred, so nothing is cut off. The pages grid shows it wide, so the mistake is easy to see. |
| A chapter with one page | That page alone, on the side **Open on** puts page 1. |
| The window is resized or the tablet turned | The reader switches between pairs and single pages without reloading or moving away from the page. |
| A picture fails to load | Its side shows the loading state and its alt text, as a single page does now. |
| Pinch-zoomed | Swipes pan rather than turn, as now. |

## Accessibility

- **Announcements:** turning to a pair announces "Chapter 2: The Long Road, pages 2 and 3 of 12." then page 2's alt text, then page 3's. A spread page announces "Page 5 of 12, two-page spread." then its alt text.
- **Order:** in a pair, each page is its own image with its own alt text, left before right in reading and focus order.
- **Controls:** **Previous** and **Next** keep their names; their full names on hover or focus become "Previous pages" and "Next pages" on a wide screen.
- **Motion:** the turn honours reduced motion and never runs longer than half a second.
- **Zoom and reflow:** at 200% text or 400% zoom the screen is narrow, so the reader shows one page at a time and never scrolls sideways.

## Mock-ups

| # | Shows | File |
|---|---|---|
| 1 | A laptop: pages 2 and 3 facing | `mockups/comic-spread-and-flip/1-spread-laptop.png` |
| 2 | A chapter opening on the right: page 1 alone | `mockups/comic-spread-and-flip/2-opens-on-right.png` |
| 3 | A two-page spread page across both sides | `mockups/comic-spread-and-flip/3-wide-page.png` |
| 4 | The same spread on a phone, shrunk to fit | `mockups/comic-spread-and-flip/4-wide-page-phone.png` |
| 5 | Mid-turn on a laptop | `mockups/comic-spread-and-flip/5-mid-turn.png` |
| 6 | A chapter ending on a left-hand page, with the end note | `mockups/comic-spread-and-flip/6-last-page-left.png` |
| 7 | All pages on a laptop, with a spread twice as wide | `mockups/comic-spread-and-flip/7-all-pages.png` |
| 8 | The editor: a chapter's **Open on**, and a spread in the pages grid | `mockups/comic-spread-and-flip/8-editor-open-on.png` |
| 9 | The editor: a page with **Two-page spread** ticked | `mockups/comic-spread-and-flip/9-editor-spread-page.png` |

## For the guide

The comics guide (`docs/user/publishing-comics.md`) gains a section, **Two-page spreads and how pages pair up**: what **Open on** does, when to tick **Two-page spread**, how a spread is uploaded (one wide picture in its place), and what fans see on a laptop and on a phone. Its help link is that section; it needs no new guide, so the online help gains nothing new beyond the section.

## For the spec to check

- Cross-document view transitions in Chrome and Safari, the fallback elsewhere, and skipping the turn when the next picture isn't ready.
- The 1000 px and landscape test for pairs, at 200% text and 400% zoom.
- Pairing with spreads in every position, both **Open on** choices, chapters of one page, and the last page.
- That ticking **Two-page spread** or changing **Open on** changes no address, and the publish warnings stay as they are.
- The reader page's announcements for pairs and spreads.
