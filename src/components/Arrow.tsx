// One drawn arrow for React islands, from the shared shapes (src/lib/arrows.ts). Hidden from screen readers.
import { arrowParts, type ArrowKind } from '../lib/arrows';

export default function Arrow({ kind, className }: { kind: ArrowKind; className?: string }) {
  const { svg, path } = arrowParts(kind);
  return (
    <svg viewBox={svg.viewBox} aria-hidden="true" focusable="false" data-arrow={kind} className={className}>
      <path d={path.d} fill={path.fill} stroke={path.stroke} strokeWidth={path['stroke-width']} strokeLinejoin="round" />
    </svg>
  );
}
