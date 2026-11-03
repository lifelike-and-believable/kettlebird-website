// Preview and Hide preview at the top of a previewable item (design-preview, Flow, as amended:
// Sanity draws only one button beside Publish). Opens the preview as a second pane with the
// "preview" view, and closes it again (docs/specs/content-editing-preview.md AC-1).
import { Box, Button, Flex, Stack } from '@sanity/ui';
import type { ComponentType, ReactNode } from 'react';
import type { ObjectInputProps } from 'sanity';
import { useRouter } from 'sanity/router';
import { usePaneRouter } from 'sanity/structure';
import { PREVIEW_TEXT } from '../lib/preview';

type Panes = { id: string; params?: Record<string, string>; payload?: unknown }[][];

export function PreviewButton({ children }: { children: ReactNode }) {
  const { routerPanesState, groupIndex, duplicateCurrent, params } = usePaneRouter();
  const router = useRouter();
  const group = (routerPanesState as Panes)[groupIndex] ?? [];
  const open = group.some((pane) => pane.params?.view === 'preview');
  // Inside the preview pane itself, there's no button.
  if (params?.view === 'preview') return <>{children}</>;

  const toggle = () => {
    if (!open) {
      duplicateCurrent({ params: { ...(params ?? {}), view: 'preview' } });
      return;
    }
    const panes = (routerPanesState as Panes).map((g, i) => (i === groupIndex ? g.filter((pane) => pane.params?.view !== 'preview') : g));
    router.navigate({ ...router.state, panes });
  };

  return (
    <Stack space={4}>
      <Flex justify="flex-end">
        <Button mode={open ? 'default' : 'ghost'} text={open ? PREVIEW_TEXT.hide : PREVIEW_TEXT.preview} onClick={toggle} />
      </Flex>
      <Box>{children}</Box>
    </Stack>
  );
}

/** An item's own top-of-form input (if any), with Preview above it. */
export function withPreviewInput(Inner?: ComponentType<ObjectInputProps>) {
  function PreviewInput(props: ObjectInputProps) {
    return <PreviewButton>{Inner ? <Inner {...props} /> : props.renderDefault(props)}</PreviewButton>;
  }
  return PreviewInput;
}
