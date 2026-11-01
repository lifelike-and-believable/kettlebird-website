---
id: epic-content-editing
status: approved
derived-from:
  - requirements-content-editing#REQ-content-editing-1: dedad51c8978
  - requirements-content-editing#REQ-content-editing-2: 70bd4a6ac30a
  - requirements-content-editing#REQ-content-editing-3: ff2249e7189e
  - design-cms#decision: 889c200357ba
  - persona-artist#goals: f3044c738f84
  - persona-artist#skills-and-tools: 4e28d5374320
  - persona-artist#frustrations: ef88538c418e
---

# Star runs the site

<!-- docs/product/epics/content-editing.md. From design-cms ("Consequences for the work"). -->

## Outcome

Star signs in at `/studio` on the site and finds their work organised the way they think about it: Comics, Art, Writing, Shop, Commissions, and Site settings. They can change any text on the site, including whether commissions are open, preview a change as it will look, publish it, and see when it is live, or that it failed, without a developer and without knowing how the site is built.

## Personas

- persona-artist: publishing without a developer is Star's first goal, and changes that need a developer, not knowing whether a change is live, and publishing work that looks wrong are their listed frustrations.

## Stories

Each is written as its own story file, and approved, before work on it starts. Written stories show their id.

1. **Clear the placeholders** (`story-content-editing-clear-placeholders`). As Star, I want the site to show only my own work, with honest empty states where I haven't added anything yet, so that nothing I publish appears beside stock art or other studios' titles. (Done before Star starts.)
2. **Sign in at the site** (`story-content-editing-sign-in`). As Star, I want to open `/studio` on my own site and sign in, after one email invitation, so that I have one place to go and nothing else to learn.
3. **An editor organised around my work** (`story-content-editing-organised-editor`). As Star, I want the editor's sections to be Comics, Art, Writing, Shop, Commissions, and Site settings, with plain help text on every field, so that I find what I want to change without knowing how the site is built. Ends with Star trying it on a few real pieces.
4. **Site settings** (`story-content-editing-site-settings`). As Star, I want to change whether commissions are open, my about page (bio, statement, portrait, quick facts), the home page's artist text, and my social links, so that I can keep the site current myself (REQ-content-editing-3).
5. **Preview before publishing** (`story-content-editing-preview`). As Star, I want to see a piece, page, or text change as it will look on the site before I publish it, so that I catch crops and mistakes first.
6. **Know when it's live** (`story-content-editing-know-when-live`). As Star, I want publishing to update the site on its own and the editor to tell me when my change is live, or that it failed, so that I never wonder whether fans can see it.

## Dependencies

- **Before story 1 ships:** nothing; it can start at once.
- **Before Star is invited (story 2):** the print-resolution sample upload in design-cms, so Star's upload guidance is known.
- **Comic publishing** (story 5 of epic-comic-reader) uses stories 2, 3, and 6.

## Out of scope

- Commission requests and shop orders (their own epics; they must not be stored in the public dataset).
- Scheduled publishing (a paid Sanity feature; raised with the lead if a story needs it).
- More than one editor, roles, or approvals.
