---
id: tutorial-going-live
status: draft
runner: manual
derived-from:
  - docs-going-live#after-you-publish: e371c330f270
  - docs-going-live#where-view-on-site-goes: 5e3ba2185523
  - docs-going-live#publishing-several-things: c0109320afc8
  - docs-going-live#what-the-status-can-say: 304a28d99a6c
---

# Tutorial: publish something and watch it go live

<!-- docs/tutorials/going-live.md. runner: manual: a person follows it on the deployed site, because
it needs a signed-in editor, the Sanity webhook and the Vercel deploy hook, which CI doesn't have.
Before you start: the lead has done the setup in docs/specs/content-editing-know-when-live.md (the
deploy hook "Sanity publish" and the webhook "Rebuild site"), and this change is deployed. Use the
live address, https://newsite.kettlebird.com until the move to kettlebird.com. Use a test
item you can delete afterwards, such as a portfolio piece called "Live test". -->

You'll publish a change, watch the status at the top right until it says Live, open the page, publish several changes in a row, remove an item, and see what Didn't go live looks like.

## Steps

1. Open `/studio` and sign in. At the top right of the top bar there's a status, such as **Live · 2:41 pm** with **View on site**. Open another section of the menu: the status is still there.
2. Under **Art**, choose **New piece**, call it "Live test", add an image and its alt text, and choose **Publish**. A note says "Published. Updating the site; the status at the top right says when it's live." Within 15 seconds the status says **Updating the site…**.
3. Keep working, or wait. Within about two minutes the status says **Live** with the time the site was updated, and **View on site** appears.
4. Choose **View on site**. The portfolio opens in a new tab, and "Live test" is on it.
5. Back in the editor, change the title of "Live test" and publish; then, straight away, change it again and publish. The status says **Updating the site… (2 changes)** or **Updating the site…**. Wait until it says **Live**, then reload the portfolio: it shows the second title.
6. Open the latest chapter of a comic series, make a small change (for example to its title), and publish. When the status says **Live**, choose **View on site**: the chapter's first page opens.
7. Open "Live test" and choose **Delete**, then confirm. The status says **Updating the site…**, then **Removed from the site** with a time. Reload the portfolio: "Live test" is gone.
8. Open `/build-info.json` on the site. You see two times, `contentReadAt` and `builtAt`, from the latest build.
9. (Optional, to see a failure.) In Vercel, pause the project's deploy hook or cancel the next build, then publish a small change. After 5 minutes the status says **Still updating, taking longer than usual…**; after 15, **Didn't go live**. Choose it: the explanation opens. Press Escape, and it closes. Within the next 15 minutes the repository has an open issue labelled `site-not-live`. Undo the pause, publish again or redeploy, and when the status says **Live**, the issue closes within 15 minutes.

## What you found

Publishing starts a site update on its own, the status at the top right tells you when your change is live and opens its page, several changes in a row all arrive, a removal is reported as removed, and if the site doesn't update you're told, and so is the lead.
