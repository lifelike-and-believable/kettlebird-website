# Kettlebird Creations - Technical Architecture Document

## Executive Summary

This document defines the technical implementation approach for Star Goldberg's portfolio website, incorporating modern web technologies to create an animated, performant, and maintainable artist portfolio.

---

## Visual Design: Hand-Drawn Textured Paper Aesthetic

### Design Philosophy

The website design reflects Star Goldberg's distinctive artistic style: **inky, crunchy, chaotic quality** with **UPA-style influences** (flat colors, geometric shapes, mid-century modern aesthetics) presented on a **hand-drawn, textured paper** substrate.

### Core Visual Elements

**1. Textured Paper Background**

Multiple layers of paper texture create depth and authenticity:

```css
/* Base paper texture layer */
body {
  background-color: #f5f1e8; /* Warm off-white paper color */
  background-image: 
    url('/textures/paper-grain.png'),
    url('/textures/paper-subtle.png');
  background-blend-mode: multiply, normal;
  background-size: 400px 400px, cover;
}

/* Alternative: CSS-generated paper texture (lightweight, no image needed) */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  z-index: -1;
  /* Simplified pattern for better performance */
  background-image: 
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px);
  pointer-events: none;
  /* Note: For better performance, consider using a small repeating background image instead */
}
```

**Paper Texture Sources:**
- [Subtle Patterns](https://www.toptal.com/designers/subtlepatterns/) - Free seamless textures
- [TextureKing](https://www.textureking.com/) - High-quality paper scans
- Custom scanned watercolor paper or sketch paper

**2. Hand-Drawn Borders and Elements**

Use SVG for crisp, scalable hand-drawn elements:

```html
<!-- Hand-drawn border SVG -->
<svg class="hand-drawn-border" viewBox="0 0 100 100" preserveAspectRatio="none">
  <path 
    d="M 0,50 Q 25,48 50,50 T 100,50" 
    stroke="currentColor" 
    stroke-width="2" 
    fill="none"
    stroke-linecap="round"
    style="
      filter: url(#roughen);
      vector-effect: non-scaling-stroke;
    "
  />
  <!-- Roughen filter for organic look -->
  <filter id="roughen">
    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
  </filter>
</svg>
```

**CSS for Hand-Drawn Button:**

```css
.btn-hand-drawn {
  position: relative;
  background: #f5f1e8;
  border: none;
  padding: 1rem 2rem;
  font-family: 'Caveat', 'Indie Flower', cursive;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn-hand-drawn::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: none;
  border: 3px solid currentColor;
  /* Irregular border-radius values create hand-drawn appearance */
  border-radius: 
    255px 15px 225px 15px / 
    15px 225px 15px 255px;
  filter: url(#roughen);
  pointer-events: none;
}

.btn-hand-drawn:hover {
  transform: translate(-2px, -2px);
}

.btn-hand-drawn:hover::before {
  transform: translate(2px, 2px);
}
```

**3. UPA-Style Color Palette**

Inspired by 1950s United Productions of America animation:

```css
:root {
  /* Primary Colors - Flat, geometric, mid-century */
  --color-primary: #d95d39;      /* Burnt orange */
  --color-secondary: #f4a261;    /* Warm yellow-orange */
  --color-accent-1: #2a9d8f;     /* Teal */
  --color-accent-2: #e76f51;     /* Coral */
  --color-accent-3: #264653;     /* Dark blue-green */
  
  /* Paper & Texture Colors */
  --color-paper: #f5f1e8;        /* Warm off-white */
  --color-paper-dark: #e8e3d8;   /* Darker paper edge */
  --color-ink: #2b2b2b;          /* Near-black for text */
  --color-ink-light: #595959;    /* Light ink for secondary text */
  
  /* Accent Colors - Chaotic energy */
  --color-splash-1: #e63946;     /* Red ink splatter */
  --color-splash-2: #06ffa5;     /* Bright green */
  --color-splash-3: #ffbe0b;     /* Bright yellow */
  
  /* Shadow & Depth */
  --shadow-paper: 2px 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-paper-hover: 4px 8px 16px rgba(0, 0, 0, 0.2);
}
```

**4. Organic, Hand-Drawn Typography**

```css
/* Primary Typography */
:root {
  --font-heading: 'Caveat', 'Indie Flower', 'Patrick Hand', cursive;
  --font-body: 'Cabin Sketch', 'Permanent Marker', sans-serif;
  --font-clean: 'DM Sans', 'Inter', system-ui, sans-serif; /* For readability */
}

/* Headings with sketchy underline */
h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 700;
  position: relative;
  display: inline-block;
}

h1::after, h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, 
    transparent 0%, 
    currentColor 5%, 
    currentColor 95%, 
    transparent 100%
  );
  filter: url(#roughen);
  opacity: 0.6;
}

/* Body text - keep readable */
body {
  font-family: var(--font-clean);
  color: var(--color-ink);
  line-height: 1.7;
}

/* Special decorative text */
.hand-drawn-text {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--color-primary);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}
```

**Recommended Fonts:**
- **Headings:** [Caveat](https://fonts.google.com/specimen/Caveat), [Indie Flower](https://fonts.google.com/specimen/Indie+Flower), [Patrick Hand](https://fonts.google.com/specimen/Patrick+Hand)
- **Body (readable):** [DM Sans](https://fonts.google.com/specimen/DM+Sans), [Inter](https://fonts.google.com/specimen/Inter)
- **Decorative:** [Permanent Marker](https://fonts.google.com/specimen/Permanent+Marker), [Cabin Sketch](https://fonts.google.com/specimen/Cabin+Sketch)

**5. Ink Splatter & Brush Stroke Accents**

```css
/* Ink splatter decoration */
.ink-splatter {
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle at 30% 30%,
    var(--color-splash-1) 0%,
    var(--color-splash-1) 20%,
    transparent 20%
  ),
  radial-gradient(
    circle at 70% 40%,
    var(--color-splash-1) 0%,
    var(--color-splash-1) 15%,
    transparent 15%
  ),
  radial-gradient(
    circle at 50% 60%,
    var(--color-splash-1) 0%,
    var(--color-splash-1) 25%,
    transparent 25%
  );
  opacity: 0.3;
  filter: blur(1px);
  pointer-events: none;
}

/* Brush stroke divider */
.brush-divider {
  width: 100%;
  height: 8px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-primary) 10%,
    var(--color-primary) 90%,
    transparent 100%
  );
  position: relative;
  margin: 3rem 0;
}

.brush-divider::before,
.brush-divider::after {
  content: '';
  position: absolute;
  height: 100%;
  width: 50%;
  background: inherit;
  transform: skewX(-2deg);
  filter: url(#roughen);
}

.brush-divider::after {
  right: 0;
  transform: skewX(2deg);
}
```

**6. Paper Card/Section Styling**

```css
/* Paper card with torn edges */
.paper-card {
  background: var(--color-paper);
  padding: 2rem;
  margin: 2rem 0;
  position: relative;
  box-shadow: var(--shadow-paper);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.paper-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid var(--color-ink);
  border-radius: 
    3% 97% 2% 98% / 
    97% 3% 98% 2%;
  filter: url(#roughen);
  pointer-events: none;
}

.paper-card:hover {
  transform: translateY(-4px) rotate(0.5deg);
  box-shadow: var(--shadow-paper-hover);
}

/* Torn paper edge effect */
.torn-edge {
  position: relative;
}

.torn-edge::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 10px;
  background: 
    linear-gradient(135deg, transparent 33.33%, var(--color-paper-dark) 33.33%, var(--color-paper-dark) 66.66%, transparent 66.66%),
    linear-gradient(45deg, transparent 33.33%, var(--color-paper) 33.33%, var(--color-paper) 66.66%, transparent 66.66%);
  background-size: 8px 20px;
  background-position: 0 0, 4px 0;
}
```

**7. SVG Filter Library**

Essential filters for hand-drawn aesthetic:

```html
<svg style="position: absolute; width: 0; height: 0;">
  <defs>
    <!-- Roughen/sketchy effect -->
    <filter id="roughen">
      <feTurbulence 
        type="fractalNoise" 
        baseFrequency="0.05" 
        numOctaves="2" 
        result="noise"
      />
      <feDisplacementMap 
        in="SourceGraphic" 
        in2="noise" 
        scale="3" 
        xChannelSelector="R" 
        yChannelSelector="G"
      />
    </filter>
    
    <!-- Ink bleed effect -->
    <filter id="ink-bleed">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
      <feColorMatrix in="blur" type="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 18 -7
      " result="sharpen"/>
      <feComposite in="SourceGraphic" in2="sharpen" operator="atop"/>
    </filter>
    
    <!-- Grainy texture overlay -->
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
      <feColorMatrix type="saturate" values="0"/>
      <feBlend mode="multiply" in2="SourceGraphic" />
    </filter>
    
    <!-- Watercolor edge -->
    <filter id="watercolor">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="turb" />
      <feDisplacementMap in="blur" in2="turb" scale="5" />
    </filter>
  </defs>
</svg>
```

**8. Animated Hand-Drawn Elements**

```css
/* Animated drawing line effect */
@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}

.line-animation {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-line 2s ease-out forwards;
}

/* Ink splatter fade-in */
@keyframes splatter-in {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-10deg);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    opacity: 0.3;
    transform: scale(1) rotate(0deg);
  }
}

.ink-splatter-animated {
  animation: splatter-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Paper floating effect */
@keyframes float-paper {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(1deg);
  }
}

.floating-paper {
  animation: float-paper 6s ease-in-out infinite;
}
```

**9. Gallery/Portfolio Hand-Drawn Frames**

```css
/* Polaroid-style frames with sketchy border */
.portfolio-item {
  background: var(--color-paper);
  padding: 1rem;
  padding-bottom: 3rem;
  position: relative;
  box-shadow: var(--shadow-paper);
  transition: all 0.3s ease;
}

.portfolio-item::before {
  content: '';
  position: absolute;
  inset: 5px;
  border: 3px solid var(--color-ink);
  border-radius: 
    5% 95% 3% 97% / 
    95% 5% 97% 3%;
  filter: url(#roughen);
  pointer-events: none;
}

.portfolio-item:hover {
  transform: rotate(-1deg) translateY(-8px);
  box-shadow: var(--shadow-paper-hover);
}

/* Tape accent on corners */
.portfolio-item::after {
  content: '';
  position: absolute;
  top: -10px;
  right: 20px;
  width: 60px;
  height: 25px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transform: rotate(5deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

**10. Loading States with Hand-Drawn Aesthetic**

```css
/* Sketchy spinner */
.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid transparent;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  filter: url(#roughen);
  position: relative;
}

.loading-spinner::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border: 4px solid transparent;
  border-top-color: var(--color-accent-1);
  border-radius: 50%;
  animation: spin 1.5s linear infinite reverse;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Loading paper with ink spreading */
.loading-paper {
  width: 200px;
  height: 200px;
  background: var(--color-paper);
  position: relative;
  overflow: hidden;
}

.loading-paper::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: var(--color-ink);
  border-radius: 50%;
  animation: ink-spread 2s ease-out infinite;
}

@keyframes ink-spread {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(20);
    opacity: 0;
  }
}
```

### Implementation Strategy

**Phase 1: Base Texture Layer**
1. Add paper texture background to body
2. Implement CSS custom properties for color palette
3. Load hand-drawn fonts from Google Fonts

**Phase 2: Hand-Drawn Elements**
4. Create SVG filter library
5. Style buttons and interactive elements with sketchy borders
6. Add hand-drawn underlines to headings

**Phase 3: Component Styling**
7. Apply paper card styling to sections
8. Create portfolio frames with Polaroid aesthetic
9. Add ink splatter accents strategically

**Phase 4: Animation & Polish**
10. Implement animated line drawing effects
11. Add floating paper fragments
12. Create loading states with hand-drawn spinners

### Accessibility Considerations

**Texture & Contrast:**
- Ensure text contrast ratio meets WCAG AA (4.5:1)
- Paper texture opacity kept low (15-20%) to not interfere with readability
- Provide high contrast mode that removes textures

**Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  .floating-paper,
  .ink-splatter-animated,
  .line-animation {
    animation: none !important;
  }
  
  .portfolio-item:hover {
    transform: none;
  }
}
```

**Focus States:**
```css
:focus-visible {
  outline: 3px solid var(--color-accent-1);
  outline-offset: 4px;
  border-radius: 4px;
  filter: url(#roughen);
}
```

### Performance Optimization

**Texture Files:**
- Use optimized PNG (< 50KB) or SVG for paper textures
- Serve WebP with PNG fallback
- Lazy load decorative ink splatters below fold

**SVG Filters:**
- Apply filters sparingly (performance cost)
- Use `will-change` for animated elements
- Disable filters on mobile if performance issues

**CSS Properties:**
```css
/* Optimize animated elements */
.animated-element {
  will-change: transform;
  transform: translateZ(0); /* Hardware acceleration */
}
```

---

## Artist Profile & Requirements

### About Star Goldberg

- **Name:** Star Goldberg (they/them)
- **Age:** 22 years old
- **Location:** Canada
- **Profession:** Writer & Illustrator
- **Career Goal:** Graphic Novelist
- **Email:** kettlebirdillustration@gmail.com

### Artistic Style & Content

**Illustration Characteristics:**
- Character-focused work with expressive poses and dynamic compositions
- Versatile range: digital painting to stylized, cartoony approaches
- UPA style influence (flat colors, geometric shapes, mid-century modern aesthetics)
- Inky, crunchy, chaotic quality achieved through digital brush techniques
- Subject matter: fantasy characters (orcs, tieflings, elves), fanart (X-Men's Nightcrawler, TMNT, Murderbot), original characters (vampires, spies)

**Content Categories:**
1. **Commission Work** - DnD characters, fantasy illustrations, portraits
2. **Fanart** - Multiple fandoms including X-Men, TMNT, Murderbot
3. **Original Characters** - Character designs, reference sheets
4. **Comics** - Fancomics and original projects (e.g., "Carapace" - TMNT fanfic)
5. **Written Works** - Fiction available on Archive of Our Own
6. **Work-in-Progress Content** - Sketches, studies, process documentation

**Existing Taxonomy:**
- `#kettlebird art`
- `#kettlebird doodles`
- `#kettlebird wips`
- `#kettlebird commissions`

**Content Rating:** SFW primarily, occasional horror content

---

## Technology Stack

### Core Framework: Astro 4.x

**Selection Rationale:**
- **Built-in View Transitions** - Native page transitions since v3.0 with `<ViewTransitions />` component
- **Zero-JavaScript by Default** - Critical for image-heavy portfolio performance
- **Islands Architecture** - Add React components only where needed for interactivity
- **Built-in Image Optimization** - `<Image />` component with automatic optimization, lazy loading, responsive images
- **SEO-Friendly** - Static generation with excellent Core Web Vitals scores

**Animation Capabilities:**
- Fade, slide, and custom page transitions via `transition:animate` directive
- Element-specific morphing with `transition:name` for smooth gallery-to-detail transitions
- Minimal configuration compared to Next.js (requires Framer Motion) or Nuxt (experimental)

### Content Management: Sanity CMS

**Selection Rationale:**
- **Superior Image Pipeline** - Built-in CDN with on-demand transformations (resize, crop, WebP/AVIF)
- **Hotspot & Crop** - Visual UI for focal point selection, critical for art galleries
- **Custom Image Metadata** - Support for x, y, width, height coordinates for comic panel navigation
- **Palette Extraction** - Automatic dominant color extraction for dynamic theming
- **Artist-Friendly Interface** - Intuitive content editing for non-technical users

**Pricing:** Free tier (2 users, 10GB bandwidth, 500K API requests/month) sufficient for indie artist

**Alternative Considered:** TinaCMS offers better live visual editing but has 100MB file cap and no image CDN

### React Components & Animation

**Libraries:**
- **Framer Motion** - Complex animations, radial menu, layout transitions
- **@spaceymonk/react-radial-menu** - Nested submenu support and built-in animations
- **panzoom** - Smooth programmatic zoom/pan for comic panel navigation
- **react-pageflip** - 3D page-turning effects for written works (18,850+ weekly downloads)
- **react-photoswipe-gallery** - PhotoSwipe v5 integration for image lightbox

### Hosting & Deployment

**Platform:** Vercel or Netlify
- Free tier sufficient for portfolio needs
- Automatic deployments from Git
- Edge network for global performance
- Built-in SSL/HTTPS

### Additional Services

- **Payment Processing:** Ko-fi (existing account, 5% fee or 0% with $12/month Gold)
- **Commission Forms:** Google Forms (free, familiar, file upload support)
- **Queue Management:** Trello board or Notion page (public embed)
- **Analytics:** Plausible or Simple Analytics (privacy-friendly)

---

## Content Schema Design (Sanity)

### Gallery Item Schema

```javascript
{
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // Enable focal point selection
        metadata: ['palette', 'lqip'] // Extract colors and low-quality placeholder
      }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Commission', value: 'commission'},
          {title: 'Fanart', value: 'fanart'},
          {title: 'Original Character', value: 'original'},
          {title: 'Work in Progress', value: 'wip'},
          {title: 'Featured', value: 'featured'}
        ]
      }
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'date',
      title: 'Date Created',
      type: 'date'
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Display in featured section on homepage'
    }
  ]
}
```

### Comic Series Schema

```javascript
{
  name: 'comicSeries',
  title: 'Comic Series',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Original', value: 'original'},
          {title: 'Fancomic', value: 'fancomic'}
        ]
      }
    },
    {
      name: 'pages',
      title: 'Pages',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'comicPage'}]}]
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['ongoing', 'complete', 'hiatus']
      }
    }
  ]
}
```

### Comic Page Schema

```javascript
{
  name: 'comicPage',
  title: 'Comic Page',
  type: 'document',
  fields: [
    {
      name: 'pageNumber',
      title: 'Page Number',
      type: 'number',
      validation: Rule => Rule.required().positive().integer()
    },
    {
      name: 'image',
      title: 'Page Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'panels',
      title: 'Panels',
      type: 'array',
      description: 'Define panel coordinates for frame-by-frame reading',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'panelNumber',
            title: 'Panel Number',
            type: 'number'
          },
          {
            name: 'x',
            title: 'X Position (%)',
            type: 'number',
            description: 'Horizontal position as percentage'
          },
          {
            name: 'y',
            title: 'Y Position (%)',
            type: 'number',
            description: 'Vertical position as percentage'
          },
          {
            name: 'width',
            title: 'Width (%)',
            type: 'number',
            description: 'Panel width as percentage'
          },
          {
            name: 'height',
            title: 'Height (%)',
            type: 'number',
            description: 'Panel height as percentage'
          }
        ]
      }]
    },
    {
      name: 'altText',
      title: 'Alt Text',
      type: 'text',
      description: 'Accessibility description'
    }
  ]
}
```

### Written Work Schema

```javascript
{
  name: 'writtenWork',
  title: 'Written Work',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {type: 'block'}, // Rich text
        {type: 'image'}  // Embedded images
      ]
    },
    {
      name: 'genre',
      title: 'Genre',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'externalLink',
      title: 'External Link (AO3, etc.)',
      type: 'url'
    },
    {
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date'
    }
  ]
}
```

### Commission Type Schema

```javascript
{
  name: 'commissionType',
  title: 'Commission Type',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      description: 'e.g., "$10-30" or "$40-80"'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'exampleImages',
      title: 'Example Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}]
    },
    {
      name: 'deliveryTime',
      title: 'Estimated Delivery Time',
      type: 'string'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number'
    }
  ]
}
```

---

## Feature Implementation Specifications

### 1. Comic Reader with Frame-by-Frame Navigation

**Architecture:**
- Store panel coordinates (x, y, width, height as percentages) in Sanity
- Use **panzoom** library for smooth programmatic zoom/pan
- Navigate sequentially through panels with keyboard/touch controls

**Implementation Pattern:**

```javascript
import Panzoom from '@panzoom/panzoom';
import { useState, useEffect, useRef } from 'react';

const ComicReader = ({ comicPage }) => {
  const [currentPanel, setCurrentPanel] = useState(0);
  const imageRef = useRef(null);
  const panzoomRef = useRef(null);
  
  useEffect(() => {
    if (imageRef.current) {
      panzoomRef.current = Panzoom(imageRef.current, {
        maxScale: 3,
        minScale: 1,
        animate: true,
        duration: 300
      });
    }
  }, []);
  
  const navigateToPanel = (panelIndex) => {
    const panel = comicPage.panels[panelIndex];
    if (!panel || !panzoomRef.current) return;
    
    // Calculate zoom factor to fit panel
    const containerWidth = imageRef.current.parentElement.offsetWidth;
    const containerHeight = imageRef.current.parentElement.offsetHeight;
    const panelWidthPx = (panel.width / 100) * imageRef.current.naturalWidth;
    const panelHeightPx = (panel.height / 100) * imageRef.current.naturalHeight;
    
    const zoomX = containerWidth / panelWidthPx;
    const zoomY = containerHeight / panelHeightPx;
    const zoom = Math.min(zoomX, zoomY) * 0.9; // 90% to leave margins
    
    // Calculate focal point
    const x = (panel.x / 100) * imageRef.current.naturalWidth;
    const y = (panel.y / 100) * imageRef.current.naturalHeight;
    
    panzoomRef.current.zoomToPoint(zoom, { x, y });
    setCurrentPanel(panelIndex);
  };
  
  const nextPanel = () => {
    if (currentPanel < comicPage.panels.length - 1) {
      navigateToPanel(currentPanel + 1);
    }
  };
  
  const prevPanel = () => {
    if (currentPanel > 0) {
      navigateToPanel(currentPanel - 1);
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      imageRef.current.parentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  
  const exitReader = () => {
    // Navigate back or close reader
    window.history.back();
  };
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextPanel();
      if (e.key === 'ArrowLeft') prevPanel();
      if (e.key === 'f') toggleFullscreen();
      if (e.key === 'Escape') exitReader();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPanel]);
  
  return (
    <div className="comic-reader">
      <img ref={imageRef} src={comicPage.image.url} alt={comicPage.altText} />
      <div className="controls">
        <button onClick={prevPanel} disabled={currentPanel === 0}>
          Previous Panel
        </button>
        <span>{currentPanel + 1} / {comicPage.panels.length}</span>
        <button onClick={nextPanel} disabled={currentPanel === comicPage.panels.length - 1}>
          Next Panel
        </button>
      </div>
    </div>
  );
};
```

**Reading Modes:**
1. **Guided Panel View** - Automatic zooming through panels
2. **Traditional Page View** - Click/tap to advance pages
3. **Vertical Scroll** - Webtoon-style for mobile (long-strip comics)

**Keyboard Controls:**
- Arrow Left/Right: Previous/next panel
- Spacebar: Next panel
- Page Up/Down: Previous/next page
- F: Toggle fullscreen
- Escape: Exit reader

**Touch Gestures:**
- Swipe left/right: Navigate panels
- Pinch: Manual zoom
- Double-tap: Reset zoom

### 2. Page-Flip Interface for Written Works

**Library:** react-pageflip (wrapper for StPageFlip)

**Implementation:**

```javascript
import HTMLFlipBook from 'react-pageflip';

const WrittenWorkReader = ({ pages }) => {
  return (
    <HTMLFlipBook
      width={550}
      height={733}
      size="stretch"
      minWidth={315}
      maxWidth={1000}
      minHeight={400}
      maxHeight={1533}
      maxShadowOpacity={0.5}
      showCover={true}
      mobileScrollSupport={true}
      className="flip-book"
    >
      {pages.map((page, index) => (
        <div key={index} className="page">
          <div className="page-content">
            {page.content}
          </div>
          <div className="page-number">{index + 1}</div>
        </div>
      ))}
    </HTMLFlipBook>
  );
};
```

**Features:**
- Realistic 3D page-turning animation
- Touch/swipe support for mobile
- Configurable flip duration and shadow
- Cover page handling
- Automatic page numbering

**Accessibility:**
- Toggle button to switch to plain scroll view
- Screen reader friendly alternative mode
- Keyboard navigation (arrow keys, Page Up/Down)

### 3. Radial Navigation Menu

**Implementation using CSS Trigonometry:**

```css
.radial-menu {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.radial-menu__item {
  --angle: calc(var(--index) * (360deg / var(--total-items)));
  --radius: 200px;
  
  position: absolute;
  transform: 
    translateX(calc(cos(var(--angle)) * var(--radius)))
    translateY(calc(sin(var(--angle) * -1) * var(--radius)));
  
  transition: transform 0.3s ease, opacity 0.3s ease;
  transition-delay: calc(var(--index) * 0.05s); /* Staggered animation */
}

.radial-menu:not(.is-open) .radial-menu__item {
  transform: translate(0, 0);
  opacity: 0;
}

/* Accessibility - Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .radial-menu__item {
    transition: none;
  }
}
```

**React Implementation with Framer Motion:**

```javascript
import { motion, AnimatePresence } from 'framer-motion';

const RadialMenu = ({ isOpen, items }) => {
  const totalItems = items.length;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="radial-menu"
          role="menu"
          aria-label="Main navigation"
        >
          {items.map((item, index) => {
            const angle = (index / totalItems) * 2 * Math.PI;
            const radius = 200;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <motion.a
                key={item.id}
                href={item.href}
                className="radial-menu__item"
                role="menuitem"
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ x, y, opacity: 1 }}
                exit={{ x: 0, y: 0, opacity: 0 }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: 'easeOut'
                }}
              >
                {item.label}
              </motion.a>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

**Menu Items (5-7 maximum):**
1. Home
2. Portfolio/Gallery
3. Comics
4. Writing
5. Commissions
6. About
7. Contact

**Animated Transformation to Navbar:**
Use Framer Motion's `layoutId` to morph radial menu items into horizontal navbar:

```javascript
const MenuItem = ({ item, isRadial }) => (
  <motion.a
    layoutId={`nav-${item.id}`}
    href={item.href}
    className={isRadial ? 'radial-item' : 'navbar-item'}
  >
    {item.label}
  </motion.a>
);
```

**Accessibility:**
- `role="menu"` and `role="menuitem"` ARIA attributes
- 44x44px minimum touch targets
- Keyboard navigation (Tab, Enter, Escape)
- `aria-expanded` state on toggle button
- Focus trap when menu open
- Skip to content link

### 4. Gallery with Animated Transitions

**Shared Element Transitions:**

```javascript
// Gallery Grid
<motion.div layoutId={`image-${item.id}`}>
  <img src={item.thumbnail} alt={item.title} />
</motion.div>

// Detail Page
<motion.div layoutId={`image-${item.id}`}>
  <img src={item.fullSize} alt={item.title} />
</motion.div>
```

**PhotoSwipe Lightbox Integration:**

```javascript
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';

const GalleryGrid = ({ items }) => (
  <Gallery>
    <div className="gallery-grid">
      {items.map(item => (
        <Item
          original={item.fullSize}
          thumbnail={item.thumbnail}
          width={item.width}
          height={item.height}
          key={item.id}
        >
          {({ ref, open }) => (
            <img ref={ref} onClick={open} src={item.thumbnail} alt={item.title} />
          )}
        </Item>
      ))}
    </div>
  </Gallery>
);
```

**Filtering:**

```javascript
const [activeCategory, setActiveCategory] = useState('all');
const filteredItems = items.filter(
  item => activeCategory === 'all' || item.category.includes(activeCategory)
);
```

### 5. Commission System Integration

**Ko-fi Integration:**

```html
<!-- Ko-fi Button Widget -->
<script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'></script>
<script>
  kofiWidgetOverlay.draw('kettlebirdart', {
    'type': 'floating-chat',
    'floating-chat.donateButton.text': 'Commission Me',
    'floating-chat.donateButton.background-color': '#00b9fe',
    'floating-chat.donateButton.text-color': '#fff'
  });
</script>
```

**Custom Commission Page Structure:**

```
/commissions
├── Status Banner (Open/Closed/Waitlist)
├── Price Sheet
│   ├── Icons: $10-30
│   ├── Portraits: $20-50
│   ├── Half-body: $40-80
│   ├── Full-body: $60-150+
│   └── Comic Pages: $170-400+
├── Modifiers
│   ├── Additional Characters: +$X
│   ├── Complex Background: +$X
│   └── Commercial License: +200-300%
├── Will/Won't Draw
├── Process Timeline
├── Terms of Service
├── Portfolio Examples
└── Request Form / Ko-fi Link
```

**Google Forms Integration:**

```html
<iframe 
  src="https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true" 
  width="640" 
  height="1200" 
  frameborder="0" 
  marginheight="0" 
  marginwidth="0"
>
  Loading…
</iframe>
```

**Queue Visibility (Trello Embed):**

```html
<iframe 
  src="https://trello.com/b/BOARD_ID.html" 
  width="100%" 
  height="600"
  frameborder="0"
>
</iframe>
```

---

## Performance Optimization

### Image Optimization Strategy

**Sanity Image Pipeline:**

```javascript
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

// Usage examples
const thumbnail = urlFor(image)
  .width(400)
  .height(400)
  .format('webp')
  .quality(80)
  .url();

const optimized = urlFor(image)
  .width(1920)
  .format('webp')
  .quality(85)
  .auto('format') // Automatic format selection
  .url();
```

**Responsive Images:**

```javascript
const srcset = [400, 800, 1200, 1600]
  .map(width => `${urlFor(image).width(width).url()} ${width}w`)
  .join(', ');
```

**Lazy Loading:**

```javascript
<img 
  src={thumbnail} 
  loading="lazy"
  decoding="async"
  alt={altText}
/>
```

### Performance Targets

**Core Web Vitals:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Lighthouse Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

**Image Guidelines:**
- Thumbnail size: < 100KB
- Full-size images: < 500KB
- Format: WebP with JPG/PNG fallback
- Lazy load below fold
- Use blur-up placeholders (LQIP from Sanity)

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

**Keyboard Navigation:**
- All interactive elements accessible via Tab
- Logical focus order
- Visible focus indicators
- Escape key closes modals/menus
- Arrow keys for gallery/comic navigation

**Screen Reader Support:**
- Semantic HTML structure
- ARIA labels for all controls
- Alt text for all images (detailed descriptions)
- Heading hierarchy (h1-h6)
- Skip to content link
- Live regions for dynamic content updates

**Visual Accessibility:**
- Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Text resizable up to 200% without loss of functionality
- Focus indicators (minimum 2px solid outline)
- No content conveyed by color alone

**Motion Accessibility:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Alternative Navigation:**
- Provide "View as List" option for galleries
- Offer scroll mode for page-flip reader
- Skip panel navigation option for comics

---

## Security Considerations

### Content Security Policy

```
Content-Security-Policy: 
  default-src 'self';
  img-src 'self' https://cdn.sanity.io https://ko-fi.com;
  script-src 'self' 'unsafe-inline' https://storage.ko-fi.com;
  style-src 'self' 'unsafe-inline';
  frame-src https://docs.google.com https://trello.com;
```

### Form Security

- **Google Forms** - Built-in spam protection
- **reCAPTCHA v3** - For custom forms (invisible, score-based)
- **Honeypot Fields** - Hidden fields to catch bots
- **Rate Limiting** - Prevent form abuse

### Payment Security

- **Ko-fi Handles PCI Compliance** - No card data on site
- **HTTPS/SSL** - Mandatory for all pages
- **Secure Headers** - HSTS, X-Content-Type-Options, X-Frame-Options

---

## Deployment Strategy

### Hosting: Vercel (Recommended)

**Advantages:**
- Automatic Astro optimization
- Edge network for global performance
- Automatic SSL certificates
- Git-based deployments
- Generous free tier

**Configuration (vercel.json):**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Environment Variables

```
SANITY_PROJECT_ID=xxx
SANITY_DATASET=production
SANITY_TOKEN=xxx (for mutations)
GOOGLE_ANALYTICS_ID=xxx (optional)
```

### Build Process

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod
```

---

## Maintenance & Updates

### Content Update Workflow

1. **Artist logs into Sanity Studio** (kettlebirdart.sanity.studio)
2. **Adds new content** (artwork, comic pages, writing)
3. **Site automatically rebuilds** via webhook trigger
4. **Changes live within minutes**

### Regular Maintenance Tasks

**Weekly:**
- Check commission form submissions
- Update commission status/queue

**Monthly:**
- Review analytics for popular content
- Optimize slow-loading images
- Check for broken links

**Quarterly:**
- Update dependencies (npm audit)
- Review and respond to accessibility feedback
- Backup Sanity content

---

## Cost Analysis

### Free Tier Services

- **Sanity CMS:** Free (2 users, 10GB bandwidth, 500K API requests/month)
- **Vercel Hosting:** Free (100GB bandwidth, unlimited sites)
- **Google Forms:** Free
- **Trello:** Free (unlimited boards, 10 boards per workspace)

### Paid Services (Optional)

- **Ko-fi Gold:** $12/month (0% platform fees vs. 5% on free)
- **Custom Domain:** $10-15/year (Google Domains, Namecheap)
- **Sanity Growth:** $15/user/month (if needed for scheduling/collaboration)

**Total Estimated Monthly Cost:** $12-27/month (domain + Ko-fi Gold)

---

## Success Metrics

### Technical Metrics

- Lighthouse Performance Score > 90
- Core Web Vitals in "Good" range
- Zero critical accessibility issues
- < 3 second page load time
- 99.9% uptime

### User Engagement Metrics

- Average session duration
- Pages per session
- Gallery/comic engagement rate
- Commission form submission rate
- Return visitor rate

### Content Metrics

- Number of portfolio items published
- Comics uploaded and viewed
- Written works engagement
- Commission requests received

---

## Future Enhancements (Post-Launch)

### Phase 2 Possibilities

1. **Interactive Canvas Experiment** - WebGL animated background
2. **Art Process Videos** - Time-lapse integration with YouTube
3. **Newsletter Signup** - Email list building with Mailchimp/ConvertKit
4. **Client Portal** - Password-protected area for commission WIPs
5. **Shop Integration** - Physical merchandise with Printful/Printify
6. **Blog/News Section** - Updates and behind-the-scenes content
7. **Social Media Feed** - Embedded Instagram/Tumblr posts
8. **Guestbook/Comments** - Community engagement features

---

## Appendix

### Useful Resources

**Documentation:**
- [Astro Documentation](https://docs.astro.build)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [PhotoSwipe Documentation](https://photoswipe.com/documentation/)

**Tools:**
- [Squoosh](https://squoosh.app) - Image compression
- [WAVE](https://wave.webaim.org) - Accessibility testing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing

**Inspiration:**
- [Awwwards - Portfolio Sites](https://www.awwwards.com/websites/portfolio/)
- [Behance - Artist Portfolios](https://www.behance.net)

---

## Document Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-24 | 1.0 | Initial technical architecture document | Project Manager Agent |
