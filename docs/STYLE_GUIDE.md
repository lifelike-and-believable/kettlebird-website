# Kettlebird Creations – Visual Style Guide (Milestone 2)

Approved brand system for development based on client mockup (docs/homepage-mockup.jpg). Features warm textured paper backgrounds, bold grid-based card layout, and vibrant accent colors.

## Color System

Based on the approved mockup design:

- **Background:** `#e8dcc8` (warm beige/tan textured paper)
- **Text/Borders:** `#000000` (black) for primary text and card borders, `#2b2b2b` for body text
- **Navigation tabs:** `#f4c95d` (golden yellow) for active/primary navigation
- **Section accents:**
  - Orange: `#ea7547` (merch, contact sections)
  - Coral/Red: `#c85a3e` (contact me section)
  - Mint Green: `#8dc9a3` (about section)
  - Lime Yellow: `#e8d65f` (news section)
  - Purple: `#5a4a7d` (logo/brand accent)
- **Social media labels:**
  - Green: `#4a6b52` (Bluesky)
  - Gold: `#d4a944` (Tumblr)
  - Pink: `#e85d8a` (Instagram)
  - Coral: `#c85a3e` (Ko-fi)

```css
:root {
  /* Base colors from mockup */
  --color-background: #e8dcc8;
  --color-text-primary: #000000;
  --color-text-body: #2b2b2b;
  
  /* Navigation */
  --color-nav-primary: #f4c95d;
  
  /* Section colors */
  --color-orange: #ea7547;
  --color-coral: #c85a3e;
  --color-mint: #8dc9a3;
  --color-lime: #e8d65f;
  --color-purple: #5a4a7d;
  
  /* Social media colors */
  --color-bluesky: #4a6b52;
  --color-tumblr: #d4a944;
  --color-instagram: #e85d8a;
  --color-kofi: #c85a3e;
  
  /* Borders and shadows */
  --border-thick: 4px solid #000000;
  --border-medium: 3px solid #000000;
  --shadow-card: 4px 4px 0px rgba(0, 0, 0, 0.3);
}
```

## Typography

Based on the mockup design:

- **Brand/Logo:** Bold, black sans-serif (similar to Archivo Black, Impact, or Bebas Neue)
  - "Kettlebird" uses very bold, condensed display font
  - "Comics + Illustration" uses medium weight sans-serif
- **Navigation tabs:** Bold, uppercase sans-serif (700-900 weight)
- **Section labels:** Bold, uppercase white text on colored backgrounds
- **Body text:** Clean, readable sans-serif (similar to Open Sans, Inter, or DM Sans)
- **Scale:** 
  - Logo/Brand: 3.5-4rem (56-64px)
  - Section headings: 2.5-3rem (40-48px)
  - Navigation: 1.1-1.25rem (18-20px)
  - Body: 1rem (16px) base with 1.6 line-height

```css
:root {
  --font-brand: 'Bebas Neue', 'Archivo Black', 'Impact', sans-serif;
  --font-heading: 'Inter', 'Open Sans', system-ui, sans-serif;
  --font-body: 'Inter', 'Open Sans', system-ui, sans-serif;
  --font-weight-bold: 700;
  --font-weight-black: 900;
}
```

Font loading via Google Fonts (preconnect) with system fallbacks.

## Texture & Surfaces

Based on the approved mockup:

- **Background texture:** Warm beige paper with subtle grain/noise texture (not strong paper grain)
- **Card borders:** Thick black borders (3-4px solid) with sharp corners, not torn edges
- **Card backgrounds:** Solid colors with optional subtle texture overlay
  - Portfolio cards: Dark background with artwork overlay
  - Content cards: Solid accent colors (orange, mint, yellow, coral)
  - Logo card: Golden yellow with centered purple icon
- **Shadows:** Hard drop shadows offset (4px right, 4px down) in black at 30% opacity
- **Navigation tabs:** Solid color pills with thick borders, rectangular with slight rounding
- **No deckled/torn edges:** Clean, geometric shapes throughout

## Components

Based on the mockup design:

- **Navigation tabs:** Horizontal row of rectangular pills with golden yellow background, bold uppercase text, thick black borders
- **Content cards:** Large rectangular sections with:
  - Thick black borders (3-4px)
  - Solid color backgrounds or image overlays
  - Bold white uppercase labels
  - Hard drop shadows for depth
  - No border-radius (sharp corners)
- **Logo card:** Centered purple bird icon with "KB" text on golden yellow background
- **Social media links:** Horizontal row of colored rectangular labels with text (BLUESKY | TUMBLR | INSTAGRAM | KO-FI)
- **Section cards:** Grid layout with different sized rectangles:
  - Portfolio: Dark with artwork preview
  - Comics: Grayscale artwork with text overlay
  - Merch: Solid orange
  - Commissions: Collage of artwork examples
  - Writing: Dark with distinctive eyes artwork
  - Contact Me!: Solid coral/red
  - About: Solid mint green
  - News: Solid lime yellow

## Motion

Subtle, professional animations:

- **Easing:** `ease-out` or `cubic-bezier(0.25, 0.46, 0.45, 0.94)` for smooth transitions
- **Durations:** 150-250ms for hover states and tab changes
- **Hover effects:** 
  - Cards: Slight lift with shadow increase
  - Navigation tabs: Background color shift or underline appear
  - No jitter or wobble effects
- **Reduced motion:** Disable all animations and transitions, keep only instant state changes
- **Page transitions:** Smooth fades between pages (200-300ms)

## Accessibility

- Minimum contrast AA for text; AAA for body on paper.
- Focus rings: 2px teal outline + 1px offset shadow on focusable elements.
- All imagery requires descriptive alt text reflecting subject/pose.
- Keyboard: skip link enabled, menu/filter pills reachable in logical order.
- Motion safety: `prefers-reduced-motion` respected for hover wiggle/scroll effects.

## Branding & Iconography

Based on the approved mockup:

- **Logo:** Purple bird silhouette with "KB" initials centered inside
  - Color: Deep purple (#5a4a7d)
  - Style: Simplified, iconic bird shape with teardrop/spade-like body
  - Placement: On golden yellow background card in grid layout
- **Brand name:** "Kettlebird" in bold, condensed black sans-serif
- **Tagline:** "Comics + Illustration" in regular weight below brand name
- **Favicon/App icons:** Simplified "KB" or bird icon from logo
- **Social icons:** Text-based labels in colored rectangles (not icon symbols)
- **No decorative elements:** Clean, geometric design without ink splatters or brush strokes

## Layout & Spacing

From the mockup grid structure:

- **Grid layout:** CSS Grid with varying card sizes
  - Homepage uses asymmetric grid with different sized cards
  - Cards can span multiple columns/rows for visual interest
- **Gutters:** 12-16px between cards for clear separation
- **Max content width:** 1400px centered with side margins
- **Card proportions:** Mix of squares and rectangles creating dynamic layout
- **Mobile behavior:** Stack cards in single column, maintaining card color/style
- **Navigation:** Fixed horizontal tabs at top, always visible
- **Social links:** Horizontal bar below main grid

## Implementation Notes

- Use CSS custom properties from `global.css` for consistent color theming
- Background texture can be a subtle noise PNG overlay or CSS filter
- Grid layout using CSS Grid with named grid areas for responsive behavior
- Navigation tabs should be keyboard accessible with proper ARIA labels
- Card hover states should maintain accessibility with sufficient color contrast
- Images within cards should use object-fit: cover for consistent sizing
- Ensure all colored backgrounds meet WCAG contrast requirements for text
- Use web-safe fonts with proper fallback stacks
- Optimize textures and images for web (WebP format, compressed)
- Hard-coded drop shadows perform better than CSS box-shadow blur
