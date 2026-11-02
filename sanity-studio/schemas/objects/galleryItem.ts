import { defineField, defineType } from 'sanity';
import { MissingSummary } from '../../components/MissingSummary';
import { altTextRule } from '../../lib/comic-pages';
import { fieldText, ITEM_NAMES, listDetail, PIECE_ALT_TEXT_WARNING, PORTFOLIO_SECTIONS, requiredMessage } from '../../lib/editor-content';

// A piece in the portfolio (Art). Labels and help: design-organised-editor (Art).
export default defineType({
  name: 'galleryItem',
  title: ITEM_NAMES.galleryItem,
  type: 'document',
  components: { input: MissingSummary },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      ...fieldText('galleryItem', 'title'),
      validation: (Rule) => Rule.required().error(requiredMessage('galleryItem', 'title')),
    }),
    defineField({
      name: 'image',
      type: 'image',
      ...fieldText('galleryItem', 'image'),
      options: { hotspot: true, metadata: ['palette', 'lqip'] },
      validation: (Rule) => Rule.required().error(requiredMessage('galleryItem', 'image')),
    }),
    defineField({
      name: 'altText',
      type: 'text',
      rows: 2,
      ...fieldText('galleryItem', 'altText'),
      // A warning, so Publish stays available.
      validation: (Rule) => [altTextRule(Rule, PIECE_ALT_TEXT_WARNING), Rule.max(240)],
    }),
    defineField({
      name: 'category',
      type: 'array',
      of: [{ type: 'string' }],
      ...fieldText('galleryItem', 'category'),
      options: { layout: 'grid', list: PORTFOLIO_SECTIONS },
      validation: (Rule) => Rule.required().min(1).error(requiredMessage('galleryItem', 'category')),
    }),
    defineField({
      name: 'description',
      type: 'text',
      ...fieldText('galleryItem', 'description'),
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      ...fieldText('galleryItem', 'tags'),
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'date',
      type: 'date',
      ...fieldText('galleryItem', 'date'),
    }),
    // Hidden, values kept: the portfolio has no page per piece, and the home page has no gallery.
    defineField({
      name: 'slug',
      type: 'slug',
      hidden: true,
      options: { source: 'title', maxLength: 120 },
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      hidden: true,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image', category: 'category' },
    prepare: ({ title, media, category }) => ({ title, media, subtitle: listDetail('galleryItem', { category }) }),
  },
});
