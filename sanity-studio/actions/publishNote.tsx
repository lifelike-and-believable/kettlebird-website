// The note after Publish: "Published. Updating the site; the status at the top right says when it's
// live." (content-editing-know-when-live AC-8). It waits for Sanity to say the publish succeeded, so
// a chapter's Publish shows it after its checks, not when they open.
import { useEffect } from 'react';
import { useDocumentOperationEvent, type DocumentActionComponent } from 'sanity';
import { useToast } from '@sanity/ui';
import { NOTE_AFTER_PUBLISH } from '../lib/live-status';

export function withPublishNote(original: DocumentActionComponent): DocumentActionComponent {
  const PublishWithNote: DocumentActionComponent = (props) => {
    const event = useDocumentOperationEvent(props.id, props.type);
    const toast = useToast();
    useEffect(() => {
      if (event?.type === 'success' && event.op === 'publish') {
        toast.push({ status: 'success', title: NOTE_AFTER_PUBLISH, duration: 8000 });
      }
    }, [event, toast]);
    return original(props);
  };
  PublishWithNote.action = original.action;
  PublishWithNote.displayName = 'PublishWithNote';
  return PublishWithNote;
}
