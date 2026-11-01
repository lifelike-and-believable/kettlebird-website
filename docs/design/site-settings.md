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
with render.mjs). Site settings is the last section of the editor's menu (design-organised-editor);
this replaces that design's "coming in the next update" note. The about page's section names and the
home page's artist block follow design-clear-placeholders. -->

## Personas

- persona-artist: "changes that need a developer: the commission banner, about text, and social links today" is the first of Star's listed frustrations, and opening or closing commissions when circumstances change is one of Star's goals. So each is a field in one place, each field says which pages it changes, and closing commissions never waits on, or publishes, anything else.
- persona-commission-client: "finding out only after writing" that commissions are closed is their first frustration. So closed means the site stops inviting commission requests everywhere, not only in the banner.
- persona-fan: links that go nowhere are a frustration. So every place the social links appear follows the same list.

## Flow

1. Star chooses **Site settings** in the editor's menu. It lists four items, each published on its own: **Commissions**, **About page**, **Home page**, and **Contact and social links** (mock-up 1).
2. Star opens one, changes it, and chooses **Publish**. Only that item goes live, so a half-finished bio never goes out with a commission change, and a mistake in one item never blocks another.
3. The status at the top right shows the update (design-know-when-live). **View on site** opens the page the item changes: the Commissions page, the about page, the home page, or (for contact and social links) the home page.

To close commissions: **Site settings**, **Commissions**, **Closed**, **Publish**. A note is optional.

## Mock-ups

Low-fidelity. Mock-ups 1 to 4 are the editor (Sanity Studio). Mock-ups 5 to 8 are the site's pages, simplified, in its own colours. Source: `mockups/site-settings/mockups.html`.

| # | Screen | File |
|---|---|---|
| 1 | Site settings' four items, and **Commissions** | `mockups/site-settings/1-commissions.png` |
| 2 | **About page**, with a fact being edited | `mockups/site-settings/2-about-page.png` |
| 3 | **Home page** | `mockups/site-settings/3-home-page.png` |
| 4 | **Contact and social links**, with a link being edited, and one that isn't a web address | `mockups/site-settings/4-contact-and-links.png` |
| 5 | The Commissions page, open, and closed (the whole page) | `mockups/site-settings/5-commissions-page.png` |
| 6 | The about page, filled in, and with only facts while commissions are closed | `mockups/site-settings/6-about-site.png` |
| 7 | The home page with and without the artist text, and the footer | `mockups/site-settings/7-home-and-footer.png` |
| 8 | On a phone: the closed banner with a long note, and the about page | `mockups/site-settings/8-phone.png` |

## Fields

**Commissions** (mock-up 1)

| Field | Help text | Required |
|---|---|---|
| Commissions are… | Open or Closed. Changes the banner at the top of your Commissions page, and whether it shows how to order. | Yes |
| Note when closed | Shown after "Commissions are closed." exactly as you write it, like "Back in March." Leave empty for no note. Up to 120 characters. | |

**About page** (mock-up 2)

| Field | Help text | Required |
|---|---|---|
| Portrait | A picture of you, or a self-portrait. Shown at the top of the about page, and beside the home page's artist text. To choose what stays in view when it's cropped, choose the picture's Edit button. | |
| Portrait's alt text | What the portrait shows, for people using screen readers. If it's empty, screen readers skip the portrait. | Marked if missing: "Add alt text so people using screen readers know what the portrait shows." |
| Hello! (your bio) | A few paragraphs about you, under the heading Hello! Leave a blank line between paragraphs. Leave empty to leave the section out. | |
| The Work (your artist statement) | What your work is about, under the heading The Work. Leave a blank line between paragraphs. Leave empty to leave the section out. | |
| At a glance | Short facts in the about page's side box, in this order. Choose a fact to change it; drag to reorder. Each has a **Label** ("Based in") and a **Value** ("Vancouver, BC"). | |

**Home page** (mock-up 3)

| Field | Help text | Required |
|---|---|---|
| Artist text | A sentence or two about you, under the home page's social links, beside your portrait (from About page). Leave a blank line between paragraphs. Don't mention whether commissions are open: the Commissions page says that, and changes when you do. Leave empty to leave the block out. | |

**Contact and social links** (mock-up 4)

| Field | Help text | Required |
|---|---|---|
| Contact email | Where every email button on the site sends people: the footer's Contact, the about page's Get in touch, and the Commissions page's buttons. | Yes |
| Social links | Shown in this order on the home page, in every page's footer, and on the about page. Choose a link to change it; drag to reorder; Remove to take one away. Each has a **Name**, as it shows on the button ("Instagram"), and a **Link**, the page it opens. | |

All text is plain text: no bold or italics. Blank lines make new paragraphs. Text made only of spaces counts as empty.

**Starting values.** Each item starts with what the site shows today: the four social links, the contact email, and the four quick facts (pronouns, based in, makes, loves). Publishing an item unchanged changes nothing visitors see, with one exception. The Ko-fi button is called "Ko-fi ☕" in the footer and "Support on Ko-fi ☕" on the about page today; from now on it uses its one **Name**, "Ko-fi ☕", everywhere. The quick facts still need Star's confirmation (design-clear-placeholders, open question 1), so the getting-started guide asks Star to check them first.

## What changes on the site

- **Commissions page** (mock-up 5):
  - **Open:** the banner, in green, reads "Commissions are open. Email me to get started." with **Contact me**. The rest is as now: the commission types, How it works, and Ready to order? with **Email me to get started**. (Today's "Commissions are currently open! — Reach out via email…" is reworded to the story's wording.)
  - **Closed:** the banner, in orange, reads "Commissions are closed." and the note. Under it: "These are the kinds of commission I take, for when they open again.", then the commission types and prices. How it works, Ready to order? and every commission email button are left out. At the end: "Commissions are closed for now. To hear when they open, follow me on the social links at the bottom of the page." (left out if there are no social links).
- **About page** (mock-up 6):
  - The portrait, **Hello!**, **The Work** and **At a glance** appear when filled in.
  - Anything empty is left out entirely, with no empty heading or frame.
  - **About the Artist** and **Get in touch** always show. While commissions are closed, Get in touch reads "To ask about collaborations, or just to say hi:" instead of starting with commission inquiries.
- **Home page** (mock-up 7): under the social links, the artist text, with the portrait beside it if there is one. When the artist text is empty, the page ends after the social links, as now.
- **Social links:**
  - They appear on the home page's row, the footer of every page, and the about page, all from the one list, in Star's order.
  - Button colours go green, yellow, orange, pink in order, then repeat, so every link has one however many there are.
  - With no links, the home row and the footer's **Connect** heading are left out.
- **Contact email:** every email button and link on the site uses it.

## States and errors

- **What's missing before publishing** (mock-up 4): as in design-organised-editor, **Publish** can't be pressed. The item lists what to fix ("Fix this before publishing: Instagram: the link isn't a web address"), the field shows its own message, and "1 thing to fix before publishing" sits beside **Publish**. Only that item is held back; the others publish as usual.
- **A link that isn't a web address:** "This isn't a web address. Copy the link from your browser's address bar; it starts with https:// (or http://)." A link has to be a complete web address, with no spaces. Email addresses go in **Contact email**, not as links.
- **A link without a name, or a name without a link:** "Give this link a name, as it shows on the button." or "Add the page this link opens."
- **Contact email isn't an email address:** "This doesn't look like an email address." Empty: "Add the email address people should write to."
- **A fact with a label but no value, or the reverse:** "Fill in both the label and the value, or remove this fact."
- **A note longer than 120 characters:** "Keep the note under 120 characters, so it fits the banner on a phone."
- **Before an item is first published, or if it's ever missing:** the site shows today's text for it, the same as the starting values. Star can't delete or duplicate the four items.

## Accessibility

- The commissions banner states open or closed in words; its coloured dot is decoration, hidden from screen readers.
- The portrait's alt text is its alternative text. With none, the portrait is treated as decoration, and the editor marks it as missing.
- Social link buttons are links named by their text ("Bluesky"), and open in a new tab, as now.
- Headings stay in order when parts are left out, so nothing jumps a level.
- On a phone (mock-up 8), the about page is one column, and the banner wraps a long note under its heading.

## For the spec to check

- Four single items ("singletons") listed under **Site settings**, opened straight from the list, each with its own **Publish**, and not deletable or duplicable by the Editor role.
- Validation for links (complete URLs, http or https), the email address, paired fields, and the note's length, with these messages; a summary of what to fix, as in design-organised-editor.
- Editing an array item (a fact, a link) opens Sanity's own edit dialog, with **Done**; rows show "Name · Link" with a drag handle and **Remove**; reordering works by keyboard.
- Initial values matching today's site, and a fallback in the site when an item is missing.
- Plain text fields keep blank lines as paragraphs; whitespace-only counts as empty.
- Publishing any of the four triggers the update, and **View on site** opens the page named in the Flow (design-know-when-live).

## Open questions

1. When commissions are closed, should the commission types and prices still show, with the "for when they open again" line (as designed), or be hidden too?

## Persona walkthrough

A walkthrough for persona-artist, persona-fan and persona-commission-client (2026-11-01) opened each mock-up, compared the pages with the site as it is, and checked the approved designs. Everything it found is addressed above.

It flagged as blocking that editing a link or fact wasn't shown. Mock-ups 2 and 4 now show the edit dialogs.

The largest change follows from what it found misleading: the four tabs were one item with one **Publish**. An error on one tab blocked closing commissions, and publishing pushed out half-finished edits on the other tabs. They're now four separately published items.

It also found:
- **Email:** the footer's email wasn't covered. One **Contact email** now drives every email button.
- **Closed commissions still invited requests** through How it works, the about page and the email buttons. All of those now change too.
- **The home page's own social row** wasn't covered. It now follows the list.
- **Wording that disagreed with the approved designs:** the headings are now **Hello!** and **The Work**, and the home block has the portrait.
- **The closed sentence named the first two links,** which could read "Ko-fi or Bluesky". It now points to the footer.
- **The starting values didn't quite match today's site:** the Ko-fi button's name differs between pages, and Star hasn't confirmed the facts yet.
- **Undrawn states:** the closed page, the minimal about page, the home page without text, and phones are now drawn.
- **Smaller points:**
  - plain text and paragraphs;
  - what counts as empty;
  - the note's length and punctuation;
  - what makes a valid link;
  - "Link", rather than "Web address", which the editor uses for a series' address;
  - "Required" marks;
  - the portrait's crop and alt text;
  - where **View on site** goes.
