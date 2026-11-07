import { defineArrayMember, defineType } from 'sanity';
import { STORY_PICTURE_TYPE } from '../../lib/word/schema';

// A story's or a chapter's text: paragraphs with italic and bold, scene breaks, and pictures from Word documents
// (docs/specs/story-reader-editor.md AC-3; docs/specs/story-import-word.md AC-3).
export const sceneBreak = defineType({
  name: 'sceneBreak',
  title: 'Scene break',
  type: 'object',
  fields: [{ name: 'style', title: 'Style', type: 'string', hidden: true }],
  preview: { prepare: () => ({ title: 'Scene break' }) },
});

export const storyPicture = defineType(STORY_PICTURE_TYPE);

export default defineType({
  name: 'storyText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      marks: { decorators: [{ title: 'Italic', value: 'em' }, { title: 'Bold', value: 'strong' }], annotations: [] },
    }),
    defineArrayMember({ type: 'sceneBreak', name: 'sceneBreak', title: 'Scene break' }),
    defineArrayMember({ type: 'storyPicture', name: 'storyPicture', title: 'Picture' }),
  ],
});
