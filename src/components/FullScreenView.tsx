// Full screen for a portfolio piece: the piece as large as the screen allows, zoom and pan, turning
// through its section, and the bars a tap hides. Design: docs/design/portfolio-full-screen.md.
// Spec: docs/specs/portfolio-full-screen.md. The rules are pure, in src/lib/portfolio/full-screen.ts.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { GalleryItem } from '../lib/queries';
import { urlFor } from '../lib/sanity';
import {
  announcement,
  clampPan,
  clampZoom,
  countLabel,
  DOUBLE_TAP_ZOOM,
  fetchNext,
  fitted,
  HIDE_DELAY_MS,
  keyAction,
  LOAD_FAILED,
  LOADING_DELAY_MS,
  maxZoom,
  originalSize,
  PAN_STEP,
  requestWidth,
  stepZoom,
  swipeTurn,
  usable,
  zoomLabel,
  type Size,
  type Turn,
} from '../lib/portfolio/full-screen';

export interface FullScreenViewProps {
  order: GalleryItem[];
  start: number;
  sectionTitle?: string;
  /** The dialog's picture, shown at once while a sharper copy loads. */
  dialogSrc: (item: GalleryItem) => string | null;
  onClose: (last: GalleryItem) => void;
}

const WIDE = 700;
const TOP = 60;
const BOTTOM_WIDE = 72;
const BOTTOM_PHONE = 76;
const SIDE = 72;
const DRAG = 5;
const RETRY_MS = 250;

type Status = 'loading' | 'loaded' | 'failed';

/** An exit from the browser's full-screen mode still finishing; the next opening waits for it. */
let pendingExit: Promise<void> | undefined;

const pictureUrl = (item: GalleryItem, width: number) => urlFor(item.image).width(width).auto('format').url();

function viewport(): Size {
  return { width: window.innerWidth || 1024, height: window.innerHeight || 768 };
}

export default function FullScreenView({ order, start, sectionTitle, dialogSrc, onClose }: FullScreenViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(start);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);
  const [screen, setScreen] = useState<Size>(viewport);
  const [said, setSaid] = useState('');
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [best, setBest] = useState<Record<string, { src: string; width: number }>>({});
  const [slow, setSlow] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const going = useRef<Turn>('next');
  const covering = useRef(false);
  const closing = useRef(false);
  const hideTimer = useRef<number | undefined>(undefined);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const item = order[index];
  const wide = screen.width >= WIDE;
  const stage: Size = hidden
    ? screen
    : {
        width: Math.max(1, screen.width - (wide ? 2 * SIDE : 0)),
        height: Math.max(1, screen.height - TOP - (wide ? BOTTOM_WIDE : BOTTOM_PHONE)),
      };
  const original = originalSize(item.image.asset._ref) ?? { width: 1200, height: 1200 };
  const fit = fitted(original, stage);
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const max = maxZoom({ originalWidth: original.width, fittedWidth: fit.width, dpr });
  const can = usable({ index, count: order.length, zoom, max });

  // ---------------------------------------------------------------- leaving (AC-3)

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (covering.current) history.back();
    else if (document.fullscreenElement) pendingExit = document.exitFullscreen?.().catch(() => undefined);
    onClose(order[indexRef.current]);
  }, [onClose, order]);
  const indexRef = useRef(index);
  indexRef.current = index;

  // ---------------------------------------------------------------- opening (AC-2)

  useEffect(() => {
    const root = rootRef.current!;
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = 'hidden';
    closeRef.current?.focus();

    const cover = () => {
      covering.current = true;
      history.pushState({ kbFullScreen: true }, '');
    };
    const onPop = () => {
      if (!covering.current || closing.current) return;
      covering.current = false;
      closing.current = true;
      onClose(order[indexRef.current]);
    };
    const onChange = () => {
      if (!document.fullscreenElement && !covering.current && !closing.current) {
        closing.current = true;
        onClose(order[indexRef.current]);
      }
    };
    if (typeof root.requestFullscreen === 'function') {
      // A refusal right after leaving full screen is usually the browser still finishing that exit:
      // ask once more a moment later before covering the window instead.
      const ask = () =>
        root.requestFullscreen().catch(() =>
          window.setTimeout(() => {
            if (!closing.current) root.requestFullscreen().catch(cover);
          }, RETRY_MS),
        );
      if (pendingExit) pendingExit.then(ask, ask);
      else ask();
    } else cover();
    window.addEventListener('popstate', onPop);
    document.addEventListener('fullscreenchange', onChange);
    const onResize = () => setScreen(viewport());
    window.addEventListener('resize', onResize);
    return () => {
      html.style.overflow = overflow;
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('fullscreenchange', onChange);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(hideTimer.current);
    };
    // Once, on opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------- the picture (AC-4, AC-12)

  const wanted = requestWidth({ zoom, view: stage, dpr, original });
  const shownSrc = best[item._id]?.src ?? (index === start ? dialogSrc(item) : null) ?? pictureUrl(item, wanted);

  // Ask for a sharper copy when the current one is smaller than the zoom needs.
  useEffect(() => {
    const have = best[item._id]?.width ?? 0;
    if (have >= wanted || status[item._id] === 'failed') return;
    const src = pictureUrl(item, wanted);
    const img = new Image();
    img.onload = () => {
      setBest((b) => ((b[item._id]?.width ?? 0) >= wanted ? b : { ...b, [item._id]: { src, width: wanted } }));
      setStatus((s) => ({ ...s, [item._id]: 'loaded' }));
    };
    img.onerror = () => setStatus((s) => (s[item._id] === 'loaded' ? s : { ...s, [item._id]: 'failed' }));
    img.src = src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item._id, wanted]);

  // Once this piece has loaded, fetch its neighbours, the way the fan is going first.
  const loaded = status[item._id] === 'loaded';
  useEffect(() => {
    if (!loaded) return;
    for (const next of fetchNext(order, index, going.current)) {
      if (best[next._id] || status[next._id]) continue;
      const nextOriginal = originalSize(next.image.asset._ref) ?? original;
      const width = requestWidth({ zoom: 1, view: stage, dpr, original: nextOriginal });
      const src = pictureUrl(next, width);
      const img = new Image();
      img.onload = () => {
        setBest((b) => (b[next._id] ? b : { ...b, [next._id]: { src, width } }));
        setStatus((s) => ({ ...s, [next._id]: 'loaded' }));
      };
      img.onerror = () => setStatus((s) => ({ ...s, [next._id]: 'failed' }));
      img.src = src;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, index]);

  // The loading sign, 300 ms after a piece that hasn't loaded is shown.
  useEffect(() => {
    setSlow(false);
    if (status[item._id] === 'loaded') return;
    const timer = window.setTimeout(() => setSlow(true), LOADING_DELAY_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item._id]);

  // ---------------------------------------------------------------- words (AC-13)

  useLayoutEffect(() => {
    setSaid(announcement({ title: item.title, index, count: order.length, alt: item.altText }));
  }, [item, index, order.length]);

  // ---------------------------------------------------------------- zoom, moving and turning

  const setZoomAt = useCallback(
    (next: number, at?: { x: number; y: number }, say = false) => {
      const z = clampZoom(next, max);
      setPan((p) => {
        if (z === 1) return { x: 0, y: 0 };
        const point = at ?? { x: 0, y: 0 };
        const moved = { x: point.x - (point.x - p.x) * (z / zoom), y: point.y - (point.y - p.y) * (z / zoom) };
        return clampPan(moved, z, fit, stage);
      });
      setZoom(z);
      if (say) setSaid(zoomLabel(z));
    },
    [max, zoom, fit, stage],
  );

  const turn = useCallback(
    (to: Turn) => {
      const nextIndex = to === 'next' ? index + 1 : index - 1;
      if (nextIndex < 0 || nextIndex >= order.length) return;
      going.current = to;
      setIndex(nextIndex);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    },
    [index, order.length],
  );

  const show = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    setHidden(false);
  }, []);

  // Keys (AC-6, AC-7, AC-10): handled before the dialog behind sees them.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      show();
      if (event.key === 'Tab') {
        const root = rootRef.current!;
        const focusable = Array.from(root.querySelectorAll<HTMLElement>('button:not([tabindex="-1"])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || !root.contains(active))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || !root.contains(active))) {
          event.preventDefault();
          first.focus();
        }
        event.stopPropagation();
        return;
      }
      const action = keyAction({ key: event.key, shift: event.shiftKey, zoomed: zoom > 1 });
      if (!action) return;
      event.preventDefault();
      event.stopPropagation();
      if ('close' in action) close();
      else if ('turn' in action) turn(action.turn);
      else if ('fit' in action) setZoomAt(1, undefined, true);
      else if ('zoom' in action) setZoomAt(stepZoom(zoom, action.zoom, max), undefined, true);
      else if ('pan' in action) setPan((p) => clampPan({ x: p.x + action.pan.dx * PAN_STEP * stage.width, y: p.y + action.pan.dy * PAN_STEP * stage.height }, zoom, fit, stage));
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [zoom, max, stage, fit, close, turn, setZoomAt, show]);

  // The wheel or a trackpad zooms at the pointer.
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      const at = { x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 };
      setZoomAt(zoom * Math.exp(-event.deltaY * 0.002), at);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoom, setZoomAt]);

  // Pointers: drags move a zoomed piece, swipes turn a fitted one, two fingers pinch, taps hide the bars.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ startX: number; startY: number; lastX: number; lastY: number; moved: number; pinch?: number; zoom: number }>();

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const points = [...pointers.current.values()];
    const pinch = points.length === 2 ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) : undefined;
    gesture.current = { startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: 0, pinch, zoom };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) {
      if (event.pointerType === 'mouse') show();
      return;
    }
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const g = gesture.current;
    if (!g) return;
    const points = [...pointers.current.values()];
    if (points.length === 2 && g.pinch) {
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      g.moved = DRAG + 1;
      setZoomAt(g.zoom * (distance / g.pinch));
      return;
    }
    const dx = event.clientX - g.lastX;
    const dy = event.clientY - g.lastY;
    g.moved = Math.max(g.moved, Math.hypot(event.clientX - g.startX, event.clientY - g.startY));
    g.lastX = event.clientX;
    g.lastY = event.clientY;
    if (zoom > 1) setPan((p) => clampPan({ x: p.x + dx, y: p.y + dy }, zoom, fit, stage));
    else if (!reduced) setSwipeX(event.clientX - g.startX);
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    const g = gesture.current;
    setSwipeX(0);
    if (!g || pointers.current.size > 0) return;
    const to = swipeTurn({ dx: event.clientX - g.startX, dy: event.clientY - g.startY, startX: g.startX, zoomed: zoom > 1 });
    if (to) turn(to);
  };
  const onClick = () => {
    const g = gesture.current;
    if (g && g.moved > DRAG) return;
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      // Hiding is visual only; a control keeping focus would vanish, so focus moves to the view first.
      if (rootRef.current?.querySelector('[data-fs-controls]')?.contains(document.activeElement)) rootRef.current.focus();
      setHidden((h) => !h);
    }, HIDE_DELAY_MS);
  };
  const onDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    window.clearTimeout(hideTimer.current);
    const rect = event.currentTarget.getBoundingClientRect();
    const at = { x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 };
    setZoomAt(zoom > 1 ? 1 : DOUBLE_TAP_ZOOM, at);
  };

  // ---------------------------------------------------------------- the view

  const failed = status[item._id] === 'failed' && !best[item._id];
  const left = (stage.width - fit.width) / 2;
  const top = (stage.height - fit.height) / 2;
  const transform = `translate(${pan.x + swipeX}px, ${pan.y}px) scale(${zoom})`;
  const button = (label: string, enabled: boolean, onPress: () => void, text: React.ReactNode, extra = '') => (
    <button
      type="button"
      className={`fs__btn ${extra}${enabled ? '' : ' is-off'}`}
      aria-label={label}
      aria-disabled={enabled ? undefined : 'true'}
      tabIndex={enabled ? undefined : -1}
      onClick={() => enabled && onPress()}
    >
      {text}
    </button>
  );

  return (
    <div ref={rootRef} className={`fs${wide ? ' fs--wide' : ''}`} role="dialog" aria-modal="true" aria-label="Full screen" tabIndex={-1} onPointerMove={(e) => e.pointerType === 'mouse' && !pointers.current.size && show()}>
      <div
        ref={stageRef}
        className={`fs__stage${hidden ? ' is-full' : ''}`}
        data-fs-stage=""
        style={hidden ? undefined : { top: TOP, bottom: wide ? BOTTOM_WIDE : BOTTOM_PHONE, left: wide ? SIDE : 0, right: wide ? SIDE : 0 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        {failed ? (
          <p className="fs__failed">{LOAD_FAILED}</p>
        ) : (
          <img
            key={item._id}
            src={shownSrc}
            alt={item.altText ?? item.title}
            draggable={false}
            className={`fs__img${reduced ? '' : ' fs__img--ease'}`}
            style={{ left, top, width: fit.width, height: fit.height, transform }}
            onLoad={() => setStatus((s) => (s[item._id] === 'loaded' ? s : { ...s, [item._id]: 'loaded' }))}
            onError={() => setStatus((s) => (s[item._id] === 'loaded' ? s : { ...s, [item._id]: 'failed' }))}
          />
        )}
        {slow && status[item._id] !== 'loaded' && !failed && <span className="fs__loading" aria-hidden="true" />}
      </div>

      <div className="fs__controls" data-fs-controls="" data-hidden={hidden ? 'true' : 'false'} onFocusCapture={show}>
        <div className="fs__top">
          <span className="fs__title">{item.title}</span>
          <span className="fs__count" data-fs-count="">
            {countLabel(index, order.length, wide ? sectionTitle : undefined)}
          </span>
          <button ref={closeRef} type="button" className="fs__btn fs__close" aria-label="Close" onClick={close}>
            {wide ? '✕ Close' : '✕'}
          </button>
        </div>
        {button('Previous', can.previous, () => turn('previous'), <><span aria-hidden="true">◀</span><span className="fs__cap">Previous</span></>, 'fs__side fs__side--prev')}
        {button('Next', can.next, () => turn('next'), <><span aria-hidden="true">▶</span><span className="fs__cap">Next</span></>, 'fs__side fs__side--next')}
        {!wide && <div className="fs__bottom" />}
        <div className="fs__zoom">
          {button('Zoom out', can.zoomOut, () => setZoomAt(stepZoom(zoom, 'out', max), undefined, true), '−')}
          <span className="fs__level" data-fs-level="">{zoomLabel(zoom)}</span>
          {button('Zoom in', can.zoomIn, () => setZoomAt(stepZoom(zoom, 'in', max), undefined, true), '+')}
          {button('Fit', can.fit, () => setZoomAt(1, undefined, true), 'Fit', 'fs__fit')}
        </div>
        {wide && zoom > 1 && (
          <div className="fs__map" data-fs-map="" aria-hidden="true">
            <img src={shownSrc} alt="" />
            <i
              style={{
                left: `${Math.max(0, 50 - (pan.x / (fit.width * zoom)) * 100 - 50 / zoom * (stage.width / fit.width))}%`,
                top: `${Math.max(0, 50 - (pan.y / (fit.height * zoom)) * 100 - 50 / zoom * (stage.height / fit.height))}%`,
                width: `${Math.min(100, (100 / zoom) * (stage.width / fit.width))}%`,
                height: `${Math.min(100, (100 / zoom) * (stage.height / fit.height))}%`,
              }}
            />
          </div>
        )}
      </div>
      <p className="visually-hidden" aria-live="polite" data-fs-announce="">
        {said}
      </p>
    </div>
  );
}
