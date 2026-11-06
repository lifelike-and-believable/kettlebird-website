// The page panel's Panels section: the picture with each panel as a numbered box, to move, resize,
// draw, remove and reorder, by mouse and by keyboard (docs/specs/comic-reader-panels.md AC-7 to AC-10;
// design-comic-panels, mock-ups 7 to 11). Every change is a step of the tested panel editor.
import { Box, Button, Card, Flex, Stack, Text } from '@sanity/ui';
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { set, unset, useClient, useFormValue, type PatchEvent } from 'sanity';
import { boxName, canUse, dragPreview, dragStep, edit, panelStatus, PICTURE_CHANGED, startEditing, type EditorAction, type EditorState, type Panel, type PanelsBy } from '../lib/panels';
import { useFinding, setFinding } from '../lib/upload-store';
import { assetUrl, findOnPage, storedPanels } from './findOnPage';

type PageValue = { _key?: string; asset?: { _ref?: string }; panels?: Panel[]; panelsBy?: PanelsBy };

const HELP = 'Tab to a panel. Arrow keys move it. Shift with Right or Down makes it wider or taller; with Left or Up, narrower or shorter. [ and ] move it earlier or later. Delete removes it. Ctrl+Z undoes.';
// Steps that change nothing stored.
const VIEW_ONLY = new Set(['select', 'startOrder', 'pick', 'cancelOrder']);

export function PanelsTool({ value, onChange }: { value: PageValue; onChange: (patch: PatchEvent | ReturnType<typeof set>[]) => void }) {
  const client = useClient({ apiVersion: '2024-01-01' });
  const { projectId, dataset } = client.config();
  const docId = useFormValue(['_id']) as string | undefined;
  const finding = useFinding(docId);
  const key = value._key ?? '';
  const ref = value.asset?._ref;
  const [state, setState] = useState<EditorState>(() => startEditing(value));
  const [changedPicture, setChangedPicture] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const drag = useRef<{ kind: 'move' | 'resize' | 'draw'; x: number; y: number; start?: Panel } | null>(null);
  const [drawing, setDrawing] = useState<Panel>();
  // The boxes while one is moved or resized, so it follows the pointer; kept as a step when it's let go.
  const [dragged, setDragged] = useState<Panel[]>();

  // A new page opened in the panel starts afresh.
  useEffect(() => setState(startEditing(value)), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  // Panels found (or changed) elsewhere while the page is open, before Star changes anything here.
  useEffect(() => {
    if (!state.history.length) setState(startEditing(value));
  }, [value.panels, value.panelsBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = (next: EditorState) => {
    onChange([
      next.panels.length ? set(storedPanels(next.panels), ['panels']) : set([], ['panels']),
      next.by ? set(next.by, ['panelsBy']) : unset(['panelsBy']),
    ] as never);
  };
  const act = (a: EditorAction) => {
    const next = edit(state, a);
    setState(next);
    if (next !== state && !VIEW_ONLY.has(a.type) && (next.panels !== state.panels || next.by !== state.by)) save(next);
  };

  const findAgain = async () => {
    if (!docId) return;
    setFinding(docId, (f) => ({ ...f, keys: [...f.keys, key], failed: f.failed.filter((k) => k !== key) }));
    const found = await findOnPage(ref && assetUrl(ref, projectId!, dataset!, 400));
    setFinding(docId, (f) => ({ ...f, keys: f.keys.filter((k) => k !== key), failed: found === 'failed' ? [...f.failed, key] : f.failed }));
    if (found !== 'failed') {
      const next = { ...startEditing({ panels: found, panelsBy: 'site' }) };
      setState(next);
      save(next);
    }
  };

  // A replaced picture: the site's panels are found again; Star's are kept, with a note (AC-4).
  const lastRef = useRef(ref);
  useEffect(() => {
    if (lastRef.current && ref && lastRef.current !== ref) {
      if (state.by === 'star') setChangedPicture(true);
      else void findAgain();
    }
    lastRef.current = ref;
  }, [ref]); // eslint-disable-line react-hooks/exhaustive-deps

  const percent = (e: PointerEvent) => {
    const r = area.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  };
  const onAreaDown = (e: PointerEvent) => {
    if (e.target !== area.current && !(e.target as HTMLElement).dataset.picture) return;
    const p = percent(e);
    drag.current = { kind: 'draw', ...p };
    area.current!.setPointerCapture(e.pointerId);
  };
  const onBoxDown = (e: PointerEvent, index: number, kind: 'move' | 'resize') => {
    e.stopPropagation();
    if (state.ordering) {
      act({ type: 'pick', index });
      return;
    }
    act({ type: 'select', index });
    const p = percent(e);
    drag.current = { kind, ...p, start: state.panels[index] };
    area.current!.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const p = percent(e);
    if (d.kind === 'draw') {
      setDrawing({ x: Math.min(d.x, p.x), y: Math.min(d.y, p.y), width: Math.abs(p.x - d.x), height: Math.abs(p.y - d.y) });
    } else if (d.start) {
      setDragged(dragPreview(state, d.kind, p.x - d.x, p.y - d.y));
    }
  };
  const onUp = (e: PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const p = percent(e);
    if (d.kind === 'draw') {
      setDrawing(undefined);
      act({ type: 'draw', box: { x: Math.min(d.x, p.x), y: Math.min(d.y, p.y), width: Math.abs(p.x - d.x), height: Math.abs(p.y - d.y) } });
    } else if (d.start) {
      setDragged(undefined);
      const step = dragStep(d.kind, p.x - d.x, p.y - d.y);
      if (step) act(step);
    }
  };
  const onBoxKey = (e: KeyboardEvent, index: number) => {
    if (state.ordering) {
      if (e.key === 'Enter') act({ type: 'pick', index });
      if (e.key === 'Escape') act({ type: 'cancelOrder' });
      return;
    }
    if (state.selected !== index) act({ type: 'select', index });
    const arrows: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const arrow = arrows[e.key];
    if (arrow) {
      e.preventDefault();
      act(e.shiftKey ? { type: 'resize', dw: arrow[0], dh: arrow[1] } : { type: 'move', dx: arrow[0], dy: arrow[1] });
    } else if (e.key === '[') act({ type: 'earlier' });
    else if (e.key === ']') act({ type: 'later' });
    else if (e.key === 'Delete' || e.key === 'Backspace') act({ type: 'remove' });
  };
  const onKey = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      act({ type: 'undo' });
    }
  };

  const can = canUse(state);
  const status = panelStatus({
    panels: state.panels,
    panelsBy: state.by,
    finding: finding.keys.includes(key),
    failed: finding.failed.includes(key) && !state.by,
  });
  const src = ref ? assetUrl(ref, projectId!, dataset!, 900) : undefined;
  const n = state.panels.length;

  return (
    <Stack space={3} onKeyDown={onKey}>
      <Text size={1} weight="semibold">Panels</Text>
      <Card padding={2} radius={2} tone={!state.by && !n ? 'caution' : 'primary'}>
        <Flex align="center" gap={2} wrap="wrap">
          <Text size={1}>{status}</Text>
          {state.by === 'site' && n > 0 && <Button text="They're right" tone="primary" fontSize={1} padding={2} onClick={() => act({ type: 'confirm' })} />}
        </Flex>
      </Card>
      {changedPicture && <Card padding={2} radius={2} tone="caution"><Text size={1}>{PICTURE_CHANGED}</Text></Card>}
      {state.ordering && <Text size={1}>Click the panels in the order they're read. {state.ordering.length} of {n} numbered.</Text>}
      {src && (
        <div
          ref={area}
          onPointerDown={onAreaDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => {
            // A drag the browser cancelled changes nothing.
            drag.current = null;
            setDrawing(undefined);
            setDragged(undefined);
          }}
          style={{ position: 'relative', userSelect: 'none', touchAction: 'none', cursor: 'crosshair', maxWidth: 520 }}
        >
          <img src={src} alt="" data-picture="1" draggable={false} style={{ display: 'block', width: '100%' }} />
          {(dragged ?? state.panels).map((p, i) => {
            const selected = state.selected === i;
            const picked = state.ordering ? state.ordering.indexOf(i) : -2;
            const number = state.ordering ? (picked >= 0 ? String(picked + 1) : '?') : String(i + 1);
            return (
              <div key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: `${p.width}%`, height: `${p.height}%` }}>
                {selected && !state.ordering && (
                  <Flex gap={1} style={{ position: 'absolute', top: -38, left: 0, zIndex: 2 }}>
                    <Button text="Earlier" fontSize={1} padding={2} mode="default" onClick={() => act({ type: 'earlier' })} />
                    <Button text="Later" fontSize={1} padding={2} mode="default" onClick={() => act({ type: 'later' })} />
                    <Button text="Remove" fontSize={1} padding={2} tone="critical" onClick={() => act({ type: 'remove' })} />
                  </Flex>
                )}
                <button
                  type="button"
                  aria-label={boxName(i, n, selected)}
                  onPointerDown={(e) => onBoxDown(e, i, 'move')}
                  onKeyDown={(e) => onBoxKey(e, i)}
                  style={{
                    position: 'absolute', inset: 0, cursor: 'move', background: selected ? '#2563eb22' : 'transparent',
                    border: `${selected ? 4 : 2}px solid ${state.ordering && picked < 0 ? '#9ca3af' : '#2563eb'}`,
                    outline: '2px solid #fff', outlineOffset: -1, padding: 0,
                  }}
                >
                  <span style={{ position: 'absolute', top: 4, left: 4, minWidth: 22, height: 22, borderRadius: 11, background: '#2563eb', color: '#fff', font: '700 13px/22px system-ui', textAlign: 'center' }}>{number}</span>
                </button>
                {selected && !state.ordering && (
                  <span
                    role="presentation"
                    onPointerDown={(e) => onBoxDown(e, i, 'resize')}
                    style={{ position: 'absolute', right: -7, bottom: -7, width: 14, height: 14, background: '#fff', border: '3px solid #2563eb', cursor: 'nwse-resize' }}
                  />
                )}
              </div>
            );
          })}
          {drawing && (
            <div style={{ position: 'absolute', left: `${drawing.x}%`, top: `${drawing.y}%`, width: `${drawing.width}%`, height: `${drawing.height}%`, border: '3px dashed #2563eb', background: '#2563eb18' }} />
          )}
        </div>
      )}
      <Flex gap={2} wrap="wrap">
        {state.ordering ? (
          <>
            <Button text="Finish order" tone="primary" onClick={() => act({ type: 'finishOrder' })} />
            <Button text="Cancel" mode="ghost" onClick={() => act({ type: 'cancelOrder' })} />
          </>
        ) : (
          <>
            <Button text="Add panel" mode="ghost" onClick={() => act({ type: 'add' })} />
            <Button text="Set the reading order" mode="ghost" disabled={!can.setOrder} onClick={() => act({ type: 'startOrder' })} />
            <Button text="Show this page whole" mode="ghost" disabled={!can.showWhole} onClick={() => act({ type: 'whole' })} />
            <Button text="Undo" mode="ghost" disabled={!can.undo} onClick={() => act({ type: 'undo' })} />
            {can.findAgain && <Button text="Find panels again" mode="ghost" onClick={() => void findAgain()} />}
          </>
        )}
      </Flex>
      <Text size={1} muted>{HELP}</Text>
      <Box style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        <p role="status" aria-live="polite">{state.message ?? ''}</p>
      </Box>
    </Stack>
  );
}
