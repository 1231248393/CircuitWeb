export const getComponentMetadata = (type) => {
  switch (type) {
    case 'voltmeter': return { label: 'Mode', units: ['DC', 'AC'] };
    case 'ammeter': return { label: 'Mode', units: ['DC', 'AC'] };
    case 'resistor': return { label: 'Resistance', units: ['mΩ', 'Ω', 'kΩ', 'MΩ'] };
    case 'capacitor': return { label: 'Capacitance', units: ['pF', 'nF', 'µF', 'mF'] };
    case 'inductor': return { label: 'Inductance', units: ['µH', 'mH', 'H'] };
    case 'ldr': return { label: 'Light Level', units: ['0-100%'] };
    case 'voltage': return { label: 'Voltage', units: ['mV', 'V'] };
    case 'led': return { label: 'Color', units: ['Red', 'Green', 'Blue', 'Yellow'] };
    case 'rgb_led': return { label: 'Color', units: ['Red', 'Green', 'Blue', 'White'] };
    case 'seven_segment': return { label: 'Display', units: [] };
    case 'dc_motor': return { label: 'Speed', units: ['0-100%'] };
    case 'npn_transistor': return { label: 'Gain (hFE)', units: ['100'] };
    case 'switch': return { label: 'State', units: ['Open', 'Closed'] };
    case 'pushbutton': return { label: 'State', units: ['Open', 'Closed'] };
    case 'potentiometer': return { label: 'Value', units: ['0-100%'] };
    case 'arduino': return { label: '', units: [] };
    case 'signal_gen': return { label: 'Frequency', units: ['Hz', 'kHz', 'MHz'] };
    case 'adc': return { label: 'Sampling Rate', units: ['Hz', 'kHz'] };
    case 'dac': return { label: 'Bit Depth', units: ['bits'] };
    case 'oscilloscope': return { label: 'Display', units: [] };
        // 🔥 ADD THESE
    case 'diode': return { label: 'Type', units: ['1N4148', '1N4007', 'Zener'] };
    case 'transformer': return { label: 'Turns Ratio', units: ['1:1', '1:2', '2:1'] };
    default: return { label: 'Value', units: [] };
  }
};