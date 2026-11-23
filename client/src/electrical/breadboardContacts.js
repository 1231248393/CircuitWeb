/**
 * Detects component leads physically inserted into breadboard holes.
 * Coordinates use the same 120 * component.scale world-space convention as
 * SandboxUI. A lead only joins a hole when it is very close to the hole centre.
 */
export function findBreadboardContacts(components = [], componentPins = {}, options = {}) {
  const baseSize = Number.isFinite(options.baseSize) ? options.baseSize : 120;
  const tolerance = Number.isFinite(options.tolerance) ? options.tolerance : 2.8;
  const boards = components.filter((component) => component.name === 'Breadboard');
  const contacts = [];

  for (const component of components) {
    if (component.name === 'Breadboard') continue;
    const pins = componentPins[component.name] || componentPins.Default || [];
    for (const pin of pins) {
      const size = baseSize * (Number(component.scale) || 1);
      const x = Number(component.x || 0) + (Number(pin.x) / 100) * size;
      const y = Number(component.y || 0) + (Number(pin.y) / 100) * size;
      let nearest = null;
      let nearestDistance = Infinity;

      for (const board of boards) {
        const boardPins = componentPins[board.name] || [];
        const boardSize = baseSize * (Number(board.scale) || 1);
        for (const hole of boardPins) {
          if (!hole.electricalGroup) continue;
          const hx = Number(board.x || 0) + (Number(hole.x) / 100) * boardSize;
          const hy = Number(board.y || 0) + (Number(hole.y) / 100) * boardSize;
          const distance = Math.hypot(x - hx, y - hy);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = { board, hole };
          }
        }
      }

      if (nearest && nearestDistance <= tolerance) {
        contacts.push({
          componentId: component.id,
          pinId: pin.id,
          breadboardId: nearest.board.id,
          breadboardPinId: nearest.hole.id,
          distance: nearestDistance
        });
      }
    }
  }
  return contacts;
}
