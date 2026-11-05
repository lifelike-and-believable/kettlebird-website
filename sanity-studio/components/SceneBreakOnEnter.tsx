// AC-5: a line with only symbols on it (like * * *) becomes a scene break when Enter is pressed at the
// end of it (docs/specs/story-reader-editor.md; design-story-reader, How it works). Added to every
// text box (form.components.portableText.plugins); it acts only where a scene break is allowed.
import { BehaviorPlugin } from '@portabletext/editor/plugins';
import { defineBehavior, execute } from '@portabletext/editor/behaviors';
import { getFocusTextBlock, isSelectionCollapsed } from '@portabletext/editor/selectors';
import type { PortableTextPluginsProps } from 'sanity';
import { isSceneBreakLine } from '../lib/stories';

const sceneBreakOnEnter = defineBehavior({
  on: 'insert.break',
  guard: ({ snapshot }) => {
    if (!snapshot.context.schema.blockObjects.some((type) => type.name === 'sceneBreak')) return false;
    if (!isSelectionCollapsed(snapshot)) return false;
    const focus = getFocusTextBlock(snapshot);
    if (!focus) return false;
    const text = focus.node.children.map((child) => (typeof child.text === 'string' ? child.text : '')).join('');
    return isSceneBreakLine(text) ? { focus } : false;
  },
  actions: [
    (_, { focus }) => [
      execute({ type: 'insert.block', block: { _type: 'sceneBreak' }, placement: 'before', select: 'none' }),
      execute({
        type: 'insert.block',
        block: { _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', text: '', marks: [] }] },
        placement: 'after',
        select: 'start',
      }),
      execute({ type: 'delete.block', at: focus.path }),
    ],
  ],
});

export function SceneBreakPlugins(props: PortableTextPluginsProps) {
  return (
    <>
      {props.renderDefault(props)}
      <BehaviorPlugin behaviors={[sceneBreakOnEnter]} />
    </>
  );
}
