import { create } from 'zustand';
import { simulateCircuit } from './simulation';

export const useStore = create((set, get) => ({
  components: [], wires: [], wireStart: null, mousePos: { x: 0, y: 0 },
  simulationResult: null, isSimulating: false, selectedId: null, selectedWireId: null, 
  simulationTime: 0, activeTab: 'Circuits', zoom: 1, pan: { x: 0, y: 0 },

  setZoom: (newZoom) => set({ zoom: newZoom }),
  setPan: (x, y) => set({ pan: { x, y } }),
  setActiveTab: (tab) => set({ activeTab: tab }), 
  setSimulation: (result) => set({ simulationResult: result }),
  setIsSimulating: (val) => set({ isSimulating: val }),
  setMousePos: (x, y) => set({ mousePos: { x, y } }),
  setSelectedId: (id) => set({ selectedId: id, selectedWireId: null }), 
  setSelectedWireId: (id) => set({ selectedWireId: id, selectedId: null }), 

  removeWire: (id) => set((state) => ({ wires: state.wires.filter(w => w.id !== id) })),
  updateComponentValue: (id, field, value) => set((state) => ({ components: state.components.map(c => c.id === id ? { ...c, [field]: value } : c) })),
  
  rotateComponent: (id) => set((state) => ({ components: state.components.map(c => c.id === id ? { ...c, rotation: ((c.rotation || 0) + 90) % 360 } : c) })),
  mirrorComponent: (id) => set((state) => ({ components: state.components.map(c => c.id === id ? { ...c, mirror: !c.mirror } : c) })),
  toggleSwitch: (id) => set((state) => ({ components: state.components.map(c => c.id === id && c.type === 'switch' ? { ...c, value: c.value === 'Closed' ? 'Open' : 'Closed' } : c) })),

  startWire: (compId, pin) => set({ wireStart: { compId, pin } }),
  endWire: (compId, pin) => set((state) => {
    if (state.wireStart && state.wireStart.compId === compId && state.wireStart.pin === pin) return { wireStart: null };
    if (state.wireStart) return { wires: [...state.wires, { id: Date.now(), from: state.wireStart, to: { compId, pin } }], wireStart: null };
    return state;
  }),
  cancelWire: () => set({ wireStart: null }),

  addComponent: (component, x = 400, y = 200) => set((state) => {
    let defaultProps = { name: '1', value: '1', unit: '' };
    if (component.type === 'resistor') defaultProps = { name: 'R1', value: '1', unit: 'kΩ' };
    if (component.type === 'voltage') defaultProps = { name: 'V1', value: '9', unit: 'V' };
    if (component.type === 'voltmeter') defaultProps = { name: 'V1', value: '0', unit: 'V' };
    return {
      components: [...state.components, {
        id: Date.now(), x: x, y: y, width: 140, height: 90, rotation: 0, mirror: false,
        type: component.type, label: component.label, ...defaultProps
      }]
    };
  }),

  updatePosition: (id, x, y) => set((state) => ({ components: state.components.map(c => c.id === id ? { ...c, x, y } : c) })),
  removeComponent: (id) => set((state) => ({ components: state.components.filter(c => c.id !== id), wires: state.wires.filter(w => w.from.compId !== id && w.to.compId !== id), selectedId: null })),

  runSimulation: () => {
    const { components, wires } = get();
    const result = simulateCircuit(components, wires);
    if (result.success) set({ isSimulating: true, simulationResult: result, simulationTime: 0 });
    else { alert(`Simulation Failed: ${result.message}`); set({ isSimulating: false, simulationResult: result, simulationTime: 0 }); }
  },
  stopSimulation: () => set({ isSimulating: false, simulationResult: null, simulationTime: 0 })
}));
