---
id: design-comic-share-and-announce
status: approved
derived-from:
  - story-comic-reader-newest-and-share: 2900c6fe8f4e
  - story-comic-reader-assistive-technology: 1db666e12004
  - design-comic-start-reading#page-addresses: 108059c3ef86
  - design-comic-start-reading#states-and-errors: 1a21fa22479e
  - design-comic-turn-pages#accessibility: 90960e979445
  - design-comic-sheet-and-controls#layout: ee5c53db8ba2
  - design-comic-sheet-and-controls#accessibility: a6dfd125f599
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - persona-fan#context-of-use: 38883e5abc09
---

# Newest page, sharing, and announcing pages: design

<!-- docs/design/comic-share-and-announce.md. Design for story-comic-reader-newest-and-share
(story 3) and story-comic-reader-assistive-technology (story 4), which finish the comic reader
epic. Mock-ups are in docs/design/mockups/comic-share-and-announce/ (PNG images, and mockups.html,
the source they are rendered from with render.mjs, built to match the pages as built). -->

## Personas

- persona-fan: fans arrive from a link in a social post, often in the middle of a series, and share pages they love the same way (#context-of-use). So a shared link opens the right page and looks right in the post, and **Share this page** is one tap. Some fans read with a screen reader or keyboard alone (#skills-and-tools), so every page turn says where they are and what the page shows, and leaves them where they were.

## What's already done

Earlier designs and builds already meet part of both stories:

- **Story 3:** each page has its own address that opens it in the reader with its location line, and the address changes with each turn, because every turn is an ordinary link to the next page's address (design-comic-turn-pages, "How a page turn works"). **Newest** under every page goes straight to the newest page (design-comic-sheet-and-controls).
- **Story 4:** every control has a name screen readers read, is reached with Tab and has the site's focus ring; at 200% the reader and sheets don't scroll sideways; axe finds no serious or critical issues. The specs for those designs test all of these, and the specs for this design keep them tested.

This design covers the rest: **Share this page**, **Read the newest page**, removed pages, link previews, announcing each page, and keeping focus on a turn.

## Flow

**Sharing a page** (story 3)

1. Under the controls (and under the end note on the newest page), **Share this page** (mock-up 1).
2. On a phone or tablet (a touch screen as its main pointer) whose browser has a share menu, it opens that menu with the page's address and its title, "Kettle Tales · Chapter 2, page 4", so the fan can post it straight to an app. Laptop browsers that also have a share menu copy instead, which is what laptop readers expect.
3. Elsewhere (laptops, and phones without a share menu), it copies the address. The button then reads **Link copied** for four seconds, and a screen reader hears "Link copied" (mock-up 2).
4. If the share menu fails for any reason other than the fan closing it, the link is copied instead. If the browser won't let the site copy, a box appears under the button: "Copy this link:" and the address, already selected, to copy by hand (mock-up 3).
5. The address shared is always the page's own address on the site (`https://newsite.kettlebird.com/comics/kettle-tales/2/4`), never one with `#` or anything after it.

**Catching up from the series page** (story 3)

1. On an ongoing series with more than one page, **Read the newest page** sits beside **Start reading** (mock-up 4). It opens the series' newest page, the same page **Newest** opens.
2. Series that are complete, on a break, have one page, or have no status set don't show it: **Start reading** is the way in.
3. It opens the newest page, not the first page of the newest update: a fan who missed a three-page update turns back with **Previous**. Marking where an update starts would need Star to record updates; that's left for later.

**A page that no longer exists** (story 3)

1. A link to a page, chapter or sheet that isn't there any more (Star removed or renumbered it) opens **Page not found**, as now.
2. When the address starts with a series that still exists, the page also offers **Back to Kettle Tales** above **Comics** (mock-up 5), so the fan from a stale social link lands one tap from the series.
3. How: the site is built ahead of time, so there's one **Page not found** page for every missing address. It carries the list of series addresses and titles, and a small script matches the start of the address against it and adds the link. Without a script, it shows **Comics** only; that's the one part of story 3 that needs a script.

**Link previews** (story 3)

1. When a page's address is posted on a social site or in a message, the preview shows the series' cover, "Kettle Tales · Chapter 2, page 4" as its title, and "Chapter 2: The Long Road, page 4 of 12." followed by the series' description (mock-up 6, an illustration; each site draws its own card).
2. Social sites show a wide picture (1200 × 630), and covers are tall, so the whole cover is set on a paper-coloured wide background by the image service, rather than cut to a strip.
3. The cover is used, not the page itself, so a preview never spoils a page before the fan reaches it.
4. The series page's preview is the cover, the series' title and its description.

**Each page announced, and focus kept** (story 4)

1. A fan turns a page with **Next** (by Enter, a tap, or a click). The new page opens; keyboard focus is back on **Next**, so pressing Enter again turns again (mock-up 7).
2. A screen reader then says the page's place and what it shows: "Chapter 2: The Long Road, page 5 of 12. The kettle wobbles on the shelf." For a page without alt text, the place alone.
3. The same happens for **Previous**, **First** and **Newest**, each keeping focus on itself, and for turns made with the arrow keys or a swipe (announced; focus stays where the browser puts it).
4. When a turn lands on the newest page, **Next** can't be used any more, but focus still lands on it, and the announcement adds the end note: "… You're all caught up! New pages are on the way." (mock-up 8). Tab moves on to the end note's **Back to series**, then **Share this page**.
5. On arrival from a link, the same announcement is made, without moving focus: the browser announces the tab title ("Chapter 2, page 4 · Kettle Tales · Kettlebird Creations"), then the screen reader hears the place and alt text. Some screen readers also start reading the page from the top, so a fan may hear the place twice; that's the price of every screen reader saying it (VoiceOver on a phone doesn't read a new page out by itself). A reload announces nothing.

## Addresses

- The site's address is one setting (the site address in the site's configuration, added by this work; now the staging address `https://newsite.kettlebird.com`, later `https://kettlebird.com`). Shared links, link previews and the page's canonical address all use it, so moving to a custom domain later changes them all at once.
- A reader page's canonical address is its own address, and a series page's is its own. The contact sheets stay unlisted (design-comic-sheet-and-controls).

## Mock-ups

Built to match the pages as built: fonts, colours, borders, the reader bar and the controls. Comic pages and covers are placeholders. Frames 7 and 8 show what a screen reader says in a dark box; frame 6 illustrates a social site, not the site itself. Source: `mockups/comic-share-and-announce/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | Reader on a phone: **Share this page** under the controls | `mockups/comic-share-and-announce/1-share-phone.png` |
| 2 | On a laptop, after sharing: **Link copied** | `mockups/comic-share-and-announce/2-link-copied.png` |
| 3 | When the browser won't copy: the link, selected, to copy by hand | `mockups/comic-share-and-announce/3-copy-by-hand.png` |
| 4 | Series page on a phone: **Read the newest page** beside **Start reading** | `mockups/comic-share-and-announce/4-series-newest.png` |
| 5 | A removed page: **Page not found** with **Back to Kettle Tales** | `mockups/comic-share-and-announce/5-page-removed.png` |
| 6 | A shared page's preview on a social site (illustration) | `mockups/comic-share-and-announce/6-social-preview.png` |
| 7 | After **Next**: focus on **Next**, the new page announced | `mockups/comic-share-and-announce/7-turn-announced.png` |
| 8 | **Next** onto the newest page: focus on the unavailable **Next**, the end note announced | `mockups/comic-share-and-announce/8-newest-announced.png` |

## Layout

- **Share this page:** centred under the controls, or under the end note on the newest page, on a series with one page too. A bordered button with a drawn share icon and the words, at least 44 px tall, quieter than the controls (no fill). It's not in the reader bar, which is full on a phone.
- **Link copied:** the button's words change for four seconds and its background turns the paper colour; then it reads **Share this page** again.
- **Copy this link:** a label and a read-only text box the width of the controls, with the address selected and focus in it.
- **Read the newest page:** a plain underlined link beside **Start reading**, wrapping under it on a narrow phone; at least 44 px tall. On a 360 × 640 phone both are on the first screen.
- **Back to the series** on **Page not found:** a link above **Comics**, "Back to <series title>".

## States and errors

- **No script:** **Share this page** isn't shown (it needs a script to copy or share); everything else works, including shared links and previews. **Page not found** shows **Comics** only.
- **The share menu is cancelled:** nothing changes, and nothing is announced.
- **A series with one page:** **Share this page** under the end note; no **Read the newest page** on the series page.
- **A series without a cover:** the preview uses the site's own picture (the Kettlebird logo on paper), with the same title and description.
- **A page without alt text:** the announcement is the place alone, "Chapter 2: The Long Road, page 4 of 12."
- **A series without visible chapters:** places read "Page 4 of 12" and titles "One Shot · Page 4".
- **A removed series:** **Page not found** shows **Comics** only.
- **The page opened in a new tab, or with back or forward:** focus isn't moved; the page is announced as on arrival.
- **A series without a status:** treated as ongoing for the end note, as now, but no **Read the newest page**.

## Accessibility

- **Share this page** is a button (it acts on this page), named by its words. "Link copied" is also said through a polite status message, since the button keeps focus and some screen readers don't repeat a changed name.
- The announcement is a polite status message. The empty status element is part of the page as built, so screen readers know it before anything is put in it. After a turn, focus moves first; then, half a second after the page has loaded, the message is filled in, so it follows the screen reader's reading of the tab title and the focused control rather than cutting them off. It's not made on a reload.
- Focus after a turn: the control the fan used gets focus without scrolling the page, so the page stays in view. Unavailable controls take focus from a script only (`tabindex="-1"`; Tab still skips them), so a screen reader says "Next page, dimmed" and the fan knows they've reached the newest page.
- A turn remembers which control was used for the next page in the same tab only: the new page checks that it was opened by a link (not reloaded or reached with back or forward), that it came from the page the turn started on, and that less than 30 seconds have passed, so a slow connection still gets focus and an old turn never moves focus on a later visit.
- The announcement uses the page's own alt text. A page without alt text is announced by its place alone (not "Chapter 2, page 4" again, the place used as its picture's fallback name).
- The announcements and focus are checked by hand with NVDA on Firefox and Chrome, and VoiceOver on an iPhone and a Mac, as well as by automated tests.
- The copy box's label is its name; Escape or Tab leaves it.
- **Read the newest page** and **Back to Kettle Tales** are links, named by their words.

## Other documents

- **design-comic-turn-pages:** its Accessibility section left focus and announcements to story 4; this design is that part.
- **design-comic-start-reading:** **Page not found** gains the series link; the page addresses are unchanged.
- **docs-reading-comics (the fans' guide):** gains a sharing section, **Read the newest page** in "Start a comic", and its screen reader notes replace the placeholder line. That's the next document after this design.

## For the spec to check

- **Share this page:** under the controls or end note, hidden without a script; the share menu where `navigator.share` exists on a touch screen, otherwise copying; **Link copied** for four seconds and a polite status message; the copy box when copying fails; the address shared is the canonical address without `#`.
- **Read the newest page:** only on series set to ongoing with more than one page, linking the newest page; both links on the first screen of a 360 × 640 phone.
- **Page not found:** **Back to <series>** when the address starts with an existing series' address, for reader pages, chapters and sheets, from a list of series built into the page; **Comics** only otherwise, and without a script.
- **Site address:** the `site` setting in the Astro configuration.
- **Link previews and canonical addresses:** Open Graph and Twitter card tags on reader and series pages (title, description, the cover on a paper-coloured 1200 × 630 background from the image service at its absolute `cdn.sanity.io` address, other addresses absolute from the site setting); the logo image for series without a cover; canonical addresses on reader and series pages.
- **Announcements and focus:** the empty status element in the built page; after a turn by any control, focus on that control (usable or not, `tabindex="-1"` on unusable ones) without scrolling; after any turn and on arrival, the place and stored alt text (and the end note on the newest page) in the status, half a second after load; nothing on reload; focus only for a link navigation from the turn's page within 30 seconds.
- **Share errors:** the share menu only with a coarse primary pointer; cancelling is silent; any other share error falls back to copying.

## Persona walkthrough

A walkthrough for persona-fan (2026-11-02), on a phone from a social link and sharing, catching up from the series page, following a removed page's link, with a screen reader and keyboard, sharing from a laptop, and at 200% on a phone, checked the design against both stories, the earlier reader designs and the code. It found two blocking problems, five misleading, three slower and four mismatches with the mock-ups. All are addressed above:
- **Blocking:**
  - focus couldn't land on an unavailable control, which has no address (now `tabindex="-1"`, by script only);
  - "once the new page has loaded" was too loose to build: the status element is now in the built page, focus moves first, and the message follows half a second after load, checked by hand with NVDA and VoiceOver.
- **Misleading:**
  - a few seconds was too short to remember a turn on a slow connection (now a link navigation from the turn's page, within 30 seconds);
  - arrival from a link wasn't announced, which VoiceOver on a phone needs (now announced, without moving focus);
  - how **Page not found** knows the series was unstated (now a built-in list and a small script; without a script, **Comics** only);
  - a tall cover cut to a wide strip for previews (now set on a paper-coloured background), and the site's address wasn't configured (now a setting);
  - a page without alt text would have been announced by its place twice (now the place alone).
- **Slower:**
  - share errors other than closing the menu now fall back to copying, and the share menu is for touch screens only;
  - **Read the newest page** opens the last page of an update, not its first (noted as a limit);
  - a series without a status didn't say whether it shows **Read the newest page** (it doesn't).
- **Mismatches:** the Tab order after the newest page (the end note's **Back to series** comes first); the series page's order on a phone (title first); mock-ups 2, 7 and 8 now show **Share this page**; mock-up 3 shows the address selected.
