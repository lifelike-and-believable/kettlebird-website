---
id: design-comic-reader-phone-bar
status: draft
derived-from:
  - design-comic-sheet-and-controls#layout: ee5c53db8ba2
  - design-comic-sheet-and-controls#accessibility: a6dfd125f599
  - design-comic-panels#layout: 363dd8be8473
  - design-comic-panels#accessibility: 939d94d8c7e4
  - persona-fan#context-of-use: 38883e5abc09
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - requirements-site#REQ-site-4: 5970ab67a115
---

# The reader bar on phones: design

<!-- docs/design/comic-reader-phone-bar.md. A design amendment asked for by the lead (2026-11-06): on narrow
screens, Panel by panel and All pages lose their words, because the wrapped bar pushed the reader's
controls under the address bar on iPhones. Mock-ups are in docs/design/mockups/comic-reader-phone-bar/:
PNG images, mockups.html (the frames), proposed.css (the change as a stylesheet), and render.mjs, which
screenshots the fixture build's reader today and with proposed.css, then draws Safari's toolbars over it. -->

## Personas

- persona-fan: reads on a phone, mostly an iPhone, arriving from a link (#skills-and-tools), in short sessions (#context-of-use). They turn pages with **Next** at the bottom of the screen. When **Next** is under Safari's address bar, they have to scroll for it on every page, and the page moves each time.

## The problem

On a phone, in a chapter with panels, the reader bar has **Back to series**, **Panel by panel** and **All pages**, then the location line on its own line. The two buttons with their words don't fit beside **Back to series** on any iPhone, so **All pages** wraps to a line of its own and the bar takes 152 px instead of about 104 (mock-up 4).

There is a second cause, found while measuring. The page area is sized to leave room for the bar and controls inside `100vh`. On iPhone Safari, `100vh` is the screen's height with Safari's toolbars hidden, about 86 px more than the page has while the address bar shows. So the page is drawn taller than the visible screen allows, and the controls fall under the toolbar (mock-up 1). Together, the controls end about 114 px below the visible screen on an iPhone 15; the bar alone accounts for 48 of them.

design-comic-sheet-and-controls checked that "on a 360 × 640 phone, the page and the controls both fit on the first screen", in a browser without toolbars, so neither cause showed.

## The change

**On phones (under 700 px wide), Panel by panel and All pages show their pictures only** (mock-ups 2 and 4):

- Each is a square 44 × 44 px button with the same border and paper background as today, its picture slightly larger: the page with its top panel filled for **Panel by panel**, the grid of nine squares for **All pages**.
- They sit together at the right of the first line, **Panel by panel** first, beside **Back to series**. The location line stays under them.
- Pressed, **Panel by panel** is dark with a light picture, as today (mock-up 3).
- Their names don't change: they stay in the page for screen readers and voice control (hidden from view), and show above the button on hover and keyboard focus, as the controls' names do.
- In a chapter without panels, **All pages** alone is a square at the right.

**The page area leaves room inside the visible screen.** It's sized from the small viewport height (`100svh`), the screen with the browser's toolbars showing, instead of `100vh`. Browsers without toolbars, and laptops, are unaffected: there the two are the same. Browsers that don't know `svh` keep `100vh`.

With both, on an iPhone 15 in Safari, the controls end 16 px above the address bar (mock-up 2), at 320, 393 and 430 px wide, with panel by panel on or off.

**Unchanged:** from 700 px wide (a tablet held upright, or a laptop), the bar keeps the words and pictures in one line (mock-up 4); **Back to series** and the location line; the controls; the spread page's own sizing; and how the buttons work.

## Where it applies

| #   | Where                                                                                                 | After                                                                                         |
| --- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | The reader bar on phones (`src/components/pages/ReaderPage.astro`, `.reader__panels`, `.reader__all`) | Pictures only under 700 px, names kept for assistive technology and shown on hover and focus. |
| 2   | The reader's page area (`.reader__page`)                                                              | Sized from `100svh`, falling back to `100vh`.                                                 |
| 3   | The chapter's preview (the same reader)                                                               | As for fans.                                                                                  |

## Mock-ups

Screenshots of the fixture build's reader, today and with the change (`proposed.css`), at an iPhone 15's 393 px. In mock-ups 1 to 3 the page is laid out as Safari lays it out (`100vh` of 745 px) and Safari's status bar and toolbar are drawn over it at their sizes (59 and 134 px), so what falls under the toolbar is hidden as on the phone. Source: `mockups/comic-reader-phone-bar/mockups.html`.

| #   | What it shows                                                                                         | File                                                        |
| --- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | Today, iPhone 15 in Safari: the bar on three lines, the controls under the address bar                | `mockups/comic-reader-phone-bar/1-today-iphone.png`         |
| 2   | After: pictures only, the bar on two lines, the controls above the address bar                        | `mockups/comic-reader-phone-bar/2-after-iphone.png`         |
| 3   | After, with panel by panel on: the pressed button                                                     | `mockups/comic-reader-phone-bar/3-after-panel-by-panel.png` |
| 4   | The bar close up: today and after at 320 and 393 px, pressed, text at 200%, and unchanged from 700 px | `mockups/comic-reader-phone-bar/4-bars-close-up.png`        |

## States and errors

| Situation                                 | What happens                                                                                                                                                                                                           |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A chapter with panels, on a phone         | **Back to series**, then the two pictures at the right; the location line under them.                                                                                                                                  |
| A chapter without panels                  | **Back to series**, then the grid picture at the right.                                                                                                                                                                |
| A chapter with one page                   | No **All pages**, as now; **Panel by panel** alone if the page has panels.                                                                                                                                             |
| Text at 200%                              | **Back to series** grows; the pictures stay 44 px and wrap under it if they must. The controls are then a short scroll below the page, as they are today with enlarged text (the bar takes 222 px, against 327 today). |
| A phone held sideways (wider than 700 px) | The words come back, as on a tablet.                                                                                                                                                                                   |
| No script                                 | **All pages** shows its picture only; **Panel by panel** isn't shown, as now.                                                                                                                                          |

## Accessibility

- The buttons keep their names: "Panel by panel" (a toggle, `aria-pressed`) and "All pages in this chapter". With no visible words there is no visible label for the name to match (WCAG 2.5.3), and voice control users say the name, which the guide gives.
- Each is 44 × 44 px, as now (WCAG 2.5.8).
- The pictures are decoration inside a named button (`aria-hidden`), as now.
- The name shows above the button on hover and on keyboard focus, as the controls' names do, so a mouse or keyboard user who meets the picture alone can find what it does.
- The pictures' contrast is unchanged: ink on paper, 12.6:1; pressed, paper on ink.
- Fitting the controls on the first screen also helps fans using zoom or switch access: **Next** is reached without scrolling.

## For the guide

The fans' guide `reading-comics.md`:

- **Read panel by panel**, step 1: say that on a phone the button shows only its picture, a page with its top panel filled in, at the top right beside **All pages**.
- **See all the pages in a chapter**: say that on a phone **All pages** is the grid of nine squares at the top right.

## For the spec to check

- Under 700 px wide, in a chapter with panels, **Panel by panel** and **All pages** show no words, are 44 × 44 px, sit on the same line as **Back to series** at 320, 393 and 430 px, and keep their accessible names.
- Their names show on hover and keyboard focus.
- At 700 px and wider, the words show, as now.
- At 393 × 659 (an iPhone 15's visible screen in Safari), the controls end within the screen, with panel by panel on and off; the same at 320 × 568 and 430 × 739.
- The page area's height is computed from `100svh` where the browser supports it.
- Everything the reader's existing tests check passes unchanged.

## Decisions at review

None open. For the lead to confirm: pictures only on phones, as asked, rather than shorter words ("Panels", "Pages"), which would still wrap at 320 px with **Back to series**.

## Persona walkthrough

To be run before review.
