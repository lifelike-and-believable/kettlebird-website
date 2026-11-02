---
id: story-comic-reader-contact-sheet
status: approved
derived-from:
  - epic-comic-reader#outcome: b4076be3edb8
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - requirements-site#REQ-site-4: 5970ab67a115
---

# See a chapter's pages at a glance

<!-- docs/product/stories/comic-reader/contact-sheet.md. Story 6 of epic-comic-reader. Asked for by
Star (2026-11-02). One chapter per sheet, opened from the reader (lead, 2026-11-02). -->

As a fan, I want to see all of a chapter's pages as a grid of small pictures, like a contact sheet, and open any one of them, so that I can find a page I remember, or see where I am in the chapter, without turning through every page.

## Acceptance criteria

- The reader has a control that opens the current chapter's contact sheet: every page of that chapter as a small picture, in order, each with its page number.
- The page the fan came from is marked on the sheet, and the sheet opens with it in view.
- Choosing a picture opens that page in the reader, at its own address. Closing the sheet, or the browser's back button, returns to the page the fan came from.
- The sheet shows the series and chapter it belongs to ("Kettle Tales · Chapter 2: The Long Road").
- On a phone the sheet shows at least three pictures a row; wider screens show more. Pictures are small, quick to load images, not the full pages, so a long chapter opens quickly on a phone.
- Every picture is a link a keyboard and a screen reader can reach, named by its page number and the page's alt text where there is one ("Page 4: Rain on the road").
- The sheet works without scripts, like the rest of the reader.
- A chapter with only one page has no contact sheet control.
