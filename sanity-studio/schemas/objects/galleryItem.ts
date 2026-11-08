import { defineField, defineType } from 'sanity';
import { MissingSummary } from '../../components/MissingSummary';
import { PieceSubfoldersInput } from '../../components/SubfolderInputs';
import { altTextRule } from '../../lib/comic-pages';
import { fieldText, ITEM_NAMES, listDetail, PIECE_ALT_TEXT_WARNING, PORTFOLIO_SECTIONS, requiredMessage, subfolderProblems } from '../../lib/editor-content';

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
    // portfolio-folders AC-20: weak, so deleting a subfolder leaves its pieces loose (AC-22).
    defineField({
      name: 'subfolders',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'portfolioSubfolder' }], weak: true }],
      ...fieldText('galleryItem', 'subfolders'),
      components: { input: PieceSubfoldersInput },
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          const ids = ((value as { _ref?: string }[] | undefined) ?? []).map((r) => r._ref).filter(Boolean);
          if (!ids.length) return true;
          const categories = ((context.document as { category?: string[] } | undefined)?.category) ?? [];
          const chosen = await context.getClient({ apiVersion: '2024-01-01' }).fetch<{ name: string; section: string }[]>(
            '*[_id in $ids]{ name, section }', { ids },
          );
          // Subfolders in sections the piece no longer has go when it's published (AC-21), so only
          // the ones it keeps are checked here.
          return subfolderProblems(categories, chosen.filter((s) => categories.includes(s.section))) ?? true;
        }),
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
    // "Fan Work, Featured · Murderbot" (portfolio-folders AC-21): at most one subfolder per section.
    select: {
      title: 'title', media: 'image', category: 'category',
      s0: 'subfolders.0.name', s1: 'subfolders.1.name', s2: 'subfolders.2.name', s3: 'subfolders.3.name', s4: 'subfolders.4.name',
    },
    prepare: ({ title, media, category, s0, s1, s2, s3, s4 }) => ({
      title, media, subtitle: listDetail('galleryItem', { category, subfolderNames: [s0, s1, s2, s3, s4] }),
    }),
  },
});
