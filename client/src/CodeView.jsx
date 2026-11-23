import React, { useState } from 'react';
import { Play, Terminal } from 'lucide-react';
import { useStore } from './store';

export default function CodeView() {
  const { runSimulation, setActiveTab } = useStore();
  const [code, setCode] = useState(`// CircuitWeb Auto-Generated Code\n\nvoid setup() {\n  // Initialize pins\n}\n\nvoid loop() {\n  // Your code here\n}`);
  
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e1e1e', width: '100%' }}>
      <div style={{ height: '50px', background: '#2d2d2d', display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #333', color: '#fff' }}>
        <Terminal size={18} color="#00b4d8" style={{ marginRight: '10px' }} />
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>sketch.ino</span>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ flex: 1, backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '15px', border: 'none', outline: 'none', fontFamily: 'monospace', fontSize: '14px', resize: 'none' }}
      />
    </div>
  );
}
