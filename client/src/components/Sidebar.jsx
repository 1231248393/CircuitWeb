import React from 'react';

export default function Sidebar() {
  const components = ['Resistor', 'Capacitor', 'Diode', 'Inductor', 'AC Source', 'Ground', 'Oscilloscope'];
  
  return (
    <div style={{ width: '200px', backgroundColor: 'white', borderRight: '1px solid #e5e7eb', padding: '16px', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '16px' }}>Components</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {components.map(c => (
          <div key={c} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', cursor: 'grab', backgroundColor: '#f9fafb' }}>
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
