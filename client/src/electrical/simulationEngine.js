import { findDirectPinContacts } from './directPinContacts.js';

/**
 * CircuitWeb shared simulation core (Stage 3).
 *
 * Scope in this release:
 * - real connectivity from component pins, wires and breadboard electrical groups;
 * - DC/AC independent voltage sources and function generators;
 * - resistors, potentiometer end-to-end resistance, capacitors (backward Euler),
 *   approximate forward-biased silicon diodes, and high-impedance DSO probes;
 * - nodal solution by modified nodal analysis (MNA);
 * - measured CH1/CH2 samples, RMS, min/max and solver diagnostics.
 *
 * This is an educational simulator, not a SPICE replacement. Unsupported devices are
 * reported rather than silently assigned invented readings.
 */

import { findBreadboardContacts } from './breadboardContacts.js';

const PIN_TOKEN = (componentId, pinId) => `${String(componentId)}::${String(pinId)}`;
const EPS = 1e-12;

function createUnionFind() {
  const parent = new Map();
  const rank = new Map();
  const add = (value) => {
    if (!parent.has(value)) {
      parent.set(value, value);
      rank.set(value, 0);
    }
  };
  const find = (value) => {
    add(value);
    const current = parent.get(value);
    if (current !== value) parent.set(value, find(current));
    return parent.get(value);
  };
  const union = (a, b) => {
    let rootA = find(a);
    let rootB = find(b);
    if (rootA === rootB) return;
    const rankA = rank.get(rootA) || 0;
    const rankB = rank.get(rootB) || 0;
    if (rankA < rankB) [rootA, rootB] = [rootB, rootA];
    parent.set(rootB, rootA);
    if (rankA === rankB) rank.set(rootA, rankA + 1);
  };
  return { add, find, union, entries: () => [...parent.keys()] };
}

export function buildSimulationTopology(components = [], wires = [], componentPins = {}) {
  const uf = createUnionFind();
  const pinsByComponent = new Map();
  const breadboardGroups = new Map();

  for (const component of components) {
    const pins = componentPins[component.name] || componentPins.Default || [];
    pinsByComponent.set(String(component.id), pins);
    for (const pin of pins) {
      const token = PIN_TOKEN(component.id, pin.id);
      uf.add(token);
      if (component.name === 'Breadboard' && pin.electricalGroup) {
        const groupToken = `${component.id}::${pin.electricalGroup}`;
        const first = breadboardGroups.get(groupToken);
        if (first) uf.union(first, token);
        else breadboardGroups.set(groupToken, token);
      }
    }
  }

  // Treat a component lead aligned with a breadboard hole as an electrical
  // contact, just as a jumper-less Tinkercad breadboard placement does.
  for (const contact of findBreadboardContacts(components, componentPins)) {
    uf.union(
      PIN_TOKEN(contact.componentId, contact.pinId),
      PIN_TOKEN(contact.breadboardId, contact.breadboardPinId)
    );
  }

  for (const wire of wires || []) {
    if (!wire) continue;
    if (wire.startComp != null && wire.startPin != null && wire.endComp != null && wire.endPin != null) {
      uf.union(PIN_TOKEN(wire.startComp, wire.startPin), PIN_TOKEN(wire.endComp, wire.endPin));
    } else if (wire.from?.compId != null && wire.from?.pin != null && wire.to?.compId != null && wire.to?.pin != null) {
      uf.union(PIN_TOKEN(wire.from.compId, wire.from.pin), PIN_TOKEN(wire.to.compId, wire.to.pin));
    }
  }

  // Direct physical pin-to-pin contact (Tinkercad-style) joins nets even
  // when the user has not drawn a wire. Contacts follow current part positions.
  for (const contact of findDirectPinContacts(components, componentPins)) {
    uf.union(
      PIN_TOKEN(contact.a.componentId, contact.a.pinId),
      PIN_TOKEN(contact.b.componentId, contact.b.pinId)
    );
  }

  const members = new Map();
  for (const token of uf.entries()) {
    const root = uf.find(token);
    if (!members.has(root)) members.set(root, []);
    members.get(root).push(token);
  }

  const nodeOf = (componentId, pinId) => uf.find(PIN_TOKEN(componentId, pinId));
  const pinIsConnected = (componentId, pinId) => (members.get(nodeOf(componentId, pinId)) || []).length > 1;
  return {
    nodeOf,
    pinIsConnected,
    members,
    pinsByComponent,
    nodes: [...members.keys()],
    nodeMembers: (nodeId) => members.get(nodeId) || []
  };
}

function parseNumeric(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value == null) return NaN;
  const match = String(value).replace(/,/g, '').match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/i);
  return match ? Number(match[0]) : NaN;
}

function prefixScale(unit = '') {
  const normalized = String(unit).replace(/Ω/g, 'ohm').replace(/µ/g, 'u').trim();
  if (/^(G|g)(ohm|Ω|F|H|Hz)?$/.test(normalized)) return 1e9;
  if (/^(M|meg)(ohm|F|H|Hz)?$/i.test(normalized)) return 1e6;
  if (/^k(ohm|F|H|Hz)?$/i.test(normalized)) return 1e3;
  if (/^m(ohm|F|H|Hz)?$/.test(normalized)) return 1e-3;
  if (/^(u|n|p)(F|H|s)?$/i.test(normalized)) {
    const first = normalized[0].toLowerCase();
    return first === 'u' ? 1e-6 : first === 'n' ? 1e-9 : 1e-12;
  }
  return 1;
}

function parseEngineering(value, unit = '', fallback = NaN, kind = '') {
  const numeric = parseNumeric(value);
  if (!Number.isFinite(numeric)) return fallback;
  const text = `${value ?? ''} ${unit ?? ''}`.trim();
  let embeddedUnit = '';
  if (/GΩ|Gohm|GHz|GF/i.test(text)) embeddedUnit = 'G';
  else if (/MΩ|Mohm|MHz|MF/i.test(text)) embeddedUnit = 'M';
  else if (/kΩ|kohm|kHz|kF/i.test(text)) embeddedUnit = 'k';
  else if (/mH|mF|mΩ|mohm/i.test(text)) embeddedUnit = 'm';
  else if (/uF|µF|μF|uH|µH|μH/i.test(text)) embeddedUnit = 'u';
  else if (/nF|nH/i.test(text)) embeddedUnit = 'n';
  else if (/pF|pH/i.test(text)) embeddedUnit = 'p';
  const scale = embeddedUnit ? ({ G: 1e9, M: 1e6, k: 1e3, m: 1e-3, u: 1e-6, n: 1e-9, p: 1e-12 }[embeddedUnit]) : prefixScale(unit);
  if (kind === 'frequency' && /MHz/i.test(text)) return numeric * 1e6;
  if (kind === 'frequency' && /kHz/i.test(text)) return numeric * 1e3;
  if (kind === 'frequency' && /GHz/i.test(text)) return numeric * 1e9;
  if (kind === 'frequency' && /Hz/i.test(text)) return numeric;
  return numeric * scale;
}

function parseVoltageAmplitude(component) {
  const raw = component.amp ?? component.val ?? component.value ?? 5;
  const numeric = parseNumeric(raw);
  if (!Number.isFinite(numeric)) return 2.5;
  const text = String(raw).toLowerCase();
  if (text.includes('vpp') || text.includes('v p-p')) return Math.abs(numeric) / 2;
  return Math.abs(numeric);
}

function frequencyOf(component) {
  return Math.max(0, parseEngineering(component.freq ?? '1 kHz', '', 1000, 'frequency'));
}

function sourceInstantaneousVoltage(component, timeSeconds) {
  const name = component.name;
  if (name === '9V Battery') return parseEngineering(component.val ?? 9, component.unit ?? 'V', 9);
  if (name === 'DC Voltage Source') return parseEngineering(component.val ?? component.value ?? 5, component.unit ?? 'V', 5);
  const peak = parseVoltageAmplitude(component);
  const frequency = frequencyOf(component);
  const wave = String(component.wave || 'Sine').toLowerCase();
  const phase = 2 * Math.PI * frequency * timeSeconds;
  if (wave.includes('square')) return phase % (2 * Math.PI) < Math.PI ? peak : -peak;
  if (wave.includes('triangle')) return (2 * peak / Math.PI) * Math.asin(Math.sin(phase));
  if (wave.includes('pulse')) return phase % (2 * Math.PI) < Math.PI ? peak : 0;
  return peak * Math.sin(phase);
}

function getPinNode(topology, component, pinId) {
  try { return topology.nodeOf(component.id, pinId); } catch { return null; }
}

function getTwoPinNodes(topology, component, pinA, pinB) {
  return [getPinNode(topology, component, pinA), getPinNode(topology, component, pinB)];
}

function gaussianSolve(matrix, vector) {
  const n = vector.length;
  if (n === 0) return [];
  const a = matrix.map((row, index) => [...row, vector[index]]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
    }
    if (Math.abs(a[pivot][col]) < EPS) return null;
    if (pivot !== col) [a[pivot], a[col]] = [a[col], a[pivot]];
    const divisor = a[col][col];
    for (let j = col; j <= n; j += 1) a[col][j] /= divisor;
    for (let row = 0; row < n; row += 1) {
      if (row === col) continue;
      const factor = a[row][col];
      if (Math.abs(factor) < EPS) continue;
      for (let j = col; j <= n; j += 1) a[row][j] -= factor * a[col][j];
    }
  }
  return a.map((row) => row[n]);
}

function graphComponents(branches) {
  const adjacency = new Map();
  const addEdge = (a, b) => {
    if (a == null || b == null || a === b) return;
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    adjacency.get(a).add(b);
    adjacency.get(b).add(a);
  };
  for (const branch of branches) addEdge(branch.a, branch.b);
  const groups = [];
  const visited = new Set();
  for (const node of adjacency.keys()) {
    if (visited.has(node)) continue;
    const stack = [node];
    const group = new Set();
    visited.add(node);
    while (stack.length) {
      const current = stack.pop();
      group.add(current);
      for (const next of adjacency.get(current) || []) {
        if (!visited.has(next)) { visited.add(next); stack.push(next); }
      }
    }
    groups.push(group);
  }
  return groups;
}

function sourceBranches(components, topology, timeSeconds) {
  const branches = [];
  for (const component of components) {
    if (['9V Battery', 'DC Voltage Source', 'AC Voltage Source', 'Signal Gen', 'Carrier Generator'].includes(component.name)) {
      const aPin = component.name === 'Signal Gen' || component.name === 'Carrier Generator' ? 'out' : 'pos';
      const bPin = component.name === 'Signal Gen' || component.name === 'Carrier Generator' ? 'gnd' : 'neg';
      const [a, b] = getTwoPinNodes(topology, component, aPin, bPin);
      if (a == null || b == null || a === b) continue;
      branches.push({
        kind: 'source', component, a, b,
        voltage: sourceInstantaneousVoltage(component, timeSeconds),
        label: component.name
      });
    }
  }
  return branches;
}

function passiveBranches(components, topology) {
  const branches = [];
  const warnings = [];
  const unsupported = new Set();
  for (const component of components) {
    if (component.name === 'Resistor') {
      const [a, b] = getTwoPinNodes(topology, component, 'p1', 'p2');
      const resistance = parseEngineering(component.val ?? component.value ?? 1000, component.unit ?? 'Ω', 1000, 'resistance');
      if (a != null && b != null && a !== b && resistance > 0) branches.push({ kind: 'resistor', component, a, b, resistance });
      continue;
    }
    if (component.name === 'Potentiometer') {
      const [a, b] = getTwoPinNodes(topology, component, 'a', 'b');
      const resistance = parseEngineering(component.val ?? 10, component.unit ?? 'kΩ', 10000, 'resistance');
      if (a != null && b != null && a !== b && resistance > 0) branches.push({ kind: 'resistor', component, a, b, resistance });
      continue;
    }
    if (component.name === 'Capacitor') {
      const [a, b] = getTwoPinNodes(topology, component, 'top', 'bottom');
      const capacitance = parseEngineering(component.val ?? 0.01, component.unit ?? 'uF', 1e-8, 'capacitance');
      if (a != null && b != null && a !== b && capacitance > 0) branches.push({ kind: 'capacitor', component, a, b, capacitance });
      continue;
    }
    if (component.name === 'Diode' || component.name === 'LED' || component.name === 'Zener Diode') {
      const [a, b] = getTwoPinNodes(topology, component, 'anode', 'cathode');
      if (a != null && b != null && a !== b) branches.push({ kind: 'diode', component, a, b, forwardVoltage: component.name === 'LED' ? 1.9 : 0.65, on: false });
      continue;
    }
    if (component.name === 'Ammeter') {
      const [a, b] = getTwoPinNodes(topology, component, 'in', 'out');
      if (a != null && b != null && a !== b) branches.push({ kind: 'ammeter', component, a, b, voltage: 0 });
      continue;
    }
    if (component.name === 'Voltmeter' || component.name === 'Multimeter') {
      const pinA = component.name === 'Multimeter' ? 'v_ohm' : 'pos';
      const pinB = component.name === 'Multimeter' ? 'com' : 'neg';
      const [a, b] = getTwoPinNodes(topology, component, pinA, pinB);
      if (a != null && b != null && a !== b) branches.push({ kind: 'voltmeter', component, a, b, resistance: 10e6 });
      continue;
    }
    if (['Inductor', 'Transformer', 'NPN Transistor', 'PNP Transistor', 'MOSFET', '555 Timer', '74HC04 Hex Inverter', '74HC08 Quad AND', '74HC32 Quad OR', 'AND Gate', 'OR Gate', 'NOT Gate', 'Flip-Flop', 'Op-Amp'].includes(component.name)) {
      unsupported.add(component.name);
    }
  }
  if (unsupported.size) warnings.push(`Not yet modeled in this release: ${[...unsupported].join(', ')}.`);
  return { branches, warnings };
}

function chooseReferenceNode(group, branches, explicitGroundNodes) {
  for (const node of group) if (explicitGroundNodes.has(node)) return node;
  const source = branches.find((branch) => branch.kind === 'source' && group.has(branch.a) && group.has(branch.b));
  if (source) return source.b;
  return group.values().next().value;
}

function solveNetwork(components, branches, dt, capacitorState, topology) {
  const explicitGroundNodes = new Set();
  for (const component of components) {
    if (component.name === 'Ground') {
      const node = getPinNode(topology, component, 'gnd');
      if (node != null) explicitGroundNodes.add(node);
    }
  }

  const groups = graphComponents(branches);
  const nodeVoltages = new Map();
  const sourceCurrents = new Map();
  const branchCurrents = new Map();
  let singular = false;

  for (const group of groups) {
    const groupBranches = branches.filter((branch) => group.has(branch.a) && group.has(branch.b));
    const reference = chooseReferenceNode(group, groupBranches, explicitGroundNodes);
    const nodes = [...group].filter((node) => node !== reference);
    const nodeIndex = new Map(nodes.map((node, index) => [node, index]));
    const voltageSources = groupBranches.filter((branch) => branch.kind === 'source' || branch.kind === 'ammeter' || (branch.kind === 'diode' && branch.on));
    const sourceIndex = new Map(voltageSources.map((branch, index) => [branch, nodes.length + index]));
    const size = nodes.length + voltageSources.length;
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));
    const rhs = Array(size).fill(0);

    const stampConductance = (a, b, conductance) => {
      const ia = nodeIndex.get(a);
      const ib = nodeIndex.get(b);
      if (ia != null) matrix[ia][ia] += conductance;
      if (ib != null) matrix[ib][ib] += conductance;
      if (ia != null && ib != null) {
        matrix[ia][ib] -= conductance;
        matrix[ib][ia] -= conductance;
      }
    };
    const stampCurrent = (a, b, currentFromAToB) => {
      const ia = nodeIndex.get(a);
      const ib = nodeIndex.get(b);
      if (ia != null) rhs[ia] -= currentFromAToB;
      if (ib != null) rhs[ib] += currentFromAToB;
    };
    const stampVoltage = (branch, value) => {
      const k = sourceIndex.get(branch);
      const ia = nodeIndex.get(branch.a);
      const ib = nodeIndex.get(branch.b);
      if (ia != null) { matrix[ia][k] += 1; matrix[k][ia] += 1; }
      if (ib != null) { matrix[ib][k] -= 1; matrix[k][ib] -= 1; }
      rhs[k] += value;
    };

    for (const branch of groupBranches) {
      if (branch.kind === 'resistor') {
        stampConductance(branch.a, branch.b, 1 / branch.resistance);
      } else if (branch.kind === 'capacitor') {
        const conductance = branch.capacitance / Math.max(dt, 1e-9);
        const previousVoltage = capacitorState.get(String(branch.component.id)) || 0;
        stampConductance(branch.a, branch.b, conductance);
        stampCurrent(branch.a, branch.b, -conductance * previousVoltage);
      } else if (branch.kind === 'voltmeter') {
        stampConductance(branch.a, branch.b, 1 / branch.resistance);
      } else if (branch.kind === 'diode' && !branch.on) {
        stampConductance(branch.a, branch.b, 1e-9);
      }
    }
    for (const branch of voltageSources) {
      stampVoltage(branch, branch.kind === 'diode' ? branch.forwardVoltage : (branch.voltage || 0));
    }

    const solution = gaussianSolve(matrix, rhs);
    if (!solution) { singular = true; continue; }
    nodeVoltages.set(reference, 0);
    nodes.forEach((node, index) => nodeVoltages.set(node, solution[index]));
    for (const branch of voltageSources) sourceCurrents.set(String(branch.component.id), solution[sourceIndex.get(branch)]);

    for (const branch of groupBranches) {
      const va = nodeVoltages.get(branch.a) ?? 0;
      const vb = nodeVoltages.get(branch.b) ?? 0;
      let current = 0;
      if (branch.kind === 'resistor') current = (va - vb) / branch.resistance;
      else if (branch.kind === 'capacitor') {
        const previousVoltage = capacitorState.get(String(branch.component.id)) || 0;
        current = (branch.capacitance / Math.max(dt, 1e-9)) * ((va - vb) - previousVoltage);
      } else if (branch.kind === 'diode') current = branch.on ? (sourceCurrents.get(String(branch.component.id)) || 0) : (va - vb) * 1e-9;
      else if (branch.kind === 'source' || branch.kind === 'ammeter') current = sourceCurrents.get(String(branch.component.id)) || 0;
      else if (branch.kind === 'voltmeter') current = (va - vb) / branch.resistance;
      branchCurrents.set(String(branch.component.id), current);
    }
  }

  return { nodeVoltages, sourceCurrents, branchCurrents, singular };
}

function solveAtTime(components, topology, passive, timeSeconds, dt, capacitorState) {
  const sources = sourceBranches(components, topology, timeSeconds);
  const branches = [...sources, ...passive.branches];
  const diodeBranches = branches.filter((branch) => branch.kind === 'diode');
  let solved = null;

  // Piecewise-linear diode active-set iteration: off until forward biased, then a fixed forward drop.
  for (let iteration = 0; iteration < 5; iteration += 1) {
    solved = solveNetwork(components, branches, dt, capacitorState, topology);
    let changed = false;
    for (const diode of diodeBranches) {
      const va = solved.nodeVoltages.get(diode.a) ?? 0;
      const vb = solved.nodeVoltages.get(diode.b) ?? 0;
      const nextOn = diode.on ? (va - vb > diode.forwardVoltage - 0.08) : (va - vb > diode.forwardVoltage);
      if (Boolean(diode.on) !== nextOn) { diode.on = nextOn; changed = true; }
    }
    if (!changed) break;
  }
  if (!solved) solved = solveNetwork(components, branches, dt, capacitorState, topology);

  for (const branch of passive.branches) {
    if (branch.kind === 'capacitor') {
      const va = solved.nodeVoltages.get(branch.a) ?? 0;
      const vb = solved.nodeVoltages.get(branch.b) ?? 0;
      capacitorState.set(String(branch.component.id), va - vb);
    }
  }

  return { ...solved, topology, branches, warnings: passive.warnings, sourceCount: sources.length, passiveCount: passive.branches.length };
}

function rms(values) {
  if (!values.length) return 0;
  return Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / values.length);
}

function findScope(components) {
  return components.find((component) => component.name === 'DSO' || component.name === 'CRO') || null;
}

function referenceNodeForScope(scope, components, topology, chNode, networkGroups) {
  if (chNode == null) return null;
  const group = networkGroups.find((candidate) => candidate.has(chNode));
  if (!group) return null;

  if (scope) {
    const node = getPinNode(topology, scope, 'gnd');
    if (node != null && topology.pinIsConnected(scope.id, 'gnd') && group.has(node)) return node;
  }
  const ground = components.find((component) => component.name === 'Ground');
  if (ground) {
    const node = getPinNode(topology, ground, 'gnd');
    if (node != null && group.has(node)) return node;
  }
  const relatedSource = components.find((component) => {
    if (!['9V Battery', 'DC Voltage Source', 'AC Voltage Source', 'Signal Gen', 'Carrier Generator'].includes(component.name)) return false;
    const negativePin = component.name === 'Signal Gen' || component.name === 'Carrier Generator' ? 'gnd' : 'neg';
    const positivePin = component.name === 'Signal Gen' || component.name === 'Carrier Generator' ? 'out' : 'pos';
    return group.has(getPinNode(topology, component, positivePin)) || group.has(getPinNode(topology, component, negativePin));
  });
  if (relatedSource) {
    const negativePin = relatedSource.name === 'Signal Gen' || relatedSource.name === 'Carrier Generator' ? 'gnd' : 'neg';
    const node = getPinNode(topology, relatedSource, negativePin);
    return group.has(node) ? node : null;
  }
  return null;
}

/** Run a transient sample window. `durationSeconds` covers the complete 10-division display. */
export function simulateTransient(components = [], wires = [], componentPins = {}, options = {}) {
  if (!Array.isArray(components) || components.length === 0) {
    return { success: false, status: 'empty', message: 'Add a source and components before running the simulation.', samples: [], warnings: [] };
  }
  const steps = Math.max(120, Math.min(1600, Math.round(options.steps || 800)));
  const durationSeconds = Math.max(1e-6, Number(options.durationSeconds) || 0.01);
  const dt = durationSeconds / (steps - 1);
  const topology = buildSimulationTopology(components, wires, componentPins);
  const scope = findScope(components);
  const ch1Node = scope ? getPinNode(topology, scope, 'ch1') : null;
  const ch2Node = scope ? getPinNode(topology, scope, 'ch2') : null;
  const ch1Connected = Boolean(scope && topology.pinIsConnected(scope.id, 'ch1'));
  const ch2Connected = Boolean(scope && topology.pinIsConnected(scope.id, 'ch2'));
  const capacitorState = new Map();
  const passive = passiveBranches(components, topology);
  const initialBranches = [...sourceBranches(components, topology, 0), ...passive.branches];
  const networkGroups = graphComponents(initialBranches);
  const ch1Reference = scope ? referenceNodeForScope(scope, components, topology, ch1Node, networkGroups) : null;
  const ch2Reference = scope ? referenceNodeForScope(scope, components, topology, ch2Node, networkGroups) : null;
  const samples = [];
  const allWarnings = new Set();
  let singularAtAnyStep = false;
  let sourceCount = 0;
  let passiveCount = 0;
  let lastSolved = null;

  for (let index = 0; index < steps; index += 1) {
    const time = index * dt;
    const solved = solveAtTime(components, topology, passive, time, dt, capacitorState);
    solved.warnings.forEach((warning) => allWarnings.add(warning));
    singularAtAnyStep = singularAtAnyStep || solved.singular;
    sourceCount = solved.sourceCount;
    passiveCount = solved.passiveCount;
    lastSolved = solved;
    const channel1 = ch1Connected && ch1Reference != null
      ? (solved.nodeVoltages.get(ch1Node) ?? 0) - (solved.nodeVoltages.get(ch1Reference) ?? 0)
      : null;
    const channel2 = ch2Connected && ch2Reference != null
      ? (solved.nodeVoltages.get(ch2Node) ?? 0) - (solved.nodeVoltages.get(ch2Reference) ?? 0)
      : null;
    samples.push({ time, ch1: Number.isFinite(channel1) ? channel1 : null, ch2: Number.isFinite(channel2) ? channel2 : null });
  }

  const ch1Values = samples.map((sample) => sample.ch1).filter(Number.isFinite);
  const ch2Values = samples.map((sample) => sample.ch2).filter(Number.isFinite);
  const scopeMissing = !scope;
  if (scopeMissing) allWarnings.add('Place a DSO or CRO instrument and connect its CH1/CH2 and GND pins to measure waveforms.');
  if (sourceCount === 0) allWarnings.add('No supported voltage source is connected to a modeled circuit branch.');
  if (scope && !ch1Connected && !ch2Connected) allWarnings.add('Neither DSO channel is connected. Connect CH1 or CH2 to a circuit node.');
  if (scope && ((ch1Connected && ch1Reference == null) || (ch2Connected && ch2Reference == null))) allWarnings.add('A scope ground reference could not be resolved. Connect the DSO GND pin to circuit ground.');
  if (singularAtAnyStep) allWarnings.add('At least one circuit network could not be solved (floating or conflicting ideal-source connections). Check the wiring and ground references.');

  const hasUsableTrace = ch1Values.length > 0 || ch2Values.length > 0;
  const instrumentReadings = (components || []).flatMap((component) => {
    if (!lastSolved) return [];
    const findNode = (pinId) => getPinNode(lastSolved.topology, component, pinId);
    if (component.name === 'Voltmeter' || component.name === 'Multimeter') {
      const a = findNode(component.name === 'Multimeter' ? 'v_ohm' : 'pos');
      const b = findNode(component.name === 'Multimeter' ? 'com' : 'neg');
      if (a == null || b == null) return [];
      return [{ id: component.id, name: component.name, kind: 'voltage', value: (lastSolved.nodeVoltages.get(a) ?? 0) - (lastSolved.nodeVoltages.get(b) ?? 0), unit: 'V' }];
    }
    if (component.name === 'Ammeter') {
      const current = lastSolved.branchCurrents.get(String(component.id));
      return Number.isFinite(current) ? [{ id: component.id, name: component.name, kind: 'current', value: current, unit: 'A' }] : [];
    }
    return [];
  });
  const componentStates = (components || []).flatMap((component) => {
    if (component.name !== 'LED' || !lastSolved) return [];
    const current = lastSolved.branchCurrents.get(String(component.id)) || 0;
    const a = lastSolved.topology.nodeOf(component.id, 'anode');
    const b = lastSolved.topology.nodeOf(component.id, 'cathode');
    const forwardVoltage = (lastSolved.nodeVoltages.get(a) ?? 0) - (lastSolved.nodeVoltages.get(b) ?? 0);
    return [{
      id: component.id,
      name: component.name,
      current,
      forwardVoltage,
      lit: current > 0.002 && forwardVoltage >= 1.65
    }];
  });
  const success = sourceCount > 0 && !singularAtAnyStep;
  return {
    success,
    status: success ? (hasUsableTrace ? 'running' : 'no-probe-data') : 'incomplete',
    message: success ? 'Circuit equations solved for the displayed sample window.' : 'Simulation is incomplete; review the diagnostic messages.',
    samples,
    durationSeconds,
    dt,
    sourceCount,
    passiveCount,
    instrumentReadings,
    componentStates,
    scope: scope ? { id: scope.id, name: scope.name } : null,
    channels: {
      ch1: { connected: ch1Connected, referenceFound: ch1Reference != null, min: ch1Values.length ? Math.min(...ch1Values) : null, max: ch1Values.length ? Math.max(...ch1Values) : null, rms: rms(ch1Values), samples: ch1Values.length },
      ch2: { connected: ch2Connected, referenceFound: ch2Reference != null, min: ch2Values.length ? Math.min(...ch2Values) : null, max: ch2Values.length ? Math.max(...ch2Values) : null, rms: rms(ch2Values), samples: ch2Values.length }
    },
    warnings: [...allWarnings]
  };
}

export function formatEngineering(value, unit = 'V') {
  if (!Number.isFinite(value)) return '—';
  const magnitude = Math.abs(value);
  if (magnitude >= 1e6) return `${(value / 1e6).toFixed(2)} M${unit}`;
  if (magnitude >= 1e3) return `${(value / 1e3).toFixed(2)} k${unit}`;
  if (magnitude >= 1e-3 && magnitude < 1) return `${(value * 1e3).toFixed(2)} m${unit}`;
  if (magnitude > 0 && magnitude < 1e-3) return `${(value * 1e6).toFixed(2)} µ${unit}`;
  return `${value.toFixed(3)} ${unit}`;
}
