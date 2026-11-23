import { create } from 'zustand';
import { simulateCircuit } from './simulation';

export const useStore = create((set, get) => ({
  components: [], wires: [], wireStart: null, mousePos: { x: 0, y: 0 },
  simulationResult: null, isSimulating: false, selectedId: null, selectedWireId: null, 
  clipboard: null, zoom: 1, pan: { x: 0, y: 0 }, activeTab: 'Circuits',
  projectName: 'Untitled Circuit', savedProjects: JSON.parse(localStorage.getItem('proteus_projects') || '[]'),
  openScopes: [], pastStates: [], futureStates: [],

  saveHistory: () => set((state) => ({ pastStates: [...state.pastStates, { components: state.components, wires: state.wires }], futureStates: [] })),
  undo: () => set((state) => {
    if (state.pastStates.length === 0) return state;
    const previous = state.pastStates[state.pastStates.length - 1];
    return { pastStates: state.pastStates.slice(0, -1), futureStates: [{ components: state.components, wires: state.wires }, ...state.futureStates], components: previous.components, wires: previous.wires };
  }),
  redo: () => set((state) => {
    if (state.futureStates.length === 0) return state;
    const next = state.futureStates[0];
    return { pastStates: [...state.pastStates, { components: state.components, wires: state.wires }], futureStates: state.futureStates.slice(1), components: next.components, wires: next.wires };
  }),

  updateWireStyle: (wireId, field, value) => { get().saveHistory(); set((state) => ({ wires: state.wires.map(w => w.id === wireId ? { ...w, [field]: value } : w) })); },
  toggleScope: (id) => set((state) => ({ openScopes: state.openScopes.includes(id) ? state.openScopes.filter(s => s !== id) : [...state.openScopes, id] })),
  setProjectName: (name) => set({ projectName: name }),
  setZoom: (newZoom) => set({ zoom: newZoom }),
  setPan: (x, y) => set({ pan: { x, y } }),
  setIsSimulating: (val) => set({ isSimulating: val }),
  setMousePos: (x, y) => set({ mousePos: { x, y } }), 
  setSelectedId: (id) => set({ selectedId: id, selectedWireId: null }), 
  setSelectedWireId: (id) => set({ selectedWireId: id, selectedId: null }), 
  setActiveTab: (tab) => set({ activeTab: tab }),

  updateComponentValue: (id, field, value) => set((state) => ({ components: state.components.map(c => c.id === id ? { ...c, [field]: value } : c) })),
  startWire: (compId, pin, x, y) => { get().saveHistory(); set({ wireStart: { compId, pin, points: [{ x, y }] } }); },
  addWirePoint: (x, y) => set((state) => (!state.wireStart ? state : { wireStart: { ...state.wireStart, points: [...state.wireStart.points, { x, y }] } })),
  endWire: (compId, pin, x, y) => set((state) => {
    if (!state.wireStart) return state;
    if (state.wireStart.compId === compId && state.wireStart.pin === pin) return { wireStart: null };
    const newWire = { id: Date.now(), from: { compId: state.wireStart.compId, pin: state.wireStart.pin }, to: { compId, pin }, points: [...state.wireStart.points, { x, y }], color: '#22c55e', type: 'normal' };
    return { wires: [...state.wires, newWire], wireStart: null };
  }),
  cancelWire: () => set({ wireStart: null }),

  addComponent: (component, x = 400, y = 200) => {
    get().saveHistory();
    let defaultProps = { name: '1', value: '1', unit: '' };
    if (component.type === 'resistor') defaultProps = { name: 'R1', value: '1', unit: 'kΩ' };
    set((state) => ({ components: [...state.components, { id: Date.now(), x, y, rotation: 0, mirror: false, type: component.type, label: component.label, ...defaultProps }] }));
  },
  updatePosition: (id, x, y) => { get().saveHistory(); set((state) => ({ components: state.components.map(c => c.id === id ? { ...c, x, y } : c) })); },
  rotateComponent: (id) => { get().saveHistory(); set((state) => ({ components: state.components.map(c => c.id === id ? { ...c, rotation: ((c.rotation || 0) + 90) % 360 } : c) })); },
  mirrorComponent: (id) => { get().saveHistory(); set((state) => ({ components: state.components.map(c => c.id === id ? { ...c, mirror: !c.mirror } : c) })); },
  removeComponent: (id) => { get().saveHistory(); set((state) => ({ components: state.components.filter(c => c.id !== id), wires: state.wires.filter(w => w.from.compId !== id && w.to.compId !== id), selectedId: null })); },
  removeWire: (id) => { get().saveHistory(); set((state) => ({ wires: state.wires.filter(w => w.id !== id), selectedWireId: null })); },
  updateWireWaypoint: (wireId, pointIndex, newX, newY) => set((state) => ({
    wires: state.wires.map(w => {
      if (w.id === wireId) {
        const newPoints = [...w.points];
        newPoints[pointIndex] = { x: newX, y: newY };
        return { ...w, points: newPoints };
      }
      return w;
    })
  })),

  runSimulation: () => { 
    const result = simulateCircuit(get().components, get().wires); 
    const scopes = get().components.filter(c => c.type === 'oscilloscope' || c.type === 'cro').map(c => c.id);
    set({ isSimulating: true, simulationResult: result, openScopes: scopes }); 
  },
  stopSimulation: () => set({ isSimulating: false, simulationResult: null, openScopes: [] }),
  
  saveProject: () => {
    const { components, wires, projectName, savedProjects } = get();
    const newProject = { id: Date.now(), name: projectName, components, wires, date: new Date().toLocaleDateString() };
    const updatedProjects = [...savedProjects.filter(p => p.name !== projectName), newProject];
    localStorage.setItem('proteus_projects', JSON.stringify(updatedProjects));
    set({ savedProjects: updatedProjects });
    alert('Project Saved!');
  },
  
  // 🔥 BULLETPROOF LOADING: Sanitizes arrays to prevent crashes
  loadProject: (project) => set({ 
    components: Array.isArray(project.components) ? project.components : [], 
    wires: Array.isArray(project.wires) ? project.wires : [], 
    projectName: project.name || 'Untitled', 
    activeTab: 'Circuits',
    selectedId: null,
    selectedWireId: null,
    pastStates: [],
    futureStates: []
  }),
  newProject: () => set({ components: [], wires: [], projectName: 'Untitled Circuit', activeTab: 'Circuits', selectedId: null, selectedWireId: null, pastStates: [], futureStates: [] })
}));
