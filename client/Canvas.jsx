import React, { useRef, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useStore } from './store';
import { getPins, getComponentMetadata, ElectronicSymbol } from './components';
import { calculateWirePath } from './wiring';

export default function Canvas() {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0); 
  const { components, wires, updatePosition, removeComponent, wireStart, startWire, endWire, cancelWire, mousePos, setMousePos, selectedId, setSelectedId, isSimulating, simulationResult, addComponent, zoom, pan, setZoom, setPan, rotateComponent, mirrorComponent } = useStore();

  useEffect(() => {
    if (!isSimulating) return;
    let animationId;
    const animate = () => { setPhase(p => p + 0.05); animationId = requestAnimationFrame(animate); };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isSimulating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleWheel = (e) => {
      e.preventDefault(); 
      const newZoom = Math.min(Math.max(0.2, zoom + (e.deltaY > 0 ? -0.1 : 0.1)), 3);
      const rect = canvas.getBoundingClientRect();
      setZoom(newZoom);
      setPan((e.clientX - rect.left) - (e.clientX - rect.left - pan.x)/zoom * newZoom, (e.clientY - rect.top) - (e.clientY - rect.top - pan.y)/zoom * newZoom);
    };
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [zoom, pan, setZoom, setPan]);

  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      if (wireStart && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePos({ x: (e.clientX - rect.left - pan.x) / zoom, y: (e.clientY - rect.top - pan.y) / zoom });
      }
    };
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, [wireStart, pan, zoom, setMousePos]);

  const handleDrop = (e) => {
    e.preventDefault();
    const compType = e.dataTransfer.getData('componentType');
    if (!compType) return;
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      addComponent({ type: compType, label: compType }, Math.max(0, (e.clientX - rect.left - pan.x)/zoom - 70), Math.max(0, (e.clientY - rect.top - pan.y)/zoom - 45));
    }
  };

  const getRotatedPinPosition = (compId, pinName) => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return { x: 0, y: 0 };
    const pin = getPins(comp.type).find(p => p.name === pinName);
    if (!pin) return { x: comp.x, y: comp.y };
    const cx = comp.x + 70, cy = comp.y + 45;
    let rx = pin.x - 70, ry = pin.y - 45;
    if (comp.mirror) rx = -rx;
    const theta = ((comp.rotation || 0) * Math.PI) / 180;
    return { x: cx + (rx * Math.cos(theta) - ry * Math.sin(theta)), y: cy + (rx * Math.sin(theta) + ry * Math.cos(theta)) };
  };

  const selectedComp = components.find(c => c.id === selectedId);
  const metadata = selectedComp ? getComponentMetadata(selectedComp.type) : null;

  let wave1 = ""; let wave2 = "";
  if (isSimulating && simulationResult && simulationResult.type === 'communication') {
    let pts1 = []; let pts2 = [];
    for(let i = 0; i <= 100; i++) {
      const x = (i / 100) * 400;
      const t = (i / 100) * Math.PI * 2 + phase;
      pts1.push(`${x},${100 - (Math.sin(t * 0.1) * 50)}`);
      pts2.push(`${x},${100 - (Math.sin(t * 3) * Math.sin(t * 0.1) * 50)}`);
    }
    wave1 = `M ${pts1.join(' L ')}`; wave2 = `M ${pts2.join(' L ')}`;
  }

  return (
    <div ref={canvasRef} onMouseUp={() => { if (wireStart) cancelWire(); }} onClick={() => { if(!wireStart) setSelectedId(null); }} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#fcfcfc', cursor: wireStart ? 'crosshair' : 'default' }}>
      
      {isSimulating && simulationResult && (
        <Rnd default={{ x: window.innerWidth - 600, y: 100, width: 500, height: 300 }} bounds="window" style={{ zIndex: 9999 }}>
          <div style={{ width: '100%', height: '100%', background: '#111', border: '3px solid #333', borderRadius: '10px', padding: '10px' }}>
            <div style={{ color: '#fff', marginBottom: '10px' }}>DSO OUTPUT</div>
            <svg width="100%" height="200" viewBox="0 0 400 200" style={{ background: '#000' }}>
              <path d={wave1} fill="none" stroke="#22c55e" strokeWidth="2" />
              <path d={wave2} fill="none" stroke="#3b82f6" strokeWidth="2" />
            </svg>
          </div>
        </Rnd>
      )}

      {selectedId && selectedComp && metadata && (
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 999999, background: '#fff', border: '2px solid #1890ff', borderRadius: '8px', width: '250px' }}>
          <div style={{ background: '#1890ff', color: '#fff', padding: '10px', fontWeight: 'bold' }}>{selectedComp.type.toUpperCase()}</div>
          <div style={{ padding: '10px' }}>Properties Panel</div>
        </div>
      )}

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
          {wires.map(wire => {
            const from = getRotatedPinPosition(wire.from.compId, wire.from.pin);
            const to = getRotatedPinPosition(wire.to.compId, wire.to.pin);
            return <path key={wire.id} d={calculateWirePath(from.x, from.y, to.x, to.y)} fill="none" stroke="#22c55e" strokeWidth="5" />;
          })}
        </svg>

        {components.map((comp) => {
          const pins = getPins(comp.type);
          return (
            <Rnd key={comp.id} size={{ width: 140, height: 90 }} position={{ x: comp.x, y: comp.y }} onDragStop={(e, d) => updatePosition(comp.id, d.x, d.y)} bounds="parent" disableDragging={!!wireStart} scale={zoom} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: selectedId === comp.id ? '2px dashed #1890ff' : 'none' }}>
              <div onClick={(e) => { e.stopPropagation(); setSelectedId(comp.id); }} style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: `rotate(${comp.rotation || 0}deg) scaleX(${comp.mirror ? -1 : 1})` }}>
                <ElectronicSymbol type={comp.type} value={comp.value} isClosed={comp.value === 'Closed'} />
                {pins.map(pin => (
                  <div key={pin.name} onMouseDown={(e) => { e.stopPropagation(); startWire(comp.id, pin.name); }} onMouseUp={(e) => { e.stopPropagation(); endWire(comp.id, pin.name); }} style={{ position: 'absolute', left: pin.x - 10, top: pin.y - 10, width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'crosshair', zIndex: 100 }}>
                    <div style={{ width: '10px', height: '10px', backgroundColor: '#1890ff', borderRadius: '50%', border: '2px solid white' }} />
                  </div>
                ))}
              </div>
            </Rnd>
          );
        })}
      </div>
    </div>
  );
}
