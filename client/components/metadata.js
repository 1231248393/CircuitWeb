export const getComponentMetadata = (type) => {
  switch (type) {
    case 'resistor': return { label: 'Resistance', units: ['Ω', 'kΩ'] };
    case 'voltage': return { label: 'Voltage', units: ['V'] };
    case 'signal_gen': return { label: 'Audio Freq', units: ['Hz'] };
    case 'carrier_gen': return { label: 'Carrier Freq', units: ['kHz'] };
    default: return { label: 'Value', units: [''] };
  }
};
