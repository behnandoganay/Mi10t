// Daire tabanlı çarpışma testleri.
const Collision = {
  circles(x1, y1, r1, x2, y2, r2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const r = r1 + r2;
    return dx * dx + dy * dy < r * r;
  },
  pointInCircle(px, py, cx, cy, r) {
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy < r * r;
  },
};
