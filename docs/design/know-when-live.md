---
id: design-know-when-live
status: approved
derived-from:
  - story-content-editing-know-when-live: 709ddfb00d36
  - design-cms#decision: 889c200357ba
  - persona-artist#goals: f3044c738f84
  - persona-artist#frustrations: ef88538c418e
---

# Know when it's live: design

<!-- docs/design/know-when-live.md. Design for story-content-editing-know-when-live. Mock-ups are in
docs/design/mockups/know-when-live/ (PNG images, and mockups.html, the source they are rendered from
with render.mjs). The status labels match design-comic-publish-pages, mock-up 5; the failure wording
here replaces that design's and the publishing guide's (see "Other documents"). -->

## Personas

- persona-artist: "not knowing when, or whether, a change has reached the live site" is one of Star's listed frustrations, and publishing straight after finishing a piece is how Star works (#goals). So publishing is the only step, and the editor always says where Star's latest change is: updating, live, removed, or not live.

## How it works

- **Publishing starts an update.** Publishing, unpublishing, or deleting anything in the editor makes Sanity tell Vercel to rebuild the site. There's no separate button. One **Publish** is one change, whatever it contains: a chapter and all its pages are one document, so one update.
- **Each site build records when it read the content.** The build reads the content straight from Sanity (not through Sanity's cache, which can lag), notes the moment it started reading by Sanity's clock, and, when the build finishes, publishes a small file on the site, `/build-info.json`, with that moment and the time the build finished. The file is never cached, so it always describes the site as it is.
- **The status is worked out, not remembered.** The editor asks Sanity, with Star's sign-in, for the time of the latest change (any publish, unpublish, or delete), and reads `/build-info.json` from the site it's served from. If the site's build read the content after the latest change, the change is live. Because both come from the site and from Sanity, the status is the same in every tab, after closing the editor, and on another computer.
- **Pages, not just the file.** The site is replaced all at once when a build finishes, so when `/build-info.json` is new, every page is. Images are stored by Sanity under new addresses when they change, so an old copy can't be shown in their place.
- **The lead is told of any failure, separately.** A check outside the editor runs every 15 minutes (a scheduled GitHub workflow in the site's repository). It compares the latest published change in Sanity with the site's `/build-info.json`. If the site is more than 15 minutes behind, it opens an issue in the repository, which emails the lead, with the times and a link to Vercel's build log. It covers every way an update can fail, including a rebuild that never started. Vercel also emails the project owner when a build fails, as a second path.

## Flow

1. Star publishes something. A short note appears near **Publish**: "Published. Updating the site; the status at the top right says when it's live." The status at the top right changes to **Updating the site…** (mock-up 1).
2. About a minute or two later, it changes to **Live** with the time the site finished updating, and **View on site** appears (mock-up 2). That time is when fans can see it.
3. Star chooses **View on site** to see the change on the site, in a new tab.
4. If Star publishes more before the first update finishes, the status counts the changes not yet live, "Updating the site… (3 changes)" (mock-up 3), and turns **Live** once the site shows all of them.
5. After 5 minutes it reads **Still updating, taking longer than usual…** (mock-up 4). After 15 minutes without the change reaching the site, it reads **Didn't go live**; choosing it opens the explanation (mock-up 5). The change stays saved in the editor.
6. After unpublishing or deleting, it reads **Removed from the site** with the time, and has no **View on site** (mock-up 6).
7. On the next visit, the status shows the same state, worked out afresh: **Live** with the time and **View on site** for the last change, or **Updating** or **Didn't go live** if that's where it still is.

## Mock-ups

Low-fidelity. The editor is Sanity Studio; this design adds the status and **View on site** to its top bar, and the short note after **Publish**. In Sanity, **Publish** is at the bottom of the open item, not in the top bar, which is why the note appears there. Source: `mockups/know-when-live/mockups.html`.

| # | State | File |
|---|---|---|
| 1 | Straight after **Publish**: the note, and **Updating the site…** | `mockups/know-when-live/1-updating.png` |
| 2 | **Live** with the time, and **View on site** | `mockups/know-when-live/2-live.png` |
| 3 | Several changes in a row | `mockups/know-when-live/3-several.png` |
| 4 | After 5 minutes: **Still updating, taking longer than usual…** | `mockups/know-when-live/4-slow.png` |
| 5 | After 15 minutes: **Didn't go live**, opened | `mockups/know-when-live/5-failed.png` |
| 6 | After unpublishing or deleting: **Removed from the site** | `mockups/know-when-live/6-removed.png` |
| 7 | **Can't check the site right now** | `mockups/know-when-live/7-cant-check.png` |

## Layout

- The status sits at the top right of the editor, before Star's account circle, on every screen. It replaces nothing.
- Times are in Star's own time zone: "2:41 pm" today, "Yesterday, 2:41 pm", or a date for older changes.
- **View on site** opens, in a new tab, the page the last change appears on: a chapter's first page in the reader; a comic series' page; a gallery piece's portfolio; the about page for about-page text; the commissions page for commission status and prices; the shop for a product; the home page for the home page's text and the social links.
- **Didn't go live** is a button: choosing it opens the explanation, which **Close** or Escape closes.

## States and errors

- **Updating** (mock-up 1): Star can keep working, publish more, or close the editor; the update carries on without it.
- **Several changes** (mock-up 3): Star never waits between changes. If an update is running when another change is published, the site updates again afterwards, and the status waits for the update that includes the latest change. The 5- and 15-minute times count from the latest change.
- **Taking longer** (mock-up 4): after 5 minutes. Nothing for Star to do.
- **Didn't go live** (mock-up 5): "Your change is saved, but the site didn't update. The person who looks after the site is told automatically and will fix it. You don't need to do anything, and you can keep working; publishing more is fine. Wait until this says Live before telling people it's up." When the lead fixes it, the status turns **Live** on its own.
- **Removed** (mock-up 6): for unpublishing or deleting. **Live** never means "gone".
- **Can't check** (mock-up 7): no connection, or the site's file can't be read. It tries again every 15 seconds, and never shows **Live** without seeing it.
- **Drafts:** the status is about published changes only. A saved but unpublished draft shows Sanity's own "not published" mark on the item, and isn't counted.
- **The editor itself updates too.** The editor is part of the site, so a content update republishes it. Its files are named by their content, so a content-only update leaves them identical and an open editor carries on. When the editor's own code changes, Sanity shows its notice to reload.

## Accessibility

- The status is text with an icon, never colour alone.
- Changes to the status are announced to screen readers, politely (they don't interrupt).
- **View on site** and **Didn't go live** are buttons reachable by keyboard; the explanation closes with **Close** or Escape.

## Other documents

The failure wording here ("is told automatically", "publishing more is fine", "wait until this says Live") replaces the shorter wording in design-comic-publish-pages (mock-up 5) and in Star's publishing guide. Both will be updated with Star's guide to this story. That design and the guide also put **Publish** in the top bar; in Sanity it's at the bottom of the open item, and they'll be corrected at the same time.

## For the spec to check

- Sanity's webhooks can call Vercel's deploy hook on publish, unpublish, and delete of published documents only (not drafts), on the free plan, and whether Sanity reports failed deliveries.
- Vercel's handling of deploy hooks called while a build is running (queued, or the running one cancelled), and its plan's limits on builds per day.
- The editor can get the time of the latest change, deletions included, from Sanity with Star's sign-in.
- The build reads Sanity's live API, not its cache, and `/build-info.json` is served uncached.
- The Studio's top bar can be extended (its navbar component) on every screen, and a note can follow **Publish**.
- The editor's file names stay the same across content-only builds.
- A scheduled GitHub workflow can read `/build-info.json` and Sanity's latest change, and open an issue; GitHub runs schedules every 15 minutes or so, sometimes later.

## Open questions

1. Are 5 and 15 minutes right? Builds take about a minute today.

## Persona walkthrough

A walkthrough for persona-artist (2026-11-01) opened each mock-up and checked the story's criteria and the comic design and guide. It found no blocking problems, five misleading ones and nine slower ones. All are addressed above:
- **Misleading:**
  - the editor promised the lead was told, without knowing it (now a separate check that does tell them);
  - a failure disappeared after reopening the editor (the status is now worked out from the site and Sanity);
  - **Live** after a deletion (now **Removed from the site**);
  - which time **Live** shows (when the site finished updating);
  - whether **Live** proves the pages changed (an uncached file, a live read, and atomic deploys).
- **Slower:**
  - what one change is;
  - noticing the status far from **Publish** (the note after **Publish**);
  - the explanation's wording;
  - where **View on site** goes;
  - mock-ups for every state;
  - the editor republishing itself;
  - a long wait with no sign (the 5-minute message);
  - drafts;
  - wording that differed from the comic design and the guide (see "Other documents").
