import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSimulationTopology, simulateTransient } from '../src/electrical/simulationEngine.js';

const pins = {
  'DC Voltage Source': [{ id: 'pos' }, { id: 'neg' }],
  'AC Voltage Source': [{ id: 'pos' }, { id: 'neg' }],
  'Signal Gen': [{ id: 'out' }, { id: 'gnd' }],
  'Resistor': [{ id: 'p1' }, { id: 'p2' }],
  'Capacitor': [{ id: 'top' }, { id: 'bottom' }],
  'Ground': [{ id: 'gnd' }],
  'Diode': [{ id: 'anode' }, { id: 'cathode' }],
  'DSO': [{ id: 'ch1' }, { id: 'ch2' }, { id: 'gnd' }],
  'Ammeter': [{ id: 'in' }, { id: 'out' }],
  'Voltmeter': [{ id: 'pos' }, { id: 'neg' }],
  'Breadboard': [
    { id: 'hole-A1', electricalGroup: 'row-1-left' },
    { id: 'hole-B1', electricalGroup: 'row-1-left' },
    { id: 'hole-F1', electricalGroup: 'row-1-right' }
  ]
};

test('breadboard holes in the same electrical group share one node', () => {
  const components = [{ id: 'bb', name: 'Breadboard' }];
  const topology = buildSimulationTopology(components, [], pins);
  assert.equal(topology.nodeOf('bb', 'hole-A1'), topology.nodeOf('bb', 'hole-B1'));
  assert.notEqual(topology.nodeOf('bb', 'hole-A1'), topology.nodeOf('bb', 'hole-F1'));
});

test('DC resistor divider produces approximately half the source voltage', () => {
  const components = [
    { id: 'v1', name: 'DC Voltage Source', val: '10', unit: 'V' },
    { id: 'r1', name: 'Resistor', val: '1000', unit: 'Ω' },
    { id: 'r2', name: 'Resistor', val: '1000', unit: 'Ω' },
    { id: 'g1', name: 'Ground' },
    { id: 'scope', name: 'DSO' }
  ];
  const wires = [
    { id: 'w1', startComp: 'v1', startPin: 'pos', endComp: 'r1', endPin: 'p1' },
    { id: 'w2', startComp: 'r1', startPin: 'p2', endComp: 'r2', endPin: 'p1' },
    { id: 'w3', startComp: 'r2', startPin: 'p2', endComp: 'g1', endPin: 'gnd' },
    { id: 'w4', startComp: 'v1', startPin: 'neg', endComp: 'g1', endPin: 'gnd' },
    { id: 'w5', startComp: 'scope', startPin: 'ch1', endComp: 'r1', endPin: 'p2' },
    { id: 'w6', startComp: 'scope', startPin: 'gnd', endComp: 'g1', endPin: 'gnd' }
  ];
  const result = simulateTransient(components, wires, pins, { durationSeconds: 0.01, steps: 120 });
  assert.equal(result.success, true);
  assert.equal(result.channels.ch1.connected, true);
  assert.ok(Math.abs(result.channels.ch1.rms - 5) < 0.05, `expected about 5 V DC, got ${result.channels.ch1.rms}`);
});

test('signal generator waveform is measured from connected DSO nodes', () => {
  const components = [
    { id: 'sg', name: 'Signal Gen', wave: 'Sine', freq: '1 kHz', amp: '4 Vpp' },
    { id: 'scope', name: 'DSO' }
  ];
  const wires = [
    { id: 'w1', startComp: 'sg', startPin: 'out', endComp: 'scope', endPin: 'ch1' },
    { id: 'w2', startComp: 'sg', startPin: 'gnd', endComp: 'scope', endPin: 'gnd' }
  ];
  const result = simulateTransient(components, wires, pins, { durationSeconds: 0.01, steps: 1000 });
  assert.equal(result.success, true);
  assert.equal(result.channels.ch1.connected, true);
  assert.ok(Math.abs(result.channels.ch1.rms - (2 / Math.sqrt(2))) < 0.03);
});

test('an unconnected circuit does not invent a DSO trace', () => {
  const components = [
    { id: 'sg', name: 'Signal Gen', wave: 'Sine', freq: '1 kHz', amp: '4 Vpp' },
    { id: 'scope', name: 'DSO' }
  ];
  const result = simulateTransient(components, [], pins, { durationSeconds: 0.01, steps: 120 });
  assert.equal(result.channels.ch1.connected, false);
  assert.equal(result.channels.ch1.samples, 0);
  assert.equal(result.status, 'no-probe-data');
});


test('series ammeter reports current calculated through a resistor load', () => {
  const components = [
    { id: 'v1', name: 'DC Voltage Source', val: '10', unit: 'V' },
    { id: 'a1', name: 'Ammeter' },
    { id: 'r1', name: 'Resistor', val: '1000', unit: 'Ω' },
    { id: 'g1', name: 'Ground' }
  ];
  const wires = [
    { id: 'w1', startComp: 'v1', startPin: 'pos', endComp: 'a1', endPin: 'in' },
    { id: 'w2', startComp: 'a1', startPin: 'out', endComp: 'r1', endPin: 'p1' },
    { id: 'w3', startComp: 'r1', startPin: 'p2', endComp: 'g1', endPin: 'gnd' },
    { id: 'w4', startComp: 'v1', startPin: 'neg', endComp: 'g1', endPin: 'gnd' }
  ];
  const result = simulateTransient(components, wires, pins, { durationSeconds: 0.001, steps: 120 });
  const ammeter = result.instrumentReadings.find((reading) => reading.id === 'a1');
  assert.ok(ammeter);
  assert.ok(Math.abs(Math.abs(ammeter.value) - 0.01) < 1e-6, `expected 10 mA, got ${ammeter.value}`);
});

test('capacitor transient shows gradual RC charging rather than a fabricated fixed waveform', () => {
  const components = [
    { id: 'v1', name: 'DC Voltage Source', val: '5', unit: 'V' },
    { id: 'r1', name: 'Resistor', val: '1000', unit: 'Ω' },
    { id: 'c1', name: 'Capacitor', val: '10', unit: 'uF' },
    { id: 'g1', name: 'Ground' },
    { id: 'scope', name: 'DSO' }
  ];
  const wires = [
    { id: 'w1', startComp: 'v1', startPin: 'pos', endComp: 'r1', endPin: 'p1' },
    { id: 'w2', startComp: 'r1', startPin: 'p2', endComp: 'c1', endPin: 'top' },
    { id: 'w3', startComp: 'c1', startPin: 'bottom', endComp: 'g1', endPin: 'gnd' },
    { id: 'w4', startComp: 'v1', startPin: 'neg', endComp: 'g1', endPin: 'gnd' },
    { id: 'w5', startComp: 'scope', startPin: 'ch1', endComp: 'c1', endPin: 'top' },
    { id: 'w6', startComp: 'scope', startPin: 'gnd', endComp: 'g1', endPin: 'gnd' }
  ];
  const result = simulateTransient(components, wires, pins, { durationSeconds: 0.01, steps: 400 });
  assert.equal(result.success, true);
  assert.ok(result.samples[0].ch1 < 0.1, 'initial capacitor voltage should be near zero');
  assert.ok(result.samples.at(-1).ch1 > 2.5 && result.samples.at(-1).ch1 < 4.0, 'voltage should rise toward the 5 V source');
});


test('guided diode RC detector preset produces measured input and output node samples', () => {
  const components = [
    { id: 'c1', name: 'Signal Gen', wave: 'Sine', freq: '1 kHz', amp: '5 Vpp' },
    { id: 'c2', name: 'Diode' },
    { id: 'c3', name: 'Capacitor', val: '0.01', unit: 'uF' },
    { id: 'c4', name: 'Resistor', val: '1000', unit: 'Ω' },
    { id: 'c6', name: 'Ground' },
    { id: 'c5', name: 'DSO' }
  ];
  const wires = [
    { id: 'w1', startComp: 'c1', startPin: 'out', endComp: 'c2', endPin: 'anode' },
    { id: 'w2', startComp: 'c2', startPin: 'cathode', endComp: 'c3', endPin: 'top' },
    { id: 'w3', startComp: 'c2', startPin: 'cathode', endComp: 'c4', endPin: 'p1' },
    { id: 'w4', startComp: 'c3', startPin: 'bottom', endComp: 'c6', endPin: 'gnd' },
    { id: 'w5', startComp: 'c4', startPin: 'p2', endComp: 'c6', endPin: 'gnd' },
    { id: 'w6', startComp: 'c1', startPin: 'gnd', endComp: 'c6', endPin: 'gnd' },
    { id: 'w7', startComp: 'c1', startPin: 'out', endComp: 'c5', endPin: 'ch1' },
    { id: 'w8', startComp: 'c2', startPin: 'cathode', endComp: 'c5', endPin: 'ch2' },
    { id: 'w9', startComp: 'c6', startPin: 'gnd', endComp: 'c5', endPin: 'gnd' }
  ];
  const result = simulateTransient(components, wires, pins, { durationSeconds: 0.01, steps: 300 });
  assert.equal(result.success, true);
  assert.equal(result.channels.ch1.connected, true);
  assert.equal(result.channels.ch2.connected, true);
  assert.ok(result.channels.ch1.rms > 1);
  assert.ok(result.channels.ch2.rms >= 0);
});
