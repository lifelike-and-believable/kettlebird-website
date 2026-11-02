---
id: story-comic-reader-play-controls
status: approved
derived-from:
  - epic-comic-reader#outcome: b4076be3edb8
  - story-comic-reader-turn-pages: 8d3e174e5578
  - story-comic-reader-newest-and-share: 2900c6fe8f4e
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - requirements-site#REQ-site-4: 5970ab67a115
---

# Player-style page controls

<!-- docs/product/stories/comic-reader/play-controls.md. Story 7 of epic-comic-reader. Asked for by
Star (2026-11-02). The double arrowheads go to the series' first and newest pages (lead, 2026-11-02);
the newest-page control is the reader's part of story 3's "go straight to the newest page". -->

As a fan, I want the reader's page buttons to work like a media player's (one arrowhead to step a page, two to jump to the start or the newest page), so that I can turn a page or catch up on a series in one tap.

## Acceptance criteria

- The reader's **Previous page** and **Next page** buttons are replaced by four controls, in this order: first page (⏮), previous page (◀), next page (▶) and newest page (⏭).
- ◀ and ▶ turn one page back or forward, exactly as **Previous page** and **Next page** do now (story-comic-reader-turn-pages), including moving between chapters.
- ⏮ opens the first page of the series (page 1 of its first chapter with pages). ⏭ opens the series' newest page (the last page of its last chapter with pages).
- Each control has a name for screen readers and a visible label on hover and keyboard focus: "First page of the series", "Previous page", "Next page", "Newest page of the series". On a complete series, newest page is called last page ("Last page of the series"), so it doesn't promise new pages (lead, 2026-11-02).
- The controls keep their positions on every page. On the first page of the series, ⏮ and ◀ can't be used; on the newest page, ▶ and ⏭ can't be used, and "You're all caught up" and **Back to series** show as now. A control that can't be used looks it, and says so to screen readers.
- Each control is at least 48 pixels tall and wide on a phone. All four look alike, the same size and colour (lead, 2026-11-02).
- Swiping and the left and right arrow keys work as now. The Home and End keys keep their usual scrolling (lead, 2026-11-02).
- The controls are links, like the buttons they replace, so they work without scripts and each has its own address.
