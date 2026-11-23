export const getComponentMetadata = (type) => {
  switch (type) {
    case 'resistor': return { title: 'Resistor', fields: [ { key: 'name', label: 'Name', type: 'text' }, { key: 'value', label: 'Resistance', type: 'number', unit: 'kΩ', units: ['Ω', 'kΩ', 'MΩ'] } ] };
    case 'capacitor': return { title: 'Capacitor', fields: [ { key: 'name', label: 'Name', type: 'text' }, { key: 'value', label: 'Capacitance', type: 'number', unit: 'µF', units: ['pF', 'nF', 'µF', 'mF'] }, { key: 'voltage', label: 'Voltage', type: 'number', unit: 'V', units: ['V', 'mV'] } ] };
    case 'inductor': return { title: 'Inductor', fields: [ { key: 'name', label: 'Name', type: 'text' }, { key: 'value', label: 'Inductance', type: 'number', unit: 'mH', units: ['µH', 'mH', 'H'] } ] };
    case 'diode': return { title: 'Diode', fields: [ { key: 'name', label: 'Name', type: 'text' }, { key: 'value', label: 'Type', type: 'select', options: ['1N4148', '1N4007', 'Zener'] }, { key: 'voltage', label: 'Voltage', type: 'number', unit: 'V', units: ['V', 'mV'] } ] };
    case 'npn_transistor': return { title: 'NPN', fields: [ { key: 'name', label: 'Name', type: 'text' }, { key: 'value', label: 'Type', type: 'select', options: ['2N3904', 'BC547'] } ] };
    case 'voltage': return { title: 'Battery', fields: [ { key: 'name', label: 'Name', type: 'text' }, { key: 'value', label: 'Voltage', type: 'number', unit: 'V', units: ['V', 'mV'] } ] };
    case 'signal_gen': return { title: 'Signal Gen', fields: [ { key: 'name', label: 'Name', type: 'text' }, { key: 'value', label: 'Freq', type: 'number', unit: 'Hz', units: ['Hz', 'kHz'] } ] };
    case 'carrier_gen': return { title: 'Carrier Gen', fields: [ { key: 'name', label: 'Name', type: 'text' }, { key: 'value', label: 'Freq', type: 'number', unit: 'kHz', units: ['kHz', 'MHz'] } ] };
    default: return { title: type ? type.toUpperCase() : 'Component', fields: [ { key: 'name', label: 'Name', type: 'text' }, { key: 'value', label: 'Value', type: 'text' } ] };
  }
};
