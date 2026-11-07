---
id: design-story-text-frame
status: approved
derived-from:
  - design-story-reader#layout: 97cf455208c8
  - design-story-import#mock-ups: 35f30fa64392
  - design-story-mature-content#the-change: 23eafbff95f4
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#context-of-use: 38883e5abc09
  - persona-artist#goals: f3044c738f84
---

# A white frame for the story text: design

<!-- docs/design/story-text-frame.md. A design amendment from a change request by the lead (2026-11-07): add a
white background frame to the story text on the writing pages. The lead chose option B, today's text width on
phones, and the text alone (2026-11-07). Mock-ups are in docs/design/mockups/story-text-frame/: screenshots of
the fixture build with the styles added (frame-b.css, the chosen look; frame.css, option A, not chosen), made by
render.mjs. -->

## Personas

- persona-fan: reads in short sessions, usually on a phone (#context-of-use). Today the text sits straight on the textured paper background. A plain white page behind the words separates the reading from the rest of the page and gives the dark ink the most contrast, so a long chapter is easier on the eyes. The text keeps today's width, so nothing reflows.
- persona-artist: Star's pictures in a story (design-story-import) show on the same white page as the words, as on a printed page. Star enters nothing new.

## Decisions from the lead (2026-11-07)

1. **The look:** option B, a white sheet with a soft shadow and no border. Option A, white with a thin ink border, is mock-up 6, not chosen.
2. **On a phone:** the text keeps today's width; the sheet reaches out into the page's margin, 16px from the screen's edges.
3. **What's framed:** the text alone, for now.

## The change

This amends design-story-reader, "Layout": the story's text sits on a white sheet.

- **What's on the sheet:** the story's text, on a one-shot's page and on each chapter page, including any pictures and scene breaks in it. Nothing else: the title, the tags, the short description, **Before you read**, the chapter list and the chapter navigation stay on the paper background, as now.
- **The sheet:** a white background (`#fff`) with the site's soft paper shadow (`--shadow-paper`), square corners and no border (mock-ups 2 to 5, 7 and 8).
- **Its size:** the text keeps today's width at every screen size: at most about 65 characters on a computer, and the full column on a phone. The sheet's padding sits outside the text (the sheet is measured `content-box`, though the site measures boxes `border-box` elsewhere), and the sheet reaches out into the page's own margin to make room for it.
  - Above and below the text, the padding grows from 1.5rem on a phone to 2.5rem on a computer.
  - At the sides, it's 1rem on a phone, and grows to 3rem where the screen has room for it. The sheet never comes closer than 16px to the screen's edges.
  - On a phone the sheet is 16px from each edge, wider than **Before you read** and the navigation buttons, which stay 32px in (mock-ups 3 and 5). The text is exactly as wide as today: 326 pixels on a 390-pixel phone, 256 on a 320-pixel one (mock-ups 3, 8 and 9).
  - On a computer the sheet is wider than the title, the navigation and **Before you read** above it (mock-ups 2 and 7).
  - Measured on the fixture build at 320, 390, 640, 700, 864, 1000 and 1280 pixels: the text's width is the same as today's at each, the sheet is at least 16px from the edges, and nothing scrolls sideways.
- **The ends:** the first and last paragraph or picture add no margin of their own inside the sheet, so the space at the top and the bottom is the padding. The sheet ends before the chapter navigation and "That's the newest chapter." (mock-up 4).
- **Pictures** stay at the column's width or their own, whichever is smaller, now on the sheet; the full-screen view is unchanged. A picture with a transparent or off-white background, which sat on the paper texture before, now sits on plain white, as it would on a printed page.
  - The text's width doesn't change, so pictures' sizes don't either. Separately, the size the page asks the browser for (`sizes`, from `STORY_COLUMN`) is already off today: it says `min(100vw - 2rem, 45rem)`, but the column is `100vw - 4rem` on a phone (the page's own padding) and about 50rem (65 characters) on a computer. The build corrects it to `min(100vw - 4rem, 50rem)`. A picture asked for too large only costs a bigger download, so this isn't a visible change.
- **A ticked story** (design-story-mature-content): while **Before you read** asks first, the text and its sheet are hidden together; after **Continue to the story**, the sheet appears under the box (mock-ups 5 and 7). Without scripts, the sheet shows under the box, as the text does now.
- **Preview** shows the sheet, as the site will. The editor's preview pane is narrow, so it usually shows the phone-sized padding.

## Mock-ups

Screenshots of the fixture build (The Long Road, chapter 3, with its pictures; Night Market, a ticked one-shot) with the styles added. Source: `mockups/story-text-frame/render.mjs`, `frame-b.css` (chosen) and `frame.css` (option A).

| # | What it shows | File |
|---|---|---|
| 1 | Today: a chapter on a computer, the text on the paper background | `mockups/story-text-frame/1-chapter-laptop-today.png` |
| 2 | On a computer: the chapter's title and navigation, then the text on its sheet | `mockups/story-text-frame/2-chapter-laptop.png` |
| 3 | On a phone, with pictures in the text: the sheet 16px from the edges, the text as wide as today | `mockups/story-text-frame/3-chapter-phone.png` |
| 4 | The end of a chapter: the sheet closes before the navigation | `mockups/story-text-frame/4-end-laptop.png` |
| 5 | A ticked one-shot on a phone after **Continue to the story**: **Before you read**, then the sheet | `mockups/story-text-frame/5-one-shot-ticked-phone.png` |
| 6 | Option A, not chosen: white with a thin ink border | `mockups/story-text-frame/6-chapter-laptop-option-a.png` |
| 7 | The ticked one-shot on a computer: **Before you read**, narrower, above the sheet | `mockups/story-text-frame/7-one-shot-ticked-laptop.png` |
| 8 | On the narrowest phones (320 pixels) | `mockups/story-text-frame/8-chapter-320.png` |
| 9 | Today on a phone, for comparison with mock-up 3 | `mockups/story-text-frame/9-chapter-phone-today.png` |

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | `src/components/stories/StoryText.astro` (its styles) | The sheet on `.story-text`, as `mockups/story-text-frame/frame-b.css`: `box-sizing: content-box`; white background; `box-shadow: var(--shadow-paper)`; side padding `clamp(1rem, (100vw - 65ch) / 2 - 1rem, 3rem)`, top and bottom `clamp(1.5rem, 3vw, 2.5rem)`; side margins of minus the side padding, so the text keeps its width, and centred on a computer; no top margin on the first block or bottom margin on the last. |
| 2 | `src/lib/stories/text.ts` (`STORY_COLUMN`, `pictureSizes`) | `STORY_COLUMN` becomes `min(100vw - 4rem, 50rem)`, the column as it is; the unit test of story pictures on the site (story-import-word AC-22), which names today's value, changes with it. |
| 3 | `docs/STYLE_GUIDE.md` and the Kettlebird design system | The sheet as the story text's style. |

Nothing changes in the editor, the guides or the tutorials: they don't describe the text's background.

## States and errors

| Situation | What happens |
|---|---|
| A one-shot or a chapter | The text on its sheet. |
| A story in chapters, on its own page | No sheet: the page has the chapter list, not text. |
| A ticked story, before **Continue to the story** | No sheet shows; the text and its sheet are hidden together. |
| A ticked story, after it, or without scripts | The sheet under **Before you read**. |
| A picture wider than the column | Fits the column on the sheet, as now. |
| A very short text (one line) | A small sheet around it. |
| Preview | As on the site. |

## Accessibility

- Ink (`#2b2b2b`) on white is a contrast of about 14:1, up from about 12.5:1 on the paper colour.
- The sheet is styling only: no new element, landmark or name, so screen readers hear the page as before. The text keeps its focus outline when **Continue to the story** moves focus to it; the outline now goes around the sheet, still inside the screen.
- At 200% zoom and on a 320-pixel screen the sheet fits without sideways scrolling, and the text's width is as today.

## For the spec to check

- The sheet on a one-shot's text and a chapter's text, and nowhere else on the writing pages: white, the paper shadow, no border.
- The text's width the same as today's at 320, 390, 700 and 1280 pixels; the sheet at least 16px from the screen's edges; no sideways scrolling at 320 pixels and at 200% zoom; no extra space from the first and last blocks' margins.
- Pictures on the sheet at the column's width or their own; `STORY_COLUMN` and `sizes` as in Where it applies, row 2.
- A ticked story: the sheet hidden with the text until **Continue to the story**; shown under the box without scripts.
- The accessibility check (axe) passes on the framed pages.

## Persona walkthrough

By the persona-walkthrough agent, 2026-11-07, for persona-fan and persona-artist, against the first draft's mock-ups (option A) and the fixture build with `frame.css` added at 320, 390, 640 and 1280 pixels, and the code (`StoryText.astro`, `StoryPage.astro`, `StoryChapterPage.astro`, `BeforeYouRead.astro`, `StoryGate.astro`, `lib/stories/text.ts`). It checked that the gate hides the frame with the text, that the frame shows without scripts and in Preview, that the full-screen view sits outside the frame, the contrast figures, and that nothing scrolls sideways. Nothing blocking. Addressed above:

- **For the build:**
  - the site measures boxes `border-box`, so the frame must say `content-box` to keep the text's width (now in Where it applies, row 1);
  - `STORY_COLUMN` is already wrong on both sizes and needed a value (now given, with the test that changes);
  - the last paragraph's margin made the bottom of the frame deeper than the top (now no margin at either end).
- **For fans:**
  - the text's width on 320-pixel phones (now stated, mock-up 8; with the lead's decision the text keeps today's width at every size);
  - between a phone and a computer, a fixed 3rem padding took 100 pixels from the text (now the padding scales, and the sheet reaches into the page's margin);
  - **Before you read** is narrower than the frame on a computer (now said, mock-up 7).
- **For Star:**
  - pictures with transparent or off-white backgrounds now sit on white (now said);
  - Preview's narrow pane shows the phone padding (now said).

After the lead's decisions (option B, today's text width on phones), the sheet's sizes were measured again on the fixture build at seven widths from 320 to 1280 pixels: the text is as wide as today at each, the sheet is at least 16px from the edges, and nothing scrolls sideways.
