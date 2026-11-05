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

- **A slim bar names the piece; a tap hides everything** (answers the epic's first open question). Full screen shows a top bar with the title, "3 of 12" and **Close**, and **Previous**, **Next** and the zoom buttons at the edges. While they show, the piece fits between the bars, so they never cover it. A tap or click on the piece hides them, and the piece takes the whole screen; another tap, a mouse movement, a key press, or moving focus to a control brings them back. They never fade on a timer, which would hide **Close** from someone still reading the screen. Story 1's "shows only the piece" is read as: none of the dialog's text or the site around it; the bars are the view's own controls.
- **While a piece is zoomed in, a drag or swipe moves around it, and doesn't turn** (answers the second). This is the comic reader's rule for a pinch-zoomed page, and the one fans know from photo apps. **Previous**, **Next**, and the Left and Right arrow keys always turn, at any zoom, as story 2 asks; Shift with an arrow key, and Up and Down, move around a zoomed piece.
- **Full screen belongs to the dialog.** It opens from the dialog and closes back to it, on the piece last shown. It has no address. Where it covers the window instead of using the browser's full-screen mode, it adds one history entry, so the phone's Back (or Safari's back-swipe) closes full screen instead of leaving the portfolio.

## How it works

- **Opening.** The dialog's picture gains a **Full screen** button in its lower right corner: with its label on a laptop (mock-up 1), as a 44-pixel icon button named "Full screen" on a phone, so it covers less of the piece (mock-up 2). Choosing it, or tapping or clicking the picture itself, opens full screen on that piece. Where the browser offers its own full-screen mode, the site asks for it, and the browser's bars go. Where it doesn't (Safari on an iPhone, where Safari's own bars stay), or the browser refuses, the same view covers the whole window instead, clear of the iPhone's notch and home bar (mock-up 5). Either way the page behind doesn't scroll, and pinching zooms the piece, not the page.
- **The picture.** The opened piece shows its dialog picture straight away, enlarged to fit, while a sharper copy loads from the image CDN at the screen's size (its longer side times the screen's pixel density, never more than the original). When it's ready, it replaces the first without a jump. Zooming in loads larger copies only as the zoom needs them: at twice the screen's size past 150%, and at four times past 300%, never more than the original.
- **Fitting.** At 100% the piece fits whole, centred on a near-black background, between the bars while they show (mock-up 3) and on the whole screen while they're hidden (mock-up 7). The zoom level always counts from the whole piece, not from the picture's pixels.
- **Zooming.** By pinching; by double-tapping or double-clicking (to 250% at that point, or back to 100%); with the mouse wheel or a trackpad, at the pointer; with **+** and **−** (each step 1.5 times); and with the +, = and − keys (and the number pad's). **Fit** and the 0 key go back to 100%. Zoom stops at 100% on the way out, and on the way in where one of the picture's pixels covers two of the screen's, but never below 200%. On a laptop, while zoomed, a small map in the corner shows the whole piece with the part on screen outlined (mock-up 4); a phone has no room for it.
- **Moving around.** A drag (one finger, or the mouse) moves the zoomed piece; it stops at the piece's edges. Shift with an arrow key, or Up and Down, move it by a tenth of the screen.
- **Tapping and dragging.** A single tap or click hides or shows the controls only once the moment for a double-tap has passed (about 0.3 seconds), so a double-tap zooms without flickering the controls; a click that ends a drag does nothing.
- **Turning.** **Previous** and **Next** sit at the screen's left and right edges on a laptop and on a phone held sideways (mock-ups 3 and 9), and at the bottom corners of a phone held upright, where thumbs are (mock-up 5). A swipe left or right turns while the piece fits: the piece follows the finger and the next slides in; a swipe that's mostly up or down isn't a turn, and nor is one that starts at the screen's left edge, where Safari's back-swipe lives. Each piece opens at 100%. Under reduced motion, the turn cuts straight to the next piece.
- **A piece that hasn't loaded.** Once the current piece has loaded, the next and the previous piece are fetched, the one in the direction the fan is going first. If the fan turns faster than that, the title and count change at once, the background shows, and after 0.3 seconds a small loading sign; the piece appears when it arrives.
- **The order.** The pieces of the section the fan opened the piece from, in its order on the page ("Original Work", say, even when the filter is **All**), leaving out any without a picture. A piece in several sections is turned through in the section it was opened from. The count, "3 of 12 · Original Work" on a laptop and "3 of 12" on a phone, counts only pieces with a picture. There's no turning past either end: on the first piece **Previous** can't be used, and on the last **Next** can't (mock-up 8).
- **Leaving.** **Close**, Escape, the browser's own way out (its Escape, or "Exit full screen"), or Back where full screen covers the window, goes back to the dialog of the piece last shown, with focus on its **Full screen** button (mock-up 10). One Escape leaves full screen only, not the dialog too. The gallery behind has its section's row scrolled to that piece, and the dialog's **Close** then returns focus to that piece in the gallery.

## Flow: a fan on a phone

1. In the gallery, the fan taps a piece; its dialog opens as now, with the **Full screen** icon on the picture (mock-up 2).
2. They tap the picture. It fills the screen (the browser's bars go, except on an iPhone, where Safari's stay), with the title, "5 of 12" and **✕** in a bar at the top, and **Previous**, the zoom buttons and **Next** in a bar at the bottom (mock-up 5).
3. They pinch into a face in the piece, and drag across to see the hands (mock-up 6). The drag moves the piece; it doesn't turn.
4. They tap **Fit** (or pinch back out) and swipe left: the next piece in the section slides in, whole.
5. They tap the piece: the bars go, and it takes the whole screen (mock-up 7). Another tap brings them back.
6. They turn the phone sideways; the piece refits, and **Previous** and **Next** move to the sides (mock-up 9, a later piece).
7. They tap **✕**, or use the phone's Back. The dialog for the piece they stopped on opens, and its **Close** takes them back to the gallery, at that piece.

## Flow: a fan on a laptop

1. In a dialog, they choose **Full screen** (mock-up 1), or click the picture.
2. The piece fills the screen (mock-up 3). The right arrow key or **Next** turns; Escape leaves.
3. They scroll the mouse wheel over a detail, or double-click it, to zoom there (mock-up 4); they drag, or use Shift with the arrow keys, to move around; **Fit** or 0 shows it whole again.

## States and errors

- **The sharper picture is loading:** the dialog's copy shows, enlarged; nothing else changes. If the sharper copy fails, the dialog's copy stays, and zooming works on it.
- **A turned-to piece is loading:** as above, under "A piece that hasn't loaded". If it fails, "This piece couldn't load." shows in its place, and turning on works.
- **A piece without a picture:** a placeholder item in the gallery has none. Its dialog has no **Full screen**, and turning and the count skip it.
- **The browser refuses full screen** (a setting, or an embedded frame): the view covers the window instead, as on an iPhone.
- **The fan leaves full screen with the browser's own control:** the site notices and goes back to the dialog, as with **Close**.
- **A screen rotates or a window resizes:** the piece refits at 100%, or keeps its zoom centred on the same point.
- **One piece in the section:** **Previous** and **Next** both can't be used; full screen still works.
- **Reduced motion:** zooming with the buttons, keys and double-tap jumps instead of easing, and turning cuts instead of sliding; pinching and dragging follow the fingers as always.
- **Large text** (the browser's zoom at 200% or more): the top bar's title shortens with an ellipsis, the zoom bar's buttons keep their size, and hiding the controls still gives the piece the whole screen.
- **Preview** (Star's portfolio preview): **Full screen** works the same, covering the preview frame. A piece the preview opened directly counts from the first section it's in.

## Accessibility

- **Full screen** is a button named "Full screen". The view is a modal dialog named "Full screen", which keeps focus inside it; **Close** is focused when it opens. The dialog behind does nothing with keys or clicks while full screen is open.
- The picture keeps its alt text. Opening, and each turn, announces "Night Market, 3 of 12." through a polite live region, followed by the alt text when the piece has one (mock-up 8). The title is said once, by the live region, not again by the view's name.
- **Previous**, **Next**, **Close**, **+**, **−** and **Fit** are buttons with names, at least 44 by 44 pixels. **Previous** and **Next** at the ends, **−** and **Fit** at 100%, and **+** at the most zoom can't be used: they're drawn dashed, like the comic reader's controls that can't be used, are marked `aria-disabled`, and Tab skips them, as in the comic reader, so Tab only lands on what does something.
- Hiding the controls is visual only: they stay in the accessibility tree, and any control that gets focus (by Tab, or a screen reader's own navigation) brings the controls back. The picture isn't a button, so a screen reader's double-tap on it doesn't hide anything. If a mouse click hides the controls while one has focus, focus moves to the view first, so it never leaves full screen.
- Keys: Left and Right turn; Shift with the arrow keys, and Up and Down, move around a zoomed piece; +, = and − zoom, 0 fits, Escape leaves. Tab moves through the controls.
- The zoom level is announced when it changes by a button or key ("250%").
- The bars are solid near-black, so their light text has at least 4.5:1 contrast whatever the piece; the side buttons have the same solid backing.

## Mock-ups

| # | Shows | File |
|---|---|---|
| 1 | Laptop: a piece's dialog, with **Full screen** on its picture (focused) | `mockups/portfolio-full-screen/1-laptop-dialog.png` |
| 2 | Phone: the dialog, with the **Full screen** icon button on the picture | `mockups/portfolio-full-screen/2-phone-dialog.png` |
| 3 | Laptop, full screen: the piece fits between the bars; title, "3 of 12 · Original Work", **Close**; **Previous** and **Next** at the sides; zoom below, with **−** and **Fit** dashed at 100% | `mockups/portfolio-full-screen/3-laptop-full-screen.png` |
| 4 | Laptop, zoomed to 340%: drag or Shift with the arrow keys to move; the corner map | `mockups/portfolio-full-screen/4-laptop-zoomed.png` |
| 5 | Phone, full screen, held upright: **Previous**, zoom and **Next** in the bottom bar (on an iPhone, Safari's own bars stay above and below) | `mockups/portfolio-full-screen/5-phone-full-screen.png` |
| 6 | Phone, pinched in: a drag moves the piece and doesn't turn | `mockups/portfolio-full-screen/6-phone-pinched.png` |
| 7 | Controls hidden by a tap: the piece takes the whole screen | `mockups/portfolio-full-screen/7-controls-hidden.png` |
| 8 | The first piece in its section: **Previous** can't be used; what a screen reader hears | `mockups/portfolio-full-screen/8-first-piece.png` |
| 9 | A phone held sideways, on a later piece: **Previous** and **Next** at the sides | `mockups/portfolio-full-screen/9-sideways.png` |
| 10 | After **Close**: the dialog of the piece last shown, with focus on **Full screen** | `mockups/portfolio-full-screen/10-back-to-dialog.png` |

## For the guide

- The site has no fans' guide to the portfolio yet. A short one, **Looking at Star's art** (`docs/user/viewing-artwork.md`), joins the fans' guides (`FAN_GUIDES`): the gallery and its filter, a piece's dialog, and full screen (zooming, turning, hiding the controls, leaving). It isn't Star's, so the editor's **Help** menu doesn't gain it.

## For the spec to check

- Full screen's request and its fallback (covering the window, its history entry, Back closing it), with the browser's own exit noticed; that the page behind doesn't scroll or zoom; the iPhone's safe areas.
- That full screen handles Escape first, and the dialog's own Escape, Tab trap and outside click do nothing while it's open; one Escape leaves full screen only.
- The image sizes requested from the CDN at fit and at each zoom step; the prefetch of both neighbours; the loading sign and the failed piece.
- The zoom limits, the zoom at a point (wheel and double-click), the drag's edges, and tap versus double-tap versus drag.
- That a drag while zoomed never turns, that Left and Right always turn, and that vertical and left-edge swipes don't.
- The order: the section the piece came from, the ends, the count, and skipping pieces without pictures; preview's directly opened piece.
- Focus: into the view on opening, back on **Full screen** on leaving, then on the piece last shown in the gallery after the dialog closes; controls coming back on focus; the announcements.
- Reduced motion; large text.
- That the gallery and the dialog look and load as before.

## Persona walkthrough

A walkthrough for persona-fan (2026-11-05), which checked both stories' criteria and opened every mock-up, found six blocking problems and seventeen others. Addressed here:

- **Blocking:**
  - on an iPhone (and wherever full screen covers the window), Back or the back-swipe left the portfolio: full screen now adds a history entry there, and swipes from the left edge don't turn;
  - no state for a turned-to piece still loading: the loading sign, and both neighbours fetched ahead;
  - the arrow keys moved a zoomed piece, but story 2 says Left and Right turn: they always turn now, and Shift with the arrows (and Up and Down) move it;
  - a screen reader's double-tap on the picture hid every control: hiding is visual only, focus brings them back, and the picture isn't a button;
  - the controls' text was unreadable over light pieces and covered the piece: solid bars, and the piece fits between them;
  - phones had no **Fit**: added.
- **Others:**
  - the dialog's own Escape and focus trap while full screen is open;
  - focus returning to the piece last shown, not the one first opened;
  - Safari's bars, safe areas, and page zoom on an iPhone;
  - tap versus double-tap, and a drag's click;
  - loading larger pictures only as the zoom needs them;
  - the turn's slide, vertical swipes, and reduced motion;
  - the count leaving out pieces without pictures, and preview's directly opened piece;
  - controls that can't be used: dashed, and skipped by Tab as in the comic reader, **Fit** among them;
  - the title said once on opening;
  - mouse movement bringing the controls back;
  - the = key and the number pad;
  - a smaller **Full screen** button on phones;
  - large text;
  - the corner map on laptops only;
  - mock-ups 5, 6 and 9 matched to the text.
- **For the lead:** story 1 says full screen "shows only the piece"; this design shows the title, count and controls in bars around it, which a tap hides. Confirm that reading when merging, or ask for the bars to go.
