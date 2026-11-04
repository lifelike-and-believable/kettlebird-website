import { defineArrayMember, defineType } from 'sanity';

// A story's or a chapter's text: paragraphs with italic and bold, and scene breaks
// (docs/specs/story-reader-editor.md AC-3; design-story-reader, What Star enters).
export const sceneBreak = defineType({
  name: 'sceneBreak',
  title: 'Scene break',
  type: 'object',
  fields: [{ name: 'style', title: 'Style', type: 'string', hidden: true }],
  preview: { prepare: () => ({ title: 'Scene break' }) },
});

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
  ],
});
