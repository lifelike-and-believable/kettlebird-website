---
id: epic-portfolio-full-screen
status: approved
derived-from:
  - requirements-portfolio#REQ-portfolio-4: 136ce70ca3a4
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - persona-fan#frustrations: 078d5295ca3a
---

# See Star's artwork full screen

<!-- docs/product/epics/portfolio-full-screen.md. From the lead's feature request "Full-Screen view
for Artwork" (2026-11-05) and REQ-portfolio-4. Lead's choices (2026-11-05): the portfolio only, not
comic pages or story pictures; view, zoom, and the next or previous piece; the browser's own
full-screen mode, filling the window where a browser doesn't offer it. -->

## Outcome

A fan looking at one of Star's pieces in the portfolio can open it full screen, see it as large and as sharp as their screen allows, zoom in on its details, and move on to the next or previous piece without leaving full screen. Leaving full screen brings them back to the piece's dialog in the gallery, where they were.

## Personas

- persona-fan: seeing more of Star's art is their first goal; they arrive on a phone, expect swiping, pinching and tapping to work, and may use a keyboard, a screen reader or zoom. Large pictures mustn't make the gallery slower on a phone connection.

## Stories

Each is written as its own story file, and approved, before work on it starts. Written stories show their id.

1. **View a piece full screen** (`story-portfolio-full-screen-view-a-piece-full-screen`). As a fan, I want to open a portfolio piece full screen, at the best size for my screen, and zoom and pan to see its details, so that I can look at Star's art properly, not just as a dialog's picture. The browser's own full-screen mode is used where it exists (it hides the browser's bars); elsewhere, such as Safari on an iPhone, the piece fills the window. Escape, a **Close** control, or the browser's own way out of full screen returns to the piece's dialog.
2. **Move between pieces full screen** (`story-portfolio-full-screen-move-between-pieces-full-screen`). As a fan, I want to go to the next or previous piece while full screen, with arrow keys, swipes or on-screen controls, so that I can look through Star's work one piece after another. The order is the gallery's: the pieces of the section the piece was opened from, as filtered.

## Dependencies

- **Image sizes:** full screen needs a larger image than the dialog's 1200 px, from the Sanity image CDN at the screen's size; the gallery's thumbnails and the dialog stay as they are.
- **The online help** (lead, 2026-11-03): this is for fans, so it joins the fans' guides (`FAN_GUIDES`), not Star's.

## Out of scope

- Full screen for comic pages (the reader has panel by panel) and for pictures in stories.
- Downloading, sharing or buying a piece from full screen.
- A slideshow that moves on by itself.
- Changes to what Star enters in the editor: full screen uses each piece's existing picture and alt text.

## Open questions

1. Does full screen show the piece's title (and alt text for screen readers) over the picture, or only the picture with its controls? A design question for story 1.
2. When a fan zooms in and then swipes, does the swipe pan the picture or turn to the next piece? A design question for story 2 (the comic reader's rule is that pinch-zoomed swipes don't turn).
