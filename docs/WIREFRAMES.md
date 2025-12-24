# Initial Wireframes (Milestone 1)

Early-layout sketches to guide design/implementation. These will be refined with the hand-drawn paper aesthetic in Milestone 2.

## Home / Navigation Hub

```
┌───────────────────────────────┐
│  Hero on textured paper       │
│  [Radial menu toggle]         │
│   • Portfolio • Comics        │
│   • Writing  • Shop           │
│   • Commissions • About       │
│  CTA: View portfolio          │
└───────────────────────────────┘
```

### Notes
- Radial menu morphs to top nav on scroll.
- Floating ink-splatter accents and sketchy underline on headings.

## Portfolio Grid

```
┌───────────────────────────────┐
│ Filters: All | Fanart | OC... │
├───────────────────────────────┤
│ []  []  []  []                │
│ []  []  []  []    (masonry)   │
│ []  []  []  []                │
│ Lightbox: swipe/keys/esc      │
└───────────────────────────────┘
```

### Notes
- Polaroid/paper frames with tape accent.
- Blur-up thumbnails, lazy loading, keyboard focus ring.

## Comic Reader

```
┌───────────────────────────────┐
│ Page viewport (zoom/pan)      │
│ [Prev] [Progress 3/12] [Next] │
│ Panel guide + hotspots        │
│ Toolbar: zoom, reset, full    │
│ Keyboard: ← → space esc       │
└───────────────────────────────┘
```

### Notes
- Panel coordinate array from Sanity drives guided zoom.
- Reduced-motion mode disables transitions.

## Written Works (Page Flip)

```
┌───────────────────────────────┐
│ Cover / title / meta          │
│ [Page flip] [TOC] [Scroll]    │
│ Page numbers + bookmark       │
│ Mode: Flip | Scroll | HighC   │
└───────────────────────────────┘
```

### Notes
- Flip animation via `react-pageflip`, with a scroll fallback.
- Typography uses readable, clean face; decorative headings remain hand-drawn.

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

### Notes
- Buttons in sketchy border style.
- Clear pricing and “will/won’t draw” list visible above the fold.

## Responsive Behavior
- Mobile-first single column; filters as horizontal scroll chips.
- Radial menu collapses to floating button on small screens.
- Touch gestures for gallery (swipe), comics (swipe), reader (tap to flip).
