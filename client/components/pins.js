export const getPins = (type) => {
  switch (type) {
    case 'resistor': case 'capacitor': case 'inductor': return [ { name: 'left', x: 20, y: 45 }, { name: 'right', x: 120, y: 45 } ];
    case 'voltage': return [ { name: 'top', x: 40, y: 20 }, { name: 'bottom', x: 100, y: 20 } ];
    case 'ground': return [ { name: 'top', x: 70, y: 15 } ];
    case 'led': return [ { name: 'anode', x: 55, y: 85 }, { name: 'cathode', x: 85, y: 85 } ];
    case 'switch': case 'pushbutton': case 'potentiometer': return [ { name: 'left', x: 20, y: 45 }, { name: 'right', x: 120, y: 45 } ];
    case 'diode': return [ { name: 'anode', x: 20, y: 45 }, { name: 'cathode', x: 120, y: 45 } ];
    case 'transformer': return [ { name: 'p1', x: 20, y: 20 }, { name: 'p2', x: 20, y: 70 }, { name: 's1', x: 120, y: 20 }, { name: 's2', x: 120, y: 70 } ];
    case 'transformer_ct': return [ { name: 'p1', x: 20, y: 15 }, { name: 'ct_p', x: 20, y: 45 }, { name: 'p2', x: 20, y: 75 }, { name: 's1', x: 120, y: 15 }, { name: 'ct_s', x: 120, y: 45 }, { name: 's2', x: 120, y: 75 } ];
    case 'voltmeter': return [ { name: 'pos', x: 20, y: 40 }, { name: 'neg', x: 120, y: 40 } ];
    case 'ammeter': return [ { name: 'in', x: 20, y: 40 }, { name: 'out', x: 120, y: 40 } ];
    case 'signal_gen': case 'carrier_gen': return [ { name: 'out', x: 125, y: 45 }, { name: 'gnd', x: 70, y: 75 } ];
    case 'cro': case 'oscilloscope': return [ { name: 'ch1', x: 20, y: 35 }, { name: 'ch2', x: 20, y: 55 }, { name: 'gnd', x: 70, y: 85 } ];
    default: return []; // Fallback for Arduino/ADC etc.
  }
};
