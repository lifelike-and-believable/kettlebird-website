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
- persona-artist: Star wants the site to look like Star's own style (#goals): thick ink borders, sharp corners, hard shadows, yellow highlights and the rounded Nunito lettering. The arrows are drawn to match.

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

**One button.** Every arrow that stands on its own, without words beside it, sits in one button style, built from the style guide's parts (mock-up 7):

- **At rest:** beige (`--color-beige`), a 3 px ink border, sharp corners, and the hard shadow, 4 px down and right (`4px 4px 0 rgba(0,0,0,.3)`). At least 44 by 44 px.
- **Pointer over it:** yellow (`--color-yellow`), lifted 2 px up and left, with the shadow at 6 px. This is the site's primary buttons' hover (`.btn-primary`).
- **Pressed:** yellow, moved 2 px down and right, with no shadow, as if pressed onto the paper.
- **Keyboard focus:** the site's focus ring, 2 px dark purple (`--color-dark-purple`) 2 px outside the border, shown only for the keyboard (`:focus-visible`).
- **Can't be used:** as today, a dashed, faded border and a faded arrow; no shadow and no fill, so it reads as flat and out of reach.
- **Motion:** the colour, lift and shadow change over 120 ms (`--transition-fast`). With reduced motion, they change at once.

**On dark** (full screen), the same button turned around: near-black (`#161616`) with a beige border, arrow and caption, and a pale shadow (`4px 4px 0 rgba(245,241,232,.25)`). With the pointer over it or pressed, it turns yellow with an ink arrow, as on paper. Its focus ring stays full screen's yellow, 3 px, which shows on near-black where purple wouldn't.

**Beside words.** In a link or button with words, the arrow is the same triangle, about three quarters of the letters' height, in the text's colour, on the side it points to (mock-up 8). It's hidden from screen readers; the words carry the meaning.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | Comic reader controls | The same four controls, places, sizes (at least 56 px tall), captions and full-name labels (design-comic-sheet-and-controls#layout), in the arrow button style, with the soft arrows (mock-up 2). |
| 2 | Comic edge arrows | The quiet strip at each edge of the page stays (15% of the page wide, the page's full height, laptops only, mouse only), and still turns the page wherever it's clicked. In place of the faint character, the arrow button shows in the middle of the strip, yellow, while the pointer is over the strip; elsewhere nothing shows (mock-up 3). It stays hidden from screen readers and isn't a tab stop (design-comic-turn-pages#layout). |
| 3 | Portfolio carousel | Two arrow buttons, at least 44 px (40 px today), either side of the row; they no longer grow on hover (mock-up 4). On a narrow screen with large text they keep their 44 px; the row of pictures gives up the room. |
| 4 | Full screen **Previous** and **Next** | The dark arrow button, with its caption, in the same places (design-portfolio-full-screen#how-it-works): at the sides on a laptop or a phone held sideways (mock-up 5), and in the bottom bar's corners on a phone held upright (mock-up 6). |
| 5 | Words with arrows | **Chapter 1** and **Chapter 3** under the contact sheet, **Back to page 4** in its bars, "Read it" on the writing page and "Email me to get started" on the commissions page get the drawn triangle in place of ← and →. The chapter list's ▾ and ▴ become the triangle pointing down and up (mock-up 8). The links and buttons otherwise look as today. |

Not changed: **Close** (✕), the zoom buttons (**+**, **−**, **Fit**), **All pages**, **Back to series**, and the menu button. They aren't arrows. Arrows in Star's own writing, and the story reader's scene break (⁂), are content, not controls.

## Mock-ups

Built to match the site, with its fonts, colours, paper and pictures. Source: `mockups/arrows/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | The shape: previous, next, first, newest and fold-out, and large beside Nunito | `mockups/arrows/1-shape.png` |
| 2 | Comic reader controls: today; on a laptop, on the newest page, with the pointer over **Previous** and its full name; on a 390 px phone, on page 1 | `mockups/arrows/2-comic-controls.png` |
| 3 | Comic edge arrow on a laptop: today, and with the pointer over the right strip | `mockups/arrows/3-comic-edge.png` |
| 4 | Portfolio carousel: today, and with the pointer over the right button | `mockups/arrows/4-carousel.png` |
| 5 | Full screen on a laptop, on the first piece: today, and after | `mockups/arrows/5-full-screen-laptop.png` |
| 6 | Full screen on a phone held upright: at rest, and with **Next** pressed | `mockups/arrows/6-full-screen-phone.png` |
| 7 | The states, on paper and on dark | `mockups/arrows/7-states.png` |
| 8 | Arrows beside words: today and after | `mockups/arrows/8-arrows-in-words.png` |
| 9 | A 320 px phone with text at 200%: the controls wrap two by two, as today | `mockups/arrows/9-text-200-narrow.png` |

## Accessibility

- Names don't change: the controls keep "First page of the series", "Previous page", "Next page", "Newest page of the series" (or "Last…"); the carousel keeps "Scroll left" and "Scroll right"; full screen keeps "Previous" and "Next"; the chapter links keep "Previous chapter: Chapter 1" and "Next chapter: Chapter 3". The drawn arrows are hidden from screen readers (`aria-hidden`), so nothing reads "left arrow" or "black right-pointing triangle". **Back to page 4** loses the typed ←, so a screen reader no longer reads an arrow before its name.
- Every arrow button is at least 44 by 44 px, and the comic controls at least 56 px tall, as today.
- The ink arrow on beige or yellow, and the beige arrow on near-black, are well above 3:1, as graphics need. The yellow hover doesn't carry meaning on its own: hovering is a pointer effect, and the button is the same button.
- Keyboard focus shows the site's ring (REQ-site-4), which the controls and carousel buttons don't show clearly today; full screen keeps its yellow ring.
- With reduced motion, nothing moves: hover and press change colour and shadow at once (REQ-site-4).
- With text at 200%, the captions grow and the arrows keep their size; the comic controls wrap two by two, as today (mock-up 9).

## Other documents

Earlier designs aren't edited, so their history stays readable; this design replaces parts of them, and the spec for it says which:
- **design-comic-sheet-and-controls:** the look of the four controls' boxes and icons (Layout, "Each control is a bordered box…"), and the typed arrows in **← Back to page 4**, **← Chapter 1**, **Chapter 3 →** and the chapter list's ▾ (Flow and Layout). Their places, sizes, captions, labels, order, wrapping and states are unchanged.
- **design-comic-turn-pages:** the look of the edge arrows on wide screens (Layout). Where they are, when they show and what they do are unchanged.
- **design-portfolio-full-screen:** the look of **Previous** and **Next** (How it works, mock-ups). Their places, names, sizes and states are unchanged.
- **The style guide** (`docs/STYLE_GUIDE.md`) gains a section, "Arrows and navigation buttons", recording this design for later work, and its focus-ring line is corrected to the ring the site uses (2 px dark purple, not teal).

## For the guide

The fans' guide `reading-comics.md` names **← Back to page 4**, **← Chapter 1** and **Chapter 3 →**. With the typed arrows gone from those names, it reads **Back to page 4**, **Chapter 1** and **Chapter 3**. `viewing-artwork.md` names no arrows and doesn't change.

## For the spec to check

- No control on the site uses a typed arrow (‹ › ◀ ▶ ← → ▾ ▴ ⏮ ⏭): the comic controls, edge arrows, carousel, full screen, contact sheet links, the chapter list, "Read it" and "Email me to get started" use the drawn shape, from one shared source, hidden from screen readers.
- The arrow buttons in the comic reader, the edge arrows, the carousel and full screen share one style: at rest, a 3 px border and a 4 px hard shadow; with the pointer over them, yellow, lifted 2 px, with a 6 px shadow; pressed, yellow, with no shadow; can't be used, dashed with no shadow; and the dark variant in full screen.
- Keyboard focus shows a visible ring on each (purple on paper, yellow in full screen); a mouse click doesn't.
- With reduced motion, the hover and press changes have no transition.
- Accessible names are unchanged, apart from **Back to page 4** losing its "←".
- The carousel buttons are at least 44 by 44 px at every width, including 320 px with text at 200%.
- The comic edge strip still turns the page on a click anywhere in it, and is still hidden from screen readers and not a tab stop.
- Everything else about the comic reader, portfolio and full screen, including their existing tests, is unchanged.

## Decisions at review

Questions for the lead:
1. **Yellow on hover** for every arrow button, as the site's primary buttons do (proposed), or only a lift?
2. **The hard shadow on the comic controls**, which they don't have today (proposed, so all arrow buttons match).
3. **Words with arrows** ("Read it", "Email me to get started", the chapter links and the chapter list): change them too (proposed), or only the arrows that stand alone?

## Persona walkthrough

To be run before review.
