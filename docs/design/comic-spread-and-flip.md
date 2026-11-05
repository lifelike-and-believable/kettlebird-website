---
id: design-comic-spread-and-flip
status: approved
derived-from:
  - story-comic-reader-flip-and-panels-two-page-spread: 3bd1fa1fe9f5
  - story-comic-reader-flip-and-panels-comic-settings: 91b08e4f2d65
  - story-comic-reader-flip-and-panels-page-flip: 81730e39874b
  - epic-comic-reader-flip-and-panels#decisions-from-the-lead: 6c4beced64ec
  - design-comic-turn-pages#how-a-page-turn-works: e347e19f1496
  - design-comic-sheet-and-controls#flow: 54dc5fcac36b
  - design-comic-publish-pages#flow: 954976ba8278
  - persona-fan#context-of-use: 38883e5abc09
  - design-preview#flow: 257ebbac18cb
  - persona-artist#skills-and-tools: 4e28d5374320
---

# Two-page spread and page-flip: design

<!-- docs/design/comic-spread-and-flip.md. Design for stories 1 and 2 of epic-comic-reader-flip-and-panels.
Mock-ups are in docs/design/mockups/comic-spread-and-flip/ (PNG images, and mockups.html, the source they
are rendered from with render.mjs). Cross-document view transitions checked in Chromium 153 (2026-11-05).
Revised after a persona walkthrough. -->

**Settings per comic (story 6).** Everything in this design about pairs (the width test, pairing, page addresses showing a pair, both sets of links, the layout and announcements of pairs) applies only to a comic with **Two pages side by side** on; everything about the page-flip applies only to a comic with **Page-flip** on. Both are off until Star turns them on. "Settings per comic", below, says what a comic shows with either off.

## Personas

- persona-fan: reads on a phone most of the time, and on a laptop or tablet when there's time for a long read. On a wide screen, the reader should look like an open comic; on a phone, it stays one page at a time, as now.
- persona-artist: Star draws some scenes across two facing pages, as one picture, and wants them shown that way. Star thinks in printed pages: a chapter opens on the right.

## Decisions from the lead

- A page image can be marked as a two-page spread; it covers both sides on a wide screen and is shrunk to fit on a narrow one (2026-11-05).
- Each chapter chooses how its pages pair: opening on the right like a printed comic, or pairing from page 1 (2026-11-05).
- Two pages side by side and the page-flip are settings of each comic, both off until Star turns them on; with two pages side by side off, a two-page spread still uses the wide screen's full width, alone (2026-11-05; story 6, "Settings per comic" below).
- The pages never change size at the end of a comic (2026-11-05).

## How it works

- **Wide and narrow.** A screen at least 62.5 em wide (1000 px at the usual text size) and wider than it is tall shows two pages side by side; any other screen shows one page at a time, exactly as now. Because the width is measured in text size, enlarging the text to 200% makes a laptop show one page at a time. Turning a tablet sideways can switch between the two; a phone held sideways stays one page at a time (mock-up 12).
- **Pairs.** Each chapter's **Open on** setting decides how its pages pair on a wide screen:
  - **The right, like a printed comic** (the default): page 1 alone on the right, then 2 and 3, 4 and 5 (mock-up 2).
  - **The left, pairing from page 1**: 1 and 2, 3 and 4.
- **A two-page spread page** (one picture across two facing pages, which Star marks) always takes both sides (mock-up 3). If the page before it would have been left alone on the left, that page shows alone on the left. The pairing then carries on after the spread: the next page starts a new pair on the left.
- **The last page** of a chapter, when it has no facing page, shows alone on its own side (mock-up 6). The next chapter starts with its own pairing, on the next turn.
- **Narrow screens** never pair pages. A spread page is shrunk to fit the screen like every page (mock-up 4). On a narrow screen held upright, "Turn your phone sideways to see it bigger." shows under a spread page; it's hidden from screen readers, which hear the alt text instead. Held sideways, a spread page fills the width and the controls are a short scroll below it (mock-up 12).

## Page addresses

- Every page keeps its own address, `/comics/<series>/<chapter>/<page>`, as now. A spread page is one page, with one address.
- On a wide screen, a page's address shows the pair it's in. A link to page 3 opens pages 2 and 3 on a wide screen, and page 3 on a phone, and the address stays `/3`: nothing is redirected, and nothing about a shared link depends on the screen it was shared from.
- **Next** on a wide screen goes to the first page of the next pair (its left-hand page, or its only page), so after the first turn the address is the left-hand page of what's on screen.
- **Each reader page carries both sets of links and states**: where **Previous** and **Next** go on a wide screen and on a narrow one, whether each control can be used, and whether the end note shows. The same width test that lays out the pages picks which set shows, so turning still works with no script at all, as design-comic-turn-pages promises. For example, if page 5 is the newest, page 4 on a laptop shows 4 and 5, with **Next** and **Newest** unusable and the end note showing (mock-up 10); on a phone, page 4 has **Next**.
- The contact sheet's pictures, **First**, **Newest** and the chapter links keep their addresses.

## Flow: a fan

1. On a laptop, a page opens as a pair: "Chapter 2: The Long Road · Pages 2–3 of 12" in the bar (mock-up 1).
2. **Next**, swiping left, or the right arrow key turns to the next pair; **Previous**, swiping right, or the left arrow key turns back. They move by a pair on a wide screen and by a page on a narrow one, across chapters as now.
3. The turn looks like a page turning over (mock-up 5): turning forward, the right-hand page lifts at its outer edge and turns over to the left around the spine, about 0.4 seconds, with the new pair revealed beneath it; turning back, the left-hand page turns over to the right. "The page-flip", below, covers spreads, single pages and narrow screens.
4. A spread page reads "Page 5 of 12 · two-page spread" in the bar.
5. **All pages** shows a spread as one picture twice as wide, numbered "5 · spread", its link named "Page 5, two-page spread" (mock-up 7). On a phone's three-across sheet, a spread takes two of the three places. The picture marked "You were here" is the page in the address, as now, even when the fan came from a pair.
6. At the end of the series, the end note shows under the controls, as now (mock-up 6).

## Flow: Star

1. In a chapter, Star chooses **Open on**: **The right, like a printed comic** (already chosen) or **The left, pairing from page 1** (mock-up 8). Most chapters need nothing.
2. For a two-page spread, Star uploads it as one wide picture, in its place among the pages, opens it, and ticks **Two-page spread** (mock-up 9). In the pages grid, it shows twice as wide, marked "Two-page spread" (mock-up 8).
3. If a spread leaves the page before it alone on the left, the page panel says so under the tick box: "This chapter opens on the right, so page 4 shows alone on the left, before this spread." (mock-up 9). Star can leave it, or move a page or change **Open on** to close the gap.
4. If Star uploads a picture wider than it is tall and doesn't tick **Two-page spread**, the page panel asks: "This picture is wider than it is tall. Is it a two-page spread? If so, tick **Two-page spread**; otherwise it shows small, on one side." (mock-up 11).
5. **Preview** on a chapter: **Computer** shows pairs, when the comic has **Two pages side by side** on, at a laptop's 1280 × 800, scaled to fit, and **Phone** shows one page at a time, whatever the size of the editor's window (design-preview).
6. Publishing works as now. Ticking or unticking **Two-page spread**, or changing **Open on**, changes no page's address, so it needs no shared-link warning.

## What Star enters

**A chapter**, after **Title**:

| Field | Help text | Choices |
|---|---|---|
| Open on | How pages pair up on a wide screen. A printed comic opens on the right, so its facing pages are 2 and 3, 4 and 5. | **The right, like a printed comic**: Page 1 alone on the right, then 2 and 3, 4 and 5. (default) · **The left, pairing from page 1**: Pages 1 and 2 together, then 3 and 4. |

**A page**, in the page panel, under **Alt text**:

| Field | Help text |
|---|---|
| Two-page spread (a tick box) | One picture drawn across two facing pages. On a wide screen it covers both pages; on a phone it's shrunk to fit. It's never split across a page turn. |

## Settings per comic

Story 6 makes both features Star's choice, per comic.

- **Where:** in the comic's own page in the editor, after **Kind**, a group headed **How it reads** with two tick boxes (mock-up 13):
  - **Two pages side by side**: "On a laptop, or a tablet held sideways, show facing pages together, like an open comic. Off: one page at a time on every screen."
  - **Page-flip**: "Turn pages with an animation of a page turning over. Off: pages change at once."
- **Both off**, for a new comic and for every comic that exists today. Nothing else about a comic changes when Star turns them on or off: no address changes, so the editor never asks about shared links. A change goes live when the comic itself is published (publishing a chapter doesn't publish its comic's settings).
- **Two pages side by side off:** every screen shows one page at a time, as before story 1. The bar reads "Page 5 of 12"; **Next** and **Previous** move one page; the edge arrows, keys and swipes follow them. A page marked **Two-page spread** shows alone, as wide as the reader allows (the width of two pages on a laptop), with the bar reading "Page 5 of 12 · two-page spread" (mock-up 14). **All pages** still shows a spread twice as wide. Narrow screens (a phone or tablet held upright, or text at 200%) behave as now: the spread is shrunk to fit, with the hint to turn the phone sideways.
- **In the chapters of such a comic,** **Open on** stays, with its choice kept and still changeable, under a note: "Two pages side by side is off for this comic, so this has no effect. Turn it on in the comic's How it reads." (mock-up 15). The page panel's note about a page left alone before a spread doesn't show. The question about a wide picture that isn't ticked still shows, since a spread is shown wider either way. These notes follow the comic's current setting, published or not.
- **Page-flip off:** pages change at once, as before story 2, whatever the system's motion setting. **Page-flip on** still gives way to reduced motion.
- **Page-flip on, pairs off:** every turn is the narrow screen's turn, a single page turning over around its left edge (see "What turns"), including a spread shown alone.
- **Preview:** a chapter's preview uses its comic's settings as they are now, published or not (a second exception to design-preview's "this item's unpublished changes only"): **Computer** shows pairs only when **Two pages side by side** is on. So that Star can see the turns, **Previous** and **Next** work in a chapter's preview, moving between that chapter's pages (another exception to "links don't work in the preview"), and the flip plays when **Page-flip** is on. A comic's own preview shows its series page, so **How it reads** ends with "Preview a chapter to see how it reads." as a reminder.

## The page-flip

- **Where it plays:** in browsers with cross-document view transitions (Chrome, Edge, Safari 18.2 and later, and others as they add them). Other browsers change pages without it, as now.
- **Reduced motion:** when the system asks for reduced motion, pages change without it.
- **Length:** about 0.4 seconds, and never more than half a second.
- **Never a blank page:** the next pages are fetched ahead, as now. If the picture still isn't ready when the turn would start, the page changes without the turn and shows its loading state, as now.
- **Turning quickly:** a second turn during the animation finishes the first at once and starts the second, so no turn is lost.
- **What turns:** a sheet with the page being left on its front and the page that will face it on its back.
  - **Pair to pair:** forward, the right-hand page turns over to the left around the spine, its back becoming the new left-hand page, with the new right-hand page beneath; back, the reverse.
  - **A spread page:** turns as one wide sheet, around the spine, onto the next pair (or from the previous one).
  - **A page alone on one side** (page 1 on the right, a last page on the left): turns as half a sheet; the empty side stays empty until the turn ends.
  - **Into another chapter:** the same turn; the next chapter's first pair or page is beneath.
  - **Narrow screens, and every screen when pairs are off:** there's no spine, so the single page turns over around its left edge, like the top sheet of a pad, with the next page beneath; back, the previous page turns in from the left.
- **Everything else stays:** the turn is drawn over an ordinary move to the next address, so focus, announcements, the address bar, the back button and preloading work as they do now.

## Layout

- **The pair:** two pages of the same height, edge to edge at the spine, centred, with a soft shadow down the middle like an open book (mock-up 1). The pair fills the space between the bar and the controls; if the pages' shapes differ, each is shown whole, top-aligned to the spine.
- **A page alone on one side:** the other side is left empty, so it reads as the right or left page it is (mock-ups 2 and 6).
- **A spread page:** one picture across both sides, the width of two pages, no shadow (mock-up 3).
- **The bar and the controls** stay where they are now. "Pages 2–3 of 12" replaces "Page 2 of 12" for a pair.
- **The edge arrows** (design-comic-turn-pages, wide screens, mouse only) sit at the outer edges of the pair or the spread.
- **On the newest pair or page**, the pages keep the same size and place as on every other page; the end note and its **Back to series** sit under the controls, a short scroll down on a laptop (mock-ups 6 and 10). The lead's decision (2026-11-05): the pages never change size at the end.

## States and errors

| Situation | What happens |
|---|---|
| A spread page that isn't wide (Star ticked it by mistake) | It still takes both sides, shown whole and centred, so nothing is cut off. The pages grid shows it wide, so the mistake is easy to see. |
| A wide picture that isn't ticked | The page panel asks whether it's a two-page spread (mock-up 11). Unticked, it shows whole on its own side, smaller. |
| A spread leaves a page alone on the left | Allowed. The page panel says which page, under the tick box (mock-up 9). |
| A chapter with one page | That page alone, on the side **Open on** puts page 1. |
| The window is resized or the tablet turned | The reader switches between pairs and single pages without reloading or moving away from the page. |
| A picture fails to load | Its side shows the loading state and its alt text, as a single page does now. |
| Pinch-zoomed | Swipes pan rather than turn, as now. |

## Accessibility

- **Announcements:** turning to a pair announces "Chapter 2: The Long Road, pages 2 and 3 of 12." then page 2's alt text, then page 3's. A spread page announces "Page 5 of 12, two-page spread." then its alt text.
- **Order:** in a pair, each page is its own image with its own alt text, left before right in reading and focus order.
- **Controls:** **Previous** and **Next** keep their names. Their full names on hover or focus say "pages" when they lead to a pair on a wide screen ("Next pages"), and "page" when they lead to a single page or a spread ("Next page").
- **The sideways hint** is hidden from screen readers.
- **Motion:** the turn honours reduced motion and never runs longer than half a second.
- **Zoom and reflow:** the width test is in text-size units, so at 200% text or 400% zoom the reader shows one page at a time and never scrolls sideways.

## Persona walkthrough

A walkthrough for persona-fan and persona-artist (2026-11-05), which opened every mock-up, found four blocking problems and eleven others. Addressed here:

- **Blocking:**
  - both sets of links and states in every reader page, with a mock-up of a pair holding the newest page;
  - the preview's **Computer** always showing pairs;
  - the page-flip for spreads, single pages, chapter changes and narrow screens;
  - the fans' guide.
- **Others:**
  - mock-up 5 redrawn so it no longer contradicts mock-up 3, and the full contact sheet and editor in mock-ups 7 to 9;
  - the note about a page a spread leaves alone, and the question for a wide picture that isn't ticked;
  - a phone held sideways;
  - **The left, pairing from page 1** in place of "Both sides";
  - the width test in text-size units, for 200% text;
  - "pages" in the controls' full names only for a pair;
  - the edge arrows at the pair's outer edges;
  - the end note on the first screen (since replaced: the lead decided the pages keep their size at the end, 2026-11-05).

## Mock-ups

| # | Shows | File |
|---|---|---|
| 1 | A laptop: pages 2 and 3 facing | `mockups/comic-spread-and-flip/1-spread-laptop.png` |
| 2 | A chapter opening on the right: page 1 alone | `mockups/comic-spread-and-flip/2-opens-on-right.png` |
| 3 | A two-page spread page across both sides | `mockups/comic-spread-and-flip/3-wide-page.png` |
| 4 | The same spread on a phone, shrunk to fit | `mockups/comic-spread-and-flip/4-wide-page-phone.png` |
| 5 | Mid-turn on a laptop: page 7 turning to show 8 and 9 | `mockups/comic-spread-and-flip/5-mid-turn.png` |
| 6 | A chapter ending on a left-hand page, with the end note | `mockups/comic-spread-and-flip/6-last-page-left.png` |
| 7 | All pages on a laptop, with a spread twice as wide | `mockups/comic-spread-and-flip/7-all-pages.png` |
| 8 | The editor: a chapter's **Open on**, and a spread in the pages grid | `mockups/comic-spread-and-flip/8-editor-open-on.png` |
| 9 | The editor: a page with **Two-page spread** ticked, and the note about the page left alone | `mockups/comic-spread-and-flip/9-editor-spread-page.png` |
| 10 | The newest page in a pair: **Next** and **Newest** unusable, the end note | `mockups/comic-spread-and-flip/10-newest-in-pair.png` |
| 11 | The editor: a wide picture not ticked, and the question | `mockups/comic-spread-and-flip/11-editor-wide-picture.png` |
| 12 | A phone held sideways on a spread | `mockups/comic-spread-and-flip/12-phone-sideways.png` |
| 13 | The editor: a comic's **How it reads**, both off | `mockups/comic-spread-and-flip/13-editor-how-it-reads.png` |
| 14 | A laptop, two pages side by side off: a spread alone, as wide as the reader allows | `mockups/comic-spread-and-flip/14-spread-alone.png` |
| 15 | The editor: **Open on** with its note, in a comic with two pages side by side off | `mockups/comic-spread-and-flip/15-editor-open-on-off.png` |

## Persona walkthrough: story 6

A walkthrough for persona-artist and persona-fan (2026-11-05) of "Settings per comic" found three blocking problems and six others. Addressed: the preview (a chapter's preview uses the comic's current settings, and **Previous** and **Next** turn within it); the "only when on" rule moved to the top and the preview step corrected; the turn with pairs off; **Open on** still changeable; notes follow the current setting; narrow screens unchanged; the guides; the checks for the spec; and the comic's real fields in mock-up 13.

## For the guide

- Story 6 adds to both: Star's guide says where **How it reads** is and what each setting does, that both start off, that the comic itself must be published, and how to try them in a chapter's preview; the fans' guide says that some comics show two pages side by side, and turn with the page-flip, when Star has chosen to.

- **Star's comics guide** (`docs/user/publishing-comics.md`) gains a section, **Two-page spreads and how pages pair up**: what **Open on** does, when to tick **Two-page spread**, how a spread is uploaded (one wide picture in its place), the note about a page left alone, and what fans see on a laptop and on a phone. It's a section of an existing guide, so the online help gains no new guide.
- **The fans' guide** (`docs/user/reading-comics.md`, a fans' guide) gains a section on reading on a wide screen: pairs and "Pages 2–3", spreads, turning a phone sideways for a spread, and that the page-turn is skipped when reduced motion is on.

## For the spec to check

- Both settings off by default, for a comic saved before story 6, and every combination of the two.
- A spread alone at the reader's width with pairs off, and the bar's wording.
- **Open on**'s note and the hidden page-alone note with pairs off.
- The preview following the comic's unpublished settings, and **Previous** and **Next** turning within the chapter in the preview.
- **Page-flip** off overriding the system's motion setting, and on giving way to reduced motion.
- The turn with pairs off on a wide screen.
- Pairs off with no script: one set of links, the narrow one, on every screen.

- Cross-document view transitions in Chrome and Safari, the fallback elsewhere, and skipping the turn when the next picture isn't ready.
- The 1000 px and landscape test for pairs, at 200% text and 400% zoom.
- Pairing with spreads in every position, both **Open on** choices, chapters of one page, and the last page.
- That ticking **Two-page spread** or changing **Open on** changes no address, and the publish warnings stay as they are.
- Both sets of links and states in every reader page, picked by the width test, with no script.
- The preview's **Computer** at 1280 × 800 meets the width test whatever the pane's size.
- The reader page's announcements for pairs and spreads.
