---
id: story-comic-reader-assistive-technology
status: approved
derived-from:
  - epic-comic-reader#outcome: b4076be3edb8
  - requirements-comics#REQ-comics-2: d738742f9302
  - requirements-site#REQ-site-2: 0bfe19f757dc
  - requirements-site#REQ-site-4: 5970ab67a115
  - persona-fan#skills-and-tools: 6df01b6c2a65
---

# Read with assistive technology

<!-- docs/product/stories/comic-reader/assistive-technology.md. Story 4 of epic-comic-reader. -->

As a fan using a screen reader, I want each page announced with its chapter, page number, and alt text, and focus kept in the reader as I turn pages, so that I can follow the story.

## Acceptance criteria

- When a page appears, whether on arrival or after turning, a screen reader announces its location and alt text, for example "Chapter 2: The Long Road, page 4 of 24. A fox looks up at a kettle on a high shelf."
- After **Next page** or **Previous page**, keyboard focus stays on that control, so the fan can keep turning without hunting for it.
- Every reader control has a name a screen reader reads aloud, and can be reached and used with the keyboard alone, with a visible focus ring.
- At 200 percent browser zoom the page, the location line, and the controls are all usable without scrolling sideways.
- The reader passes an automated accessibility check (axe) with no serious or critical issues.
