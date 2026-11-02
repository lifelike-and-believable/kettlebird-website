// The editor's top bar, with the state of the latest change at the right, on every screen
// (content-editing-know-when-live AC-4 to AC-7; design-know-when-live). Every 15 seconds it reads the
// site's /build-info.json and asks Sanity for the latest change; it never says Live without the file.
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useClient, type NavbarProps } from 'sanity';
import { Box, Button, Card, Dialog, Flex, Stack, Text } from '@sanity/ui';
import { CheckmarkCircleIcon, ErrorOutlineIcon, LaunchIcon, SyncIcon, TrashIcon, WarningOutlineIcon } from '@sanity/icons';
import { useRemovalRecord } from '../actions/recordRemoval';
import {
  CONTENT_TYPES, DIDNT_GO_LIVE_EXPLANATION, LATEST_QUERY, liveStatus, SITE_STATUS_ID,
  type BuildInfo, type Change, type Status, type StatusKind,
} from '../lib/live-status';

const CHECK_EVERY = 15_000;

const ICONS: Record<StatusKind, ReactNode> = {
  none: null,
  updating: <SyncIcon />,
  slow: <SyncIcon />,
  failed: <ErrorOutlineIcon />,
  live: <CheckmarkCircleIcon />,
  removed: <TrashIcon />,
  offline: <WarningOutlineIcon />,
};
const TONES: Record<StatusKind, 'default' | 'primary' | 'positive' | 'caution' | 'critical'> = {
  none: 'default', updating: 'primary', slow: 'caution', failed: 'critical', live: 'positive', removed: 'positive', offline: 'caution',
};

async function readBuild(): Promise<BuildInfo | null> {
  const response = await fetch('/build-info.json', { cache: 'no-store' });
  if (!response.ok) return null;
  const info = (await response.json()) as BuildInfo;
  return info.contentReadAt && info.builtAt ? info : null;
}

function useLiveStatus(): Status {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [status, setStatus] = useState<Status>({ kind: 'none', label: '' });
  const check = useCallback(async () => {
    let build: BuildInfo | null = null;
    let error = false;
    try {
      build = await readBuild();
    } catch {
      error = true;
    }
    try {
      const since = build?.contentReadAt ?? new Date().toISOString();
      const { latest, removedAt, pending } = await client.fetch<{ latest: Change | null; removedAt: string | null; pending: number }>(
        LATEST_QUERY, { types: CONTENT_TYPES, statusId: SITE_STATUS_ID, since }, { perspective: 'published' },
      );
      const removedSince = removedAt && Date.parse(removedAt) > Date.parse(since) ? 1 : 0;
      setStatus(liveStatus({ latest, removedAt, pending: pending + removedSince, build, now: new Date(), error }));
    } catch {
      setStatus({ kind: 'offline', label: "Can't check the site right now" });
    }
  }, [client]);
  useEffect(() => {
    void check();
    const timer = window.setInterval(() => void check(), CHECK_EVERY);
    return () => window.clearInterval(timer);
  }, [check]);
  return status;
}

function LiveStatusText() {
  const status = useLiveStatus();
  const [explaining, setExplaining] = useState(false);
  if (status.kind === 'none') return <div aria-live="polite" />;
  const close = () => setExplaining(false);
  return (
    <div aria-live="polite">
      <Flex align="center" gap={2}>
        {status.kind === 'failed' ? (
          <Button icon={ICONS.failed} mode="ghost" tone="critical" text={status.label} onClick={() => setExplaining(true)} />
        ) : (
          <Card tone={TONES[status.kind]} padding={2} radius={2}>
            <Flex align="center" gap={2}>
              <Text size={1}>{ICONS[status.kind]}</Text>
              <Text size={1}>{status.label}</Text>
            </Flex>
          </Card>
        )}
        {status.kind === 'live' && status.viewPath && (
          <Button as="a" href={status.viewPath} target="_blank" rel="noopener" mode="bleed" iconRight={LaunchIcon} text="View on site" />
        )}
      </Flex>
      {explaining && (
        <Dialog id="didnt-go-live" header="Didn't go live" onClose={close} width={1}
          footer={<Box padding={3}><Flex justify="flex-end"><Button text="Close" mode="ghost" onClick={close} /></Flex></Box>}>
          <Box padding={4}>
            <Stack space={3}>
              <Text>{DIDNT_GO_LIVE_EXPLANATION}</Text>
            </Stack>
          </Box>
        </Dialog>
      )}
    </div>
  );
}

export function LiveStatus(props: NavbarProps) {
  useRemovalRecord();
  return (
    <Flex align="center">
      <Box flex={1}>{props.renderDefault(props)}</Box>
      <Box paddingX={3}>
        <LiveStatusText />
      </Box>
    </Flex>
  );
}
