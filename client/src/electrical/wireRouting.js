/** Build a visible wire path from its pin endpoints and user-placed bend nodes. */
export function buildWirePath(start, end, waypoints = []) {
  const points = [start, ...(Array.isArray(waypoints) ? waypoints : []), end]
    .filter((point) => Number.isFinite(point?.x) && Number.isFinite(point?.y));
  if (points.length < 2) return '';
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

/** Project a click onto the nearest segment; segmentIndex is the insertion index in waypoints. */
export function findNearestWireInsertion(start, waypoints = [], end, target) {
  const bends = Array.isArray(waypoints) ? waypoints : [];
  const pathPoints = [start, ...bends, end];
  let best = { distance: Infinity, point: target, segmentIndex: 0 };

  for (let index = 0; index < pathPoints.length - 1; index += 1) {
    const a = pathPoints[index];
    const b = pathPoints[index + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((target.x - a.x) * dx + (target.y - a.y) * dy) / lengthSquared));
    const projected = { x: a.x + t * dx, y: a.y + t * dy };
    const distance = Math.hypot(target.x - projected.x, target.y - projected.y);
    if (distance < best.distance) best = { distance, point: projected, segmentIndex: index };
  }
  return best;
}
