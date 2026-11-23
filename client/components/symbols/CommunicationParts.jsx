import React from 'react';
export const CommunicationSymbol = ({ type }) => {
  switch (type) {
    case 'diode': return <svg width="100%" height="100%" viewBox="0 0 140 90"><polygon points="40,30 80,45 40,60" fill="#333" /><line x1="80" y1="30" x2="80" y2="60" stroke="#333" strokeWidth="4"/></svg>;
    case 'transformer': case 'transformer_ct': return <svg width="100%" height="100%" viewBox="0 0 140 90"><path d="M 50 20 Q 30 30 50 40 Q 30 50 50 60" fill="none" stroke="#b45309" strokeWidth="4"/><path d="M 90 20 Q 110 30 90 40 Q 110 50 90 60" fill="none" stroke="#b45309" strokeWidth="4"/><line x1="65" y1="15" x2="65" y2="65" stroke="#333" strokeWidth="2"/><line x1="75" y1="15" x2="75" y2="65" stroke="#333" strokeWidth="2"/></svg>;
    default: return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', border: '2px solid #ccc', borderRadius: '8px', background: '#fff', fontSize: '12px' }}>{type}</div>;
  }
};
