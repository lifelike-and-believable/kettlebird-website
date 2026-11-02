import { defineField, defineType } from 'sanity';
import { MissingSummary } from '../../components/MissingSummary';
import { fieldText, ITEM_NAMES, listDetail, requiredMessage } from '../../lib/editor-content';

// A story (Writing). Labels and help: design-organised-editor (Writing).
export default defineType({
  name: 'writtenWork',
  title: ITEM_NAMES.writtenWork,
  type: 'document',
  components: { input: MissingSummary },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      ...fieldText('writtenWork', 'title'),
      validation: (Rule) => Rule.required().error(requiredMessage('writtenWork', 'title')),
    }),
    defineField({
      name: 'externalLink',
      type: 'url',
      ...fieldText('writtenWork', 'externalLink'),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      ...fieldText('writtenWork', 'excerpt'),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      ...fieldText('writtenWork', 'coverImage'),
      options: { hotspot: true },
    }),
    defineField({
      name: 'genre',
      type: 'array',
      of: [{ type: 'string' }],
      ...fieldText('writtenWork', 'genre'),
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'publishDate',
      type: 'date',
      ...fieldText('writtenWork', 'publishDate'),
    }),
    // Hidden, values kept: the site doesn't show stories itself yet (the writing epic).
    defineField({
      name: 'slug',
      type: 'slug',
      hidden: true,
      options: { source: 'title', maxLength: 120 },
    }),
    defineField({
      name: 'content',
      type: 'array',
      hidden: true,
      of: [{ type: 'block' }, { type: 'image' }],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', publishDate: 'publishDate' },
    prepare: ({ title, media, publishDate }) => ({ title, media, subtitle: listDetail('writtenWork', { publishDate }) }),
  },
});
