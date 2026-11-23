import React from 'react';
export const AdvancedSymbol = ({ type }) => {
  switch (type) {
    case 'signal_gen': return <svg width="100%" height="100%" viewBox="0 0 140 90"><rect x="10" y="10" width="120" height="70" fill="#0284c7" rx="8"/><text x="70" y="50" fontSize="12" fill="#fff" textAnchor="middle">SIGNAL GEN</text></svg>;
    case 'carrier_gen': return <svg width="100%" height="100%" viewBox="0 0 140 90"><rect x="10" y="10" width="120" height="70" fill="#6d28d9" rx="8"/><text x="70" y="50" fontSize="12" fill="#fff" textAnchor="middle">CARRIER GEN</text></svg>;
    case 'oscilloscope': case 'cro': return <svg width="100%" height="100%" viewBox="0 0 140 90"><rect x="10" y="10" width="120" height="70" fill="#111" rx="8"/><rect x="20" y="20" width="70" height="50" fill="#052e16"/><text x="100" y="50" fontSize="12" fill="#fff" textAnchor="middle">CRO</text></svg>;
    default: return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', border: '2px solid #ccc', borderRadius: '8px', background: '#fff', fontSize: '12px' }}>{type}</div>;
  }
};
