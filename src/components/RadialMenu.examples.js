/**
 * RadialMenu Component - Visual Feature Showcase
 * 
 * This file demonstrates all the visual and interactive features
 * of the RadialMenu component.
 */

// ============================================
// FEATURE 1: Basic Usage
// ============================================

import RadialMenu from '../components/RadialMenu';

// Default 7-item menu with standard navigation
<RadialMenu client:load />

// ============================================
// FEATURE 2: Custom Menu Items
// ============================================

const customItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Projects', path: '/projects', icon: '🚀' },
  { label: 'Team', path: '/team', icon: '👥' },
  { label: 'Analytics', path: '/analytics', icon: '📈' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
];

<RadialMenu items={customItems} client:load />

// ============================================
// FEATURE 3: Custom Radius
// ============================================

// Larger menu (240px radius)
<RadialMenu radius={240} client:load />

// Smaller menu (140px radius)
<RadialMenu radius={140} client:load />

// ============================================
// FEATURE 4: Positioning Mathematics
// ============================================

/**
 * Items are positioned using trigonometric functions:
 * 
 * Starting angle: -90° (top of circle)
 * Distribution: 360° / numberOfItems
 * 
 * For each item i:
 *   angle = (-90 + 360/n × i) × π/180
 *   x = cos(angle) × radius
 *   y = sin(angle) × radius
 * 
 * Example with 7 items:
 *   Item 0: -90° (top)
 *   Item 1: -38.57° (top-right)
 *   Item 2: 12.86° (right)
 *   Item 3: 64.29° (bottom-right)
 *   Item 4: 115.71° (bottom)
 *   Item 5: 167.14° (bottom-left)
 *   Item 6: 218.57° (left)
 */

// ============================================
// FEATURE 5: Keyboard Navigation
// ============================================

/**
 * Keyboard shortcuts:
 * 
 * - Click/Tap: Toggle menu open/close
 * - Escape: Close menu and return focus to toggle
 * - Arrow Right/Down: Navigate to next item
 * - Arrow Left/Up: Navigate to previous item
 * - Home: Jump to first item
 * - End: Jump to last item
 * - Tab: Sequential focus navigation
 * - Enter: Activate focused item
 */

// ============================================
// FEATURE 6: Animation Features
// ============================================

/**
 * Framer Motion animations:
 * 
 * 1. Container Animation:
 *    - Fade in/out (opacity: 0 → 1)
 *    - Scale in/out (scale: 0.8 → 1)
 *    - Duration: 0.3s (in), 0.2s (out)
 *    - Stagger children: 50ms delay
 * 
 * 2. Item Animation:
 *    - Fade in (opacity: 0 → 1)
 *    - Scale in (scale: 0 → 1)
 *    - Slide to position (x, y)
 *    - Duration: 0.4s
 *    - Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
 * 
 * 3. Hover Effect:
 *    - Scale up (1.15x)
 *    - Wiggle rotation: 0° → -5° → 5° → 0°
 *    - Duration: 0.3s
 * 
 * 4. Tap Effect:
 *    - Scale down (0.95x)
 * 
 * 5. Toggle Button:
 *    - Rotate 135° when open
 *    - Duration: 0.3s
 * 
 * 6. Reduced Motion:
 *    - All animations use 0s duration when prefers-reduced-motion is enabled
 */

// ============================================
// FEATURE 7: Accessibility Features
// ============================================

/**
 * WCAG 2.1 AA Compliant:
 * 
 * 1. ARIA Attributes:
 *    - role="menu" on container
 *    - role="menuitem" on each link
 *    - aria-expanded on toggle button
 *    - aria-label on toggle and container
 *    - aria-haspopup="menu" on toggle
 * 
 * 2. Keyboard Support:
 *    - Full arrow key navigation
 *    - Escape to close
 *    - Tab navigation
 *    - Focus trapping when open
 * 
 * 3. Focus Management:
 *    - Visible focus indicators (3px outline)
 *    - Focus returns to toggle on close
 *    - Focus-visible support
 * 
 * 4. Touch Targets:
 *    - Minimum 44px (WCAG 2.5.5 Level AAA)
 *    - Desktop: 56-64px
 *    - Mobile: 52-56px
 * 
 * 5. Motion Sensitivity:
 *    - Respects prefers-reduced-motion
 *    - Instant transitions when enabled
 * 
 * 6. Contrast:
 *    - High contrast mode support
 *    - Increased border width in high contrast
 */

// ============================================
// FEATURE 8: Design System Integration
// ============================================

/**
 * CSS Variables Used:
 * 
 * Colors:
 *   --color-primary: #d95d39 (toggle background)
 *   --color-secondary: #f4a261 (hover state)
 *   --color-accent-1: #2a9d8f (focus outline)
 *   --color-accent-2: #e76f51 (active state)
 *   --color-ink: #2b2b2b (borders, text)
 *   --color-paper: #f5f1e8 (item backgrounds)
 * 
 * Shadows:
 *   --shadow-paper: 2px 4px 8px rgba(0,0,0,0.15)
 *   --shadow-paper-hover: 4px 8px 16px rgba(0,0,0,0.2)
 * 
 * Fonts:
 *   Primary: 'Caveat', 'Patrick Hand' (labels)
 *   Body: 'DM Sans' (fallback)
 * 
 * Effects:
 *   - Irregular border-radius (hand-drawn feel)
 *   - Paper texture (repeating gradients)
 *   - Subtle patterns on items
 */

// ============================================
// FEATURE 9: Responsive Behavior
// ============================================

/**
 * Breakpoints:
 * 
 * Desktop (default):
 *   - Toggle: 64px × 64px
 *   - Items: 56px × 56px
 *   - Radius: 100% (as specified)
 *   - Position: bottom-right, 2rem margins
 * 
 * Tablet (≤768px):
 *   - Toggle: 56px × 56px
 *   - Items: 52px × 52px
 *   - Radius: 85% of specified
 *   - Position: bottom-right, 1.5rem margins
 * 
 * Mobile (≤480px):
 *   - Toggle: 56px × 56px (unchanged)
 *   - Items: 52px × 52px (unchanged)
 *   - Radius: 70% of specified
 *   - Position: bottom-right, 1rem margins
 */

// ============================================
// FEATURE 10: Performance Optimizations
// ============================================

/**
 * Optimizations:
 * 
 * 1. Event Listeners:
 *    - Properly cleaned up in useEffect
 *    - No memory leaks
 * 
 * 2. Re-renders:
 *    - Efficient useState usage
 *    - useRef for DOM references
 *    - Memoized position calculations
 * 
 * 3. Animations:
 *    - GPU-accelerated (transform, opacity)
 *    - No layout thrashing
 *    - Respects reduced motion
 * 
 * 4. Bundle Size:
 *    - Component: 125.80 kB (41.77 kB gzip)
 *    - CSS: 4.63 kB (1.24 kB gzip)
 *    - No additional dependencies needed
 */

// ============================================
// EXAMPLE: Real-world Integration
// ============================================

/**
 * In your Astro layout:
 */

/*
---
import RadialMenu from '../components/RadialMenu';
import '../styles/global.css';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Site</title>
  </head>
  <body>
    <main>
      <slot />
    </main>
    
    <!-- Fixed position radial menu -->
    <RadialMenu client:load />
  </body>
</html>
*/

// ============================================
// CUSTOMIZATION EXAMPLES
// ============================================

// Custom styling
<RadialMenu className="my-custom-menu" client:load />

// Then in your CSS:
/*
.my-custom-menu {
  bottom: auto;
  top: 2rem;
  right: auto;
  left: 2rem;
}

.my-custom-menu .radial-menu__toggle {
  background-color: var(--color-accent-1);
}
*/

// ============================================
// BROWSER COMPATIBILITY
// ============================================

/**
 * Supported Browsers:
 * 
 * ✅ Chrome 111+ (March 2023)
 * ✅ Firefox 108+ (December 2022)
 * ✅ Safari 15.4+ (March 2022)
 * ✅ Edge 111+ (March 2023)
 * 
 * Required Features:
 * - CSS calc() with trigonometric functions
 * - CSS custom properties
 * - ES2020+ JavaScript features
 * - Framer Motion support
 */
