import React from 'react';
/** Scalable, original vector assets; intentionally drawn in SVG so no third-party copyrighted model files are required. */
export function DIPPackage({type='IC',pins=8}) {
  const rows=pins/2, ys=Array.from({length:rows},(_,i)=>25+i*(42/Math.max(1,rows-1)));
  return <svg viewBox="0 0 140 90" width="100%" height="100%" aria-label={`${type} dual in-line package`}>
    <defs><linearGradient id="dipBody" x2="0" y2="1"><stop stopColor="#343a40"/><stop offset=".5" stopColor="#15191d"/><stop offset="1" stopColor="#080a0c"/></linearGradient><linearGradient id="metal" x2="0" y2="1"><stop stopColor="#e2e8f0"/><stop offset="1" stopColor="#64748b"/></linearGradient></defs>
    {ys.map((y,i)=><g key={i}><path d={`M42 ${y} H29 V${y+5} H42 M98 ${y} H111 V${y+5} H98`} fill="none" stroke="url(#metal)" strokeWidth="3"/></g>)}
    <rect x="40" y="17" width="60" height="56" rx="5" fill="url(#dipBody)" stroke="#020617" strokeWidth="1.5"/><path d="M62 17 Q70 30 78 17" fill="none" stroke="#64748b" strokeWidth="2"/><text x="70" y="48" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">{type.toUpperCase()}</text><text x="70" y="60" textAnchor="middle" fill="#94a3b8" fontSize="5">DIP · {pins} PIN</text>
  </svg>;
}
export function ArduinoBoardAsset(){return <svg viewBox="0 0 140 90" width="100%" height="100%" aria-label="Arduino UNO board illustration">
  <defs><linearGradient id="pcb" x2="0" y2="1"><stop stopColor="#168b8d"/><stop offset="1" stopColor="#07575d"/></linearGradient><linearGradient id="usb" x2="0" y2="1"><stop stopColor="#f8fafc"/><stop offset="1" stopColor="#94a3b8"/></linearGradient></defs>
  <path d="M16 12 H116 Q126 12 126 22 V68 Q126 78 116 78 H16 Q10 78 10 70 V20 Q10 12 16 12Z" fill="url(#pcb)" stroke="#064e52" strokeWidth="2"/>
  <rect x="10" y="24" width="22" height="28" rx="3" fill="url(#usb)" stroke="#64748b"/><rect x="12" y="29" width="18" height="18" fill="#cbd5e1"/>
  <rect x="39" y="17" width="72" height="8" rx="1" fill="#111827"/><rect x="39" y="65" width="72" height="8" rx="1" fill="#111827"/>
  <rect x="53" y="31" width="35" height="28" rx="3" fill="#111827" stroke="#64748b"/><text x="70" y="47" textAnchor="middle" fill="#f8fafc" fontSize="7">ATmega328P</text>
  <rect x="96" y="30" width="20" height="27" rx="2" fill="#1f2937"/><circle cx="44" cy="39" r="3" fill="#f59e0b"/><circle cx="44" cy="50" r="3" fill="#dc2626"/><text x="72" y="29" textAnchor="middle" fill="#d1fae5" fontSize="5">UNO R3</text>
  </svg>}
