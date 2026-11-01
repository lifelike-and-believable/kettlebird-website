---
id: story-comic-reader-turn-pages
status: approved
derived-from:
  - epic-comic-reader#outcome: b4076be3edb8
  - requirements-comics#REQ-comics-2: d738742f9302
  - requirements-comics#REQ-comics-3: 1c122b12d909
  - requirements-site#REQ-site-4: 5970ab67a115
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
---

# Turn pages

<!-- docs/product/stories/comic-reader/turn-pages.md. Story 2 of epic-comic-reader. Goes live with
story-comic-reader-start-reading (see design-comic-start-reading, "Release with story 2"). -->

As a fan, I want to go to the next and previous page by tapping, swiping, clicking, or using the arrow keys, moving into the next chapter at the end of one, so that I can read at my own pace on any device.

## Acceptance criteria

- The reader has **Previous page** and **Next page** controls beside or under the page, visible on a phone and a computer.
- Clicking or tapping **Next page** shows the next page, and **Previous page** the one before; the location line updates ("Chapter 2: The Long Road · Page 4 of 24").
- On a touch screen, swiping left shows the next page and swiping right the previous one.
- With a keyboard, the right arrow key shows the next page and the left arrow key the previous one, as long as focus is not in a text field.
- At the last page of a chapter, **Next page** goes to the first page of the next chapter that has pages, and the location line shows the new chapter.
- At the first page of a chapter, **Previous page** goes to the last page of the chapter before.
- At the very first page of the series there is no **Previous page**; at the very last page, **Next page** is replaced by "You're all caught up" and **Back to series**.
- The next page appears without the reader having to scroll back up to find it.
- Turning a page uses no animation when the reader's system asks for reduced motion.
