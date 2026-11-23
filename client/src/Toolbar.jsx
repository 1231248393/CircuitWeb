import React, { useState } from 'react';
import { useStore } from './store';
import { CircuitBoard, Copy, ClipboardPaste, Trash2, Undo, Redo, MessageSquare, Eye, Play, Square, Send } from 'lucide-react';

export default function TopBar() {
  const { isSimulating, setIsSimulating, setSimulation, selectedId, removeComponent } = useStore();
  const [activeTab, setActiveTab] = useState('Circuits');

  const handleStartSim = () => {
    setIsSimulating(true);
    setSimulation({ message: "Simulation Running... Connect a Battery, Resistor, and LED to see it glow!" });
  };

  const handleStopSim = () => {
    setIsSimulating(false);
    setSimulation(null);
  };
  
  const handleDelete = () => {
    if (selectedId) {
      removeComponent(selectedId);
    } else {
      alert("Click a component to select it first, then press Delete.");
    }
  };

  const handleSendTo = () => {
    alert("Exporting to Arduino, PCB, or Gerber... (Feature coming soon!)");
  };

  return (
    <div style={{ height: '60px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontFamily: 'sans-serif', position: 'relative', zIndex: 1000 }}>
      
      {/* Left Side: Logo and Project Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#1890ff', fontWeight: 'bold', fontSize: '18px' }}>
          <CircuitBoard size={24} /> CircuitWeb
        </div>
        <input 
          type="text" 
          defaultValue="Dazzling Fuffy-Wolf" 
          style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', width: '120px', outline: 'none' }} 
        />
      </div>

      {/* Center: Tinkercad-Style Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f8f9fa', padding: '4px', borderRadius: '8px', border: '1px solid #eee' }}>
        <button title="Copy" style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}><Copy size={18} /></button>
        <button title="Paste" style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}><ClipboardPaste size={18} /></button>
        <button title="Delete" onClick={handleDelete} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f' }}><Trash2 size={18} /></button>
        <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 5px' }} />
        <button title="Undo" style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}><Undo size={18} /></button>
        <button title="Redo" style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}><Redo size={18} /></button>
        <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 5px' }} />
        <button title="Comment" style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}><MessageSquare size={18} /></button>
        <button title="View Options" style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}><Eye size={18} /></button>
      </div>

      {/* Right Side: Tabs and Simulation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', background: '#f0f2f5', borderRadius: '8px', padding: '2px' }}>
          {['Circuits', 'Schematic', 'Code'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? '#1890ff' : '#666', fontWeight: activeTab === tab ? 'bold' : 'normal', fontSize: '13px', cursor: 'pointer', boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Simulation Button */}
        {!isSimulating ? (
          <button onClick={handleStartSim} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1890ff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
            <Play size={16} /> Start Simulation
          </button>
        ) : (
          <button onClick={handleStopSim} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ff4d4f', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
            <Square size={16} /> Stop
          </button>
        )}
        
        <button onClick={handleSendTo} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
          <Send size={16} /> Send To
        </button>
      </div>
    </div>
  );
}