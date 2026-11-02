---
id: tutorial-site-settings
status: draft
runner: manual
derived-from:
  - docs-site-settings#open-or-close-commissions: b6e86737c8d8
  - docs-site-settings#your-about-page: b0c8d2ba279d
  - docs-site-settings#the-home-page: 84165fe26b5d
  - docs-site-settings#your-contact-email-and-social-links: 5c3267532169
  - docs-site-settings#if-something-goes-wrong: 442ab49781fe
---

# Tutorial: change Site settings and see the site follow

<!-- docs/tutorials/site-settings.md. runner: manual: a person follows it on the deployed site, because
it needs a signed-in editor and the site's automatic updates, which CI doesn't have. Before you start:
this change is deployed, and the lead has added the four new types to the "Rebuild site" webhook's
filter (docs/specs/content-editing-site-settings.md, What the lead sets up). Use the live address,
https://newsite.kettlebird.com until the move to kettlebird.com. Put things back as they were
at the end (step 10). -->

You'll close and reopen commissions, fill in the about page and the home page, add, reorder and remove a social link, and see each change on the site.

## Steps

1. Open `/studio` and sign in. Choose **Site settings**. It lists **Commissions**, **About page**, **Home page** and **Contact and social links**, in that order, and nothing else. Open each one: it opens straight away. The ⋯ menu next to **Publish** offers no Delete, Duplicate or Unpublish.
2. **Commissions**: **Commissions are…** is **Open**. Choose **Closed**, write "Back in March." in **Note when closed**, and choose **Publish**. When the status says **Live**, choose **View on site**. The Commissions page has an orange banner, "Commissions are closed. Back in March.", then "These are the kinds of commission I take, for when they open again.", your commission types and prices, and the closing sentence. There's no How it works, no Ready to order?, and no email button. The about page's Get in touch reads "To ask about collaborations, or just to say hi:".
3. In **Note when closed**, paste more than 120 characters. The field says "Keep the note under 120 characters, so it fits the banner on a phone.", the box at the top lists it, "1 thing to fix before publishing" sits beside **Publish**, and **Publish** is greyed out. Shorten it, choose **Open**, and **Publish**. The Commissions page is back to its green banner, "Commissions are open. Email me to get started.", with **Contact me**.
4. **About page**: the four quick facts are there. Choose "Based in · Vancouver, BC": a dialog opens with **Label** and **Value**. Close it with its **Done** button. (If the button has another name, note it: the guide needs to match.) Choose "+ Add a fact", fill in only the **Label**, and close the dialog: the fact says "Fill in both the label and the value, or remove this fact." and the box at the top lists it. **Remove** that fact. (If **Remove** is in the row's ⋯ menu rather than on the row, note it: the guide needs to match.)
5. Still in **About page**: upload a portrait (drag a picture onto **Portrait**), leave its alt text empty, and look: the alt text field is marked as missing, but **Publish** works. Fill in the alt text. Write two short paragraphs in **Hello! (your bio)**, with a blank line between them, and **Publish**. The about page shows the portrait, **Hello!** with two paragraphs, and **At a glance**; there's no **The Work**.
6. **Home page**: write a sentence in **Artist text** and **Publish**. The home page shows it under the social links, with the portrait beside it.
7. **Contact and social links**: the rows read like "Instagram · https://www.instagram.com/kettlebirdart". Choose "+ Add a link", name it "Test", and type "test page" as its **Link**. The link says "This isn't a web address. Copy the link from your browser's address bar; it starts with https:// (or http://)." and the box at the top says "Fix this before publishing:" with "Test: the link isn't a web address". Change the link to `https://example.com`.
8. Drag "Test" to the top by its dotted grip (⠿), then use the keyboard to move it down one (focus the grip, then use the arrow keys as Sanity shows). **Publish**. On the site, the home page row, every page's footer and the about page list "Test" second, and the colours still go green, yellow, orange, pink, green.
9. Remove "Test" and **Publish**. The Ko-fi button reads "Ko-fi ☕" in all three places.
10. Put things back: empty **Artist text**, the bio and the portrait (or keep them, if Star wants them), and **Publish** each item. Commissions should be **Open**.

## What you found

Each Site settings item is published on its own and can't be deleted; the Commissions page, the about page, the home page and the footer follow what's published; and every problem the guide describes shows in the item, beside **Publish**, and on the field.
