import { useState, useMemo, useRef } from 'react';
import type { GalleryItem } from '../lib/queries';
import { urlFor } from '../lib/sanity';

const CATEGORY_LABELS: Record<string, string> = {
  featured: 'Featured',
  commission: 'Past Clients',
  fanart: 'Fan Work',
  original: 'Original Work',
  wip: 'Work in Progress',
};

// Preferred display order for folders
const FOLDER_ORDER = ['original', 'fanart', 'commission', 'featured', 'wip'];

type DisplayItem = GalleryItem;

function thumbUrl(item: DisplayItem): string | null {
  if (item.image?.asset) {
    return urlFor(item.image).width(500).height(500).fit('crop').auto('format').url();
  }
  return null;
}

function fullUrl(item: DisplayItem): string | null {
  if (item.image?.asset) return urlFor(item.image).width(1200).auto('format').url();
  return null;
}

interface GalleryGridProps {
  items: DisplayItem[];
}

function GalleryCard({ item, onClick }: { item: DisplayItem; onClick: () => void }) {
  const imgUrl = thumbUrl(item);

  return (
    <button className="gallery-card" onClick={onClick} aria-label={`View ${item.title}`}>
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={item.altText ?? item.title}
          className="gallery-card__img"
          loading="lazy"
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

function FolderCarousel({
  items,
  onItemClick,
}: {
  items: DisplayItem[];
  onItemClick: (item: DisplayItem) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.75;
    track.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <div className="carousel">
      <button
        className="carousel__arrow carousel__arrow--left"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        ‹
      </button>
      <div className="carousel__track" ref={trackRef}>
        {items.map((item) => (
          <GalleryCard key={item._id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </div>
      <button
        className="carousel__arrow carousel__arrow--right"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<DisplayItem | null>(null);

  // Derive available categories in preferred order
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => item.category?.forEach((c) => cats.add(c)));
    return [
      ...FOLDER_ORDER.filter((c) => cats.has(c)),
      ...Array.from(cats).filter((c) => !FOLDER_ORDER.includes(c)),
    ];
  }, [items]);

  // Group items into folders; an item can appear in multiple folders
  const folders = useMemo(
    () =>
      availableCategories.map((cat) => ({
        cat,
        items: items.filter((item) => item.category?.includes(cat)),
      })),
    [availableCategories, items]
  );

  const lightboxSrc = lightboxItem ? fullUrl(lightboxItem) : null;

  return (
    <div className="gallery-wrapper">
      {/* INDEX filter bar, hidden when there is nothing to filter */}
      {items.length > 0 && (
      <div className="gallery-index">
        <span className="gallery-index__label">Index</span>
        <nav className="gallery-filters" aria-label="Filter gallery by category">
          <button
            className={`filter-btn${activeCategory === 'all' ? ' filter-btn--active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${activeCategory === cat ? ' filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </nav>
      </div>
      )}

      {/* Stacked, edge-to-edge folder bands */}
      {folders.length === 0 ? (
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
          {folders.map(({ cat, items: folderItems }) => {
            if (activeCategory !== 'all' && activeCategory !== cat) return null;
            return (
              <section
                key={cat}
                className="folder-section"
                data-cat={cat}
                aria-label={CATEGORY_LABELS[cat] ?? cat}
              >
                <div className="folder-inner">
                  <span className="folder-label" data-cat={cat}>
                    {CATEGORY_LABELS[cat] ?? cat}
                  </span>
                  {folderItems.length === 0 ? (
                    <p className="gallery-empty">Nothing here yet — check back soon!</p>
                  ) : (
                    <FolderCarousel items={folderItems} onItemClick={setLightboxItem} />
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
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          onClick={() => setLightboxItem(null)}
        >
          <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox__close"
              onClick={() => setLightboxItem(null)}
              aria-label="Close"
            >
              ✕
            </button>
            {lightboxSrc && (
              <img
                src={lightboxSrc}
                alt={lightboxItem.altText ?? lightboxItem.title}
                className="lightbox__img"
              />
            )}
            <div className="lightbox__info">
              <h2 className="lightbox__title">{lightboxItem.title}</h2>
              {lightboxItem.description && (
                <p className="lightbox__description">{lightboxItem.description}</p>
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
    </div>
  );
}
