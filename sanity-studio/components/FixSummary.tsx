// The box at the top of a Site settings item listing what to fix before publishing
// (content-editing-site-settings AC-4; design-site-settings mock-up 4).
import { Box, Card, Stack, Text } from '@sanity/ui';
import { useFormValue, useValidationStatus, type ObjectInputProps } from 'sanity';
import { fixLines, fixSummary } from '../lib/site-settings';

export function FixSummary(props: ObjectInputProps) {
  const id = useFormValue(['_id']) as string | undefined;
  const type = props.schemaType.name;
  const { validation } = useValidationStatus(id ?? type, type, false);
  const summary = fixSummary(fixLines(validation as never, props.value as Record<string, unknown> | undefined, type));
  return (
    <Stack space={4}>
      {summary && (
        <Card tone="caution" padding={3} radius={2} border role="status">
          <Text size={1} style={{ whiteSpace: 'pre-line' }}>{summary}</Text>
        </Card>
      )}
      <Box>{props.renderDefault(props)}</Box>
    </Stack>
  );
}
