---
id: story-content-editing-site-settings
status: approved
derived-from:
  - epic-content-editing#outcome: ce75baca7267
  - requirements-content-editing#REQ-content-editing-3: ff2249e7189e
  - requirements-commissions#REQ-commissions-1: 5b1cd823e5c7
  - persona-artist#goals: f3044c738f84
---

# Site settings

<!-- docs/product/stories/content-editing/site-settings.md. Story 4 of epic-content-editing. -->

As Star, I want to change whether commissions are open, my about page (bio, statement, portrait, quick facts), the home page's artist text, and my social links, so that I can keep the site current myself.

## Acceptance criteria

- Site settings has one place for each of: commission status (open or closed, with an optional note such as "Back in March"), the about page's bio, artist statement, portrait, and quick facts, the home page's short artist text, and the social links.
- Changing the commission status changes the banner at the top of the commissions page: open shows "Commissions are open" with the email link, closed shows "Commissions are closed" and Star's note, with no way to start a request.
- The about page and the home page's artist block show what Star entered, and leave out any part Star leaves empty.
- Each social link can be added, changed, reordered, or removed, and the footer on every page follows.
- A social link that isn't a valid web address can't be published, and the editor says why.
