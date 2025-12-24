# Technical planning document for Kettlebird Creations portfolio

Star Goldberg’s portfolio website requires a sophisticated technical approach that balances creative, animated presentation with practical content management for a non-technical artist. This document synthesizes research across five key areas to inform a phased implementation strategy.

## The artist: Star Goldberg’s work and content needs

Star Goldberg (they/them) is a **22-year-old writer and illustrator based in Canada**  who aspires to work as a graphic novelist. Their Tumblr presence reveals a distinctive artistic identity with substantial content volume requiring thoughtful organization.

**Illustration style and aesthetic characteristics** include a versatile range spanning character-focused work with strong emphasis on expressive poses and dynamic compositions. Their work demonstrates facility with both digital painting and more stylized, cartoony approaches. They frequently reference “UPA style”  (United Productions of America—characterized by flat colors, geometric shapes, and mid-century modern aesthetics) and experiment with different brushes treating digital art like traditional work, achieving an inky, crunchy, chaotic quality. Subject matter gravitates toward fantasy characters (orcs, tieflings, elves), fanart (X-Men’s Nightcrawler, TMNT, Murderbot), and original characters including vampires and spies.

**Content categories requiring showcase** include commission work (DnD characters, fantasy illustrations, portraits), fanart across multiple fandoms, original character designs including reference sheets, comic work (both fancomics and original projects like “Carapace,” a TMNT fanfic with accompanying illustrations), writing samples (fiction on Archive of Our Own), and work-in-progress content. Tags like “#kettlebird art,” “#kettlebird doodles,” “#kettlebird wips,” and “#kettlebird commissions” suggest an existing organizational taxonomy that should inform the CMS structure.

**Branding elements present** include the “Kettlebird” name used consistently across platforms, professional email (kettlebirdillustration@gmail.com),  and active presence on Tumblr and Ko-fi. The commission sheet mentions “SFW primarily, occasional horror content.”  A kettlebird.com domain is referenced on their Ko-fi page. 

## Recommended CMS: Sanity for artist-grade image handling

After comparing Sanity, Strapi, Payload CMS, Directus, and TinaCMS across ease-of-use, image handling, custom content types, and pricing, **Sanity emerges as the clear recommendation** for this portfolio’s specific requirements.

**Why Sanity wins for comic portfolios**: Sanity’s image pipeline is unmatched for artist portfolios. Built-in CDN with on-demand transformations (resize, crop, WebP/AVIF conversion) eliminates the need for external services like Cloudinary. The **hotspot and crop** feature provides a visual UI for setting focal points—essential for art galleries where cropping decisions matter. Most critically for comic presentation, Sanity supports custom metadata fields on images including x, y, width, height coordinates, enabling the frame-by-frame navigation system described in the project requirements. Palette extraction automatically pulls dominant colors from uploaded artwork, potentially enabling dynamic theming.

**Content schema recommendations** for Sanity:

- **Gallery** type with image arrays, category tags, and metadata
- **ComicPage** type with image plus panel array containing `{x, y, width, height, panel_number}` coordinates
- **ComicSeries** type linking pages with navigation order and cover images
- **BlogPost/Story** type using Portable Text for rich content with embedded illustrations
- **Commission** type for pricing tiers, status, and example images

Sanity’s **free tier** (2 users, 10GB bandwidth, 500K API requests/month) covers indie artist needs comfortably. The Growth tier at $15/user/month adds scheduling and collaboration if needed later.

**TinaCMS as alternative**: If Star strongly prefers live visual editing (clicking directly on the website to make changes), TinaCMS offers the best-in-class experience with its real-time side-by-side preview. However, its Git-based image storage with 100MB file size cap and lack of image CDN make it less suitable for a high-resolution art portfolio.

## Frontend framework: Astro with React islands

For animated page transitions, image optimization, and static performance, **Astro is the optimal framework** for this portfolio.

**Astro’s decisive advantages** center on built-in View Transitions since version 3.0. Unlike Next.js (which requires Framer Motion and complex setup)  or Nuxt (with experimental support), Astro provides native page transitions with a single `<ViewTransitions />` component.  Zero-JavaScript by default  means the image-heavy portfolio loads fast, with JavaScript added only where needed through the “islands” architecture.  Built-in animations include fade, slide, and custom options via `transition:animate` directive.   The `transition:name` prop enables element-specific morphing— perfect for gallery thumbnail-to-detail-page transitions where an image smoothly expands from grid to full view.

**Animation implementation strategy** combines Astro View Transitions for page-to-page navigation, React components with Framer Motion for interactive elements (radial menu, comic reader), and CSS transitions for micro-interactions. The islands architecture allows embedding complex React components (comic reader, animated navigation) within an otherwise static, performant Astro site. 

**Image optimization** comes built-in with Astro’s `<Image />` component providing automatic optimization, lazy loading, and responsive image generation—essential for a portfolio showcasing high-resolution artwork.

## Comic reader implementation approach

The portfolio requires a custom comic reader supporting both traditional page-turning and modern frame-by-frame guided reading.

**Frame-by-frame navigation architecture** should use pre-defined panel coordinates stored in Sanity’s schema. Each comic page stores an image plus an array of panel objects with x, y, width, height (as percentages), and order number. The frontend uses **panzoom** library for smooth programmatic zoom/pan between panels. Navigation triggers animate the viewport to each panel sequentially, with keyboard support (arrow keys for panel/page navigation, F for fullscreen, Escape to exit).

**Implementation pattern for guided reading**:

```javascript
// Panel coordinates from CMS
const panels = [
  { x: 0, y: 0, width: 50, height: 50, order: 1 },
  { x: 50, y: 0, width: 50, height: 50, order: 2 }
];

// Animate to panel using panzoom
function navigateToPanel(panelIndex) {
  const panel = panels[panelIndex];
  panzoomInstance.zoomTo(panel.x, panel.y, calculateZoomFactor(panel));
}
```

**Page flip animations** for book/story view should use **react-pageflip** (wrapper for StPageFlip library), the most popular React solution with **18,850+ weekly downloads**.  Key features include realistic 3D page-turning effects, configurable flip time and shadow opacity, touch/swipe support, and cover page handling.  This creates an elegant presentation for longer-form written content or comic chapters.

**Alternative reading modes** to implement: vertical scroll (Webtoon-style) for mobile-optimized long-strip comics, traditional page view with click/tap navigation, and guided panel view with automatic zooming. Let users toggle between modes based on preference and content type.

## Commerce and commission system

Star already uses Ko-fi for commissions, which provides a proven foundation to build upon or integrate with.

**Recommended approach**: Keep Ko-fi for actual payment processing (leveraging their **5% platform fee or 0% with $12/month Gold**) while building a custom commission info page on the portfolio site. This preserves Ko-fi’s built-in commission management, dispute resolution, and payment protection while providing a more branded, detailed commission experience.

**Commission page structure** should include:

- **Status banner** prominently displaying Open/Closed/Waitlist status
- **Visual price sheet** showing examples at each tier (Icons $10-30, Portraits $20-50, Half-body $40-80, Full-body $60-150+, Comic pages $170-400+)
- **Modifiers section** listing +$X per additional character, complex background premiums, commercial use licensing (typically 200-300% of base price)
- **Will/Won’t draw** boundaries clearly stated
- **Process explanation** from inquiry through delivery
- **Embedded Ko-fi button** or link for actual purchasing

**Commission request form** using Google Forms (free, familiar, file upload support) embedded on the site, collecting: contact info, commission type selection, reference image uploads, description, deadline requirements, and TOS acknowledgment. Form submissions feed into a Google Sheet for tracking.

**Queue visibility**: Embed a public Trello board or Notion page showing commission queue status. Clients can see their position without asking, and it demonstrates professionalism to potential new clients. The **“Commission Queue for Artists” Trello template** provides ready-made columns for Requests → Payment → In Progress → Review → Complete.

**Alternative platform consideration**: If Star wants more integrated commission management, **Artistree.io** offers 100% free artist accounts (clients pay a small platform fee),  built-in workflow management, invoicing, and dispute resolution— potentially replacing both Ko-fi and manual form/tracking systems.

## UI/UX: Radial navigation and animated transitions

The creative navigation vision requires modern CSS techniques combined with React animation libraries.

**Radial menu implementation** should use CSS trigonometric functions (`sin()`, `cos()`) for positioning menu items in a circle—now fully supported across all modern browsers.  Una Kravets’ approach provides the cleanest implementation:  items positioned using `transform: translateX(calc(cos(var(--angle)) * var(--radius))) translateY(calc(sin(var(--angle) * -1) * var(--radius)))`. Add staggered `transition-delay` on nth-child selectors for sequential “flutter” reveal effect when the menu opens.  

For React integration, **@spaceymonk/react-radial-menu** provides nested submenu support and built-in animations.  The menu should have **5-7 items maximum**: Home, Portfolio/Gallery, Comics, Writing, Commissions, About, Contact.

**Animated menu-to-navbar transformation** uses Framer Motion’s `layout` and `layoutId` props. When transitioning from a splash/landing page to inner pages, menu items can smoothly animate from their radial positions to a horizontal navbar. This creates the “items moving to navbar” effect described in requirements.

**Gallery-to-detail shared element transitions**: When clicking a gallery thumbnail, use `layoutId` matching between the thumbnail and detail page hero image. Framer Motion automatically animates the image expanding from its grid position to full-width detail view—a signature portfolio interaction that feels polished and intentional.

**Accessibility requirements**: Include `role="menu"` and `role="menuitem"` ARIA attributes,  ensure 44x44px minimum touch targets,  provide keyboard navigation (Tab between items, Enter to select, Escape to close),  and implement `prefers-reduced-motion` media query support to disable animations for users who request it.

## Phased implementation roadmap

**Phase 1: Foundation (Weeks 1-2)**

- Set up Astro project with basic routing structure
- Configure Sanity CMS with initial schemas (Gallery, ComicPage, Commission)
- Implement basic responsive layout and typography
- Deploy to Vercel/Netlify for continuous deployment

**Phase 2: Content presentation (Weeks 3-4)**

- Build gallery grid with filtering by category
- Implement PhotoSwipe v5 lightbox for image viewing
- Create comic reader component with page navigation
- Add blog/writing section with Sanity rich text

**Phase 3: Advanced interactions (Weeks 5-6)**

- Implement frame-by-frame comic reading with panel coordinates
- Add react-pageflip for book/story view
- Build radial navigation menu with Framer Motion
- Implement View Transitions for page navigation

**Phase 4: Commerce and polish (Weeks 7-8)**

- Create commission info page with pricing tiers
- Integrate Google Form for commission requests
- Embed Ko-fi payment button
- Add public queue visibility (Trello/Notion embed)
- Final accessibility audit and performance optimization

**Technical dependencies summary**:

- **Framework**: Astro 4.x with React islands
- **CMS**: Sanity (sanity.io)
- **Animation**: Framer Motion, CSS View Transitions
- **Comic reader**: panzoom, react-pageflip
- **Gallery**: PhotoSwipe v5 via react-photoswipe-gallery
- **Payments**: Ko-fi integration (existing account)
- **Forms**: Google Forms embedded
- **Hosting**: Vercel or Netlify (free tier sufficient)

This architecture provides Star Goldberg with a visually distinctive, highly performant portfolio that showcases their illustration and writing work through engaging animated interactions while remaining maintainable by a non-technical artist through Sanity’s intuitive content management interface.
