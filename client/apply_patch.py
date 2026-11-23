from pathlib import Path
import sys
root = Path(sys.argv[1])

# Pin library integration
p = root / 'components/pins.js'
s = p.read_text()
if 'pinLibrary.js' not in s:
    s = "import { getPhysicalPinMap, ARDUINO_UNO_PINS } from './pinLibrary.js';\n" + s
old = "export const getPins = (type) => {\n  switch (type) {"
new = "export const getPins = (type) => {\n  const physical = getPhysicalPinMap(type);\n  if (physical) return physical;\n  if (type === 'arduino') return ARDUINO_UNO_PINS;\n  switch (type) {"
s = s.replace(old, new)
p.write_text(s)

# Component rendering integration
p = root / 'components/index.jsx'
s = p.read_text()
if 'Breadboard' not in s:
    s = s.replace("import React from 'react';", "import React from 'react';\nimport Breadboard from './Breadboard.jsx';\nimport { DIPPackage, ArduinoBoardAsset } from './RealisticParts.jsx';")
    old = "export const ElectronicSymbol = (props) => {\n  if (basicTypes.includes(props.type))"
    new = "export const ElectronicSymbol = (props) => {\n  if (props.type === 'breadboard') return <Breadboard {...props} />;\n  if (['ne555','555','74hc00','74hc02','74hc04','74hc08','74hc32','74hc73','74hc86'].includes(String(props.type).toLowerCase())) return <DIPPackage type={props.type} pins={String(props.type).toLowerCase().includes('555') ? 8 : 14} />;\n  if (props.type === 'arduino') return <ArduinoBoardAsset />;\n  if (basicTypes.includes(props.type))"
    s = s.replace(old, new)
p.write_text(s)

# Existing store: additive state and graph API
p = root / 'store.js'
s = p.read_text()
if 'buildElectricalNetlist' not in s:
    s = "import { buildElectricalNetlist } from './electrical/netlist.js';\n" + s
s = s.replace('components: [], wires: [], wireStart: null,', 'components: [], wires: [], breadboardInsertions: [], wireStart: null,')
if 'connectPinToHole:' not in s:
    addition = '''  connectPinToHole: (hole) => set((state) => {
    if (!state.wireStart) return state;
    const board = state.components.find(c => c.type === 'breadboard');
    if (!board) return { wireStart: null };
    const insertion = { id: `${state.wireStart.compId}:${state.wireStart.pin}:${hole.id}`, compId: state.wireStart.compId, pin: state.wireStart.pin, boardId: board.id, hole: { zone: hole.zone, column: hole.column, row: hole.row, id: hole.id } };
    const kept = state.breadboardInsertions.filter(i => !(i.compId === insertion.compId && i.pin === insertion.pin));
    return { breadboardInsertions: [...kept, insertion], wireStart: null };
  }),
  removeBreadboardInsertion: (id) => set((state) => ({ breadboardInsertions: state.breadboardInsertions.filter(i => i.id !== id) })),
  getElectricalNetlist: () => { const state = get(); return buildElectricalNetlist(state.wires, state.breadboardInsertions); },
'''
    s = s.replace('  cancelWire: () => set({ wireStart: null }),', '  cancelWire: () => set({ wireStart: null }),\n' + addition.rstrip())
s = s.replace('wires: state.wires.filter(w => w.from.compId !== id && w.to.compId !== id), selectedId: null', 'wires: state.wires.filter(w => w.from.compId !== id && w.to.compId !== id), breadboardInsertions: state.breadboardInsertions.filter(i => i.compId !== id && i.boardId !== id), selectedId: null')
p.write_text(s)

# Add new physical parts to existing catalogue, retaining all existing parts
p = root / 'Sidebar.jsx'
s = p.read_text()
if "type: 'breadboard'" not in s:
    old = "{ type: 'oscilloscope', label: 'DSO' }, { type: 'cro', label: 'CRO' }"
    new = """{ type: 'oscilloscope', label: 'DSO' }, { type: 'cro', label: 'CRO' },
  { type: 'breadboard', label: 'Solderless Breadboard' }, { type: 'arduino', label: 'Arduino UNO R3' },
  { type: 'ne555', label: 'NE555 Timer (DIP-8)' }, { type: '74hc00', label: '74HC00 NAND (DIP-14)' },
  { type: '74hc04', label: '74HC04 Inverter (DIP-14)' }, { type: '74hc08', label: '74HC08 AND (DIP-14)' },
  { type: '74hc32', label: '74HC32 OR (DIP-14)' }, { type: '74hc86', label: '74HC86 XOR (DIP-14)' },
  { type: '74hc73', label: '74HC73 JK FF (DIP-14)' }"""
    s = s.replace(old, new)
p.write_text(s)

# Add optional 3D preview mode while retaining the existing 2D editor.
p = root / 'TopBar.jsx'
s = p.read_text()
s = s.replace("{['Circuits', 'Schematic', 'Code'].map(tab => (", "{['Circuits', '3D', 'Schematic', 'Code'].map(tab => (")
p.write_text(s)
p = root / 'App.jsx'
s = p.read_text()
if 'Scene3DView' not in s:
    s = s.replace("import Canvas from './Canvas';", "import Canvas from './Canvas';\nimport Scene3DView from './Scene3DView.jsx';")
s = s.replace("{activeTab === 'Circuits' ? (", "{activeTab === 'Circuits' ? (")
s = s.replace("</>\n        ) : (", "</>\n        ) : activeTab === '3D' ? (\n          <Scene3DView />\n        ) : (")
p.write_text(s)

# Canvas: variable breadboard footprint, pin-to-hole insertion and visible lead
p = root / 'Canvas.jsx'
s = p.read_text()
s = s.replace('const { components, wires, updatePosition', 'const { components, wires, breadboardInsertions = [], connectPinToHole, wireStart, updatePosition')
s = s.replace(', wireStart, startWire', ', startWire')
s = s.replace("{components.map((comp) => {\n          const pins = getPins(comp.type);", "{components.map((comp) => {\n          const pins = getPins(comp.type);\n          const isBoard = comp.type === 'breadboard';\n          const compWidth = isBoard ? 600 : 140;\n          const compHeight = isBoard ? 246 : 90;")
s = s.replace('<Rnd key={comp.id} size={{ width: 140, height: 90 }}', '<Rnd key={comp.id} size={{ width: compWidth, height: compHeight }}')
s = s.replace("<ElectronicSymbol type={comp.type} value={comp.value} isClosed={comp.value === 'Closed'} />", "<ElectronicSymbol type={comp.type} value={comp.value} isClosed={comp.value === 'Closed'} insertions={breadboardInsertions.filter(i => i.boardId === comp.id)} wireStart={wireStart} onHoleConnect={connectPinToHole} />")
s = s.replace('{pins.map(pin => (', '{!isBoard && pins.map(pin => (')
s = s.replace("cursor: 'crosshair', zIndex: 100 }}>", "cursor: 'crosshair', zIndex: 100 }} title={`${pin.number ? `Pin ${pin.number}: ` : ''}${pin.name}${pin.kind ? ` · ${pin.kind}` : ''}`}>")
needle = '''          {wires.map(wire => {
            const from = getRotatedPinPosition(wire.from.compId, wire.from.pin);
            const to = getRotatedPinPosition(wire.to.compId, wire.to.pin);
            return <path key={wire.id} d={calculateWirePath(from.x, from.y, to.x, to.y)} fill="none" stroke="#22c55e" strokeWidth="5" />;
          })}'''
addition = '''
          {breadboardInsertions.map(item => {
            const from = getRotatedPinPosition(item.compId, item.pin);
            const board = components.find(c => c.id === item.boardId);
            if (!board) return null;
            const holeY = item.hole.zone === 'topRail' ? 27 + item.hole.row * 13 : item.hole.zone === 'upper' ? 75 + item.hole.row * 17 : item.hole.zone === 'lower' ? 171 + item.hole.row * 17 : 219 + item.hole.row * 13;
            const to = { x: board.x + 42 + item.hole.column * 17.7, y: board.y + holeY };
            return <path key={item.id} d={calculateWirePath(from.x, from.y, to.x, to.y)} fill="none" stroke="#16a34a" strokeWidth="3" strokeDasharray="6 3" />;
          })}'''
s = s.replace(needle, needle + addition)
p.write_text(s)
