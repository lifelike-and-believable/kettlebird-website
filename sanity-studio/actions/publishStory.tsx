// Publishing stories and their chapters (docs/specs/story-reader-editor.md AC-6, AC-9):
// - a chapter: the shared-link warning if its published number changed; Date posted filled in on the
//   first publish if empty; a story that isn't on the site yet is published with it;
// - a story: the shared-link warning if its published web address changed.
import { useState } from 'react';
import { useDocumentOperation, useEditState, type DocumentActionComponent, type DocumentActionDescription } from 'sanity';
import { storyLinkDialog, storyNeeds } from '../lib/stories';

type Dialog = { title: string; lines: string[] };
const slugOf = (doc: Record<string, unknown> | null | undefined) => (doc?.slug as { current?: string } | undefined)?.current;
const today = () => new Date().toLocaleDateString('en-CA');

function confirmDialog(dialog: Dialog, close: () => void, go: () => void): DocumentActionDescription['dialog'] {
  return {
    type: 'confirm',
    tone: 'caution',
    message: (
      <div>
        <strong>{dialog.title}</strong>
        {dialog.lines.map((line) => <p key={line}>{line}</p>)}
      </div>
    ),
    confirmButtonText: 'Publish anyway',
    cancelButtonText: 'Cancel',
    onCancel: close,
    onConfirm: () => { close(); go(); },
  };
}

export function withStoryChapterChecks(original: DocumentActionComponent): DocumentActionComponent {
  const PublishStoryChapter: DocumentActionComponent = (props) => {
    const base = original(props);
    const [open, setOpen] = useState(false);
    const ops = useDocumentOperation(props.id, props.type);
    const storyId = (props.draft?.story as { _ref?: string } | undefined)?._ref ?? 'none';
    const story = useEditState(storyId, 'writtenWork');
    const storyOps = useDocumentOperation(storyId, 'writtenWork');
    if (!base) return base;

    const newStory = story.draft && !story.published ? story.draft : null;
    // A new story goes up with its chapter, so it needs what any story with chapters needs (AC-2).
    const needs = newStory ? storyNeeds({ slug: slugOf(newStory), hasText: false, hasChapters: true }) : [];
    const blocked = needs.length > 0;
    const draft = props.draft;
    const published = props.published;
    const dialog =
      draft && published && typeof published.number === 'number' && typeof draft.number === 'number'
        ? storyLinkDialog({ kind: 'chapter', from: published.number, to: draft.number, title: draft.title as string | undefined })
        : null;

    const publish = () => {
      if (draft && !draft.publishDate && !published?.publishDate) ops.patch.execute([{ set: { publishDate: today() } }]);
      if (newStory && !storyOps.publish.disabled) storyOps.publish.execute();
      base.onHandle?.();
    };

    return {
      ...base,
      disabled: blocked || base.disabled,
      title: blocked ? `The story needs these first: ${needs.join(' ')}` : base.title,
      onHandle: () => (dialog ? setOpen(true) : publish()),
      dialog: open && dialog ? confirmDialog(dialog, () => setOpen(false), publish) : base.dialog,
    };
  };
  PublishStoryChapter.action = original.action;
  PublishStoryChapter.displayName = 'PublishStoryChapter';
  return PublishStoryChapter;
}

export function withStoryLinkCheck(original: DocumentActionComponent): DocumentActionComponent {
  const PublishStory: DocumentActionComponent = (props) => {
    const base = original(props);
    const [open, setOpen] = useState(false);
    if (!base) return base;
    const from = slugOf(props.published);
    const to = slugOf(props.draft);
    const dialog = from && to ? storyLinkDialog({ kind: 'story', from, to, title: props.draft?.title as string | undefined }) : null;
    const publish = () => base.onHandle?.();
    return {
      ...base,
      onHandle: () => (dialog ? setOpen(true) : publish()),
      dialog: open && dialog ? confirmDialog(dialog, () => setOpen(false), publish) : base.dialog,
    };
  };
  PublishStory.action = original.action;
  PublishStory.displayName = 'PublishStory';
  return PublishStory;
}
