/**
 * Physical-view reference footprints for CircuitWeb.
 * Values are nominal/approximate millimetres, not manufacturing drawings.
 * Board dimensions depend on the exact vendor revision; verify before PCB work.
 */
export const PHYSICAL_PIXELS_PER_MM = 4;

const DIMENSIONS_MM = {
  '9V Battery': [48.5, 26.5],
  'DC Voltage Source': [30, 22],
  'AC Voltage Source': [30, 22],
  'Signal Gen': [45, 30],
  'Carrier Generator': [45, 30],
  Ground: [10, 10],
  Resistor: [25.4, 6.3],
  Capacitor: [8, 12.5],
  Inductor: [12, 8],
  Potentiometer: [10, 10],
  Transformer: [25, 25],
  Diode: [14, 2.5],
  'Zener Diode': [14, 2.5],
  LED: [5, 20],
  'NPN Transistor': [8, 8],
  'PNP Transistor': [8, 8],
  MOSFET: [12, 15],
  '555 Timer': [9.43, 9.81],
  '74HC04 Hex Inverter': [9.4, 19.3],
  '74HC08 Quad AND': [9.4, 19.3],
  '74HC32 Quad OR': [9.4, 19.3],
  'Op-Amp': [9.43, 9.81],
  'AND Gate': [15, 10],
  'OR Gate': [15, 10],
  'NOT Gate': [15, 10],
  'Flip-Flop': [9.4, 19.3],
  DSO: [130, 90],
  CRO: [180, 120],
  Multimeter: [75, 150],
  Voltmeter: [75, 150],
  Ammeter: [75, 150],
  'Arduino Uno R3': [68.6, 53.4],
  // Reference footprint for a common 30-pin ESP32 DevKit-style board.
  // Other ESP32 carrier-board revisions can differ.
  'ESP32 DevKit': [32, 55],
  Breadboard: [83, 55]
};

const ICON_FALLBACK = {
  Battery: '9V Battery', VoltageSource: 'DC Voltage Source',
  SignalGen: 'Signal Gen', IC555: '555 Timer', IC74HC04: '74HC04 Hex Inverter',
  IC74HC08: '74HC08 Quad AND', IC74HC32: '74HC32 Quad OR',
  Arduino: 'Arduino Uno R3', ESP32: 'ESP32 DevKit'
};

export function getPhysicalDimensionsMm(component) {
  const name = component?.name || '';
  const mappedName = DIMENSIONS_MM[name] ? name : ICON_FALLBACK[component?.icon];
  return DIMENSIONS_MM[mappedName] || [25, 25];
}

export function getComponentDimensions(component, view = 'physical') {
  const scale = Number(component?.scale) > 0 ? Number(component.scale) : 1;
  if (view !== 'physical') {
    const size = 120 * scale;
    return { width: size, height: size };
  }
  // Legacy per-part scale values were visual presets, not physical dimensions.
  // Ignore them in Physical View so a resistor, IC, Arduino and breadboard retain
  // their true relative proportions. Canvas zoom remains the user-facing scale.
  const [widthMm, heightMm] = getPhysicalDimensionsMm(component);
  return {
    width: widthMm * PHYSICAL_PIXELS_PER_MM,
    height: heightMm * PHYSICAL_PIXELS_PER_MM
  };
}
