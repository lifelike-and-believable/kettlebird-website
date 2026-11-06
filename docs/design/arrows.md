---
id: design-arrows
status: draft
derived-from:
  - requirements-site#REQ-site-4: 5970ab67a115
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - persona-fan#context-of-use: 38883e5abc09
  - persona-artist#goals: f3044c738f84
  - design-comic-sheet-and-controls#layout: ee5c53db8ba2
  - design-comic-sheet-and-controls#accessibility: a6dfd125f599
  - design-comic-turn-pages#layout: a26d566f95d8
  - design-portfolio-full-screen#how-it-works: a1a71c5c3e3f
  - design-portfolio-full-screen#accessibility: cfebce56a3e9
---

# One arrow, one button: design

<!-- docs/design/arrows.md. A site-wide design, asked for by the lead (2026-11-06): the arrows for
previous, next, first and last differ between the comic reader, the portfolio carousel and full screen,
and none match the style guide. The lead chose the soft triangle (option B of four) on 2026-11-06.
Mock-ups are in docs/design/mockups/arrows/ (PNG images, and mockups.html, the source they are rendered
from with render.mjs, built to match the site's fonts, colours, paper and pictures; the today-*.png
images are screenshots of the live site). The style guide's "Arrows and navigation buttons" section
records the result for later work. -->

## Personas

- persona-fan: fans move through comic pages and portfolio pieces one after another (#goals), mostly on phones (#skills-and-tools), deciding quickly whether to keep going (#context-of-use). The way forward should look the same everywhere, so a fan who has used it once knows it on every page. Today it doesn't: the reader's controls, its edge arrows, the carousel and full screen each draw their arrows differently, and on an iPhone full screen's ◀ ▶ characters can come out as emoji.
- persona-artist: Star wants the site to look like Star's own style (#goals): thick ink borders, sharp corners, yellow highlights and the rounded Nunito lettering. The arrows are drawn to match, as ink on paper: flat, with no drop shadow (lead, 2026-11-06).

## The problem

Four kinds of arrow are in use, none from the style guide:

| Where | Today |
|---|---|
| Comic reader controls (**First**, **Previous**, **Next**, **Newest**) | Drawn triangles with sharp points, in beige bordered boxes with no shadow and no hover change |
| Comic edge arrows (laptops, on hover) | The typed character ‹ or ›, faint, at 3rem |
| Portfolio carousel | The typed characters ‹ and › in black squares with no border, which grow on hover |
| Full screen **Previous** and **Next** | The typed characters ◀ and ▶, which iPhones may draw as emoji; a thin 2 px border |
| Links and buttons with words | Typed arrows: **← Chapter 1**, **Chapter 3 →**, **← Back to page 4**, "Read it →", "Email me to get started →", and the chapter list's ▾ |

## The change

**One shape.** Every arrow is drawn (SVG) from one solid triangle with rounded corners (mock-up 1): the same solid "play" shape the comic controls have today, so its meaning doesn't change, with its corners rounded like the ends of Nunito's letters. It points right for next, left for previous, and down for a fold-out; two side by side, with a gap between them, are first and newest (or last). In a 24-unit square, the triangle is 10 units wide and 13 tall, drawn with a 3-unit stroke with round joins; the doubles sit in a 32 by 24 box. No arrow is a typed character.

**One button.** Every arrow that stands on its own, without words beside it, sits in one button style, built from the style guide's parts and kept flat, like ink on paper: no drop shadow, and nothing lifts or moves (mock-up 7). The lead chose this at review (2026-11-06): drop shadows fight the ink-on-paper look.

- **At rest:** beige (`--color-beige`), a 3 px ink border, sharp corners, no shadow. At least 44 by 44 px.
- **Pointer over it:** yellow (`--color-yellow`), the colour of the site's primary buttons on hover (`.btn-primary`), like a highlighter stroke. Only where the device can hover (`@media (hover: hover)`): on a phone, a tapped button that doesn't load a new page (full screen, the carousel) would otherwise stay yellow, and read as "selected".
- **Pressed:** inked in: an ink fill (`--color-ink`) with a beige arrow and caption, while the finger or button is down (`:active`, on every device).
- **Nothing moves:** no state changes a button's size or position, so full screen's side buttons, which centre themselves with `transform: translateY(-50%)`, stay where they are.
- **Keyboard focus:** the site's focus ring, 2 px dark purple (`--color-dark-purple`) 2 px outside the border, shown only for the keyboard (`:focus-visible`).
- **Can't be used:** a dashed border at 40% ink (`rgba(43,43,43,.4)`) and the arrow and caption at 45% ink (`rgba(43,43,43,.45)`), as today. New: no fill (today's controls keep their beige), so it reads as an empty outline, out of reach. On dark: border, arrow and caption at `#f5f1e877`, as today. These fall below 3:1 on purpose; WCAG exempts controls that can't be used from contrast, and they're also `aria-disabled` and skipped by Tab.
- **The carousel has no "can't be used" state,** as today: its arrows scroll the row and do nothing at its ends.
- **Motion:** only colour changes, over 120 ms (`--transition-fast`); with reduced motion, at once.

**On dark** (full screen), the same button turned around: near-black (`#161616`) with a beige border, arrow and caption, and no shadow. With the pointer over it, it turns yellow with an ink arrow, as on paper; pressed, it fills beige with an ink arrow (inked in, the other way round). Its focus ring stays full screen's yellow, 3 px, which shows on near-black where purple wouldn't.

**Beside words.** In a link or button with words, the arrow is the same triangle, about three quarters of the letters' height, in the text's colour, on the side it points to (mock-up 8). It's hidden from screen readers; the words carry the meaning.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | Comic reader controls | The same four controls, places, sizes (at least 56 px tall), captions and full-name labels (design-comic-sheet-and-controls#layout), in the arrow button style, with the soft arrows (mock-up 2). |
| 2 | Comic edge arrows | The quiet strip at each edge of the page stays (15% of the page wide, the page's full height, laptops only, mouse only), and still turns the page wherever it's clicked. In place of the faint character, the arrow button shows in the middle of the strip, yellow, while the pointer is over the strip; elsewhere nothing shows (mock-up 3). It stays hidden from screen readers and isn't a tab stop (design-comic-turn-pages#layout). |
| 3 | Portfolio carousel | Two arrow buttons, 44 by 44 px at every width (today `min(2.5rem, 12vw)`, 40 px on a laptop and 38 px on a 320 px phone), either side of the row, on its kraft band; they no longer grow on hover (mock-up 4). On a 320 px phone with text at 200%, the row of pictures gives up the 12 px, keeping about 130 px (mock-up 10). |
| 4 | Full screen **Previous** and **Next** | The dark arrow button, with its caption, in the same places (design-portfolio-full-screen#how-it-works): at the sides on a laptop or a phone held sideways (mock-up 5), and in the bottom bar's corners on a phone held upright (mock-up 6). Each is at least 56 px wide and grows to fit its caption, which today overflows its fixed 56 px with enlarged text. On a phone held upright, when **Previous**, the zoom controls and **Next** don't fit on one row, the zoom controls move to a row of their own above them, and the bottom bar grows to hold both (mock-up 11). |
| 5 | Words with arrows | **Chapter 1** and **Chapter 3** under the contact sheet, **Back to page 4** in its bars, "Read it" on the writing page and "Email me to get started" on the commissions page get the drawn triangle in place of ← and →. The chapter list's ▾ and ▴ become the triangle pointing down and up (mock-up 8). The links and buttons otherwise look as today. |

Not changed: **Close** (✕), the zoom buttons (**+**, **−**, **Fit**), **All pages**, **Back to series**, and the menu button. They aren't arrows. Arrows in Star's own writing, and the story reader's scene break (⁂), are content, not controls.

## Mock-ups

Built to match the site, with its fonts, colours, paper and pictures. Source: `mockups/arrows/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | The shape: previous, next, first, newest and fold-out, and large beside Nunito | `mockups/arrows/1-shape.png` |
| 2 | Comic reader controls: today; on a laptop, on the newest page, with the pointer over **Previous** and its full name; on a 390 px phone, on page 1 | `mockups/arrows/2-comic-controls.png` |
| 3 | Comic edge arrow on a laptop, on the same page: today, and with the pointer over the right strip | `mockups/arrows/3-comic-edge.png` |
| 4 | Portfolio carousel, on its kraft band: today, and with the pointer over the right button | `mockups/arrows/4-carousel.png` |
| 5 | Full screen on a laptop, on the first piece, at the same scale: today, and after | `mockups/arrows/5-full-screen-laptop.png` |
| 6 | Full screen on a phone held upright: at rest, and with **Next** pressed | `mockups/arrows/6-full-screen-phone.png` |
| 7 | The states, on paper and on dark | `mockups/arrows/7-states.png` |
| 8 | Arrows beside words: today and after | `mockups/arrows/8-arrows-in-words.png` |
| 9 | A 320 px phone with text at 200%: the controls wrap two by two, as today | `mockups/arrows/9-text-200-narrow.png` |
| 10 | The carousel on a 320 px phone with text at 200%: 44 px arrows, and keyboard focus on the right one, on the kraft band | `mockups/arrows/10-carousel-text-200.png` |
| 11 | Full screen on a 320 px phone held upright, with text at 200%: the buttons fit their captions, and the zoom controls sit on their own row | `mockups/arrows/11-full-screen-text-200.png` |

## Accessibility

- Names don't change: the controls keep "First page of the series", "Previous page", "Next page", "Newest page of the series" (or "Last…"); the carousel keeps "Scroll left" and "Scroll right"; full screen keeps "Previous" and "Next"; the chapter links keep "Previous chapter: Chapter 1" and "Next chapter: Chapter 3". The drawn arrows are hidden from screen readers (`aria-hidden`), so nothing reads "left arrow" or "black right-pointing triangle". Three names lose a typed arrow, so a screen reader no longer reads it: **Back to page 4** ("← Back to page 4" today), "Read it" and "Email me to get started" (which have no label of their own, so their words are their names).
- Every arrow button is at least 44 by 44 px, and the comic controls at least 56 px tall, as today.
- The ink arrow on beige or yellow, and the beige arrow on near-black, are well above 3:1, as graphics need. The yellow hover doesn't carry meaning on its own: hovering is a pointer effect, and the button is the same button.
- Keyboard focus shows the site's ring (REQ-site-4). The comic controls are links and already show it; the carousel buttons show only the browser's own ring today, and gain the site's. On the carousel's kraft band (`#bd9f76` at its darkest) the purple ring is 3.8:1, above the 3:1 a focus ring needs (mock-up 10). Full screen keeps its yellow ring: purple on near-black would be 1.9:1.
- Nothing moves in any state; with reduced motion, the colour changes at once (REQ-site-4).
- With text at 200%, the captions grow and the arrows keep their size; the comic controls wrap two by two, as today (mock-up 9); the carousel keeps 44 px arrows (mock-up 10); full screen's buttons grow to their captions (mock-up 11).

## Other documents

Earlier designs aren't edited, so their history stays readable; this design replaces parts of them, and the spec for it says which:
- **design-comic-sheet-and-controls:** the look of the four controls' boxes and icons (Layout, "Each control is a bordered box…"), and the typed arrows in **← Back to page 4**, **← Chapter 1**, **Chapter 3 →** and the chapter list's ▾ (Flow and Layout). Their places, sizes, captions, labels, order, wrapping and states are unchanged.
- **design-comic-turn-pages:** the look of the edge arrows on wide screens (Layout). Where they are, when they show and what they do are unchanged.
- **design-portfolio-full-screen:** the look of **Previous** and **Next** (How it works, mock-ups). Their places, names, sizes and states are unchanged.
- **The style guide** (`docs/STYLE_GUIDE.md`) gains a section, "Arrows and navigation buttons", recording this design for later work, and its focus-ring line is corrected to the ring the site uses (2 px dark purple, not teal).

## For the guide

The fans' guide `reading-comics.md` names **← Back to page 4** (twice: where the sheet is described, and where it says how to go back) and **← Chapter 1** and **Chapter 3 →**. With the typed arrows gone from those names, it reads **Back to page 4**, **Chapter 1** and **Chapter 3**. `viewing-artwork.md` names no arrows and doesn't change.

## For the spec to check

- No control on the site uses a typed arrow (‹ › ◀ ▶ ← → ▾ ▴ ⏮ ⏭): the comic controls, edge arrows, carousel, full screen, contact sheet links, the chapter list, "Read it" and "Email me to get started" use the drawn shape, from one shared source, hidden from screen readers.
- The arrow buttons in the comic reader, the edge arrows, the carousel and full screen share one style: at rest, beige with a 3 px ink border and no shadow; with the pointer over them (only where the device can hover), yellow; pressed, an ink fill with a beige arrow; can't be used (not the carousel), dashed with no fill; and the dark variant in full screen. None has a box shadow.
- No state moves or resizes a button: on a laptop, full screen's **Previous** and **Next** stay centred on the screen's height with the pointer over them and while pressed.
- Keyboard focus shows a visible ring on each (purple on paper, yellow in full screen); a mouse click doesn't.
- With reduced motion, the colour changes have no transition.
- Accessible names are unchanged, apart from **Back to page 4**, "Read it" and "Email me to get started" losing their arrows.
- The carousel buttons are 44 by 44 px at every width, including 320 px with text at 200%.
- With text at 200% on a 320 px phone held upright, full screen's **Previous** and **Next** show their whole captions inside their borders, and nothing in the bottom bar overlaps.
- The comic edge strip still turns the page on a click anywhere in it, and is still hidden from screen readers and not a tab stop.
- Everything else about the comic reader, portfolio and full screen, including their existing tests, is unchanged.

## Decisions at review

The lead's review (2026-11-06), so far:
- **No drop shadows** on arrow buttons: they fight the ink-on-paper look. With no shadow, nothing lifts or sinks either: hover is yellow only, and pressed is inked in (mock-ups redrawn). This settles the earlier question of adding the shadow to the comic controls.

Still open:
1. **Yellow on hover** for every arrow button, as the site's primary buttons do (proposed)?
2. **Words with arrows** ("Read it", "Email me to get started", the chapter links and the chapter list): change them too (proposed), or only the arrows that stand alone?

## Persona walkthrough

A walkthrough for persona-fan, and for persona-artist on the look (2026-11-06), opened each mock-up and checked the design against the code. It found one blocking problem, five misleading ones and seven slower ones. All are addressed above:
- **Blocking:** a lift written as a CSS `transform` would have replaced full screen's centring of **Previous** and **Next**, making them jump about 36 px on hover (since the review, nothing moves at all, with a check for the spec).
- **Misleading:**
  - "Read it" and "Email me to get started" lose their arrows from their spoken names too, not only **Back to page 4**;
  - the hover's shadow was hard, unlike `.btn-primary`'s soft one (since the review, there's no shadow);
  - the comic controls already show the site's focus ring; only the carousel doesn't;
  - on a phone, hover would stick after a tap that loads no new page (now hover is only where the device can hover);
  - the guide names **← Back to page 4** twice.
- **Slower:**
  - reduced motion was stated two ways (now nothing moves in any state);
  - mock-up 4 drew the carousel on paper, not its kraft band (redrawn, with the focus ring checked there);
  - the carousel's "can't be used" state was undefined (it has none);
  - the carousel's size today, and with text at 200% (mock-up 10);
  - full screen's captions overflow with text at 200% (now the buttons grow, and the zoom controls take their own row; mock-up 11);
  - the faded state's values, the contrast exemption, and the fill change;
  - uneven before-and-after pairs in mock-ups 3 and 5 (now the same page, and the same scale).
