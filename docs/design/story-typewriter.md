---
id: design-story-typewriter
status: approved
derived-from:
  - design-story-text-frame#the-change: 10e409ae6a11
  - design-story-reader#layout: 97cf455208c8
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#context-of-use: 38883e5abc09
  - persona-artist#goals: f3044c738f84
---

# The story's sheet comes out of a typewriter: design

<!-- docs/design/story-typewriter.md. A design amendment from a change request by the lead (2026-11-08), with a
photo of a 1950s office typewriter: at the bottom of a story's page, draw a typewriter, so that scrolling down
looks like the paper scrolling up out of it. Mock-ups are in docs/design/mockups/story-typewriter/: screenshots of
the fixture build with typewriter.css and typewriter.svg added, and thirty paragraphs of stand-in text so the page
scrolls as a real chapter does, made by render.mjs. The lead's decisions (2026-11-08): the typewriter follows the reader; the KETTLEBIRD
nameplate; phones too; Star draws the final artwork, nameplate included, to replace the stand-in drawing. -->

## Personas

- persona-fan: reads in short sessions, usually on a phone (#context-of-use). The white sheet (design-story-text-frame) already reads as a printed page; the typewriter makes it a page still in the machine, so scrolling down feels like the story being typed out as they read. It's drawing only: it adds nothing to tap, and the text keeps its width and its contrast.
- persona-artist: a little of the studio's character on Star's writing pages, as the paper texture and torn header are on the rest of the site. Star enters nothing new: every story and chapter gets it.

## The change

This amends design-story-text-frame, "The change": the sheet comes out of a typewriter.

- **The drawing:** an original drawing of a 1950s office typewriter seen from the typist's chair, in the site's own colours: the black roller (platen) with its two ribbed knobs, the chrome paper bail with two rubber rollers lying across the paper, the carriage with its scale, the type guide and a red ribbon at the printing point, the carriage return lever off to the left, and the top of a warm grey-brown body (`typewriter.svg`). It's drawn for the site, not taken from the photo or from any maker's machine, and where a maker's name would be it says "KETTLEBIRD". This drawing is a stand-in: Star draws the final artwork, nameplate included (see "The artwork from Star").
- **Where it sits:** under the story's sheet, on a one-shot's page and on each chapter page. The paper goes in behind the roller and comes out above it; the bail lies over the paper, as on a real machine. Nothing else on the page changes.
- **While reading:** the typewriter stays at the bottom of the screen while the text is on screen, and the text scrolls up out of it (mock-ups 1, 2 and 6). On opening the page, the top of the sheet is already out of the machine (mock-up 3).
- **At the end:** when the last line comes out, the typewriter stops following and stays under the last line, with the end of the sheet still in the machine; the chapter buttons and "That's the newest chapter." follow below it, on the paper background (mock-ups 4 and 5).
- **Its size:** the roller is wider than the sheet, so the sheet's width is the middle 80% of the drawing, and the drawing's height follows its width. Measured on the fixture build:

  | Screen width | Typewriter                                 | Its height |
  | ------------ | ------------------------------------------ | ---------- |
  | 320 pixels   | 360 pixels wide, cut by the screen's edges | 47 pixels  |
  | 390 pixels   | 448 pixels wide, cut by the screen's edges | 58 pixels  |
  | 700 pixels   | 835 pixels wide                            | 109 pixels |
  | 1280 pixels  | 1120 pixels wide                           | 146 pixels |

  On a phone the knobs reach past the screen's edges, as if the reader were sitting close to the machine; the page clips them, so nothing scrolls sideways at any of these widths.

- **The space it takes:** while it follows the text, it covers the bottom of the screen: about 7% of a phone's screen and 18% of a laptop's. The text under it is the text the reader hasn't reached yet, and it comes up into view as they scroll. Paging down with the keyboard (Space, Page Down) moves by the screen less the typewriter's height, so no line is skipped under it.
- **A ticked story** (design-story-mature-content): while **Before you read** asks first, the typewriter is hidden with the text and its sheet (mock-up 8); after **Continue to the story** they appear together. Without scripts, all three show under the box, as the sheet does now.
- **Preview** shows it, as the site will.
- **Printing** leaves it out: the printed story is the text, as now.

## Decisions from the lead (2026-11-08)

1. **The typewriter follows the reader:** it stays at the bottom of the screen while reading, and the text scrolls up out of it (mock-ups 1 to 6). Showing it only at the end (mock-up 7) is not chosen.
2. **A nameplate:** "KETTLEBIRD" on the body, where a maker's name would be (mock-ups 1 to 8), not a plain body (mock-up 9). Star decides how the final nameplate looks, as part of their artwork.
3. **On phones too,** as on a computer (mock-ups 2, 5 and 6, about 50 to 60 pixels tall).
4. **Star draws the final typewriter.** The lead asks Star for it; the stand-in drawing in the mock-ups ships until it arrives, and is then replaced without a design change.

## The artwork from Star

What the final drawing needs, so that it drops in where the stand-in is:

- **Seen from the typist's chair,** the paper going in behind the roller and coming out above it.
- **The paper slot:** the middle 80% of the drawing's width, where the paper shows. The roller, the knobs and the lever can reach past it; the build places the drawing so the slot lines up with the sheet.
- **Above the roller:** see-through, apart from anything that lies over the paper, like the paper bail; the paper shows there.
- **Below the top of the roller,** across the whole slot: solid, so no paper shows under the machine.
- **Its height:** the stand-in is 13 high for every 100 wide (146 pixels on a laptop, 58 on a phone). A taller drawing covers more of the screen while reading; about the same is best.
- **The format:** SVG if Star can; otherwise a PNG with a see-through background, at least 2240 pixels wide, so it stays sharp on the sharpest laptop screens.
- **The nameplate:** Star's own lettering for "KETTLEBIRD", or any nameplate they choose.

## Mock-ups

Screenshots of the fixture build (The Long Road, chapter 3, with thirty paragraphs of stand-in text added; Night Market, a ticked one-shot) with `typewriter.css` and `typewriter.svg` added. Source: `mockups/story-typewriter/render.mjs`.

| #   | What it shows                                                                                                        | File                                                    |
| --- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | On a computer, mid-chapter: the text scrolling up out of the typewriter at the bottom of the screen                  | `mockups/story-typewriter/1-middle-laptop.png`          |
| 2   | On a phone, mid-chapter                                                                                              | `mockups/story-typewriter/2-middle-phone.png`           |
| 3   | On a computer, on opening the page: the chapter's title and buttons, the top of the sheet already out of the machine | `mockups/story-typewriter/3-start-laptop.png`           |
| 4   | The end of a chapter on a computer: the typewriter at rest under the last line, the chapter buttons below            | `mockups/story-typewriter/4-end-laptop.png`             |
| 5   | The end of a chapter on a phone                                                                                      | `mockups/story-typewriter/5-end-phone.png`              |
| 6   | On the narrowest phones (320 pixels), mid-chapter                                                                    | `mockups/story-typewriter/6-middle-320.png`             |
| 7   | Not chosen: only at the end, mid-chapter on a computer, no typewriter                                                | `mockups/story-typewriter/7-option-b-middle-laptop.png` |
| 8   | A ticked one-shot on a phone before **Continue to the story**: no sheet and no typewriter                            | `mockups/story-typewriter/8-one-shot-ticked-phone.png`  |
| 9   | Not chosen: the end of a chapter with a plain body, no nameplate                                                     | `mockups/story-typewriter/9-end-laptop-plain.png`       |

## Where it applies

| #   | Where                                                  | After                                                                                                                                                                                                                                                                                                                                          |
| --- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `src/components/stories/StoryText.astro`               | The typewriter drawing after the text, inside the sheet, marked decorative (`aria-hidden="true"`), as in `mockups/story-typewriter/typewriter.css`: `position: sticky; bottom: 0`; the sheet's width over 0.8 wide, centred on the sheet; the sheet's bottom padding moves above the typewriter, so the sheet ends inside it. Hidden in print. |
| 2   | The typewriter drawing                                 | The stand-in SVG, `typewriter.svg`, inline, so it costs no extra download (about 4 KB); replaced by Star's artwork when it arrives.                                                                                                                                                                                                            |
| 3   | The writing pages' layout                              | The main column clips what reaches past the screen's edges (`overflow-x: clip`, which keeps `sticky` working); `scroll-padding-bottom` of the typewriter's height while it follows the text.                                                                                                                                                   |
| 4   | `docs/STYLE_GUIDE.md` and the Kettlebird design system | The typewriter as part of the story's sheet.                                                                                                                                                                                                                                                                                                   |

Nothing changes in the editor, the guides or the tutorials: they don't describe how the text looks on the page.

## States and errors

| Situation                                        | What happens                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| A one-shot or a chapter, longer than the screen  | The typewriter at the bottom of the screen while reading then at rest under the last line. |
| A text shorter than the screen                   | The typewriter under the last line from the start.                                         |
| A story in chapters, on its own page             | No sheet and no typewriter: the page has the chapter list, not text.                       |
| A ticked story, before **Continue to the story** | Neither the sheet nor the typewriter shows.                                                |
| A ticked story, after it, or without scripts     | The sheet and the typewriter under **Before you read**.                                    |
| A picture opened full screen                     | The full-screen view covers the page, typewriter included, as now.                         |
| Preview                                          | As on the site.                                                                            |
| Printing                                         | No typewriter.                                                                             |

## Accessibility

- The typewriter is drawing only: `aria-hidden="true"`, no name, no focus stop, and it takes no taps or clicks (`pointer-events: none`), so a tap on a picture under it still reaches the picture. Screen readers hear the page as before.
- Nothing moves on its own: the paper moves only as the reader scrolls, so there is no animation for reduced-motion settings to stop.
- The text under the typewriter is the text not yet reached; keyboard paging accounts for its height (`scroll-padding-bottom`), and when **Continue to the story** moves focus to the text, the text's start is at the top of the screen, above the typewriter.
- At 200% zoom and on a 320-pixel screen nothing scrolls sideways; the typewriter grows with the sheet, not with the text size, so zoom doesn't make it cover more of the screen than the text.
- The text's contrast is unchanged: ink on white, about 14:1. The chrome bail lies across a line of text as it passes the roller, as on a real machine; the line is readable a moment later, above it.

## For the spec to check

- The typewriter under the text on a one-shot's page and a chapter's page, and nowhere else; hidden from screen readers; no focus stop; taps pass through it.
- At the bottom of the screen mid-chapter, then at rest under the last line with the chapter buttons below.
- Its width and height at 320, 390, 700 and 1280 pixels as in the table above; no sideways scrolling at 320 pixels and at 200% zoom.
- A ticked story: hidden with the text until **Continue to the story**; shown without scripts.
- Not printed.
- The accessibility check (axe) passes on the pages with it.
