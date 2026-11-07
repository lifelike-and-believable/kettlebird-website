---
id: design-story-text-frame
status: draft
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
white background frame to the story text on the writing pages. Mock-ups are in
docs/design/mockups/story-text-frame/: screenshots of the fixture build with the proposed styles added
(frame.css for option A, frame-b.css for option B), made by render.mjs. -->

## Personas

- persona-fan: reads in short sessions, usually on a phone (#context-of-use). Today the text sits straight on the textured paper background. A plain white page behind the words separates the reading from the rest of the page and gives the dark ink the most contrast, so a long chapter is easier on the eyes.
- persona-artist: Star's pictures in a story (design-story-import) show inside the same white page as the words, as on a printed page. Star enters nothing new.

## The change

This amends design-story-reader, "Layout": the reading column gets a white frame.

- **What's framed:** the story's text, on a one-shot's page and on each chapter page, including any pictures and scene breaks in it. Nothing else: the title, the tags, the short description, **Before you read**, the chapter list and the chapter navigation stay on the paper background, as now.
- **The frame (option A, mock-ups 2 to 5):** a white background (`#fff`) with a thin ink border (2px, the site's ink colour), square corners, no shadow. It follows the site's other boxes (**Before you read**, the Writing page's cards, the buttons), which have ink borders, but stays plain so it doesn't compete with the text.
- **Its size:** the text keeps its reading width (at most about 65 characters, design-story-reader). The frame's padding and border sit outside that width (the frame is measured `content-box`, though the site measures boxes `border-box` elsewhere). The padding scales with the screen: 1rem at the sides on a phone, growing to 3rem on a computer, and 1.5rem to 2.5rem above and below. The first and last paragraph or picture add no margin of their own inside the frame, so the space at the top and the bottom is the padding.
  - On a computer the frame reaches about 3rem past the text on each side, so it's wider than the title and the navigation buttons above it, which stay where they are (mock-up 2).
  - It's also wider than **Before you read** above it on a computer (mock-up 7).
  - On a phone the frame lines up with **Before you read** and the navigation buttons, 32px from each edge of the screen (mock-up 3). The text inside is about 36 pixels narrower than today: about 290 pixels in place of 326 on a 390-pixel phone, and 220 in place of 256 on the narrowest, 320-pixel phones (mock-up 8), so lines are a word or two shorter. Decisions, 2, offers keeping today's width.
  - Between a phone and a computer (a small tablet, or a laptop zoomed to 150%), the padding is in between, so the text loses less than 3rem a side.
- **Pictures** stay at the column's width or their own, whichever is smaller, now inside the frame; the full-screen view is unchanged. A picture with a transparent or off-white background, which sat on the paper texture before, now sits on plain white, as it would on a printed page.
  - The size the page asks the browser for (`sizes`, from `STORY_COLUMN`) follows the real column. Today it says `min(100vw - 2rem, 45rem)`, but the column is `100vw - 4rem` on a phone (the page's own padding) and about 50rem (65 characters) on a computer. With the frame it's `min(100vw - 6rem - 4px, 50rem)` on a phone and the same 50rem on a computer. A picture asked for too large only costs a bigger download, so this is a correction, not a visible change.
- **The end of the text:** the frame ends after the last paragraph, before the chapter navigation and "That's the newest chapter." (mock-up 4).
- **A ticked story** (design-story-mature-content): while **Before you read** asks first, the text and its frame are hidden together; after **Continue to the story**, the frame appears under the box (mock-up 5). Without scripts, the frame shows under the box, as the text does now.
- **Preview** shows the frame, as the site will. The editor's preview pane is narrow, so it usually shows the phone-sized padding.

Option B (mock-up 6) is the alternative for Decisions, 1: a white sheet with a soft shadow and no border, like paper lying on the page.

## Mock-ups

Screenshots of the fixture build (The Long Road, chapter 3, with its pictures; Night Market, a ticked one-shot) with the proposed styles added. Source: `mockups/story-text-frame/render.mjs`, `frame.css` and `frame-b.css`.

| # | What it shows | File |
|---|---|---|
| 1 | Today: a chapter on a computer, the text on the paper background | `mockups/story-text-frame/1-chapter-laptop-today.png` |
| 2 | Option A on a computer: the chapter's title and navigation, then the framed text | `mockups/story-text-frame/2-chapter-laptop-a.png` |
| 3 | Option A on a phone, with pictures in the text | `mockups/story-text-frame/3-chapter-phone-a.png` |
| 4 | Option A, the end of a chapter: the frame closes before the navigation | `mockups/story-text-frame/4-end-laptop-a.png` |
| 5 | Option A, a ticked one-shot on a phone after **Continue to the story**: **Before you read**, then the frame | `mockups/story-text-frame/5-one-shot-ticked-phone-a.png` |
| 6 | Option B on a computer: a white sheet with a soft shadow, no border | `mockups/story-text-frame/6-chapter-laptop-b.png` |
| 7 | Option A, the ticked one-shot on a computer: **Before you read**, narrower, above the frame | `mockups/story-text-frame/7-one-shot-ticked-laptop-a.png` |
| 8 | Option A on the narrowest phones (320 pixels) | `mockups/story-text-frame/8-chapter-320-a.png` |

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | `src/components/stories/StoryText.astro` (its styles) | The frame on `.story-text`: `box-sizing: content-box`, white background, 2px ink border, padding `clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 4vw, 3rem)` (as `mockups/story-text-frame/frame.css`), and no top margin on the first block or bottom margin on the last. |
| 2 | `src/lib/stories/text.ts` (`STORY_COLUMN`, `pictureSizes`) | `STORY_COLUMN` becomes `min(100vw - 6rem - 4px, 50rem)`; the test `tests/unit/story-import-site.test.ts` that names today's value changes with it. |
| 3 | `docs/STYLE_GUIDE.md` and the Kettlebird design system | The frame as the story text's style. |

Nothing changes in the editor, the guides or the tutorials: they don't describe the text's background.

## States and errors

| Situation | What happens |
|---|---|
| A one-shot or a chapter | The text in the frame. |
| A story in chapters, on its own page | No frame: the page has the chapter list, not text. |
| A ticked story, before **Continue to the story** | No frame shows; the text and its frame are hidden together. |
| A ticked story, after it, or without scripts | The frame under **Before you read**. |
| A picture wider than the column | Fits the column inside the frame, as now. |
| A very short text (one line) | A small frame around it. |
| Preview | As on the site. |

## Accessibility

- Ink (`#2b2b2b`) on white is a contrast of about 14:1, up from about 12.5:1 on the paper colour.
- The frame is styling only: no new element, landmark or name, so screen readers hear the page as before. The text keeps its focus outline when **Continue to the story** moves focus to it; the outline now goes around the frame.
- At 200% zoom and on a 320-pixel screen the frame fits without sideways scrolling: its padding is in rem and the text's width shrinks with the screen, as now.

## For the spec to check

- The frame on a one-shot's text and a chapter's text, and nowhere else on the writing pages; white background and a 2px ink border (option A, if chosen).
- The text's reading width unchanged on a computer (`content-box`); the padding on a computer and on a phone; no extra space from the first and last blocks' margins; no sideways scrolling at 320 pixels and at 200% zoom.
- Pictures inside the frame at the column's width or their own; `STORY_COLUMN` and `sizes` as in Where it applies, row 2.
- A ticked story: the frame hidden with the text until **Continue to the story**; shown under the box without scripts.
- The accessibility check (axe) passes on the framed pages.

## Decisions at review

Proposed, for the lead to confirm or change:

1. **The frame's look:** option A, white with a thin ink border (mock-ups 2 to 5), matching the site's other boxes. Option B is a white sheet with a soft shadow and no border (mock-up 6), softer and more like paper.
2. **On a phone:** the frame lines up with the other boxes, and the text inside is about 36 pixels narrower than today. The alternative is a frame that reaches 16px from the screen's edges, keeping today's text width, but sticking out past **Before you read** and the buttons.
3. **What's framed:** only the text (and its pictures). The alternative is to frame the whole chapter page from the title to the navigation, which would also put the buttons on white.

## Persona walkthrough

By the persona-walkthrough agent, 2026-11-07, for persona-fan and persona-artist, against the mock-ups and the fixture build with `frame.css` added at 320, 390, 640 and 1280 pixels, and the code (`StoryText.astro`, `StoryPage.astro`, `StoryChapterPage.astro`, `BeforeYouRead.astro`, `StoryGate.astro`, `lib/stories/text.ts`). It checked that the gate hides the frame with the text, that the frame shows without scripts and in Preview, that the full-screen view sits outside the frame, the contrast figures, and that nothing scrolls sideways. Nothing blocking. Addressed above:

- **For the build:**
  - the site measures boxes `border-box`, so the frame must say `content-box` to keep the text's width (now in Where it applies, row 1);
  - `STORY_COLUMN` is already wrong on both sizes and needed a value (now given, with the test that changes);
  - the last paragraph's margin made the bottom of the frame deeper than the top (now no margin at either end).
- **For fans:**
  - the text's width on 320-pixel phones (now stated, mock-up 8);
  - between a phone and a computer, a fixed 3rem padding took 100 pixels from the text (now the padding scales);
  - **Before you read** is narrower than the frame on a computer (now said, mock-up 7).
- **For Star:**
  - pictures with transparent or off-white backgrounds now sit on white (now said);
  - Preview's narrow pane shows the phone padding (now said).
