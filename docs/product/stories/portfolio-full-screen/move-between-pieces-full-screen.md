---
id: story-portfolio-full-screen-move-between-pieces-full-screen
status: draft
derived-from:
  - epic-portfolio-full-screen#outcome: ff9757299e73
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
---

# Move between pieces full screen

<!-- docs/product/stories/portfolio-full-screen/move-between-pieces-full-screen.md. Story 2 of
epic-portfolio-full-screen. -->

As a fan, I want to go to the next or previous piece while full screen, with arrow keys, swipes or on-screen controls, so that I can look through Star's work one piece after another.

## Acceptance criteria

- Full screen has **Previous** and **Next** controls, and the Left and Right arrow keys and side swipes do the same.
- The order is the gallery's: the pieces of the section the piece was opened from, as the filter shows them. **Previous** on the first piece and **Next** on the last can't be used, and say so to screen readers.
- Moving to another piece shows it whole (not zoomed), and a screen reader hears its title.
- While a piece is zoomed in, a swipe moves around the piece rather than turning to the next one.
- Leaving full screen returns to the dialog of the piece last shown, so a fan who looked through several pieces lands on the one they stopped at.
- The next piece's picture is fetched ahead, so turning doesn't wait on a phone connection.
