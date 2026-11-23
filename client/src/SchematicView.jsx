import React, { useRef, useEffect, useState } from 'react';
import { useStore } from './store';
import { getPins } from './components';

const SchematicSymbol = ({ type, value, name, rotation, mirror }) => {
  const stroke = "#a00"; const strokeWidth = 2; const textColor = "#333";

  const getPath = () => {
    switch(type) {
      case 'resistor': return <><line x1="20" y1="45" x2="35" y2="45" /><polyline points="35,45 40,25 50,65 60,25 70,65 80,25 90,45 105,45" /><line x1="105" y1="45" x2="120" y2="45" /></>;
      case 'capacitor': return <><line x1="20" y1="45" x2="60" y2="45" /><line x1="60" y1="20" x2="60" y2="70" /><line x1="80" y1="20" x2="80" y2="70" /><line x1="80" y1="45" x2="120" y2="45" /></>;
      case 'inductor': return <><line x1="20" y1="45" x2="35" y2="45" /><path d="M 35 45 Q 42 20 50 45 Q 57 20 65 45 Q 72 20 80 45 Q 87 20 95 45 Q 102 20 105 45" /><line x1="105" y1="45" x2="120" y2="45" /></>;
      case 'voltage': case 'coin_cell': case 'solar_cell': return <><line x1="70" y1="15" x2="70" y2="30" /><line x1="45" y1="30" x2="95" y2="30" strokeWidth="3" /><line x1="55" y1="45" x2="85" y2="45" /><line x1="70" y1="45" x2="70" y2="75" /><text x="100" y="30" fontSize="14" fill={stroke} stroke="none">+</text><text x="100" y="55" fontSize="14" fill={stroke} stroke="none">-</text></>;
      case 'ground': return <><line x1="70" y1="15" x2="70" y2="45" /><line x1="45" y1="45" x2="95" y2="45" /><line x1="55" y1="55" x2="85" y2="55" /><line x1="65" y1="65" x2="75" y2="65" /></>;
      case 'diode': case 'led': return <><line x1="20" y1="45" x2="55" y2="45" /><polygon points="55,25 95,45 55,65" /><line x1="95" y1="25" x2="95" y2="65" /><line x1="95" y1="45" x2="120" y2="45" />{type === 'led' && <path d="M 60 30 L 70 15 M 70 15 L 75 20 M 70 15 L 65 10" strokeWidth="1.5" />}</>;
      case 'signal_gen': case 'carrier_gen': return <><line x1="20" y1="45" x2="45" y2="45" /><circle cx="70" cy="45" r="25" /><path d="M 50 45 Q 60 25 70 45 T 90 45" /><line x1="95" y1="45" x2="120" y2="45" /></>;
      case 'transformer': case 'transformer_ct': return <><path d="M 50 20 Q 30 30 50 40 Q 30 50 50 60 Q 30 70 50 80" /><path d="M 90 20 Q 110 30 90 40 Q 110 50 90 60 Q 110 70 90 80" /><line x1="65" y1="15" x2="65" y2="85" /><line x1="75" y1="15" x2="75" y2="85" />{type === 'transformer_ct' && <line x1="50" y1="45" x2="20" y2="45" />}</>;
      case 'oscilloscope': case 'cro': case 'voltmeter': case 'ammeter': return <><line x1="20" y1="45" x2="45" y2="45" /><circle cx="70" cy="45" r="25" /><text x="70" y="52" fontSize="20" fill={stroke} textAnchor="middle" stroke="none">{type === 'voltmeter' ? 'V' : type === 'ammeter' ? 'A' : 'O'}</text><line x1="95" y1="45" x2="120" y2="45" /></>;
      case 'adc': case 'dac': return <><rect x="15" y="15" width="110" height="60" rx="6" /><text x="70" y="50" fontSize="20" fill={stroke} textAnchor="middle" stroke="none">{type.toUpperCase()}</text></>;
      case 'arduino': return <><rect x="10" y="10" width="120" height="70" /><text x="70" y="45" fontSize="14" fill={stroke} textAnchor="middle" stroke="none">Arduino</text><text x="70" y="65" fontSize="10" fill={stroke} textAnchor="middle" stroke="none">UNO</text></>;
      case 'breadboard': return <><rect x="10" y="20" width="120" height="50" /><line x1="20" y1="30" x2="120" y2="30" strokeDasharray="2,2" /><line x1="20" y1="60" x2="120" y2="60" strokeDasharray="2,2" /></>;
      case 'seven_segment': return <><rect x="20" y="10" width="100" height="70" /><text x="70" y="50" fontSize="24" fill={stroke} textAnchor="middle" stroke="none">8</text></>;
      default: return <><rect x="30" y="20" width="80" height="50" /><text x="70" y="50" fontSize="10" fill={stroke} textAnchor="middle" stroke="none">{type}</text></>;
    }
  };

  return (
    <div style={{ position: 'relative', width: '140px', height: '90px' }}>
      <svg width="140" height="90" viewBox="0 0 140 90">
        <g style={{ transform: `rotate(${rotation || 0}deg) scaleX(${mirror ? -1 : 1})`, transformOrigin: '70px 45px' }}>
          <g stroke={stroke} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round">{getPath()}</g>
        </g>
        <text x="70" y="15" fontSize="11" fill={textColor} textAnchor="middle" fontWeight="bold">{name}</text>
        <text x="70" y="85" fontSize="11" fill={textColor} textAnchor="middle">{value}</text>
      </svg>
    </div>
  );
};

export default function SchematicView() {
  const { components, wires } = useStore();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // 🔥 Auto-center components in the middle of the fixed paper
  useEffect(() => {
    if (components.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      components.forEach(c => {
        minX = Math.min(minX, c.x); minY = Math.min(minY, c.y);
        maxX = Math.max(maxX, c.x + 140); maxY = Math.max(maxY, c.y + 90);
      });
      
      const circuitCenterX = (minX + maxX) / 2;
      const circuitCenterY = (minY + maxY) / 2;
      
      // 1400x900 paper -> center is 700, 450
      setOffset({ x: 700 - circuitCenterX, y: 450 - circuitCenterY });
    }
  }, [components]);

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

  const getSchematicWirePath = (x1, y1, x2, y2) => {
    if (Math.abs(x1 - x2) < 5 || Math.abs(y1 - y2) < 5) return `M ${x1} ${y1} L ${x2} ${y2}`;
    const midX = (x1 + x2) / 2;
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  };

  return (
    // 🔥 FIXED LAYOUT: No Panning, purely centered
    <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#525659', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Fixed A4 Paper Sheet */}
      <div style={{ 
        width: '1400px', height: '900px', 
        background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        position: 'relative',
        transform: 'scale(0.65)', // Scale down to fit screen, but keep locked
        border: '1px solid #ccc'
      }}>
        <div style={{ position: 'absolute', inset: '15px', border: '2px solid #a00' }}>
          <div style={{ position: 'absolute', inset: '10px', border: '1px solid #a00' }}>
            
            <div style={{ position: 'absolute', top: '-12px', left: '0', right: '0', display: 'flex', justifyContent: 'space-around', fontSize: '11px', fontWeight: 'bold', color: '#a00' }}>
              {[1, 2, 3, 4, 5, 6, 7].map(num => <span key={num}>{num}</span>)}
            </div>
            <div style={{ position: 'absolute', bottom: '-12px', left: '0', right: '0', display: 'flex', justifyContent: 'space-around', fontSize: '11px', fontWeight: 'bold', color: '#a00' }}>
              {[1, 2, 3, 4, 5, 6, 7].map(num => <span key={num}>{num}</span>)}
            </div>
            <div style={{ position: 'absolute', left: '-15px', top: '0', bottom: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', fontSize: '11px', fontWeight: 'bold', color: '#a00' }}>
              {['A', 'B', 'C', 'D', 'E', 'F'].map(char => <span key={char}>{char}</span>)}
            </div>
            <div style={{ position: 'absolute', right: '-15px', top: '0', bottom: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', fontSize: '11px', fontWeight: 'bold', color: '#a00' }}>
              {['A', 'B', 'C', 'D', 'E', 'F'].map(char => <span key={char}>{char}</span>)}
            </div>

            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '350px', height: '80px', borderTop: '2px solid #a00', borderLeft: '2px solid #a00', padding: '10px', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ borderBottom: '1px solid #a00', paddingBottom: '5px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a00' }}>
                <span>Made with CircuitWeb</span>
                <span>Sheet: 1/1</span>
              </div>
              <div style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>Title: <span style={{fontWeight: 'normal'}}>Circuit Diagram</span></div>
              <div style={{ fontSize: '11px', color: '#333' }}>Date: {new Date().toLocaleDateString()}</div>
            </div>

            {/* Center Content Container */}
            <div style={{ position: 'absolute', inset: 0, transform: `translate(${offset.x}px, ${offset.y}px)` }}>
              
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                {wires.map(wire => {
                  const from = getRotatedPinPosition(wire.from.compId, wire.from.pin);
                  const to = getRotatedPinPosition(wire.to.compId, wire.to.pin);
                  const path = getSchematicWirePath(from.x, from.y, to.x, to.y);
                  return (
                    <g key={wire.id}>
                      <path d={path} fill="none" stroke="#a00" strokeWidth="2" />
                      <circle cx={from.x} cy={from.y} r="3" fill="#a00" />
                      <circle cx={to.x} cy={to.y} r="3" fill="#a00" />
                    </g>
                  );
                })}
              </svg>

              {components.map(comp => (
                <div key={comp.id} style={{ position: 'absolute', left: comp.x, top: comp.y, width: 140, height: 90, zIndex: 2 }}>
                  <SchematicSymbol 
                    type={comp.type} 
                    value={`${comp.value || ''}${comp.unit || ''}`} 
                    name={comp.name || comp.label} 
                    rotation={comp.rotation}
                    mirror={comp.mirror}
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
