import React from 'react';

export const getResistorColors = (value) => {
  const colors = ['#000000', '#78350f', '#dc2626', '#ea580c', '#eab308', '#16a34a', '#2563eb', '#7c3aed', '#6b7280', '#ffffff'];
  let num = parseInt(value);
  if (isNaN(num) || num <= 0) num = 1000;
  const valStr = num.toString();
  let c1 = 0, c2 = 0, mult = 0;
  if (valStr.length === 1) { c1 = parseInt(valStr[0]); c2 = 0; mult = 0; }
  else if (valStr.length === 2) { c1 = parseInt(valStr[0]); c2 = parseInt(valStr[1]); mult = 0; }
  else if (valStr.length === 3) { c1 = parseInt(valStr[0]); c2 = parseInt(valStr[1]); mult = 1; }
  else if (valStr.length === 4) { c1 = parseInt(valStr[0]); c2 = parseInt(valStr[1]); mult = 2; }
  else if (valStr.length === 5) { c1 = parseInt(valStr[0]); c2 = parseInt(valStr[1]); mult = 3; }
  else { c1 = parseInt(valStr[0]); c2 = parseInt(valStr[1]); mult = Math.min(valStr.length - 3, 9); }
  return [colors[c1] || '#000', colors[c2] || '#000', colors[mult] || '#000', '#eab308'];
};

export const RealisticIcons = {
  Resistor: ({ value }) => {
    const [c1, c2, mult, tol] = getResistorColors(value);
    return (
      <g>
        <line x1="10" y1="50" x2="25" y2="50" stroke="#9ca3af" strokeWidth="4" />
        <line x1="75" y1="50" x2="90" y2="50" stroke="#9ca3af" strokeWidth="4" />
        <rect x="25" y="35" width="50" height="30" rx="5" fill="#fdf6e3" stroke="#a8a29e" strokeWidth="1.5" />
        <rect x="30" y="35" width="6" height="30" fill={c1} /> 
        <rect x="40" y="35" width="6" height="30" fill={c2} /> 
        <rect x="50" y="35" width="6" height="30" fill={mult} /> 
        <rect x="65" y="35" width="3" height="30" fill={tol} /> 
      </g>
    );
  },
  SignalGen: () => (
    <g>
      <rect x="10" y="30" width="80" height="40" rx="8" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
      <path d="M 20 50 Q 30 30 40 50 T 60 50 T 80 50" fill="none" stroke="white" strokeWidth="3" />
      <text x="50" y="62" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">SIGNAL GEN</text>
    </g>
  ),
  // 🚨 UPDATED DSO ICON (Clear Labels)
  DSO: () => (
    <g>
      <rect x="5" y="5" width="90" height="90" rx="4" fill="#111827" stroke="#374151" strokeWidth="2" />
      <path d="M 25 35 Q 35 20 45 35 T 65 35 T 85 35" fill="none" stroke="#00ffff" strokeWidth="2" />
      <path d="M 25 60 Q 35 45 45 60 T 65 60 T 85 60" fill="none" stroke="#10b981" strokeWidth="2" />
      
      {/* Pins (Spaced out vertically) */}
      <circle cx="5" cy="20" r="3" fill="#ef4444" />
      <text x="12" y="23" fontSize="7" fill="#ef4444" fontWeight="bold">CH1</text>
      
      <circle cx="5" cy="50" r="3" fill="#3b82f6" />
      <text x="12" y="53" fontSize="7" fill="#3b82f6" fontWeight="bold">CH2</text>
      
      <circle cx="5" cy="80" r="3" fill="#9ca3af" />
      <text x="12" y="83" fontSize="7" fill="#9ca3af" fontWeight="bold">GND</text>
      
      <text x="50" y="85" fontSize="6" fill="#4b5563" textAnchor="middle" fontWeight="bold">DIGITAL DSO</text>
    </g>
  ),
  Diode: () => (
    <g>
      <line x1="10" y1="50" x2="35" y2="50" stroke="#9ca3af" strokeWidth="4" />
      <line x1="65" y1="50" x2="90" y2="50" stroke="#9ca3af" strokeWidth="4" />
      <polygon points="35,35 35,65 65,50" fill="#111827" />
      <line x1="65" y1="35" x2="65" y2="65" stroke="#111827" strokeWidth="4" />
    </g>
  ),
  Capacitor: () => (
    <g>
      <line x1="50" y1="10" x2="50" y2="30" stroke="#9ca3af" strokeWidth="4" />
      <line x1="50" y1="70" x2="50" y2="90" stroke="#9ca3af" strokeWidth="4" />
      <line x1="30" y1="30" x2="70" y2="30" stroke="#111827" strokeWidth="4" />
      <line x1="30" y1="70" x2="70" y2="70" stroke="#111827" strokeWidth="4" />
    </g>
  ),
  Ground: () => (
    <g>
      <line x1="50" y1="20" x2="50" y2="50" stroke="#111827" strokeWidth="4" />
      <line x1="30" y1="50" x2="70" y2="50" stroke="#111827" strokeWidth="4" />
      <line x1="38" y1="60" x2="62" y2="60" stroke="#111827" strokeWidth="4" />
      <line x1="45" y1="70" x2="55" y2="70" stroke="#111827" strokeWidth="4" />
    </g>
  ),
  Battery: () => <g><rect x="22" y="28" width="56" height="44" rx="5" fill="#e2e8f0" stroke="#334155" strokeWidth="3"/><rect x="43" y="20" width="14" height="8" fill="#64748b"/><path d="M50 36 V48 M44 42 H56 M50 54 V64" stroke="#0f172a" strokeWidth="3"/><text x="50" y="68" fontSize="8" textAnchor="middle" fill="#334155">9V</text></g>,
  VoltageSource: () => <g><circle cx="50" cy="50" r="27" fill="#fff" stroke="#334155" strokeWidth="3"/><path d="M50 23 V8 M50 77 V92 M42 42 H58 M50 34 V50" stroke="#334155" strokeWidth="3"/><path d="M31 50 Q40 34 50 50 T69 50" fill="none" stroke="#0ea5e9" strokeWidth="2.5"/></g>,
  Inductor: () => <g><path d="M8 50 H20 C20 25 40 25 40 50 C40 25 60 25 60 50 C60 25 80 25 80 50 H92" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round"/></g>,
  Potentiometer: () => <g><path d="M8 50 H25 L33 35 L43 65 L53 35 L63 65 L73 50 H92" fill="none" stroke="#334155" strokeWidth="3"/><path d="M57 12 L49 27 H65 Z" fill="#0ea5e9"/><path d="M57 27 V36" stroke="#0ea5e9" strokeWidth="3"/></g>,
  Transformer: () => <g><path d="M12 50 H30 M70 50 H88" stroke="#334155" strokeWidth="3"/><path d="M30 25 C15 25 15 75 30 75 M38 25 C23 25 23 75 38 75 M62 25 C77 25 77 75 62 75 M70 25 C85 25 85 75 70 75" fill="none" stroke="#0ea5e9" strokeWidth="3"/><path d="M50 18 V82" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3"/></g>,
  LED: () => <g><path d="M15 50 H35 M65 50 H85" stroke="#334155" strokeWidth="3"/><polygon points="35,32 35,68 65,50" fill="#ef4444" stroke="#334155" strokeWidth="2"/><path d="M65 32 V68 M57 22 L72 10 M68 29 L83 17" stroke="#ef4444" strokeWidth="3"/></g>,
  Transistor: () => <g><path d="M50 20 V80 M50 42 L25 25 M50 58 L25 75 M50 50 L80 50" stroke="#334155" strokeWidth="4" fill="none"/><path d="M25 25 L14 17 M25 75 L14 83 M80 50 H92" stroke="#334155" strokeWidth="3"/></g>,
  IC555: () => <g><rect x="25" y="15" width="50" height="70" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="2"/>{[25,40,60,75].map(y=><path key={y} d={`M15 ${y} H25 M75 ${y} H85`} stroke="#94a3b8" strokeWidth="3"/>)}<text x="50" y="54" fontSize="15" textAnchor="middle" fill="white" fontWeight="bold">555</text></g>,
  OpAmp: () => <g><polygon points="25,18 25,82 82,50" fill="#e0f2fe" stroke="#0369a1" strokeWidth="3"/><path d="M8 38 H25 M8 62 H25 M82 50 H94" stroke="#334155" strokeWidth="3"/><text x="31" y="42" fontSize="11" fill="#0369a1">−</text><text x="31" y="68" fontSize="11" fill="#0369a1">+</text></g>,
  LogicGate: () => <g><path d="M20 22 H43 C80 22 80 78 43 78 H20 Z" fill="#e0f2fe" stroke="#0369a1" strokeWidth="3"/><path d="M5 38 H20 M5 62 H20 M80 50 H95" stroke="#334155" strokeWidth="3"/></g>,
  FlipFlop: () => <g><rect x="22" y="20" width="56" height="60" rx="4" fill="#e0f2fe" stroke="#0369a1" strokeWidth="3"/><text x="50" y="55" fontSize="18" textAnchor="middle" fill="#0369a1" fontWeight="bold">D</text><path d="M5 35 H22 M5 65 H22 M78 35 H95 M78 65 H95" stroke="#334155" strokeWidth="3"/></g>,
  Arduino: () => <g><rect x="18" y="15" width="64" height="70" rx="7" fill="#0f766e" stroke="#134e4a" strokeWidth="3"/><circle cx="50" cy="50" r="16" fill="#ccfbf1"/><text x="50" y="54" fontSize="8" textAnchor="middle" fill="#115e59">UNO</text><path d="M10 25 H18 M10 38 H18 M10 51 H18 M10 64 H18 M82 25 H90 M82 38 H90 M82 51 H90 M82 64 H90" stroke="#64748b" strokeWidth="3"/></g>,
  ESP32: () => <g><rect x="25" y="12" width="50" height="76" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="2"/><rect x="38" y="32" width="24" height="28" fill="#94a3b8"/><text x="50" y="75" fontSize="9" textAnchor="middle" fill="white">ESP32</text><path d="M17 20 H25 M17 32 H25 M17 44 H25 M17 56 H25 M17 68 H25 M75 20 H83 M75 32 H83 M75 44 H83 M75 56 H83 M75 68 H83" stroke="#64748b" strokeWidth="2"/></g>,
  Breadboard: () => <g><rect x="8" y="22" width="84" height="56" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2"/><path d="M15 38 H85 M15 62 H85" stroke="#cbd5e1" strokeWidth="2"/>{Array.from({length:9},(_,i)=><g key={i}><circle cx={18+i*8} cy="31" r="1.8" fill="#64748b"/><circle cx={18+i*8} cy="47" r="1.8" fill="#64748b"/><circle cx={18+i*8} cy="55" r="1.8" fill="#64748b"/><circle cx={18+i*8} cy="70" r="1.8" fill="#64748b"/></g>)}</g>,
  Meter: () => <g><rect x="18" y="15" width="64" height="70" rx="7" fill="#1e293b" stroke="#475569" strokeWidth="3"/><rect x="28" y="25" width="44" height="24" rx="3" fill="#d1fae5"/><path d="M50 44 L62 30" stroke="#047857" strokeWidth="2.5"/><circle cx="50" cy="44" r="3" fill="#047857"/><circle cx="38" cy="66" r="4" fill="#ef4444"/><circle cx="62" cy="66" r="4" fill="#0ea5e9"/></g>,
  Default: () => (
    <g>
      <rect x="25" y="25" width="50" height="50" rx="4" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" />
      <circle cx="50" cy="50" r="15" fill="#d1d5db" />
    </g>
  )
};

// Physical-style package illustrations. These are original schematic-editor drawings,
// not manufacturer photographs or exact PCB footprints.

// Physical package pin maps. Coordinates are percentages of the component's 100x100 viewBox.
const DIP14_Y_LEFT = [10, 23.33, 36.67, 50, 63.33, 76.67, 90];
const DIP14_Y_RIGHT = [90, 76.67, 63.33, 50, 36.67, 23.33, 10];

const makeDIP14Pins = (pinNames) => [
  ...pinNames.slice(0, 7).map((name, index) => ({
    id: `pin${index + 1}`, number: index + 1, name: `Pin ${index + 1} · ${name}`,
    x: 5, y: DIP14_Y_LEFT[index], function: name,
    electrical: name === 'GND' ? 'Ground · 0 V reference' : name === 'VCC' ? 'Positive supply pin' : name.endsWith('Y') ? 'Logic output' : 'Logic input'
  })),
  ...pinNames.slice(7, 14).map((name, index) => ({
    id: `pin${index + 8}`, number: index + 8, name: `Pin ${index + 8} · ${name}`,
    x: 95, y: DIP14_Y_RIGHT[index], function: name,
    electrical: name === 'GND' ? 'Ground · 0 V reference' : name === 'VCC' ? 'Positive supply pin' : name.endsWith('Y') ? 'Logic output' : 'Logic input'
  }))
];

const makeBreadboardPins = () => {
  const pins = [];
  const letterRows = [
    ['A', 27], ['B', 31.6], ['C', 36.2], ['D', 40.8], ['E', 45.4],
    ['F', 58.6], ['G', 63.2], ['H', 67.8], ['I', 72.4], ['J', 77]
  ];
  const xForColumn = (column) => 6 + (88 * (column - 1)) / 29;

  // Four power rails: top/bottom positive and ground, split into 15-hole sections.
  for (const rail of ['positive', 'ground']) {
    for (const side of ['top', 'bottom']) {
      for (let column = 1; column <= 30; column += 1) {
        const id = side === 'top' && column <= 10
          ? `rail-${rail}-${column}`
          : `rail-${rail}-${side}-${column}`;
        // Keep the original 10 rail pin IDs on their original left/right nets.
        // Their visual positions are interleaved with new holes so the physical
        // rail still has a 15-hole split at its midpoint.
        let physicalColumn = column;
        let section = column <= 15 ? 'left' : 'right';
        if (side === 'top') {
          if (column <= 5) { physicalColumn = column; section = 'left'; }
          else if (column <= 10) { physicalColumn = column + 10; section = 'right'; }
          else if (column <= 20) { physicalColumn = column - 5; section = 'left'; }
          else { physicalColumn = column; section = 'right'; }
        }
        pins.push({
          id,
          name: `${rail === 'positive' ? '+' : '−'} ${side} rail hole ${column}`,
          x: xForColumn(physicalColumn),
          y: rail === 'positive' ? (side === 'top' ? 11 : 84) : (side === 'top' ? 16 : 89),
          function: rail === 'positive' ? 'Positive power bus' : 'Ground / return bus',
          electrical: 'Connected along this half of the power rail; the centre break isolates the other half',
          electricalGroup: `rail-${rail}-${side}-${section}`
        });
      }
    }
  }

  // 30 numbered columns. A-E and F-J are separate five-hole terminal groups.
  for (let column = 1; column <= 30; column += 1) {
    const x = xForColumn(column);
    for (const [letter, y] of letterRows) {
      const leftSide = 'ABCDE'.includes(letter);
      pins.push({
        id: `hole-${letter}${column}`,
        name: `${letter}${column}`,
        x, y,
        function: 'Breadboard terminal hole',
        electrical: leftSide
          ? 'Connected to the other four holes A-E in this numbered column'
          : 'Connected to the other four holes F-J in this numbered column',
        electricalGroup: `terminal-${column}-${leftSide ? 'left' : 'right'}`
      });
    }
  }
  return pins;
};

export const PhysicalIcons = {
  Resistor: ({ value }) => { const [c1,c2,mult,tol] = getResistorColors(value); return <g><path d="M3 50 H38 M62 50 H97" stroke="#aeb7c2" strokeWidth="2.2"/><path d="M3 49 H38 M62 49 H97" stroke="#f8fafc" strokeWidth=".7"/><rect x="38" y="31" width="24" height="38" rx="9" fill="#d9b77e" stroke="#8b6b3f" strokeWidth="1.5"/><path d="M42 32 V68" stroke={c1} strokeWidth="3"/><path d="M47 32 V68" stroke={c2} strokeWidth="3"/><path d="M53 32 V68" stroke={mult} strokeWidth="3"/><path d="M59 32 V68" stroke={tol} strokeWidth="2.4"/></g>; },
  Capacitor: () => <g><path d="M42 74 V98 M58 74 V98" stroke="#aeb7c2" strokeWidth="2.2"/><rect x="5" y="8" width="90" height="68" rx="15" fill="#1d4f91" stroke="#173b68" strokeWidth="1.8"/><ellipse cx="50" cy="11" rx="43" ry="5" fill="#4f83bd"/><path d="M25 22 V65" stroke="#93c5fd" strokeWidth="2" opacity=".7"/><text x="68" y="48" fontSize="12" fill="white">+</text></g>,
  Diode: () => <g><path d="M3 50 H38 M62 50 H97" stroke="#aeb7c2" strokeWidth="2.2"/><rect x="38" y="31" width="24" height="38" rx="8" fill="#30343b" stroke="#111827" strokeWidth="1.5"/><path d="M58 31 V69" stroke="#e5e7eb" strokeWidth="4"/></g>,
  LED: () => <g><path d="M42 51 V97 M58 51 V97" stroke="#aeb7c2" strokeWidth="2.2"/><path d="M5 38 Q5 18 50 18 Q95 18 95 38 L88 51 H12 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.8"/><ellipse cx="50" cy="21" rx="40" ry="5" fill="#fca5a5" opacity=".7"/><path d="M30 32 L22 23 M49 28 L49 17" stroke="#fecaca" strokeWidth="2"/></g>,
  Inductor: () => <g><path d="M5 55 H20 M80 55 H95" stroke="#9ca3af" strokeWidth="3"/><path d="M20 55 C20 25 35 25 35 55 C35 25 50 25 50 55 C50 25 65 25 65 55 C65 25 80 25 80 55" fill="none" stroke="#b45309" strokeWidth="5"/></g>,
  Potentiometer: () => <g><rect x="20" y="35" width="60" height="30" rx="7" fill="#334155" stroke="#0f172a" strokeWidth="2"/><path d="M5 50 H20 M80 50 H95 M50 5 V35" stroke="#9ca3af" strokeWidth="3"/><circle cx="50" cy="35" r="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="2"/></g>,
  Transformer: () => <g><rect x="23" y="20" width="54" height="60" rx="7" fill="#d1d5db" stroke="#64748b" strokeWidth="3"/><path d="M33 28 C18 28 18 72 33 72 M40 28 C25 28 25 72 40 72 M60 28 C75 28 75 72 60 72 M67 28 C82 28 82 72 67 72" fill="none" stroke="#b45309" strokeWidth="3"/><path d="M5 30 H23 M5 70 H23 M77 30 H95 M77 70 H95" stroke="#9ca3af" strokeWidth="3"/></g>,
  Battery: () => <g><rect x="5" y="18" width="90" height="77" rx="8" fill="#334155" stroke="#0f172a" strokeWidth="2"/><rect x="35" y="8" width="13" height="12" rx="2" fill="#cbd5e1"/><rect x="54" y="8" width="13" height="12" rx="2" fill="#cbd5e1"/><text x="50" y="60" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">9V</text><text x="41" y="7" textAnchor="middle" fontSize="7" fill="#dc2626">+</text><text x="60" y="7" textAnchor="middle" fontSize="7" fill="#e5e7eb">−</text></g>,
  VoltageSource: () => <g><rect x="20" y="22" width="60" height="56" rx="9" fill="#1e293b" stroke="#0f172a" strokeWidth="2"/><circle cx="50" cy="50" r="17" fill="#e2e8f0" stroke="#64748b" strokeWidth="2"/><path d="M50 39 V61 M39 50 H61" stroke="#0f172a" strokeWidth="2"/><path d="M50 5 V22 M50 78 V95" stroke="#9ca3af" strokeWidth="4"/></g>,
  SignalGen: () => <g><rect x="5" y="12" width="90" height="76" rx="8" fill="#0e7490" stroke="#164e63" strokeWidth="2.5"/><rect x="14" y="22" width="72" height="38" rx="3" fill="#082f49"/><path d="M19 42 Q28 25 37 42 T55 42 T73 42 T82 42" fill="none" stroke="#67e8f9" strokeWidth="2.5"/><circle cx="25" cy="74" r="4" fill="#cbd5e1"/><circle cx="75" cy="74" r="4" fill="#cbd5e1"/><text x="50" y="83" fontSize="6" fill="white" textAnchor="middle">FUNCTION GEN</text></g>,
  Transistor: ({ value }) => { const isPower = String(value || '').toUpperCase().includes('IRF'); return isPower ? <g><rect x="10" y="13" width="80" height="59" rx="4" fill="#111827" stroke="#64748b" strokeWidth="2"/><path d="M10 22 H90" stroke="#94a3b8" strokeWidth="2"/><circle cx="50" cy="28" r="5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5"/><path d="M25 72 V98 M50 72 V98 M75 72 V98" stroke="#cbd5e1" strokeWidth="3"/><text x="50" y="55" fontSize="7" fill="#e2e8f0" textAnchor="middle">TO-220</text></g> : <g><path d="M25 61 V97 M50 61 V97 M75 61 V97" stroke="#cbd5e1" strokeWidth="2.6"/><path d="M25 25 Q50 13 75 25 L72 63 Q50 73 28 63 Z" fill="#111827" stroke="#64748b" strokeWidth="2"/><path d="M31 28 Q50 20 69 28" stroke="#475569" strokeWidth="1.5" fill="none"/><text x="50" y="49" fontSize="6" fill="#e2e8f0" textAnchor="middle">TO-92</text></g>; },
  IC555: () => <g><rect x="17" y="2" width="66" height="96" rx="5" fill="#111827" stroke="#64748b" strokeWidth="2"/><path d="M42 2 Q50 16 58 2" fill="#e5e7eb"/><text x="50" y="53" fontSize="13" fill="#e2e8f0" textAnchor="middle">NE555</text>{[10,36.67,63.33,90].map(y=><g key={y}><path d={`M5 ${y} H17 M83 ${y} H95`} stroke="#cbd5e1" strokeWidth="3"/><path d={`M5 ${y-1} H17 M83 ${y-1} H95`} stroke="#fff" strokeOpacity=".45" strokeWidth=".6"/></g>)}</g>,

  IC74HC04: () => <g>
    <defs>
      <linearGradient id="dip14Body04" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#303840"/><stop offset=".5" stopColor="#111820"/><stop offset="1" stopColor="#05090d"/></linearGradient>
      <linearGradient id="dip14Metal04" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f8fafc"/><stop offset=".45" stopColor="#94a3b8"/><stop offset="1" stopColor="#475569"/></linearGradient>
    </defs>
    {DIP14_Y_LEFT.map((y,i)=><g key={`l${i}`}><path d={`M5 ${y} H17`} stroke="url(#dip14Metal04)" strokeWidth="3.8"/><path d={`M5 ${y-1} H17`} stroke="#fff" strokeOpacity=".55" strokeWidth=".7"/></g>)}
    {DIP14_Y_RIGHT.map((y,i)=><g key={`r${i}`}><path d={`M83 ${y} H95`} stroke="url(#dip14Metal04)" strokeWidth="3.8"/><path d={`M83 ${y-1} H95`} stroke="#fff" strokeOpacity=".55" strokeWidth=".7"/></g>)}
    <rect x="17" y="2" width="66" height="96" rx="5" fill="url(#dip14Body04)" stroke="#64748b" strokeWidth="1.5"/>
    <path d="M42 2 Q50 16 58 2" fill="#dbe4ed" stroke="#64748b" strokeWidth="1"/>
    <circle cx="24" cy="13" r="2.3" fill="#cbd5e1"/>
    <text x="50" y="47" fontSize="10" fill="#f8fafc" textAnchor="middle" fontWeight="bold">74HC04</text>
    <text x="50" y="57" fontSize="4.5" fill="#94a3b8" textAnchor="middle">HEX INVERTER</text>
    {DIP14_Y_LEFT.map((y,i)=><text key={`ln${i}`} x="19" y={y+1.8} fontSize="3.7" fill="#aab6c2">{i+1}</text>)}
    {DIP14_Y_RIGHT.map((y,i)=><text key={`rn${i}`} x="81" y={y+1.8} fontSize="3.7" fill="#aab6c2" textAnchor="end">{14-i}</text>)}
  </g>,
  IC74HC08: () => <g>
    <defs>
      <linearGradient id="dip14Body08" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#303840"/><stop offset=".5" stopColor="#111820"/><stop offset="1" stopColor="#05090d"/></linearGradient>
      <linearGradient id="dip14Metal08" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f8fafc"/><stop offset=".45" stopColor="#94a3b8"/><stop offset="1" stopColor="#475569"/></linearGradient>
    </defs>
    {DIP14_Y_LEFT.map((y,i)=><path key={`l${i}`} d={`M5 ${y} H17`} stroke="url(#dip14Metal08)" strokeWidth="3.8"/>)}
    {DIP14_Y_RIGHT.map((y,i)=><path key={`r${i}`} d={`M83 ${y} H95`} stroke="url(#dip14Metal08)" strokeWidth="3.8"/>)}
    <rect x="17" y="2" width="66" height="96" rx="5" fill="url(#dip14Body08)" stroke="#64748b" strokeWidth="1.5"/>
    <path d="M42 2 Q50 16 58 2" fill="#dbe4ed" stroke="#64748b" strokeWidth="1"/>
    <circle cx="24" cy="13" r="2.3" fill="#cbd5e1"/>
    <text x="50" y="47" fontSize="10" fill="#f8fafc" textAnchor="middle" fontWeight="bold">74HC08</text>
    <text x="50" y="57" fontSize="4.5" fill="#94a3b8" textAnchor="middle">QUAD AND</text>
    {DIP14_Y_LEFT.map((y,i)=><text key={`ln${i}`} x="19" y={y+1.8} fontSize="3.7" fill="#aab6c2">{i+1}</text>)}
    {DIP14_Y_RIGHT.map((y,i)=><text key={`rn${i}`} x="81" y={y+1.8} fontSize="3.7" fill="#aab6c2" textAnchor="end">{14-i}</text>)}
  </g>,
  IC74HC32: () => <g>
    <defs>
      <linearGradient id="dip14Body32" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#303840"/><stop offset=".5" stopColor="#111820"/><stop offset="1" stopColor="#05090d"/></linearGradient>
      <linearGradient id="dip14Metal32" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f8fafc"/><stop offset=".45" stopColor="#94a3b8"/><stop offset="1" stopColor="#475569"/></linearGradient>
    </defs>
    {DIP14_Y_LEFT.map((y,i)=><path key={`l${i}`} d={`M5 ${y} H17`} stroke="url(#dip14Metal32)" strokeWidth="3.8"/>)}
    {DIP14_Y_RIGHT.map((y,i)=><path key={`r${i}`} d={`M83 ${y} H95`} stroke="url(#dip14Metal32)" strokeWidth="3.8"/>)}
    <rect x="17" y="2" width="66" height="96" rx="5" fill="url(#dip14Body32)" stroke="#64748b" strokeWidth="1.5"/>
    <path d="M42 2 Q50 16 58 2" fill="#dbe4ed" stroke="#64748b" strokeWidth="1"/>
    <circle cx="24" cy="13" r="2.3" fill="#cbd5e1"/>
    <text x="50" y="47" fontSize="10" fill="#f8fafc" textAnchor="middle" fontWeight="bold">74HC32</text>
    <text x="50" y="57" fontSize="4.5" fill="#94a3b8" textAnchor="middle">QUAD OR</text>
    {DIP14_Y_LEFT.map((y,i)=><text key={`ln${i}`} x="19" y={y+1.8} fontSize="3.7" fill="#aab6c2">{i+1}</text>)}
    {DIP14_Y_RIGHT.map((y,i)=><text key={`rn${i}`} x="81" y={y+1.8} fontSize="3.7" fill="#aab6c2" textAnchor="end">{14-i}</text>)}
  </g>,
  LogicGate: ({ value }) => { const label = String(value || 'AND Gate').toUpperCase(); const isNot = label.includes('NOT'); const isOr = label.includes('OR'); return <g><path d={isNot ? 'M28 25 L28 75 L72 50 Z' : isOr ? 'M24 25 Q42 50 24 75 Q60 75 78 50 Q60 25 24 25 Z' : 'M25 25 H45 Q78 25 78 50 Q78 75 45 75 H25 Z'} fill="#e0f2fe" stroke="#0369a1" strokeWidth="3"/><path d="M5 38 H27 M5 62 H27 M78 50 H95" stroke="#334155" strokeWidth="3"/>{isNot && <circle cx="76" cy="50" r="4" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2"/>}</g>; },
  Arduino: () => <g>
    <defs>
      <linearGradient id="unoPcb" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#167d75"/><stop offset=".55" stopColor="#08766d"/><stop offset="1" stopColor="#064e49"/></linearGradient>
      <linearGradient id="unoMetal" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f8fafc"/><stop offset=".5" stopColor="#cbd5e1"/><stop offset="1" stopColor="#64748b"/></linearGradient>
      <linearGradient id="unoSocket" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#0f172a"/><stop offset="1" stopColor="#475569"/></linearGradient>
    </defs>
    <rect x="7" y="9" width="86" height="82" rx="7" fill="url(#unoPcb)" stroke="#064e3b" strokeWidth="2"/>
    <rect x="0" y="36" width="17" height="25" rx="3" fill="url(#unoMetal)" stroke="#64748b" strokeWidth="1.5"/>
    <rect x="3" y="68" width="14" height="16" rx="4" fill="#1f2937" stroke="#94a3b8" strokeWidth="1.5"/>
    <rect x="38" y="39" width="25" height="18" rx="2" fill="#111827" stroke="#94a3b8" strokeWidth="1.4"/>
    {Array.from({length:14},(_,i)=><g key={`cpu${i}`}><path d={`M${39+i*1.72} 41 V39 M${39+i*1.72} 57 V59`} stroke="#cbd5e1" strokeWidth=".7"/></g>)}
    <text x="50" y="50" fontSize="4.3" fill="#e2e8f0" textAnchor="middle">ATMEGA328P</text>
    <rect x="22" y="64" width="12" height="9" rx="2" fill="#111827" stroke="#94a3b8" strokeWidth="1"/>
    <rect x="69" y="63" width="12" height="8" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1"/>
    <rect x="43" y="12" width="17" height="7" rx="2" fill="url(#unoMetal)" stroke="#64748b" strokeWidth=".8"/>
    <circle cx="24" cy="20" r="2.6" fill="#facc15"/><circle cx="80" cy="20" r="2.6" fill="#ef4444"/>
    <rect x="18" y="25" width="9" height="6" rx="1" fill="#334155"/><rect x="31" y="25" width="7" height="6" rx="1" fill="#64748b"/>
    <text x="50" y="84" fontSize="5.2" fill="#d1fae5" textAnchor="middle" fontWeight="bold">ARDUINO UNO R3</text>
    {Array.from({length:16},(_,i)=><g key={`tophead${i}`}><rect x={27+i*4.33} y="8" width="2.1" height="5" rx=".5" fill="url(#unoSocket)" stroke="#cbd5e1" strokeWidth=".45"/></g>)}
    {Array.from({length:13},(_,i)=><g key={`bottomhead${i}`}><rect x={17+i*5.4} y="87" width="2.5" height="5" rx=".5" fill="url(#unoSocket)" stroke="#cbd5e1" strokeWidth=".45"/></g>)}
    <circle cx="11" cy="16" r="1.5" fill="#d1d5db"/><circle cx="89" cy="16" r="1.5" fill="#d1d5db"/><circle cx="11" cy="84" r="1.5" fill="#d1d5db"/><circle cx="89" cy="84" r="1.5" fill="#d1d5db"/>
  </g>,
  ESP32: () => <g>
    <defs><linearGradient id="espPcb" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#334155"/><stop offset=".55" stopColor="#1e293b"/><stop offset="1" stopColor="#0f172a"/></linearGradient><linearGradient id="espShield" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e2e8f0"/><stop offset="1" stopColor="#64748b"/></linearGradient></defs>
    <rect x="10" y="5" width="80" height="90" rx="5" fill="url(#espPcb)" stroke="#64748b" strokeWidth="1.8"/>
    <path d="M34 17 Q50 1 66 17 L62 22 H38 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1"/>
    <rect x="36" y="30" width="28" height="30" rx="2" fill="url(#espShield)" stroke="#f8fafc" strokeWidth="1"/><path d="M39 35 H61 M39 40 H61 M39 45 H61 M39 50 H61" stroke="#64748b" strokeWidth=".8"/>
    <rect x="38" y="66" width="24" height="8" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth=".8"/><text x="50" y="84" fontSize="6.5" fill="#f8fafc" textAnchor="middle" fontWeight="bold">ESP32</text>
    <rect x="43" y="6" width="14" height="5" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth=".7"/>
    {Array.from({length:15},(_,i)=><g key={`espL${i}`}><rect x="5" y={12+i*5.3} width="6" height="2.1" rx=".5" fill="#d1d5db" stroke="#64748b" strokeWidth=".45"/><rect x="89" y={12+i*5.3} width="6" height="2.1" rx=".5" fill="#d1d5db" stroke="#64748b" strokeWidth=".45"/></g>)}
    <circle cx="29" cy="8" r="1.2" fill="#cbd5e1"/><circle cx="71" cy="92" r="1.2" fill="#cbd5e1"/>
  </g>,
  Breadboard: () => <g>
    <defs><linearGradient id="bbTop" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffffff"/><stop offset="1" stopColor="#e5e7eb"/></linearGradient><radialGradient id="bbHole"><stop stopColor="#020617"/><stop offset=".7" stopColor="#334155"/><stop offset="1" stopColor="#94a3b8"/></radialGradient></defs>
    <rect x="2" y="7" width="96" height="88" rx="5" fill="#94a3b8" opacity=".35"/><rect x="2" y="5" width="96" height="88" rx="5" fill="url(#bbTop)" stroke="#94a3b8" strokeWidth="1.5"/>
    <path d="M5 11 H95 M5 16 H95 M5 84 H95 M5 89 H95" stroke="#cbd5e1" strokeWidth=".6"/>
    <path d="M5 11 H95 M5 84 H95" stroke="#dc2626" strokeWidth="1.1"/><path d="M5 16 H95 M5 89 H95" stroke="#2563eb" strokeWidth="1.1"/>
    <rect x="4" y="52" width="92" height="3" rx="1" fill="#cbd5e1" stroke="#9ca3af" strokeWidth=".4"/>
    {Array.from({length:30},(_,i)=>{const x=6+(88*i)/29;return <g key={`rail${i}`}><circle cx={x} cy="11" r="1.05" fill="url(#bbHole)"/><circle cx={x} cy="16" r="1.05" fill="url(#bbHole)"/><circle cx={x} cy="84" r="1.05" fill="url(#bbHole)"/><circle cx={x} cy="89" r="1.05" fill="url(#bbHole)"/></g>;})}
    {Array.from({length:30},(_,col)=>{const x=6+(88*col)/29;return <g key={`col${col}`}>{[27,31.6,36.2,40.8,45.4,58.6,63.2,67.8,72.4,77].map((y,row)=><g key={`hole${row}`}><circle cx={x} cy={y} r="1.15" fill="url(#bbHole)"/><circle cx={x-.25} cy={y-.3} r=".3" fill="#e2e8f0" opacity=".7"/></g>)}</g>;})}
    <text x="50" y="7" fontSize="2.8" fill="#64748b" textAnchor="middle">+  − POWER RAILS</text><text x="50" y="54.5" fontSize="2.5" fill="#94a3b8" textAnchor="middle">CENTRE TRENCH</text>
  </g>,
  Meter: () => <g><rect x="8" y="4" width="84" height="92" rx="9" fill="#334155" stroke="#0f172a" strokeWidth="2.5"/><rect x="18" y="18" width="64" height="36" rx="4" fill="#d1fae5"/><path d="M48 48 L68 27" stroke="#047857" strokeWidth="2.5"/><circle cx="48" cy="48" r="3" fill="#047857"/><circle cx="34" cy="76" r="5" fill="#dc2626"/><circle cx="66" cy="76" r="5" fill="#111827"/><text x="50" y="13" fontSize="7" fill="white" textAnchor="middle">DMM</text></g>,
  DSO: () => <g><rect x="8" y="8" width="84" height="84" rx="7" fill="#111827" stroke="#475569" strokeWidth="3"/><rect x="17" y="18" width="66" height="49" rx="3" fill="#052e2b" stroke="#64748b"/><path d="M19 43 Q26 22 33 43 T47 43 T61 43 T80 43" fill="none" stroke="#34d399" strokeWidth="2"/><circle cx="29" cy="79" r="4" fill="#ef4444"/><circle cx="50" cy="79" r="4" fill="#38bdf8"/><circle cx="71" cy="79" r="4" fill="#d1d5db"/></g>,
  Default: () => <g><rect x="20" y="22" width="60" height="56" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/><circle cx="50" cy="50" r="12" fill="#93c5fd"/></g>,
  IC8051: () => <g>
    <rect x="22" y="4" width="56" height="92" rx="5" fill="#202833" stroke="#64748b" strokeWidth="2"/>
    <path d="M43 4 Q50 15 57 4" fill="#cbd5e1"/>
    {Array.from({length:20},(_,i)=><g key={i}><path d={`M8 ${8+i*(84/19)} H22 M78 ${8+i*(84/19)} H92`} stroke="#cbd5e1" strokeWidth="2.4"/></g>)}
    <text x="50" y="48" fontSize="9" textAnchor="middle" fill="#fff" fontWeight="bold">8051</text>
    <text x="50" y="58" fontSize="5" textAnchor="middle" fill="#cbd5e1">AT89C51 · DIP-40</text>
  </g>,
  LCD16x2: () => <g>
    <rect x="7" y="8" width="86" height="84" rx="7" fill="#64748b" stroke="#334155" strokeWidth="2"/>
    <rect x="17" y="23" width="66" height="48" rx="3" fill="#b7c99a" stroke="#1f2937" strokeWidth="2"/>
    <text x="50" y="43" fontSize="8" textAnchor="middle" fill="#263323">16 × 2 LCD</text>
    <text x="50" y="55" fontSize="5" textAnchor="middle" fill="#263323">HD44780</text>
    {Array.from({length:16},(_,i)=><g key={i}><path d={`M${8+i*(84/15)} 92 V98`} stroke="#cbd5e1" strokeWidth="1.8"/><circle cx={8+i*(84/15)} cy="95" r="1.25" fill="#e2e8f0"/></g>)}
  </g>,
  Crystal: () => <g>
    <path d="M4 50 H28 M72 50 H96" stroke="#aeb7c2" strokeWidth="3"/>
    <rect x="28" y="30" width="44" height="40" rx="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="2"/>
    <rect x="36" y="35" width="28" height="30" rx="4" fill="#94a3b8"/>
    <text x="50" y="54" fontSize="6" textAnchor="middle" fill="#0f172a">11.0592</text>
  </g>
};


export const SchematicIcons = {
  IC74HC04: () => <g>
    <text x="50" y="9" fontSize="7" fill="#0f172a" textAnchor="middle" fontWeight="bold">74HC04 · SIX INVERTERS</text>
    {Array.from({length:6},(_,i)=>{ const x=i%2===0?8:55; const y=17+Math.floor(i/2)*25; return <g key={i}><path d={`M${x+2} ${y+3} L${x+2} ${y+17} L${x+17} ${y+10} Z`} fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.5"/><circle cx={x+20} cy={y+10} r="2.5" fill="#fff" stroke="#0369a1" strokeWidth="1.2"/><path d={`M${x-4} ${y+7} H${x+2} M${x+23} ${y+10} H${x+29}`} stroke="#0f172a" strokeWidth="1.2"/><text x={x+10} y={y+23} fontSize="4.1" fill="#334155" textAnchor="middle">{['1A(1)→1Y(2)','2A(3)→2Y(4)','3A(5)→3Y(6)','4A(9)→4Y(8)','5A(11)→5Y(10)','6A(13)→6Y(12)'][i]}</text></g>;})}
    <text x="50" y="96" fontSize="5" fill="#64748b" textAnchor="middle">VCC pin 14 · GND pin 7</text>
  </g>,
  IC74HC08: () => <g>
    <text x="50" y="9" fontSize="7" fill="#0f172a" textAnchor="middle" fontWeight="bold">74HC08 · FOUR AND GATES</text>
    {Array.from({length:4},(_,i)=>{ const x=i%2===0?5:54; const y=20+Math.floor(i/2)*37; return <g key={i}><path d={`M${x+3} ${y+2} H${x+11} Q${x+25} ${y+2} ${x+25} ${y+13} Q${x+25} ${y+24} ${x+11} ${y+24} H${x+3} Z`} fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.5"/><path d={`M${x-3} ${y+8} H${x+3} M${x-3} ${y+18} H${x+3} M${x+25} ${y+13} H${x+31}`} stroke="#0f172a" strokeWidth="1.2"/><text x={x+14} y={y+32} fontSize="4.1" fill="#334155" textAnchor="middle">{['1,2→3','4,5→6','9,10→8','12,13→11'][i]}</text></g>;})}
    <text x="50" y="96" fontSize="5" fill="#64748b" textAnchor="middle">VCC pin 14 · GND pin 7</text>
  </g>,
  IC74HC32: () => <g>
    <text x="50" y="9" fontSize="7" fill="#0f172a" textAnchor="middle" fontWeight="bold">74HC32 · FOUR OR GATES</text>
    {Array.from({length:4},(_,i)=>{ const x=i%2===0?5:54; const y=20+Math.floor(i/2)*37; return <g key={i}><path d={`M${x+3} ${y+2} Q${x+11} ${y+13} ${x+3} ${y+24} Q${x+23} ${y+24} ${x+25} ${y+13} Q${x+23} ${y+2} ${x+3} ${y+2}`} fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.5"/><path d={`M${x-3} ${y+8} H${x+5} M${x-3} ${y+18} H${x+5} M${x+24} ${y+13} H${x+31}`} stroke="#0f172a" strokeWidth="1.2"/><text x={x+14} y={y+32} fontSize="4.1" fill="#334155" textAnchor="middle">{['1,2→3','4,5→6','9,10→8','12,13→11'][i]}</text></g>;})}
    <text x="50" y="96" fontSize="5" fill="#64748b" textAnchor="middle">VCC pin 14 · GND pin 7</text>
  </g>,
  IC555: () => <g><text x="50" y="10" fontSize="7" fill="#0f172a" textAnchor="middle" fontWeight="bold">NE555 TIMER</text><rect x="28" y="17" width="44" height="66" rx="3" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.5"/><text x="50" y="52" fontSize="11" fill="#075985" textAnchor="middle" fontWeight="bold">555</text>{['GND','TRIG','OUT','RESET'].map((n,i)=><g key={n}><path d={`M10 ${27+i*14} H28`} stroke="#0f172a" strokeWidth="1.2"/><text x="29" y={25+i*14} fontSize="4" fill="#334155">{i+1}</text></g>)}{['VCC','DISCH','THRESH','CTRL'].map((n,i)=><g key={n}><path d={`M72 ${27+i*14} H90`} stroke="#0f172a" strokeWidth="1.2"/><text x="71" y={25+i*14} fontSize="4" fill="#334155" textAnchor="end">{8-i}</text></g>)}</g>,
  Default: () => <g><rect x="15" y="15" width="70" height="70" rx="5" fill="#f1f5f9" stroke="#64748b"/><text x="50" y="52" fontSize="8" textAnchor="middle" fill="#334155">SCHEMATIC</text></g>
};

export const componentPins = {
  '74HC04 Hex Inverter': makeDIP14Pins(['1A','1Y','2A','2Y','3A','3Y','GND','4Y','4A','5Y','5A','6Y','6A','VCC']),
  '74HC08 Quad AND': makeDIP14Pins(['1A','1B','1Y','2A','2B','2Y','GND','3Y','3A','3B','4Y','4A','4B','VCC']),
  '74HC32 Quad OR': makeDIP14Pins(['1A','1B','1Y','2A','2B','2Y','GND','3Y','3A','3B','4Y','4A','4B','VCC']),

  'Resistor': [
    { id:'p1', name:'Terminal 1', x:5,y:50, function:'Passive terminal', electrical:'Bidirectional · no polarity' },
    { id:'p2', name:'Terminal 2', x:95,y:50, function:'Passive terminal', electrical:'Bidirectional · no polarity' }
  ],
  'Capacitor': [
    { id:'top', name:'Positive / Terminal 1', x:42,y:95, function:'Positive lead on polarized radial capacitor', electrical:'Observe polarity where applicable' },
    { id:'bottom', name:'Negative / Terminal 2', x:58,y:95, function:'Negative lead on polarized radial capacitor', electrical:'Non-polar parts have no polarity' }
  ],
  'Inductor': [ {id:'p1',name:'Terminal 1',x:5,y:55,function:'Coil terminal',electrical:'Bidirectional'}, {id:'p2',name:'Terminal 2',x:95,y:55,function:'Coil terminal',electrical:'Bidirectional'} ],
  'Potentiometer': [ {id:'a',name:'End A',x:5,y:50,function:'Resistive track end',electrical:'Outer terminal'}, {id:'b',name:'End B',x:95,y:50,function:'Resistive track end',electrical:'Outer terminal'}, {id:'wiper',name:'Wiper',x:50,y:5,function:'Variable output',electrical:'Adjustable tap'} ],
  'Transformer': [ {id:'p1',name:'Primary 1',x:5,y:30,function:'Primary winding',electrical:'AC input side'}, {id:'p2',name:'Primary 2',x:5,y:70,function:'Primary winding',electrical:'AC input side'}, {id:'s1',name:'Secondary 1',x:95,y:30,function:'Secondary winding',electrical:'Isolated output side'}, {id:'s2',name:'Secondary 2',x:95,y:70,function:'Secondary winding',electrical:'Isolated output side'} ],
  'Diode': [ {id:'anode',name:'Anode (A)',x:5,y:50,function:'Conventional current enters here',electrical:'Forward direction A → K'}, {id:'cathode',name:'Cathode (K)',x:95,y:50,function:'Cathode / band end',electrical:'Reverse direction blocks current'} ],
  'Zener Diode': [ {id:'anode',name:'Anode (A)',x:5,y:50,function:'Anode terminal',electrical:'Forward direction A → K'}, {id:'cathode',name:'Cathode (K)',x:95,y:50,function:'Zener cathode',electrical:'Reverse breakdown reference terminal'} ],
  'LED': [ {id:'anode',name:'Anode (+)',x:42,y:95,function:'Long lead',electrical:'Positive terminal'}, {id:'cathode',name:'Cathode (−)',x:58,y:95,function:'Short lead / flat edge',electrical:'Negative terminal'} ],
  'NPN Transistor': [ {id:'base',name:'Base (B)',x:50,y:95,function:'Base lead · centre pin on common BC547 TO-92 variants',electrical:'Check exact manufacturer pinout'}, {id:'collector',name:'Collector (C)',x:25,y:95,function:'Collector lead · common BC547 TO-92 variant',electrical:'Check exact manufacturer pinout'}, {id:'emitter',name:'Emitter (E)',x:75,y:95,function:'Emitter lead · common BC547 TO-92 variant',electrical:'Check exact manufacturer pinout'} ],
  'PNP Transistor': [ {id:'base',name:'Base (B)',x:50,y:95,function:'Base lead · verify package pinout',electrical:'Check exact manufacturer pinout'}, {id:'collector',name:'Collector (C)',x:25,y:95,function:'Collector lead · verify package pinout',electrical:'Check exact manufacturer pinout'}, {id:'emitter',name:'Emitter (E)',x:75,y:95,function:'Emitter lead · verify package pinout',electrical:'Check exact manufacturer pinout'} ],
  'MOSFET': [ {id:'gate',name:'Gate (G)',x:25,y:95,function:'Gate lead · common IRFZ44N TO-220 front view',electrical:'Verify exact package orientation'}, {id:'drain',name:'Drain (D)',x:50,y:95,function:'Drain lead · common IRFZ44N TO-220 centre pin',electrical:'Tab is electrically connected to drain'}, {id:'source',name:'Source (S)',x:75,y:95,function:'Source lead · common IRFZ44N TO-220 front view',electrical:'Verify exact package orientation'} ],
  '555 Timer': [
    {id:'gnd',name:'Pin 1 · GND',x:5,y:10,function:'Ground reference',electrical:'0 V reference'}, {id:'trig',name:'Pin 2 · TRIG',x:5,y:36.67,function:'Trigger input',electrical:'Starts timing below 1/3 VCC'}, {id:'out',name:'Pin 3 · OUT',x:5,y:63.33,function:'Output',electrical:'Digital output'}, {id:'reset',name:'Pin 4 · RESET',x:5,y:90,function:'Reset input',electrical:'Active-low'}, {id:'vcc',name:'Pin 8 · VCC',x:95,y:10,function:'Positive supply',electrical:'Supply voltage'}, {id:'discharge',name:'Pin 7 · DISCH',x:95,y:36.67,function:'Discharge transistor',electrical:'Timing capacitor discharge'}, {id:'threshold',name:'Pin 6 · THRESH',x:95,y:63.33,function:'Threshold input',electrical:'Ends timing above 2/3 VCC'}, {id:'control',name:'Pin 5 · CTRL',x:95,y:90,function:'Control voltage',electrical:'Threshold reference adjust'}
  ],
  'Op-Amp': [ {id:'in_minus',name:'IN−',x:8,y:38,function:'Inverting input',electrical:'Signal input'}, {id:'in_plus',name:'IN+',x:8,y:62,function:'Non-inverting input',electrical:'Signal input'}, {id:'out',name:'OUT',x:94,y:50,function:'Amplified output',electrical:'Output terminal'}, {id:'vcc',name:'VCC+',x:50,y:8,function:'Positive supply',electrical:'Power rail'}, {id:'vee',name:'VEE−',x:50,y:92,function:'Negative supply',electrical:'Power rail'} ],
  'AND Gate': [ {id:'a',name:'Input A',x:5,y:38,function:'Logic input',electrical:'Digital 0 / 1'}, {id:'b',name:'Input B',x:5,y:62,function:'Logic input',electrical:'Digital 0 / 1'}, {id:'y',name:'Output Y',x:95,y:50,function:'Logic output',electrical:'A AND B'} ],
  'OR Gate': [ {id:'a',name:'Input A',x:5,y:38,function:'Logic input',electrical:'Digital 0 / 1'}, {id:'b',name:'Input B',x:5,y:62,function:'Logic input',electrical:'Digital 0 / 1'}, {id:'y',name:'Output Y',x:95,y:50,function:'Logic output',electrical:'A OR B'} ],
  'NOT Gate': [ {id:'a',name:'Input A',x:5,y:50,function:'Logic input',electrical:'Digital 0 / 1'}, {id:'y',name:'Output Y',x:95,y:50,function:'Inverted output',electrical:'NOT A'} ],
  'Flip-Flop': [ {id:'d',name:'D',x:5,y:35,function:'Data input',electrical:'Digital input'}, {id:'clk',name:'CLK',x:5,y:65,function:'Clock input',electrical:'Edge-triggered'}, {id:'q',name:'Q',x:95,y:35,function:'True output',electrical:'Digital output'}, {id:'qbar',name:'Q̅',x:95,y:65,function:'Complement output',electrical:'Inverted digital output'} ],
  '9V Battery': [ {id:'pos',name:'Positive (+)',x:41,y:18,function:'Positive snap terminal',electrical:'9 V nominal'}, {id:'neg',name:'Negative (−)',x:60,y:18,function:'Negative snap terminal',electrical:'0 V reference relative to +'} ],
  'DC Voltage Source': [ {id:'pos',name:'Positive (+)',x:50,y:5,function:'Positive output',electrical:'DC voltage source'}, {id:'neg',name:'Negative (−)',x:50,y:95,function:'Negative / return',electrical:'DC return'} ],
  'AC Voltage Source': [ {id:'pos',name:'Output 1',x:50,y:5,function:'AC terminal',electrical:'Alternating voltage'}, {id:'neg',name:'Output 2',x:50,y:95,function:'AC return',electrical:'Alternating voltage'} ],
  'Signal Gen': [ {id:'out',name:'Signal OUT',x:90,y:40,function:'Waveform output',electrical:'Sine / square / triangle / pulse'}, {id:'gnd',name:'GND',x:90,y:60,function:'Generator ground',electrical:'Signal reference'} ],
  'Carrier Generator': [ {id:'out',name:'RF OUT',x:90,y:40,function:'Carrier output',electrical:'RF waveform'}, {id:'gnd',name:'GND',x:90,y:60,function:'Generator ground',electrical:'Signal reference'} ],
  'Ground': [ {id:'gnd',name:'GND',x:50,y:5,function:'Ground reference',electrical:'0 V node'} ],
  'DSO': [ {id:'ch1',name:'CH1 probe',x:29,y:79,function:'Channel 1 input',electrical:'Measures node voltage'}, {id:'ch2',name:'CH2 probe',x:50,y:79,function:'Channel 2 input',electrical:'Measures node voltage'}, {id:'gnd',name:'Ground reference',x:71,y:79,function:'Scope reference',electrical:'Measurement reference'} ],
  'CRO': [ {id:'ch1',name:'Y / CH1 input',x:29,y:79,function:'Vertical input',electrical:'Measures input voltage'}, {id:'ch2',name:'X / CH2 input',x:50,y:79,function:'Second channel',electrical:'Second measured voltage'}, {id:'gnd',name:'GND',x:71,y:79,function:'Ground reference',electrical:'Measurement reference'} ],
  'Multimeter': [ {id:'v_ohm',name:'VΩ terminal',x:38,y:70,function:'Voltage / resistance input',electrical:'Red probe'}, {id:'com',name:'COM terminal',x:62,y:70,function:'Common reference',electrical:'Black probe'} ],
  'Voltmeter': [ {id:'pos',name:'V (+)',x:38,y:70,function:'Positive voltage input',electrical:'Connect in parallel'}, {id:'neg',name:'COM (−)',x:62,y:70,function:'Common input',electrical:'Reference terminal'} ],
  'Ammeter': [ {id:'in',name:'A (+)',x:38,y:70,function:'Current input',electrical:'Connect in series'}, {id:'out',name:'COM (−)',x:62,y:70,function:'Current return',electrical:'Reference terminal'} ],
  'Arduino Uno R3': [
    ...Array.from({length:14},(_,i)=>({id:`d${i}`,name:`D${i}${[3,5,6,9,10,11].includes(i)?' · PWM':''}`,x:30+(i*4.05),y:10,function:'Digital input/output',electrical:'ATmega328P digital I/O · 5 V logic'})),
    {id:'aref',name:'AREF',x:88,y:10,function:'Analog reference',electrical:'External ADC reference'},
    {id:'topgnd',name:'GND (digital header)',x:92,y:10,function:'Ground',electrical:'0 V reference'},
    {id:'ioref',name:'IOREF',x:16,y:90,function:'I/O reference',electrical:'Board logic reference'},
    {id:'reset',name:'RESET',x:21,y:90,function:'Reset',electrical:'Active-low reset'},
    {id:'3v3',name:'3.3V',x:26,y:90,function:'3.3 V supply',electrical:'Low-current regulated output'},
    {id:'5v',name:'5V',x:31,y:90,function:'5 V supply',electrical:'Regulated supply output'},
    {id:'gnd',name:'GND',x:36,y:90,function:'Ground',electrical:'0 V reference'},
    {id:'gnd2',name:'GND 2',x:41,y:90,function:'Ground',electrical:'0 V reference'},
    {id:'vin',name:'VIN',x:46,y:90,function:'External input supply',electrical:'Board input power'},
    ...Array.from({length:6},(_,i)=>({id:`a${i}`,name:`A${i}${i===4?' / SDA':i===5?' / SCL':''}`,x:59+(i*4.1),y:90,function:'Analog input',electrical:'10-bit ADC · 0–5 V range (board reference)'}))
  ],
  'ESP32 DevKit': [
    ...[
      ['3v3','3V3','Power output','3.3 V supply'],['en','EN','Enable / reset','Active high'],['gpio36','GPIO36 / VP','Analog input','Input only · ADC1'],['gpio39','GPIO39 / VN','Analog input','Input only · ADC1'],['gpio34','GPIO34','GPIO / ADC','Input only'],['gpio35','GPIO35','GPIO / ADC','Input only'],['gpio32','GPIO32','GPIO / ADC / touch','Digital I/O'],['gpio33','GPIO33','GPIO / ADC / touch','Digital I/O'],['gpio25','GPIO25 / DAC1','GPIO / DAC','Digital I/O'],['gpio26','GPIO26 / DAC2','GPIO / DAC','Digital I/O'],['gpio27','GPIO27','GPIO / touch','Digital I/O'],['gpio14','GPIO14','GPIO / SPI clock','Digital I/O'],['gpio12','GPIO12','GPIO / strapping','Check boot-strap use'],['gndL','GND','Ground','0 V reference'],['gpio13','GPIO13','GPIO / SPI MOSI','Digital I/O']
    ].map(([id,name,fn,electrical],i)=>({id,name,x:10,y:12+i*5.3,function:fn,electrical})),
    ...[
      ['vin','VIN / 5V','Supply input','5 V input'],['gnd','GND','Ground','0 V reference'],['gpio23','GPIO23','Digital I/O','3.3 V logic'],['gpio22','GPIO22 / SCL','I²C / digital I/O','3.3 V logic'],['tx0','TX0 / GPIO1','UART transmit','3.3 V logic'],['rx0','RX0 / GPIO3','UART receive','3.3 V logic'],['gpio21','GPIO21 / SDA','I²C / digital I/O','3.3 V logic'],['gpio19','GPIO19 / MISO','SPI / digital I/O','3.3 V logic'],['gpio18','GPIO18 / SCK','SPI / digital I/O','3.3 V logic'],['gpio5','GPIO5 / SS','SPI / digital I/O','3.3 V logic'],['gpio17','GPIO17 / TX2','UART / digital I/O','3.3 V logic'],['gpio16','GPIO16 / RX2','UART / digital I/O','3.3 V logic'],['gpio4','GPIO4','Digital I/O','3.3 V logic'],['gpio0','GPIO0','Boot strapping pin','Check boot-strap use'],['gpio2','GPIO2','Boot strapping pin','Check boot-strap use']
    ].map(([id,name,fn,electrical],i)=>({id,name,x:90,y:12+i*5.3,function:fn,electrical}))
  ],
  '8051 AT89C51 DIP-40': [
    // AT89C51 DIP-40: left side pins 1-20 top-to-bottom;
    // right side pins 40-21 top-to-bottom. Coordinates match PhysicalIcons.IC8051.
    ...Array.from({length:8},(_,i)=>({id:`p1_${i}`,name:`P1.${i} · Pin ${1+i}`,x:8,y:8+i*(84/19),function:`P1.${i}`,electrical:'Port 1 digital I/O'})),
    {id:'rst',name:'RST · Pin 9',x:8,y:8+8*(84/19),function:'RST',electrical:'Active-high reset'},
    ...Array.from({length:8},(_,i)=>({id:`p3_${i}`,name:`P3.${i} · Pin ${10+i}`,x:8,y:8+(9+i)*(84/19),function:`P3.${i}`,electrical:'Port 3 alternate-function digital I/O'})),
    {id:'xtal2',name:'XTAL2 · Pin 18',x:8,y:8+17*(84/19),function:'XTAL2',electrical:'Crystal output'},
    {id:'xtal1',name:'XTAL1 · Pin 19',x:8,y:8+18*(84/19),function:'XTAL1',electrical:'Crystal input'},
    {id:'gnd',name:'GND · Pin 20',x:8,y:92,function:'GND',electrical:'0 V ground'},
    {id:'vcc',name:'VCC · Pin 40',x:92,y:8,function:'VCC',electrical:'+5 V supply'},
    ...Array.from({length:8},(_,i)=>({id:`p0_${7-i}`,name:`P0.${7-i} · Pin ${39-i}`,x:92,y:8+(i+1)*(84/19),function:`P0.${7-i}`,electrical:'Port 0 open-drain digital I/O; external pull-ups required'})),
    {id:'ea',name:'EA/VPP · Pin 31',x:92,y:8+9*(84/19),function:'EA/VPP',electrical:'External access select'},
    {id:'ale',name:'ALE/PROG · Pin 30',x:92,y:8+10*(84/19),function:'ALE/PROG',electrical:'Address latch enable'},
    {id:'psen',name:'PSEN · Pin 29',x:92,y:8+11*(84/19),function:'PSEN',electrical:'Program store enable'},
    ...Array.from({length:8},(_,i)=>({id:`p2_${i}`,name:`P2.${i} · Pin ${21+i}`,x:92,y:8+(19-i)*(84/19),function:`P2.${i}`,electrical:'Port 2 digital I/O'}))
  ],
  'LCD 16x2 (HD44780)': [
    // Standard 16-pin HD44780 header, aligned to the 16 pads drawn on the package.
    ...[
      ['vss','VSS · Pin 1','VSS','Ground'],
      ['vdd','VDD · Pin 2','VDD','+5 V supply'],
      ['vo','VO · Pin 3','VO','Contrast input'],
      ['rs','RS · Pin 4','RS','Register select'],
      ['rw','R/W · Pin 5','R/W','Read/write select'],
      ['e','E · Pin 6','E','Enable'],
      ['d0','D0 · Pin 7','D0','LCD data bus'],
      ['d1','D1 · Pin 8','D1','LCD data bus'],
      ['d2','D2 · Pin 9','D2','LCD data bus'],
      ['d3','D3 · Pin 10','D3','LCD data bus'],
      ['d4','D4 · Pin 11','D4','LCD data bus'],
      ['d5','D5 · Pin 12','D5','LCD data bus'],
      ['d6','D6 · Pin 13','D6','LCD data bus'],
      ['d7','D7 · Pin 14','D7','LCD data bus'],
      ['a','A · Pin 15','A','LED backlight anode'],
      ['k','K · Pin 16','K','LED backlight cathode']
    ].map(([id,name,fn,electrical],i)=>({id,name,x:8+i*(84/15),y:95,function:fn,electrical}))
  ],
  'Crystal Oscillator 11.0592 MHz': [
    {id:'lead1',name:'Crystal lead 1',x:5,y:50,function:'Crystal terminal',electrical:'Connect to XTAL1 or XTAL2'},
    {id:'lead2',name:'Crystal lead 2',x:95,y:50,function:'Crystal terminal',electrical:'Connect to XTAL2 or XTAL1'}
  ],
  '22 pF Capacitor': [
    {id:'left',name:'Terminal 1',x:5,y:50,function:'Crystal load capacitor',electrical:'Connect to ground through XTAL node'},
    {id:'right',name:'Terminal 2',x:95,y:50,function:'Ground terminal',electrical:'Connect to common ground'}
  ],
  '10 µF Reset Capacitor': [
    {id:'positive',name:'Positive (+)',x:5,y:50,function:'Reset capacitor positive',electrical:'Connect to +5 V reset node'},
    {id:'negative',name:'Negative (−)',x:95,y:50,function:'Reset capacitor negative',electrical:'Connect to ground'}
  ],
  '10 kΩ Reset Resistor': [
    {id:'left',name:'Terminal 1',x:5,y:50,function:'Reset pull resistor',electrical:'Connect to reset node'},
    {id:'right',name:'Terminal 2',x:95,y:50,function:'Ground / supply side',electrical:'Connect as shown in reset circuit'}
  ],
  'Breadboard': makeBreadboardPins()
};
