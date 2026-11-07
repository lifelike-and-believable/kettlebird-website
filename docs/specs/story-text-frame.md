---
status: draft
unlocks:
  - tests/unit/story-import-site.test.ts: the column pictures fill is `min(100vw - 4rem, 50rem)`, the column as it is, in place of `min(100vw - 2rem, 45rem)` (story-text-frame AC-5), as design-story-text-frame, Where it applies, row 2, says. The criteria (story-import-word AC-22) are unchanged.
---

# Stories: a white sheet behind the text

<!-- Technical spec for design-story-text-frame (approved 2026-11-07, with the lead's decisions: option B, a
white sheet with a soft shadow; today's text width on phones; the text alone). Amends story-reader-pages
(the reading column) and story-import-word AC-22 (the column pictures fill). A plan-feature spec without an id. -->

## Problem

The story's text sits straight on the textured paper background. The lead asked for a white background frame behind it (2026-11-07).

## User stories

- As a fan, I want the story's text on a plain white page, so that a long chapter is easy on the eyes, with the lines as long as they are today. (design-story-text-frame#personas)
- As Star, I want my pictures in a story to sit on the same white page as the words. (design-story-text-frame#personas)

## Acceptance criteria

Source: design-story-text-frame sections as named. "The sheet" is the story text's element (`.story-text`), on a one-shot's page and on each chapter page.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | The sheet is white (`#fff`), with the site's paper shadow (`--shadow-paper`), no border and square corners, measured `content-box`; nothing else on the writing pages is on white, and a story in chapters' own page has no sheet. | test: unit "sheet"; e2e "the sheet" | #the-change |
| AC-2 | The text's width is today's at every screen size: the narrower of the page's column and 65 characters at the text's size, within a pixel, at 320, 390, 700, 864 and 1280 pixels. | test: e2e "the text keeps its width" | #the-change |
| AC-3 | The sheet is at least 16px from each edge of the screen, and nothing scrolls sideways, at the same sizes (640 pixels is 200% zoom on a 1280-pixel screen). | test: e2e "the text keeps its width" | #the-change, #accessibility |
| AC-4 | The padding is `clamp(1.5rem, 3vw, 2.5rem)` above and below and `clamp(1rem, (100vw - 65ch) / 2 - 1rem, 3rem)` at the sides (24px and 16px on a 390-pixel phone; 38.4px and 48px at 1280), with side margins of minus the side padding, so the sheet reaches into the page's margin; the first block has no top margin and the last no bottom margin. | test: unit "sheet"; e2e "padding" | #the-change, #where-it-applies |
| AC-5 | Pictures on the sheet ask for the column as it is: `STORY_COLUMN` is `min(100vw - 4rem, 50rem)`, so a 2400-pixel picture's `sizes` is `min(2400px, 100vw - 4rem, 50rem)`. | test: unit "pictures"; e2e "pictures" | #the-change, #where-it-applies |
| AC-6 | A ticked story: the sheet is hidden with the text until **Continue to the story**, then shows, white; without scripts it shows under **Before you read**. | test: e2e "a ticked story" | #the-change |
| AC-7 | The framed pages pass the site's accessibility check (axe) on a phone and a computer. | test: e2e "accessibility" | #accessibility |
| AC-8 | `docs/STYLE_GUIDE.md` has a "Story text" entry for the sheet, and the Kettlebird design system records it. | test: unit "style guide"; manual: the design system | #where-it-applies |

## Scope

- In: `src/components/stories/StoryText.astro` (styles), `src/lib/stories/text.ts` (`STORY_COLUMN`), `docs/STYLE_GUIDE.md`, the Kettlebird design system (on claude.ai). Tests: `tests/unit/story-text-frame.test.ts`, `tests/e2e/story-text-frame.spec.ts`, and the unlock above.
- Out: the title, tags, **Before you read**, chapter lists and navigation (unchanged); the editor and guides (they don't describe the text's background).

## APIs and assumptions

- CSS `clamp()`, `max()` and `ch` units in `calc` expressions, supported by every current browser.

## Non-functional requirements

- No new script, element or image; a few lines of CSS.

## Delivery

- Plan item: design-story-text-frame (PR 187).

## Risks and decisions

- The sheet's side margins come from the page's own margin (16px of the 32px on a phone), so the sheet is wider than **Before you read** and the buttons on a phone, as the lead decided.
