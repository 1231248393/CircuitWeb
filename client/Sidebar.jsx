import React, { useState } from 'react';
import { useStore } from './store';
import { Search } from 'lucide-react';

const componentsList = [
  { type: 'resistor', label: 'Resistor' }, { type: 'voltage', label: 'Battery' }, { type: 'ground', label: 'Ground' },
  { type: 'diode', label: 'Diode' }, { type: 'transformer_ct', label: 'CT Transformer' },
  { type: 'signal_gen', label: 'Signal Gen' }, { type: 'carrier_gen', label: 'Carrier Gen' },
  { type: 'oscilloscope', label: 'DSO' }, { type: 'cro', label: 'CRO' }
];

export default function Sidebar() {
  const { addComponent } = useStore();
  const [search, setSearch] = useState('');

  const handleDragStart = (e, compType) => {
    e.dataTransfer.setData('componentType', compType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div style={{ width: '300px', borderLeft: '1px solid #ccc', padding: '15px', background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '15px', color: '#000' }}>Components</h3>
      <div style={{ position: 'relative', marginBottom: '15px' }}>
        <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 8px 8px 30px', borderRadius: '6px', border: '1px solid #ccc', color: '#000' }} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {componentsList.filter(c => c.label.toLowerCase().includes(search.toLowerCase())).map((comp) => (
          <div key={comp.type} draggable onDragStart={(e) => handleDragStart(e, comp.type)} onClick={() => addComponent(comp)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 5px', cursor: 'grab', border: '1px solid #ddd', borderRadius: '8px', background: '#fff', fontSize: '11px', color: '#000', fontWeight: 'bold' }}>
            <span>{comp.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
