---
id: design-phone-header
status: approved
derived-from:
  - requirements-site#REQ-site-1: 2952fc870a66
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - persona-fan#context-of-use: 38883e5abc09
  - design-comic-start-reading#layout: b2ee001b16a0
  - design-comic-turn-pages#how-a-page-turn-works: e347e19f1496
  - persona-artist#goals: f3044c738f84
---

# A shorter site header: design

<!-- docs/design/phone-header.md. A small design, asked for by the lead, for a shorter site header on
phones, extended to laptops at the lead's review (2026-11-02). Mock-ups are in docs/design/mockups/phone-header/ (PNG images, and mockups.html, the source
they are rendered from with render.mjs, built to match the site's header with its fonts, colours and
images). Built as a change to src/layouts/BaseLayout.astro and the series page once approved. -->

## Personas

- persona-fan: fans usually arrive on a phone from a social post or shared link (#skills-and-tools) and decide within seconds whether to keep looking (#context-of-use); they came to see Star's art or read a comic (#goals). On a phone today, the header takes over a third of the first screen, and a band of empty paper sits under the title, so the art starts lower than it needs to. Some fans enlarge text (#skills-and-tools), so the header must still work then.
- persona-artist: the torn-paper header is part of Star's look (#goals), so the change keeps the paper, the tear, the fonts and the colours, and only removes the empty band. Star approved mock-ups 2 to 4 (2026-11-02, through the lead).

## The problem

The site header has a fixed minimum height of 300 px at every screen width, so the torn paper edge always sits 300 px down. On phones the title, subtitle and menu button only fill the top half of it; on laptops there's a band of empty paper between the links and the tear. The paper image also ends in a transparent strip, about 18 px tall on a laptop, which shows as more blank space under the tear.

| Screen | Header today | Share of the first screen | After this change |
|---|---|---|---|
| Phone, 360 × 740 | 300 px | 41% | about 119 px, 16% |
| Phone, 390 × 844 | 300 px | 36% | about 119 px, 14% |
| Tablet, 768 × 1024 (for example an iPad mini) | 300 px | 29% | about 127 px, 12% |
| Tablet, 820 × 1180 | 300 px | 25% | the laptop layout, as tall as its content |
| Laptop, 1280 × 800 | 300 px | 38% | about 244 px, 31% |

## The change (option A, recommended)

On screens up to and including 768 px wide, the width at which the navigation already collapses behind the menu button:

- **The title and the menu button share one row.** "Kettlebird" stays the largest thing on the screen, at 40 px (today 56 px), with the subtitle under it and the menu button at the right, centred on the two lines. Today the button sits beside the subtitle, so the header's markup changes: the title and subtitle are grouped, with the button after them. The order a keyboard user tabs through stays the same: the title, then the menu button, then the links in the menu.
- **The subtitle stays,** "Comics + Illustration", smaller (17 px, today 24 px).
- **The header is as tall as what's in it,** with no minimum height. The torn paper edge sits just below the subtitle, about 119 px down.
- **With enlarged text, the header wraps instead of overflowing.** If the title, subtitle and button don't fit on one row, the button moves to its own line under them. The title is capped at 13% of the screen's width (`min(2.5rem, 13vw)`), so it still grows with enlarged text but never runs off the screen (mock-up 6).
- **Unchanged:** the torn paper image, fonts, colours, the menu button's look, size, label and `aria-expanded`, and the menu itself, which opens as a panel directly under the header with the same seven links.

## Laptops and wider (above 768 px)

- **The same layout as today:** the title, then the subtitle with the row of links beside it, at today's sizes.
- **No blank space:** the header is as tall as its content, with just enough paper below the links for the tear. On a 1280 × 800 laptop it's about 244 px (31%), from 300 px (38%), and the tear sits right under the links (mock-up 8).

## At every width

- **No minimum height, and the same room above the tear everywhere.** Under the content there's `max(2.25rem, calc(22px + 3.1vw))` of paper: the tear's own height plus about 22 px between the text and the tear's highest point, the gap phones have. (This replaces the earlier 5 px addition for laptops; at the lead's review of the built pages, the tear on a laptop still sat about 10 px from the links.)
- **No transparent strip.** The paper is drawn on a layer that reaches 2.2vw below the header, so the image's transparent bottom strip falls outside the header and the tear is the header's bottom edge. The layer lets clicks through, and the menu panel still opens directly under the header.
- **The tear dips toward both edges on every screen.** The image is shown at least 160% of the screen's width, so every screen shows its middle slice. Phones always showed that slice; laptops showed the whole image, whose tear rises at both ends, which looked less balanced (the lead's review of the built pages, 2026-11-02).

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
| 7 | Today on a laptop, 1280 × 800: 300 px, 38% | `mockups/phone-header/7-laptop-today.png` |
| 8 | After, on a laptop, at the design stage (the built header, with the same room above the tear as phones, is about 244 px, 31%) | `mockups/phone-header/8-laptop-after.png` |

## Layout

- Up to 768 px wide: the title and subtitle on the left and the 44 × 44 px menu button on the right; 14 px of space above, about 36 px of torn paper below.
- Above 768 px: as today, less the empty band and the transparent strip.
- The title still links to the home page.
- **Series pages:** **Start reading** and the cover sit about 180 px higher on phones. The cover returns to the original rule, no taller than a third of the screen (design-comic-start-reading#layout), instead of the fifth it was capped at to make room for the tall header. **Start reading** must still be visible without scrolling on a 360 × 640 screen.
- **The comic reader:** it opens scrolled so the reader bar is at the top of the window, with the header out of view (design-comic-turn-pages#how-a-page-turn-works), so this change doesn't show there until the fan scrolls up.

## Accessibility

- The menu button keeps its 44 × 44 px size, its label, and `aria-expanded` (REQ-site-1), and the tab order is unchanged.
- Text sizes stay large: the title at 40 px and the subtitle at 17 px.
- Colours and contrast are unchanged: dark ink on the same paper.
- With text enlarged to 200% or a screen 320 px wide, nothing scrolls sideways and the menu button stays on screen: the header has no fixed height, wraps when it must, and caps the title's width.

## For the spec to check

- On 360 × 740, 390 × 844 and 768 × 1024 screens, every page's header is no taller than 130 px.
- On a 1280 × 800 screen, every page's header is no taller than 250 px, with the title at today's size (`clamp(3.5rem, 8vw, 5.5rem)`) and the subtitle and links on one row.
- At every width, nothing transparent shows inside the header: the paper reaches its top edge, and its bottom edge is the tear.
- Up to 768 px wide, the title and the menu button are on the same row, the subtitle is shown under the title, the title links to the home page, and the button is 44 × 44 px.
- The menu still opens and closes with `aria-expanded`, and its panel starts directly under the header.
- With the root font size at 200%, on a 390 px screen, and on a 320 px screen, the page doesn't scroll sideways and the menu button is fully on screen.
- On a 360 × 640 screen, a series page's **Start reading** is visible without scrolling (the size the comic reader's own tests use), with the cover no taller than a third of the screen.

## Decisions at review

The lead's review (2026-11-02) settled the three open questions:
1. **Star's sign-off:** Star approves mock-ups 2 to 4.
2. **Laptops:** remove the unneeded blank space there too ("Laptops and wider", mock-ups 7 and 8).
3. **The series cover:** go back to the original rule, a third of the screen.
4. **Room above the tear on laptops:** after seeing mock-up 8, the lead asked for 5 px more between the links and the tear.

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
  - nothing recorded Star's sign-off on their look (now an open question).

The laptop change and the series cover were added after this walkthrough, at the lead's review, and checked with the mock-ups above.
