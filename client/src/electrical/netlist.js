/**
 * Builds the electrical connectivity graph used by CircuitWeb's physical editor.
 * Wires join component pins. Breadboard terminal groups and split power rails
 * are internally connected even when no jumper wire is drawn between their holes.
 *
 * This module builds topology only; it is not an analog/digital circuit solver.
 */
import { findBreadboardContacts } from './breadboardContacts.js';
import { findDirectPinContacts } from './directPinContacts.js';

export function buildElectricalNets(components = [], wires = [], componentPins = {}) {
  const parent = new Map();
  const rank = new Map();

  const keyOf = (componentId, pinId) => `${String(componentId)}::${String(pinId)}`;

  const add = (key) => {
    if (!parent.has(key)) {
      parent.set(key, key);
      rank.set(key, 0);
    }
  };

  const find = (key) => {
    add(key);
    const current = parent.get(key);
    if (current !== key) parent.set(key, find(current));
    return parent.get(key);
  };

  const union = (a, b) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return;
    const rankA = rank.get(rootA) || 0;
    const rankB = rank.get(rootB) || 0;
    if (rankA < rankB) parent.set(rootA, rootB);
    else if (rankA > rankB) parent.set(rootB, rootA);
    else {
      parent.set(rootB, rootA);
      rank.set(rootA, rankA + 1);
    }
  };

  const breadboardGroups = new Map();

  for (const component of components) {
    const pins = componentPins[component.name] || [];
    for (const pin of pins) {
      const nodeKey = keyOf(component.id, pin.id);
      add(nodeKey);
      if (component.name === 'Breadboard' && pin.electricalGroup) {
        const groupKey = `${component.id}::${pin.electricalGroup}`;
        const first = breadboardGroups.get(groupKey);
        if (first) union(first, nodeKey);
        else breadboardGroups.set(groupKey, nodeKey);
      }
    }
  }

  // A component lead placed directly into a breadboard hole joins that
  // hole's five-hole strip / power rail even when no jumper wire is drawn.
  for (const contact of findBreadboardContacts(components, componentPins)) {
    union(keyOf(contact.componentId, contact.pinId), keyOf(contact.breadboardId, contact.breadboardPinId));
  }

  // Terminals that physically touch are electrically joined even without a
  // wire object. The same helper is used by the simulation engine.
  for (const contact of findDirectPinContacts(components, componentPins)) {
    union(keyOf(contact.a.componentId, contact.a.pinId), keyOf(contact.b.componentId, contact.b.pinId));
  }

  for (const wire of wires) {
    if (!wire) continue;
    // Current SandboxUI wire format.
    if (wire.startComp != null && wire.startPin != null &&
        wire.endComp != null && wire.endPin != null) {
      union(keyOf(wire.startComp, wire.startPin), keyOf(wire.endComp, wire.endPin));
      continue;
    }
    // Also accept the older store format to keep the helper reusable.
    if (wire.from?.compId != null && wire.from?.pin != null &&
        wire.to?.compId != null && wire.to?.pin != null) {
      union(keyOf(wire.from.compId, wire.from.pin), keyOf(wire.to.compId, wire.to.pin));
    }
  }

  const groups = new Map();
  for (const nodeKey of parent.keys()) {
    const root = find(nodeKey);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(nodeKey);
  }

  return [...groups.values()]
    .filter((nodes) => nodes.length > 1)
    .map((nodes, index) => ({
      id: `net-${index + 1}`,
      nodes: nodes.sort()
    }));
}
