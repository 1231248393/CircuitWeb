import React from 'react';

export const AdvancedSymbol = ({ type, isSimulating, value, unit }) => {
  const ShadowDefs = () => (
    <defs>
      <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
      </filter>
      <linearGradient id="screenGlare" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="rgba(255,255,255,0.4)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" /></linearGradient>
    </defs>
  );

  switch (type) {
    case 'arduino':
      return (
        <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="none">
          <ShadowDefs />
          <path d="M 10 10 L 260 10 L 290 40 L 290 190 L 10 190 Z" fill="#00878F" stroke="#003e43" strokeWidth="2" filter="url(#dropShadow)" />
          <rect x="2" y="55" width="45" height="40" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" filter="url(#dropShadow)" />
          <rect x="120" y="115" width="100" height="45" rx="2" fill="#111" filter="url(#dropShadow)" />
          {[55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215].map((x, i) => <rect key={`t-${i}`} x={x} y="4" width="6" height="16" fill="#fbbf24" />)}
          <text x="160" y="85" fontSize="24" fill="#fff" textAnchor="middle" fontWeight="bold">UNO</text>
          <text x="160" y="100" fontSize="10" fill="#fff" textAnchor="middle" opacity="0.8">ARDUINO</text>
        </svg>
      );

    case 'seven_segment':
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 90">
          <ShadowDefs />
          <rect x="20" y="10" width="100" height="70" rx="4" fill="#222" stroke="#111" strokeWidth="2" filter="url(#dropShadow)" />
          <rect x="25" y="15" width="90" height="60" rx="2" fill="#111" />
          <g opacity={isSimulating ? "1" : "0.1"} stroke="#ff3333" strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M 50 25 L 90 25" /><path d="M 95 30 L 95 40" /><path d="M 95 50 L 95 60" /><path d="M 50 65 L 90 65" /><path d="M 45 50 L 45 60" /><path d="M 45 30 L 45 40" /><path d="M 50 45 L 90 45" />
          </g>
          <circle cx="105" cy="65" r="3" fill={isSimulating ? "#ff3333" : "#333"} />
          {[35, 50, 65, 80, 95].map(x => <circle key={`t-${x}`} cx={x} cy="20" r="2" fill="#94a3b8" />)}
          {[35, 50, 65, 80, 95].map(x => <circle key={`b-${x}`} cx={x} cy="70" r="2" fill="#94a3b8" />)}
          <rect x="25" y="15" width="90" height="20" fill="url(#screenGlare)" pointerEvents="none" />
        </svg>
      );

    case 'ac_source':
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 90">
          <ShadowDefs />
          <circle cx="70" cy="45" r="30" fill="#fff" stroke="#333" strokeWidth="3" filter="url(#dropShadow)"/>
          <path d="M 45 45 Q 57.5 20 70 45 T 95 45" fill="none" stroke="#333" strokeWidth="3"/>
          <text x="70" y="85" fontSize="10" fill="#333" textAnchor="middle">{value} {unit}</text>
        </svg>
      );

    case 'usb_cable':
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 90">
          <ShadowDefs />
          <path d="M 20 45 L 80 45" stroke="#333" strokeWidth="8" strokeLinecap="round" />
          <rect x="80" y="30" width="30" height="30" rx="4" fill="#2a2a2a" stroke="#111" filter="url(#dropShadow)" />
          <rect x="110" y="35" width="20" height="20" fill="#e2e8f0" />
        </svg>
      );

    case 'signal_gen': case 'carrier_gen':
      const isCarrier = type === 'carrier_gen';
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><defs><linearGradient id="genBody" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={isCarrier ? "#a78bfa" : "#bae6fd"} /><stop offset="100%" stopColor={isCarrier ? "#6d28d9" : "#0284c7"} /></linearGradient></defs><rect x="15" y="15" width="110" height="60" rx="6" fill="url(#genBody)" stroke="#333" strokeWidth="2" filter="url(#dropShadow)" />{isCarrier ? <path d="M 30 60 L 40 40 L 50 60 L 60 40 L 70 60 L 80 40 L 90 60 L 100 40" fill="none" stroke="#fff" strokeWidth="3" /> : <path d="M 30 60 Q 45 40 60 60 T 95 60" fill="none" stroke="#fff" strokeWidth="3" />}<text x="70" y="32" fontSize="11" fill="#fff" textAnchor="middle" fontWeight="bold">{isCarrier ? 'CARRIER GEN' : 'SIGNAL GEN'}</text><rect x="15" y="15" width="110" height="20" fill="url(#screenGlare)" pointerEvents="none" /></svg>;
      
    case 'oscilloscope': case 'cro':
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><defs><linearGradient id="croBody" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#334155" /><stop offset="100%" stopColor="#0f172a" /></linearGradient></defs><rect x="5" y="5" width="130" height="80" rx="6" fill="url(#croBody)" stroke="#1e293b" strokeWidth="2" filter="url(#dropShadow)" /><rect x="15" y="15" width="80" height="60" rx="3" fill="#052e16" stroke="#166534" strokeWidth="2" /><path d="M 25 50 Q 40 20 60 50 T 85 50" fill="none" stroke={isSimulating ? "#22c55e" : "#166534"} strokeWidth="3" /><circle cx="115" cy="25" r="5" fill="#ef4444" /><circle cx="115" cy="45" r="5" fill="#22c55e" /><circle cx="115" cy="65" r="5" fill="#3b82f6" /></svg>;

    case 'voltmeter': case 'ammeter':
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><rect x="20" y="15" width="100" height="50" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="2" filter="url(#dropShadow)" /><rect x="30" y="25" width="60" height="30" rx="2" fill="#000" /><text x="105" y="45" fontSize="16" fill="#cbd5e1" textAnchor="middle" fontWeight="bold">{type === 'voltmeter' ? 'V' : 'A'}</text></svg>;
      
    case 'adc': case 'dac':
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><rect x="15" y="15" width="110" height="60" rx="6" fill={type === 'adc' ? "#fef3c7" : "#dcfce7"} stroke={type === 'adc' ? "#d97706" : "#10b981"} strokeWidth="2" filter="url(#dropShadow)" /><text x="70" y="50" fontSize="20" fill={type === 'adc' ? "#d97706" : "#10b981"} textAnchor="middle" fontWeight="bold">{type.toUpperCase()}</text></svg>;

    default: 
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 90">
          <rect x="10" y="10" width="120" height="70" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
          <text x="70" y="45" fontSize="12" fill="#ef4444" textAnchor="middle" fontWeight="bold">MISSING</text>
          <text x="70" y="60" fontSize="10" fill="#ef4444" textAnchor="middle">{type}</text>
        </svg>
      );
  }
};
