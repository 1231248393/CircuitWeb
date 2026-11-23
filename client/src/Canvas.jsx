import React, { useRef, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useStore } from './store';
import { getPins, getComponentMetadata, ElectronicSymbol } from './components';
import { calculateWirePath } from './wiring';
import { HelpCircle, X } from 'lucide-react';
import RealisticDSO from './RealisticDSO';

export default function Canvas() {
  const canvasRef = useRef(null);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const { 
    components, wires, updatePosition, wireStart, startWire, addWirePoint, endWire, cancelWire, 
    updateWireWaypoint, mousePos, setMousePos, selectedId, setSelectedId, selectedWireId, setSelectedWireId, 
    isSimulating, addComponent, zoom, pan, setZoom, setPan, updateComponentValue, openScopes, toggleScope
  } = useStore();

  const selectedComp = components.find(c => c.id === selectedId);
  const metadata = selectedComp ? getComponentMetadata(selectedComp.type) : null;
  
  // Fallback fields in case metadata is missing
  const metaFields = metadata?.fields || [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'value', label: 'Value', type: 'text' }
  ];

  const handleBackgroundMouseDown = (e) => {
    if (wireStart) { cancelWire(); return; }
    // Only start panning if clicking the actual background
    if (!isSimulating && e.target.id === 'canvas-bg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    } else {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setMousePos(x, y);
      
      if (draggingNode) {
        const snapX = Math.round(x / 10) * 10;
        const snapY = Math.round(y / 10) * 10;
        updateWireWaypoint(draggingNode.wireId, draggingNode.pointIndex, snapX, snapY);
      }
    }
  };

  const handleMouseUp = () => { setIsPanning(false); setDraggingNode(null); };
  useEffect(() => { window.addEventListener('mouseup', handleMouseUp); return () => window.removeEventListener('mouseup', handleMouseUp); }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSensitivity = 0.05;
    const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
    const newZoom = Math.min(Math.max(0.2, zoom + delta), 3);
    
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
    const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType');
    if (type) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      addComponent({ type, label: type }, Math.round(x / 10) * 10, Math.round(y / 10) * 10);
    }
  };

  const getRotatedPinPosition = (compId, pinName) => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return { x: 0, y: 0 };
    const pins = getPins(comp.type) || [];
    const pin = pins.find(p => p.name === pinName);
    if (!pin) return { x: comp.x + 70, y: comp.y + 45 };
    
    const isArduino = comp.type === 'arduino';
    const baseW = isArduino ? 300 : 140;
    const baseH = isArduino ? 200 : 90;
    const isRotated = comp.rotation === 90 || comp.rotation === 270;
    const rndW = isRotated ? baseH : baseW;
    const rndH = isRotated ? baseW : baseH;

    const cx = comp.x + rndW / 2;
    const cy = comp.y + rndH / 2;
    let rx = pin.x - baseW / 2;
    let ry = pin.y - baseH / 2;
    
    if (comp.mirror) rx = -rx;
    const theta = ((comp.rotation || 0) * Math.PI) / 180;
    
    return { x: cx + (rx * Math.cos(theta) - ry * Math.sin(theta)), y: cy + (rx * Math.sin(theta) + ry * Math.cos(theta)) };
  };

  const handleCanvasClick = (e) => {
    if (isPanning) return;
    // Only deselect if clicking the actual background, not bubbled from component
    if (e.target.id === 'canvas-bg' || e.target.id === 'workspace-layer') {
      setSelectedId(null);
      setSelectedWireId(null);
    }
  };

  return (
    <div 
      id="canvas-bg"
      style={{ flex: 1, background: '#f5f6f8', position: 'relative', overflow: 'hidden', cursor: isPanning ? 'grabbing' : 'default' }}
      onMouseDown={handleBackgroundMouseDown}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
      ref={canvasRef}
    >
      {isSimulating && (openScopes || []).map((scopeId, index) => {
        const scopeComp = components.find(c => c.id === scopeId);
        if (!scopeComp) return null;
        return (
          <Rnd key={scopeId} dragHandleClassName="dso-drag-handle" default={{ x: 100 + (index * 40), y: 100 + (index * 40), width: 620, height: 400 }} style={{ zIndex: 9999 + index }}>
            <RealisticDSO compId={scopeComp.id} type={scopeComp.type} onClose={() => toggleScope(scopeComp.id)} isSimulating={isSimulating} />
          </Rnd>
        );
      })}

      {selectedId && selectedComp && metadata && !isSimulating && (
        <Rnd 
          default={{ x: 20, y: 20, width: 280, height: 'auto' }} 
          dragHandleClassName="properties-drag-handle"
          style={{ zIndex: 99999 }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', overflow: 'hidden', border: '1px solid #ddd' }}>
            <div className="properties-drag-handle" style={{ background: '#00b4d8', padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'grab' }}>
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px', textTransform: 'capitalize' }}>{metadata.title}</span>
              <button onClick={() => setSelectedId(null)} onMouseDown={(e) => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Close Panel"><X size={18} color="#fff" /></button>
            </div>
            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {metaFields.map(field => (
                <div key={field.key} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ background: '#00b4d8', color: '#fff', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', width: '100px', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', textAlign: 'right' }}>
                    {field.label}
                  </div>
                  {field.type === 'select' ? (
                    <select value={selectedComp[field.key] || (field.options ? field.options[0] : '')} onChange={(e) => updateComponentValue(selectedComp.id, field.key, e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderLeft: 'none', borderTopRightRadius: '4px', borderBottomRightRadius: '4px', outline: 'none', fontSize: '13px', background: '#f8f9fa' }}>
                      {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <>
                      <input type={field.type === 'number' ? 'number' : 'text'} value={selectedComp[field.key] || ''} onChange={(e) => updateComponentValue(selectedComp.id, field.key, e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderLeft: 'none', outline: 'none', fontSize: '13px', width: '100%' }} />
                      {field.units && field.units.length > 0 && field.units[0] !== '' && (
                        <select value={selectedComp.unit || field.unit} onChange={(e) => updateComponentValue(selectedComp.id, 'unit', e.target.value)} style={{ width: '65px', padding: '8px', border: '1px solid #ccc', borderLeft: 'none', borderTopRightRadius: '4px', borderBottomRightRadius: '4px', outline: 'none', background: '#f8f9fa', fontSize: '13px' }}>
                          {field.units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Rnd>
      )}

      <div id="workspace-layer" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', width: '100%', height: '100%', position: 'absolute', pointerEvents: 'auto' }}>
        
        <svg style={{ position: 'absolute', width: '10000px', height: '10000px', zIndex: 1, pointerEvents: 'none' }}>
          {(wires || []).map(wire => {
            if (!wire || !wire.from || !wire.to || !Array.isArray(wire.points)) return null;
            
            const comp1 = components.find(c => c.id === wire.from.compId);
            const comp2 = components.find(c => c.id === wire.to.compId);
            if (!comp1 || !comp2) return null; 

            const points = wire.points.map((p, idx) => {
              if (idx === 0) return getRotatedPinPosition(wire.from.compId, wire.from.pin);
              if (idx === wire.points.length - 1) return getRotatedPinPosition(wire.to.compId, wire.to.pin);
              if (!p || typeof p.x !== 'number' || typeof p.y !== 'number') return getRotatedPinPosition(wire.from.compId, wire.from.pin); 
              return p;
            });

            const validPoints = points.filter(p => p && typeof p.x === 'number' && typeof p.y === 'number');
            if (validPoints.length < 2) return null;

            const pathStr = calculateWirePath(validPoints);
            if (!pathStr) return null;

            const isSelected = selectedWireId === wire.id;
            const strokeColor = wire.color || '#22c55e';
            const strokeWidth = wire.type === 'hookup' ? 3 : wire.type === 'alligator' ? 6 : 4;

            return (
              <g key={wire.id} onMouseDown={(e) => { e.stopPropagation(); setSelectedWireId(wire.id); }} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
                <path d={pathStr} fill="none" stroke="transparent" strokeWidth="20" />
                <path d={pathStr} fill="none" stroke={isSelected ? '#ff4d4f' : strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeDasharray={wire.type === 'hookup' ? '8,4' : 'none'} />
                
                {isSelected && validPoints.map((p, idx) => (
                  <circle key={idx} cx={p.x} cy={p.y} r="6" fill="#fff" stroke="#ff4d4f" strokeWidth="3" style={{ cursor: 'grab' }} onMouseDown={(e) => { e.stopPropagation(); setDraggingNode({ wireId: wire.id, pointIndex: idx }); }} />
                ))}
              </g>
            );
          })}
        </svg>

        {(components || []).map(comp => {
          if (!comp || !comp.type) return null;
          
          const isArduino = comp.type === 'arduino';
          const baseW = isArduino ? 300 : 140;
          const baseH = isArduino ? 200 : 90;
          
          const isRotated = comp.rotation === 90 || comp.rotation === 270;
          const rndW = isRotated ? baseH : baseW;
          const rndH = isRotated ? baseW : baseH;

          return (
            <Rnd 
              key={comp.id} 
              scale={zoom} 
              size={{ width: rndW, height: rndH }}
              position={{ x: comp.x, y: comp.y }} 
              onDragStop={(e, d) => updatePosition(comp.id, Math.round(d.x / 10) * 10, Math.round(d.y / 10) * 10)} 
              // 🔥 FIX: Stop propagation on mousedown to prevent panning
              onMouseDown={(e) => e.stopPropagation()} 
              // 🔥 FIX: Use onClick for selection
              onClick={(e) => { 
                e.stopPropagation(); 
                if(!wireStart) {
                  setSelectedId(comp.id); 
                  if(isSimulating && (comp.type === 'oscilloscope' || comp.type === 'cro')) toggleScope(comp.id);
                } 
              }} 
              style={{ zIndex: selectedId === comp.id ? 10 : 2, pointerEvents: 'auto' }} 
              disableDragging={isSimulating || !!wireStart} 
            >
              <div style={{ 
                width: baseW, 
                height: baseH, 
                position: 'absolute', 
                top: '50%', 
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${comp.rotation || 0}deg) scaleX(${comp.mirror ? -1 : 1})`, 
                transition: 'transform 0.2s',
                border: selectedId === comp.id ? '2px dashed #00b4d8' : 'none'
              }}>
                <ElectronicSymbol type={comp.type} value={comp.value} unit={comp.unit} isClosed={comp.value === 'Closed'} isSimulating={isSimulating} />
                
                {(getPins(comp.type) || []).map(pin => (
                  <div key={pin.name} onMouseEnter={() => setHoveredPin(pin.name)} onMouseLeave={() => setHoveredPin(null)} onMouseDown={(e) => { e.stopPropagation(); if (!wireStart) { const pos = getRotatedPinPosition(comp.id, pin.name); startWire(comp.id, pin.name, pos.x, pos.y); } else { const pos = getRotatedPinPosition(comp.id, pin.name); endWire(comp.id, pin.name, pos.x, pos.y); } }} style={{ position: 'absolute', left: pin.x - 10, top: pin.y - 10, width: 20, height: 20, background: wireStart ? '#ff4d4f' : '#00b4d8', borderRadius: '50%', cursor: 'crosshair', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 999 }}>
                    {hoveredPin === pin.name && (
                      <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#334155', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>{pin.label || pin.name}</div>
                    )}
                  </div>
                ))}
              </div>
            </Rnd>
          );
        })}
      </div>

      {wireStart && (
        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', top: 0, left: 0, zIndex: 1000 }}>
          {(() => {
            const tempPoints = [...(wireStart.points || []), { x: mousePos.x, y: mousePos.y }];
            const path = calculateWirePath(tempPoints);
            return <path d={path} fill="none" stroke="#00b4d8" strokeWidth="4" strokeDasharray="6,4" strokeLinejoin="round" />;
          })()}
        </svg>
      )}
    </div>
  );
}
