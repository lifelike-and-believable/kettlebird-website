---
id: design-phone-header
status: draft
derived-from:
  - requirements-site#REQ-site-1: 2952fc870a66
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - persona-fan#context-of-use: 38883e5abc09
  - design-comic-start-reading#layout: b2ee001b16a0
  - design-comic-turn-pages#how-a-page-turn-works: e347e19f1496
  - persona-artist#goals: f3044c738f84
---

# Phone header: design

<!-- docs/design/phone-header.md. A small design, asked for by the lead, for a shorter site header on
phones. Mock-ups are in docs/design/mockups/phone-header/ (PNG images, and mockups.html, the source
they are rendered from with render.mjs, built to match the site's header with its fonts, colours and
images). Built as a tier:fix change to src/layouts/BaseLayout.astro once approved. -->

## Personas

- persona-fan: fans usually arrive on a phone from a social post or shared link (#skills-and-tools) and decide within seconds whether to keep looking (#context-of-use); they came to see Star's art or read a comic (#goals). On a phone today, the header takes over a third of the first screen, and a band of empty paper sits under the title, so the art starts lower than it needs to. Some fans enlarge text (#skills-and-tools), so the header must still work then.
- persona-artist: the torn-paper header is part of Star's look (#goals), so the change keeps the paper, the tear, the fonts and the colours, and only removes the empty band.

## The problem

The site header has a fixed minimum height of 300 px at every screen width, so the torn paper edge always sits 300 px down. On phones the title, subtitle and menu button only fill the top half of it.

| Screen | Header today | Share of the first screen | After this change |
|---|---|---|---|
| Phone, 360 × 740 | 300 px | 41% | about 119 px, 16% |
| Phone, 390 × 844 | 300 px | 36% | about 119 px, 14% |
| Tablet, 768 × 1024 (for example an iPad mini) | 300 px | 29% | about 119 px, 12% |
| Tablet, 820 × 1180 or wider | 300 px | 25% | unchanged |

## The change (option A, recommended)

On screens up to and including 768 px wide, the width at which the navigation already collapses behind the menu button:

- **The title and the menu button share one row.** "Kettlebird" stays the largest thing on the screen, at 40 px (today 56 px), with the subtitle under it and the menu button at the right, centred on the two lines. Today the button sits beside the subtitle, so the header's markup changes: the title and subtitle are grouped, with the button after them. The order a keyboard user tabs through stays the same: the title, then the menu button, then the links in the menu.
- **The subtitle stays,** "Comics + Illustration", smaller (17 px, today 24 px).
- **The header is as tall as what's in it,** with no minimum height. The torn paper edge sits just below the subtitle, about 119 px down.
- **With enlarged text, the header wraps instead of overflowing.** If the title, subtitle and button don't fit on one row, the button moves to its own line under them. The title is capped at 13% of the screen's width (`min(2.5rem, 13vw)`), so it still grows with enlarged text but never runs off the screen (mock-up 6).
- **Unchanged:** the torn paper image, fonts, colours, the menu button's look, size, label and `aria-expanded`, and the menu itself, which opens as a panel directly under the header with the same seven links.
- **Wider screens, above 768 px, are unchanged.** See the open question about desktops.

**Option B** (mock-up 5) drops the subtitle on phones too, for an 88 px header (10%). It isn't recommended: the subtitle tells a new visitor what the site is, and option A already saves most of the space.

## Mock-ups

Each mock-up is a phone screen built to match the site's header, with its fonts, colours and torn-paper image, and the start of the comics page below it. A dashed red line marks the bottom of the header, with its height. Source: `mockups/phone-header/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | Today, 390 px wide: 300 px, 36% of the screen | `mockups/phone-header/1-today.png` |
| 2 | Option A, 390 px wide: 119 px, 14% | `mockups/phone-header/2-option-a.png` |
| 3 | Option A with the menu open | `mockups/phone-header/3-option-a-menu-open.png` |
| 4 | Option A on a small phone, 360 px wide: 119 px, 16% | `mockups/phone-header/4-option-a-360.png` |
| 5 | Option B, no subtitle: 88 px, 10% | `mockups/phone-header/5-option-b.png` |
| 6 | Option A with text enlarged to 200%: the button moves under the title, and nothing runs off the screen | `mockups/phone-header/6-option-a-text-200.png` |

## Layout

- Up to 768 px wide: the title and subtitle on the left and the 44 × 44 px menu button on the right; 14 px of space above, about 36 px of torn paper below.
- The title still links to the home page.
- **Series pages:** **Start reading** and the cover sit about 180 px higher. The cover is capped today at a fifth of the screen's height, a workaround for the tall header; this change leaves that cap alone (see open questions).
- **The comic reader:** it opens scrolled so the reader bar is at the top of the window, with the header out of view (design-comic-turn-pages#how-a-page-turn-works), so this change doesn't show there until the fan scrolls up.

## Accessibility

- The menu button keeps its 44 × 44 px size, its label, and `aria-expanded` (REQ-site-1), and the tab order is unchanged.
- Text sizes stay large: the title at 40 px and the subtitle at 17 px.
- Colours and contrast are unchanged: dark ink on the same paper.
- With text enlarged to 200% or a screen 320 px wide, nothing scrolls sideways and the menu button stays on screen: the header has no fixed height, wraps when it must, and caps the title's width.

## For the spec to check

- On 360 × 740, 390 × 844 and 768 × 1024 screens, every page's header is no taller than 130 px; at 769 px and wider it is as today (300 px, with a title of `clamp(3.5rem, 8vw, 5.5rem)`).
- Up to 768 px wide, the title and the menu button are on the same row, the subtitle is shown under the title, the title links to the home page, and the button is 44 × 44 px.
- The menu still opens and closes with `aria-expanded`, and its panel starts directly under the header.
- With the root font size at 200%, on a 390 px screen, and on a 320 px screen, the page doesn't scroll sideways and the menu button is fully on screen.
- On a 360 × 640 screen, a series page's **Start reading** is visible without scrolling (the size the comic reader's own tests use).

## Open questions

1. **Star's sign-off.** The title shrinks from 56 to 40 px on phones and the torn edge is shallower. Does Star approve mock-ups 2 to 4 as still looking like her site?
2. **Desktops.** The header is also 300 px on a 1280 × 800 laptop screen (38%), for the same reason: a fixed minimum height. Should a later change make it fit its content there too? It's out of scope here, because the desktop header is the main place Star's torn-paper style shows.
3. **The series cover.** With the shorter header, the series page's cover could return to the third of the screen design-comic-start-reading allows, instead of today's fifth. Should that come with this change, or separately?

## Persona walkthrough

A walkthrough for persona-fan, and for persona-artist on the look (2026-11-02), opened each mock-up and checked the sizes against the code. It found one blocking problem, four misleading ones and three slower ones. All are addressed above:
- **Blocking:** with text enlarged to 200%, the title row didn't wrap and pushed the menu button off the screen (now the row wraps and the title is capped by the screen's width; mock-up 6).
- **Misleading:**
  - the reader's scroll was credited to the wrong design (it's design-comic-turn-pages);
  - "nothing else changes" hid that the menu button moves in the markup (now stated, with the unchanged tab order);
  - the mock-ups were "built from" the site's markup, but are built to match it;
  - which tablets change was unclear (now a table row for each).
- **Slower:**
  - whether the series cover's workaround is lifted (now an open question);
  - the checks for the spec were incomplete (now cover enlarged text, narrow screens, the subtitle, the title link, the button size, the 768 px boundary and the menu panel);
  - nothing recorded Star's sign-off on her look (now an open question).
