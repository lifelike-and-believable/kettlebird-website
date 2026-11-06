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

**A third setting in How it reads: Page width on a computer** (mock-up 6).
- A number of pixels, for example 900, under **Page-flip**, with the help text: "How wide each page shows on a laptop or desktop when one page shows at a time, in pixels, for example 900. Pages can then run below the bottom of the window, and readers scroll down to the buttons; a narrower window shrinks the page to fit. Leave it empty to fit each page into the window, as now. Phones aren't affected."
- Empty for every comic today and for a new comic, which read as now.
- Between 400 and 2000; outside that the editor says "Choose a width between 400 and 2000 pixels, or leave it empty."
- Like the other settings, it goes live when the comic itself is published, and a chapter's preview at **Computer** uses it as it is now, published or not.

**On a computer, one page at a time** (mock-ups 2 to 5):
- "A computer" is a screen 700 px wide or more, with a mouse or trackpad (CSS `(hover: hover) and (pointer: fine)`). Phones and tablets, held either way, are unaffected, and so is any window narrower than 700 px.
- The page shows at the page width, or the reader's width if the window is narrower (mock-up 4), and its height follows its shape: a 900 px page drawn 2:3 is 1350 px tall, so it runs below a laptop's window (mock-ups 2 and 3).
- The reader's column is the page width, so **Back to series**, the location line, **Panel by panel** and **All pages** line up with the page (mock-up 2).
- The reader still opens with the bar at the top of the window, as now. **Next** and the other controls are under the page, a scroll down (mock-up 3). The arrow keys and the page's edge arrows turn pages without scrolling, as now, and each new page opens with the bar at the top again.
- **A two-page spread shown alone** is twice the page width, centred, or the window's width less a margin if that's narrower (mock-up 5). It can run below the window too.
- The page's picture is fetched at the page width (twice it for a spread), times the screen's density, so it's sharp at that size.

**Where it doesn't apply:**
- **Two pages side by side**: with it on, everything is fitted to the window, as now, including the pages that show alone between pairs (a first page, a spread). The page width is for comics read one page at a time. (See Decisions at review.)
- **Panel by panel**: the panel view is fitted to the window, as now, so each panel shows whole on the screen. Turning it on in a comic with a page width changes the page area to the window's size, and turning it off goes back to the page width.

**Unchanged:** phones and tablets; comics without a page width; the controls, the bar, **All pages**, the page-flip, and addresses.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | The comic's editor, **How it reads** (`sanity-studio/schemas`, the series document) | **Page width on a computer**: a number, 400 to 2000, empty by default. |
| 2 | The reader on a computer (`src/components/pages/ReaderPage.astro`) | With a page width and one page at a time: the column and page at that width, or the window's; a spread alone twice it; the picture fetched at that size. |
| 3 | A chapter's preview at **Computer** | As for fans. |
| 4 | Star's guide `publishing-comics.md` | How it reads: the new setting. |

## Mock-ups

Screenshots of the fixture build's reader (Single Sheets: one page at a time, a spread at page 3), today and with the change at a page width of 900 px. Source: `mockups/comic-page-width/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | Today, a laptop (1440 × 900): the page fitted to the window, 467 × 700 | `mockups/comic-page-width/1-today-laptop.png` |
| 2 | After: the page 900 px wide, running below the window; the bar lines up with it | `mockups/comic-page-width/2-after-laptop.png` |
| 3 | After, the whole page scrolled: the controls under the page, the window's bottom marked | `mockups/comic-page-width/3-after-scrolled.png` |
| 4 | After, a desktop window narrower than the page width (800 × 700): the page shrinks to 752 px | `mockups/comic-page-width/4-narrower-window.png` |
| 5 | After, a two-page spread alone: twice the page width, here capped by the window | `mockups/comic-page-width/5-spread.png` |
| 6 | The editor: **How it reads** with **Page width on a computer** | `mockups/comic-page-width/6-editor.png` |

## States and errors

| Situation | What happens |
|---|---|
| No page width (every comic today) | As now: the page fits the window. |
| Page width, a computer, one page at a time | The page at the page width or the reader's width, its height following. |
| A window narrower than the page width | The page fits the window's width. |
| A window narrower than 700 px, or a phone or tablet | As now. |
| A spread alone | Twice the page width, centred, or the window's width less a margin. |
| Panel by panel on | The panel view fits the window, as now. |
| Two pages side by side on, on a computer | Pairs fit the window, as now. |
| Browser zoom | Zooming in makes the page bigger on the screen, as on any site; once the zoomed window is narrower than the page width, the page fits the window instead. |
| A width outside 400 to 2000 | The editor won't publish it, with "Choose a width between 400 and 2000 pixels, or leave it empty." |

## Accessibility

- Nothing moves out of reach: the controls are under the page in the Tab order as now, and the arrow keys and edge arrows turn pages without scrolling.
- Keyboard focus moving to **Next** scrolls it into view, as browsers do.
- Pages are bigger, so their lettering is easier to read; screen reader users hear the same page descriptions.
- The editor's field has a label, help text and an error message in words.

## For the guide

Star's guide `publishing-comics.md`, under the comic's settings (**How it reads**): what **Page width on a computer** does, with an example (900 pixels), that pages can run below the window and readers scroll, that narrower windows and phones aren't affected, that it applies when one page shows at a time (with **Two pages side by side** off), that empty is as now, and to preview a chapter at **Computer** to see it.

## For the spec to check

- The series has an optional page width, 400 to 2000, with the label, help and error message above; empty reads as now.
- On a computer (1440 × 900, a mouse), with a page width of 900 and pairs off: the page is 900 px wide, its height follows its shape, the bar lines up with it, and the controls are below the window.
- At 800 × 700, the page fits the reader's width; nothing scrolls sideways.
- A spread alone is twice the width, capped by the window, centred, with no sideways scrolling.
- With a touch screen (no hover, coarse pointer), at any size, and below 700 px: as now.
- Panel by panel on: the page area fits the window, as now.
- Two pages side by side on: pairs as now.
- The picture is asked for at the page width (twice for a spread).
- A chapter's preview at **Computer** uses the comic's page width, published or not.
- Without a page width, everything the reader's existing tests check passes unchanged.

## Decisions at review

For the lead:
1. **The setting's form**: a number of pixels, as proposed, or a few named sizes ("Fit the window", "Large", "Larger")? Pixels let Star match the size the pages are drawn for; names are easier to choose without knowing the drawings' sizes.
2. **"A computer"**: a mouse or trackpad and 700 px or wider, as proposed, or any screen 1000 px or wider (the test two pages side by side uses), which would include tablets held sideways and leave narrow desktop windows fitted to the window?
3. **A spread alone**: twice the page width, as proposed, or the same width as a page (so it's shorter, and fits more often)?
4. **Two pages side by side**: the page width applies only with it off, as proposed; or should pairs also take a width (each page at the page width, side by side)?

## Persona walkthrough

To be run before review.
