# Kettlebird Creations - Content Strategy

## Executive Summary

This document outlines the content organization, migration strategy, and ongoing content management approach for Star Goldberg's portfolio website. The strategy leverages existing content from Tumblr, Ko-fi, and Bluesky while establishing a sustainable system for future updates.

---

## Content Inventory

### Existing Content Sources

**1. Tumblr: https://kettle-bird.tumblr.com/**
- Primary content repository with extensive artwork archive
- Existing taxonomy: `#kettlebird art`, `#kettlebird doodles`, `#kettlebird wips`, `#kettlebird commissions`
- Mixed content: illustrations, character designs, fanart, comics, text posts
- Rich metadata: tags, dates, captions

**2. Ko-fi: https://ko-fi.com/kettlebirdart**
- Commission examples and pricing
- Gallery of recent work
- Ko-fi shop listings (if any)
- Supporter/patron engagement

**3. Bluesky: https://bsky.app/profile/kettlebird.bsky.social**
- Recent work and WIPs
- Community engagement
- Real-time updates

**4. Archive of Our Own (AO3)**
- Written fiction works
- Fanfiction and original stories
- May include embedded artwork

---

## Content Categories & Organization

### 1. Portfolio/Gallery Section

**Primary Categories:**

1. **Featured Work** - Best 12-20 pieces showcasing range and skill
2. **Commissions** - Examples of commissioned work (with client permission)
3. **Fanart** - Fan artwork organized by fandom
4. **Original Characters** - Character designs and reference sheets
5. **Work in Progress** - Sketches, studies, process documentation

**Metadata Structure:**
```javascript
{
  title: "Artwork Title",
  date: "2024-01-15",
  category: ["fanart", "commissions"],
  fandom: "X-Men" (if applicable),
  medium: "digital painting",
  tools: "Procreate, iPad",
  description: "Description of the piece",
  process_notes: "Behind-the-scenes details",
  commission_type: "Full-body character" (if commission),
  featured: true/false,
  content_rating: "SFW" or "Mature" (horror content)
}
```

**Tagging Strategy:**
- **Character Types:** orc, tiefling, elf, vampire, spy, etc.
- **Fandoms:** X-Men, TMNT, Murderbot Diaries, etc.
- **Style:** UPA style, sketch, finished, experimental
- **Medium:** digital painting, ink, watercolor effect
- **Commission Status:** available, example, not available

### 2. Comics Section

**Organization:**

1. **Original Comics**
   - "Carapace" and other original series
   - Standalone comic pages/shorts

2. **Fancomics**
   - TMNT fancomics
   - Other fandom comics

**Comic Metadata:**
```javascript
{
  title: "Carapace",
  type: "fancomic",
  fandom: "TMNT",
  status: "ongoing" / "complete" / "hiatus",
  synopsis: "Brief description of the story",
  content_rating: "Teen",
  pages: [
    {
      pageNumber: 1,
      image: "url",
      panels: [
        { panelNumber: 1, x: 0, y: 0, width: 50, height: 50 },
        { panelNumber: 2, x: 50, y: 0, width: 50, height: 50 }
      ],
      altText: "Accessibility description of page content"
    }
  ],
  updateSchedule: "Monthly" (if applicable),
  lastUpdated: "2024-01-15"
}
```

**Panel Coordinate Mapping:**
- Document reading order (Western left-to-right, or manga right-to-left)
- Define panel boundaries as percentages for responsive scaling
- Include speech bubble positions for potential text overlay

### 3. Written Works Section

**Organization:**

1. **Fiction** - Short stories and longer works
2. **Fanfiction** - Archive of Our Own links or embedded content
3. **Writing Samples** - Excerpts for commission examples

**Written Work Metadata:**
```javascript
{
  title: "Story Title",
  type: "original fiction" / "fanfiction",
  fandom: "Fandom name" (if applicable),
  genre: ["fantasy", "romance", "horror"],
  wordCount: 5000,
  chapters: 3,
  status: "complete" / "ongoing",
  summary: "Brief synopsis",
  contentWarnings: ["violence", "horror themes"],
  externalLink: "https://archiveofourown.org/...",
  publishDate: "2024-01-15",
  coverArt: "url to cover image"
}
```

**Presentation Options:**
- **Full Text** - For original works hosted on site
- **Excerpt + Link** - For AO3 works, show first chapter with link to continue
- **Link Only** - For works better suited to their original platform

### 4. Merchandise/Shop Section

**Product Categories:**

1. **Prints** - Art prints of popular illustrations
2. **Stickers** - Character stickers, designs
3. **Digital Downloads** - Wallpapers, reference sheets
4. **Commissions** - Link to commission page

**Product Metadata:**
```javascript
{
  name: "Character Print - Orc Warrior",
  category: "prints",
  price: "$15.00",
  sizes: ["8x10", "11x14"],
  description: "High-quality print of...",
  images: ["main", "detail", "lifestyle"],
  inventory: 10 (if tracking),
  kofiLink: "https://ko-fi.com/...",
  tags: ["fantasy", "character art", "orc"]
}
```

**Ko-fi Integration Options:**
1. **Direct Link** - Button to Ko-fi shop for purchase
2. **Embed** - Ko-fi widget embedded on product pages
3. **Hybrid** - Product showcase on site, purchase through Ko-fi

### 5. Commission Information

**Content Sections:**

1. **Status Banner**
   ```
   COMMISSIONS: OPEN / CLOSED / WAITLIST ONLY
   Next Opening: [Date if known]
   Current Queue: X slots filled / Y total slots
   ```

2. **Commission Types & Pricing**
   - Icons/Avatars: $10-30
   - Bust/Portrait: $20-50
   - Half-body: $40-80
   - Full-body: $60-150+
   - Character Reference Sheet: $100-200+
   - Comic Pages: $170-400+ per page

3. **Add-ons & Modifiers**
   - Additional characters: +$X per character (50-75% of base price)
   - Complex background: +$20-100
   - Commercial use license: +200-300% of base price
   - Rush delivery: +50% (if offered)

4. **Examples Portfolio**
   - 3-5 examples per commission type
   - Before/after (sketch to final)
   - Client testimonials (with permission)

5. **Will/Won't Draw**
   ```
   ✓ WILL DRAW:
   - Fantasy characters (orcs, tieflings, elves, etc.)
   - D&D characters and reference sheets
   - Fan characters from approved fandoms
   - Original characters
   - SFW content primarily
   - Occasional horror content
   - Couples/ships
   
   ✗ WON'T DRAW:
   - NSFW/explicit content
   - Hateful or discriminatory content
   - Complex mecha/machinery
   - Realistic portraits from photos
   - [Other boundaries]
   ```

6. **Process & Timeline**
   ```
   1. Fill out commission form
   2. Review and quote (1-3 days)
   3. Invoice sent via Ko-fi
   4. Payment received
   5. Sketch approval (3-7 days)
   6. Revisions (if needed)
   7. Final artwork (7-14 days)
   8. Delivery via email
   
   Total timeline: 2-4 weeks on average
   ```

7. **Terms of Service**
   - Payment: 50% upfront, 50% on completion (or full upfront via Ko-fi)
   - Revisions: 2 major revisions included
   - Refund policy: Full refund before sketch, 50% after sketch, none after final
   - Usage rights: Personal use only unless commercial license purchased
   - Artist retains right to post artwork in portfolio
   - Client receives high-res file via email

8. **FAQ**
   - "How long will my commission take?"
   - "Can I request changes?"
   - "What if I'm not happy with the result?"
   - "Can I use this for my book cover/merch/etc.?"
   - "Do you offer payment plans?"

---

## Content Migration Strategy

### Phase 1: Content Audit (Week 1)

**Tasks:**
1. **Tumblr Archive Review**
   - Export Tumblr content using Tumblr's backup tool
   - Identify top 50-100 best pieces for initial migration
   - Categorize by type, quality, and relevance

2. **Ko-fi Content Extraction**
   - Download all commission examples
   - Document current pricing structure
   - Save testimonials/feedback

3. **Written Works Inventory**
   - List all AO3 works with metadata
   - Determine which to feature vs. link
   - Prepare excerpts if needed

4. **Quality Assessment**
   - Rate pieces: Featured / Portfolio / Archive only
   - Check image quality (minimum 1200px wide for portfolio)
   - Identify pieces needing re-scanning or photography

### Phase 2: Asset Preparation (Week 2-3)

**Image Optimization Workflow:**

```bash
# For each artwork:
1. Source file (highest resolution available)
2. Export full-size: 2400px longest edge, JPG/PNG
3. Convert to WebP: 
   - Full: 2400px, quality 85
   - Large: 1600px, quality 85
   - Medium: 1200px, quality 80
   - Thumbnail: 400x400, quality 75
4. Generate LQIP (Low Quality Image Placeholder) via Sanity
5. Extract dominant colors for loading state
```

**Tools:**
- **Squoosh** (https://squoosh.app) - Free web-based image optimization
- **ImageOptim** (Mac) - Batch image compression
- **Sanity CDN** - Will handle responsive images automatically

**File Naming Convention:**
```
[category]-[title-slug]-[year]-[version]
Examples:
- fanart-nightcrawler-xmen-2024-full.webp
- commission-orc-warrior-dnd-2023-thumb.webp
- original-vampire-spy-character-2024-full.webp
```

### Phase 3: Metadata Collection (Week 3-4)

**Spreadsheet Template for Content Tracking:**

| Filename | Title | Date | Category | Tags | Fandom | Medium | Description | Featured | Rating | Status |
|----------|-------|------|----------|------|--------|--------|-------------|----------|--------|--------|
| fanart-nightcrawler... | Nightcrawler Portrait | 2024-01 | fanart | x-men, character | X-Men | digital | ... | Yes | SFW | Ready |

**Metadata Checklist per Item:**
- [ ] Title (descriptive, searchable)
- [ ] Creation date
- [ ] Categories (1-3 max)
- [ ] Tags (5-10 relevant keywords)
- [ ] Description (2-3 sentences)
- [ ] Alt text for accessibility (detailed description)
- [ ] Content rating (SFW/Mature)
- [ ] Source/context (commission, personal work, fanart)
- [ ] Featured status (yes/no)

### Phase 4: CMS Population (Week 4-5)

**Sanity Studio Workflow:**

1. **Set up document templates** for each content type
2. **Bulk import** via Sanity's import tool (if large volume)
3. **Manual upload** for featured/priority content with careful metadata
4. **Review and preview** each item in Sanity Studio
5. **Tag and categorize** consistently
6. **Set publication status** (draft vs. published)

**Priority Order:**
1. Featured portfolio pieces (20-30 items)
2. Commission examples (15-20 items)
3. Latest comics (most recent pages)
4. About page content and bio
5. Commission pricing and terms
6. Remaining portfolio items
7. Archived work

---

## Ongoing Content Management

### Weekly Tasks

**Monday: Content Review**
- Check for new comments on commission form
- Review Ko-fi messages
- Update commission queue status

**Friday: New Content**
- Upload new artwork from the week
- Update WIP section
- Post social media updates about new content

### Monthly Tasks

**Content Refresh:**
- Rotate featured portfolio pieces
- Update commission availability status
- Review analytics for popular content
- Archive outdated WIPs

**SEO & Metadata:**
- Update meta descriptions
- Refresh alt text as needed
- Add new tags for discoverability

### Quarterly Tasks

**Portfolio Audit:**
- Remove outdated or lower-quality work
- Reorganize categories if needed
- Update commission pricing
- Refresh about/bio section

**Backup:**
- Export Sanity dataset
- Backup high-res source files
- Archive old content safely

---

## Content Guidelines & Best Practices

### Image Quality Standards

**Minimum Requirements:**
- Resolution: 1200px on longest edge
- File size: < 2MB before optimization (will be optimized to < 500KB)
- Format: JPG, PNG (will be converted to WebP)
- Color space: sRGB for web display

**Ideal:**
- Resolution: 2400px or higher
- Clean edges, no artifacts
- Proper exposure and color balance
- Consistent style within categories

### Writing Style Guide

**Artwork Descriptions:**
- Start with subject: "A portrait of..."
- Include context: commission, fanart, personal work
- Note technique: "Digital painting using..."
- Keep under 100 words

**Alt Text for Accessibility:**
- Describe visual elements in detail
- Include relevant character descriptions
- Note composition and mood
- Example: "A digital painting of a purple-skinned tiefling bard with curling horns, playing a lute. The character has a confident expression and is shown from the waist up against a warm golden background with magical sparkles."

**Tone:**
- Professional but personable
- Enthusiastic about the work
- Clear and concise
- Inclusive language

### Tagging Best Practices

**DO:**
- Use consistent terminology
- Tag with specific characters/franchises
- Include medium and style descriptors
- Add art type (portrait, full-body, etc.)

**DON'T:**
- Over-tag (5-10 tags max)
- Use redundant tags
- Create typo variations
- Use single-use tags

---

## Content Calendar Template

### Monthly Content Plan

**Week 1: Featured Work**
- Spotlight: [Title of featured artwork]
- Behind-the-scenes post about process
- Update: Latest commission completion

**Week 2: Comics Update**
- New comic page(s) published
- Comic progress update for subscribers
- Sneak peek at upcoming pages

**Week 3: Community Engagement**
- Fan art spotlight (if applicable)
- Commission testimonial feature
- WIP share and polls

**Week 4: Portfolio Refresh**
- Add new finished pieces
- Archive older work
- Update categories/organization

---

## Success Metrics

### Content Performance Tracking

**Engagement Metrics:**
- Most viewed portfolio items
- Most shared artwork on social media
- Popular categories and tags
- Comic readership/completion rates

**Commerce Metrics:**
- Commission form submissions
- Product page views
- Ko-fi click-through rate
- Conversion from visit to commission request

**SEO Metrics:**
- Organic search traffic
- Top search keywords
- Backlinks from other sites
- Social media referrals

---

## Appendix: Content Templates

### Portfolio Item Template

```markdown
# [Artwork Title]

**Category:** [Commission/Fanart/Original]
**Date:** [YYYY-MM-DD]
**Medium:** [Digital Painting/Ink/Mixed Media]

## Description
[2-3 sentence description of the artwork]

## Process Notes (Optional)
[Behind-the-scenes details about creating this piece]

## Tags
#character-design #fantasy #orc #commission

## Client Testimonial (if commission)
"[Quote from satisfied client]" - Client Name
```

### Comic Page Template

```markdown
# [Comic Title] - Page [Number]

**Series:** [Series Name]
**Type:** [Original/Fancomic]
**Posted:** [YYYY-MM-DD]

## Synopsis
[Brief chapter/page summary]

## Panel Breakdown
- Panel 1: [Description]
- Panel 2: [Description]
- Panel 3: [Description]

## Alt Text
[Detailed accessibility description of the page]

## Author's Note
[Optional commentary about this page]
```

### Commission Type Template

```markdown
# [Commission Type Name]

**Price Range:** $XX-XX
**Delivery Time:** [Timeframe]

## What's Included
- [Feature 1]
- [Feature 2]
- [Feature 3]

## Examples
[3-5 example images]

## Best For
[Description of ideal use case]
```

---

## Document Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-24 | 1.0 | Initial content strategy document | Project Manager Agent |
