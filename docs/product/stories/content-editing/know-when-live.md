---
id: story-content-editing-know-when-live
status: approved
derived-from:
  - epic-content-editing#outcome: ce75baca7267
  - design-cms#decision: 889c200357ba
  - persona-artist#goals: f3044c738f84
  - persona-artist#frustrations: ef88538c418e
---

# Know when it's live

<!-- docs/product/stories/content-editing/know-when-live.md. Story 6 of epic-content-editing. -->

As Star, I want publishing to update the site on its own and the editor to tell me when my change is live, or that it failed, so that I never wonder whether fans can see it.

## Acceptance criteria

- Publishing anything in the editor starts a site update, with no other step.
- The editor shows the state of Star's latest change: "Updating the site…", then "Live" with the time, or "Didn't go live" if the update failed.
- "Live" appears only once the change can actually be seen on the site.
- When an update fails, the editor says so in plain words, keeps Star's change saved, and tells Star the lead has been notified; the lead receives the failure with enough detail to fix it.
- Publishing several changes in a row results in the site showing all of them, without Star having to wait between them.
