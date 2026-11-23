export const getPins = (type) => {
  switch (type) {
    // --- BASIC ---
    case 'resistor': case 'capacitor': case 'inductor': case 'ldr': 
      return [ { name: 'left', label: 'Terminal 1', x: 20, y: 45 }, { name: 'right', label: 'Terminal 2', x: 120, y: 45 } ];
    case 'voltage':
      return [ { name: 'top', label: 'Positive (+)', x: 40, y: 20 }, { name: 'bottom', label: 'Negative (-)', x: 100, y: 20 } ];
    case 'ground':
      return [ { name: 'top', label: 'Ground', x: 70, y: 15 } ];
    case 'led':
      return [ { name: 'anode', label: 'Anode (+)', x: 55, y: 85 }, { name: 'cathode', label: 'Cathode (-)', x: 85, y: 85 } ];
    case 'rgb_led':
      return [ 
        { name: 'r', label: 'Red', x: 40, y: 85 }, { name: 'g', label: 'Green', x: 60, y: 85 }, 
        { name: 'b', label: 'Blue', x: 80, y: 85 }, { name: 'cathode', label: 'Cathode (-)', x: 100, y: 85 } 
      ];
    case 'switch': case 'pushbutton': case 'potentiometer':
      return [ { name: 'left', label: 'Terminal 1', x: 20, y: 45 }, { name: 'right', label: 'Terminal 2', x: 120, y: 45 } ];
    case 'dc_motor':
      return [ { name: 'left', label: 'Terminal 1', x: 55, y: 85 }, { name: 'right', label: 'Terminal 2', x: 85, y: 85 } ];
    case 'npn_transistor':
      return [ 
        { name: 'base', label: 'Base', x: 50, y: 85 }, 
        { name: 'collector', label: 'Collector', x: 70, y: 85 }, 
        { name: 'emitter', label: 'Emitter', x: 90, y: 85 } 
      ];
      
    // --- ADVANCED ---
    case 'seven_segment':
      return [
        { name: 'a', label: 'A', x: 35, y: 25 }, { name: 'b', label: 'B', x: 50, y: 25 },
        { name: 'c', label: 'C', x: 65, y: 25 }, { name: 'd', label: 'D', x: 80, y: 25 },
        { name: 'e', label: 'E', x: 95, y: 25 }, 
        { name: 'f', label: 'F', x: 35, y: 65 }, { name: 'g', label: 'G', x: 50, y: 65 },
        { name: 'dp', label: 'DP', x: 65, y: 65 }, { name: 'com1', label: 'COM1', x: 80, y: 65 }, 
        { name: 'com2', label: 'COM2', x: 95, y: 65 }
      ];
    case 'arduino':
      return [ 
        { name: 'aref', label: 'AREF', x: 58, y: 15 }, { name: 'gnd1', label: 'GND', x: 68, y: 15 },
        { name: 'd13', label: '13', x: 78, y: 15 }, { name: 'd12', label: '12', x: 88, y: 15 },
        { name: 'd11', label: '11', x: 98, y: 15 }, { name: 'd10', label: '10', x: 108, y: 15 },
        { name: 'd9', label: '9', x: 118, y: 15 }, { name: 'd8', label: '8', x: 128, y: 15 },
        { name: 'd7', label: '7', x: 148, y: 15 }, { name: 'd6', label: '6', x: 158, y: 15 },
        { name: 'd5', label: '5', x: 168, y: 15 }, { name: 'd4', label: '4', x: 178, y: 15 },
        { name: 'd3', label: '3', x: 188, y: 15 }, { name: 'd2', label: '2', x: 198, y: 15 },
        { name: 'd1', label: 'TX', x: 208, y: 15 }, { name: 'd0', label: 'RX', x: 218, y: 15 },
        { name: 'ioref', label: 'IOREF', x: 98, y: 185 }, { name: 'reset', label: 'RESET', x: 108, y: 185 },
        { name: '3v3', label: '3.3V', x: 118, y: 185 }, { name: '5v', label: '5V', x: 128, y: 185 },
        { name: 'gnd2', label: 'GND', x: 138, y: 185 }, { name: 'gnd3', label: 'GND', x: 148, y: 185 },
        { name: 'vin', label: 'VIN', x: 158, y: 185 },
        { name: 'a0', label: 'A0', x: 178, y: 185 }, { name: 'a1', label: 'A1', x: 188, y: 185 },
        { name: 'a2', label: 'A2', x: 198, y: 185 }, { name: 'a3', label: 'A3', x: 208, y: 185 },
        { name: 'a4', label: 'A4', x: 218, y: 185 }, { name: 'a5', label: 'A5', x: 228, y: 185 }
      ];
    case 'signal_gen': 
      return [ { name: 'out', label: 'Analog Output', x: 125, y: 45 }, { name: 'gnd', label: 'Ground', x: 70, y: 75 } ];
    case 'adc': return [ { name: 'in', label: 'Analog Input', x: 20, y: 45 }, { name: 'out', label: 'Digital Output', x: 120, y: 45 }, { name: 'gnd', label: 'Ground', x: 70, y: 85 } ];
    case 'dac': return [ { name: 'in', label: 'Digital Input', x: 20, y: 45 }, { name: 'out', label: 'Analog Output', x: 120, y: 45 }, { name: 'gnd', label: 'Ground', x: 70, y: 85 } ];
    case 'oscilloscope': return [ { name: 'ch1', label: 'Channel 1', x: 20, y: 45 }, { name: 'gnd', label: 'Ground', x: 70, y: 85 } ];

    // --- EXTRA ---
    case 'solar_cell': return [ { name: 'pos', label: 'Positive (+)', x: 48, y: 85 }, { name: 'neg', label: 'Negative (-)', x: 92, y: 85 } ];
    case 'coin_cell': return [ { name: 'pos', label: 'Positive (+)', x: 70, y: 20 }, { name: 'neg', label: 'Negative (-)', x: 70, y: 70 } ];
    case 'breadboard': return [ { name: 'a1', label: 'A1', x: 15, y: 23 }, { name: 'a2', label: 'A2', x: 24, y: 23 }, { name: 'b1', label: 'B1', x: 15, y: 67 }, { name: 'b2', label: 'B2', x: 24, y: 67 } ];
    
    // 🔥🔥🔥 METERS (THIS WAS MISSING OR BROKEN) 🔥🔥🔥
    case 'voltmeter': return [ { name: 'pos', label: 'Positive (+)', x: 10, y: 40 }, { name: 'neg', label: 'Negative (-)', x: 130, y: 40 } ];
    case 'ammeter': return [ { name: 'in', label: 'In', x: 10, y: 40 }, { name: 'out', label: 'Out', x: 130, y: 40 } ];

    // --- COMMUNICATION ---
    case 'diode':
      return [ { name: 'anode', label: 'Anode (+)', x: 20, y: 45 }, { name: 'cathode', label: 'Cathode (-)', x: 120, y: 45 } ];
    case 'transformer':
      return [ 
        { name: 'p1', label: 'Primary Top', x: 20, y: 20 }, 
        { name: 'p2', label: 'Primary Bottom', x: 20, y: 80 },
        { name: 's1', label: 'Secondary Top', x: 120, y: 20 },
        { name: 's2', label: 'Secondary Bottom', x: 120, y: 80 }
      ];
      
    default: return [];
  }
};