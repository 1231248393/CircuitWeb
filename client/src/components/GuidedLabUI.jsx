import React, { useState, useRef, useEffect } from 'react';
import { RealisticIcons, componentPins } from './CircuitIcons';
import { simulateTransient } from '../electrical/simulationEngine';
import DSOModal from './DSOModal';

export default function GuidedLabUI({ experiment }) {
  const [powerOn, setPowerOn] = useState(false);
  const BASE_SIZE = 120;
  const canvasRef = useRef(null);
  const [isRestored, setIsRestored] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Loading saved circuit...');
  const storageKey = `simulab:circuit:${experiment || 'guided'}`;


  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const [selectedComp, setSelectedComp] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [isDSOOpen, setIsDSOOpen] = useState(false);
  // Stage 3.2: persistent run/pause/stop simulation session state.
  const [simulationRunState, setSimulationRunState] = useState('stopped');
  const [simulationElapsed, setSimulationElapsed] = useState(0);
  const [simulationResult, setSimulationResult] = useState(null);
  useEffect(() => {
    if (simulationRunState !== 'running') return undefined;
    const timer = window.setInterval(() => setSimulationElapsed((value) => value + 0.05), 50);
    return () => window.clearInterval(timer);
  }, [simulationRunState]);


  // 🚨 NEW: Track selected wire for deletion
  const [selectedWire, setSelectedWire] = useState(null);

  const [activePin, setActivePin] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 🚨 CLEAN COMPONENT LAYOUT
  const [placedComponents, setPlacedComponents] = useState([
    { id: 'c1', name: 'Signal Gen', icon: 'SignalGen', scale: 1, x: 50, y: 220, genType: 'Function Generator', wave: 'Sine', freq: '1 kHz', amp: '5 Vpp' },
    { id: 'c2', name: 'Diode', icon: 'Diode', scale: 0.8, x: 220, y: 220, partNumber: '1N4007' },
    { id: 'c3', name: 'Capacitor', icon: 'Capacitor', scale: 0.8, x: 350, y: 220, val: '0.01', unit: 'uF' },
    { id: 'c4', name: 'Resistor', icon: 'Resistor', scale: 0.8, x: 480, y: 220, val: '1000', unit: 'Ω' },
    { id: 'c6', name: 'Ground', icon: 'Ground', scale: 0.6, x: 350, y: 380 },
    { id: 'c5', name: 'DSO', icon: 'DSO', scale: 1.2, x: 680, y: 180, timeDiv: '1 ms/div', voltsDiv: '2 V/div' },
  ]);

  // 🚨 CLEAN WIRING
  // AM ENVELOPE DETECTOR - CORRECT TOPOLOGY
  // CH1 = AM input before diode
  // CH2 = detected output after diode
  // R and C are connected in parallel.
  // All grounds share one common node.

  const [wires, setWires] = useState([
    { id: 'w1', startComp: 'c1', startPin: 'out', endComp: 'c2', endPin: 'anode' },
    { id: 'w2', startComp: 'c2', startPin: 'cathode', endComp: 'c3', endPin: 'top' },
    { id: 'w3', startComp: 'c2', startPin: 'cathode', endComp: 'c4', endPin: 'p1' },
    { id: 'w4', startComp: 'c3', startPin: 'bottom', endComp: 'c6', endPin: 'gnd' },
    { id: 'w5', startComp: 'c4', startPin: 'p2', endComp: 'c6', endPin: 'gnd' },
    { id: 'w6', startComp: 'c1', startPin: 'gnd', endComp: 'c6', endPin: 'gnd' },
    { id: 'w7', startComp: 'c1', startPin: 'out', endComp: 'c5', endPin: 'ch1' },
    { id: 'w8', startComp: 'c2', startPin: 'cathode', endComp: 'c5', endPin: 'ch2' },
    { id: 'w9', startComp: 'c6', startPin: 'gnd', endComp: 'c5', endPin: 'gnd' }
  ]);

  // Restore the last circuit for this experiment.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);

        if (Array.isArray(saved.placedComponents)) {
          setPlacedComponents(saved.placedComponents);
        }
        if (Array.isArray(saved.wires)) {
          setWires(saved.wires);
        }

        setSaveStatus('Previous circuit restored');
      } else {
        setSaveStatus('Default circuit loaded');
      }
    } catch (error) {
      console.error('Circuit restore failed:', error);
      setSaveStatus('Could not restore saved circuit');
    } finally {
      setIsRestored(true);
    }
  }, [storageKey]);

  // Automatically save component changes and wire changes.
  useEffect(() => {
    if (!isRestored) return;

    try {
      const saved = {
        version: 1,
        experiment: experiment || 'guided',
        updatedAt: new Date().toISOString(),
        placedComponents,
        wires
      };

      localStorage.setItem(storageKey, JSON.stringify(saved));
      setSaveStatus('Auto-saved');
    } catch (error) {
      console.error('Circuit auto-save failed:', error);
      setSaveStatus('Save failed');
    }
  }, [isRestored, storageKey, experiment, placedComponents, wires]);

  const saveCircuitNow = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        version: 1,
        experiment: experiment || 'guided',
        updatedAt: new Date().toISOString(),
        placedComponents,
        wires
      }));
      setSaveStatus('Saved successfully');
    } catch (error) {
      console.error('Manual circuit save failed:', error);
      setSaveStatus('Save failed');
    }
  };

  const resetCircuit = () => {
    const confirmed = window.confirm(
      'Reset this experiment? Your saved circuit will be deleted.'
    );

    if (!confirmed) return;

    localStorage.removeItem(storageKey);
    window.location.reload();
  };


  const getPinPosition = (compId, pinId) => {
    const comp = placedComponents.find(c => c.id === compId);
    if (!comp) return { x: 0, y: 0 };
    const pinList = componentPins[comp.name];
    const pins = Array.isArray(pinList) ? pinList : [];
    const pin = pins.find(p => p.id === pinId);
    if (!pin) return { x: 0, y: 0 };
    const size = BASE_SIZE * comp.scale;
    return { x: comp.x + (pin.x / 100) * size, y: comp.y + (pin.y / 100) * size };
  };

  // 🚨 ORTHOGONAL ROUTING (Creates L-shaped wires)
  const getWirePath = (start, end) => {
    const midX = start.x + (end.x - start.x) / 2;
    return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
  };

  const handleWheel = (e) => { e.preventDefault(); e.stopPropagation(); const zoomFactor = -e.deltaY * 0.002; setZoom(prev => Math.min(Math.max(0.3, prev + zoomFactor), 3)); };
  const handleCanvasMouseDown = (e) => { if (e.target === canvasRef.current || e.target.classList.contains('canvas-grid')) { setIsPanning(true); setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); setSelectedComp(null); setSelectedWire(null); } };
  const handleMouseDown = (e, comp) => { e.stopPropagation(); setDragging({ id: comp.id, startX: e.clientX, startY: e.clientY, origX: comp.x, origY: comp.y }); };
  const handleMouseUp = () => { setDragging(null); setIsPanning(false); };
  const handleCanvasClick = () => { if (!isPanning) { setSelectedComp(null); setActivePin(null); setSelectedWire(null); } };

  const handleMouseMove = (e) => {
    if (isPanning) { setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y }); return; }
    if (dragging) {
      const dx = (e.clientX - dragging.startX) / zoom;
      const dy = (e.clientY - dragging.startY) / zoom;
      setPlacedComponents(prev => prev.map(c => c.id === dragging.id ? { ...c, x: dragging.origX + dx, y: dragging.origY + dy } : c));
    } else if (activePin && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePos({ x: (e.clientX - rect.left - pan.x) / zoom, y: (e.clientY - rect.top - pan.y) / zoom });
    }
  };

  const handlePinClick = (e, compId, pin) => {
    e.stopPropagation(); 
    if (!activePin) {
      setActivePin({ compId, pinId: pin.id });
      const pos = getPinPosition(compId, pin.id);
      setMousePos(pos); 
    } else {
      if (activePin.compId !== compId || activePin.pinId !== pin.id) {
        const newWire = {
          id: `wire_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          startComp: activePin.compId,
          startPin: activePin.pinId,
          endComp: compId,
          endPin: pin.id
        };

        setWires(prev => {
          const duplicate = prev.some(w =>
            (w.startComp === newWire.startComp &&
             w.startPin === newWire.startPin &&
             w.endComp === newWire.endComp &&
             w.endPin === newWire.endPin) ||
            (w.startComp === newWire.endComp &&
             w.startPin === newWire.endPin &&
             w.endComp === newWire.startComp &&
             w.endPin === newWire.startPin)
          );

          return duplicate ? prev : [...prev, newWire];
        });
      }
      setActivePin(null); 
    }
  };

  const handleComponentClick = (e, comp) => { e.stopPropagation(); if (!isPanning) setSelectedComp(comp); };
  
  const updateProp = (key, value) => {
    setPlacedComponents(prev => prev.map(c => {
      if (c.id === selectedComp.id) {
        const updatedComp = { ...c, [key]: value };
        setSelectedComp(updatedComp);
        return updatedComp;
      }
      return c;
    }));
  };

  const deleteWire = (e, wireId) => {
    e.stopPropagation();
    setWires(prev => prev.filter(w => w.id !== wireId));
    setSelectedWire(null);
  };

  const renderIcon = (comp) => {
    const IconComponent = RealisticIcons[comp.icon] || RealisticIcons.Default;
    return <IconComponent value={comp.val || comp.value} />;
  };

  const hasScopeInstrument = placedComponents.some((component) => {
    const name = String(component?.name || '').trim().toLowerCase();
    const icon = String(component?.icon || '').trim().toLowerCase();
    return ['dso', 'cro', 'oscilloscope', 'digital oscilloscope'].includes(name)
      || ['dso', 'cro', 'oscilloscope'].includes(icon);
  });

  const handleRunSimulation = () => {
    const result = simulateTransient(placedComponents, wires, componentPins, { durationSeconds: 0.01, steps: 600 });
    setSimulationResult(result); setSimulationElapsed(0); setSimulationRunState('running');
    if (hasScopeInstrument) setIsDSOOpen(true);
  };
  const handlePauseResumeSimulation = () => setSimulationRunState((state) => state === 'running' ? 'paused' : 'running');
  const handleStopSimulation = () => { setSimulationRunState('stopped'); setSimulationElapsed(0); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <DSOModal isOpen={isDSOOpen} onClose={() => setIsDSOOpen(false)} components={placedComponents} wires={wires} />
      <style>{`@keyframes cw-wire-flow { to { stroke-dashoffset:-32; } } @keyframes cw-live-glow { 0%,100% {opacity:.72;} 50% {opacity:1;} } .cw-live-wire {stroke-dasharray:10 7 !important;animation:cw-wire-flow .55s linear infinite;} .cw-live-board {animation:cw-live-glow 1.1s ease-in-out infinite;} .cw-arduino-l-led {position:absolute;right:18%;top:15%;width:7px;height:7px;border-radius:50%;background:#fb3b45;box-shadow:0 0 7px 3px rgba(251,59,69,.75);pointer-events:none;animation:cw-arduino-blink .8s steps(2,end) infinite;} @keyframes cw-arduino-blink {0%,45%{opacity:1;}46%,100%{opacity:.12;}}`}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', borderBottom: '1px solid #d1d5db', padding: '0 16px', height: '50px' }}>
        <div style={{ fontWeight: 'bold', color: '#0d9488', fontSize: '18px' }}>⚡ CircuitWeb</div>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          {simulationRunState==='stopped' ? <button onClick={handleRunSimulation} style={{backgroundColor:'#10b981',color:'white',border:0,padding:'6px 13px',borderRadius:4,fontWeight:'bold',cursor:'pointer'}}>▶ Run Simulation</button> : <><button onClick={handlePauseResumeSimulation} style={{backgroundColor:'#d97706',color:'white',border:0,padding:'6px 11px',borderRadius:4,fontWeight:'bold',cursor:'pointer'}}>{simulationRunState==='running'?'Ⅱ Pause':'▶ Resume'}</button><button onClick={handleStopSimulation} style={{backgroundColor:'#dc2626',color:'white',border:0,padding:'6px 11px',borderRadius:4,fontWeight:'bold',cursor:'pointer'}}>■ Stop</button></>}
          <span aria-live="polite" style={{color:simulationRunState==='running'?'#047857':'#64748b',fontSize:10}}>{simulationRunState==='stopped'?'Simulation stopped':`${simulationRunState==='running'?'RUNNING':'PAUSED'} · ${simulationElapsed.toFixed(2)} s · ${simulationResult?.success?'circuit solved':'visual session; check circuit diagnostics'}`}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={saveCircuitNow}
            style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
            Save Circuit
          </button>
          <button onClick={resetCircuit}
            style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
            Reset Circuit
          </button>
          <span style={{ fontSize: '11px', color: '#475569' }}>{saveStatus}</span>
        </div>
        <div style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Mode: {experiment ? experiment.replace('-', ' ').toUpperCase() : 'GUIDED'}</div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div ref={canvasRef} className="canvas-container" onWheel={handleWheel} onMouseDown={handleCanvasMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onClick={handleCanvasClick} style={{ flex: 1, backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden', cursor: isPanning ? 'grabbing' : 'default', overscrollBehavior: 'contain' }}>
          <div className="canvas-grid" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: `${pan.x}px ${pan.y}px`, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', transition: isPanning ? 'none' : 'transform 0.1s ease-out' }}>
            
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
              {wires.map(w => {
                const start = getPinPosition(w.startComp, w.startPin);
                const end = getPinPosition(w.endComp, w.endPin);
                const path = getWirePath(start, end);
                const isSelected = selectedWire === w.id;
                const midX = start.x + (end.x - start.x) / 2;
                const midY = start.y + (end.y - start.y) / 2;

                return (
                  <g key={w.id}>
                    {/* Wire Path */}
                    <path 
                      d={path} 
                      className={!isSelected && simulationRunState === 'running' && simulationResult?.success ? 'cw-live-wire' : ''} stroke={isSelected ? "#ef4444" : "#10b981"} 
                      strokeWidth="4" 
                      fill="none"
                      style={{ pointerEvents: 'stroke', cursor: 'pointer', transition: 'stroke 0.2s' }} 
                      onClick={(e) => { e.stopPropagation(); setSelectedWire(w.id); }} 
                    />
                    {/* Endpoint Nodes */}
                    <circle cx={start.x} cy={start.y} r="4" fill={isSelected ? "#b91c1c" : "#047857"} />
                    <circle cx={end.x} cy={end.y} r="4" fill={isSelected ? "#b91c1c" : "#047857"} />
                    
                    {/* 🚨 DELETE BUTTON ON SELECTED WIRE */}
                    {isSelected && (
                      <g onClick={(e) => deleteWire(e, w.id)} style={{ cursor: 'pointer', pointerEvents: 'all' }}>
                        <circle cx={midX} cy={midY} r="12" fill="#ef4444" stroke="white" strokeWidth="2" />
                        <text x={midX} y={midY + 4} fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">✕</text>
                      </g>
                    )}
                  </g>
                );
              })}
              {activePin && <path d={`M ${getPinPosition(activePin.compId, activePin.pinId).x} ${getPinPosition(activePin.compId, activePin.pinId).y} L ${mousePos.x} ${mousePos.y}`} stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,5" />}
            </svg>

            {placedComponents.map(comp => {
              const size = BASE_SIZE * comp.scale;
              const isSelected = selectedComp?.id === comp.id;
              const pinList = componentPins[comp.name];
              const pins = Array.isArray(pinList) ? pinList : [];

              return (
                <div key={comp.id} data-circuit-component="true" data-sim-component={comp.name} onMouseDown={(e) => handleMouseDown(e, comp)} onClick={(e) => handleComponentClick(e, comp)} style={{ position: 'absolute', left: comp.x, top: comp.y, width: size, height: size, zIndex: isSelected ? 15 : 10, cursor: dragging?.id === comp.id ? 'grabbing' : 'grab', border: isSelected ? '2px dashed #0ea5e9' : '2px solid transparent', borderRadius: '4px' }}>
                  <svg className={simulationRunState === 'running' && simulationResult?.success && (comp.name === 'Arduino Uno R3' || comp.name === 'ESP32 DevKit') ? 'cw-live-board' : ''} width="100%" height="100%" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.3))', pointerEvents: 'none' }}>{renderIcon(comp)}</svg>
                  {simulationRunState === 'running' && comp.name === 'Arduino Uno R3' && <span className="cw-arduino-l-led" title="Default onboard LED demo indicator" />}

                  {pins.map(pin => (
                    <div key={pin.id} title={pin.name} onClick={(e) => handlePinClick(e, comp.id, pin)} style={{ position: 'absolute', left: `${pin.x}%`, top: `${pin.y}%`, width: '14px', height: '14px', backgroundColor: activePin?.pinId === pin.id ? '#f59e0b' : '#ffffff', border: '2px solid #0ea5e9', borderRadius: '50%', transform: 'translate(-50%, -50%)', cursor: 'crosshair', zIndex: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Properties Menu (Unchanged) */}
          {selectedComp && (
            <div onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: (selectedComp.y * zoom) + pan.y > 250 ? (selectedComp.y * zoom) + pan.y - 160 : (selectedComp.y * zoom) + pan.y + (BASE_SIZE * selectedComp.scale * zoom) + 10, left: (selectedComp.x * zoom) + pan.x, width: '280px', backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #0ea5e9', zIndex: 100 }}>
              <div style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '8px 12px', fontSize: '14px', fontWeight: 'bold' }}>{selectedComp.name} Properties</div>
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedComp.name === 'Signal Gen' && (
                  <><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Generator Type</label><select value={selectedComp.genType} onChange={(e) => updateProp('genType', e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }}><option>Function Generator</option><option>Arbitrary Function (AFG)</option><option>Arbitrary Waveform (AWG)</option><option>RF Signal</option><option>Pulse/Pattern</option></select><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Waveform</label><select value={selectedComp.wave} onChange={(e) => updateProp('wave', e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }}><option>Sine</option><option>Square</option><option>Triangle</option><option>Pulse</option></select><div style={{ display: 'flex', gap: '8px' }}><div style={{ flex: 1 }}><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Freq</label><input type="text" value={selectedComp.freq} onChange={(e) => updateProp('freq', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }} /></div><div style={{ flex: 1 }}><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Amp</label><input type="text" value={selectedComp.amp} onChange={(e) => updateProp('amp', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }} /></div></div></>
                )}
                {selectedComp.name === 'Resistor' && (
                  <><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Resistance</label><div style={{ display: 'flex', gap: '4px' }}><input type="number" value={selectedComp.val} onChange={(e) => updateProp('val', e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }} /><select value={selectedComp.unit} onChange={(e) => updateProp('unit', e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }}><option>Ω</option><option>kΩ</option><option>MΩ</option></select></div></>
                )}
                {selectedComp.name === 'Capacitor' && (
                  <><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Capacitance</label><div style={{ display: 'flex', gap: '4px' }}><input type="number" value={selectedComp.val} onChange={(e) => updateProp('val', e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }} /><select value={selectedComp.unit} onChange={(e) => updateProp('unit', e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }}><option>pF</option><option>nF</option><option>uF</option></select></div></>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
