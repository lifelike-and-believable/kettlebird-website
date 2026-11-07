import { defineField, defineType } from 'sanity';
import { StoryTextInput } from '../../components/StoryTextInput';
import { chapterLabel } from '../../lib/comic-pages';
import { ITEM_NAMES } from '../../lib/editor-content';
import { CHAPTER_TEXT_HELP } from '../../lib/word/messages';
import { TEXT_UPLOAD_FIELD } from '../../lib/word/schema';
import { CHAPTER_TEXT_MESSAGE, duplicateStoryChapterMessage } from '../../lib/stories';

// A chapter of a story (docs/specs/story-reader-editor.md AC-6; design-story-reader, What Star enters).
export default defineType({
  name: 'storyChapter',
  title: ITEM_NAMES.storyChapter,
  type: 'document',
  fields: [
    defineField({
      name: 'story',
      title: 'Story',
      type: 'reference',
      to: [{ type: 'writtenWork' }],
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'number',
      title: 'Chapter',
      type: 'number',
      description: 'The chapter number: 1, 2, 3… Changing a published number changes the links people have shared.',
      validation: (Rule) => [
        Rule.required().integer().min(1),
        Rule.custom(async (value, context) => {
          const story = (context.document?.story as { _ref?: string } | undefined)?._ref;
          if (typeof value !== 'number' || !story || !context.document) return true;
          const id = context.document._id.replace(/^drafts\./, '');
          const others = await context
            .getClient({ apiVersion: '2024-01-01' })
            .fetch<number[]>(
              `*[_type == "storyChapter" && story._ref == $story && !(_id in [$id, $draft])].number`,
              { story, id, draft: `drafts.${id}` },
              { perspective: 'raw' },
            );
          return duplicateStoryChapterMessage(value, others) ?? true;
        }),
      ],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: "Just the name, for example Over the Ridge. The site adds 'Chapter 2' for you.",
    }),
    defineField({
      name: 'content',
      title: 'Text',
      type: 'storyText',
      description: CHAPTER_TEXT_HELP,
      components: { input: StoryTextInput },
      validation: (Rule) => Rule.custom((value) => (Array.isArray(value) && value.length > 0 ? true : CHAPTER_TEXT_MESSAGE)),
    }),
    // The last upload: its file, when, the note and what Undo puts back (story-import-word AC-3).
    defineField(TEXT_UPLOAD_FIELD),
    defineField({
      name: 'publishDate',
      title: 'Date posted',
      type: 'date',
      description: 'Filled in when you first publish the chapter, if empty.',
    }),
  ],
  orderings: [{ title: 'Chapter', name: 'number', by: [{ field: 'number', direction: 'asc' }] }],
  preview: {
    select: { number: 'number', title: 'title', story: 'story.title' },
    prepare: ({ number, title, story }) => ({ title: chapterLabel({ number: Number(number ?? 0), title }), subtitle: story }),
  },
});
