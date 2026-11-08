// Portfolio subfolders' actions (docs/specs/portfolio-folders.md):
// - A piece's Publish first drops the subfolders in sections it's no longer in (AC-21).
// - A subfolder's Delete says how many pieces it holds and that they stay, loose (AC-22). The pieces'
//   references are weak, so Sanity lets it go; the site reads a missing subfolder as none.
import { useState } from 'react';
import { useClient, useDocumentOperation, type DocumentActionComponent } from 'sanity';
import { deleteMessage, sectionTitle } from '../lib/editor-content';

const API = { apiVersion: '2024-01-01' };
type Ref = { _key: string; _ref: string };

export function withSubfolderTidy(original: DocumentActionComponent): DocumentActionComponent {
  const PublishPiece: DocumentActionComponent = (props) => {
    const base = original(props);
    const client = useClient(API);
    const ops = useDocumentOperation(props.id, props.type);
    if (!base) return base;
    return {
      ...base,
      onHandle: async () => {
        const doc = (props.draft ?? props.published) as { category?: string[]; subfolders?: Ref[] } | null;
        const refs = doc?.subfolders ?? [];
        if (refs.length) {
          const sections = await client.fetch<{ _id: string; section: string }[]>('*[_id in $ids]{ _id, section }', { ids: refs.map((r) => r._ref) });
          const gone = refs.filter((r) => {
            const section = sections.find((s) => s._id === r._ref)?.section;
            return section !== undefined && !(doc?.category ?? []).includes(section);
          });
          if (gone.length) ops.patch.execute([{ unset: gone.map((r) => `subfolders[_key=="${r._key}"]`) }]);
        }
        base.onHandle?.();
      },
    };
  };
  PublishPiece.action = original.action;
  PublishPiece.displayName = 'PublishPiece';
  return PublishPiece;
}

export function withSubfolderDelete(original: DocumentActionComponent): DocumentActionComponent {
  const DeleteSubfolder: DocumentActionComponent = (props) => {
    const base = original(props);
    const client = useClient(API);
    const ops = useDocumentOperation(props.id, props.type);
    const [message, setMessage] = useState<string | null>(null);
    if (!base) return base;
    const doc = (props.draft ?? props.published) as { name?: string; section?: string } | null;
    return {
      ...base,
      onHandle: async () => {
        const count = await client.fetch<number>(
          'count(*[_type == "galleryItem" && !(_id in path("drafts.**")) && $id in subfolders[]._ref && $section in category])',
          { id: props.id, section: doc?.section ?? '' },
        );
        setMessage(deleteMessage(doc?.name || 'this subfolder', count, sectionTitle(doc?.section ?? '')));
      },
      dialog: message
        ? {
            type: 'confirm',
            tone: 'critical',
            message,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            onCancel: () => setMessage(null),
            onConfirm: () => {
              ops.delete.execute();
              setMessage(null);
              props.onComplete();
            },
          }
        : base.dialog,
    };
  };
  DeleteSubfolder.action = original.action;
  DeleteSubfolder.displayName = 'DeleteSubfolder';
  return DeleteSubfolder;
}
