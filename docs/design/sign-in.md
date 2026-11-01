---
id: design-sign-in
status: approved
derived-from:
  - story-content-editing-sign-in: b9687632b3e1
  - design-cms#decision: 889c200357ba
  - persona-artist#skills-and-tools: 4e28d5374320
  - persona-artist#frustrations: ef88538c418e
---

# Sign in at the site: design

<!-- docs/design/sign-in.md. Design for story-content-editing-sign-in. Mock-ups are in
docs/design/mockups/sign-in/ (PNG images, and mockups.html, the source they are rendered from with
render.mjs). Star's getting-started guide is written from this. -->

## Personas

- persona-artist: Star can use a web editor but not Git, a terminal, or code (#skills-and-tools), and Star shouldn't have to know how the site is put together (design-cms). So there is one address to remember, on Star's own site; one email to accept; and nothing to install or configure. Accepting the invitation does create a Sanity account, the one thing Star does on another service; the design keeps it to that single step.

## How the editor is served

The editor (Sanity Studio) is built as part of the site and served at `/studio` on the site's own address: `https://kettlebird.com/studio` once the site moves to its domain (lead, 2026-11-01), and `https://kettlebird-website.vercel.app/studio` until then.

- Each site build also builds the editor and places it under `/studio`. Any address under `/studio` opens the editor, so a bookmark of a particular chapter keeps working.
- Sanity's own hosted address isn't used. The site's address is the only place to edit.
- The project allows sign-in only from the site's own address, and from `http://localhost:3333` for development. It doesn't allow every Vercel address.
- Sign-in offers only **Google** and **E-mail / password**. Sanity also offers GitHub by default; it's turned off, because Star doesn't use it and every extra choice is one more to remember.
- `/studio` tells search engines not to list it. Other sites can't show the editor inside a frame. The site's own pages may still be framed by the site itself, which the preview story needs, so the site's current "never frame" header becomes "only this site".

## Flow

1. **The lead prepares.** On sanity.io, the lead renames the project to **Kettlebird Creations**, so the invitation and the editor use the same name. The lead tells Star that an email from Sanity is coming, and sends the `/studio` link with it.
2. **The lead invites Star once.** In the project, under **Members**, the lead chooses **Invite members**, enters Star's email, and picks the **Editor** role (Star can edit and publish, but not change the project's settings).
3. **Star accepts (mock-up 1).** Star opens the email from Sanity and chooses **Accept invitation**. Sanity asks how Star wants to sign in: with Google, or with an email address and password. That choice, and that email address, are how Star signs in from then on; the guide says so, because signing in another way later is the most likely mistake.
4. **Star leaves Sanity's page (mock-up 2).** Accepting ends on Sanity's own project page. Star needs nothing there, closes it, and opens the `/studio` link from the lead.
5. **Star signs in (mock-up 3).** `/studio` shows the sign-in screen, headed **Kettlebird Creations**, with **Google** and **E-mail / password**. Star picks the same way as before. The guide suggests bookmarking `/studio` now.
6. **Star is in (mock-up 4).** The editor opens. A circle with Star's initial is at the top right; choosing it shows Star's name, email address, and **Sign out**.
7. **Next time, Star is still signed in.** On the same browser and device, `/studio` opens straight into the editor until Star chooses **Sign out**. A new device or browser asks once.

## Mock-ups

Low-fidelity. Screens 1 to 5 are Sanity's (the email, its project page, the sign-in screen, the editor, and the no-access screen), so their exact wording is Sanity's and may differ slightly. What this design settles is where they appear, the editor's title, which sign-in options appear, and what Star does on each. Screen 6 is the site. Source: `mockups/sign-in/mockups.html`.

| # | Screen | File |
|---|---|---|
| 1 | The invitation email | `mockups/sign-in/1-invitation.png` |
| 2 | After accepting: Sanity's project page, which Star closes | `mockups/sign-in/2-after-accepting.png` |
| 3 | `/studio`, not signed in: **Google** or **E-mail / password** | `mockups/sign-in/3-sign-in.png` |
| 4 | Signed in: the editor, with the account menu open showing **Sign out** | `mockups/sign-in/4-signed-in.png` |
| 5 | Signed in with an account that wasn't invited | `mockups/sign-in/5-not-invited.png` |
| 6 | The public site: no link to the editor | `mockups/sign-in/6-public-site.png` |

## Layout

- The editor's title, on the sign-in screen and at the top left of the editor, is **Kettlebird Creations** (today it's "Kettlebird Creations Studio"; "Studio" is a word Star doesn't need). The Sanity project uses the same name (flow step 1).
- The editor's menu stays as it is in this story: mock-up 4 shows today's type names, such as "Gallery Item". Story 3 (`story-content-editing-organised-editor`) renames and reorganises it into Comics, Art, Writing, Shop, Commissions and Site settings, and should ship before or with Star's invitation, so Star's first look is the organised menu. The guide notes the menu is changing if it doesn't.
- The editor works in any current desktop browser. On a phone it works but is cramped; the guide recommends a computer for uploading pages.
- The public site is unchanged (mock-up 6): no link to `/studio` in the header, the footer, or any page, and a test checks the built site for one.

## States and errors

- **Not signed in:** the sign-in screen (mock-up 3). No content is shown before signing in.
- **Signed in with an account that wasn't invited (mock-up 5):** Sanity's "no access" screen with **Sign out**; no content, published or draft, is shown. For Star it means one of two things: they signed in another way than they accepted with, or with a different Google account (a browser signed in to two). The guide's troubleshooting covers both: choose **Sign out**, then sign in the same way, with the email address the invitation went to.
- **Forgotten password:** the **E-mail / password** option has Sanity's "Forgot password?" link, which emails a reset link. The guide mentions it.
- **Invitation expired or lost:** Star asks the lead, who sends it again from **Members**.
- **Signed out on its own** (a cleared browser, a private window, or Sanity ending the session): `/studio` shows the sign-in screen again, and Star signs in the same way. Work already saved stays saved.
- **Someone else finds `/studio`:** they see the sign-in screen, and if they sign in, the "no access" screen.
- **Pull request previews:** previews build the editor too, but sign-in isn't allowed from preview addresses, so `/studio` on a preview shows Sanity's "this address isn't allowed" screen. Editing happens only on the live site.
- **The site moves to kettlebird.com:** the lead adds `https://kettlebird.com` to the allowed sign-in addresses the same day, and the `vercel.app` address redirects to it, `/studio` included, so bookmarks still work. Sign-in is kept per address, so if Star is invited before the move, Star signs in once more after it; the lead tells Star beforehand. Inviting Star after the move avoids this, and the guide then names only `kettlebird.com/studio`.
- **The old editor address (`kettlebird.sanity.studio`):** abandoned; see "The old editor address".

## The old editor address

`kettlebird.sanity.studio` is the old project's (`gtopiz2h`) hosted editor, in a Sanity organisation nobody here can sign in to. It's abandoned, not taken down (lead's decision, 2026-11-01, and the story's amended criterion):
- It edits a project the site doesn't read, so nothing published there can appear on the site.
- Only that old project's members can sign in to it. Star is invited only to the new project, so if Star ever opened it, Sanity would show its "no access" screen and no content.
- Star's guide names only `/studio`, and Star never needs a Sanity address: the invitation email links to Sanity once, and everything after that happens at `/studio` on the site.

## Accessibility

- The sign-in, "no access" and editor screens are Sanity's, which are keyboard operable and labelled. This design adds no controls of its own.
- The editor's page title includes "Kettlebird Creations", so screen reader users hear which site they're editing.

## For the spec to check

Sanity behaviour this design assumes:

- The **Editor** role can edit and publish, can't change project settings, and is on the free plan.
- An invitation goes to an email address, and an account signed in another way with the same email still isn't the member. If Sanity does treat them as one, the guide's warning can be softened.
- The Studio's sign-in options can be limited to Google and email and password, and its title appears on the sign-in screen.
- How the sign-in is kept (browser storage or Sanity's cookies), and whether it lasts until **Sign out**: try Safari, which clears site storage after about a week without a visit, and a browser blocking third-party cookies.
- After signing in, Star returns to the `/studio` address they opened.
- A signed-in non-member sees no published or draft content and can't change anything.
- Invitation expiry, and what an expired invitation shows.
- Every address under `/studio` opens the editor on Vercel.

## Decisions

- **Domain:** the site will be at `kettlebird.com` (lead, 2026-11-01). Star's guide names `kettlebird.com/studio`.
- **Old editor address:** abandoned (see "The old editor address").

## Persona walkthrough

A walkthrough for persona-artist (2026-11-01) opened each mock-up and checked the story's criteria. It found one blocking problem and ten others, all addressed above:
- **Blocking:** the old editor address had no decided path (now abandoned by the lead's decision; see "The old editor address").
- **Others:**
  - what Star does after accepting (mock-up 2);
  - a GitHub option the text didn't mention (turned off);
  - two causes of "no access", not one;
  - what a custom domain does to bookmarks and sign-in;
  - the account menu's wording;
  - which screens are Sanity's;
  - the project's name matching the editor's;
  - telling Star the invitation is coming;
  - a checked "no link" rule and a bookmark;
  - forgotten passwords.

It also listed the Sanity behaviour above for the spec to check.
