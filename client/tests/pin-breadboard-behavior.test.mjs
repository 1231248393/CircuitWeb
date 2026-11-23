import test from 'node:test';
import assert from 'node:assert/strict';
import { findBreadboardContacts } from '../src/electrical/breadboardContacts.js';
import { buildSimulationTopology, simulateTransient } from '../src/electrical/simulationEngine.js';
import { buildElectricalNets } from '../src/electrical/netlist.js';

const boardPins = [
  { id: 'hole-A1', x: 10, y: 30, electricalGroup: 'terminal-1-left' },
  { id: 'hole-B1', x: 10, y: 35, electricalGroup: 'terminal-1-left' },
  { id: 'hole-A2', x: 20, y: 30, electricalGroup: 'terminal-2-left' }
];
const componentPins = {
  Breadboard: boardPins,
  LED: [
    { id: 'anode', x: 42, y: 95 },
    { id: 'cathode', x: 58, y: 95 }
  ],
  '9V Battery': [{ id: 'pos', x: 41, y: 18 }, { id: 'neg', x: 60, y: 18 }],
  Resistor: [{ id: 'p1', x: 5, y: 50 }, { id: 'p2', x: 95, y: 50 }]
};

test('a component lead aligned with a breadboard hole joins that hole net', () => {
  const board = { id: 'bb', name: 'Breadboard', x: 0, y: 0, scale: 1.5 };
  const boardSize = 120 * board.scale;
  const hole = boardPins[0];
  const holeX = board.x + hole.x / 100 * boardSize;
  const holeY = board.y + hole.y / 100 * boardSize;
  const ledSize = 120 * 0.8;
  const led = {
    id: 'led', name: 'LED', scale: 0.8,
    x: holeX - 0.42 * ledSize,
    y: holeY - 0.95 * ledSize
  };
  const contacts = findBreadboardContacts([board, led], componentPins);
  assert.ok(contacts.some((contact) => contact.componentId === 'led' && contact.pinId === 'anode' && contact.breadboardPinId === 'hole-A1'));
  const topology = buildSimulationTopology([board, led], [], componentPins);
  assert.equal(topology.nodeOf('led', 'anode'), topology.nodeOf('bb', 'hole-A1'));
  const nets = buildElectricalNets([board, led], [], componentPins);
  assert.ok(nets.some((net) => net.nodes.includes('led::anode') && net.nodes.includes('bb::hole-A1')));
});

test('breadboard contact is not inferred when a component lead is away from a hole', () => {
  const board = { id: 'bb', name: 'Breadboard', x: 0, y: 0, scale: 1.5 };
  const led = { id: 'led', name: 'LED', x: 500, y: 500, scale: 0.8 };
  assert.equal(findBreadboardContacts([board, led], componentPins).length, 0);
});

test('LED reports lit only when forward current flows in a closed battery-resistor-LED path', () => {
  const pins = {
    '9V Battery': componentPins['9V Battery'],
    Resistor: componentPins.Resistor,
    LED: componentPins.LED
  };
  const components = [
    { id: 'b1', name: '9V Battery', val: '9', unit: 'V' },
    { id: 'r1', name: 'Resistor', val: '1000', unit: 'Ω' },
    { id: 'led1', name: 'LED' }
  ];
  const wires = [
    { id: 'w1', startComp: 'b1', startPin: 'pos', endComp: 'r1', endPin: 'p1' },
    { id: 'w2', startComp: 'r1', startPin: 'p2', endComp: 'led1', endPin: 'anode' },
    { id: 'w3', startComp: 'led1', startPin: 'cathode', endComp: 'b1', endPin: 'neg' }
  ];
  const result = simulateTransient(components, wires, pins, { durationSeconds: 0.01, steps: 120 });
  const ledState = result.componentStates.find((state) => state.id === 'led1');
  assert.equal(result.success, true);
  assert.ok(ledState && ledState.lit, `expected LED lit, got ${JSON.stringify(ledState)}`);
  const openResult = simulateTransient([{ id: 'led2', name: 'LED' }], [], { LED: pins.LED }, { durationSeconds: 0.01, steps: 30 });
  assert.equal(openResult.componentStates.find((state) => state.id === 'led2').lit, false);
});


test('direct physical pin contact joins two component terminals without a wire object', () => {
  const pins = {
    '9V Battery': [
      { id: 'pos', x: 41, y: 18 },
      { id: 'neg', x: 60, y: 18 }
    ],
    Multimeter: [
      { id: 'v_ohm', x: 38, y: 70 },
      { id: 'com', x: 62, y: 70 }
    ]
  };
  // The meter probes are placed directly over the battery snap terminals.
  const components = [
    { id: 'meter', name: 'Multimeter', x: 100, y: 100, scale: 1 },
    { id: 'battery', name: '9V Battery', x: 89, y: 159, scale: 1.15, val: '9', unit: 'V' }
  ];
  const topology = buildSimulationTopology(components, [], pins);
  assert.equal(topology.nodeOf('meter', 'v_ohm'), topology.nodeOf('battery', 'pos'));
  assert.equal(topology.nodeOf('meter', 'com'), topology.nodeOf('battery', 'neg'));
  assert.equal(topology.pinIsConnected('meter', 'v_ohm'), true);
  const nets = buildElectricalNets(components, [], pins);
  assert.ok(nets.some((net) => net.nodes.includes('meter::v_ohm') && net.nodes.includes('battery::pos')));
  assert.ok(nets.some((net) => net.nodes.includes('meter::com') && net.nodes.includes('battery::neg')));

  const result = simulateTransient(components, [], pins, { durationSeconds: 0.01, steps: 120 });
  const reading = result.instrumentReadings.find((item) => item.id === 'meter');
  assert.ok(reading, 'expected a multimeter reading from direct physical contact');
  assert.ok(Math.abs(reading.value - 9) < 1e-6, `expected 9 V, got ${reading.value}`);
});

test('direct physical contact opens when parts are moved beyond the contact tolerance', () => {
  const pins = {
    '9V Battery': [{ id: 'pos', x: 41, y: 18 }, { id: 'neg', x: 60, y: 18 }],
    Multimeter: [{ id: 'v_ohm', x: 38, y: 70 }, { id: 'com', x: 62, y: 70 }]
  };
  const meter = { id: 'meter', name: 'Multimeter', x: 100, y: 100, scale: 1 };
  const battery = { id: 'battery', name: '9V Battery', x: 89, y: 159, scale: 1.15, val: '9', unit: 'V' };
  const touching = buildSimulationTopology([meter, battery], [], pins);
  assert.equal(touching.nodeOf('meter', 'v_ohm'), touching.nodeOf('battery', 'pos'));
  const separated = buildSimulationTopology([meter, { ...battery, x: 300 }], [], pins);
  assert.notEqual(separated.nodeOf('meter', 'v_ohm'), separated.nodeOf('battery', 'pos'));
});
