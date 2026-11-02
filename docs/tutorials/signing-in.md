---
id: tutorial-signing-in
status: draft
runner: manual
derived-from:
  - docs-getting-started#accept-your-invitation: cfb482a17505
  - docs-getting-started#sign-in: 5172e19a51ff
  - docs-getting-started#if-something-goes-wrong: 83a028a41d2f
---

# Tutorial: sign in to the editor for the first time

<!-- docs/tutorials/signing-in.md. runner: manual: a person follows it on the deployed site, because
signing in needs a real Sanity account and an allowed address, which CI doesn't have. Before you
start: the site is deployed with the editor; the lead has added the site's address to Sanity's CORS
origins with credentials allowed; and you have an invitation to the project, or a second Google
account that isn't invited (for step 7). Use the live address, https://newsite.kettlebird.com
until the move to kettlebird.com. -->

You'll accept an invitation, sign in at the site's own address, check you stay signed in, and see what someone who isn't invited gets.

## Steps

1. Open the invitation email from Sanity and choose **Accept invitation**. Choose **Google** (or **E-mail / password**) with the invited address. Sanity's project page opens; close it.
2. Open `/studio` on the site. You see the sign-in screen headed **Kettlebird Creations**, with **Google** and **E-mail / password** and nothing else. The browser tab says **Kettlebird Creations**.
3. Choose the same option as in step 1. The editor opens, with **Kettlebird Creations** at the top left, the menu on the left, and no **Vision** tab.
4. Choose the circle at the top right. You see your name, your email address, and **Sign out**. Close the menu.
5. Open `/studio/structure/comicSeries` in a new tab. The editor opens there, already signed in, at the comic series list.
6. Close the browser, open it again, and open `/studio`. The editor opens without asking you to sign in.
7. Choose **Sign out**, then sign in with a Google account that wasn't invited. You see Sanity's "no access" screen with **Sign out**, and no content. Choose **Sign out**.
8. Open the site's home page and look through the header, the footer, and a few pages. Nothing links to the editor.

## What you found

The editor is at `/studio` on the site, it offers only the two sign-in options from the guide, it remembers you on this browser, any editor address works, and someone who wasn't invited sees nothing.
