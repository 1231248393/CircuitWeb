import React from 'react';

export default function Canvas({ experiment }) {
  
  // 🟢 MODE 1: GUIDED LAB (Opened from SimuLab)
  if (experiment === 'am-demodulation') {
    return (
      <div style={{ flex: 1, backgroundColor: '#f8fafc', margin: '16px', borderRadius: '8px', border: '2px solid #cbd5e1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#0b5c9e', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
          Guided Experiment Mode
        </div>

        {/* 🚨 PRE-DRAWN CIRCUIT FOR THE EXPERIMENT */}
        <svg viewBox="0 0 700 280" style={{ width: '80%', maxWidth: '800px', height: 'auto' }}>
          {/* AC Source */}
          <circle cx="80" cy="140" r="25" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
          <path d="M 65 140 Q 72.5 120 80 140 T 95 140" fill="none" stroke="#0b5c9e" strokeWidth="2.5" />
          <text x="80" y="190" fontSize="14" fill="#0f172a" fontWeight="bold" textAnchor="middle">Input (AM)</text>

          {/* Wires */}
          <line x1="80" y1="115" x2="80" y2="90" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="80" y1="90" x2="140" y2="90" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="140" y1="90" x2="140" y2="130" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="80" y1="165" x2="80" y2="240" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="165" y1="140" x2="400" y2="140" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="80" y1="240" x2="600" y2="240" stroke="#0f172a" strokeWidth="2.5" />

          {/* Diode */}
          <polygon points="140,130 140,150 165,140" fill="#0f172a" />
          <line x1="165" y1="130" x2="165" y2="150" stroke="#0f172a" strokeWidth="3" />

          {/* Capacitor */}
          <line x1="250" y1="140" x2="250" y2="180" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="220" y1="180" x2="280" y2="180" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="220" y1="195" x2="280" y2="195" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="250" y1="195" x2="250" y2="240" stroke="#0f172a" strokeWidth="2.5" />

          {/* Resistor */}
          <path d="M 460 100 L 475 85 L 490 115 L 505 85 L 520 115 L 535 85 L 550 100" fill="none" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="400" y1="140" x2="400" y2="100" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="400" y1="100" x2="460" y2="100" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="550" y1="100" x2="600" y2="100" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="600" y1="100" x2="600" y2="240" stroke="#0f172a" strokeWidth="2.5" />

          {/* CRO Output */}
          <circle cx="630" cy="140" r="6" fill="#0b5c9e" />
          <line x1="600" y1="140" x2="630" y2="140" stroke="#0f172a" strokeWidth="2.5" />
          <text x="650" y="145" fontSize="16" fill="#0f172a" fontWeight="bold">+</text>
          <text x="650" y="245" fontSize="16" fill="#0f172a" fontWeight="bold">-</text>
        </svg>

      </div>
    );
  }

  // 🔵 MODE 2: SANDBOX (Opened normally at localhost:5173)
  return (
    <div style={{ flex: 1, backgroundColor: '#f8fafc', margin: '16px', borderRadius: '8px', border: '2px dashed #cbd5e1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      
      <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#64748b', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
        Sandbox Mode
      </div>

      <div style={{ textAlign: 'center', color: '#94a3b8' }}>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '64px', height: '64px', margin: '0 auto 16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#64748b' }}>Blank Canvas</h2>
        <p>Drag and drop components from the left to start designing.</p>
      </div>

    </div>
  );
}
