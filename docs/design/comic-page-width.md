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

# How a comic's pages fit on a computer: design

<!-- docs/design/comic-page-width.md. A design amendment asked for by the lead (2026-11-06): on a computer, Star can
set how big a comic's pages show when one page shows at a time, even if that puts the bottom of the page and the
controls below the window; a narrower window shrinks the page to fit. The lead's example is
https://www.theglassscientists.com/comic/page-01. At review the lead set the form (2026-11-06): pages fit the
height, the width or the screen, and are never wider than their picture's own pixels unless the editor sets a
largest width. Mock-ups are in docs/design/mockups/comic-page-width/: PNG images, mockups.html (the frames and the
editor), proposed.css (the change as a stylesheet), and render.mjs, which screenshots the fixture build's reader
today and with the change. -->

## Personas

- persona-artist: Star draws pages to be read at a size, and wants the site to show the work as drawn (#goals). Today, on a laptop, a page is shrunk until it fits the window with the bar and controls: about 470 px wide in a 1440 × 900 window, where lettering drawn for print is small.
- persona-fan: on a computer, a fan has a mouse wheel or trackpad and a window to scroll (#context-of-use). Many webcomics show a page at a fixed width and let the reader scroll down it to the next-page button; for a fan, a bigger page that needs a scroll beats a small one that doesn't.

## The change

This amends design-comic-spread-and-flip, "Settings per comic", which has two tick boxes in **How it reads**; and design-comic-sheet-and-controls, Layout, "the page and the controls both fit on the first screen", which stays true on phones and tablets and, on a computer, for comics that fit the screen.

**Two new settings in How it reads**, under **Page-flip** (mock-ups 8 and 9):
- **Page size on a computer**, one of three, with **Fit the screen** chosen for every comic today and for a new comic:
  - **Fit the screen**: "The whole page and the buttons show at once, without scrolling. Pages are smaller." As now.
  - **Fit the width**: "Pages are as wide as the window allows, up to their largest width; readers scroll down each page to the buttons."
  - **Fit the height**: "Each page opens filling the window's height; readers scroll up to the comic's name and down to the buttons."
  - Its help text: "How big each page shows on a laptop or desktop, one page at a time. Phones and tablets always fit the screen."
- **Largest page width**: a whole number of screen pixels, from 400 to 3200, empty by default. Its help text: "The widest a page shows, in screen pixels. Leave it empty to show each page no wider than its picture: a picture 2400 pixels wide can show up to 2400, which is wider than most windows. A number wider than a page's picture enlarges it, and it may look soft. A two-page spread shows up to twice this. The preview at Computer is shown smaller, to fit beside the editor."
- Anything else in **Largest page width** (under 400, over 3200, not a whole number, "900px") can't be published: "Choose a whole number of pixels between 400 and 3200, or leave it empty." (mock-up 9).
- **With Two pages side by side ticked**, **Page size on a computer** says: "Two pages side by side is on for this comic, so this has no effect: pairs fit the screen. Untick it to read one page at a time at this size." (mock-up 9), as **Open on** does in the other direction.
- Like the other settings, they go live when the comic itself is published; publishing a chapter doesn't publish them. Until then the comic shows Sanity's own mark for unpublished changes, as any item does (design-know-when-live, "Drafts"), and the guide says to publish the comic.
- A chapter's preview at **Computer** uses the comic's settings as they are now, published or not, like the other settings. That preview is the reader at 1280 px, shown smaller to fit beside the editor, so it shows how the page and controls fall, not the page's real size on screen.

**A page's largest width** is the comic's **Largest page width** (twice it for a two-page spread), or, when that's empty, the width of the page's own picture in pixels, which the site already knows for every page. A spread's picture is about twice as wide as a page's, so it gets about twice the room without a separate rule. On a high-density screen a page shown at its picture's width uses all the picture has; it isn't enlarged.

**On a computer, one page at a time** (mock-ups 1 to 7 and 10):
- "A computer" is a device with a mouse or trackpad (CSS `(hover: hover) and (pointer: fine)`), at any window width. Phones and tablets, held either way, fit the screen, as now.
- The settings apply only when the comic reads one page at a time: **Two pages side by side** off. With it on, everything fits the screen, as now, on every screen.
- **Fit the screen** (mock-up 1): as now, and never wider than the page's largest width. On most windows that changes nothing; on a very large monitor a small picture is no longer enlarged.
- **Fit the width** (mock-ups 2 to 4, 6 and 7): the page is as wide as the window less a margin, up to its largest width, and its height follows its shape: the fixture's 800 × 1200 page shows at 800 × 1200 in a 1440 × 900 window, running below it (mock-ups 2 and 3); with **Largest page width** 1200 it shows at 1200 × 1800 (mock-up 4); in an 800 × 700 window it shrinks to 752 (mock-up 6).
- **Fit the height** (mock-up 5): the page's height is the window's, up to its largest width and the window's width: 600 × 900 in a 1440 × 900 window. Each page opens with its top at the top of the window, so it fills the window; **Back to series** and the page's place are a scroll up, and **Next** and the other controls a scroll down.
- Browser zoom shrinks the window's width in CSS pixels, so a zoomed-in fan gets a page that fits the window, still bigger than today's (mock-up 10: a 1280 laptop at 200% shows the page 592 px wide, against about 300 today).
- The reader's column follows the current page's width, so **Back to series**, the location line and the buttons line up with the page (mock-up 2). It changes when a page of another size comes up, such as a spread.
- With **Fit the width**, each page opens with the bar at the top of the window, as now, whether reached with **Next** or **Previous**. In both new modes the arrow keys turn pages without scrolling, as now.
- The page's edge arrows (on hover) run the page's height, and their arrow stays in the middle of the window as the page scrolls (mock-up 10), so it's always in view.
- While a page loads, "Loading page…" shows at the top of the page's space, not its middle, which may be below the window.
- **A two-page spread shown alone** follows the same rule with its own largest width, centred, and never wider than the window less a margin (mock-up 7).
- The page's picture is asked for at the size it shows, at the screen's density, so it's sharp: the reader's image sizes, the next page fetched ahead, and the picture widths the site makes (today up to 1600) all follow, with picture widths up to 3200, and never wider than the picture itself.

**Panel by panel** is unchanged: the panel view fits the window, so each panel shows whole on the screen. Turning it on in a comic that fits the width or the height changes the page area to the window's size; turning it off goes back.

**Keyboard:** after a turn made with **Next** or **Previous** from the keyboard, focus returns to that control on the new page without scrolling to it (as now, so the page opens where its mode puts it). On a tall page that control is below the window: pressing Enter turns again, and Tab or scrolling brings it into view. The arrow keys need no focus.

**The page-flip** on a page taller than the window turns the part that's in view; this needs checking on a computer before it's built, since headless browsers don't run it (For the spec to check).

**Unchanged:** phones and tablets; comics that fit the screen, on most windows; comics with two pages side by side; the controls, the bar, **All pages**, and addresses.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | The comic's editor, **How it reads** (the series schema) | **Page size on a computer** (three choices, **Fit the screen** by default) and **Largest page width** (a whole number, 400 to 3200, empty by default); the note when **Two pages side by side** is ticked; the error. |
| 2 | The reader on a computer (`src/components/pages/ReaderPage.astro`) | With pairs off: the page and column by the mode and each page's largest width; the column updated on each turn; in **Fit the height**, each page opens at its top; the edge arrows and loading message in view; the turn hint hidden (it's for phones). |
| 3 | The picture's size (`readerSizes` in `src/lib/comics/panels.ts`, the next-page fetch in `ReaderPage.astro`, `PAGE_WIDTHS` in `src/lib/comics/source.ts`) | Asked for at the size the page shows; picture widths up to 3200, never wider than the picture. |
| 4 | A chapter's preview (`src/lib/preview/load.ts`) | Uses the comic's settings as they are now, like **Two pages side by side** and **Page-flip**. |
| 5 | Star's guide `publishing-comics.md` | The new settings (For the guide). |

## Mock-ups

Screenshots of the fixture build's reader (Single Sheets: one page at a time, pages 800 × 1200 pixels, a 1600 × 1200 spread at page 3), today and with the change. Source: `mockups/comic-page-width/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | **Fit the screen** (the default, as now), a laptop (1440 × 900): the page 467 × 700 | `mockups/comic-page-width/1-fit-screen.png` |
| 2 | **Fit the width**, no largest width: the page at its picture's 800 px, running below the window; the bar lines up with it | `mockups/comic-page-width/2-fit-width.png` |
| 3 | **Fit the width**, the whole page scrolled: the controls under the page, the window's bottom marked | `mockups/comic-page-width/3-fit-width-scrolled.png` |
| 4 | **Fit the width** with **Largest page width** 1200: the page enlarged to 1200 | `mockups/comic-page-width/4-largest-width.png` |
| 5 | **Fit the height**: the page opens filling the window, 600 × 900; and the whole reader | `mockups/comic-page-width/5-fit-height.png` |
| 6 | **Fit the width**, a desktop window narrower than the page (800 × 700): the page shrinks to 752 px | `mockups/comic-page-width/6-narrower-window.png` |
| 7 | **Fit the width**, a two-page spread: its picture's 1600, here capped by the window at 1392 | `mockups/comic-page-width/7-spread.png` |
| 8 | The editor: **How it reads** with **Page size on a computer** and **Largest page width** | `mockups/comic-page-width/8-editor.png` |
| 9 | The editor: the note with **Two pages side by side** ticked, and the error for a width that isn't allowed | `mockups/comic-page-width/9-editor-notes.png` |
| 10 | **Fit the width**: a laptop zoomed to 200%, and the edge arrow on a 1200 px page in a 1280 × 720 window | `mockups/comic-page-width/10-zoom-and-edge.png` |

## States and errors

| Situation | What happens |
|---|---|
| **Fit the screen** (every comic today) | As now; never wider than the page's largest width. |
| **Fit the width**, a computer, pairs off | The page as wide as the window allows, up to its largest width; its height follows. |
| **Fit the height**, a computer, pairs off | The page as tall as the window, up to its largest width and the window's width; it opens at its top. |
| No **Largest page width** | Each page up to its own picture's width in pixels. |
| A **Largest page width** wider than a page's picture | The picture is enlarged to it, and may look soft; the help text says so. |
| A window narrower than the page, or browser zoom | The page fits the window's width. |
| A phone or tablet | As now. |
| Two pages side by side on | As now, on every screen; the editor says the size has no effect. |
| A spread alone | The same mode, with its own largest width (its picture's, or twice **Largest page width**), within the window. |
| Panel by panel on | The panel view fits the window, as now. |
| A page still loading | "Loading page…" at the top of its space. |
| A **Largest page width** outside 400 to 3200, or not a whole number | The editor won't publish it, with the error above. |

## Accessibility

- Nothing moves out of reach: the controls are under the page in the Tab order as now, and Tab brings each into view; the arrow keys and edge arrows turn pages without scrolling.
- After a keyboard turn, focus is on the same control on the new page, out of view on a tall page (Keyboard, above); Enter turns again.
- With **Fit the height**, the page opens with the bar above the window; a screen reader still starts at the reader's heading and the page's description, as now.
- Zooming in keeps the page within the window's width, bigger than today's.
- Pages are bigger, so their lettering is easier to read; screen reader users hear the same page descriptions and announcements.
- The editor's settings have labels, help text, a note and an error message in words.

## For the guide

Star's guide `publishing-comics.md`:
- **Turn them on for a comic** (under Two-page spreads): add **Page size on a computer** and **Largest page width**: what each choice does, with the window sizes they're measured against; that pages can run below the window and readers scroll; that an empty **Largest page width** keeps pages no wider than their pictures, so uploading bigger pictures gives bigger pages; that a number wider than the pictures enlarges them; that narrower windows, zoom, phones and tablets shrink or ignore them; that they work with **Two pages side by side** off; that **Fit the screen** is as now; that they go live when the comic is published; and that the preview at **Computer** is shown smaller.
- The intro of **Two-page spreads**, and **Panels**, which say one page at a time on a laptop is fitted to the window: add "unless the comic fits the width or the height".

## For the spec to check

- The series has **Page size on a computer** (three choices, **Fit the screen** by default and for comics without it) and an optional **Largest page width**, a whole number from 400 to 3200, with the labels, help, note and error above; out-of-range, 0, negative, decimal and "900px" values are refused.
- The reader is marked with the mode only when **Two pages side by side** is off.
- On a computer (a mouse), pairs off, the fixture's 800 × 1200 pages:
  - **Fit the width**, no largest width, at 1440 × 900: the page is 800 × 1200, the bar lines up with it, and the controls are below the window; with **Largest page width** 1200, 1200 × 1800; at 800 × 700, 699 × 700 and 576 × 360 the page fits the window's width;
  - **Fit the height** at 1440 × 900: the page is 600 × 900 and opens with its top at the window's top; at 576 × 360 it fits the window's width;
  - **Fit the screen** at 1440 × 900: as now; at 2560 × 1440, no wider than 800;
  - nothing scrolls sideways, with overlay and classic scrollbars.
- A spread alone, in each mode: up to its picture's width (or twice **Largest page width**), within the window, centred, with no sideways scrolling.
- The column follows the page when a turn goes from a page to a spread and back.
- With a touch screen (no hover, a coarse pointer) at 1024 × 768 and 1366 × 1024, and a phone: as now.
- Open Book (pairs on) with **Fit the width** set, at 1440 × 900 and 800 × 700: as now.
- Panel by panel on: the page area fits the window, as now.
- The picture asked for, the next page fetched ahead and the picture widths, in each mode, with and without **Largest page width**, on 1× and 2× screens; never wider than the picture.
- The edge arrow is in the window on a 1200 px page at 1280 × 720; "Loading page…" is at the top of the page's space.
- After a keyboard turn, focus is on the control on the new page, and the page opens where its mode puts it.
- A chapter's preview at **Computer** uses the comic's settings, published or not.
- With **Fit the screen**, everything the reader's existing tests check passes unchanged.
- Manual: the page-flip on a page taller than the window, in Chrome and Safari on a computer.

## Decisions at review

Settled by the lead (2026-11-06): pages fit the screen, the width or the height; the default largest width is each picture's own pixels, overridable in the editor. That settles the earlier questions of the setting's form and a spread's width (a spread's picture is about twice as wide, so it gets twice the room).

Still for the lead:
1. **Who chooses the mode**: Star, per comic, as proposed; or should fans also get a switch in the reader, starting from Star's choice?
2. **Fit the height**: each page opens with its top at the window's top, as proposed, so the page fills the window and the bar is a scroll up; or at the bar, as now, so the page's bottom 200 px or so is a scroll down?
3. **Two pages side by side**: the settings apply only with it off, as proposed; or should pairs also fit the width or the height?

## Persona walkthrough

A walkthrough of the first version of this design (a page width in pixels) for persona-artist and persona-fan (2026-11-06) found two blocking problems, eight misleading ones and seven slower ones, all addressed in it; the findings that still apply are carried into this version:
- the preview at **Computer** is scaled, and the editor's error and pairs states have mock-ups (mock-up 9);
- the picture is fetched at the size it shows, and the site makes pictures up to 3200 wide;
- browser zoom keeps the benefit (any window width with a mouse or trackpad);
- the settings apply only with pairs off, and the editor says so;
- the help text says what the pixels mean and what the default does;
- the settings go live with the comic, not the chapter;
- keyboard focus after a turn is stated and checked;
- the edge arrow stays in the window, and the loading message is at the top of the page;
- the page-flip on a tall page is a manual check before it ships;
- touch laptops and tablets are in the spec checks; the phone's turn hint is hidden on computers; the guide's other passages are listed.

This version (the three modes and the picture's own width) has yet to be walked through; its findings will be folded in here before review.
