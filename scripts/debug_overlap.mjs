const DEG = Math.PI / 180;
const rotation = -38;
const zoom = 0.95;
const cardW = 280;
const cardH = 520;

const rad = rotation * DEG;
const cos = Math.cos(rad);
const sin = Math.sin(rad);

function rot(x, y) {
  return [x * cos - y * sin, x * sin + y * cos];
}

function corners(sx, sy) {
  const hw = cardW / 2;
  const hh = cardH / 2;
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

const p2 = corners(-316, 278); // slot 2
const p4 = corners(0, 0);      // slot 4

console.log('slot2 corners:', JSON.stringify(p2));
console.log('slot4 corners:', JSON.stringify(p4));
console.log('slot2 area:', area(p2));
console.log('slot4 area:', area(p4));

// bounding box check
function bbox(p) {
  const xs = p.map((q) => q[0]);
  const ys = p.map((q) => q[1]);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}
const b2 = bbox(p2);
const b4 = bbox(p4);
console.log('slot2 bbox:', b2);
console.log('slot4 bbox:', b4);
const bOverlap = !(b2.maxX < b4.minX || b4.maxX < b2.minX || b2.maxY < b4.minY || b4.maxY < b2.minY);
console.log('bbox overlap:', bOverlap);

const c = clip(p2, p4);
console.log('clip(slot2, slot4) result:', JSON.stringify(c));
console.log('clip area:', area(c));

// Try the sanity pattern directly: clip two axis-aligned rects with this exact function
const A = [[0,0],[100,0],[100,100],[0,100]];
const B = [[50,0],[150,0],[150,100],[50,100]];
console.log('axis sanity:', area(clip(A,B)));
