import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import type { GalleryItem } from '../lib/queries';
import { urlFor } from '../lib/sanity';
import { textLines } from '../lib/text';
import {
  arrowsUsable, buildFolders, folderBySlug, FOLDERS, folderTurnOrder, gridCells, indexAction, openAnnouncement, pieceWidth,
  subfolderLinkName, subfolderPath, tabLabel, type FolderView, type Subfolder,
} from '../lib/portfolio/folders';
import Arrow from './Arrow';
import FullScreenView from './FullScreenView';

// The portfolio as folders, with subfolders (docs/specs/portfolio-folders.md; design-portfolio-folders).

type DisplayItem = GalleryItem;

/** Picture heights fetched for a row (AC-6): the browser picks by the row's width and the screen. */
const ROW_HEIGHTS = [240, 480, 960];

function pieceSources(item: DisplayItem): { src: string; srcSet: string; sizes: string } | null {
  if (!item.image?.asset) return null;
  const ratio = pieceWidth(item, 1000) / 1000;
  const at = (h: number) => urlFor(item.image).height(h).auto('format').url();
  return {
    src: at(240),
    srcSet: ROW_HEIGHTS.map((h) => `${at(h)} ${Math.round(h * ratio)}w`).join(', '),
    // The row's height (AC-3) times the piece's shape.
    sizes: `calc(min(100vw * 9 / 16, 240px) * ${ratio.toFixed(4)})`,
  };
}

/** A grid cell, cropped square around Star's hotspot (AC-8). */
function cellUrl(item: DisplayItem, size: number): string | null {
  if (!item.image?.asset) return null;
  const side = Math.ceil(960 / size);
  return urlFor(item.image).width(side).height(side).fit('crop').auto('format').url();
}

function fullUrl(item: DisplayItem): string | null {
  if (item.image?.asset) return urlFor(item.image).width(1200).auto('format').url();
  return null;
}

interface GalleryGridProps {
  items: DisplayItem[];
  /** The Portfolio's subfolders (AC-8). */
  subfolders?: Subfolder[];
  /** The subfolder open when the page loads: its own address (AC-12) or its Preview (AC-23). */
  openSubfolder?: string;
  /** Preview only (docs/specs/content-editing-preview.md): move carousels to this piece. */
  focusId?: string;
  /** Preview only: open this piece, as Show it opened. */
  openId?: string;
  /** Preview only: never take focus or scroll the page, or change the address. */
  preview?: boolean;
}

function GalleryCard({ item, onClick, eager }: { item: DisplayItem; onClick: () => void; eager: boolean }) {
  const pic = pieceSources(item);
  return (
    <button className="gallery-card" onClick={onClick} aria-label={`View ${item.title}`} data-piece={item._id} data-part={`piece-${item._id}`}>
      {pic ? (
        <img
          src={pic.src}
          srcSet={pic.srcSet}
          sizes={pic.sizes}
          alt={item.altText ?? item.title}
          className="gallery-card__img"
          style={{ aspectRatio: `${pieceWidth(item, 1000)} / 1000` }}
          loading={eager ? undefined : 'lazy'}
        />
      ) : (
        <div className="gallery-card__placeholder" aria-hidden="true">🖼</div>
      )}
      <div className="gallery-card__overlay">
        <span className="gallery-card__title">{item.title}</span>
      </div>
    </button>
  );
}

function SubfolderCard({ subfolder, pieces, onOpen }: { subfolder: Subfolder; pieces: DisplayItem[]; onOpen: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  const cells = gridCells(pieces, subfolder.gridSize, false);
  const size = Math.sqrt(cells.length);
  return (
    <a
      className="subfolder-card"
      href={subfolderPath(subfolder) ?? '/portfolio'}
      aria-label={subfolderLinkName(subfolder.name, pieces.length)}
      data-sub={subfolder._id}
      data-part={`subfolder-${subfolder._id}`}
      onClick={onOpen}
    >
      <span className="subfolder-grid" data-size={size}>
        {cells.map((cell, i) => {
          const src = cell && cellUrl(cell, size);
          return (
            <span key={i} className="subfolder-grid__cell" data-cell="">
              {src && <img src={src} alt="" loading="lazy" />}
            </span>
          );
        })}
      </span>
      <span className="subfolder-card__name" aria-hidden="true">
        {subfolder.name}
        <span className="subfolder-card__count"> · {pieces.length}</span>
      </span>
    </a>
  );
}

/** The row: its pieces (and subfolders) at the row's height, and the arrows (AC-3, AC-5). */
function FolderRow({ children, focusId, resetKey }: { children: React.ReactNode; focusId?: string; resetKey: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Before it's measured, as most rows are: at the start, with more to the right.
  const [usable, setUsable] = useState({ left: false, right: true });
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (track) setUsable(arrowsUsable(track));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    track.scrollLeft = 0;
    // Preview: move the row to the piece, without scrolling anything else.
    const card = focusId ? byData(track, 'piece', focusId) : undefined;
    if (card) track.scrollLeft = card.offsetLeft - track.offsetLeft;
    measure();
    track.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    const imgs = Array.from(track.querySelectorAll('img'));
    for (const img of imgs) img.addEventListener('load', measure);
    return () => {
      track.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      for (const img of imgs) img.removeEventListener('load', measure);
    };
  }, [focusId, measure, resetKey]);

  const scroll = (dir: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track || !usable[dir]) return;
    const amount = track.clientWidth * 0.75;
    track.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const arrow = (dir: 'left' | 'right') => (
    <button
      type="button"
      className={`arrow-btn carousel__arrow carousel__arrow--${dir}${usable[dir] ? '' : ' is-off'}`}
      onClick={() => scroll(dir)}
      aria-label={dir === 'left' ? 'Scroll left' : 'Scroll right'}
      aria-disabled={!usable[dir]}
      tabIndex={usable[dir] ? undefined : -1}
    >
      <Arrow kind={dir === 'left' ? 'previous' : 'next'} />
    </button>
  );

  return (
    <div className="folder-row carousel">
      <div className="carousel__track" ref={trackRef}>
        {children}
      </div>
      {arrow('left')}
      {arrow('right')}
    </div>
  );
}

/** The subfolder an address names, if any (AC-12). */
function subfolderAt(pathname: string, subfolders: Subfolder[]): string | undefined {
  const match = /^\/portfolio\/([^/]+)\/([^/]+)\/?$/.exec(pathname);
  if (!match) return undefined;
  const folder = folderBySlug(match[1]);
  return subfolders.find((s) => folder && s.section === folder.value && s.slug?.current === match[2])?._id;
}

/** The first element under `root` whose data attribute `name` is `value`. */
function byData(root: ParentNode | null | undefined, name: string, value: string): HTMLElement | undefined {
  return Array.from(root?.querySelectorAll<HTMLElement>(`[data-${name}]`) ?? []).find((el) => el.getAttribute(`data-${name}`) === value);
}

const plainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

export default function GalleryGrid({ items, subfolders = [], openSubfolder, focusId, openId, preview = false }: GalleryGridProps) {
  const [lightboxItem, setLightboxItem] = useState<DisplayItem | null>(() => (openId ? items.find((i) => i._id === openId) ?? null : null));
  const folders = useMemo(() => buildFolders(items, subfolders), [items, subfolders]);

  // ---------------------------------------------------------------- subfolders (AC-9 to AC-13)

  const [openSub, setOpenSub] = useState<string | undefined>(openSubfolder);
  const openSubRef = useRef(openSub);
  openSubRef.current = openSub;
  const [announcement, setAnnouncement] = useState('');
  /** Whether the history entry before this one is the Portfolio's top level, pushed in this visit (AC-13). */
  const beforeIsTop = useRef(false);
  /** Where focus goes once the row has changed: the subfolder's first piece, or its thumbnail. */
  const pendingFocus = useRef<{ kind: 'first' | 'thumb'; sub: string } | null>(null);

  const viewOf = (subId: string | undefined): FolderView | undefined =>
    subId ? folders.find((f) => f.folder.value === subfolders.find((s) => s._id === subId)?.section) : undefined;
  const announce = (subId: string | undefined, folder: FolderView | undefined) => {
    if (!folder) return;
    const sub = folder.subfolders.find((s) => s.subfolder._id === subId);
    const all = folder.loose.length + folder.subfolders.reduce((n, s) => n + s.pieces.length, 0);
    setAnnouncement(openAnnouncement(folder.folder.title, sub?.subfolder.name, sub ? sub.pieces.length : all));
  };

  const open = (subfolder: Subfolder) => (event: MouseEvent<HTMLAnchorElement>) => {
    // A click with a key held follows the link, as any link does.
    if (!plainClick(event)) return;
    event.preventDefault();
    if (!preview) {
      beforeIsTop.current = openSubRef.current === undefined;
      window.history.pushState({ kbPortfolio: subfolder._id }, '', subfolderPath(subfolder));
    }
    pendingFocus.current = preview ? null : { kind: 'first', sub: subfolder._id };
    setOpenSub(subfolder._id);
    announce(subfolder._id, viewOf(subfolder._id));
  };

  const index = (subId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!plainClick(event)) return;
    event.preventDefault();
    pendingFocus.current = preview ? null : { kind: 'thumb', sub: subId };
    if (!preview && indexAction(beforeIsTop.current) === 'back') {
      // The popstate that follows shows the top level.
      window.history.back();
      return;
    }
    if (!preview) window.history.replaceState(null, '', '/portfolio');
    setOpenSub(undefined);
    announce(undefined, viewOf(subId));
  };

  // Back and Forward show what the address says (AC-13). Full screen's own entry is its own.
  useEffect(() => {
    if (preview) return undefined;
    const onPop = () => {
      if (fullScreenOpen.current) return;
      const next = subfolderAt(window.location.pathname, subfolders);
      const was = openSubRef.current;
      if (next === was) return;
      beforeIsTop.current = false;
      setLightboxItem(null);
      setOpenSub(next);
      announce(next, viewOf(next ?? was));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  });

  // Focus after the row changes (AC-10).
  useEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;
    pendingFocus.current = null;
    const section = byData(document, 'sub-open', pending.sub)?.closest('section');
    const target = pending.kind === 'first' ? section?.querySelector<HTMLElement>('[data-piece]') : byData(document, 'sub', pending.sub);
    target?.focus();
    if (pending.kind === 'thumb') target?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }, [openSub]);

  // ---------------------------------------------------------------- the dialog and full screen

  const lightboxSrc = lightboxItem ? fullUrl(lightboxItem) : null;

  // Full screen (docs/specs/portfolio-full-screen.md): opened from the dialog, turning through the
  // folder or subfolder the piece was opened from (portfolio-folders AC-15), and closing back to the
  // dialog of the piece last shown.
  const [openedFrom, setOpenedFrom] = useState<{ folder: string; sub?: string } | undefined>(undefined);
  const [fullScreen, setFullScreen] = useState<{ folder: string; sub?: string } | null>(null);
  const fullScreenOpen = useRef(false);
  fullScreenOpen.current = fullScreen !== null;
  const fullScreenButtonRef = useRef<HTMLButtonElement>(null);
  const returning = useRef(false);
  const openFullScreen = () => {
    if (!lightboxItem || !lightboxSrc) return;
    const folder = openedFrom?.folder ?? folders.find((f) => lightboxItem.category?.includes(f.folder.value))?.folder.value;
    if (folder) setFullScreen({ folder, sub: openedFrom?.sub });
  };
  const fullScreenView = fullScreen ? folders.find((f) => f.folder.value === fullScreen.folder) : undefined;
  const fullScreenOrder = fullScreenView ? folderTurnOrder(fullScreenView, fullScreen?.sub) : [];
  const fullScreenTitle = fullScreenView
    ? fullScreenView.subfolders.find((s) => s.subfolder._id === fullScreen?.sub)?.subfolder.name ?? fullScreenView.folder.title
    : undefined;
  const closeFullScreen = (last: DisplayItem) => {
    const section = fullScreen?.folder;
    setFullScreen(null);
    setLightboxItem(last);
    returning.current = true;
    // The gallery's card for the piece last shown gets focus back when the dialog closes.
    const card = section
      ? Array.from(document.querySelectorAll<HTMLElement>('section[data-cat] [data-piece]')).find(
          (el) => el.dataset.piece === last._id && el.closest('section')?.getAttribute('data-cat') === section,
        )
      : undefined;
    if (card) {
      openerRef.current = card;
      card.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    }
  };
  useEffect(() => {
    if (fullScreen === null && returning.current) {
      returning.current = false;
      fullScreenButtonRef.current?.focus();
    }
  }, [fullScreen, lightboxItem]);

  // The lightbox is a modal dialog: focus moves into it, stays inside it, Escape closes it, and
  // focus returns to the piece that opened it.
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const isOpen = lightboxItem !== null;

  const openLightbox = (item: DisplayItem, from: { folder: string; sub?: string }) => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpenedFrom(from);
    setLightboxItem(item);
  };
  const closeLightbox = () => setLightboxItem(null);

  useEffect(() => {
    if (!isOpen) return;
    if (!preview) closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      // While full screen is open, it handles the keys (one Escape closes only full screen).
      if (fullScreenOpen.current) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (!preview) openerRef.current?.focus();
    };
  }, [isOpen, preview]);

  // A subfolder opened in Preview before it has pieces (AC-23).
  const emptyOpen = openSub && !viewOf(openSub)?.subfolders.some((s) => s.subfolder._id === openSub)
    ? subfolders.find((s) => s._id === openSub)
    : undefined;
  const emptyFolder = emptyOpen && !folders.some((f) => f.folder.value === emptyOpen.section) ? FOLDERS.find((f) => f.value === emptyOpen.section) : undefined;
  const shown: FolderView[] = emptyFolder
    ? FOLDERS.flatMap((f) => (f === emptyFolder ? [{ folder: f, entries: [], loose: [], subfolders: [] }] : folders.filter((v) => v.folder === f)))
    : folders;
  let first = true;
  const eager = () => {
    const was = first;
    first = false;
    return was;
  };

  return (
    <div className="gallery-wrapper">
      <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>

      {shown.length === 0 ? (
        <div className="gallery-empty-state">
          <p className="gallery-empty">No artwork yet — check back soon!</p>
          <p className="gallery-empty__more">
            Until then, see Star&apos;s newest work on{' '}
            <a href="https://bsky.app/profile/kettlebird.bsky.social" target="_blank" rel="noopener noreferrer">Bluesky</a>,{' '}
            <a href="https://kettle-bird.tumblr.com" target="_blank" rel="noopener noreferrer">Tumblr</a>, or{' '}
            <a href="https://www.instagram.com/kettlebirdart" target="_blank" rel="noopener noreferrer">Instagram</a>.
          </p>
        </div>
      ) : (
        <div className="folder-stack">
          {shown.map((view) => {
            const { folder } = view;
            const opened = view.subfolders.find((s) => s.subfolder._id === openSub);
            const empty = emptyOpen?.section === folder.value ? emptyOpen : undefined;
            const openName = opened?.subfolder.name ?? empty?.name;
            const label = tabLabel(folder.title, openName);
            const openId = opened?.subfolder._id ?? empty?._id;
            return (
              <section
                key={folder.value}
                className={`folder-section folder--${folder.side}`}
                id={`section-${folder.value}`}
                data-cat={folder.value}
                aria-label={label}
                {...(openId ? { 'data-part': `subfolder-${openId}` } : {})}
              >
                <div className="folder-tabs">
                  <span className={`folder-tab folder-label${openName ? ' folder-tab--open' : ''}`} data-cat={folder.value} {...(openId ? { 'data-sub-open': openId } : {})}>
                    {label}
                  </span>
                  {openId && (
                    <a className="folder-tab folder-tab--index" href="/portfolio" aria-label={`Index: back to ${folder.title}`} onClick={index(openId)}>
                      INDEX
                    </a>
                  )}
                </div>
                <div className="folder-body">
                {empty ? (
                  <div className="folder-row folder-row--empty">
                    <p className="gallery-empty">{`No pieces in ${empty.name} yet. Put pieces in it from each piece's Subfolders.`}</p>
                  </div>
                ) : (
                  <FolderRow focusId={focusId} resetKey={openId ?? ''}>
                    {opened
                      ? opened.pieces.map((item) => (
                          <GalleryCard key={item._id} item={item} eager={eager()} onClick={() => openLightbox(item, { folder: folder.value, sub: opened.subfolder._id })} />
                        ))
                      : view.entries.map((entry) =>
                          entry.kind === 'piece' ? (
                            <GalleryCard key={entry.item._id} item={entry.item} eager={eager()} onClick={() => openLightbox(entry.item, { folder: folder.value })} />
                          ) : (
                            <SubfolderCard key={entry.subfolder._id} subfolder={entry.subfolder} pieces={entry.pieces} onOpen={open(entry.subfolder)} />
                          ),
                        )}
                  </FolderRow>
                )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <div
          ref={dialogRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          onClick={() => !fullScreenOpen.current && closeLightbox()}
        >
          <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button
              ref={closeRef}
              className="lightbox__close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              ✕
            </button>
            {lightboxSrc && (
              <div className="lightbox__pic">
                <img
                  src={lightboxSrc}
                  alt={lightboxItem.altText ?? lightboxItem.title}
                  className="lightbox__img"
                  onClick={openFullScreen}
                />
                <button ref={fullScreenButtonRef} type="button" className="lightbox__full" aria-label="Full screen" onClick={openFullScreen}>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                  </svg>
                  <span className="lightbox__full-label">Full screen</span>
                </button>
              </div>
            )}
            <div className="lightbox__info">
              <h2 className="lightbox__title">{lightboxItem.title}</h2>
              {lightboxItem.description && (
                <p className="lightbox__description">
                  {textLines(lightboxItem.description).map((line, i) => (
                    <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
                  ))}
                </p>
              )}
              {lightboxItem.tags && lightboxItem.tags.length > 0 && (
                <ul className="lightbox__tags" aria-label="Tags">
                  {lightboxItem.tags.map((tag) => (
                    <li key={tag} className="lightbox__tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {fullScreen && lightboxItem && fullScreenOrder.length > 0 && (
        <FullScreenView
          order={fullScreenOrder}
          start={Math.max(0, fullScreenOrder.findIndex((p) => p._id === lightboxItem._id))}
          sectionTitle={fullScreenTitle}
          dialogSrc={(p) => fullUrl(p)}
          onClose={closeFullScreen}
        />
      )}
    </div>
  );
}
