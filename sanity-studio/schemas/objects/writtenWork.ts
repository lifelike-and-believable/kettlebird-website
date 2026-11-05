import { defineField, defineType } from 'sanity';
import { MissingSummary } from '../../components/MissingSummary';
import { ChaptersList } from '../../components/ChaptersList';
import { StoryTextInput } from '../../components/StoryTextInput';
import { fieldText, ITEM_NAMES, listDetail, requiredMessage } from '../../lib/editor-content';
import { storyNeedsIn } from '../../lib/story-checks';
import { RATING_MESSAGE, RATINGS, STATUSES, WEB_ADDRESS_MESSAGE } from '../../lib/stories';

// A story (Writing). Labels and help: design-story-reader (What Star enters);
// docs/specs/story-reader-editor.md AC-1, AC-2, AC-6 to AC-8. `slug` and `content` keep their
// stored names, so anything already entered stays.
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
      name: 'slug',
      type: 'slug',
      ...fieldText('writtenWork', 'slug'),
      options: { source: 'title', maxLength: 120 },
      // AC-2: needed once the story has text or chapters.
      validation: (Rule) =>
        Rule.custom(async (_value, context) => ((await storyNeedsIn(context)).includes(WEB_ADDRESS_MESSAGE) ? WEB_ADDRESS_MESSAGE : true)),
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
      name: 'rating',
      type: 'string',
      ...fieldText('writtenWork', 'rating'),
      options: { list: RATINGS, layout: 'radio' },
      validation: (Rule) =>
        Rule.custom(async (_value, context) => ((await storyNeedsIn(context)).includes(RATING_MESSAGE) ? RATING_MESSAGE : true)),
    }),
    defineField({
      name: 'contentNotes',
      type: 'text',
      rows: 2,
      ...fieldText('writtenWork', 'contentNotes'),
    }),
    defineField({
      name: 'status',
      type: 'string',
      ...fieldText('writtenWork', 'status'),
      options: { list: STATUSES, layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'content',
      type: 'storyText',
      ...fieldText('writtenWork', 'content'),
      // AC-8: replaced by a note once the story has chapters.
      components: { input: StoryTextInput },
    }),
    // Not stored: the story's chapters and Add chapter (AC-6, AC-7).
    defineField({
      name: 'chapters',
      type: 'string',
      ...fieldText('writtenWork', 'chapters'),
      readOnly: true,
      components: { input: ChaptersList },
    }),
    defineField({
      name: 'publishDate',
      type: 'date',
      ...fieldText('writtenWork', 'publishDate'),
    }),
    defineField({
      name: 'externalLink',
      type: 'url',
      ...fieldText('writtenWork', 'externalLink'),
    }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', publishDate: 'publishDate' },
    prepare: ({ title, media, publishDate }) => ({ title, media, subtitle: listDetail('writtenWork', { publishDate }) }),
  },
});
