---
id: design-comic-reader-phone-bar
status: approved
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
PNG images, mockups.html (the frames), proposed.css and render.mjs's markup() (the change, applied to the
fixture build's reader), and render.mjs, which screenshots the reader today and with the change, then
draws Safari's toolbars over it. -->

## Personas

- persona-fan: reads on a phone, mostly an iPhone, arriving from a link (#skills-and-tools) and deciding within seconds whether to stay (#context-of-use). They turn pages with **Next** at the bottom of the screen. When **Next** is under Safari's address bar, they have to scroll for it on every page, and the page moves each time.

## The problem

On a phone, in a chapter with panels, the reader bar has **Back to series**, **Panel by panel** and **All pages**, then the location line on its own line. The two buttons with their words don't fit beside **Back to series** on any iPhone, so **All pages** wraps to a line of its own and the bar takes 152 px instead of 104 (mock-up 4). In a chapter without panels the bar takes 113 px instead of 88.

There is a second cause, found while measuring. The page area is sized to leave room for the bar and controls inside `100vh`. On iPhone Safari, `100vh` is the screen's height with Safari's toolbars hidden: in the model the mock-ups use (an iPhone 15 on iOS 18), 745 px, against 659 px visible while the address bar shows. So the page is drawn taller than the visible screen allows, and the controls fall under the toolbar (mock-up 1). Together, the controls end about 114 px below the visible screen; the bar accounts for 48 of them.

design-comic-sheet-and-controls checked that "on a 360 × 640 phone, the page and the controls both fit on the first screen", in a browser without toolbars, so neither cause showed.

## The change

**On screens under 700 px wide, either way up, Panel by panel and All pages show their pictures only** (mock-ups 2 to 5):
- Each is a square 44 × 44 px button with the same border and paper background as today, its picture slightly larger: the grid of nine squares for **All pages**, and for **Panel by panel** a redrawn picture, a page with every panel outlined and the one being read drawn heavier (today's has a filled top panel, which at this size reads as a phone; mock-up 5).
- They sit together at the right of the first line, **Panel by panel** first, beside **Back to series**, and stay together at the right if they wrap under it (text at 200%). The location line stays under them. In a chapter without panels, or with one page, the button that remains is at the right.
- Pressed, **Panel by panel** is dark with a light picture, as today (mock-up 3).
- Their names don't change, and stay in the page for screen readers and voice control: "Panel by panel" (a toggle) and "All pages in this chapter". The words are kept in the button, hidden from view with the site's visually hidden style (not removed, and not shrunk to nothing), so every screen reader still reads them.
- On hover and keyboard focus, the name shows in a small dark label under the button, right-aligned with it, inside the screen at every phone width (mock-up 5). Above, where the controls' names go, it would be off the top of the screen: the reader opens with the bar at the top.
- On touch there is no hover, so the pictures have to speak for themselves; the guide names them (For the guide), and see Decisions at review.

This amends design-comic-sheet-and-controls, Layout ("A bordered button with a small grid icon and the words 'All pages'", and "the page and the controls both fit on the first screen", which now means the visible screen with the browser's toolbars), and design-comic-panels, Layout ("an icon of a page with one panel highlighted. Pressed, it's dark with light text") and Accessibility ("the button says what it does", which on phones becomes its name and its tip). The controls under the page keep their captions on phones ("The captions are always visible, on phones too"): they're used on every page and have room; these two are used now and then and don't.

**The reader leaves room inside the visible screen.** The page area, the pair of pages on a wide screen and a spread shown alone are sized from the small viewport height (`100svh`), the screen with the browser's toolbars showing, instead of `100vh`. That covers iPads in Safari too, which have toolbars. On laptops and in browsers without toolbars the two are the same. Browsers that don't know `svh` keep `100vh`. The reader's minimum height stays `100vh`, so that it's always tall enough for the page to open with the bar at the top of the screen.

With both, in the model, the controls end 16 px above the address bar at 320, 393 and 430 px wide, with panel by panel on or off (mock-up 2). The 104 px bar includes the location line's two lines, which it keeps in chapters with panels so nothing moves from panel to panel (design-comic-panels, Layout); a change to that line changes this margin.

**Unchanged:** from 700 px wide (a tablet held upright, a laptop, or a large phone held sideways), the bar keeps the words and pictures in one line (mock-up 4); **Back to series** and the location line; the controls; and how the buttons work.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | The reader bar under 700 px (`src/components/pages/ReaderPage.astro`, `.reader__panels`, `.reader__all`) | The two buttons in one group at the right; pictures only, words visually hidden, a name label under each on hover and focus; Panel by panel's picture redrawn (at every width). |
| 2 | The reader's page area, pair, and spread alone (`.reader__page`, `.reader__book`) | Sized from `100svh`, falling back to `100vh`. |
| 3 | The chapter's preview in the editor, at **Phone** (375 px) | As for fans. |

## Mock-ups

Screenshots of the fixture build's reader, today and with the change, at an iPhone 15's 393 px unless named. In mock-ups 1 to 3 the page is laid out as Safari lays it out (`100vh` of 745 px), and Safari's status bar and toolbar are drawn over it at their sizes (59 and 134 px), so what falls under the toolbar is hidden as on the phone. This is a model of Safari on iOS 18: it wasn't checked on a device, on other iOS versions, or in the in-app browsers of Instagram, Bluesky or Tumblr, whose bars differ. Source: `mockups/comic-reader-phone-bar/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | Today, iPhone 15 in Safari: the bar on three lines, the controls under the address bar | `mockups/comic-reader-phone-bar/1-today-iphone.png` |
| 2 | After: pictures only, the bar on two lines, the controls above the address bar | `mockups/comic-reader-phone-bar/2-after-iphone.png` |
| 3 | After, with panel by panel on: the pressed button | `mockups/comic-reader-phone-bar/3-after-panel-by-panel.png` |
| 4 | The bar close up: today and after at 320 and 393 px, pressed, a chapter without panels, text at 200% today and after, and unchanged from 700 px | `mockups/comic-reader-phone-bar/4-bars-close-up.png` |
| 5 | The pictures, today's and redrawn, and the names under the buttons on keyboard focus at 320 and 393 px | `mockups/comic-reader-phone-bar/5-pictures-and-names.png` |

## States and errors

| Situation | What happens |
|---|---|
| A chapter with panels, under 700 px | **Back to series**, then the two pictures at the right; the location line under them. |
| A chapter without panels | **Back to series**, then the grid picture at the right. |
| A chapter with one page | No **All pages**, as now; **Panel by panel** alone at the right if the page has panels. |
| Text at 200% | **Back to series** grows; the two pictures stay 44 px and wrap under it, together at the right. The bar takes 222 px (240 with panel by panel on), against 327 today, and the controls are a scroll below the page, as they are today with enlarged text, though less far. |
| A phone held sideways | Under 700 px wide (an iPhone SE and older), pictures; 700 px and wider (most current iPhones), the words, as on a tablet. |
| Keyboard focus or hover on a picture | Its name under it, inside the screen; no sideways scrolling. |
| No script | **All pages** shows its picture only, at the right; **Panel by panel** isn't shown, as now. |

## Accessibility

- The buttons keep their names: "Panel by panel" (a toggle, `aria-pressed`) and "All pages in this chapter". With no visible words there is no visible label for the name to match (WCAG 2.5.3). Voice control users say the name. iOS Voice Control is expected to match "All pages" against "All pages in this chapter" (not tested here); the guide gives both.
- The words stay in the button, visually hidden, so the name comes from the same text as today; the pictures stay decoration (`aria-hidden`).
- Each is 44 × 44 px, as now, 16 px apart (WCAG 2.5.8).
- The name label on hover and keyboard focus (WCAG 1.4.13: it appears only while the pointer or focus is on the button, doesn't cover the button, and is decoration for assistive technology, which already has the name).
- The pictures' contrast is unchanged: ink on paper, 12.6:1; pressed, paper on ink.
- With text at 100%, **Next** is on the first screen without scrolling. With enlarged text it still needs a scroll, but less than today. Pinch zoom is unaffected.

## For the guide

The fans' guide `reading-comics.md`, everywhere it names the two buttons:
- **Read panel by panel**, step 1: on a phone, **Panel by panel** shows only its picture, a page of panels, at the top right beside **All pages**; it's dark when on.
- **See all the pages in a chapter**, first paragraph: on a phone, **All pages** is the grid of nine squares at the top right.
- The other mentions ("or **All pages** to see the chapter's pages", "**All pages** shows where you are", "**First**, **Newest**, **All pages** and links", "A chapter with only one page has no **All pages** button") stay, since the button is still called that; the two sections above say what it looks like on a phone.
- The paragraph on the controls' full names: add that on a computer, pointing at either picture shows its name too.
- With voice control, say "Tap All pages" or "Tap Panel by panel".

## For the spec to check

- Under 700 px wide, in a chapter with panels, **Panel by panel** and **All pages** show no words, are 44 × 44 px, are on the same line as **Back to series** at 320, 393 and 430 px, and at the right of the bar.
- Their computed accessible names are "Panel by panel" and "All pages in this chapter", the toggle still reports `aria-pressed`, and the words are in the button (visually hidden), not removed.
- On keyboard focus and hover, the name label shows under the button, fully inside the viewport, with no sideways scrolling, at 320, 393 and 430 px.
- At 699 and 700 px: pictures, then words.
- With text at 200%, the two pictures stay together at the right.
- A chapter without panels, and with one page: the remaining button at the right.
- At 393 × 659, 320 × 568 and 430 × 739, the controls end within the viewport, with panel by panel on and off.
- The page area, the pair and a spread alone are sized from `100svh` where the browser supports it: the rule is tested directly, since a browser without toolbars gives the same answer for `vh` and `svh`.
- Panel by panel's picture is the redrawn one, at every width.
- No script: **All pages** alone, at the right.
- Everything the reader's existing tests check passes unchanged, including the controls wrapping two by two with enlarged text, and **All pages**' words from 700 px.

## Decisions at review

The lead's review (2026-11-06):
1. **Pictures only on phones**, as asked. Shorter words would still wrap at 320 px with **Back to series**, and a caption under each picture would take most of the margin above the address bar. On touch, a fan has to know or try what each picture does; the guide names them, and pressing **Panel by panel** is safe to undo.
2. **Star draws the two pictures.** The lead will ask Star for a Panel by panel picture and an All pages picture in the site's style. Until they arrive, the build uses the redrawn Panel by panel picture in this design (mock-up 5) and today's grid, and Star's drawings replace them when they come, without another design change: each must read at 18 × 26 px for Panel by panel and 22 × 22 px for All pages, in ink on paper and paper on ink (pressed).

## Persona walkthrough

A walkthrough for persona-fan (2026-11-06) on touch, VoiceOver, voice control, enlarged text and a keyboard measured the fixture build with the change at 320, 375, 393 and 430 px, opened every mock-up, and checked the design against the code, the designs it amends, and the guide. Its measurements matched the design's. It found one blocking problem, five misleading ones and four slower ones. All are addressed above:
- **Blocking:** the names on hover and focus were promised above the buttons, where they'd be off the top of the screen and, for **All pages**, past its right edge (now under the button, right-aligned; mock-up 5; the spec checks it stays inside the screen).
- **Misleading:**
  - on touch, two pictures are all a fan has, and Panel by panel's picture read as a phone (redrawn, and both questions put to the lead);
  - the designs this amends say the buttons have words and the captions are always visible (the amended sentences are now named, with why the controls differ);
  - the guide names the buttons in more places than two (each mention listed);
  - the Safari figures are a model (now said, with what wasn't checked), and the pair and spread were still sized from `100vh` (now `svh` too, which also covers iPads);
  - at 200%, **All pages** moved to the left edge (the two now stay together at the right), and "fits on the first screen" held only at 100% text (now said).
- **Slower:** a phone held sideways depends on its width (now said); the location line's two lines are part of the margin (now said); how the words are hidden (now named, with a spec check of the computed names); the 700 px boundary, one-page chapters and no script (now in the spec checks).
