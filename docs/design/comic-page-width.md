---
id: design-comic-page-width
status: draft
derived-from:
  - design-comic-spread-and-flip#settings-per-comic: 64a1be41076a
  - design-comic-sheet-and-controls#layout: ee5c53db8ba2
  - persona-artist#goals: f3044c738f84
  - persona-fan#context-of-use: 38883e5abc09
  - requirements-comics#REQ-comics-2: d738742f9302
---

# A comic's page width on a computer: design

<!-- docs/design/comic-page-width.md. A design amendment asked for by the lead (2026-11-06): on a computer, Star can
set how wide a comic's pages show when one page shows at a time, even if that puts the bottom of the page and the
controls below the window; a narrower window shrinks the page to fit. The lead's example is
https://www.theglassscientists.com/comic/page-01. Mock-ups are in docs/design/mockups/comic-page-width/: PNG
images, mockups.html (the frames and the editor), proposed.css (the change as a stylesheet), and render.mjs, which
screenshots the fixture build's reader today and with the change. -->

## Personas

- persona-artist: Star draws pages to be read at a size, and wants the site to show the work as drawn (#goals). Today, on a laptop, a page is shrunk until it fits the window's height with the bar and controls: about 470 px wide in a 1440 × 900 window, where lettering drawn for print is small.
- persona-fan: on a computer, a fan has a mouse wheel or trackpad and a window to scroll (#context-of-use). Many webcomics show a page at a fixed width and let the reader scroll down it to the next-page button; for a fan, a bigger page that needs a scroll beats a small one that doesn't.

## The change

This amends design-comic-spread-and-flip, "Settings per comic", which has two tick boxes in **How it reads**; and design-comic-sheet-and-controls, Layout, "the page and the controls both fit on the first screen", which stays true on phones and tablets and, on a computer, for comics without a page width.

**A third setting in How it reads: Page width on a computer** (mock-ups 6 and 7).
- A whole number of screen pixels, from 600 to 1600, under **Page-flip**. Its help text says what the number means: "How wide each page shows on a laptop or desktop, in screen pixels, from 600 to 1600; for example 900. Most laptop windows are 1280 to 1440 pixels wide, and a page fitted to the window today is about 470 pixels wide. Pages can then run below the bottom of the window, and readers scroll down to the buttons; a narrower window shrinks the page to fit. Leave it empty to fit each page into the window, as now. Phones and tablets aren't affected. The preview at Computer is shown smaller, to fit beside the editor."
- Empty for every comic today and for a new comic, which read as now.
- Anything else (under 600, over 1600, not a whole number, "900px") can't be published: "Choose a width between 600 and 1600 pixels, or leave it empty." (mock-up 7).
- **With Two pages side by side ticked**, the field says: "Two pages side by side is on for this comic, so this has no effect: pairs fit the window. Untick it to read one page at a time at this width." (mock-up 7), as **Open on** does in the other direction.
- Like the other settings, it goes live when the comic itself is published; publishing a chapter doesn't publish it. Until then the comic shows Sanity's own mark for unpublished changes, as any item does (design-know-when-live, "Drafts"), and the guide says to publish the comic.
- A chapter's preview at **Computer** uses the comic's width as it is now, published or not, like the other settings. That preview is the reader at 1280 px, shown smaller to fit beside the editor, so it shows how the page and controls fall, not the page's real size on screen.

**On a computer, one page at a time** (mock-ups 2 to 5 and 8):
- "A computer" is a device with a mouse or trackpad (CSS `(hover: hover) and (pointer: fine)`), at any window width. Phones and tablets, held either way, are unaffected.
- The width applies only when the comic reads one page at a time: **Two pages side by side** off. With it on, everything is fitted to the window, as now, on every screen.
- The page shows at the page width, or the window's width if that's narrower (mock-up 4), and its height follows its shape: a 900 px page drawn 2:3 is 1350 px tall, so it runs below a laptop's window (mock-ups 2 and 3).
- Browser zoom shrinks the window's width in CSS pixels, so a zoomed-in fan gets the page at the window's width, still bigger than today's page fitted to the window's height (mock-up 8: a 1280 laptop at 200% shows the page 592 px wide, against about 300 today).
- The reader's column is the page width, so **Back to series**, the location line and the buttons line up with the page (mock-up 2).
- Each page opens with the bar at the top of the window, as now, whether reached with **Next** or **Previous**. **Next** and the other controls are under the page, a scroll down (mock-up 3). The arrow keys turn pages without scrolling, as now.
- The page's edge arrows (on hover) run the page's height, and their arrow stays in the middle of the window as the page scrolls (mock-up 8), so it's always in view.
- While a page loads, "Loading page…" shows at the top of the page's space, not its middle, which may be below the window.
- **A two-page spread shown alone** is twice the page width, centred, breaking out of the column, or the window's width less a margin if that's narrower (mock-up 5). It can run below the window too.
- The page's picture is asked for at the page width (twice it for a spread), at the screen's density, so it's sharp: the reader's image sizes, the next page fetched ahead, and the picture widths the site has made (today up to 1600) all follow the page width, with picture widths up to 3200 for a 1600 px page on a high-density screen. A spread wider than that on a high-density screen is fetched at 3200.

**Panel by panel** is unchanged: the panel view is fitted to the window, so each panel shows whole on the screen. Turning it on in a comic with a page width changes the page area to the window's size; turning it off goes back to the page width.

**Keyboard:** after a turn made with **Next** or **Previous** from the keyboard, focus returns to that control on the new page without scrolling to it (as now, so the page opens at the top). On a tall page that control is below the window: pressing Enter turns again, and Tab or scrolling brings it into view. The arrow keys need no focus.

**The page-flip** on a page taller than the window turns the part that's in view; this needs checking on a computer before it's built, since headless browsers don't run it (For the spec to check).

**Unchanged:** phones and tablets; comics without a page width; comics with two pages side by side; the controls, the bar, **All pages**, and addresses.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | The comic's editor, **How it reads** (the series schema) | **Page width on a computer**: a whole number, 600 to 1600, empty by default; the note when **Two pages side by side** is ticked; the error. |
| 2 | The reader on a computer (`src/components/pages/ReaderPage.astro`) | With a page width and pairs off: the column and page at that width, or the window's; a spread alone twice it; the edge arrows and loading message in view; the turn hint hidden (it's for phones). |
| 3 | The picture's size (`readerSizes` in `src/lib/comics/panels.ts`, the next-page fetch in `ReaderPage.astro`, `PAGE_WIDTHS` in `src/lib/comics/source.ts`) | Asked for at the page width; picture widths up to 3200. |
| 4 | A chapter's preview (`src/lib/preview/load.ts`) | Uses the comic's width as it is now, like **Two pages side by side** and **Page-flip**. |
| 5 | Star's guide `publishing-comics.md` | The new setting (For the guide). |

## Mock-ups

Screenshots of the fixture build's reader (Single Sheets: one page at a time, a spread at page 3), today and with the change at a page width of 900 px unless named. Source: `mockups/comic-page-width/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | Today, a laptop (1440 × 900): the page fitted to the window, 467 × 700 | `mockups/comic-page-width/1-today-laptop.png` |
| 2 | After: the page 900 px wide, running below the window; the bar lines up with it | `mockups/comic-page-width/2-after-laptop.png` |
| 3 | After, the whole page scrolled: the controls under the page, the window's bottom marked | `mockups/comic-page-width/3-after-scrolled.png` |
| 4 | After, a desktop window narrower than the page width (800 × 700): the page shrinks to 752 px | `mockups/comic-page-width/4-narrower-window.png` |
| 5 | After, a two-page spread alone: twice the page width, here capped by the window | `mockups/comic-page-width/5-spread.png` |
| 6 | The editor: **How it reads** with **Page width on a computer** | `mockups/comic-page-width/6-editor.png` |
| 7 | The editor: the note with **Two pages side by side** ticked, and the error for a width out of range | `mockups/comic-page-width/7-editor-notes.png` |
| 8 | A laptop zoomed to 200%, and the edge arrow on a 1200 px page in a 1280 × 720 window | `mockups/comic-page-width/8-zoom-and-edge.png` |

## States and errors

| Situation | What happens |
|---|---|
| No page width (every comic today) | As now: the page fits the window. |
| Page width, a computer, pairs off | The page at the page width or the window's width, its height following. |
| A window narrower than the page width, or browser zoom | The page fits the window's width. |
| A phone or tablet | As now. |
| Two pages side by side on | As now, on every screen; the editor says the width has no effect. |
| A spread alone | Twice the page width, centred, or the window's width less a margin. At 1440 wide, with 900, a spread is 1408 wide, so each half is 704: smaller than a single page (Decisions at review). |
| Panel by panel on | The panel view fits the window, as now. |
| A page still loading | "Loading page…" at the top of its space. |
| A width outside 600 to 1600, or not a whole number | The editor won't publish it, with the error above. |

## Accessibility

- Nothing moves out of reach: the controls are under the page in the Tab order as now, and Tab brings each into view; the arrow keys and edge arrows turn pages without scrolling.
- After a keyboard turn, focus is on the same control on the new page, out of view on a tall page (Keyboard, above); Enter turns again.
- Zooming in keeps the page at the window's width, bigger than today's.
- Pages are bigger, so their lettering is easier to read; screen reader users hear the same page descriptions and announcements.
- The editor's field has a label, help text, a note and an error message in words.

## For the guide

Star's guide `publishing-comics.md`:
- **Turn them on for a comic** (under Two-page spreads): add **Page width on a computer**: what it does, with an example (900 pixels) and the window sizes it's measured against; that pages can run below the window and readers scroll; that narrower windows, zoom, phones and tablets shrink or ignore it; that it works with **Two pages side by side** off; that empty is as now; that it goes live when the comic is published; and that the preview at **Computer** is shown smaller.
- The intro of **Two-page spreads**, and **Panels**, which say one page at a time on a laptop is fitted to the window: add "unless the comic has a page width".

## For the spec to check

- The series has an optional page width, a whole number from 600 to 1600, with the label, help, note and error above; out-of-range, 0, negative, decimal and "900px" values are refused; empty reads as now.
- The reader is marked with the width only when it's set and **Two pages side by side** is off.
- On a computer (a mouse) with a width of 900 and pairs off: at 1440 × 900 the page is 900 px wide, its height follows its shape, the bar lines up with it, and the controls are below the window; at 800 × 700, 699 × 700 and 576 × 360 the page fits the window's width; nothing scrolls sideways, with overlay and classic scrollbars.
- A spread alone is twice the width, capped by the window, centred, with no sideways scrolling.
- With a touch screen (no hover, a coarse pointer) at 1024 × 768 and 1366 × 1024, and a phone: as now.
- Open Book (pairs on) with a width set, at 1440 × 900 and 800 × 700: as now.
- Panel by panel on: the page area fits the window, as now.
- The picture asked for, the next page fetched ahead and the picture widths, at widths 900 and 1600, on 1× and 2× screens.
- The edge arrow is in the window on a 1200 px page at 1280 × 720; "Loading page…" is at the top of the page's space.
- After a keyboard turn, focus is on the control on the new page and the page opens at the bar.
- A chapter's preview at **Computer** uses the comic's width, published or not.
- Without a page width, everything the reader's existing tests check passes unchanged.
- Manual: the page-flip on a page taller than the window, in Chrome and Safari on a computer.

## Decisions at review

For the lead:
1. **The setting's form**: a number of screen pixels, as proposed, or a few named sizes ("Fit the window", "Large", "Larger")? The numbers are screen pixels, not the drawing's, so the help text gives the window sizes to judge against; named sizes would be easier to pick without that.
2. **A spread alone**: twice the page width, as proposed, or the same width as a page? Twice keeps a spread's halves near a page's size on a large window (at 1440 wide, halves of 704 against pages of 900); the same width makes a spread half as tall as a page and fits more often.
3. **Two pages side by side**: the page width applies only with it off, as proposed; or should pairs also take a width (each page at the page width, side by side)?

## Persona walkthrough

A walkthrough for persona-artist and persona-fan (2026-11-06), on laptops and desktop windows at nine sizes, browser zoom, the keyboard, a screen reader, and the editor, measured the fixture build with the change and checked the design against the code, the designs it amends and Star's guide. Its measurements matched the design's. It found two blocking problems, eight misleading ones and seven slower ones. All are addressed above:
- **Blocking:**
  - the preview at **Computer** is scaled, and the editor's error and pairs states had no mock-ups (now said, with mock-up 7);
  - the picture would have been fetched by the window's height, not the page width, and the site makes pictures only up to 1600 wide, so pages would be soft (the sizes, the next-page fetch and the picture widths now follow the width).
- **Misleading:**
  - browser zoom past about 200% dropped below the 700 px line and fell back to a small page (the 700 px line is gone: any width with a mouse or trackpad);
  - whether the width applies with pairs on, which the stylesheet did at narrow widths (now only with pairs off, and the spec checks it);
  - nothing in the editor said the width does nothing with pairs on (now a note);
  - what the number means: screen pixels, against which windows, and that 400 was smaller than today (now in the help text, with a range of 600 to 1600);
  - the width goes live with the comic, not the chapter (now said, in the editor's status and the guide);
  - keyboard focus after a turn lands below the window on a tall page (now stated, and checked);
  - the edge arrow sat mid-page, below short windows (now kept in the window);
  - the page-flip on a tall page was unchecked (now a manual check before it ships).
- **Slower:** pages open at the bar, **Previous** too (now said); the spread's halves are smaller than a page (now in Decisions, with numbers); the loading message was below the window (now at the top); touch laptops and tablets (in the spec checks); the phone's turn hint in a tall desktop window (now hidden on computers); the guide's other passages (now listed); the screen reader (no change).
