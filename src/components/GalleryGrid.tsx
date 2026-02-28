import { useState, useMemo } from 'react';
import type { GalleryItem } from '../lib/queries';
import { urlFor } from '../lib/sanity';

const CATEGORY_LABELS: Record<string, string> = {
  featured: 'Featured',
  commission: 'Commissions',
  fanart: 'Fanart',
  original: 'Original Characters',
  wip: 'Work in Progress',
};

interface GalleryGridProps {
  items: GalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Derive available categories from actual data
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => item.category?.forEach((c) => cats.add(c)));
    return Array.from(cats);
  }, [items]);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((item) => item.category?.includes(activeCategory));
  }, [items, activeCategory]);

  return (
    <div className="gallery-wrapper">
      {/* Filter Bar */}
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

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="gallery-empty">No artwork in this category yet — check back soon!</p>
      ) : (
        <div className="gallery-grid">
          {filtered.map((item) => {
            const imgUrl = item.image?.asset
              ? urlFor(item.image).width(600).height(600).fit('crop').auto('format').url()
              : null;

            return (
              <button
                key={item._id}
                className="gallery-card"
                onClick={() => setLightboxItem(item)}
                aria-label={`View ${item.title}`}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={item.altText ?? item.title}
                    className="gallery-card__img"
                    loading="lazy"
                    width={600}
                    height={600}
                  />
                ) : (
                  <div className="gallery-card__placeholder" aria-hidden="true">🖼</div>
                )}
                <div className="gallery-card__overlay">
                  <span className="gallery-card__title">{item.title}</span>
                </div>
              </button>
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
            {lightboxItem.image?.asset && (
              <img
                src={urlFor(lightboxItem.image).width(1200).auto('format').url()}
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
                    <li key={tag} className="lightbox__tag">{tag}</li>
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
