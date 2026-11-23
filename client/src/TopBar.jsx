import React, { useState, useRef, useEffect } from 'react';
import { useStore } from './store';
import { 
  CircuitBoard, Undo2, Redo2, Play, Square, Save, LayoutDashboard, 
  Copy, ClipboardPaste, Trash2, RotateCw, FlipHorizontal, Palette, Cable 
} from 'lucide-react';

const WIRE_COLORS = ['#111111', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899', '#854d0e', '#78716c', '#ffffff'];
const WIRE_TYPES = [
  { id: 'normal', label: 'Normal' },
  { id: 'hookup', label: 'Hookup' },
  { id: 'alligator', label: 'Alligator' }
];

export default function TopBar() {
  const { 
    isSimulating, selectedId, selectedWireId, removeComponent, removeWire, runSimulation, stopSimulation, 
    rotateComponent, mirrorComponent, copyComponent, pasteComponent, activeTab, setActiveTab, 
    projectName, setProjectName, saveProject, undo, redo, pastStates, futureStates, 
    wires, updateWireStyle 
  } = useStore();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const colorRef = useRef(null);
  const typeRef = useRef(null);

  const activeWire = wires.find(w => w.id === selectedWireId);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorRef.current && !colorRef.current.contains(e.target)) setShowColorPicker(false);
      if (typeRef.current && !typeRef.current.contains(e.target)) setShowTypePicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = () => {
    if (selectedId) removeComponent(selectedId);
    if (selectedWireId) removeWire(selectedWireId);
  };

  return (
    <div style={{ height: '60px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 1000 }}>
      
      {/* Left: Logo & Project Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div onClick={() => setActiveTab('Dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#00b4d8', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
          <CircuitBoard size={24} /> CircuitWeb
        </div>
        <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '6px 10px', fontSize: '14px', fontWeight: 'bold', color: '#333', width: '160px', outline: 'none' }} />
      </div>

      {/* Center: Tools & Wire Properties */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
        {/* History & Edit Tools */}
        <div style={{ display: 'flex', background: '#f8f9fa', borderRadius: '8px', padding: '4px', border: '1px solid #eee' }}>
          <button onClick={undo} disabled={pastStates.length === 0} style={{ padding: '6px', background: 'none', border: 'none', cursor: pastStates.length ? 'pointer' : 'not-allowed', color: pastStates.length ? '#555' : '#ccc' }} title="Undo"><Undo2 size={18} /></button>
          <button onClick={redo} disabled={futureStates.length === 0} style={{ padding: '6px', background: 'none', border: 'none', cursor: futureStates.length ? 'pointer' : 'not-allowed', color: futureStates.length ? '#555' : '#ccc' }} title="Redo"><Redo2 size={18} /></button>
          <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 5px' }} />
          
          <button onClick={() => selectedId && copyComponent(selectedId)} style={{ padding: '6px', background: 'none', border: 'none', cursor: selectedId ? 'pointer' : 'not-allowed', color: selectedId ? '#555' : '#ccc' }} title="Copy"><Copy size={18} /></button>
          <button onClick={pasteComponent} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }} title="Paste"><ClipboardPaste size={18} /></button>
          
          {/* 🔥 ROTATE & MIRROR ADDED BACK */}
          <button onClick={() => selectedId && rotateComponent(selectedId)} style={{ padding: '6px', background: 'none', border: 'none', cursor: selectedId ? 'pointer' : 'not-allowed', color: selectedId ? '#00b4d8' : '#ccc' }} title="Rotate 90°"><RotateCw size={18} /></button>
          <button onClick={() => selectedId && mirrorComponent(selectedId)} style={{ padding: '6px', background: 'none', border: 'none', cursor: selectedId ? 'pointer' : 'not-allowed', color: selectedId ? '#00b4d8' : '#ccc' }} title="Mirror"><FlipHorizontal size={18} /></button>
          
          <button onClick={handleDelete} style={{ padding: '6px', background: 'none', border: 'none', cursor: (selectedId || selectedWireId) ? 'pointer' : 'not-allowed', color: (selectedId || selectedWireId) ? '#ff4d4f' : '#ccc' }} title="Delete"><Trash2 size={18} /></button>
        </div>

        {/* 🔥 Wire Color & Type (Appears ONLY when a wire is clicked) */}
        {selectedWireId && activeWire && (
          <div style={{ display: 'flex', gap: '8px', background: '#e0f2fe', padding: '4px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            
            <div style={{ position: 'relative' }} ref={colorRef}>
              <button onClick={() => setShowColorPicker(!showColorPicker)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #ccc', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }} title="Wire Color">
                <Palette size={14} />
                <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: activeWire.color || '#22c55e', border: '1px solid #aaa' }} />
              </button>
              {showColorPicker && (
                <div style={{ position: 'absolute', top: '36px', left: 0, background: '#fff', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '10px', width: '160px', zIndex: 9999 }}>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: 'bold' }}>WIRE COLOR</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {WIRE_COLORS.map(c => (
                      <div key={c} onClick={() => { updateWireStyle(activeWire.id, 'color', c); setShowColorPicker(false); }} style={{ width: '26px', height: '26px', background: c, borderRadius: '4px', cursor: 'pointer', border: activeWire.color === c ? '2px solid #00b4d8' : '1px solid #ccc' }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }} ref={typeRef}>
              <button onClick={() => setShowTypePicker(!showTypePicker)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #ccc', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }} title="Wire Type">
                <Cable size={14} />
                <span style={{ textTransform: 'capitalize' }}>{activeWire.type || 'Normal'}</span>
              </button>
              {showTypePicker && (
                <div style={{ position: 'absolute', top: '36px', left: 0, background: '#fff', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '8px', width: '140px', zIndex: 9999 }}>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', fontWeight: 'bold' }}>WIRE TYPE</div>
                  {WIRE_TYPES.map(t => (
                    <div key={t.id} onClick={() => { updateWireStyle(activeWire.id, 'type', t.id); setShowTypePicker(false); }} style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', background: activeWire.type === t.id ? '#e0f2fe' : 'transparent', color: activeWire.type === t.id ? '#0284c7' : '#333', fontSize: '12px', marginBottom: '2px' }}>{t.label}</div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', background: '#f0f2f5', borderRadius: '20px', padding: '4px' }}>
          {['Circuits', 'Schematic', 'Code'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 14px', borderRadius: '16px', border: 'none', background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? '#00b4d8' : '#666', fontWeight: activeTab === tab ? 'bold' : 'normal', fontSize: '12px', cursor: 'pointer' }}>{tab}</button>
          ))}
        </div>
        <button onClick={() => setActiveTab('Dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fff', border: '1px solid #ccc', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#555', fontSize: '12px' }}><LayoutDashboard size={14} /> Dashboard</button>
        <button onClick={saveProject} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}><Save size={14} /> Save</button>
        
        {activeTab === 'Circuits' && (
          !isSimulating ? (
            <button onClick={runSimulation} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#00b4d8', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}><Play size={14} /> Simulate</button>
          ) : (
            <button onClick={stopSimulation} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#ff4d4f', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}><Square size={14} /> Stop</button>
          )
        )}
      </div>
    </div>
  );
}
