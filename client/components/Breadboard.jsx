import React, { useMemo, useState } from 'react';
import { createBreadboardHoleGrid } from '../electrical/breadboard.js';
const W=600,H=246;
export default function Breadboard({insertions=[],wireStart,onHoleConnect}) {
  const holes=useMemo(()=>createBreadboardHoleGrid(),[]);
  const [hovered,setHovered]=useState(null);
  const xFor=c=>42+c*17.7;
  const yFor=h=>h.zone==='topRail' ? 27+h.row*13 : h.zone==='upper' ? 75+h.row*17 : h.zone==='lower' ? 171+h.row*17 : 219+h.row*13;
  const used=new Set(insertions.map(i=>`${i.hole.zone}:${i.hole.column}:${i.hole.row}`));
  const activeNet=hovered?.netId;
  return <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label="Solderless breadboard with connected terminal strips and power rails" style={{filter:'drop-shadow(0 5px 7px #0002)'}}>
    <defs><linearGradient id="bbPlastic" x2="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#e9edf0"/></linearGradient></defs>
    <rect x="4" y="4" width="592" height="238" rx="12" fill="url(#bbPlastic)" stroke="#c5cbd1" strokeWidth="2"/>
    <rect x="15" y="15" width="570" height="25" rx="5" fill="#f8fafc"/><rect x="15" y="204" width="570" height="25" rx="5" fill="#f8fafc"/>
    <path d="M22 22 H574 M22 211 H574" stroke="#dc2626" strokeWidth="2" opacity=".75"/><path d="M22 35 H574 M22 224 H574" stroke="#2563eb" strokeWidth="2" opacity=".75"/>
    <rect x="15" y="60" width="570" height="128" rx="4" fill="#f1f5f9" stroke="#d4dbe2"/>
    <rect x="15" y="124" width="570" height="12" fill="#dce2e8"/>
    <text x="21" y="12" fontSize="8" fill="#64748b">+ POWER RAIL</text><text x="21" y="202" fontSize="8" fill="#64748b">− POWER RAIL</text>
    {holes.map(h=>{const x=xFor(h.column),y=yFor(h),id=`${h.zone}:${h.column}:${h.row}`,isUsed=used.has(id),isHot=activeNet&&activeNet===h.netId;return <g key={h.id} onMouseEnter={()=>setHovered(h)} onMouseLeave={()=>setHovered(null)} onMouseUp={e=>{e.stopPropagation();onHoleConnect?.(h);}} style={{cursor:wireStart?'crosshair':'pointer'}}>
      <circle cx={x} cy={y} r={isHot?7:6} fill={isHot?'#fbbf24':isUsed?'#16a34a':'#cbd5e1'} stroke={isHot?'#b45309':'#64748b'} strokeWidth="1"/><circle cx={x} cy={y} r="2.2" fill="#334155"/>
      <title>{`${h.zone} column ${h.column+1}, row ${h.row+1} · ${h.netId}`}</title>
    </g>})}
    <text x="300" y="132" textAnchor="middle" fontSize="8" fill="#94a3b8" letterSpacing="2">CENTER TRENCH · IC ISOLATION</text>
    <text x="20" y="56" fontSize="8" fill="#64748b">A B C D E</text><text x="20" y="197" fontSize="8" fill="#64748b">F G H I J</text>
  </svg>;
}
