import { defineArrayMember, defineField, defineType } from 'sanity';
import { PageItemNav } from '../../components/PageItemNav';
import { PagesInput } from '../../components/PagesInput';
import { altTextRule, duplicateChapterMessage } from '../../lib/comic-pages';

// A chapter of a comic series and its pages, in reading order.
// Design: docs/design/comic-start-reading.md ("What Star enters") and
// docs/design/comic-publish-pages.md (uploading, page panel, publish checks).
export default defineType({
  name: 'comicChapter',
  title: 'Chapter',
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
          components: { input: PageItemNav },
          // Pages without alt text are marked in the grid (design: "Missing alt text").
          preview: {
            select: { media: 'asset', altText: 'altText', filename: 'asset.originalFilename' },
            prepare: ({ media, altText, filename }) => ({
              media,
              title: filename,
              subtitle: altText && String(altText).trim() ? undefined : '⚠ Alt text',
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
