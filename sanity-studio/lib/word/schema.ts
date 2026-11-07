// The schema parts for writing from Word documents (docs/specs/story-import-word.md AC-3), as plain objects so the
// site's unit tests can read them: the picture block in a story's text, and the upload kept with a story or chapter.

/** A picture from a Word document, in a story's or chapter's text. */
export const STORY_PICTURE_TYPE = {
  name: 'storyPicture',
  title: 'Picture',
  type: 'object' as const,
  fields: [
    { name: 'image', title: 'Picture', type: 'image' },
    { name: 'alt', title: 'Alt text', type: 'string' },
    { name: 'decorative', title: 'Decorative', type: 'boolean' },
    { name: 'fromWord', title: 'Alt text from Word', type: 'boolean', hidden: true },
    { name: 'wordAlt', title: "Word's alt text at the last upload", type: 'string', hidden: true },
    { name: 'wordDecorative', title: "Word's decorative mark at the last upload", type: 'boolean', hidden: true },
    { name: 'hash', title: "The picture's data's SHA-256", type: 'string', hidden: true },
    { name: 'edited', title: 'Changed in the editor', type: 'boolean', hidden: true },
  ],
  preview: { select: { media: 'image', alt: 'alt' }, prepare: ({ media, alt }: { media?: unknown; alt?: string }) => ({ title: alt || 'Picture', media }) },
};

/** The last upload: its file, when, the note, and what Undo puts back (AC-3, AC-16). */
export const TEXT_UPLOAD_FIELD = {
  name: 'textUpload',
  title: 'Upload',
  type: 'object' as const,
  hidden: true,
  fields: [
    { name: 'fileName', type: 'string' },
    { name: 'addedAt', type: 'datetime' },
    { name: 'note', type: 'array', of: [{ type: 'string' }] },
    { name: 'noteClosed', type: 'boolean' },
    { name: 'previous', type: 'text' },
    { name: 'discarded', type: 'array', of: [{ type: 'string' }] },
  ],
};
