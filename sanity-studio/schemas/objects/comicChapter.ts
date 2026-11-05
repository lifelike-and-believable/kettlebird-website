import { defineArrayMember, defineField, defineType } from 'sanity';
import { PageItemNav } from '../../components/PageItemNav';
import { PagesInput } from '../../components/PagesInput';
import { OpenOnInput } from '../../components/OpenOnInput';
import { PageGridItem, SpreadInput } from '../../components/SpreadInput';
import { altTextRule, duplicateChapterMessage, OPEN_ON_FIELD, pageGridSubtitle, SPREAD_FIELD } from '../../lib/comic-pages';
import { ITEM_NAMES } from '../../lib/editor-content';

// A chapter of a comic series and its pages, in reading order.
// Design: docs/design/comic-start-reading.md ("What Star enters") and
// docs/design/comic-publish-pages.md (uploading, page panel, publish checks).
export default defineType({
  name: 'comicChapter',
  title: ITEM_NAMES.comicChapter,
  type: 'document',
  fields: [
    defineField({
      name: 'series',
      title: 'Series',
      type: 'reference',
      to: [{ type: 'comicSeries' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'number',
      title: 'Chapter',
      type: 'number',
      description: 'The chapter number: 1, 2, 3… Use 0 for a prologue. Changing a published number changes the links people have shared.',
      validation: (Rule) => [
        Rule.required().integer().min(0),
        // AC-9: two chapters of one series can't share a number.
        Rule.custom(async (value, context) => {
          const series = (context.document?.series as { _ref?: string } | undefined)?._ref;
          if (typeof value !== 'number' || !series || !context.document) return true;
          const id = context.document._id.replace(/^drafts\./, '');
          const others = await context
            .getClient({ apiVersion: '2024-01-01' })
            .fetch<number[]>(
              `*[_type == "comicChapter" && series._ref == $series && !(_id in [$id, $draft])].number`,
              { series, id, draft: `drafts.${id}` },
              { perspective: 'raw' },
            );
          return duplicateChapterMessage(value, others) ?? true;
        }),
      ],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: "Just the name, for example The Long Road. The site adds 'Chapter 2' for you.",
    }),
    // Two-page spreads: how pages pair up on a wide screen (docs/specs/comic-reader-spread-and-flip.md AC-1).
    defineField({ ...OPEN_ON_FIELD, options: { ...OPEN_ON_FIELD.options, list: [...OPEN_ON_FIELD.options.list] }, components: { input: OpenOnInput } }),
    defineField({
      name: 'pages',
      title: 'Pages',
      type: 'array',
      description: 'In reading order. Upload the original files; the site shows them at screen size.',
      components: { input: PagesInput },
      options: { layout: 'grid' },
      of: [
        defineArrayMember({
          type: 'image',
          components: { input: PageItemNav, item: PageGridItem },
          // Pages without alt text are marked in the grid (design: "Missing alt text").
          preview: {
            select: { media: 'asset', altText: 'altText', spread: 'spread', filename: 'asset.originalFilename' },
            prepare: ({ media, altText, spread, filename }) => ({
              media,
              title: filename,
              subtitle: pageGridSubtitle({ spread: Boolean(spread), altText: altText ? String(altText) : undefined }),
            }),
          },
          fields: [
            defineField({
              name: 'altText',
              title: 'Alt text',
              type: 'text',
              rows: 2,
              description: 'What happens on this page, for people using screen readers.',
              // A warning, so Publish stays available (AC-8).
              validation: (Rule) => altTextRule(Rule),
            }),
            // The note about a page left alone, or the question about a wide picture, shows under it (PageItemNav).
            defineField({ ...SPREAD_FIELD, components: { input: SpreadInput } }),
            defineField({
              name: 'panels',
              title: 'Panels',
              type: 'array',
              description: 'Filled in automatically later.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'panel',
                  fields: [
                    { name: 'x', title: 'X (%)', type: 'number' },
                    { name: 'y', title: 'Y (%)', type: 'number' },
                    { name: 'width', title: 'Width (%)', type: 'number' },
                    { name: 'height', title: 'Height (%)', type: 'number' },
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  orderings: [{ title: 'Chapter', name: 'number', by: [{ field: 'number', direction: 'asc' }] }],
  preview: {
    select: { number: 'number', title: 'title', series: 'series.title' },
    prepare: ({ number, title, series }) => ({
      title: number === 0 ? title || 'Chapter 0' : title ? `Chapter ${number}: ${title}` : `Chapter ${number}`,
      subtitle: series,
    }),
  },
});
