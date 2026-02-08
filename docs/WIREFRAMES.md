# Wireframes (Milestone 1)

Layout structure based on approved client mockup (docs/homepage-mockup.jpg). Features a bold grid-based design with colored content cards and horizontal tab navigation.

## Home / Navigation Hub

```
┌─────────────────────────────────────────────────────────┐
│  KETTLEBIRD                                             │
│  Comics + Illustration                                  │
│  [PORTFOLIO][COMICS][WRITING][ABOUT][NEWS]             │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │PORTFOLIO │  │   LOGO   │  │  MERCH   │             │
│  │ (dark+   │  │   (KB)   │  │ (orange) │             │
│  │ artwork) │  │ (yellow) │  │          │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  COMICS  │  │ CONTACT  │  │COMMISSION│             │
│  │ (gray +  │  │   ME!    │  │ (artwork │             │
│  │ artwork) │  │ (coral)  │  │  grid)   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ WRITING  │  │  ABOUT   │  │   NEWS   │             │
│  │ (dark +  │  │  (mint)  │  │ (yellow) │             │
│  │  eyes)   │  │          │  │          │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  [BLUESKY | TUMBLR | INSTAGRAM | KO-FI]                │
│                                                         │
│  ABOUT THE ARTIST                                       │
│  ┌──────────┐  Lorem ipsum dolor sit amet...           │
│  │ PORTRAIT │  Biography text with multiple            │
│  │  [TBD]   │  paragraphs describing the               │
│  │ (yellow) │  artist's background and work.           │
│  └──────────┘                                           │
└─────────────────────────────────────────────────────────┘
```

### Notes
- **Horizontal tab navigation** at top (not radial menu)
- **Grid-based card layout** with varying sizes
- **Thick black borders** around all cards
- **Bold colors** for section backgrounds (yellow, orange, coral, mint, lime)
- **Social links** as horizontal text labels with colored backgrounds
- **Fixed navigation** tabs remain visible while scrolling

## Portfolio Grid

```
┌─────────────────────────────────────────────────────────┐
│  KETTLEBIRD - Comics + Illustration                     │
│  [PORTFOLIO][COMICS][WRITING][ABOUT][NEWS]             │
├─────────────────────────────────────────────────────────┤
│  Filters: [All] [Fanart] [Original] [Commissions]      │
├─────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│  │ Image  │ │ Image  │ │ Image  │ │ Image  │          │
│  │  Card  │ │  Card  │ │  Card  │ │  Card  │          │
│  └────────┘ └────────┘ └────────┘ └────────┘          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│  │ Image  │ │ Image  │ │ Image  │ │ Image  │          │
│  │  Card  │ │  Card  │ │  Card  │ │  Card  │          │
│  └────────┘ └────────┘ └────────┘ └────────┘          │
│  Click to open lightbox with full image + nav          │
└─────────────────────────────────────────────────────────┘
```

### Notes
- **Rectangular cards** with thick black borders and drop shadows
- **Masonry or grid** layout depending on image aspect ratios
- **Filter tabs** styled like navigation tabs (colored backgrounds, bold text)
- **Lightbox modal** with dark overlay for full-size viewing
- **Keyboard navigation** support (arrow keys, Escape to close)

## Comic Reader

```
┌─────────────────────────────────────────────────────────┐
│  KETTLEBIRD - Comics + Illustration                     │
│  [PORTFOLIO][COMICS][WRITING][ABOUT][NEWS]             │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐     │
│  │                                               │     │
│  │         Comic Page Viewport                   │     │
│  │         (zoom/pan enabled)                    │     │
│  │                                               │     │
│  │                                               │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
│  [← PREV]    Page 3 of 12    [NEXT →]                 │
│  [Panel Guide] [Zoom] [Reset] [Fullscreen]            │
│  Keyboard: ← → arrows, Space to advance, Esc to exit  │
└─────────────────────────────────────────────────────────┘
```

### Notes
- **Clean bordered viewport** for comic page viewing
- **Panel coordinate array** from Sanity CMS for guided reading
- **Navigation controls** styled as bordered buttons matching design system
- **Toolbar buttons** with consistent styling (thick borders, solid colors)
- **Keyboard support** for accessibility
- **Reduced-motion mode** disables zoom animations

## Written Works (Page Flip)

```
┌─────────────────────────────────────────────────────────┐
│  KETTLEBIRD - Comics + Illustration                     │
│  [PORTFOLIO][COMICS][WRITING][ABOUT][NEWS]             │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                    │
│  │   LEFT       │  │   RIGHT      │                    │
│  │   PAGE       │  │   PAGE       │                    │
│  │              │  │              │                    │
│  │   Content    │  │   Content    │                    │
│  │   text and   │  │   text and   │                    │
│  │   images     │  │   images     │                    │
│  │              │  │              │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                         │
│  [← PREV]  Page 5 of 24  [NEXT →]                     │
│  [Flip View] [Scroll View] [Table of Contents]        │
└─────────────────────────────────────────────────────────┘
```

### Notes
- **Page flip animation** for book-like reading experience (react-pageflip)
- **Alternative scroll view** for accessibility and mobile
- **Navigation buttons** with thick borders and solid colors
- **Table of contents** in sidebar or modal
- **Typography** uses clean, readable body font
- **Page layout** with proper margins and line-height for readability

## Shop / Commissions

```
┌───────────────────────────────┐
│ Status banner: Open/Waitlist  │
│ Cards: prints / stickers      │
│ CTA: Buy on Ko‑fi             │
│ Commission tiers with examples│
│ Queue embed (Trello/Notion)   │
└───────────────────────────────┘
```

## Shop / Commissions

```
┌─────────────────────────────────────────────────────────┐
│  KETTLEBIRD - Comics + Illustration                     │
│  [PORTFOLIO][COMICS][WRITING][ABOUT][NEWS]             │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐     │
│  │ ⚠ COMMISSIONS: Currently OPEN                │     │
│  │ Status banner (coral/orange background)      │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ ICON         │  │ BUST         │  │ FULL BODY    │ │
│  │ $30-50       │  │ $60-80       │  │ $100-150     │ │
│  │ [Example]    │  │ [Example]    │  │ [Example]    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────┐     │
│  │ ✓ Will Draw: Characters, OCs, Fanart, etc.   │     │
│  │ ✗ Won't Draw: NSFW, Complex mecha, etc.      │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
│  ┌───────────────────────────────────────────────┐     │
│  │     REQUEST COMMISSION (Ko-fi Button)         │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
│  CURRENT QUEUE:                                         │
│  [Trello/Notion embed showing active commissions]      │
└─────────────────────────────────────────────────────────┘
```

### Notes
- **Status banner** with bold background color (coral/orange)
- **Price tier cards** with thick borders and example artwork
- **Will/Won't draw section** in bordered card for clarity
- **Bold CTA button** for Ko-fi integration
- **Queue visibility** via embedded Trello/Notion board
- **Colored cards** matching homepage design (orange, coral, yellow theme)

## Responsive Behavior
- **Mobile-first** with single column card stacking
- **Navigation tabs** collapse to hamburger menu on small screens or stack vertically
- **Cards maintain** full width on mobile with consistent borders and colors
- **Touch gestures** for gallery swipe, comic page navigation
- **Filters** as horizontal scrollable chips on mobile
- **Social links** stack or scroll horizontally at bottom
- **No radial menu** - horizontal navigation only as per mockup
