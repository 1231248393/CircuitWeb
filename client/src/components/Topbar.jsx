import React from 'react';

export default function Topbar({ activeView, setActiveView }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderBottom: '1px solid #ccc', padding: '10px 20px', height: '60px', fontFamily: 'sans-serif' }}>
      
      {/* Logo */}
      <div style={{ fontWeight: 'bold', color: '#0d9488', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
        <span>⚡</span> CircuitWeb
      </div>

      {/* Center Tabs */}
      <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
        {['circuits', 'schematic', 'dashboard'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveView(tab)}
            style={{
              padding: '6px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeView === tab ? 'bold' : 'normal',
              backgroundColor: activeView === tab ? 'white' : 'transparent',
              boxShadow: activeView === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              color: activeView === tab ? '#1f2937' : '#6b7280'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ backgroundColor: '#14b8a6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Save</button>
        <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Simulate</button>
      </div>
    </div>
  );
}
