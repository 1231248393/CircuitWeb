import React from 'react';

const colorMap = { 0: '#000000', 1: '#8B4513', 2: '#FF0000', 3: '#FFA500', 4: '#FFFF00', 5: '#00FF00', 6: '#0000FF', 7: '#EE82EE', 8: '#808080', 9: '#FFFFFF' };
const getResistorColors = (valStr, unit) => {
  let val = parseFloat(valStr) || 1;
  if (unit === 'kΩ') val *= 1000;
  if (unit === 'MΩ') val *= 1000000;
  let str = val.toString();
  if (str.includes('e')) { val = Number(val.toFixed(7)); str = val.toString(); }
  let digits = str.replace('.', '').replace(/^0+/, '') || '1'; 
  let d1 = parseInt(digits[0]) || 0, d2 = parseInt(digits[1]) || 0, m = digits.length - 2;
  if (val < 1) { d1 = Math.floor(val * 10); d2 = 0; m = -1; }
  m = Math.min(Math.max(m, -2), 9); 
  return { b1: colorMap[d1] || '#000', b2: colorMap[d2] || '#000', b3: m === -1 ? '#D4AF37' : m === -2 ? '#C0C0C0' : (colorMap[m] || '#000'), b4: '#D4AF37' };
};

export const BasicSymbol = ({ type, value, unit, isClosed, isSimulating }) => {
  const ShadowDefs = () => (
    <defs>
      <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3" /></filter>
      <linearGradient id="plastic" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#e2e8f0" /></linearGradient>
    </defs>
  );

  switch (type) {
    case 'resistor': 
      const c = getResistorColors(value, unit);
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 90">
          <ShadowDefs />
          <line x1="20" y1="45" x2="35" y2="45" stroke="#9ca3af" strokeWidth="5" />
          <line x1="105" y1="45" x2="120" y2="45" stroke="#9ca3af" strokeWidth="5" />
          <rect x="35" y="25" width="70" height="40" rx="10" fill="#d4b896" stroke="#785a30" strokeWidth="1.5" filter="url(#dropShadow)" />
          <rect x="45" y="25" width="8" height="40" fill={c.b1} />
          <rect x="58" y="25" width="8" height="40" fill={c.b2} />
          <rect x="71" y="25" width="8" height="40" fill={c.b3} />
          <rect x="90" y="25" width="8" height="40" fill={c.b4} />
          <ellipse cx="70" cy="28" rx="30" ry="5" fill="rgba(255,255,255,0.3)" />
        </svg>
      );
    case 'voltage': 
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><rect x="30" y="20" width="80" height="60" rx="4" fill="#222" filter="url(#dropShadow)" /><rect x="30" y="20" width="35" height="60" rx="4" fill="#f59e0b" /><text x="85" y="58" fontSize="24" fill="#fff" textAnchor="middle" fontWeight="bold" transform="rotate(90 85 58)">{value || 9}V</text><rect x="40" y="10" width="12" height="10" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" /><rect x="85" y="10" width="12" height="10" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" /></svg>;
    case 'capacitor': 
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><line x1="20" y1="45" x2="40" y2="45" stroke="#9ca3af" strokeWidth="4" /><line x1="100" y1="45" x2="120" y2="45" stroke="#9ca3af" strokeWidth="4" /><rect x="40" y="15" width="8" height="60" fill="#475569" rx="2" filter="url(#dropShadow)" /><rect x="92" y="15" width="8" height="60" fill="#475569" rx="2" filter="url(#dropShadow)" /><text x="70" y="50" fontSize="12" fill="#333" textAnchor="middle" fontWeight="bold">{value}{unit}</text></svg>;
    case 'inductor': 
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><line x1="20" y1="45" x2="40" y2="45" stroke="#9ca3af" strokeWidth="5" /><line x1="100" y1="45" x2="120" y2="45" stroke="#9ca3af" strokeWidth="5" /><path d="M 40 45 Q 47.5 20 55 45 Q 62.5 20 70 45 Q 77.5 20 85 45 Q 92.5 20 100 45" fill="none" stroke="#b45309" strokeWidth="6" strokeLinecap="round" filter="url(#dropShadow)" /><text x="70" y="75" fontSize="12" fill="#333" textAnchor="middle" fontWeight="bold">{value}{unit}</text></svg>;
    case 'ground': 
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><line x1="70" y1="15" x2="70" y2="35" stroke="#334155" strokeWidth="4" /><line x1="40" y1="35" x2="100" y2="35" stroke="#334155" strokeWidth="6" strokeLinecap="round" /><line x1="50" y1="50" x2="90" y2="50" stroke="#334155" strokeWidth="5" strokeLinecap="round" /><line x1="60" y1="65" x2="80" y2="65" stroke="#334155" strokeWidth="4" strokeLinecap="round" /></svg>;
    case 'switch': 
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><line x1="20" y1="45" x2="40" y2="45" stroke="#9ca3af" strokeWidth="4" /><line x1="100" y1="45" x2="120" y2="45" stroke="#9ca3af" strokeWidth="4" /><rect x="35" y="25" width="70" height="40" rx="6" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" filter="url(#dropShadow)" /><rect x="38" y="28" width="64" height="34" rx="4" fill="#f3f4f6" /><rect x={isClosed ? "70" : "45"} y="30" width="18" height="30" rx="3" fill={isClosed ? "#1e293b" : "#ef4444"} style={{ transition: 'all 0.2s ease' }} /></svg>;
    case 'led': 
      const isOn = isSimulating; 
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><defs><radialGradient id="ledGlow" cx="50%" cy="40%" r="50%"><stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.9" /><stop offset="60%" stopColor="#ff0000" stopOpacity="0.5" /><stop offset="100%" stopColor="#cc0000" stopOpacity="0" /></radialGradient><linearGradient id="ledDome" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={isOn ? "#ff9999" : "#991b1b"} /><stop offset="100%" stopColor={isOn ? "#cc0000" : "#450a0a"} /></linearGradient></defs>{isOn && <circle cx="70" cy="45" r="50" fill="url(#ledGlow)" />}<rect x="53" y="50" width="5" height="35" fill="#64748b" /><rect x="83" y="50" width="5" height="35" fill="#64748b" /><path d="M 40 55 L 40 40 A 30 30 0 0 1 100 40 L 100 55 Z" fill="url(#ledDome)" stroke="#222" strokeWidth="2" filter="url(#dropShadow)" /><rect x="35" y="55" width="70" height="8" rx="4" fill="#333" /></svg>;
    case 'breadboard':
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><rect x="5" y="10" width="130" height="70" rx="4" fill="url(#plastic)" stroke="#cbd5e1" strokeWidth="2" filter="url(#dropShadow)" /><line x1="5" y1="20" x2="135" y2="20" stroke="#ef4444" strokeWidth="2" /><line x1="5" y1="70" x2="135" y2="70" stroke="#3b82f6" strokeWidth="2" /><rect x="15" y="42" width="110" height="6" fill="#e2e8f0" stroke="#cbd5e1" />{Array.from({ length: 13 }).map((_, i) => (<g key={`holes-${i}`}><circle cx={15 + i * 9} cy="30" r="2" fill="#94a3b8" /><circle cx={15 + i * 9} cy="38" r="2" fill="#94a3b8" /><circle cx={15 + i * 9} cy="52" r="2" fill="#94a3b8" /><circle cx={15 + i * 9} cy="60" r="2" fill="#94a3b8" /></g>))}</svg>;
    default: return <svg width="100%" height="100%" viewBox="0 0 140 90"><rect x="10" y="10" width="120" height="70" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" /><text x="70" y="50" fontSize="12" fill="#ef4444" textAnchor="middle">{type} missing</text></svg>;
  }
};
