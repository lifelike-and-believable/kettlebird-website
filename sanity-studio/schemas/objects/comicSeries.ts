import { defineField, defineType } from 'sanity';
import { ChaptersList } from '../../components/ChaptersList';
import { MissingSummary } from '../../components/MissingSummary';
import { SERIES_SLUG_MESSAGE } from '../../lib/comic-pages';
import { fieldText, ITEM_NAMES, listDetail, requiredMessage, SERIES_KIND, SERIES_STATUS } from '../../lib/editor-content';

// A comic series. Labels and help: design-organised-editor (Comics); the chapters list and Add
// chapter: design-comic-publish-pages.
export default defineType({
  name: 'comicSeries',
  title: ITEM_NAMES.comicSeries,
  type: 'document',
  components: { input: MissingSummary },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      ...fieldText('comicSeries', 'title'),
      validation: (Rule) => Rule.required().error(requiredMessage('comicSeries', 'title')),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      ...fieldText('comicSeries', 'slug'),
      options: { source: 'title', maxLength: 120 },
      validation: (Rule) => Rule.required().error(SERIES_SLUG_MESSAGE),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      ...fieldText('comicSeries', 'coverImage'),
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      type: 'text',
      ...fieldText('comicSeries', 'description'),
    }),
    defineField({
      name: 'status',
      type: 'string',
      ...fieldText('comicSeries', 'status'),
      options: { list: SERIES_STATUS },
    }),
    defineField({
      name: 'type',
      type: 'string',
      ...fieldText('comicSeries', 'type'),
      options: { list: SERIES_KIND },
    }),
    // Not stored: shows this series' chapters and Add chapter (comic-publish-pages AC-11).
    defineField({
      name: 'chapters',
      type: 'string',
      ...fieldText('comicSeries', 'chapters'),
      readOnly: true,
      components: { input: ChaptersList },
    }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', status: 'status' },
    prepare: ({ title, media, status }) => ({ title, media, subtitle: listDetail('comicSeries', { status }) }),
  },
});
