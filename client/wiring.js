export const calculateWirePath = (x1, y1, x2, y2) => {
  if (Math.abs(x1 - x2) < 10 || Math.abs(y1 - y2) < 10) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
};
