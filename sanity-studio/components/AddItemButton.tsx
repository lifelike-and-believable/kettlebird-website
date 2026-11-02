// The add button under a list of facts or links: "+ Add a fact", "+ Add a link"
// (content-editing-site-settings AC-5; design-site-settings mock-ups 2 and 4).
import { Button, Flex } from '@sanity/ui';
import { AddIcon } from '@sanity/icons';
import type { ArrayInputFunctionsProps, ArraySchemaType } from 'sanity';
import { ADD_LABELS } from '../lib/site-settings';

export function AddItemButton(props: ArrayInputFunctionsProps<{ _key: string }, ArraySchemaType>) {
  const field = String(props.path[props.path.length - 1]) as keyof typeof ADD_LABELS;
  const label = ADD_LABELS[field] ?? '+ Add';
  if (props.readOnly) return null;
  return (
    <Flex>
      <Button
        icon={AddIcon}
        mode="ghost"
        text={label.replace(/^\+\s*/, '')}
        onClick={() => props.onItemAppend(props.onValueCreate(props.schemaType.of[0] as never))}
      />
    </Flex>
  );
}
