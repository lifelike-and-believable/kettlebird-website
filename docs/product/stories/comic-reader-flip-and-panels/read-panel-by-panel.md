---
id: story-comic-reader-flip-and-panels-read-panel-by-panel
status: approved
derived-from:
  - epic-comic-reader-flip-and-panels#outcome: c1426bb16011
  - requirements-comics#REQ-comics-2: d738742f9302
  - requirements-site#REQ-site-4: 5970ab67a115
  - persona-fan#goals: 2b047e4cae5d
---

# Read panel by panel

<!-- docs/product/stories/comic-reader-flip-and-panels/read-panel-by-panel.md. Story 3 of epic-comic-reader-flip-and-panels. -->

As a fan on a phone, I want to step through a page one panel at a time, each panel enlarged to fit my screen, and switch back to the whole page whenever I like, so that I can read small panels without pinching and zooming.

## Acceptance criteria

- On a page with panels, the fan can switch panel-by-panel reading on and off; the choice is remembered on that browser.
- In panel-by-panel reading, each turn forward moves to the next panel in Star's order, enlarged to fit the screen; after the last panel, the next page's first panel.
- Turning back moves to the previous panel, and from a page's first panel to the last panel of the page before.
- A page without usable panels is shown whole, and turning moves past it as one step.
- It works by tap, swipe and keyboard, with the controls the reader already has; a screen reader hears the page's description, as now.
- Moving from panel to panel is animated unless the system asks for reduced motion (REQ-site-4).
