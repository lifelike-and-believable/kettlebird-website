import { defineField, defineType, type SlugValidationContext } from 'sanity';
import { MissingSummary } from '../../components/MissingSummary';
import { GridSizeInput, SectionInput, subfolderSubtitle } from '../../components/SubfolderInputs';
import { FIELDS, fieldText, GRID_SIZES, ITEM_NAMES, listDetail, PORTFOLIO_SECTIONS, requiredMessage, sectionLocked, SUBFOLDER_ORDERS } from '../../lib/editor-content';

// A subfolder of a Portfolio section (Art, Subfolders). Spec: docs/specs/portfolio-folders.md AC-18, AC-19;
// design-portfolio-folders, What Star does in the editor (mock-up 7).
const API = { apiVersion: '2024-01-01' };
const publishedId = (id: string | undefined) => (id ?? '').replace(/^drafts\./, '');

/** Unique among subfolders in the same section (AC-18). */
async function isUnique(slug: string, context: SlugValidationContext): Promise<boolean> {
  const doc = context.document as { _id?: string; section?: string } | undefined;
  const id = publishedId(doc?._id);
  const count = await context.getClient(API).fetch<number>(
    'count(*[_type == "portfolioSubfolder" && slug.current == $slug && section == $section && !(_id in [$id, $draft])])',
    { slug, section: doc?.section ?? '', id, draft: `drafts.${id}` },
  );
  return count === 0;
}

export default defineType({
  name: 'portfolioSubfolder',
  title: ITEM_NAMES.portfolioSubfolder,
  type: 'document',
  components: { input: MissingSummary },
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      ...fieldText('portfolioSubfolder', 'name'),
      validation: (Rule) => Rule.required().error(requiredMessage('portfolioSubfolder', 'name')),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      ...fieldText('portfolioSubfolder', 'slug'),
      options: { source: 'name', maxLength: 80, isUnique },
      validation: (Rule) => Rule.required().error(requiredMessage('portfolioSubfolder', 'slug')),
    }),
    defineField({
      name: 'section',
      type: 'string',
      ...fieldText('portfolioSubfolder', 'section'),
      options: { list: PORTFOLIO_SECTIONS, layout: 'radio' },
      components: { input: SectionInput },
      validation: (Rule) => [
        Rule.required().error(requiredMessage('portfolioSubfolder', 'section')),
        // AC-19: set once published.
        Rule.custom(async (value, context) => {
          const id = publishedId((context.document as { _id?: string } | undefined)?._id);
          if (!id) return true;
          const published = await context.getClient(API).fetch<string | null>('*[_id == $id][0].section', { id }, { perspective: 'raw' });
          return sectionLocked(published ?? undefined, value as string | undefined) ? FIELDS.portfolioSubfolder.section.help : true;
        }),
      ],
    }),
    defineField({
      name: 'gridSize',
      type: 'number',
      ...fieldText('portfolioSubfolder', 'gridSize'),
      options: { list: GRID_SIZES, layout: 'radio', direction: 'horizontal' },
      initialValue: 2,
      components: { input: GridSizeInput },
    }),
    // portfolio-order AC-6.
    defineField({
      name: 'order',
      type: 'string',
      ...fieldText('portfolioSubfolder', 'order'),
      options: { list: SUBFOLDER_ORDERS, layout: 'radio', direction: 'horizontal' },
      initialValue: 'newest',
    }),
  ],
  preview: {
    select: { title: 'name', section: 'section', gridSize: 'gridSize', order: 'order', id: '_id' },
    // "Fan Work · 2 × 2 · 4 pieces" (AC-18); the count is read when the row shows.
    // PreviewValue types subtitle as a string; the list's preview also renders a component (PreviewProps).
    prepare: ({ title, section, gridSize, order, id }) => ({
      title,
      subtitle: subfolderSubtitle(id, section, (count) => listDetail('portfolioSubfolder', { section, gridSize, order, count })) as unknown as string,
    }),
  },
});
