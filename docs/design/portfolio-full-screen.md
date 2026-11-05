---
id: design-portfolio-full-screen
status: draft
derived-from:
  - story-portfolio-full-screen-view-a-piece-full-screen: 19f9bca00ea0
  - story-portfolio-full-screen-move-between-pieces-full-screen: 496c24c72cca
  - epic-portfolio-full-screen#open-questions: 83007f815905
  - requirements-portfolio#REQ-portfolio-4: 136ce70ca3a4
  - persona-fan#context-of-use: 38883e5abc09
---

# Full screen for the portfolio: design

<!-- docs/design/portfolio-full-screen.md. Design for stories 1 and 2 of epic-portfolio-full-screen.
Mock-ups are in docs/design/mockups/portfolio-full-screen/ (PNG images, and mockups.html, the source
they are rendered from with render.mjs). The pieces in the mock-ups are the site's own background
artwork, standing in for Star's. -->

## Personas

- persona-fan: arrives from a social post, usually on a phone, and decides within seconds whether to keep looking. The dialog's picture is small on a phone, under the title and description. Full screen gives the piece the whole screen, lets them pinch into the detail they came for, and swipe on to the next piece without going back to the gallery.

## Decisions

- **The controls stay until the fan hides them** (answers the epic's first open question). Full screen shows the title, "3 of 12", **Close**, **Previous**, **Next** and the zoom buttons over the piece, in a slim bar and at the edges. A tap or click on the piece hides them all, for a clean view; another tap brings them back. They never fade on a timer, which would hide **Close** from someone who's still reading the screen, and would need its own way to bring them back for keyboard and screen reader users.
- **While a piece is zoomed in, a drag or swipe moves around it, and doesn't turn** (answers the second). This is the comic reader's rule for a pinch-zoomed page, and the one fans already know from photo apps. **Previous** and **Next** still turn at any zoom. The arrow keys turn while the piece fits the screen, and move around it while it's zoomed in.
- **Full screen belongs to the dialog.** It opens from the dialog and closes back to it, on the piece last shown. It has no address and adds no history entry, like the dialog.

## How it works

- **Opening.** The dialog's picture gains a **Full screen** button in its lower right corner (mock-ups 1 and 2). Choosing it, or tapping or clicking the picture itself, opens full screen on that piece. Where the browser offers its own full-screen mode, the site asks for it, and the browser's bars and the rest of the screen go. Where it doesn't (Safari on an iPhone), the same view covers the whole window instead (mock-up 5). Either way the page behind doesn't scroll.
- **The picture.** The dialog's picture shows straight away, enlarged to fit, and a sharper copy loads behind it from the image CDN at the screen's size (its longer side times the screen's pixel density, never more than the original). When it's ready, it replaces the first without a jump. Zooming past the screen's size loads the original, up to 4,000 pixels on its longer side.
- **Fitting.** The piece fits the screen whole, centred on a near-black background (mock-up 3). That is 100%: the zoom level always counts from the whole piece, not from the picture's pixels.
- **Zooming.** By pinching; by double-tapping or double-clicking (to 250% at that point, or back to 100%); with the mouse wheel or a trackpad, at the pointer; with **+** and **−** (each step 1.5 times); and with the + and − keys. **Fit** and the 0 key go back to 100%. Zoom stops at 100% on the way out, and on the way in where one of the picture's pixels covers two of the screen's, but never below 200%. While zoomed, a small map in the corner shows the whole piece with the part on screen outlined (mock-up 4).
- **Moving around.** A drag (one finger, or the mouse) moves the zoomed piece; it stops at the piece's edges. The arrow keys move it by a tenth of the screen.
- **Turning.** **Previous** and **Next** sit at the screen's left and right edges on a laptop, and at the bottom corners on a phone, where thumbs are (mock-ups 3 and 5). A swipe left or right turns while the piece fits. Each piece opens at 100%. The next piece's picture is fetched once the current one has loaded, so turning forward doesn't wait. There's no turning past either end: on the first piece **Previous** can't be used, and on the last **Next** can't (mock-up 8).
- **The order.** The pieces of the section the fan opened the piece from, in its order on the page ("Original Work", say, even when the filter is **All**). A piece in several sections is turned through in the section it was opened from. The count reads "3 of 12 · Original Work" on a laptop and "3 of 12" on a phone.
- **Leaving.** **Close**, Escape, or the browser's own way out (its Escape, or its "Exit full screen") goes back to the dialog of the piece last shown, with focus on its **Full screen** button (mock-up 10). The gallery behind has scrolled that section's row to the piece. **Close** in the dialog then returns to the gallery as now.

## Flow: a fan on a phone

1. In the gallery, the fan taps a piece; its dialog opens as now, with **Full screen** on the picture (mock-up 2).
2. They tap the picture. It fills the screen, the browser's bars go, and the title, "5 of 12" and **✕** sit in a slim bar at the top, with **Previous**, the zoom buttons and **Next** along the bottom (mock-up 5).
3. They pinch into a face in the piece, and drag across to see the hands (mock-up 6). The swipe moves the piece; it doesn't turn.
4. They pinch back out (or tap **Fit**), and swipe left: the next piece in the section opens whole.
5. They tap the piece to hide the controls and look at it clean (mock-up 7), then tap again to bring them back.
6. They turn the phone sideways; the piece refits to the new shape (mock-up 9).
7. They tap **✕**. The dialog for the piece they stopped on opens, and its **Close** takes them back to the gallery.

## Flow: a fan on a laptop

1. In a dialog, they choose **Full screen** (mock-up 1), or click the picture.
2. The piece fills the screen (mock-up 3). The right arrow key or **Next** turns; Escape leaves.
3. They scroll the mouse wheel over a detail, or double-click it, to zoom there (mock-up 4); they drag, or use the arrow keys, to move around; **Fit** or 0 shows it whole again.

## States and errors

- **The sharper picture is loading:** the dialog's copy shows, enlarged; nothing else changes. If the sharper copy fails, the dialog's copy stays, and zooming works on it.
- **A piece without a picture:** a placeholder item in the gallery has none. Its dialog has no **Full screen**, and turning skips it.
- **The browser refuses full screen** (a setting, or an embedded frame): the view covers the window instead, as on an iPhone.
- **The fan leaves full screen with the browser's own control:** the site notices and goes back to the dialog, as with **Close**.
- **A screen rotates or a window resizes:** the piece refits at 100%, or keeps its zoom centred on the same point.
- **One piece in the section:** **Previous** and **Next** both can't be used; full screen still works.
- **Reduced motion:** zooming with the buttons, keys and double-tap jumps instead of easing; pinching and dragging follow the fingers as always.
- **Preview** (Star's portfolio preview): **Full screen** works the same, inside the preview frame, covering the frame.

## Accessibility

- **Full screen** is a button named "Full screen". The view is a modal dialog named "Night Market, full screen", which keeps focus inside it; **Close** is focused when it opens.
- The picture keeps its alt text. Opening, and each turn, announces "Night Market, 3 of 12." through a polite live region, followed by the alt text when the piece has one (mock-up 8).
- **Previous**, **Next**, **Close**, **+**, **−** and **Fit** are buttons with names, at least 44 by 44 pixels. **Previous** and **Next** at the ends, **−** at 100% and **+** at the most zoom can't be used (`aria-disabled`, dashed like the comic reader's unusable controls), and stay focusable so their place is kept.
- Keys: Left and Right turn while the piece fits; while it's zoomed in, the arrow keys move around it. + and − zoom, 0 fits, Escape leaves. Tab moves through the controls. Hidden controls come back on any key press, so a keyboard user can't lose them.
- The zoom level is announced when it changes by a button or key ("250%").
- The controls' text and borders are light on a translucent dark backing, at least 4.5:1 against any piece.

## Mock-ups

| # | Shows | File |
|---|---|---|
| 1 | Laptop: a piece's dialog, with **Full screen** on its picture (focused) | `mockups/portfolio-full-screen/1-laptop-dialog.png` |
| 2 | Phone: the dialog, with **Full screen** on the picture | `mockups/portfolio-full-screen/2-phone-dialog.png` |
| 3 | Laptop, full screen: the piece fits; title, "3 of 12 · Original Work", **Close**; **Previous** and **Next** at the sides; zoom below | `mockups/portfolio-full-screen/3-laptop-full-screen.png` |
| 4 | Laptop, zoomed to 340%: drag or the arrow keys to move; the corner map | `mockups/portfolio-full-screen/4-laptop-zoomed.png` |
| 5 | Phone, full screen (the same on an iPhone, covering the window) | `mockups/portfolio-full-screen/5-phone-full-screen.png` |
| 6 | Phone, pinched in: a drag moves the piece and doesn't turn | `mockups/portfolio-full-screen/6-phone-pinched.png` |
| 7 | Controls hidden by a tap | `mockups/portfolio-full-screen/7-controls-hidden.png` |
| 8 | The first piece in its section: **Previous** can't be used; what a screen reader hears | `mockups/portfolio-full-screen/8-first-piece.png` |
| 9 | A phone held sideways | `mockups/portfolio-full-screen/9-sideways.png` |
| 10 | After **Close**: the dialog of the piece last shown, with focus on **Full screen** | `mockups/portfolio-full-screen/10-back-to-dialog.png` |

## For the guide

- The site has no fans' guide to the portfolio yet. A short one, **Looking at Star's art** (`docs/user/viewing-artwork.md`), joins the fans' guides (`FAN_GUIDES`): the gallery and its filter, a piece's dialog, and full screen (zooming, turning, hiding the controls, leaving). It isn't Star's, so the editor's **Help** menu doesn't gain it.

## For the spec to check

- Full screen's request and its fallback, with the browser's own exit noticed; that the page behind doesn't scroll.
- The image sizes requested from the CDN at fit and zoomed, and the prefetch of the next piece.
- The zoom limits, the zoom at a point (wheel and double-click), and the drag's edges.
- That a drag while zoomed never turns, and the arrow keys' two jobs.
- The order: the section the piece came from, the ends, and skipping pieces without pictures.
- Focus: into the view on opening, back on **Full screen** on leaving, and inside the view throughout; the announcements.
- Reduced motion.
- That the gallery and the dialog look and load as before.

## Persona walkthrough

To be written after the walkthrough.
