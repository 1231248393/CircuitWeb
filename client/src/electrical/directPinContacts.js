/**
 * Detect physical terminal-to-terminal contact without requiring a wire object.
 *
 * Coordinates use the same 120-unit component canvas and normalized pin map as
 * SandboxUI. Contacts are recalculated from current component positions on every
 * topology build, so moving parts apart automatically opens the contact again.
 */
export const COMPONENT_BASE_SIZE = 120;
export const DEFAULT_DIRECT_CONTACT_TOLERANCE = 12;

export function getElectricalPinWorldPosition(component, pin) {
  if (!component || !pin || !Number.isFinite(Number(component.x)) || !Number.isFinite(Number(component.y))) return null;
  const scale = Number.isFinite(Number(component.scale)) ? Number(component.scale) : 1;
  const size = COMPONENT_BASE_SIZE * scale;
  return {
    x: Number(component.x) + (Number(pin.x) / 100) * size,
    y: Number(component.y) + (Number(pin.y) / 100) * size
  };
}

export function findDirectPinContacts(
  components = [],
  componentPins = {},
  tolerance = DEFAULT_DIRECT_CONTACT_TOLERANCE
) {
  const pins = [];
  for (const component of components || []) {
    // Breadboard electrical strips have their own hole/rail contact model.
    if (component?.name === 'Breadboard') continue;
    const componentPinList = componentPins[component?.name] || componentPins.Default || [];
    for (const pin of componentPinList) {
      const position = getElectricalPinWorldPosition(component, pin);
      if (!position) continue;
      pins.push({
        componentId: component.id,
        componentName: component.name,
        pinId: pin.id,
        x: position.x,
        y: position.y
      });
    }
  }

  const maxDistanceSquared = Math.max(0, Number(tolerance) || 0) ** 2;
  const contacts = [];
  // Compare terminals from different components. A pin never shorts to another
  // pin on its own component just because the component is small or rotated.
  for (let i = 0; i < pins.length; i += 1) {
    for (let j = i + 1; j < pins.length; j += 1) {
      const a = pins[i];
      const b = pins[j];
      if (String(a.componentId) === String(b.componentId)) continue;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      if ((dx * dx) + (dy * dy) <= maxDistanceSquared) {
        contacts.push({
          a: { componentId: a.componentId, pinId: a.pinId },
          b: { componentId: b.componentId, pinId: b.pinId },
          distance: Math.sqrt((dx * dx) + (dy * dy))
        });
      }
    }
  }
  return contacts;
}
