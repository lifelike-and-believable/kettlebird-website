---
id: design-help-links
status: draft
derived-from:
  - story-content-editing-help-links: 34bd0da8a86a
  - design-sign-in: e414f49976a1
  - design-organised-editor: b6c698ee62eb
  - design-preview: dc01c995c1e6
  - design-know-when-live: b7f62b452b90
  - persona-artist#skills-and-tools: 4e28d5374320
---

# Help where I'm working: design

<!-- docs/design/help-links.md. Design for story-content-editing-help-links. Mock-ups are in
docs/design/mockups/help-links/ (PNG images, and mockups.html, the source they are rendered from with
render.mjs). Checked against Sanity Studio 5.1.0: the top bar already carries the live status
(design-know-when-live) and each item's top already carries Preview (design-preview), so both places
take another control. -->

## Personas

- persona-artist: Star "can use a web-based editor; should not need Git, a terminal, or code". Today the guides are files in the code repository, so Star can only read them if someone sends them. Here they become pages on the site, in the site's own look, opened from the editor, from the item Star is working on, at the part that's about it.

## How it works

- **The guides are pages on the site.** Each of Star's six guides is built into the site from its file in `docs/user/`, at `/help/<name>`, the guide's file name without `.md`: `/help/getting-started`, `/help/editing-your-site`, `/help/publishing-comics`, `/help/site-settings`, `/help/previewing` and `/help/going-live`. `/help` lists them. The fans' guide (`reading-comics.md`) isn't included: it's for fans, and isn't linked from the editor.
- **A merged change to a guide is on the site after the next update**, like any other change to the site. Nothing else needs doing.
- **They're not part of the public site.** No menu, footer or page links to them, they aren't in any list the site offers search engines, and each one tells search engines not to list it. The guides aren't secret: the code repository they come from is public. Like the sign-in design's "no link to /studio", the build checks that no public page links to `/help`.
- **They don't link to the editor.** Where a guide names the editor's address (`kettlebird.com/studio`), it stays as text, so the check that no page links to `/studio` still holds.
- **Links between guides stay on the site.** A link to `site-settings.md` goes to `/help/site-settings`, and to `going-live.md#after-you-publish` goes to that section of `/help/going-live`. Section addresses are the same as GitHub's (the heading in lower case, with hyphens), so links already written in the guides keep working.
- **What's left out:** the guide file's front matter and its comments (notes for whoever maintains the guide). Everything Star reads in the file is on the page.

## The help page

Mock-ups 1 (computer) and 2 (phone).

- The site's header and footer, so it looks like Star's site. The site's menu still goes to the public pages.
- Above the guide, a small line: "Help for your site's editor" and **All help**, to `/help`.
- The guide's title, then **On this page**: its sections, as links to each.
- The guide's text, in the site's body font and a reading width (about 70 characters), with tables that scroll sideways on a phone rather than squeezing. Bold control names stay bold, as in the files.
- At the end, **All help** again.

- A table wider than the screen scrolls sideways inside its own box, never the page. The box can be reached with Tab, shows when it has focus, and is named after the table ("What you see, what it means, what to do").

`/help` itself (mock-up 3) is the same page with the six guides as a list, each with its title and a one-line summary, in the order Star needs them:

| Guide | Summary |
|---|---|
| Getting started with your site's editor | Your invitation, signing in, and finding your way around. |
| Editing your art, writing, shop and commissions | Adding, changing and removing pieces, stories, products and commission types. |
| Publishing comic pages and chapters | Starting a comic, adding chapters and pages, and publishing them. |
| Commissions, your about page, the home page and your links | Opening and closing commissions, and the text on your site's pages. |
| See it before you publish | Previewing a change on its page, on a computer and a phone. |
| When your change is live | What the status at the top right means after you publish. |

The summaries are kept with each guide, so a new guide brings its own.

## In the editor

### Help in the top bar (mock-up 4)

- **Help**, in the top bar, just left of the live status, on every screen.
- Choosing it opens a short menu: the six guides by their titles, then **All help**. Choosing one opens it in a new tab and closes the menu.
- **Help** is always a button with the word "Help", never only an icon, even on a narrow window (mock-up 7). Sanity's own **Help and resources** menu, a "?" button at the right of the top bar, stays: Sanity offers no setting to remove it, and hiding it by other means could break with any Sanity update. It's about Sanity itself, and on a narrow window it moves into Sanity's side menu. The getting-started guide says which is which.

### Help at the top of each item (mock-ups 5 and 6)

- At the top left of each item, on the same line as **Preview** (which stays at the right): a link, "Help: " and the guide section's heading, with an arrow showing it opens a new tab, such as "Help: Add a chapter ↗".
- It opens that section in a new tab:

| Item | Link | Goes to |
|---|---|---|
| A series | Help: Start a new comic | `/help/publishing-comics#start-a-new-comic` |
| A chapter | Help: Add a chapter | `/help/publishing-comics#add-a-chapter` |
| An art piece | Help: Art | `/help/editing-your-site#art` |
| A story | Help: Writing | `/help/editing-your-site#writing` |
| A product | Help: Shop | `/help/editing-your-site#shop` |
| A commission type | Help: Commissions | `/help/editing-your-site#commissions` |
| **Site settings**: **Commissions** | Help: Open or close commissions | `/help/site-settings#open-or-close-commissions` |
| **Site settings**: **About page** | Help: Your about page | `/help/site-settings#your-about-page` |
| **Site settings**: **Home page** | Help: The home page | `/help/site-settings#the-home-page` |
| **Site settings**: **Contact and social links** | Help: Your contact email and social links | `/help/site-settings#your-contact-email-and-social-links` |

- On a Site settings item, the line sits above the "fix before publishing" box, which keeps its place at the top of the form.
- When the form narrows beside the preview, the link wraps onto a second line if it needs to, and **Hide preview** stays at the right (mock-up 8).
- A chapter's link goes to "Add a chapter", the first of the guide's chapter sections; **On this page** lists the ones after it (adding pages, describing each page).
- In the preview pane, there's no help link (the preview shows the site page only).

## States and errors

| Situation | What Star sees |
|---|---|
| A guide's section is renamed | The build fails until the item's link is updated, so a link never lands at the top of the page instead of the section. |
| A guide is added | It isn't on `/help` or in the menu until the design lists it. |
| The site is updating | The help page is the last published one; a guide merged a minute ago may not be there yet. |
| A help address that doesn't exist | The site's **Page not found**. |
| A guide links to a guide that isn't on `/help`, or to a section that doesn't exist | The build fails, so a help page never has a link that goes nowhere. |

## Accessibility

- **Help** is a button with a menu (the menu's items are links); the arrow keys move through the menu, and Escape closes it, returning focus to **Help**.
- Each link's name, at the top of an item and in the **Help** menu, says where it goes and that it opens a new tab: "Help: Add a chapter (opens in a new tab)", "Publishing comic pages and chapters (opens in a new tab)". The arrow is decoration and isn't read.
- The help pages use one `h1` (the guide's title), its sections as `h2`, and **On this page** as a navigation landmark named "On this page".
- The help pages pass the site's axe check, at 200% text, and at 360 px wide with no sideways scrolling of the page (only wide tables scroll, within themselves).

## Mock-ups

| # | Shows | File |
|---|---|---|
| 1 | A help page at computer width: Publishing comic pages and chapters | `mockups/help-links/1-help-page-computer.png` |
| 2 | The same page on a phone | `mockups/help-links/2-help-page-phone.png` |
| 3 | `/help`, all the guides | `mockups/help-links/3-all-help.png` |
| 4 | The editor's top bar with the Help menu open | `mockups/help-links/4-help-menu.png` |
| 5 | A chapter, with "Help: Add a chapter" beside Preview | `mockups/help-links/5-chapter-help.png` |
| 6 | Site settings, Commissions, with its help link above the fix box | `mockups/help-links/6-settings-help.png` |
| 7 | A narrow window: **Help** keeps its word; Sanity's own "?" menu has moved into its side menu | `mockups/help-links/7-narrow-top-bar.png` |
| 8 | Contact and social links with the preview open: the long link wraps, **Hide preview** stays right | `mockups/help-links/8-preview-open.png` |

## For the spec to check

- The guides' section headings become ids the same way GitHub makes them, including headings with punctuation ("Commissions, your about page, …").
- Building the guides adds no on-request page: `/help` is built ahead of time like the rest of the public site.
- The no-link check covers `/help` as well as `/studio`.
- Sanity 5.1's **Help and resources** menu: when it shows in the top bar and when it moves to the side menu, so the spec places **Help** beside it correctly.
- Every link between guides, and every item's link, goes to a built guide and an existing section; the build fails otherwise.

## For the guides

Alongside this design, the guides change a little:

- **Getting started** says where **Help** is, and that Sanity's "?" menu is Sanity's own.
- **Editing your art, writing, shop and commissions**: "Whether commissions are open or closed is set in **Site settings**" links to the Site settings guide's "Open or close commissions", since a commission type's help link lands on that section.
- Each guide carries its one-line summary for `/help`.
