import { defineArrayMember, defineField, defineType } from 'sanity';

// A chapter of a comic series and its pages, in reading order.
// Design: docs/design/comic-start-reading.md ("What Star enters"). Bulk upload and publish status
// come with story-comic-reader-publish-pages.
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
      validation: (Rule) => Rule.required().integer().min(0),
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
      of: [
        defineArrayMember({
          type: 'image',
          fields: [
            defineField({
              name: 'altText',
              title: 'Alt text',
              type: 'text',
              rows: 2,
              description: 'What happens on this page, for people using screen readers.',
              validation: (Rule) =>
                Rule.custom((value) =>
                  value && String(value).trim()
                    ? true
                    : { message: 'Add alt text so people using screen readers can follow the story', level: 'warning' },
                ),
            }),
            defineField({
              name: 'panels',
              title: 'Panels',
              type: 'array',
              description: 'Panel regions in reading order, for panel-by-panel reading (filled in later).',
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
