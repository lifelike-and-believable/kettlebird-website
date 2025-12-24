# Kettlebird Creations Documentation

This directory contains comprehensive planning and technical documentation for Star Goldberg's portfolio website.

## 📋 Planning Documents

### [PROJECT_PLAN.md](PROJECT_PLAN.md)
**Comprehensive project roadmap with 9 milestone phases**

Complete project plan covering all aspects of the Kettlebird Creations website development, including:
- 13-week phased implementation timeline
- Detailed task breakdowns for each milestone
- Acceptance criteria and feedback checkpoints
- Risk management and success metrics
- Stakeholder communication plan

**Key Milestones:**
1. **Foundation & Planning** (Weeks 1-2) - Setup Astro + Sanity
2. **Design & Branding** (Week 2) - Hand-drawn textured paper aesthetic
3. **Portfolio/Gallery** (Week 3) - Image gallery with filtering
4. **Comic Reader** (Week 4) - Frame-by-frame navigation
5. **Written Works Reader** (Week 5) - Page-flip interface
6. **Commerce Section** (Week 6) - Merchandise shop
7. **Commission System** (Week 7) - Request forms and queue
8. **Core Pages & Content** (Week 8) - About, contact, navigation
9. **Interactivity & Enhancement** (Week 9) - Animations, radial menu
10. **Content Integration** (Week 10) - Upload all artwork and content
11. **QA & Testing** (Weeks 11-12) - Cross-browser, accessibility
12. **Deployment & Launch** (Week 13) - Go live!
13. **Post-Launch Iteration** (Ongoing) - Monitor and improve

---

### [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)
**Detailed technical specifications and implementation guide**

In-depth technical documentation covering:

**Technology Stack:**
- **Framework:** Astro 5.x with React Islands
- **CMS:** Sanity (superior image handling, panel coordinates)
- **Animation:** Framer Motion, CSS View Transitions, panzoom
- **Hosting:** Vercel/Netlify

**Visual Design System:**
- Hand-drawn textured paper aesthetic
- UPA-style flat colors and mid-century modern influences
- Inky, crunchy, chaotic quality reflecting Star's art style
- SVG filters (roughen, ink bleed, watercolor effects)
- Hand-drawn typography and sketchy borders
- Ink splatter and brush stroke accents
- Paper card styling with torn edges

**Feature Implementations:**
- **Comic Reader:** Frame-by-frame panel navigation with panzoom
- **Page Flip Reader:** 3D book-turning for written works
- **Radial Navigation:** CSS trigonometry + Framer Motion
- **Gallery:** PhotoSwipe v5 with filtering
- **Commerce:** Ko-fi integration for payments
- **Commissions:** Google Forms + Trello queue

**Performance & Accessibility:**
- Core Web Vitals optimization
- WCAG 2.1 AA compliance
- Image optimization pipeline via Sanity CDN
- Reduced motion support

---

### [STYLE_GUIDE.md](STYLE_GUIDE.md)
**Approved milestone 2 brand system**

- UPA-inspired palette and contrast pairs
- Typography hierarchy (Caveat/Patrick Hand + DM Sans) with fluid scaling
- Paper textures, hand-drawn borders, splatter accents, motion rules
- Component treatments for buttons, pills, cards, lightbox, and focus states

---

### [CONTENT_STRATEGY.md](CONTENT_STRATEGY.md)
**Content organization and migration plan**

Comprehensive content management strategy including:

**Content Categories:**
- Portfolio/Gallery (Featured, Commissions, Fanart, Original Characters, WIPs)
- Comics (Original and Fancomics with panel mapping)
- Written Works (Fiction, Fanfiction, Samples)
- Merchandise/Shop (Prints, Stickers, Digital Downloads)
- Commission Information (Types, Pricing, Terms, FAQ)

**Migration Strategy:**
- Content audit from Tumblr, Ko-fi, Bluesky, AO3
- Asset preparation and optimization workflow
- Metadata collection templates
- Sanity CMS population process
- Priority content roadmap

**Ongoing Management:**
- Weekly content review and updates
- Monthly content refresh and SEO optimization
- Quarterly portfolio audits
- Content quality standards and guidelines
- Tagging best practices
- Content calendar templates

---

### [DEVELOPMENT.md](DEVELOPMENT.md)
**Developer setup and workflow guide**

Updated for Astro + React + Sanity workflows (Milestone 1).

### [WIREFRAMES.md](WIREFRAMES.md)
**Initial layout sketches for milestone 1**

Paper-style wireframes for home, portfolio, comics, writing, and shop/commissions.

---

## 🎨 About the Project

**Artist:** Star Goldberg (they/them)  
**Location:** Canada  
**Age:** 22  
**Profession:** Writer & Illustrator  
**Career Goal:** Graphic Novelist

**Artistic Style:**
- Character-focused illustrations with expressive poses
- UPA-style influences (flat colors, geometric shapes)
- Inky, crunchy, chaotic digital brush techniques
- Subjects: Fantasy characters, fanart, original characters

**Online Presence:**
- **Tumblr:** https://kettle-bird.tumblr.com/
- **Ko-fi:** https://ko-fi.com/kettlebirdart
- **Bluesky:** https://bsky.app/profile/kettlebird.bsky.social

---

## 🚀 Quick Start

### For Stakeholders (Star Goldberg)

1. **Review the Project Plan** - Understand timeline and milestones
2. **Review Visual Design** - Ensure hand-drawn aesthetic matches your style
3. **Review Content Strategy** - Prepare content for migration
4. **Provide Feedback** - At each milestone checkpoint

### For Developers

1. **Read Technical Architecture** - Understand stack and implementation details
2. **Set Up Development Environment** - Follow DEVELOPMENT.md
3. **Review Sanity Schemas** - Understand content structure
4. **Implement by Milestone** - Follow phased approach in PROJECT_PLAN.md

---

## 📊 Project Status

**Current Phase:** Design & Branding (Milestone 2)  
**Status:** ✅ Visual system approved (palette, typography, texture kit, branding notes)

**Completed:**
- [x] Project plan with 9 milestones
- [x] Technical architecture document
- [x] Visual design system defined (palette, typography, texture, motion)
- [x] Content strategy documented
- [x] Hand-drawn aesthetic specifications + style guide
- [x] Astro project scaffolded with React integration
- [x] Sanity Studio schemas created
- [x] Initial wireframes captured
- [x] Milestone 2 design/branding assets locked

**Next Steps:**
- [ ] Implement gallery and comic reader components with new tokens
- [ ] Wire Sanity content and start content seeding
- [ ] Hook CI/CD previews once hosting is connected

---

## 🎯 Key Features

### Core Functionality
- ✨ **Portfolio Gallery** - Filterable image grid with lightbox
- 📖 **Comic Reader** - Frame-by-frame panel navigation
- 📚 **Written Works** - Page-flip book interface
- 🛍️ **Merchandise Shop** - Ko-fi integration
- 🎨 **Commission System** - Request forms and queue

### Visual Design
- 📄 **Textured Paper Background** - Hand-drawn aesthetic
- 🖊️ **Sketchy UI Elements** - Organic borders and buttons
- 🎨 **UPA-Style Colors** - Flat, geometric palette
- 💫 **Ink Splatter Accents** - Decorative flourishes
- ✏️ **Hand-Drawn Typography** - Caveat, Indie Flower fonts

### Technical Excellence
- ⚡ **Fast Performance** - Astro static generation
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 📱 **Responsive** - Mobile-first design
- 🔒 **Secure** - SSL, secure payments via Ko-fi
- 🎭 **Animated** - Smooth transitions and interactions

---

## 📝 Document Quick Reference

| Document | Purpose | Audience |
|----------|---------|----------|
| **PROJECT_PLAN.md** | Overall project roadmap and milestones | All stakeholders |
| **TECHNICAL_ARCHITECTURE.md** | Technical implementation details | Developers |
| **CONTENT_STRATEGY.md** | Content organization and migration | Content managers, Star |
| **DEVELOPMENT.md** | Setup and development workflow | Developers |
| **README.md** | This overview document | Everyone |

---

## 🤝 Contributing

This is a private project for Star Goldberg. All development follows the milestones and specifications outlined in the planning documents.

---

## 📧 Contact

**Project Owner:** Star Goldberg  
**Email:** kettlebirdillustration@gmail.com

---

## 📄 License

See the [LICENSE](../LICENSE) file in the root directory for details.

---

*Last Updated: 2025-12-24*
