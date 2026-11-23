import React from 'react';

export const CommunicationSymbol = ({ type, isSimulating, value, unit }) => {
  const ShadowDefs = () => (
    <defs>
      <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.25" /></filter>
    </defs>
  );

  switch (type) {
    case 'diode':
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><line x1="20" y1="45" x2="55" y2="45" stroke="#94a3b8" strokeWidth="4" /><polygon points="55,25 95,45 55,65" fill="#1e293b" filter="url(#dropShadow)" /><line x1="95" y1="25" x2="95" y2="65" stroke="#1e293b" strokeWidth="4" /><line x1="95" y1="45" x2="120" y2="45" stroke="#94a3b8" strokeWidth="4" /><text x="70" y="80" fontSize="10" fill="#333" textAnchor="middle">{value}</text></svg>;
    case 'varactor':
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><line x1="20" y1="45" x2="55" y2="45" stroke="#94a3b8" strokeWidth="4" /><polygon points="55,25 95,45 55,65" fill="#1e293b" filter="url(#dropShadow)" /><line x1="95" y1="25" x2="95" y2="65" stroke="#1e293b" strokeWidth="4" /><line x1="95" y1="45" x2="120" y2="45" stroke="#94a3b8" strokeWidth="4" /><path d="M 55 65 L 75 80 M 75 80 L 75 70" stroke="#1e293b" strokeWidth="3" fill="none" /></svg>;
    case 'transformer': case 'transformer_ct':
      return <svg width="100%" height="100%" viewBox="0 0 140 90"><ShadowDefs /><path d="M 45 15 Q 25 25 45 35 Q 25 45 45 55 Q 25 65 45 75" fill="none" stroke="#b45309" strokeWidth="4" filter="url(#dropShadow)" /><path d="M 95 15 Q 115 25 95 35 Q 115 45 95 55 Q 115 65 95 75" fill="none" stroke="#b45309" strokeWidth="4" filter="url(#dropShadow)" /><line x1="65" y1="10" x2="65" y2="80" stroke="#475569" strokeWidth="4" /><line x1="75" y1="10" x2="75" y2="80" stroke="#475569" strokeWidth="4" /><line x1="20" y1="15" x2="45" y2="15" stroke="#94a3b8" strokeWidth="4" /><line x1="20" y1="45" x2="45" y2="45" stroke="#94a3b8" strokeWidth="4" /><line x1="20" y1="75" x2="45" y2="75" stroke="#94a3b8" strokeWidth="4" /><line x1="95" y1="15" x2="120" y2="15" stroke="#94a3b8" strokeWidth="4" /><line x1="95" y1="45" x2="120" y2="45" stroke="#94a3b8" strokeWidth="4" /><line x1="95" y1="75" x2="120" y2="75" stroke="#94a3b8" strokeWidth="4" /></svg>;
    default:
      return (
        <svg width="100%" height="100%" viewBox="0 0 140 90">
          <rect x="10" y="10" width="120" height="70" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
          <text x="70" y="50" fontSize="12" fill="#ef4444" textAnchor="middle" fontWeight="bold">MISSING</text>
        </svg>
      );
  }
};
