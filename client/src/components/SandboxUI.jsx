import React, { useState, useRef, useEffect } from 'react';
import { RealisticIcons, PhysicalIcons, SchematicIcons, componentPins } from './CircuitIcons';
import { simulateTransient } from '../electrical/simulationEngine';
import { buildElectricalNets } from '../electrical/netlist';
import { buildWirePath, findNearestWireInsertion } from '../electrical/wireRouting';
import DSOModal from './DSOModal';

const componentCategories = [
  { category: 'Sources & Power', items: [
    { name: '9V Battery', icon: 'Battery', scale: 1.15, val: '9', unit: 'V' },
    { name: 'DC Voltage Source', icon: 'VoltageSource', scale: 1.0, val: '5', unit: 'V' },
    { name: 'AC Voltage Source', icon: 'VoltageSource', scale: 1.0, val: '5', unit: 'V' },
    { name: 'Signal Gen', icon: 'SignalGen', scale: 1.0, genType: 'Function Generator', wave: 'Sine', freq: '1 kHz', amp: '5 Vpp' },
    { name: 'Carrier Generator', icon: 'SignalGen', scale: 1.0, genType: 'RF Signal', wave: 'Sine', freq: '100 kHz', amp: '5 Vpp' },
    { name: 'Ground', icon: 'Ground', scale: 0.8 }
  ]},
  { category: 'Passive Components', items: [
    { name: 'Resistor', icon: 'Resistor', scale: 0.85, val: '1000', unit: 'Ω' },
    { name: 'Capacitor', icon: 'Capacitor', scale: 0.85, val: '0.01', unit: 'uF' },
    { name: 'Inductor', icon: 'Inductor', scale: 0.9, val: '10', unit: 'mH' },
    { name: 'Potentiometer', icon: 'Potentiometer', scale: 0.9, val: '10', unit: 'kΩ' },
    { name: 'Transformer', icon: 'Transformer', scale: 1.0, val: '1:1', unit: '' }
  ]},
  { category: 'Semiconductors', items: [
    { name: 'Diode', icon: 'Diode', scale: 0.85, val: '1N4148' },
    { name: 'Zener Diode', icon: 'Diode', scale: 0.85, val: '5.1', unit: 'V' },
    { name: 'LED', icon: 'LED', scale: 0.8, val: 'Red' },
    { name: 'NPN Transistor', icon: 'Transistor', scale: 0.9, val: 'BC547' },
    { name: 'PNP Transistor', icon: 'Transistor', scale: 0.9, val: 'BC557' },
    { name: 'MOSFET', icon: 'Transistor', scale: 0.9, val: 'IRFZ44N' }
  ]},
  { category: 'Integrated Circuits & Logic', items: [
    { name: '555 Timer', icon: 'IC555', scale: 1.0, val: 'NE555' },
    { name: '74HC04 Hex Inverter', icon: 'IC74HC04', scale: 1.15, val: '74HC04' },
    { name: '74HC08 Quad AND', icon: 'IC74HC08', scale: 1.15, val: '74HC08' },
    { name: '74HC32 Quad OR', icon: 'IC74HC32', scale: 1.15, val: '74HC32' },
    { name: 'Op-Amp', icon: 'OpAmp', scale: 1.0, val: 'LM741' },
    { name: 'AND Gate', icon: 'LogicGate', scale: 0.9 },
    { name: 'OR Gate', icon: 'LogicGate', scale: 0.9 },
    { name: 'NOT Gate', icon: 'LogicGate', scale: 0.9 },
    { name: 'Flip-Flop', icon: 'FlipFlop', scale: 1.0 }
  ]},
  { category: 'Instruments', items: [
    { name: 'DSO', icon: 'DSO', scale: 1.2, timeDiv: '1 ms/div', voltsDiv: '2 V/div' },
    { name: 'CRO', icon: 'DSO', scale: 1.2, timeDiv: '1 ms/div', voltsDiv: '2 V/div' },
    { name: 'Multimeter', icon: 'Meter', scale: 1.0 },
    { name: 'Voltmeter', icon: 'Meter', scale: 0.9 },
    { name: 'Ammeter', icon: 'Meter', scale: 0.9 }
  ]},
  { category: 'Microcontrollers & Boards', items: [
    { name: 'Arduino Uno R3', icon: 'Arduino', scale: 1.5 },
    { name: 'ESP32 DevKit', icon: 'ESP32', scale: 1.4 },
    { name: 'Breadboard', icon: 'Breadboard', scale: 1.5 },
    { name: '8051 AT89C51 DIP-40', icon: 'IC8051', scale: 1.55, val: 'AT89C51' },
    { name: 'LCD 16x2 (HD44780)', icon: 'LCD16x2', scale: 1.45, val: '16x2 LCD' },
    { name: 'Crystal Oscillator 11.0592 MHz', icon: 'Crystal', scale: 1.0, val: '11.0592', unit: 'MHz' },
    { name: '22 pF Capacitor', icon: 'Capacitor', scale: 0.85, val: '22', unit: 'pF' },
    { name: '10 µF Reset Capacitor', icon: 'Capacitor', scale: 0.85, val: '10', unit: 'µF' },
    { name: '10 kΩ Reset Resistor', icon: 'Resistor', scale: 0.85, val: '10', unit: 'kΩ' }
  ]}
];

const toolButton = (disabled = false) => ({ padding: '6px 9px', border: '1px solid #dbe3ec', borderRadius: 6, background: disabled ? '#f8fafc' : '#fff', color: disabled ? '#a1aab7' : '#334155', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 650, whiteSpace: 'nowrap' });
const tabButton = (active) => ({ padding: '6px 10px', border: `1px solid ${active ? '#7dd3fc' : '#dbe3ec'}`, borderRadius: 6, background: active ? '#e0f2fe' : '#fff', color: active ? '#075985' : '#334155', cursor: 'pointer', fontSize: 11, fontWeight: 750 });

export default function SandboxUI() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [componentSearch, setComponentSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState([]);
  const [placedComponents, setPlacedComponents] = useState([]);
  const [wires, setWires] = useState([]);
  
  const [activePin, setActivePin] = useState(null);
  const [wireWaypoints, setWireWaypoints] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [draggingWireNode, setDraggingWireNode] = useState(null);
  const canvasRef = useRef(null);
  // Keep the source pin stable across pointer events so click-click and drag-to-pin
  // wiring use the exact same electrical endpoint.
  const activePinRef = useRef(null);
  const suppressPinClickRef = useRef(false);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const [selectedComp, setSelectedComp] = useState(null);
  const [selectedWire, setSelectedWire] = useState(null);
  const [wireColor, setWireColor] = useState('#16a34a');
  const [wireStyle, setWireStyle] = useState('solid');
  const [workspaceTab, setWorkspaceTab] = useState('circuit');
  const [codeTarget, setCodeTarget] = useState('arduino');
  const [arduinoCode, setArduinoCode] = useState(`// Arduino Uno sketch
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(500);
  digitalWrite(13, LOW);
  delay(500);
}`);
  const [code8051, setCode8051] = useState(`#include <REG51.H>

sbit LED = P1^0;

void delay(void) {
  unsigned int i;
  for (i = 0; i < 50000; i++);
}

void main(void) {
  while (1) {
    LED = 0;
    delay();
    LED = 1;
    delay();
  }
}`);
  const codeText = codeTarget === '8051' ? code8051 : arduinoCode;
  const setCodeText = (value) => codeTarget === '8051' ? setCode8051(value) : setArduinoCode(value);
  const [showDesignManager, setShowDesignManager] = useState(false);
  const [designName, setDesignName] = useState('');
  const [savedDesigns, setSavedDesigns] = useState(() => {
    try { const parsed = JSON.parse(localStorage.getItem('circuitweb-design-profiles') || '[]'); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  });
  const [activeDesignId, setActiveDesignId] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const historyLastRef = useRef(null);
  const historySuppressRef = useRef(false);
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

  const [componentView, setComponentView] = useState('physical');
  const [hoveredPin, setHoveredPin] = useState(null);

  const BASE_SIZE = 120;
  const electricalNets = buildElectricalNets(placedComponents, wires, componentPins);
  const connectedPinKeys = new Set(electricalNets.flatMap((net) => net.nodes));
  const pinIsInNet = (compId, pinId) => connectedPinKeys.has(`${String(compId)}::${String(pinId)}`);

  const eventToWorld = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: (event.clientX - rect.left - pan.x) / zoom, y: (event.clientY - rect.top - pan.y) / zoom };
  };

  const getPinPosition = (compId, pinId) => {
    const comp = placedComponents.find(c => c.id === compId);
    if (!comp) return { x: 0, y: 0 };
    const pinList = componentPins[comp.name];
    const pins = Array.isArray(pinList) ? pinList : [];
    const pin = pins.find(p => p.id === pinId);
    if (!pin) return { x: 0, y: 0 };
    const size = BASE_SIZE * comp.scale;
    let px = (pin.x / 100) * size;
    let py = (pin.y / 100) * size;
    if (comp.mirrorX) px = size - px;
    if (comp.mirrorY) py = size - py;
    const rotation = ((Number(comp.rotation) || 0) % 360 + 360) % 360;
    if (rotation === 90) [px, py] = [size - py, px];
    else if (rotation === 180) [px, py] = [size - px, size - py];
    else if (rotation === 270) [px, py] = [py, size - px];
    return { x: comp.x + px, y: comp.y + py };
  };

  
  const generateWirePath = (start, end) => {
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    if (dx < 5 || dy < 5) return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    const midX = (start.x + end.x) / 2;
    return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
  };

  // Zoom toward the mouse pointer so the point under the cursor stays in place.
  const handleWheel = (e) => {
    if (!canvasRef.current) return;
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    const nextZoom = Math.min(4.5, Math.max(0.18, zoom * Math.exp(-e.deltaY * 0.0012)));
    const worldX = (pointerX - pan.x) / zoom;
    const worldY = (pointerY - pan.y) / zoom;
    setPan({ x: pointerX - worldX * nextZoom, y: pointerY - worldY * nextZoom });
    setZoom(nextZoom);
  };

  const zoomAtCanvasCenter = (factor) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const pointerX = rect.width / 2;
    const pointerY = rect.height / 2;
    const nextZoom = Math.min(4.5, Math.max(0.18, zoom * factor));
    const worldX = (pointerX - pan.x) / zoom;
    const worldY = (pointerY - pan.y) / zoom;
    setPan({ x: pointerX - worldX * nextZoom, y: pointerY - worldY * nextZoom });
    setZoom(nextZoom);
  };

  const resetViewport = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleCanvasMouseDown = (e) => {
    if (e.button !== 0 && e.button !== 1) return;
    if (activePin || draggingWireNode) return;
    const onComponent = e.target.closest('[data-circuit-component]');
    const onPin = e.target.closest('[data-circuit-pin]');
    const onWire = e.target.closest('[data-circuit-wire-hit]');
    if (!onComponent && !onPin && !onWire) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setSelectedComp(null);
      setSelectedWire(null);
    }
  };

  const handleDragStart = (e, component) => { e.dataTransfer.setData('component', JSON.stringify(component)); };

  const addComponentAt = (comp, x, y) => {
    const placed = { id: `comp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, ...comp, x, y };
    setPlacedComponents(prev => [...prev, placed]);
    setSelectedComp(placed);
  };

  const handleAddFromLibrary = (comp) => {
    const index = placedComponents.length;
    const x = 120 + (index % 4) * 155;
    const y = 100 + Math.floor(index / 4) * 135;
    addComponentAt(comp, x, y);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('component');
    if (!data || !canvasRef.current) return;
    const comp = JSON.parse(data);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom - (BASE_SIZE * comp.scale) / 2;
    const y = (e.clientY - rect.top - pan.y) / zoom - (BASE_SIZE * comp.scale) / 2;
    addComponentAt(comp, x, y);
  };

  const handleMouseDown = (e, comp) => { e.stopPropagation(); setDragging({ id: comp.id, startX: e.clientX, startY: e.clientY, origX: comp.x, origY: comp.y }); };
  const handleMouseUp = () => { setDragging(null); setDraggingWireNode(null); setIsPanning(false); };
  const handleCanvasClick = (e) => {
    if (activePin) {
      const point = eventToWorld(e);
      setWireWaypoints((previous) => [...previous, point]);
      setMousePos(point);
      setSelectedComp(null);
      return;
    }
    if (!isPanning) { setSelectedComp(null); setSelectedWire(null); }
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    if (isPanning) { setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y }); return; }
    if (draggingWireNode) {
      const point = eventToWorld(e);
      setWires((previous) => previous.map((wire) => wire.id !== draggingWireNode.wireId ? wire : ({
        ...wire,
        points: (wire.points || []).map((node, index) => index === draggingWireNode.index ? point : node)
      })));
      return;
    }
    if (dragging) {
      const dx = (e.clientX - dragging.startX) / zoom;
      const dy = (e.clientY - dragging.startY) / zoom;
      setPlacedComponents(prev => prev.map(c => c.id === dragging.id ? { ...c, x: dragging.origX + dx, y: dragging.origY + dy } : c));
      return;
    }
    if (activePin) setMousePos(eventToWorld(e));
  };

  const commitPinConnection = (source, compId, pin) => {
    if (!source || (source.compId === compId && source.pinId === pin.id)) return false;
    setWires((previous) => [...previous, {
      id: `wire_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      startComp: source.compId,
      startPin: source.pinId,
      endComp: compId,
      endPin: pin.id,
      points: [...wireWaypoints],
      color: wireColor,
      style: wireStyle
    }]);
    activePinRef.current = null;
    setActivePin(null);
    setWireWaypoints([]);
    return true;
  };

  // One reliable click-click interaction path. Avoid mixing pointer-up and
  // click completion, which can race and leave a wire preview unfinished.
  const handlePinClick = (e, compId, pin) => {
    e.preventDefault();
    e.stopPropagation();
    const source = activePinRef.current || activePin;

    if (!source) {
      const next = { compId, pinId: pin.id };
      activePinRef.current = next;
      setActivePin(next);
      setWireWaypoints([]);
      setSelectedWire(null);
      setMousePos(getPinPosition(compId, pin.id));
      return;
    }

    if (source.compId === compId && source.pinId === pin.id) {
      // Clicking the selected source again cancels the pending connection.
      activePinRef.current = null;
      setActivePin(null);
      setWireWaypoints([]);
      return;
    }

    commitPinConnection(source, compId, pin);
  };

  const selectWireAndInsertNode = (e, wire) => {
    e.stopPropagation();
    setSelectedWire(wire.id);
    const clickPoint = eventToWorld(e);
    const start = getPinPosition(wire.startComp, wire.startPin);
    const end = getPinPosition(wire.endComp, wire.endPin);
    const best = findNearestWireInsertion(start, wire.points || [], end, clickPoint);
    if (best.distance <= 18 / zoom) {
      setWires((previous) => previous.map((item) => {
        if (item.id !== wire.id) return item;
        const next = [...(item.points || [])];
        next.splice(best.segmentIndex, 0, best.point);
        return { ...item, points: next };
      }));
    }
  };

  const startWireNodeDrag = (e, wireId, index) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedWire(wireId);
    setDraggingWireNode({ wireId, index });
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && activePin) {
        activePinRef.current = null;
        setActivePin(null);
        setWireWaypoints([]);
      }
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        if ((event.key === 'Delete' || event.key === 'Backspace') && (selectedWire || selectedComp)) deleteSelection();
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) { event.preventDefault(); undoEdit(); }
        if ((event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === 'y' || (event.key.toLowerCase() === 'z' && event.shiftKey))) { event.preventDefault(); redoEdit(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activePin, selectedWire, selectedComp, undoStack, redoStack, placedComponents, wires]);

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

  const saveCircuit = () => {
    const payload = { components: placedComponents, wires, savedAt: new Date().toISOString() };
    localStorage.setItem('circuitweb-sandbox-project', JSON.stringify(payload));
    window.alert('Circuit saved in this browser.');
  };

  const loadCircuit = () => {
    const raw = localStorage.getItem('circuitweb-sandbox-project');
    if (!raw) { window.alert('No saved circuit found in this browser.'); return; }
    try {
      const payload = JSON.parse(raw);
      setPlacedComponents(Array.isArray(payload.components) ? payload.components : []);
      setWires(Array.isArray(payload.wires) ? payload.wires : []);
      setSelectedComp(null);
      setSelectedWire(null);
      window.alert('Saved circuit loaded.');
    } catch { window.alert('Saved circuit could not be read.'); }
  };


  // Keep a bounded edit history for Undo / Redo. Snapshots include both parts and wires.
  useEffect(() => {
    const current = { components: placedComponents, wires };
    if (!historyLastRef.current) { historyLastRef.current = current; return; }
    if (historySuppressRef.current) { historySuppressRef.current = false; historyLastRef.current = current; return; }
    const previous = historyLastRef.current;
    if (JSON.stringify(previous) !== JSON.stringify(current)) {
      setUndoStack((stack) => [...stack.slice(-49), previous]);
      setRedoStack([]);
      historyLastRef.current = current;
    }
  }, [placedComponents, wires]);

  const applyHistorySnapshot = (snapshot) => {
    historySuppressRef.current = true;
    setPlacedComponents(snapshot.components || []);
    setWires(snapshot.wires || []);
    setSelectedComp(null); setSelectedWire(null); setActivePin(null); activePinRef.current = null;
    setWireWaypoints([]);
  };
  const undoEdit = () => {
    if (!undoStack.length) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((stack) => stack.slice(0, -1));
    setRedoStack((stack) => [...stack, { components: placedComponents, wires }]);
    applyHistorySnapshot(previous);
  };
  const redoEdit = () => {
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((stack) => stack.slice(0, -1));
    setUndoStack((stack) => [...stack, { components: placedComponents, wires }]);
    applyHistorySnapshot(next);
  };
  const deleteSelection = () => {
    if (selectedWire) { setWires((items) => items.filter((wire) => wire.id !== selectedWire)); setSelectedWire(null); return; }
    if (selectedComp) {
      const id = selectedComp.id;
      setPlacedComponents((items) => items.filter((component) => component.id !== id));
      setWires((items) => items.filter((wire) => wire.startComp !== id && wire.endComp !== id));
      setSelectedComp(null);
    }
  };
  const transformSelected = (patch) => {
    if (!selectedComp) return;
    setPlacedComponents((items) => items.map((component) => component.id === selectedComp.id ? { ...component, ...patch } : component));
    setSelectedComp((component) => component ? { ...component, ...patch } : component);
  };
  const mirrorWholeCircuit = () => {
    if (!placedComponents.length) return;
    const minX = Math.min(...placedComponents.map((c) => c.x));
    const maxX = Math.max(...placedComponents.map((c) => c.x + BASE_SIZE * c.scale));
    setPlacedComponents((items) => items.map((c) => ({ ...c, x: minX + maxX - (c.x + BASE_SIZE * c.scale), mirrorX: !c.mirrorX })));
    setWires((items) => items.map((w) => ({ ...w, points: (w.points || []).map((pt) => ({ ...pt, x: minX + maxX - pt.x })) })));
  };
  const rotateWholeCircuit = () => {
    if (!placedComponents.length) return;
    const centers = placedComponents.map((c) => ({ x: c.x + BASE_SIZE * c.scale / 2, y: c.y + BASE_SIZE * c.scale / 2 }));
    const cx = centers.reduce((sum, p) => sum + p.x, 0) / centers.length;
    const cy = centers.reduce((sum, p) => sum + p.y, 0) / centers.length;
    setPlacedComponents((items) => items.map((c) => {
      const size = BASE_SIZE * c.scale; const x = c.x + size / 2 - cx; const y = c.y + size / 2 - cy;
      return { ...c, x: cx - y - size / 2, y: cy + x - size / 2, rotation: ((Number(c.rotation) || 0) + 90) % 360 };
    }));
    setWires((items) => items.map((w) => ({ ...w, points: (w.points || []).map((pt) => ({ ...pt, x: cx - (pt.y - cy), y: cy + (pt.x - cx) })) })));
  };
  const updateSelectedWire = (patch) => {
    if (!selectedWire) return;
    setWires((items) => items.map((wire) => wire.id === selectedWire ? { ...wire, ...patch } : wire));
  };
  const persistDesignList = (items) => {
    setSavedDesigns(items);
    localStorage.setItem('circuitweb-design-profiles', JSON.stringify(items));
  };
  const saveNamedDesign = () => {
    const name = designName.trim();
    if (!name) { window.alert('Enter a design/profile name first.'); return; }
    const profile = { id: activeDesignId || `design_${Date.now()}`, name, components: placedComponents, wires, codeText, codeTarget, arduinoCode, code8051, savedAt: new Date().toISOString() };
    const next = [...savedDesigns.filter((item) => item.id !== profile.id), profile];
    persistDesignList(next); setActiveDesignId(profile.id); setDesignName(name); setShowDesignManager(false);
  };
  const loadNamedDesign = (profile) => {
    applyHistorySnapshot({ components: profile.components || [], wires: profile.wires || [] });
    setCodeTarget(profile.codeTarget || 'arduino'); setArduinoCode(profile.arduinoCode || profile.codeText || arduinoCode); setCode8051(profile.code8051 || code8051); setActiveDesignId(profile.id); setDesignName(profile.name); setShowDesignManager(false);
  };
  const renameNamedDesign = (profile) => {
    const nextName = window.prompt('Enter a new design name:', profile.name);
    if (!nextName || !nextName.trim()) return;
    const next = savedDesigns.map((item) => item.id === profile.id ? { ...item, name: nextName.trim(), savedAt: new Date().toISOString() } : item);
    persistDesignList(next);
    if (activeDesignId === profile.id) setDesignName(nextName.trim());
  };
  const deleteNamedDesign = (id) => {
    persistDesignList(savedDesigns.filter((item) => item.id !== id));
    if (activeDesignId === id) { setActiveDesignId(null); setDesignName(''); }
  };

  const getInstrumentReading = (comp) => (simulationResult?.instrumentReadings || []).find((reading) => reading.id === comp.id) || null;
  const formatInstrumentReading = (comp) => {
    const reading = getInstrumentReading(comp);
    if (simulationRunState === 'stopped' || !simulationResult) return { value: '----', unit: '', mode: 'READY' };
    if (!reading || !Number.isFinite(reading.value)) return { value: '----', unit: '', mode: 'OPEN' };
    if (comp.name === 'Ammeter') {
      const milliamps = reading.value * 1000;
      return { value: Math.abs(milliamps) >= 1000 ? reading.value.toFixed(3) : milliamps.toFixed(2), unit: Math.abs(milliamps) >= 1000 ? 'A' : 'mA', mode: 'DC A' };
    }
    const value = reading.value;
    return { value: Math.abs(value) >= 100 ? value.toFixed(1) : value.toFixed(3), unit: 'V', mode: 'DC V' };
  };

  const renderIcon = (comp) => { 
    const IconComponent = componentView === 'physical' ? (PhysicalIcons[comp.icon] || RealisticIcons[comp.icon] || PhysicalIcons.Default) : (SchematicIcons[comp.icon] || RealisticIcons[comp.icon] || SchematicIcons.Default);
    return <IconComponent value={comp.val || comp.value || comp.name} />; 
  };
  
  const renderSidebarIcon = (iconName, value) => { 
    const IconComponent = componentView === 'physical' ? (PhysicalIcons[iconName] || RealisticIcons[iconName] || PhysicalIcons.Default) : (SchematicIcons[iconName] || RealisticIcons[iconName] || SchematicIcons.Default);
    return <IconComponent value={value || iconName} />; 
  };

  const hasScopeInstrument = placedComponents.some((component) => {
    const name = String(component?.name || '').trim().toLowerCase();
    const icon = String(component?.icon || '').trim().toLowerCase();
    return ['dso', 'cro', 'oscilloscope', 'digital oscilloscope'].includes(name)
      || ['dso', 'cro', 'oscilloscope'].includes(icon);
  });

  const handleRunSimulation = () => {
    const result = simulateTransient(placedComponents, wires, componentPins, { durationSeconds: 0.01, steps: 600 });
    setSimulationResult(result);
    setSimulationElapsed(0);
    setSimulationRunState('running');
    if (hasScopeInstrument) setIsDSOOpen(true);
  };
  const handlePauseResumeSimulation = () => setSimulationRunState((state) => state === 'running' ? 'paused' : 'running');
  const handleStopSimulation = () => { setSimulationRunState('stopped'); setSimulationElapsed(0); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      <DSOModal isOpen={isDSOOpen} onClose={() => setIsDSOOpen(false)} components={placedComponents} wires={wires} liveSimulation={simulationResult} simulationRunState={simulationRunState} simulationElapsed={simulationElapsed} onPauseResume={handlePauseResumeSimulation} />
      {showDesignManager && <div role="dialog" aria-modal="true" aria-label="Design profiles" style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(15,23,42,.48)', display: 'grid', placeItems: 'center', padding: 16 }}><div style={{ width: 'min(560px, 96vw)', maxHeight: '82vh', overflow: 'auto', background: '#fff', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,.25)', padding: 20 }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}><div><h2 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>My Circuit Designs</h2><p style={{ margin: '4px 0 0', fontSize: 11, color: '#64748b' }}>Create named profiles and reopen them later in this browser.</p></div><button onClick={() => setShowDesignManager(false)} style={toolButton(false)}>✕ Close</button></div><label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 5 }}>Design / profile name</label><div style={{ display: 'flex', gap: 8, marginBottom: 16 }}><input value={designName} onChange={(e) => setDesignName(e.target.value)} placeholder="e.g. AM Modulator Experiment" style={{ flex: 1, minWidth: 0, border: '1px solid #cbd5e1', borderRadius: 7, padding: '9px 10px', fontSize: 13 }} /><button onClick={() => { setActiveDesignId(null); setDesignName(''); }} style={toolButton(false)}>New</button><button onClick={saveNamedDesign} style={{ ...toolButton(false), background: '#0f766e', color: '#fff', borderColor: '#0f766e' }}>{activeDesignId ? 'Update Design' : 'Save New Design'}</button></div><div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}><strong style={{ fontSize: 12, color: '#334155' }}>Saved profiles ({savedDesigns.length})</strong>{savedDesigns.length === 0 ? <p style={{ color: '#94a3b8', fontSize: 12, padding: 16, textAlign: 'center' }}>No saved designs yet. Enter a name above and save your current circuit.</p> : savedDesigns.map((profile) => <div key={profile.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}><div style={{ minWidth: 0 }}><strong style={{ display: 'block', fontSize: 12, color: '#0f172a' }}>{profile.name}</strong><span style={{ fontSize: 10, color: '#64748b' }}>{(profile.components || []).length} components · {(profile.wires || []).length} wires · {profile.savedAt ? new Date(profile.savedAt).toLocaleString() : ''}</span></div><div style={{ display: 'flex', gap: 5 }}><button onClick={() => loadNamedDesign(profile)} style={toolButton(false)}>Open</button><button onClick={() => renameNamedDesign(profile)} style={toolButton(false)}>Rename</button><button onClick={() => deleteNamedDesign(profile.id)} style={{ ...toolButton(false), color: '#b91c1c' }}>Delete</button></div></div>)}</div></div></div>}
      <style>{`@keyframes cw-wire-flow { to { stroke-dashoffset: -32; } } .cw-live-wire { stroke-dasharray:10 7 !important; animation:cw-wire-flow .55s linear infinite; } .cw-led-lit { filter:drop-shadow(0 0 7px #ef4444) drop-shadow(0 0 15px rgba(239,68,68,.85)) !important; } .cw-meter-screen { position:absolute; left:28%; top:25%; width:44%; height:24%; box-sizing:border-box; display:grid; grid-template-columns:1fr auto; grid-template-rows:22% 1fr 18%; align-items:center; padding:1.5% 3%; border:1px solid #64748b; border-radius:3px; background:linear-gradient(180deg,#dcebd9,#b9d0b5); color:#17251c; box-shadow:inset 0 1px 4px #64748b88; pointer-events:none; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; } .cw-meter-screen .cw-meter-mode { grid-column:1 / -1; font-size:clamp(4px, .43vw, 8px); font-weight:800; line-height:1; } .cw-meter-screen strong { font-size:clamp(7px, .95vw, 15px); letter-spacing:-.08em; line-height:1; font-weight:800; text-align:right; } .cw-meter-screen small { font-size:clamp(5px, .5vw, 9px); font-weight:800; margin-left:2px; } .cw-meter-screen i { grid-column:1 / -1; font-size:clamp(3px, .32vw, 6px); font-style:normal; opacity:.75; line-height:1; } .cw-meter-screen.is-active { background:linear-gradient(180deg,#f0ffe6,#cce8c0); box-shadow:inset 0 1px 4px #64748b88,0 0 9px #22c55e66; } .cw-generator-screen { position:absolute; left:19%; top:35%; width:62%; height:29%; box-sizing:border-box; border-radius:3px; background:#071b2b; border:1px solid #64748b; padding:3%; display:flex; flex-direction:column; justify-content:space-between; pointer-events:none; color:#dbeafe; } .cw-generator-screen svg { width:100%; height:65%; overflow:visible; } .cw-generator-wave { fill:none; stroke:#42e8c5; stroke-width:3; vector-effect:non-scaling-stroke; stroke-dasharray:8 3; } .cw-generator-screen.is-active .cw-generator-wave { animation:cw-wave-scroll .45s linear infinite; filter:drop-shadow(0 0 2px #42e8c5); } @keyframes cw-wave-scroll { to { stroke-dashoffset:-22; } } .cw-generator-screen b { font-size:clamp(4px,.43vw,8px); line-height:1; } .cw-generator-screen small { font-size:clamp(3px,.3vw,6px); color:#86efac; line-height:1; } .cw-scope-preview { position:absolute; left:23%; top:18%; width:61%; height:38%; box-sizing:border-box; padding:2%; background:#03111e; border:1px solid #334155; pointer-events:none; } .cw-scope-preview svg { width:100%; height:80%; background-image:linear-gradient(to right,#1e3a4d 1px,transparent 1px),linear-gradient(to bottom,#1e3a4d 1px,transparent 1px); background-size:10% 50%; } .cw-scope-preview path { fill:none; stroke:#34e6b1; stroke-width:2; vector-effect:non-scaling-stroke; stroke-dasharray:6 2; animation:cw-wave-scroll .6s linear infinite; filter:drop-shadow(0 0 2px #34e6b1); } .cw-scope-preview small { display:block; color:#86efac; font-size:clamp(3px,.28vw,6px); line-height:1; }`}</style>

      <div style={{ display: 'flex', flexDirection: 'column', background: '#ffffff', borderBottom: '1px solid #d1d5db', zIndex: 40, boxShadow: '0 2px 5px rgba(15,23,42,.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '7px 14px', minHeight: 48, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><strong style={{ fontSize: 16, color: '#0f172a' }}>⚡ CircuitWeb</strong><span style={{ fontSize: 11, color: '#64748b' }}>{designName || 'Untitled design'}</span><span style={{ fontSize: 10, color: '#64748b', background: '#f1f5f9', padding: '4px 7px', borderRadius: 12 }}>{electricalNets.length} nets</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            <button title="Undo (Ctrl+Z)" disabled={!undoStack.length} onClick={undoEdit} style={toolButton(!undoStack.length)}>↶ Undo</button>
            <button title="Redo (Ctrl+Y)" disabled={!redoStack.length} onClick={redoEdit} style={toolButton(!redoStack.length)}>↷ Redo</button>
            <button title="Delete selected component or wire" disabled={!selectedComp && !selectedWire} onClick={deleteSelection} style={toolButton(!selectedComp && !selectedWire)}>⌫ Delete</button>
            <span style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 3px' }} />
            <button title="Rotate selected component 90 degrees" disabled={!selectedComp} onClick={() => transformSelected({ rotation: ((Number(selectedComp?.rotation) || 0) + 90) % 360 })} style={toolButton(!selectedComp)}>⟳ Rotate</button>
            <button title="Mirror selected component horizontally" disabled={!selectedComp} onClick={() => transformSelected({ mirrorX: !selectedComp?.mirrorX })} style={toolButton(!selectedComp)}>⇋ Mirror</button>
            <button title="Rotate the whole circuit 90 degrees" disabled={!placedComponents.length} onClick={rotateWholeCircuit} style={toolButton(!placedComponents.length)}>⟳ Circuit</button>
            <button title="Mirror the whole circuit horizontally" disabled={!placedComponents.length} onClick={mirrorWholeCircuit} style={toolButton(!placedComponents.length)}>⇋ Circuit</button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, color: '#334155' }} title="Wire colour applies to newly created wires and selected wire"><input type="color" value={selectedWire ? (wires.find(w => w.id === selectedWire)?.color || wireColor) : wireColor} onChange={(e) => selectedWire ? updateSelectedWire({ color: e.target.value }) : setWireColor(e.target.value)} style={{ width: 22, height: 20, border: 0, padding: 0, background: 'transparent' }} />Wire</label>
            <select aria-label="Wire type" value={selectedWire ? (wires.find(w => w.id === selectedWire)?.style || 'solid') : wireStyle} onChange={(e) => selectedWire ? updateSelectedWire({ style: e.target.value }) : setWireStyle(e.target.value)} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px', color: '#334155', background: '#fff', fontSize: 11 }}><option value="solid">Solid wire</option><option value="dashed">Dashed wire</option><option value="dotted">Dotted wire</option></select>
            <span style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 3px' }} />
            <button onClick={() => { setWorkspaceTab('circuit'); setComponentView('physical'); }} style={tabButton(workspaceTab === 'circuit')}>Circuit</button>
            <button onClick={() => { setWorkspaceTab('schematic'); setComponentView('schematic'); }} style={tabButton(workspaceTab === 'schematic')}>Schematic</button>
            <button onClick={() => setWorkspaceTab('code')} style={tabButton(workspaceTab === 'code')}>Code</button>
            <button onClick={() => setShowDesignManager(true)} style={{ ...toolButton(false), background: '#e0f2fe', borderColor: '#bae6fd', color: '#075985', fontWeight: 800 }}>▣ Designs / Save</button>
            {simulationRunState === 'stopped' ? <button onClick={handleRunSimulation} style={{ ...toolButton(false), background: '#059669', color: '#fff', borderColor: '#059669', fontWeight: 800 }}>▶ Run</button> : <><button onClick={handlePauseResumeSimulation} style={{ ...toolButton(false), background: '#d97706', color: '#fff', borderColor: '#d97706' }}>{simulationRunState === 'running' ? 'Ⅱ Pause' : '▶ Resume'}</button><button onClick={handleStopSimulation} style={{ ...toolButton(false), background: '#dc2626', color: '#fff', borderColor: '#dc2626' }}>■ Stop</button></>}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={toolButton(false)}>{isSidebarOpen ? 'Hide Library' : 'Components'}</button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '5px 14px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', fontSize: 10, color: '#64748b' }}>
          <span>{selectedComp ? `Selected: ${selectedComp.name}` : selectedWire ? 'Selected: Wire' : 'Select a component or wire to edit'} · {Math.round(zoom * 100)}%</span>
          <span aria-live="polite" style={{ color: simulationRunState === 'running' ? '#047857' : '#64748b' }}>{simulationRunState === 'stopped' ? 'Simulation stopped' : `${simulationRunState.toUpperCase()} · ${simulationElapsed.toFixed(2)} s · ${simulationResult?.success ? 'circuit solved' : 'check diagnostics'}`}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        {workspaceTab === 'code' ? <section style={{ flex: 1, minWidth: 0, padding: 18, background: '#0f172a', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div><strong style={{ fontSize: 16 }}>Code Editor</strong><p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Choose the target controller. Each target keeps its own saved source.</p></div>
              <button onClick={() => setWorkspaceTab('circuit')} style={toolButton(false)}>Back to circuit</button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setCodeTarget('arduino')} aria-pressed={codeTarget === 'arduino'} style={{ ...toolButton(false), background: codeTarget === 'arduino' ? '#075985' : '#1e293b', color: '#fff', borderColor: codeTarget === 'arduino' ? '#38bdf8' : '#475569' }}>Arduino Uno · C++</button>
              <button type="button" onClick={() => setCodeTarget('8051')} aria-pressed={codeTarget === '8051'} style={{ ...toolButton(false), background: codeTarget === '8051' ? '#075985' : '#1e293b', color: '#fff', borderColor: codeTarget === '8051' ? '#38bdf8' : '#475569' }}>8051 AT89C51 · C</button>
            </div>
            <textarea aria-label={codeTarget === '8051' ? '8051 C source code' : 'Arduino C++ source code'} value={codeText} onChange={(e) => setCodeText(e.target.value)} spellCheck="false" style={{ flex: 1, minHeight: 300, resize: 'none', background: '#020617', color: '#d1fae5', border: '1px solid #334155', borderRadius: 9, padding: 16, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, lineHeight: 1.6, outline: 'none' }} />
            <div style={{ fontSize: 11, color: '#fbbf24' }}>{codeTarget === '8051' ? '8051 source is stored separately. Full C51 compilation / instruction execution is not yet implemented; Run currently solves the supported electrical circuit model.' : 'Arduino source is stored separately. Arduino firmware compilation / execution is not yet implemented; Run currently solves the supported electrical circuit model.'}</div>
          </section> : <div ref={canvasRef} className="canvas-container" onWheel={handleWheel} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onMouseDown={handleCanvasMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onClick={handleCanvasClick} onContextMenu={(e) => { if (activePin) { e.preventDefault(); activePinRef.current = null; setActivePin(null); setWireWaypoints([]); } }} style={{ flex: 1, backgroundColor: '#fbfdff', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1.15px)', backgroundSize: `${Math.max(8, 20 * zoom)}px ${Math.max(8, 20 * zoom)}px`, backgroundPosition: `${pan.x}px ${pan.y}px`, position: 'relative', overflow: 'hidden', cursor: isPanning ? 'grabbing' : 'grab', overscrollBehavior: 'contain', touchAction: 'none' }}>
          <div className="canvas-grid" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, backgroundImage: 'none', transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', transition: isPanning ? 'none' : 'transform 0.1s ease-out' }}>
            {placedComponents.length === 0 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#94a3b8', pointerEvents: 'none', textAlign: 'center', padding: '24px' }}><div style={{ width: '62px', height: '62px', borderRadius: '16px', border: '1px solid #cbd5e1', background: 'rgba(255,255,255,.8)', display: 'grid', placeItems: 'center', fontSize: '30px', marginBottom: '14px' }}>⌁</div><strong style={{ fontSize: '16px', color: '#475569', marginBottom: '6px' }}>Start a new circuit</strong><span style={{ fontSize: '12px', maxWidth: '320px', lineHeight: 1.6 }}>Choose a component from the library on the right. Click to add it here, or drag it onto the workspace. Connect pins to build your circuit.</span></div>}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5, overflow: 'visible' }}>
              {wires.map((wire) => {
                const start = getPinPosition(wire.startComp, wire.startPin);
                const end = getPinPosition(wire.endComp, wire.endPin);
                const path = buildWirePath(start, end, wire.points || []);
                const selected = selectedWire === wire.id;
                return (
                  <g key={wire.id}>
                    <path data-circuit-wire-hit="true" d={path} fill="none" stroke="transparent" strokeWidth="18" style={{ pointerEvents: 'stroke', cursor: 'pointer' }} onClick={(event) => selectWireAndInsertNode(event, wire)} />
                    <path data-circuit-wire="true" className={simulationRunState === 'running' && simulationResult?.success ? 'cw-live-wire' : ''} d={path} fill="none" stroke={wire.color || '#16a34a'} strokeWidth="4" strokeDasharray={wire.style === 'dashed' ? '9 6' : wire.style === 'dotted' ? '2 6' : undefined} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }} />
                    <circle cx={start.x} cy={start.y} r="4" fill="#15803d" style={{ pointerEvents: 'none' }} />
                    <circle cx={end.x} cy={end.y} r="4" fill="#15803d" style={{ pointerEvents: 'none' }} />
                    {selected && (wire.points || []).map((point, index) => (
                      <circle key={`${wire.id}-node-${index}`} cx={point.x} cy={point.y} r="7" fill="#ffffff" stroke="#0284c7" strokeWidth="3" style={{ pointerEvents: 'all', cursor: 'move' }} onMouseDown={(event) => startWireNodeDrag(event, wire.id, index)} onClick={(event) => event.stopPropagation()} />
                    ))}
                    {selected && <g><rect x={Math.min(start.x, end.x) + 8} y={Math.min(start.y, end.y) - 28} width="112" height="22" rx="6" fill="#0f172a" /><text x={Math.min(start.x, end.x) + 16} y={Math.min(start.y, end.y) - 13} fill="#fff" fontSize="10">Wire · Delete to remove</text></g>}
                  </g>
                );
              })}
              {activePin && <path d={buildWirePath(getPinPosition(activePin.compId, activePin.pinId), mousePos, wireWaypoints)} stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 5" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
            </svg>

            {placedComponents.map(comp => {
              const size = BASE_SIZE * comp.scale;
              const pinList = componentPins[comp.name];
              const pins = Array.isArray(pinList) ? pinList : [];
              const isSelected = selectedComp?.id === comp.id;
              const scopeSamples = (simulationResult?.samples || []).filter((sample) => Number.isFinite(sample.ch1));
              const miniScopePath = scopeSamples.length > 1 ? scopeSamples.map((sample, index) => `${index === 0 ? 'M' : 'L'} ${(index / (scopeSamples.length - 1) * 100).toFixed(1)} ${Math.max(3, Math.min(33, 18 - sample.ch1 * 2)).toFixed(1)}`).join(' ') : '';

              return (
                <div key={comp.id} data-circuit-component="true" data-sim-component={comp.name} onMouseDown={(e) => handleMouseDown(e, comp)} onClick={(e) => handleComponentClick(e, comp)} style={{ position: 'absolute', left: comp.x, top: comp.y, width: size, height: size, zIndex: isSelected ? 15 : 10, cursor: dragging?.id === comp.id ? 'grabbing' : 'grab', border: isSelected ? '2px dashed #0ea5e9' : '2px solid transparent', borderRadius: '4px', transform: `rotate(${Number(comp.rotation) || 0}deg) scaleX(${comp.mirrorX ? -1 : 1}) scaleY(${comp.mirrorY ? -1 : 1})`, transformOrigin: 'center center' }}>
                  <svg className={[
                    comp.name === 'LED' && simulationRunState === 'running' && simulationResult?.componentStates?.some((state) => state.id === comp.id && state.lit) ? 'cw-led-lit' : ''
                  ].filter(Boolean).join(' ')} width="100%" height="100%" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.3))', pointerEvents: 'none' }}>{renderIcon(comp)}</svg>
                  {['Multimeter', 'Voltmeter', 'Ammeter'].includes(comp.name) && componentView === 'physical' && (() => { const meter = formatInstrumentReading(comp); const active = simulationRunState === 'running' && Boolean(getInstrumentReading(comp)); return <div className={`cw-meter-screen ${active ? 'is-active' : ''}`} aria-label={`${comp.name} display ${meter.value} ${meter.unit}`}><span className="cw-meter-mode">{meter.mode}</span><strong>{meter.value}</strong><small>{meter.unit}</small><i>{active ? '● SIM' : simulationRunState === 'paused' ? 'Ⅱ HOLD' : '● IDLE'}</i></div>; })()}
                  {['Signal Gen', 'Carrier Generator'].includes(comp.name) && componentView === 'physical' && <div className={`cw-generator-screen ${simulationRunState === 'running' ? 'is-active' : ''}`}><svg viewBox="0 0 100 36" preserveAspectRatio="none"><path className="cw-generator-wave" d={comp.wave === 'Square' ? 'M0 27 H15 V7 H35 V27 H55 V7 H75 V27 H100' : comp.wave === 'Triangle' ? 'M0 27 L18 7 L36 27 L54 7 L72 27 L90 7 L100 17' : 'M0 18 C8 0 17 0 25 18 S42 36 50 18 S67 0 75 18 S92 36 100 18'} /></svg><b>{comp.freq || '1 kHz'}</b><small>{simulationRunState === 'running' ? 'OUTPUT ON' : 'STANDBY'}</small></div>}
                  {['DSO', 'CRO'].includes(comp.name) && componentView === 'physical' && simulationRunState === 'running' && simulationResult?.channels?.ch1?.connected && simulationResult?.channels?.ch1?.referenceFound && miniScopePath && <div className="cw-scope-preview"><svg viewBox="0 0 100 36" preserveAspectRatio="none"><path d={miniScopePath} /></svg><small>CH1 · RUN</small></div>}

                  {pins.map(pin => (
                    <React.Fragment key={pin.id}>
                      <button type="button" data-circuit-pin="true" onMouseDown={(e) => e.stopPropagation()} aria-label={`${comp.name} ${pin.name}: ${pin.function || ''}`} title={`${pin.name}\n${pin.function || ''}\n${pin.electrical || ''}${pinIsInNet(comp.id, pin.id) ? '\nElectrically connected (wire/contact/breadboard)' : ''}`} onMouseEnter={() => setHoveredPin({ compId: comp.id, compName: comp.name, pin })} onMouseLeave={() => setHoveredPin(null)} onClick={(e) => handlePinClick(e, comp.id, pin)} style={{ position: 'absolute', left: `${pin.x}%`, top: `${pin.y}%`, width: comp.name === 'Breadboard' || comp.name === 'Arduino Uno R3' || comp.name === 'ESP32 DevKit' ? '9px' : (comp.icon === 'IC74HC04' || comp.icon === 'IC74HC08' || comp.icon === 'IC74HC32' || comp.icon === 'IC555') ? '12px' : '16px', height: comp.name === 'Breadboard' || comp.name === 'Arduino Uno R3' || comp.name === 'ESP32 DevKit' ? '9px' : (comp.icon === 'IC74HC04' || comp.icon === 'IC74HC08' || comp.icon === 'IC74HC32' || comp.icon === 'IC555') ? '10px' : '16px', padding: 0, backgroundColor: activePin?.compId === comp.id && activePin?.pinId === pin.id ? '#f59e0b' : hoveredPin?.compId === comp.id && hoveredPin?.pin.id === pin.id ? '#38bdf8' : pinIsInNet(comp.id, pin.id) ? '#0f766e' : '#e2e8f0', border: activePin?.compId === comp.id && activePin?.pinId === pin.id ? '2px solid #f59e0b' : hoveredPin?.compId === comp.id && hoveredPin?.pin.id === pin.id ? '2px solid #075985' : pinIsInNet(comp.id, pin.id) ? '2px solid #064e3b' : '1px solid #64748b', borderRadius: '50%', transform: 'translate(-50%, -50%)', cursor: 'crosshair', zIndex: 22, boxShadow: activePin?.compId === comp.id && activePin?.pinId === pin.id ? '0 0 0 3px rgba(245,158,11,.3)' : hoveredPin?.compId === comp.id && hoveredPin?.pin.id === pin.id ? '0 0 0 3px rgba(14,165,233,.3)' : pinIsInNet(comp.id, pin.id) ? '0 0 0 2px rgba(15,118,110,.18)' : '0 0 0 1px rgba(15,23,42,.08)' }} />
                      {hoveredPin?.compId === comp.id && hoveredPin?.pin.id === pin.id && <div role="tooltip" style={{ position: 'absolute', left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -115%)', minWidth: '160px', maxWidth: '220px', padding: '8px 10px', borderRadius: '7px', background: '#0f172a', color: '#f8fafc', boxShadow: '0 5px 18px rgba(15,23,42,.28)', fontSize: '10px', lineHeight: 1.45, pointerEvents: 'none', zIndex: 1000, whiteSpace: 'normal' }}><strong style={{ display: 'block', color: '#7dd3fc', fontSize: '11px' }}>{pin.name}</strong><span style={{ display: 'block', color: '#e2e8f0' }}>{pin.function}</span><span style={{ display: 'block', color: '#a5b4fc', marginTop: '3px' }}>{pin.electrical}</span></div>}
                    </React.Fragment>
                  ))}
                </div>
              );
            })}
          </div>

          {/* 🚨 FIXED PROPERTIES MENU */}
          {selectedComp && (
            <div onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: (selectedComp.y * zoom) + pan.y > 250 ? (selectedComp.y * zoom) + pan.y - 150 : (selectedComp.y * zoom) + pan.y + (BASE_SIZE * selectedComp.scale * zoom) + 10, left: (selectedComp.x * zoom) + pan.x, width: '280px', backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #0ea5e9', zIndex: 100 }}>
              <div style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '8px 12px', fontSize: '13px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>{selectedComp.name} Properties</span><button onClick={() => { setPlacedComponents(prev => prev.filter(c => c.id !== selectedComp.id)); setWires(prev => prev.filter(w => w.startComp !== selectedComp.id && w.endComp !== selectedComp.id)); setSelectedComp(null); }} style={{ background: 'rgba(255,255,255,.18)', color: 'white', border: '1px solid rgba(255,255,255,.45)', borderRadius: '4px', padding: '3px 7px', cursor: 'pointer' }}>Delete</button></div>
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                {['Signal Gen', 'Carrier Generator'].includes(selectedComp.name) && (
                  <>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Generator Type</label>
                    <select value={selectedComp.genType} onChange={(e) => updateProp('genType', e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }}>
                      <option>Function Generator</option><option>Arbitrary Function (AFG)</option><option>Arbitrary Waveform (AWG)</option><option>RF Signal</option><option>Pulse/Pattern</option>
                    </select>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Waveform</label>
                    <select value={selectedComp.wave} onChange={(e) => updateProp('wave', e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }}>
                      <option>Sine</option><option>Square</option><option>Triangle</option><option>Pulse</option>
                    </select>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Freq</label><input type="text" value={selectedComp.freq} onChange={(e) => updateProp('freq', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }} /></div>
                      <div style={{ flex: 1 }}><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Amp</label><input type="text" value={selectedComp.amp} onChange={(e) => updateProp('amp', e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }} /></div>
                    </div>
                  </>
                )}

                {selectedComp.name === 'Resistor' && (
                  <>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Resistance</label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input type="number" value={selectedComp.val} onChange={(e) => updateProp('val', e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                      <select value={selectedComp.unit} onChange={(e) => updateProp('unit', e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }}><option>Ω</option><option>kΩ</option><option>MΩ</option></select>
                    </div>
                  </>
                )}

                {selectedComp.name === 'Capacitor' && (
                  <>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Capacitance</label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input type="number" value={selectedComp.val} onChange={(e) => updateProp('val', e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                      <select value={selectedComp.unit} onChange={(e) => updateProp('unit', e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }}><option>pF</option><option>nF</option><option>uF</option></select>
                    </div>
                  </>
                )}

                {selectedComp.name === 'DSO' && (
                  <>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Time / Div</label>
                    <input type="text" value={selectedComp.timeDiv} onChange={(e) => updateProp('timeDiv', e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Volts / Div</label>
                    <input type="text" value={selectedComp.voltsDiv} onChange={(e) => updateProp('voltsDiv', e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </>
                )}

                {!['Signal Gen', 'Carrier Generator', 'Resistor', 'Capacitor', 'DSO'].includes(selectedComp.name) && (
                  <>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Component label</label>
                    <input type="text" value={selectedComp.label || selectedComp.name} onChange={(e) => updateProp('label', e.target.value)} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Value / model</label>
                    <input type="text" value={selectedComp.val ?? ''} onChange={(e) => updateProp('val', e.target.value)} placeholder="Enter value or model" style={{ padding: '7px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Unit</label>
                    <input type="text" value={selectedComp.unit || ''} onChange={(e) => updateProp('unit', e.target.value)} placeholder="V, Ω, F, H..." style={{ padding: '7px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                  </>
                )}
              </div>
            </div>
          )}
          <div style={{ position: 'absolute', left: '14px', bottom: '12px', zIndex: 30, pointerEvents: 'none', color: '#64748b', background: 'rgba(255,255,255,.88)', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '5px 8px', fontSize: '10px' }}>{activePin ? 'Click canvas to add a bend · click another pin to finish · Esc cancels' : 'Click a pin, then click another pin to connect · click empty canvas for bends · click wire to add nodes · drag nodes to reshape · Esc cancels'} · {Math.round(zoom * 100)}%</div>
        </div>}

        <aside style={{ width: isSidebarOpen ? '320px' : '0px', minWidth: isSidebarOpen ? '320px' : '0px', backgroundColor: '#ffffff', borderLeft: isSidebarOpen ? '1px solid #dbe3ec' : 'none', transition: 'width 0.2s ease', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 14px 10px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div><h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Component Library</h3><p style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>Click to add or drag onto the canvas</p></div>
              <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '4px 7px', borderRadius: '20px' }}>{componentCategories.reduce((n, c) => n + c.items.length, 0)} parts</span>
            </div>
            <input value={componentSearch} onChange={(e) => setComponentSearch(e.target.value)} placeholder="Search components..." aria-label="Search components" style={{ width: '100%', padding: '10px 11px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '12px', color: '#0f172a', background: '#f8fafc' }} />
          </div>
          <div style={{ padding: '12px', height: '100%', overflowY: 'auto' }}>
            {componentCategories.map(category => {
              const filteredItems = category.items.filter(c => c.name.toLowerCase().includes(componentSearch.toLowerCase()));
              if (!filteredItems.length) return null;
              const collapsed = collapsedCategories.includes(category.category) && !componentSearch;
              return <section key={category.category} style={{ marginBottom: '14px' }}>
                <button onClick={() => setCollapsedCategories(prev => prev.includes(category.category) ? prev.filter(x => x !== category.category) : [...prev, category.category])} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '8px 9px', marginBottom: '8px', cursor: 'pointer', color: '#334155', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  <span>{category.category} <small style={{ color: '#94a3b8', fontWeight: '600' }}>({filteredItems.length})</small></span><span>{collapsed ? '+' : '−'}</span>
                </button>
                {!collapsed && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                  {filteredItems.map(c => <button key={c.name} type="button" draggable onDragStart={(e) => handleDragStart(e, c)} onClick={() => handleAddFromLibrary(c)} title={`Add ${c.name} to canvas`} style={{ minHeight: '86px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '9px 6px', border: '1px solid #e2e8f0', borderRadius: '9px', cursor: 'grab', background: '#ffffff', color: '#334155', transition: 'border-color .15s, background .15s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.background = '#f0f9ff'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}>
                    <svg width="42" height="38" viewBox="0 0 100 100" style={{ marginBottom: '5px' }}>{renderSidebarIcon(c.icon, c.name)}</svg>
                    <span style={{ fontSize: '10px', color: '#334155', textAlign: 'center', fontWeight: '650', lineHeight: 1.25 }}>{c.name}</span>
                    <span style={{ fontSize: '9px', color: '#0ea5e9', marginTop: '4px' }}>+ Add</span>
                  </button>)}
                </div>}
              </section>;
            })}
            {componentCategories.every(category => category.items.every(c => !c.name.toLowerCase().includes(componentSearch.toLowerCase()))) && <p style={{ padding: '20px 8px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>No components match “{componentSearch}”.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
