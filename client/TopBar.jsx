import React from 'react';
import { useStore } from './store';
import { CircuitBoard, Trash2, Play, Square, ZoomIn, ZoomOut, Maximize, RotateCw, FlipHorizontal } from 'lucide-react';

export default function TopBar() {
  const { isSimulating, selectedId, removeComponent, runSimulation, stopSimulation, activeTab, setActiveTab, zoom, setZoom, setPan, rotateComponent, mirrorComponent } = useStore();
  return (
    <div style={{ height: '60px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#1890ff', fontWeight: 'bold', fontSize: '18px' }}><CircuitBoard size={24} /> ProteusWeb</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', background: '#f8f9fa', borderRadius: '8px', padding: '4px', border: '1px solid #eee' }}>
          <button onClick={() => selectedId && removeComponent(selectedId)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f' }}><Trash2 size={18} /></button>
          <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 5px' }} />
          <button onClick={() => selectedId && rotateComponent(selectedId)} style={{ padding: '8px', background: 'none', border: 'none', cursor: selectedId ? 'pointer' : 'not-allowed', color: selectedId ? '#1890ff' : '#ccc' }}><RotateCw size={18} /></button>
          <button onClick={() => selectedId && mirrorComponent(selectedId)} style={{ padding: '8px', background: 'none', border: 'none', cursor: selectedId ? 'pointer' : 'not-allowed', color: selectedId ? '#1890ff' : '#ccc' }}><FlipHorizontal size={18} /></button>
        </div>
        {activeTab === 'Circuits' && (
          <div style={{ display: 'flex', background: '#f0f2f5', borderRadius: '8px', padding: '4px', border: '1px solid #ddd', alignItems: 'center' }}>
            <button onClick={() => setZoom(Math.min(zoom + 0.2, 3))} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#1890ff' }}><ZoomIn size={18} /></button>
            <span style={{ fontSize: '12px', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.max(zoom - 0.2, 0.4))} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#1890ff' }}><ZoomOut size={18} /></button>
            <button onClick={() => { setZoom(1); setPan(0, 0); }} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}><Maximize size={18} /></button>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', background: '#f0f2f5', borderRadius: '8px', padding: '2px' }}>
          {['Circuits', 'Schematic', 'Code'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? '#1890ff' : '#666', fontWeight: activeTab === tab ? 'bold' : 'normal', fontSize: '13px', cursor: 'pointer' }}>{tab}</button>
          ))}
        </div>
        {activeTab === 'Circuits' && (!isSimulating ? (
          <button onClick={runSimulation} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1890ff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}><Play size={16} /> Simulate</button>
        ) : (
          <button onClick={stopSimulation} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ff4d4f', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}><Square size={16} /> Stop</button>
        ))}
      </div>
    </div>
  );
}
