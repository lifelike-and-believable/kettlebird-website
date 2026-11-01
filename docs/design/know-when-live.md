---
id: design-know-when-live
status: draft
derived-from:
  - story-content-editing-know-when-live: 709ddfb00d36
  - design-cms#decision: 889c200357ba
  - persona-artist#goals: f3044c738f84
  - persona-artist#frustrations: ef88538c418e
---

# Know when it's live: design

<!-- docs/design/know-when-live.md. Design for story-content-editing-know-when-live. Mock-ups are in
docs/design/mockups/know-when-live/ (PNG images, and mockups.html, the source they are rendered from
with render.mjs). The status labels match design-comic-publish-pages, mock-up 5. -->

## Personas

- persona-artist: "not knowing when, or whether, a change has reached the live site" is one of Star's listed frustrations, and publishing straight after finishing a piece is how Star works (#goals). So publishing is the only step, and the editor always says where the latest change is: updating, live, or not live.

## How it works

- **Publishing starts an update.** When anything is published, unpublished, or deleted in the editor, Sanity tells Vercel to rebuild the site. There's no separate button.
- **Each site build records when it read the content.** The build publishes a small file on the site (`/build-info.json`) with the moment it read the content from Sanity, by Sanity's clock. Any change published before that moment is in that build, deletions included.
- **The editor reads that file.** The editor is served from the same site, so it reads the file directly: no password, key or other service is involved. While Star has a change waiting, it checks every 15 seconds.
- **"Live" means the site has it.** The status turns **Live** when the site's file shows a build that read the content after Star's latest change was published (both times from Sanity, so Star's computer clock doesn't matter). Until then it reads **Updating the site…**.
- **Failure.** If no build includes the change within 15 minutes of publishing, the status turns **Didn't go live**. The lead is told separately and in detail: Vercel emails the project's owner when a production build fails, with a link to the build's log. That email is the lead's notification; the editor's message tells Star it has been sent.

## Flow

1. Star publishes something (a chapter, a gallery piece, a text change). The status at the top right changes to **Updating the site…** (mock-up 2).
2. About a minute or two later, it changes to **Live** with the time, and **View on site** appears beside it (mock-up 3).
3. Star chooses **View on site** to see it on the site, in a new tab.
4. If Star publishes more before the first update finishes, the status counts them, "Updating the site… (3 changes)" (mock-up 4), and turns **Live** once the site shows all of them.
5. If the site doesn't update, the status reads **Didn't go live**; choosing it opens the explanation (mock-up 5). Star's change stays saved in the editor.
6. On opening the editor with nothing waiting, the status shows when the site last updated, "Site updated today, 9:12 am" (mock-up 1).

## Mock-ups

Low-fidelity. The editor is Sanity Studio; this design adds only the status and **View on site** to its top bar. Source: `mockups/know-when-live/mockups.html`.

| # | State | File |
|---|---|---|
| 1 | Nothing waiting: when the site last updated | `mockups/know-when-live/1-idle.png` |
| 2 | Straight after **Publish**: **Updating the site…** | `mockups/know-when-live/2-updating.png` |
| 3 | **Live** with the time, and **View on site** | `mockups/know-when-live/3-live.png` |
| 4 | Several changes in a row | `mockups/know-when-live/4-several.png` |
| 5 | **Didn't go live**, opened | `mockups/know-when-live/5-failed.png` |

## Layout

- The status sits at the top right of the editor, before Star's account circle, on every screen. It replaces nothing.
- Times are in Star's own time zone: "2:41 pm" today, "Yesterday, 2:41 pm", or a date for older updates.
- **View on site** opens, in a new tab, the page the last published change appears on: a chapter's first page in the reader, a gallery piece's portfolio, a comic series' page, the home page for site text, and the home page for anything without a page of its own. It stays until Star publishes again.
- **Live** stays green until the next publish; on the next visit to the editor it becomes "Site updated …" (mock-up 1).

## States and errors

- **Updating** (mock-up 2): Star can keep working, publish more, or close the editor. The update carries on without the editor open; the next visit shows the result.
- **Several changes** (mock-up 4): Star never waits between changes. If an update is already running when another change is published, the site updates again afterwards; the status waits for the update that includes the newest change.
- **Didn't go live** (mock-up 5): "Your change is saved, but the site didn't update. The person who looks after the site has been told and will fix it. You don't need to do anything, and you can keep working." With the time of publishing and how long the editor waited. Publishing again later is safe: the next successful update includes everything.
- **Can't check** (no connection, or the file can't be read): the status reads **Can't check the site right now** in grey, and tries again; it never claims **Live** without seeing it.
- **Unpublishing or deleting** something counts as a change: **Live** then means it's gone from the site, and **View on site** isn't shown.
- **Slow updates:** most take a minute or two. A slow one that finishes after 15 minutes turns **Didn't go live** into **Live** on its own the next time the editor checks.

## Accessibility

- The status is text with an icon, never colour alone.
- Changes to the status are announced to screen readers, politely (they don't interrupt).
- **View on site** and **Didn't go live** are buttons reachable by keyboard; the explanation opens as a small panel that **Close** or Escape closes.

## For the spec to check

- Sanity's webhooks can call Vercel's deploy hook on publish, unpublish and delete of published documents only (not on every draft keystroke), on the free plan.
- Vercel's handling of deploy hooks called while a build is running (queued, or the running one cancelled), so the last change is always built.
- Vercel's email on a failed production deployment is on for the project owner, and links to the log.
- The Studio's top bar can be extended with a component (the navbar), and it can read `/build-info.json` from its own origin.

## Open questions

1. Is 15 minutes the right wait before **Didn't go live**? Builds take about a minute today; it allows for slow days without leaving Star wondering for long.
