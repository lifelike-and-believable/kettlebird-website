---
id: story-content-editing-sign-in
status: approved
derived-from:
  - epic-content-editing#outcome: ce75baca7267
  - design-cms#decision: 889c200357ba
  - persona-artist#skills-and-tools: 4e28d5374320
  - persona-artist#frustrations: ef88538c418e
---

# Sign in at the site

<!-- docs/product/stories/content-editing/sign-in.md. Story 2 of epic-content-editing. -->

As Star, I want to open `/studio` on my own site and sign in, after one email invitation, so that I have one place to go and nothing else to learn.

## Acceptance criteria

- Opening `/studio` on the site shows the editor's sign-in screen, and after signing in, the editor itself.
- Star is invited once, by email, and signs in with the account that invitation sets up; nothing else needs installing or configuring on Star's side.
- After signing in on a device, Star stays signed in there until they sign out.
- Someone who isn't invited can't see or change any content in the editor.
- `/studio` is the only editor address Star is given or needs. The old hosted editor (`kettlebird.sanity.studio`) is abandoned: it edits the old Sanity project, which the site doesn't read and Star isn't a member of (lead's decision, 2026-11-01).
- Visitors to the rest of the site never see a link to the editor.
