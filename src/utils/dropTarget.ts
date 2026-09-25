import { CardSlot } from '../types';

/**
 * Resolve a drop/click point to the slot the user intends.
 *
 * Order of preference:
 *  1. Exact hit: the point is on a slot's visible (rendered) face — WYSIWYG.
 *  2. AABB containment: the point is inside a slot's axis-aligned bounding box
 *     (common for 3D-rotated slots whose bounding box is larger than the visible
 *     face) — pick the nearest AABB center among containing slots.
 *  3. Global proximity: the point is outside every slot's bounding box — fall
 *     back to the nearest AABB center so drops are never rejected.
 */
/** Walk up from a hit element looking for a card slot; return its id or null. */
function slotIdFromElement(el: Element | null): number | null {
  let p: HTMLElement | null = el as HTMLElement | null;
  while (p && p !== document.body) {
    if (p.id && p.id.startsWith('card-slot-')) {
      return parseInt(p.id.replace('card-slot-', ''), 10);
    }
    p = p.parentElement;
  }
  return null;
}

/** Check every element under (x, y) — the plural version also sees stacked/occluded slots. */
function hitSlotAtPoint(x: number, y: number): number | null {
  const els = document.elementsFromPoint(x, y);
  for (const el of els) {
    const id = slotIdFromElement(el);
    if (id != null) return id;
  }
  return null;
}

export function findSlotIdAtPoint(x: number, y: number, slots: CardSlot[]): number | null {
  if (!slots || slots.length === 0) return null;

  // 1. Exact hit on a visible slot face (WYSIWYG).
  const exact = hitSlotAtPoint(x, y);
  if (exact != null) return exact;

  // 1b. Small-radius fallback: real drags land a few px off the rendered face,
  // so sample the immediate neighbourhood before falling back to AABB routing.
  const RADIUS = 5;
  const offsets: Array<[number, number]> = [
    [RADIUS, 0], [-RADIUS, 0], [0, RADIUS], [0, -RADIUS],
    [RADIUS, RADIUS], [-RADIUS, -RADIUS], [RADIUS, -RADIUS], [-RADIUS, RADIUS],
  ];
  for (const [dx, dy] of offsets) {
    const ex = x + dx;
    const ey = y + dy;
    if (ex < 0 || ey < 0 || ex > window.innerWidth || ey > window.innerHeight) continue;
    const id = hitSlotAtPoint(ex, ey);
    if (id != null) return id;
  }

  // 2 + 3. Compute AABB centers once and route by containment first, proximity second.
  let containedId: number | null = null;
  let containedDist = Infinity;
  let nearestId: number | null = null;
  let nearestDist = Infinity;

  for (const slot of slots) {
    const node = document.getElementById(`card-slot-${slot.id}`);
    if (!node) continue;
    const r = node.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;

    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const d = Math.hypot(cx - x, cy - y);

    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      if (d < containedDist) {
        containedDist = d;
        containedId = slot.id;
      }
    }
    if (d < nearestDist) {
      nearestDist = d;
      nearestId = slot.id;
    }
  }

  return containedId !== null ? containedId : nearestId;
}
