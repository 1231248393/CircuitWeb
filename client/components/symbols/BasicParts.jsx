import React from 'react';

export const BasicSymbol = ({ type, value, isClosed, isSimulating }) => {
  const svgProps = { width: "100%", height: "100%", viewBox: "0 0 140 90" };
  const pinColor = "#9ca3af"; 
  const pinStroke = 4;
  const cy = 45; 

  // Universal Drop Shadow Filter for 3D Effect
  const ShadowFilter = () => (
    <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="3" dy="5" stdDeviation="3" floodOpacity="0.4" />
    </filter>
  );

  // Resistor Color Codes
  const getResistorBands = (val) => {
    const num = parseFloat(val) || 10;
    const d1 = Math.min(Math.floor(num / 10), 9);
    const d2 = Math.min(Math.floor(num % 10), 9);
    const colors = { 0: '#000', 1: '#8B4513', 2: '#FF0000', 3: '#FFA500', 4: '#FFFF00', 5: '#00FF00', 6: '#0000FF', 7: '#800080', 8: '#808080', 9: '#FFF' };
    return [colors[d1], colors[d2], '#FF0000', '#D4AF37'];
  };

  switch (type) {
    // ==========================================
    // 1. PASSIVE COMPONENTS
    // ==========================================
    case 'resistor':
      const bands = getResistorBands(value);
      return (
        <svg {...svgProps}>
          <defs>
            <ShadowFilter />
            <linearGradient id="res3D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7"/><stop offset="30%" stopColor="#e5cfa6"/><stop offset="70%" stopColor="#c9aa75"/><stop offset="100%" stopColor="#8b6b3d"/>
            </linearGradient>
          </defs>
          <line x1="20" y1={cy} x2="40" y2={cy} stroke={pinColor} strokeWidth={pinStroke} strokeLinecap="round" />
          <line x1="100" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} strokeLinecap="round" />
          <rect x="40" y="28" width="60" height="34" rx="10" fill="url(#res3D)" stroke="#5c4021" strokeWidth="1.5" filter="url(#drop-shadow)" />
          <rect x="50" y="28" width="7" height="34" fill={bands[0]} />
          <rect x="62" y="28" width="7" height="34" fill={bands[1]} />
          <rect x="74" y="28" width="7" height="34" fill={bands[2]} />
          <rect x="88" y="28" width="7" height="34" fill={bands[3]} />
          <text x="70" y="80" fontSize="11" fill="#333" textAnchor="middle" fontWeight="bold">{value || '10'}Ω</text>
        </svg>
      );

    case 'capacitor':
      return (
        <svg {...svgProps}>
          <defs>
            <ShadowFilter />
            <linearGradient id="cap3D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6"/><stop offset="20%" stopColor="#1d4ed8"/><stop offset="80%" stopColor="#1e3a8a"/><stop offset="100%" stopColor="#0f172a"/>
            </linearGradient>
          </defs>
          <line x1="20" y1={cy} x2="50" y2={cy} stroke={pinColor} strokeWidth={pinStroke} strokeLinecap="round" />
          <line x1="90" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} strokeLinecap="round" />
          <rect x="50" y="25" width="40" height="40" rx="12" fill="url(#cap3D)" stroke="#000" strokeWidth="1.5" filter="url(#drop-shadow)" />
          <rect x="50" y="25" width="12" height="40" rx="6" fill="#cbd5e1" opacity="0.8" />
          <text x="70" y="80" fontSize="11" fill="#333" textAnchor="middle" fontWeight="bold">{value || '10'}µF</text>
        </svg>
      );

    case 'inductor':
      return (
        <svg {...svgProps}>
          <defs><ShadowFilter /></defs>
          <line x1="20" y1={cy} x2="35" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="105" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <path d="M 35 45 Q 45 15 55 45 Q 65 15 75 45 Q 85 15 95 45 Q 105 15 115 45" fill="none" stroke="#b45309" strokeWidth="8" strokeLinecap="round" filter="url(#drop-shadow)" />
          <path d="M 35 45 Q 45 15 55 45 Q 65 15 75 45 Q 85 15 95 45 Q 105 15 115 45" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <text x="70" y="80" fontSize="11" fill="#333" textAnchor="middle" fontWeight="bold">{value || '10'}mH</text>
        </svg>
      );

    // ==========================================
    // 2. POWER SOURCES
    // ==========================================
    case 'voltage':
    case 'coin_cell':
      return (
        <svg {...svgProps}>
          <defs>
            <ShadowFilter />
            <linearGradient id="battBody3D" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#333"/><stop offset="20%" stopColor="#111"/><stop offset="80%" stopColor="#111"/><stop offset="100%" stopColor="#333"/></linearGradient>
            <linearGradient id="battTop3D" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="50%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#b45309"/></linearGradient>
          </defs>
          <line x1="20" y1={cy} x2="35" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="105" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <rect x="35" y="15" width="70" height="60" rx="3" fill="url(#battBody3D)" stroke="#000" strokeWidth="2" filter="url(#drop-shadow)" />
          <rect x="35" y="15" width="70" height="20" rx="3" fill="url(#battTop3D)" />
          <rect x="45" y="5" width="15" height="10" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <rect x="80" y="5" width="15" height="10" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <text x="70" y="60" fontSize="24" fill="#fff" textAnchor="middle" fontWeight="bold">{value || '9'}V</text>
        </svg>
      );

    case 'ac_source':
    case 'signal_gen':
    case 'carrier_gen':
      const isSignal = type === 'signal_gen' || type === 'carrier_gen';
      return (
        <svg {...svgProps}>
          <defs>
            <ShadowFilter />
            <linearGradient id="genBody" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={isSignal ? '#3b82f6' : '#6366f1'}/><stop offset="100%" stopColor={isSignal ? '#1e3a8a' : '#312e81'}/></linearGradient>
          </defs>
          <line x1="20" y1={cy} x2="35" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="105" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <rect x="35" y="20" width="70" height="50" rx="5" fill="url(#genBody)" stroke="#1e3a8a" strokeWidth="2" filter="url(#drop-shadow)" />
          <path d="M 45 45 Q 55 25 65 45 T 85 45 T 95 45" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <text x="70" y="62" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">{type.replace('_', ' ').toUpperCase()}</text>
        </svg>
      );

    case 'solar_cell':
      return (
        <svg {...svgProps}>
          <defs><ShadowFilter /></defs>
          <line x1="20" y1={cy} x2="35" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="105" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <rect x="35" y="20" width="70" height="50" rx="3" fill="#1e3a8a" stroke="#0f172a" strokeWidth="3" filter="url(#drop-shadow)" />
          <line x1="50" y1="20" x2="50" y2="70" stroke="#60a5fa" strokeWidth="2" />
          <line x1="70" y1="20" x2="70" y2="70" stroke="#60a5fa" strokeWidth="2" />
          <line x1="90" y1="20" x2="90" y2="70" stroke="#60a5fa" strokeWidth="2" />
          <line x1="35" y1="45" x2="105" y2="45" stroke="#60a5fa" strokeWidth="2" />
        </svg>
      );

    case 'ground':
      return (
        <svg {...svgProps}>
          <line x1="20" y1={cy} x2="70" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="40" y1="50" x2="100" y2="50" stroke="#333" strokeWidth="5" strokeLinecap="round" />
          <line x1="50" y1="60" x2="90" y2="60" stroke="#333" strokeWidth="5" strokeLinecap="round" />
          <line x1="60" y1="70" x2="80" y2="70" stroke="#333" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    // ==========================================
    // 3. SEMICONDUCTORS & ICS
    // ==========================================
    case 'diode':
    case 'varactor':
      const isVar = type === 'varactor';
      return (
        <svg {...svgProps}>
          <defs><ShadowFilter /></defs>
          <line x1="20" y1={cy} x2="45" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="95" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <rect x="45" y="30" width="50" height="30" rx="5" fill="#111" stroke="#000" strokeWidth="2" filter="url(#drop-shadow)" />
          <rect x="75" y="30" width="10" height="30" fill="#cbd5e1" />
          {isVar && <line x1="90" y1="30" x2="90" y2="60" stroke="#cbd5e1" strokeWidth="2" />}
        </svg>
      );

    case 'led':
    case 'rgb_led':
      const isRgb = type === 'rgb_led';
      const isOn = isSimulating;
      const color = isRgb ? '#a855f7' : (value === 'Green' ? '#22c55e' : value === 'Blue' ? '#3b82f6' : '#ef4444');
      return (
        <svg {...svgProps}>
          <defs>
            <ShadowFilter />
            <radialGradient id="ledGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={color} stopOpacity="0.8" /><stop offset="100%" stopColor={color} stopOpacity="0" /></radialGradient>
            <linearGradient id="ledDome" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={isOn ? color : (isRgb ? '#e2e8f0' : '#7f1d1d')} stopOpacity="0.9"/><stop offset="100%" stopColor={isOn ? color : (isRgb ? '#94a3b8' : '#450a0a')} stopOpacity="0.6"/></linearGradient>
          </defs>
          <line x1="20" y1={cy} x2="40" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="100" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          {isOn && <circle cx="70" cy={cy} r="45" fill="url(#ledGlow)" />}
          <path d="M 45 55 L 95 55 L 95 40 A 25 25 0 0 0 45 40 Z" fill="url(#ledDome)" stroke="#333" strokeWidth="1.5" filter="url(#drop-shadow)" />
          <rect x="40" y="55" width="60" height="8" rx="2" fill="#333" />
          {isRgb && <rect x="68" y="55" width="4" height="8" fill="#666" />}
        </svg>
      );

    case 'npn_transistor':
    case 'jfet':
      return (
        <svg {...svgProps}>
          <defs>
            <ShadowFilter />
            <linearGradient id="transBody" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#444"/><stop offset="100%" stopColor="#111"/></linearGradient>
          </defs>
          <line x1="20" y1={cy} x2="55" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="70" y1="25" x2="70" y2="5" stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="80" y1="65" x2="80" y2="85" stroke={pinColor} strokeWidth={pinStroke} />
          <path d="M 50 60 A 25 25 0 0 1 100 60 L 100 75 L 50 75 Z" fill="url(#transBody)" stroke="#000" strokeWidth="1.5" filter="url(#drop-shadow)" />
          <text x="75" y="58" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="bold">{type === 'jfet' ? 'JFET' : 'NPN'}</text>
        </svg>
      );

    case 'opamp':
    case 'adc':
    case 'dac':
      return (
        <svg {...svgProps}>
          <defs>
            <ShadowFilter />
            <linearGradient id="icBody" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#333"/><stop offset="100%" stopColor="#111"/></linearGradient>
          </defs>
          <line x1="20" y1={cy} x2="45" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="95" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <rect x="45" y="20" width="50" height="50" rx="4" fill="url(#icBody)" stroke="#000" strokeWidth="2" filter="url(#drop-shadow)" />
          <circle cx="50" cy="25" r="3" fill="#94a3b8" />
          <text x="70" y="50" fontSize="10" fill="#cbd5e1" textAnchor="middle" fontWeight="bold">{type.toUpperCase()}</text>
          {[25, 35, 55, 65].map(y => (
            <g key={y}>
               <line x1="40" y1={y} x2="45" y2={y} stroke="#cbd5e1" strokeWidth="2" />
               <line x1="95" y1={y} x2="100" y2={y} stroke="#cbd5e1" strokeWidth="2" />
            </g>
          ))}
        </svg>
      );

    // ==========================================
    // 4. INPUTS & CONTROLS
    // ==========================================
    case 'switch':
      return (
        <svg {...svgProps}>
          <defs><ShadowFilter /></defs>
          <line x1="20" y1={cy} x2="40" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="100" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <rect x="40" y="35" width="60" height="20" rx="4" fill="#475569" stroke="#1e293b" strokeWidth="2" filter="url(#drop-shadow)" />
          <circle cx="45" cy={cy} r="5" fill="#cbd5e1" />
          <circle cx="95" cy={cy} r="5" fill="#cbd5e1" />
          <rect x="55" y="30" width="30" height="30" rx="4" fill={isClosed || value === 'Closed' ? "#22c55e" : "#ef4444"} stroke="#000" strokeWidth="2" filter="url(#drop-shadow)" />
        </svg>
      );

    case 'pushbutton':
      return (
        <svg {...svgProps}>
          <defs><ShadowFilter /></defs>
          <line x1="20" y1={cy} x2="40" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="100" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <rect x="40" y="25" width="60" height="40" rx="5" fill="#334155" stroke="#1e293b" strokeWidth="2" filter="url(#drop-shadow)" />
          <circle cx="70" cy="45" r="15" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
          <circle cx="70" cy="45" r="10" fill="#f87171" opacity="0.5" />
        </svg>
      );

    case 'potentiometer':
      return (
        <svg {...svgProps}>
          <defs><ShadowFilter /></defs>
          <line x1="20" y1={cy} x2="40" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="100" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <circle cx="70" cy="45" r="30" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="3" filter="url(#drop-shadow)" />
          <circle cx="70" cy="45" r="15" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
          <line x1="70" y1="30" x2="70" y2="45" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'ldr':
      return (
        <svg {...svgProps}>
          <defs><ShadowFilter /></defs>
          <line x1="20" y1={cy} x2="40" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="100" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <circle cx="70" cy="45" r="25" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" filter="url(#drop-shadow)" />
          <path d="M 50 45 L 55 35 L 60 55 L 65 35 L 70 55 L 75 35 L 80 55 L 85 35 L 90 45" fill="none" stroke="#78350f" strokeWidth="2" />
        </svg>
      );

    // ==========================================
    // 5. OUTPUTS & MOTORS
    // ==========================================
    case 'dc_motor':
      return (
        <svg {...svgProps}>
          <defs>
            <ShadowFilter />
            <linearGradient id="motorBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc"/><stop offset="50%" stopColor="#94a3b8"/><stop offset="100%" stopColor="#475569"/>
            </linearGradient>
          </defs>
          <line x1="20" y1={cy} x2="40" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="100" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <rect x="40" y="20" width="60" height="50" rx="5" fill="url(#motorBody)" stroke="#1e293b" strokeWidth="2" filter="url(#drop-shadow)" />
          <rect x="35" y="40" width="10" height="10" fill="#cbd5e1" stroke="#333" strokeWidth="1" />
          <circle cx="70" cy="45" r="10" fill="#333" />
          <text x="70" y="50" fontSize="14" fill="#fff" textAnchor="middle" fontWeight="bold">M</text>
        </svg>
      );

    case 'seven_segment':
      return (
        <svg {...svgProps}>
          <defs><ShadowFilter /></defs>
          <rect x="40" y="10" width="60" height="70" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="3" filter="url(#drop-shadow)" />
          <path d="M 50 20 L 90 20 L 85 25 L 55 25 Z" fill="#ef4444" opacity={isSimulating ? 1 : 0.2} />
          <path d="M 50 70 L 90 70 L 85 65 L 55 65 Z" fill="#ef4444" opacity={isSimulating ? 1 : 0.2} />
          <path d="M 92 22 L 92 42 L 87 38 L 87 26 Z" fill="#ef4444" opacity={isSimulating ? 1 : 0.2} />
          <path d="M 92 48 L 92 68 L 87 64 L 87 52 Z" fill="#ef4444" opacity={isSimulating ? 1 : 0.2} />
          <path d="M 48 22 L 48 42 L 53 38 L 53 26 Z" fill="#ef4444" opacity={isSimulating ? 1 : 0.2} />
          <path d="M 48 48 L 48 68 L 53 64 L 53 52 Z" fill="#ef4444" opacity={isSimulating ? 1 : 0.2} />
          <path d="M 50 45 L 90 45 L 85 40 L 55 40 Z" fill="#ef4444" opacity={isSimulating ? 1 : 0.2} />
        </svg>
      );

    // ==========================================
    // 6. ADVANCED BOARDS
    // ==========================================
    case 'arduino':
      return (
        <svg {...svgProps}>
          <defs>
            <ShadowFilter />
            <linearGradient id="arduinoBoard" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#008184"/><stop offset="100%" stopColor="#005a5b"/></linearGradient>
          </defs>
          <rect x="15" y="10" width="110" height="70" rx="5" fill="url(#arduinoBoard)" stroke="#003d3d" strokeWidth="2" filter="url(#drop-shadow)" />
          <rect x="15" y="15" width="25" height="20" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
          <rect x="45" y="10" width="70" height="10" fill="#111" />
          <rect x="45" y="70" width="70" height="10" fill="#111" />
          <rect x="105" y="25" width="20" height="40" fill="#111" />
          <rect x="60" y="35" width="30" height="20" fill="#111" rx="2" />
          <text x="75" y="50" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">UNO</text>
          <text x="75" y="30" fontSize="6" fill="#ccc" textAnchor="middle">ARDUINO</text>
          <rect x="85" y="15" width="10" height="10" fill="#ef4444" rx="1" />
        </svg>
      );

    case 'breadboard':
      return (
        <svg {...svgProps}>
          <defs><ShadowFilter /></defs>
          <rect x="5" y="10" width="130" height="70" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" filter="url(#drop-shadow)" />
          <line x1="10" y1="20" x2="130" y2="20" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
          <line x1="10" y1="70" x2="130" y2="70" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
          <rect x="15" y="42" width="110" height="6" fill="#e2e8f0" />
          {[...Array(4)].map((_, row) => (
             [...Array(10)].map((_, col) => (
                <g key={`${row}-${col}`}>
                   <rect x={20 + col * 10} y={28 + row * 4} width="2" height="2" fill="#64748b" />
                   <rect x={20 + col * 10} y={52 + row * 4} width="2" height="2" fill="#64748b" />
                </g>
             ))
          ))}
        </svg>
      );

    // ==========================================
    // 7. INSTRUMENTS & TRANSFORMERS
    // ==========================================
    case 'voltmeter':
    case 'ammeter':
      const isAmp = type === 'ammeter';
      return (
        <svg {...svgProps}>
          <defs><ShadowFilter /></defs>
          <line x1="20" y1={cy} x2="40" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="100" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <circle cx="70" cy={cy} r="30" fill="#f8fafc" stroke="#475569" strokeWidth="3" filter="url(#drop-shadow)" />
          <text x="70" y="55" fontSize="24" fill="#1e293b" textAnchor="middle" fontWeight="bold">{isAmp ? 'A' : 'V'}</text>
        </svg>
      );

    case 'dso':
    case 'cro':
      return (
        <svg {...svgProps}>
          <defs>
            <ShadowFilter />
            <linearGradient id="dsoCase" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#475569"/><stop offset="100%" stopColor="#1e293b"/></linearGradient>
          </defs>
          <line x1="20" y1={cy} x2="30" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="110" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <rect x="30" y="10" width="80" height="70" rx="5" fill="url(#dsoCase)" stroke="#000" strokeWidth="2" filter="url(#drop-shadow)" />
          <rect x="35" y="15" width="55" height="45" rx="2" fill="#000" stroke="#64748b" strokeWidth="2" />
          <line x1="45" y1="15" x2="45" y2="60" stroke="#1e293b" strokeWidth="1" />
          <line x1="55" y1="15" x2="55" y2="60" stroke="#1e293b" strokeWidth="1" />
          <line x1="65" y1="15" x2="65" y2="60" stroke="#1e293b" strokeWidth="1" />
          <line x1="75" y1="15" x2="75" y2="60" stroke="#1e293b" strokeWidth="1" />
          <line x1="35" y1="30" x2="90" y2="30" stroke="#1e293b" strokeWidth="1" />
          <line x1="35" y1="45" x2="90" y2="45" stroke="#1e293b" strokeWidth="1" />
          {isSimulating ? (
             <path d="M 35 40 Q 45 15 55 40 T 75 40 T 90 40" fill="none" stroke="#22c55e" strokeWidth="2">
               <animate attributeName="d" dur="0.8s" repeatCount="indefinite" values="M 35 40 Q 45 15 55 40 T 75 40 T 90 40; M 35 40 Q 45 65 55 40 T 75 40 T 90 40; M 35 40 Q 45 15 55 40 T 75 40 T 90 40" />
             </path>
          ) : (
             <line x1="35" y1="40" x2="90" y2="40" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
          )}
          <circle cx="100" cy="20" r="4" fill="#ef4444" />
          <circle cx="100" cy="35" r="4" fill="#22c55e" />
          <circle cx="100" cy="50" r="4" fill="#3b82f6" />
          <text x="70" y="75" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="bold">DSO</text>
        </svg>
      );

    case 'transformer':
    case 'ct_transformer':
      return (
        <svg {...svgProps}>
          <defs><ShadowFilter /></defs>
          <line x1="20" y1={cy} x2="45" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="95" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="65" y1="20" x2="65" y2="70" stroke="#333" strokeWidth="4" filter="url(#drop-shadow)" />
          <line x1="75" y1="20" x2="75" y2="70" stroke="#333" strokeWidth="4" filter="url(#drop-shadow)" />
          <path d="M 45 45 Q 55 25 65 45 Q 55 65 45 45" fill="none" stroke="#b45309" strokeWidth="3" />
          <path d="M 55 45 Q 65 25 75 45" fill="none" stroke="#b45309" strokeWidth="3" /> 
          <path d="M 95 45 Q 85 25 75 45 Q 85 65 95 45" fill="none" stroke="#b45309" strokeWidth="3" />
        </svg>
      );

    // ==========================================
    // ULTIMATE FALLBACK
    // ==========================================
    default: 
      return (
        <svg {...svgProps}>
          <rect x="25" y="20" width="90" height="50" rx="6" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" strokeDasharray="5,5" />
          <text x="70" y="45" fontSize="12" fill="#475569" textAnchor="middle" fontWeight="bold">{type ? type.toUpperCase().replace('_', ' ') : 'COMPONENT'}</text>
          <text x="70" y="60" fontSize="10" fill="#94a3b8" textAnchor="middle">No Symbol</text>
          <line x1="20" y1={cy} x2="25" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
          <line x1="115" y1={cy} x2="120" y2={cy} stroke={pinColor} strokeWidth={pinStroke} />
        </svg>
      );
  }
};
