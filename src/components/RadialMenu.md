# RadialMenu Component

A visually stunning and accessible radial navigation menu built with React and Framer Motion.

## Features

✨ **Beautiful Design**
- Hand-drawn, paper-textured aesthetic matching the Kettlebird design system
- Smooth Framer Motion animations with staggered reveal
- Irregular border-radius for organic, artistic feel
- Custom hover effects with rotation

♿ **Accessible**
- Full keyboard navigation (Arrow keys, Home, End, Escape)
- ARIA roles and labels
- 44px minimum touch targets
- Focus indicators
- `prefers-reduced-motion` support
- High contrast mode support

🎯 **Performant**
- CSS trigonometric positioning (modern browsers)
- Optimized animations
- Efficient re-renders with proper React patterns

## Usage

### Basic Usage

```tsx
import RadialMenu from './components/RadialMenu';

function App() {
  return (
    <div>
      {/* Fixed position menu in bottom-right corner */}
      <RadialMenu />
    </div>
  );
}
```

### Custom Menu Items

```tsx
import RadialMenu from './components/RadialMenu';

const customItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
  { label: 'Profile', path: '/profile', icon: '👤' },
  { label: 'Logout', path: '/logout', icon: '🚪' },
];

function App() {
  return <RadialMenu items={customItems} radius={200} />;
}
```

### With Astro

```astro
---
import RadialMenu from '../components/RadialMenu';
---

<html>
  <body>
    <main>
      {/* Your content */}
    </main>
    
    {/* Add client:load to make it interactive */}
    <RadialMenu client:load />
  </body>
</html>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MenuItem[]` | Default nav items | Array of menu items to display |
| `radius` | `number` | `180` | Radius of the radial menu in pixels |
| `className` | `string` | `''` | Additional CSS class for styling |

### MenuItem Type

```typescript
interface MenuItem {
  label: string;   // Display text
  path: string;    // Navigation path/URL
  icon?: string;   // Optional emoji or icon character
}
```

## Default Menu Items

The component comes with these default navigation items:
1. Home (/)
2. Portfolio (/portfolio)
3. Comics (/comics)
4. Writing (/writing)
5. Commissions (/commissions)
6. About (/about)
7. Contact (/contact)

## Keyboard Navigation

- **Click/Tap toggle button** - Open/close menu
- **Escape** - Close menu and return focus to toggle
- **Arrow Right/Down** - Navigate to next menu item
- **Arrow Left/Up** - Navigate to previous menu item
- **Home** - Focus first menu item
- **End** - Focus last menu item
- **Enter** - Activate focused menu item

## Positioning Mathematics

The component uses trigonometric functions to position items in a perfect circle:

```javascript
// Items start at top (-90°) and distribute evenly
const angle = (-90 + (360 / totalItems) * index) * (Math.PI / 180);
const x = Math.cos(angle) * radius;
const y = Math.sin(angle) * radius;
```

## Customization

### Adjust Radius

```tsx
{/* Larger menu */}
<RadialMenu radius={240} />

{/* Smaller menu */}
<RadialMenu radius={140} />
```

### Custom Styling

Override CSS variables or add custom classes:

```css
/* Override colors */
.radial-menu .radial-menu__toggle {
  background-color: var(--color-accent-1);
}

/* Custom positioning */
.my-custom-menu {
  bottom: auto;
  top: 2rem;
  right: auto;
  left: 2rem;
}
```

## Browser Support

- Modern browsers with CSS `calc()`, `cos()`, `sin()` support
- Fallback: Component uses inline styles with calculated values
- Tested in: Chrome 111+, Firefox 108+, Safari 15.4+, Edge 111+

## Dependencies

- `react` ^18.3.1
- `react-dom` ^18.3.1
- `framer-motion` ^12.33.0

## Accessibility Notes

This component follows WCAG 2.1 AA guidelines:
- **Perceivable**: Clear visual indicators, sufficient color contrast
- **Operable**: Full keyboard support, 44px touch targets
- **Understandable**: Clear labels, consistent behavior
- **Robust**: Semantic HTML, proper ARIA attributes

## Performance Considerations

- Animations respect `prefers-reduced-motion`
- Component unmounts cleanly (no memory leaks)
- Event listeners properly cleaned up
- Optimized re-renders with proper React hooks

## License

MIT
