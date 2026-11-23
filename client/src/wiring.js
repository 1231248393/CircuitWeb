export const calculateWirePath = (points) => {
  if (!points || points.length < 2) return "";
  
  // Filter out any points that don't have valid numeric x and y coordinates
  const validPoints = points.filter(p => p && typeof p.x === 'number' && typeof p.y === 'number' && !isNaN(p.x) && !isNaN(p.y));
  
  if (validPoints.length < 2) return "";

  let path = `M ${validPoints[0].x} ${validPoints[0].y}`;
  
  for (let i = 0; i < validPoints.length - 1; i++) {
    const p1 = validPoints[i];
    const p2 = validPoints[i + 1];
    
    // Straight line check
    if (Math.abs(p1.x - p2.x) < 5 || Math.abs(p1.y - p2.y) < 5) {
      path += ` L ${p2.x} ${p2.y}`;
      continue;
    }

    const dx = Math.abs(p1.x - p2.x);
    const dy = Math.abs(p1.y - p2.y);
    
    if (dx > dy) {
      const midX = (p1.x + p2.x) / 2;
      path += ` L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
    } else {
      const midY = (p1.y + p2.y) / 2;
      path += ` L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
    }
  }
  
  return path;
};
