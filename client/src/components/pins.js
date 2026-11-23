export const getPins = (type) => {
  switch (type) {
    case 'resistor': case 'capacitor': case 'inductor': case 'ldr': 
      return [ { name: 'left', label: 'Terminal 1', x: 20, y: 45 }, { name: 'right', label: 'Terminal 2', x: 120, y: 45 } ];
    case 'voltage': return [ { name: 'top', label: 'Positive (+)', x: 40, y: 20 }, { name: 'bottom', label: 'Negative (-)', x: 100, y: 20 } ];
    case 'ground': return [ { name: 'top', label: 'Ground', x: 70, y: 15 } ];
    case 'led': return [ { name: 'anode', label: 'Anode (+)', x: 55, y: 85 }, { name: 'cathode', label: 'Cathode (-)', x: 85, y: 85 } ];
    case 'rgb_led': return [ { name: 'r', label: 'Red', x: 40, y: 85 }, { name: 'g', label: 'Green', x: 60, y: 85 }, { name: 'b', label: 'Blue', x: 80, y: 85 }, { name: 'cathode', label: 'Cathode (-)', x: 100, y: 85 } ];
    case 'switch': case 'pushbutton': case 'potentiometer': return [ { name: 'left', label: 'Terminal 1', x: 20, y: 45 }, { name: 'right', label: 'Terminal 2', x: 120, y: 45 } ];
    case 'dc_motor': return [ { name: 'left', label: 'Terminal 1', x: 55, y: 85 }, { name: 'right', label: 'Terminal 2', x: 85, y: 85 } ];
    case 'seven_segment': return [ { name: 'a', label: 'Seg A', x: 35, y: 25 }, { name: 'b', label: 'Seg B', x: 50, y: 25 }, { name: 'c', label: 'Seg C', x: 65, y: 25 }, { name: 'd', label: 'Seg D', x: 80, y: 25 }, { name: 'e', label: 'Seg E', x: 95, y: 25 }, { name: 'f', label: 'Seg F', x: 35, y: 65 }, { name: 'g', label: 'Seg G', x: 50, y: 65 }, { name: 'dp', label: 'Decimal', x: 65, y: 65 }, { name: 'com1', label: 'Common 1', x: 80, y: 65 }, { name: 'com2', label: 'Common 2', x: 95, y: 65 } ];
    case 'arduino': return [ 
      { name: 'aref', label: 'AREF', x: 58, y: 25 }, { name: 'gnd1', label: 'GND', x: 68, y: 25 },
      { name: 'd13', label: 'Digital 13', x: 78, y: 25 }, { name: 'd12', label: 'Digital 12', x: 88, y: 25 },
      { name: 'd11', label: 'Digital 11 (PWM)', x: 98, y: 25 }, { name: 'd10', label: 'Digital 10 (PWM)', x: 108, y: 25 },
      { name: 'd9', label: 'Digital 9 (PWM)', x: 118, y: 25 }, { name: 'd8', label: 'Digital 8', x: 128, y: 25 },
      { name: 'd7', label: 'Digital 7', x: 148, y: 25 }, { name: 'd6', label: 'Digital 6 (PWM)', x: 158, y: 25 },
      { name: 'd5', label: 'Digital 5 (PWM)', x: 168, y: 25 }, { name: 'd4', label: 'Digital 4', x: 178, y: 25 },
      { name: 'd3', label: 'Digital 3 (PWM)', x: 188, y: 25 }, { name: 'd2', label: 'Digital 2', x: 198, y: 25 },
      { name: 'd1', label: 'Digital 1 (TX)', x: 208, y: 25 }, { name: 'd0', label: 'Digital 0 (RX)', x: 218, y: 25 },
      { name: 'ioref', label: 'IOREF', x: 98, y: 175 }, { name: 'reset', label: 'RESET', x: 108, y: 175 },
      { name: '3v3', label: '3.3V', x: 118, y: 175 }, { name: '5v', label: '5V Power', x: 128, y: 175 },
      { name: 'gnd2', label: 'GND', x: 138, y: 175 }, { name: 'gnd3', label: 'GND', x: 148, y: 175 },
      { name: 'vin', label: 'VIN', x: 158, y: 175 },
      { name: 'a0', label: 'Analog A0', x: 178, y: 175 }, { name: 'a1', label: 'Analog A1', x: 188, y: 175 },
      { name: 'a2', label: 'Analog A2', x: 198, y: 175 }, { name: 'a3', label: 'Analog A3', x: 208, y: 175 },
      { name: 'a4', label: 'Analog A4', x: 218, y: 175 }, { name: 'a5', label: 'Analog A5', x: 228, y: 175 }
    ];
    case 'signal_gen': case 'carrier_gen': return [ { name: 'out', label: 'Output', x: 125, y: 45 }, { name: 'gnd', label: 'Ground', x: 70, y: 75 } ];
    case 'adc': return [ { name: 'in', label: 'Analog In', x: 20, y: 45 }, { name: 'out', label: 'Digital Out', x: 120, y: 45 }, { name: 'gnd', label: 'Ground', x: 70, y: 85 } ];
    case 'dac': return [ { name: 'in', label: 'Digital In', x: 20, y: 45 }, { name: 'out', label: 'Analog Out', x: 120, y: 45 }, { name: 'gnd', label: 'Ground', x: 70, y: 85 } ];
    case 'usb_cable': return [];
    case 'cro': case 'oscilloscope': return [ { name: 'ch1', label: 'Channel 1', x: 20, y: 35 }, { name: 'ch2', label: 'Channel 2', x: 20, y: 55 }, { name: 'gnd', label: 'Ground', x: 70, y: 85 } ];
    case 'solar_cell': return [ { name: 'pos', label: 'Positive (+)', x: 48, y: 85 }, { name: 'neg', label: 'Negative (-)', x: 92, y: 85 } ];
    case 'coin_cell': return [ { name: 'pos', label: 'Positive (+)', x: 70, y: 20 }, { name: 'neg', label: 'Negative (-)', x: 70, y: 70 } ];
    case 'breadboard': return [ { name: 'a1', label: 'Hole A1', x: 15, y: 23 }, { name: 'a2', label: 'Hole A2', x: 24, y: 23 }, { name: 'b1', label: 'Hole B1', x: 15, y: 67 }, { name: 'b2', label: 'Hole B2', x: 24, y: 67 } ];
    case 'voltmeter': return [ { name: 'pos', label: 'Positive (+)', x: 20, y: 40 }, { name: 'neg', label: 'Negative (-)', x: 120, y: 40 } ];
    case 'ammeter': return [ { name: 'in', label: 'Current In', x: 20, y: 40 }, { name: 'out', label: 'Current Out', x: 120, y: 40 } ];
    case 'transformer': return [ { name: 'p1', label: 'Pri Top', x: 20, y: 20 }, { name: 'p2', label: 'Pri Bot', x: 20, y: 70 }, { name: 's1', label: 'Sec Top', x: 120, y: 20 }, { name: 's2', label: 'Sec Bot', x: 120, y: 70 } ];
    case 'transformer_ct': return [ { name: 'p1', label: 'Pri Top', x: 20, y: 15 }, { name: 'ct_p', label: 'Pri CT', x: 20, y: 45 }, { name: 'p2', label: 'Pri Bot', x: 20, y: 75 }, { name: 's1', label: 'Sec Top', x: 120, y: 15 }, { name: 'ct_s', label: 'Sec CT', x: 120, y: 45 }, { name: 's2', label: 'Sec Bot', x: 120, y: 75 } ];
    case 'diode': return [ { name: 'anode', label: 'Anode', x: 20, y: 45 }, { name: 'cathode', label: 'Cathode', x: 120, y: 45 } ];
    case 'ac_source': return [ { name: 'pos', label: 'AC (+)', x: 125, y: 45 }, { name: 'neg', label: 'AC (-)', x: 70, y: 75 } ];
    case 'op_amp': return [ { name: 'in_pos', label: 'Inverting (-)', x: 20, y: 30 }, { name: 'in_neg', label: 'Non-Inverting (+)', x: 20, y: 60 }, { name: 'out', label: 'Output', x: 120, y: 45 }, { name: 'v_pos', label: 'VCC (+)', x: 70, y: 10 }, { name: 'v_neg', label: 'VEE (-)', x: 70, y: 80 } ];
    case 'jfet': return [ { name: 'gate', label: 'Gate', x: 20, y: 45 }, { name: 'drain', label: 'Drain', x: 70, y: 15 }, { name: 'source', label: 'Source', x: 70, y: 75 } ];
    case 'varactor': return [ { name: 'anode', label: 'Anode', x: 20, y: 45 }, { name: 'cathode', label: 'Cathode', x: 120, y: 45 } ];
    default: return [];
  }
};
