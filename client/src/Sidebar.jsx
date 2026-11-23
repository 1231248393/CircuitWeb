import React, { useState } from 'react';
import { useStore } from './store';
import { 
  Minus, CircleDot, Search, Lightbulb, Battery, ToggleLeft, ZapOff, Radio, Activity, 
  Monitor, Waves, Circle, SlidersHorizontal, Cpu, Sun, Fan, Grid, Zap, CircuitBoard,
  ArrowRightLeft, Binary, Triangle, Cable
} from 'lucide-react';

const componentCategories = [
  { 
    name: 'General', 
    items: [ 
      { type: 'resistor', label: 'Resistor', icon: <Minus size={24} /> }, 
      { type: 'capacitor', label: 'Capacitor', icon: <Minus size={24} /> }, 
      { type: 'inductor', label: 'Inductor', icon: <CircleDot size={24} /> } 
    ] 
  },
  { 
    name: 'Input', 
    items: [ 
      { type: 'switch', label: 'Slide Switch', icon: <ToggleLeft size={24} /> }, 
      { type: 'pushbutton', label: 'Pushbutton', icon: <Circle size={24} /> }, 
      { type: 'potentiometer', label: 'Potentiometer', icon: <SlidersHorizontal size={24} /> }, 
      { type: 'ldr', label: 'Photoresistor', icon: <Sun size={24} /> } 
    ] 
  },
  { 
    name: 'Output', 
    items: [ 
      { type: 'led', label: 'LED', icon: <Lightbulb size={24} /> }, 
      { type: 'rgb_led', label: 'RGB LED', icon: <Lightbulb size={24} color="#ef4444" /> }, 
      { type: 'seven_segment', label: '7-Segment', icon: <Grid size={24} /> }, 
      { type: 'dc_motor', label: 'DC Motor', icon: <Fan size={24} /> } 
    ] 
  },
  { 
    name: 'Power', 
    items: [ 
      { type: 'voltage', label: '9V Battery', icon: <Battery size={24} /> }, 
      { type: 'ac_source', label: 'AC Source', icon: <Waves size={24} color="#f59e0b" /> }, 
      { type: 'coin_cell', label: 'Coin Cell', icon: <Battery size={24} color="#eab308" /> }, 
      { type: 'solar_cell', label: 'Solar Cell', icon: <Sun size={24} color="#3b82f6" /> }, 
      { type: 'ground', label: 'Ground', icon: <ZapOff size={24} /> } 
    ] 
  },
  { 
    name: 'Microcontrollers', 
    items: [ 
      { type: 'arduino', label: 'Arduino Uno', icon: <Cpu size={24} /> }, 
      { type: 'usb_cable', label: 'USB Cable', icon: <Cable size={24} /> },
      { type: 'npn_transistor', label: 'NPN Transistor', icon: <Zap size={24} /> }, 
      { type: 'jfet', label: 'JFET', icon: <Zap size={24} color="#10b981" /> }, 
      { type: 'opamp', label: 'Op-Amp', icon: <Triangle size={24} /> }, 
      { type: 'breadboard', label: 'Breadboard', icon: <CircuitBoard size={24} /> } 
    ] 
  },
  { 
    name: 'Instruments', 
    items: [ 
      { type: 'voltmeter', label: 'Voltmeter', icon: <Activity size={24} color="#3b82f6" /> }, 
      { type: 'ammeter', label: 'Ammeter', icon: <Activity size={24} color="#ef4444" /> }, 
      { type: 'signal_gen', label: 'Signal Gen', icon: <Radio size={24} /> }, 
      { type: 'carrier_gen', label: 'Carrier Gen', icon: <Radio size={24} color="#a78bfa" /> }, 
      { type: 'cro', label: 'Analog CRO', icon: <Monitor size={24} color="#22c55e" /> }, 
      { type: 'oscilloscope', label: 'Digital DSO', icon: <Monitor size={24} color="#3b82f6" /> } 
    ] 
  },
  { 
    name: 'Communication', 
    items: [ 
      { type: 'diode', label: 'Diode', icon: <Zap size={24} /> }, 
      { type: 'varactor', label: 'Varactor', icon: <Zap size={24} color="#8b5cf6" /> }, 
      { type: 'transformer', label: 'Transformer', icon: <CircleDot size={24} /> },
      { type: 'transformer_ct', label: 'CT Transformer', icon: <CircleDot size={24} color="#b45309" /> },
      { type: 'adc', label: 'ADC', icon: <ArrowRightLeft size={24} color="#f59e0b" /> },
      { type: 'dac', label: 'DAC', icon: <Binary size={24} color="#10b981" /> }
    ] 
  }
];

export default function Sidebar() {
  const { addComponent } = useStore();
  const [search, setSearch] = useState('');

  const handleDragStart = (e, compType) => {
    e.dataTransfer.setData('componentType', compType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div style={{ width: '300px', borderLeft: '1px solid #ccc', padding: '15px', background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '15px', color: '#000' }}>Components</h3>
      <div style={{ position: 'relative', marginBottom: '15px' }}>
        <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 8px 8px 30px', borderRadius: '6px', border: '1px solid #ccc', color: '#000' }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {componentCategories.map(category => {
          const filteredItems = category.items.filter(item => item.label.toLowerCase().includes(search.toLowerCase()));
          if (filteredItems.length === 0) return null;

          return (
            <div key={category.name} style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '12px', color: '#1890ff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', borderBottom: '1px solid #e0e0e0', paddingBottom: '5px' }}>{category.name}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {filteredItems.map((comp) => (
                  <div key={comp.type} draggable onDragStart={(e) => handleDragStart(e, comp.type)} onClick={() => addComponent(comp)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 5px', cursor: 'grab', border: '1px solid #ddd', borderRadius: '8px', background: '#ffffff', fontSize: '11px', color: '#000000', fontWeight: 'bold', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', userSelect: 'none' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#1890ff'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#ddd'}>
                    <div style={{ marginBottom: '8px', color: '#1890ff', pointerEvents: 'none' }}>{comp.icon}</div>
                    <span style={{ pointerEvents: 'none', textAlign: 'center' }}>{comp.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
