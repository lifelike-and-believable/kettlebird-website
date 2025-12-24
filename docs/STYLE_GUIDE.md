# Kettlebird Creations – Visual Style Guide (Milestone 2)

Approved brand system for development. Inspired by UPA mid-century palettes, crunchy ink lines, and paper grain.

## Color System

- **Paper neutrals:** `#f5f1e8` (base), `#e8e3d8` (shadow edge)
- **Ink:** `#2b2b2b` primary text, `#595959` secondary text (`--color-ink-light`)
- **Core palette:** `#d95d39` (burnt orange), `#f4a261` (amber), `#2a9d8f` (teal), `#e76f51` (coral), `#264653` (ink night)
- **Accent splashes:** `#e63946`, `#06ffa5`, `#ffbe0b` for micro-accents/splatter
- **Contrast pairs:** Paper + Ink (AAA), Ink Night + Paper (AAA), Burnt Orange on Paper (AA Large/AAA with bold)

```css
:root {
  --color-primary: #d95d39;
  --color-secondary: #f4a261;
  --color-accent-1: #2a9d8f;
  --color-accent-2: #e76f51;
  --color-ink: #2b2b2b;
  --color-ink-light: #595959;
  --color-ink-night: #264653;
  --color-paper: #f5f1e8;
  --color-paper-dark: #e8e3d8;
  --color-splash-1: #e63946;
  --color-splash-2: #06ffa5;
  --color-splash-3: #ffbe0b;
  --shadow-paper: 2px 4px 8px rgba(0, 0, 0, 0.15);
}
```

## Typography

- **Display/Headings:** Caveat + Patrick Hand (hand-drawn, 700 weight)
- **Body/UI:** DM Sans (clean, neutral)
- **Code:** DM Mono
- **Scale:** `clamp(1rem, 1.2vw + 0.9rem, 1.35rem)` for body; headings ascend by 1.35× ratio
- **Treatment:** Ink-underlines on `h1–h3`, generous letter-spacing on eyebrows, 1.7 line-height for body.

Font loading via Google Fonts (preconnect) with system fallbacks.

## Texture & Surfaces

- **Paper grain:** layered repeating linear gradients or small PNG tile; blend-mode multiply.
- **Edges:** Deckled/torn edges using pseudo-elements with alternating diagonals.
- **Cards:** Off-white paper, 2px ink border, irregular border-radius, paper shadow (`--shadow-paper`).
- **Buttons:** Hand-drawn outline, jitter hover (`transform: translate(-2px,-2px);`), respects `prefers-reduced-motion: reduce`.
- **Dividers:** SVG roughen filter + ink splatter sprite at low opacity (8–12%).

## Components

- **Pills/Filters:** Rounded 999px, ink border, active state uses primary fill with dark ink text.
- **Badges:** Accent-1 background, white text, small-caps.
- **Cards:** Paper background, torn edge footer strip, subtle wobble on hover.
- **Lightbox/Modals:** Dark ink night overlay with paper card; focus trap + ESC close.

## Motion

- **Easing:** `cubic-bezier(0.22, 0.61, 0.36, 1)` (organic ease-out).
- **Durations:** 120–180ms micro-interactions; 260ms section reveals.
- **Reduced motion:** Disable wobble/jitter; keep fades only.
- **Scroll effects:** Parallax paper grain max 6px offset; thresholded reveal to avoid jank.

## Accessibility

- Minimum contrast AA for text; AAA for body on paper.
- Focus rings: 2px teal outline + 1px offset shadow on focusable elements.
- All imagery requires descriptive alt text reflecting subject/pose.
- Keyboard: skip link enabled, menu/filter pills reachable in logical order.
- Motion safety: `prefers-reduced-motion` respected for hover wiggle/scroll effects.

## Branding & Iconography

- **Logo direction:** Kettlebird silhouette perched on torn paper circle; ring can animate slight bob.
- **Favicon/App icons:** Hand-drawn K within circle, paper grain background.
- **Social icons:** Monoline stroke matching 2px border weight; filled hover with accent color.
- **Dividers:** Ink strokes/brush swashes separating sections; small splatter near CTAs.

## Layout & Spacing

- Grid: mobile-first; cards stack to one column under 640px, 2–3 columns at tablet/desktop.
- Gutters: 16px mobile, 24px tablet, 32px desktop.
- Max content width: 1100px with 1rem padding guardrails.

## Implementation Notes

- Use CSS custom properties from `global.css`; expose them to React islands as needed.
- Ship a lightweight texture asset for production; fallback to CSS-generated grain.
- Keep images under 500KB, prefer WebP; add blur-up or subtle skeletons for gallery cards.
- Animate with GPU-friendly transforms; avoid layout thrash on hover wobble by using translate.
