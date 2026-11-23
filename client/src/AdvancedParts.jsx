import React from 'react';

export const AdvancedSymbol = ({ type, isSimulating, value }) => {
  switch (type) {
    case 'arduino':
      return (
        <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pcbTeal" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00979D" /><stop offset="100%" stopColor="#006468" /></linearGradient>
            <linearGradient id="usbMetal" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#f8fafc" /><stop offset="50%" stopColor="#cbd5e1" /><stop offset="100%" stopColor="#94a3b8" /></linearGradient>
            <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" /></filter>
          </defs>
          <path d="M 10 10 L 260 10 L 290 40 L 290 190 L 10 190 Z" fill="url(#pcbTeal)" stroke="#003e43" strokeWidth="2" filter="url(#dropShadow)" />
          <circle cx="20" cy="20" r="5" fill="#fff" opacity="0.8" /><circle cx="280" cy="50" r="5" fill="#fff" opacity="0.8" /><circle cx="20" cy="180" r="5" fill="#fff" opacity="0.8" /><circle cx="280" cy="180" r="5" fill="#fff" opacity="0.8" />
          <rect x="5" y="45" width="45" height="40" rx="2" fill="url(#usbMetal)" stroke="#64748b" strokeWidth="1.5" filter="url(#dropShadow)" /><rect x="15" y="55" width="25" height="20" fill="#333" />
          <rect x="10" y="120" width="35" height="40" rx="3" fill="#1a1a1a" stroke="#333" strokeWidth="1" filter="url(#dropShadow)" />
          <rect x="240" y="20" width="20" height="20" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" filter="url(#dropShadow)" /><rect x="245" y="25" width="10" height="10" rx="1" fill="#ef4444" />
          <rect x="50" y="5" width="90" height="20" fill="#1a1a1a" rx="1" filter="url(#dropShadow)" /><rect x="145" y="5" width="75" height="20" fill="#1a1a1a" rx="1" filter="url(#dropShadow)" />
          {[55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215].map((x, i) => <rect key={`t-${i}`} x={x} y="6" width="6" height="18" fill="#fbbf24" />)}
          <rect x="90" y="175" width="80" height="20" fill="#1a1a1a" rx="1" filter="url(#dropShadow)" /><rect x="175" y="175" width="65" height="20" fill="#1a1a1a" rx="1" filter="url(#dropShadow)" />
          {[95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235].map((x, i) => <rect key={`b-${i}`} x={x} y="176" width="6" height="18" fill="#fbbf24" />)}
          <rect x="120" y="110" width="80" height="40" rx="2" fill="#111" filter="url(#dropShadow)" /><ellipse cx="70" cy="110" rx="20" ry="10" fill="url(#usbMetal)" filter="url(#dropShadow)" />
          <text x="55" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 55 32)">AREF</text>
          <text x="65" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 65 32)">GND</text>
          <text x="75" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 75 32)">13</text>
          <text x="85" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 85 32)">12</text>
          <text x="95" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 95 32)">~11</text>
          <text x="105" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 105 32)">~10</text>
          <text x="115" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 115 32)">~9</text>
          <text x="125" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 125 32)">8</text>
          <text x="145" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 145 32)">7</text>
          <text x="155" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 155 32)">~6</text>
          <text x="165" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 165 32)">~5</text>
          <text x="175" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 175 32)">4</text>
          <text x="185" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 185 32)">~3</text>
          <text x="195" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 195 32)">2</text>
          <text x="205" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 205 32)">TX→1</text>
          <text x="215" y="32" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 215 32)">RX←0</text>
          <text x="150" y="45" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">DIGITAL (PWM~)</text>
          <text x="100" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 100 168)">IOREF</text>
          <text x="110" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 110 168)">RESET</text>
          <text x="120" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 120 168)">3.3V</text>
          <text x="130" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 130 168)">5V</text>
          <text x="140" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 140 168)">GND</text>
          <text x="150" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 150 168)">GND</text>
          <text x="160" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 160 168)">Vin</text>
          <text x="180" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 180 168)">A0</text>
          <text x="190" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 190 168)">A1</text>
          <text x="200" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 200 168)">A2</text>
          <text x="210" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 210 168)">A3</text>
          <text x="220" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 220 168)">A4</text>
          <text x="230" y="168" fontSize="5" fill="#fff" textAnchor="middle" transform="rotate(-90 230 168)">A5</text>
          <text x="125" y="160" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">POWER</text>
          <text x="205" y="160" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">ANALOG IN</text>
          <text x="160" y="85" fontSize="22" fill="#fff" textAnchor="middle" fontWeight="bold">UNO</text>
          <text x="160" y="100" fontSize="9" fill="#fff" textAnchor="middle">ARDUINO</text>
          <rect x="250" y="70" width="12" height="6" fill={isSimulating ? "#22c55e" : "#166534"} /><text x="245" y="76" fontSize="8" fill="#fff" textAnchor="end">ON</text>
          <rect x="90" y="70" width="8" height="6" fill={isSimulating ? "#f97316" : "#7c2d12"} /><text x="105" y="76" fontSize="8" fill="#fff">L</text>
        </svg>
      );
    case 'seven_segment':
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 90">
          <rect x="20" y="10" width="100" height="70" rx="4" fill="none" stroke="#38bdf8" strokeWidth="2" />
          <rect x="25" y="15" width="90" height="60" rx="2" fill="#1e293b" />
          <path d="M 50 25 L 90 25 M 45 30 L 45 40 M 95 30 L 95 40 M 50 45 L 90 45 M 45 50 L 45 60 M 95 50 L 95 60 M 50 65 L 90 65" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" opacity={isSimulating ? "1" : "0.8"} />
          <circle cx="105" cy="65" r="3" fill="#cbd5e1" opacity={isSimulating ? "1" : "0.8"} />
          {[35, 50, 65, 80, 95].map(x => <circle key={`t-${x}`} cx={x} cy="20" r="2" fill="#64748b" />)}
          {[35, 50, 65, 80, 95].map(x => <circle key={`b-${x}`} cx={x} cy="70" r="2" fill="#64748b" />)}
        </svg>
      );
    case 'signal_gen': return <svg width="100%" height="100%" viewBox="0 0 140 90"><defs><linearGradient id="genBody" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#bae6fd" /><stop offset="100%" stopColor="#0284c7" /></linearGradient></defs><rect x="15" y="15" width="110" height="60" rx="6" fill="url(#genBody)" stroke="#0369a1" strokeWidth="2" /><path d="M 30 60 Q 45 40 60 60 T 95 60" fill="none" stroke="#fff" strokeWidth="4" /><text x="70" y="50" fontSize="12" fill="#fff" textAnchor="middle" fontWeight="bold">SIGNAL GEN</text></svg>;
    case 'adc': return <svg width="100%" height="100%" viewBox="0 0 140 90"><defs><linearGradient id="adcBody" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fef3c7" /><stop offset="100%" stopColor="#d97706" /></linearGradient></defs><rect x="15" y="15" width="110" height="60" rx="6" fill="url(#adcBody)" stroke="#92400e" strokeWidth="2" /><path d="M 30 60 L 40 60 L 40 50 L 50 50 L 50 40 L 60 40 L 60 30 L 70 30 L 70 40 L 80 40 L 80 50 L 90 50 L 90 60 L 100 60" fill="none" stroke="#78350f" strokeWidth="4" /><text x="70" y="72" fontSize="10" fill="#78350f" textAnchor="middle" fontWeight="bold">ADC</text></svg>;
    case 'dac': return <svg width="100%" height="100%" viewBox="0 0 140 90"><defs><linearGradient id="dacBody" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#dcfce7" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs><rect x="15" y="15" width="110" height="60" rx="6" fill="url(#dacBody)" stroke="#047857" strokeWidth="2" /><path d="M 30 60 L 40 60 L 40 50 L 50 50 L 50 40 L 60 40 L 60 30 L 70 30 L 70 40 L 80 40 L 80 50 L 90 50 L 90 60 L 100 60" fill="none" stroke="#064e3b" strokeWidth="4" /><text x="70" y="72" fontSize="10" fill="#064e3b" textAnchor="middle" fontWeight="bold">DAC</text></svg>;
    case 'oscilloscope': return <svg width="100%" height="100%" viewBox="0 0 140 90"><defs><linearGradient id="croBody" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#334155" /><stop offset="100%" stopColor="#0f172a" /></linearGradient></defs><rect x="5" y="5" width="130" height="80" rx="6" fill="url(#croBody)" stroke="#1e293b" strokeWidth="2" /><rect x="15" y="15" width="80" height="60" rx="3" fill="#052e16" stroke="#166534" strokeWidth="2" /><path d="M 25 50 Q 40 20 60 50 T 85 50" fill="none" stroke="#22c55e" strokeWidth="3" /><circle cx="115" cy="25" r="5" fill="#ef4444" /><circle cx="115" cy="45" r="5" fill="#22c55e" /><circle cx="115" cy="65" r="5" fill="#3b82f6" /></svg>;
    default: return null;
  }
};