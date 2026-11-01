---
id: design-site-settings
status: draft
derived-from:
  - story-content-editing-site-settings: bf5491c1a296
  - design-organised-editor: c014dfe64fbc
  - persona-artist#goals: f3044c738f84
  - persona-artist#frustrations: ef88538c418e
---

# Site settings: design

<!-- docs/design/site-settings.md. Design for story-content-editing-site-settings. Mock-ups are in
docs/design/mockups/site-settings/ (PNG images, and mockups.html, the source they are rendered from
with render.mjs). Site settings is the last section of the editor's menu (design-organised-editor),
and replaces that design's "coming in the next update" note. -->

## Personas

- persona-artist: "changes that need a developer: the commission banner, about text, and social links today" is the first of Star's listed frustrations, and opening or closing commissions when circumstances change is one of Star's goals. So each of these becomes one field in one place, and each field says which page it changes.

## Flow

1. Star chooses **Site settings** in the editor's menu. It opens straight to the settings: there's only one set, so there's no list to choose from.
2. The settings have four tabs, one per thing they change: **Commissions**, **About page**, **Home page**, and **Social links** (mock-ups 1, 2, 2b and 3).
3. Star changes what they want and chooses **Publish**. The status at the top right shows the update (design-know-when-live), and the pages change together.

Closing commissions is two clicks: **Commissions are… Closed**, then **Publish**. A note is optional.

## Mock-ups

Low-fidelity. Mock-ups 1 to 3 are the editor (Sanity Studio). Mock-ups 4 to 6 are the site's pages, simplified, in its own colours. Source: `mockups/site-settings/mockups.html`.

| # | Screen | File |
|---|---|---|
| 1 | Site settings, **Commissions** tab | `mockups/site-settings/1-commissions-tab.png` |
| 2 | Site settings, **About page** tab | `mockups/site-settings/2-about-tab.png` |
| 2b | Site settings, **Home page** tab | `mockups/site-settings/2b-home-tab.png` |
| 3 | Site settings, **Social links** tab, with a link that isn't a web address | `mockups/site-settings/3-social-links-tab.png` |
| 4 | The Commissions page, open and closed | `mockups/site-settings/4-commissions-page.png` |
| 5 | The about page, filled in, and with only quick facts | `mockups/site-settings/5-about-page.png` |
| 6 | The home page with the artist text, and the footer | `mockups/site-settings/6-home-and-footer.png` |

## Fields

**Commissions** tab (mock-up 1)

| Field | Help text | Required |
|---|---|---|
| Commissions are… | Open or Closed. Changes the banner at the top of your Commissions page. | Yes (starts as Open) |
| Note when closed | Shown under "Commissions are closed", like "Back in March" or "Full until the spring". Leave empty for no note. | |
| Email for commission requests | Where the Commissions page's Contact me and Email me buttons, and the about page's email button, send people. | Yes (starts as kettlebirdillustration@gmail.com) |

**About page** tab (mock-up 2)

| Field | Help text | Required |
|---|---|---|
| Portrait | A picture of you, or a self-portrait, at the top of the about page. Leave empty for none. | |
| Portrait's alt text | What the portrait shows, for people using screen readers. | Marked if missing, as for art |
| Bio | A few paragraphs about you, under "About the Artist". Leave empty to leave it out. | |
| Artist statement | What your work is about, shown after the bio under its own heading. Leave empty to leave it out. | |
| At a glance | Short facts in the about page's side box, in this order. Each has a **Label** ("Based in") and a **Value** ("Vancouver, BC"). Drag to reorder. | |

**Home page** tab (mock-up 2b)

| Field | Help text | Required |
|---|---|---|
| Artist text | A sentence or two about you, shown on the home page under the section tiles. Leave empty to show the tiles alone. | |

**Social links** tab (mock-up 3)

| Field | Help text | Required |
|---|---|---|
| Social links | Shown in this order in every page's footer and on the about page. Each has a **Name**, as shown on the button ("Bluesky"), and a **Web address**, the page it opens. Drag to reorder; **Remove** to take one away; **Add a link** for a new one. | |

The fields start filled with what the site shows today (the four social links, the four quick facts, the email address), so publishing the settings for the first time changes nothing a visitor sees.

## What changes on the site

- **Commissions page** (mock-up 4):
  - **Open:** the banner reads "Commissions are open. Email me to get started." with **Contact me**. Everything else is as now, including "Ready to order?" and **Email me to get started**.
  - **Closed:** the banner reads "Commissions are closed." and the note, if there is one, with no **Contact me**. "Ready to order?" is replaced by "Commissions are closed for now. Follow me on Bluesky or Tumblr to hear when they open." This names the first two social links, or leaves out the follow sentence if there are none. The commission types and prices still show, so people can plan ahead. There is no way to start a request.
- **About page** (mock-up 5):
  - The portrait, bio, statement and quick facts appear when filled in.
  - Anything left empty is left out entirely, with no empty heading or box.
  - "About the Artist" and **Get in touch** always show.
- **Home page** (mock-up 6): the artist text appears under the section tiles. When it's empty, the home page is the tiles alone, as now.
- **Footer, on every page** (mock-up 6), and the about page's buttons: the social links, in Star's order. Button colours go green, yellow, orange, pink in order, then repeat, so they always vary however many links there are. With no links, the footer's "Connect" heading is left out.

## States and errors

- **A link that isn't a web address** (mock-up 3): **Publish** can't be pressed. The link is marked, with: "Instagram: this isn't a web address. Copy the link from your browser's address bar; it starts with https://". A link must start with https:// or http://.
- **A link without a name, or a name without a link:** "Give this link a name, as it'll show on the button" or "Add the web address this link opens."
- **An email that isn't an email address:** "This doesn't look like an email address."
- **A quick fact with a label but no value**, or the reverse: "Fill in both the label and the value, or remove this fact."
- **Before the settings are first published:** the site shows today's text, the same as the starting values above.

## Accessibility

- The commissions banner states open or closed in words; the coloured dot is decoration, hidden from screen readers.
- The portrait's alt text is its alternative text; with none, it's treated as decoration, and the editor marks it as missing.
- Social link buttons are links named by their text ("Bluesky"), and open in a new tab, as now.
- Headings stay in order when parts are left out, so nothing jumps a level.

## For the spec to check

- A single settings item ("singleton") opened straight from the menu, with no list, and Sanity's field groups shown as the four tabs.
- Validation for web addresses, email addresses, and paired fields, with these messages.
- Initial values matching today's site.
- The site reads the settings at build time; publishing them triggers the same update as any other change (design-know-when-live).
- The "Connect" heading and the closed-commissions sentence when there are no social links.

## Open questions

1. When commissions are closed, should the commission types and prices still show (as designed), or be hidden too?
