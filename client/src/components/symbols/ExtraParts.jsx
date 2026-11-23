import React from 'react';

export const ExtraSymbol = ({ type, value, isSimulating }) => {
  switch (type) {
    case 'voltmeter': case 'ammeter':
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 90">
          <defs><linearGradient id="meter" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#334155" /><stop offset="100%" stopColor="#0f172a" /></linearGradient><filter id="shadow"><feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.4"/></filter></defs>
          <rect x="20" y="15" width="100" height="50" rx="4" fill="url(#meter)" stroke="#1e293b" strokeWidth="2" filter="url(#shadow)" />
          <rect x="30" y="25" width="60" height="30" rx="2" fill="#000" stroke="#222" />
          <text x="105" y="45" fontSize="18" fill="#cbd5e1" textAnchor="middle" fontWeight="bold">{type === 'voltmeter' ? 'V' : 'A'}</text>
          <text x="60" y="46" fontSize="20" fill={isSimulating ? "#ef4444" : "#333"} textAnchor="middle" fontFamily="monospace" fontWeight="bold">{isSimulating ? (value || "0.0") : "8.8"}</text>
          <rect x="10" y="35" width="10" height="10" fill="#94a3b8" /><rect x="120" y="35" width="10" height="10" fill="#94a3b8" />
        </svg>
      );
    case 'solar_cell':
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 90">
          <defs><filter id="shadow"><feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/></filter></defs>
          <rect x="20" y="10" width="100" height="60" rx="2" fill="#1e3a8a" stroke="#000" strokeWidth="2" filter="url(#shadow)" />
          <path d="M 40 10 L 40 70 M 60 10 L 60 70 M 80 10 L 80 70 M 100 10 L 100 70" stroke="#3b82f6" strokeWidth="2" />
          <path d="M 20 25 L 120 25 M 20 45 L 120 45 M 20 65 L 120 65" stroke="#3b82f6" strokeWidth="2" />
          <rect x="45" y="70" width="6" height="15" fill="#94a3b8" /><rect x="89" y="70" width="6" height="15" fill="#94a3b8" />
        </svg>
      );
    case 'coin_cell':
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 90">
          <defs><radialGradient id="coin" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f8fafc" /><stop offset="100%" stopColor="#64748b" /></radialGradient></defs>
          <rect x="40" y="35" width="60" height="20" fill="#cbd5e1" /><ellipse cx="70" cy="35" rx="30" ry="15" fill="url(#coin)" stroke="#475569" strokeWidth="2" /><ellipse cx="70" cy="55" rx="30" ry="15" fill="url(#coin)" stroke="#475569" strokeWidth="2" />
          <text x="70" y="40" fontSize="12" fill="#333" textAnchor="middle" fontWeight="bold">{value}V</text>
        </svg>
      );
    default: return null;
  }
};
