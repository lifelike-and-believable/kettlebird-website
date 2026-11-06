// The site's one arrow shape: a solid triangle with rounded corners, drawn, never typed (phones draw
// characters like ◀ as emoji). Design: docs/design/arrows.md. Spec: docs/specs/site-arrows.md.
// Pure: shapes and markup only.

export type ArrowKind = 'next' | 'previous' | 'first' | 'last' | 'down' | 'up';

export interface ArrowShape {
  viewBox: string;
  d: string;
}

/** In a 24-unit square, a triangle 10 wide and 13 tall; doubles sit in a 32 by 24 box, 5 units apart. */
export const ARROWS: Record<ArrowKind, ArrowShape> = {
  next: { viewBox: '0 0 24 24', d: 'M8 5.5 L18 12 L8 18.5 Z' },
  previous: { viewBox: '0 0 24 24', d: 'M16 5.5 L6 12 L16 18.5 Z' },
  last: { viewBox: '0 0 32 24', d: 'M3.5 5.5 L13.5 12 L3.5 18.5 Z M18.5 5.5 L28.5 12 L18.5 18.5 Z' },
  first: { viewBox: '0 0 32 24', d: 'M28.5 5.5 L18.5 12 L28.5 18.5 Z M13.5 5.5 L3.5 12 L13.5 18.5 Z' },
  down: { viewBox: '0 0 24 24', d: 'M5.5 8 L18.5 8 L12 18 Z' },
  up: { viewBox: '0 0 24 24', d: 'M5.5 16 L18.5 16 L12 6 Z' },
};

/** The stroke that rounds the corners, in the shape's units. */
export const ARROW_STROKE = 3;

/** The attributes of an arrow's <svg> and <path>, shared by the Astro and React components. */
export function arrowParts(kind: ArrowKind) {
  return {
    svg: { viewBox: ARROWS[kind].viewBox, 'aria-hidden': 'true', focusable: 'false', 'data-arrow': kind },
    path: { d: ARROWS[kind].d, fill: 'currentColor', stroke: 'currentColor', 'stroke-width': String(ARROW_STROKE), 'stroke-linejoin': 'round' },
  } as const;
}

const attrs = (o: Record<string, string>) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');

/** An arrow's markup, hidden from screen readers; `className` says where it sits. */
export function arrowSvg(kind: ArrowKind, className?: string): string {
  const { svg, path } = arrowParts(kind);
  const cls = className ? ` class="${className}"` : '';
  return `<svg ${attrs(svg)}${cls}><path ${attrs(path)}/></svg>`;
}
