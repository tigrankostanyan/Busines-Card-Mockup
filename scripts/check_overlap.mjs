// Verify card overlap in the 3D plane for the default template (left-tilt-37)
// Computes exact polygon intersections after rotateZ(-38) scale(0.95) and reports
// which cards are covered by cards with higher z-index.

const DEG = Math.PI / 180;

const rotation = -38;
const zoom = 0.95;
const cardW = 280;
const cardH = 520;

const slots = [
  { id: 1, x: -316, y: -278, z: 3 },
  { id: 2, x: -316, y: 278, z: 4 },
  { id: 3, x: 0, y: -556, z: 2 },
  { id: 4, x: 0, y: 0, z: 10 },
  { id: 5, x: 0, y: 556, z: 2 },
  { id: 6, x: 316, y: -278, z: 3 },
  { id: 7, x: 316, y: 278, z: 4 },
];

const rad = rotation * DEG;
const cos = Math.cos(rad);
const sin = Math.sin(rad);

function rot(x, y) {
  return [x * cos - y * sin, x * sin + y * cos];
}

// Card rectangle corners centered at (cx,cy), wound COUNTER-CLOCKWISE in math coords
function corners(sx, sy) {
  const hw = cardW / 2;
  const hh = cardH / 2;
  // Math CCW: (-w,-h) -> (w,-h) -> (w,h) -> (-w,h) ... but we rotate a rectangle
  const pts = [
    [sx - hw, sy - hh],
    [sx + hw, sy - hh],
    [sx + hw, sy + hh],
    [sx - hw, sy + hh],
  ];
  return pts.map(([x, y]) => {
    const [rx, ry] = rot(x, y);
    return [rx * zoom, ry * zoom];
  });
}

// Sutherland–Hodgman. inside() keeps points on the LEFT of directed edge a->b.
// clipPoly must be wound counter-clockwise (in screen coords with y-down, this
// is the same convention the rect above uses after rotation).
function inside(p, a, b) {
  return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0;
}

function intersect(p1, p2, a, b) {
  const d1 = (p2[0] - p1[0]) * (b[1] - a[1]) - (p2[1] - p1[1]) * (b[0] - a[0]);
  if (Math.abs(d1) < 1e-12) return p1;
  const u = ((a[0] - p1[0]) * (b[1] - a[1]) - (a[1] - p1[1]) * (b[0] - a[0])) / d1;
  return [p1[0] + u * (p2[0] - p1[0]), p1[1] + u * (p2[1] - p1[1])];
}

function clip(subject, clipPoly) {
  let output = subject;
  for (let i = 0; i < clipPoly.length; i++) {
    const a = clipPoly[i];
    const b = clipPoly[(i + 1) % clipPoly.length];
    const input = output;
    output = [];
    for (let j = 0; j < input.length; j++) {
      const p = input[j];
      const q = input[(j + 1) % input.length];
      const pIn = inside(p, a, b);
      const qIn = inside(q, a, b);
      if (qIn) {
        if (!pIn) output.push(intersect(p, q, a, b));
        output.push(q);
      } else if (pIn) {
        output.push(intersect(p, q, a, b));
      }
    }
    if (output.length === 0) break;
  }
  return output;
}

function area(poly) {
  if (poly.length < 3) return 0;
  let s = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}

// ---- sanity check: two unit squares overlapping by 50% ----
{
  const A = [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
  ];
  const B = [
    [50, 0],
    [150, 0],
    [150, 100],
    [50, 100],
  ];
  const c = clip(A, B);
  console.log('SANITY: A∩B area =', area(c).toFixed(1), '(expect 5000)');
}

const polys = {};
for (const s of slots) polys[s.id] = corners(s.x, s.y);

function overlap(a, b) {
  const c = clip(polys[a], polys[b]);
  if (c.length < 3) return 0;
  return area(c);
}

console.log('Card area:', area(polys[1]).toFixed(0), '(scaled)');

// For each card, how much of its area is covered by any card with higher z-index
const orderByZ = [...slots].sort((a, b) => b.z - a.z);
for (const s of slots) {
  let covered = 0;
  const blockers = [];
  for (const o of orderByZ) {
    if (o.z <= s.z) break;
    const ov = overlap(s.id, o.id);
    if (ov > 1) blockers.push(`slot${o.id}(z${o.z}):${ov.toFixed(0)}px²`);
    covered += ov;
  }
  const total = area(polys[s.id]);
  const pct = (covered / total) * 100;
  console.log(
    `slot ${s.id} (z${s.z}): covered ${pct.toFixed(1)}% by [${blockers.join(', ') || 'none'}]`
  );
}

// All pair overlaps
console.log('\nPair overlaps (>0):');
for (let i = 0; i < slots.length; i++) {
  for (let j = i + 1; j < slots.length; j++) {
    const ov = overlap(slots[i].id, slots[j].id);
    if (ov > 1) console.log(`  slot${slots[i].id} x slot${slots[j].id}: ${ov.toFixed(0)}px²`);
  }
}
