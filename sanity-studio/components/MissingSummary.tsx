// The box at the top of an item listing what to add before publishing
// (content-editing-organised-editor AC-6; design-organised-editor mock-up 3).
import { Box, Card, Stack, Text } from '@sanity/ui';
import type { ObjectInputProps } from 'sanity';
import { isItemType, missingFields, missingSummary } from '../lib/editor-content';

export function MissingSummary(props: ObjectInputProps) {
  const type = props.schemaType.name;
  const errorPaths = props.members.flatMap((member) =>
    member.kind === 'field' && member.field.validation.some((v) => v.level === 'error') ? [[member.name]] : [],
  );
  const summary = isItemType(type) ? missingSummary(type, missingFields(type, errorPaths)) : null;
  return (
    <Stack space={4}>
      {summary && (
        <Card tone="caution" padding={3} radius={2} border role="status">
          <Text size={1}>{summary}</Text>
        </Card>
      )}
      <Box>{props.renderDefault(props)}</Box>
    </Stack>
  );
}
