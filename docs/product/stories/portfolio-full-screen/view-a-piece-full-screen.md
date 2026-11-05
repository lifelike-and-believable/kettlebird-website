---
id: story-portfolio-full-screen-view-a-piece-full-screen
status: draft
derived-from:
  - epic-portfolio-full-screen#outcome: ff9757299e73
  - requirements-portfolio#REQ-portfolio-4: 136ce70ca3a4
  - persona-fan#skills-and-tools: 6df01b6c2a65
---

# View a piece full screen

<!-- docs/product/stories/portfolio-full-screen/view-a-piece-full-screen.md. Story 1 of
epic-portfolio-full-screen. Lead's choices (2026-11-05): the portfolio only; the browser's own
full-screen mode, filling the window where a browser doesn't offer it. -->

As a fan, I want to open a portfolio piece full screen, at the best size for my screen, and zoom and pan to see its details, so that I can look at Star's art properly, not just as a dialog's picture.

## Acceptance criteria

- A piece's dialog has a **Full screen** control, reachable by keyboard and named for screen readers.
- Full screen shows only the piece, as large as the screen allows without cropping, on a plain background, with its alt text for screen readers. It uses the browser's own full-screen mode where the browser offers it; where it doesn't (Safari on an iPhone), the piece fills the window.
- The picture is fetched at the screen's size (not the dialog's 1200 px), and the dialog's picture shows until it has loaded, so full screen opens at once.
- A fan can zoom in and out and move around the zoomed piece: pinch and drag on a touch screen; on a computer, the mouse wheel or trackpad and dragging, double-click, and keys. Zoom never goes below the whole piece.
- A **Close** control, Escape, or the browser's own way out of full screen returns to the piece's dialog, with focus back on **Full screen**.
- The gallery's thumbnails and the dialog look and load as they do now.
