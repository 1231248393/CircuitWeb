import React, { useRef, useEffect, useState } from 'react';
import { generateWaveformData } from './simulation';
import { X, Move } from 'lucide-react';
import { useStore } from './store';

export default function RealisticDSO({ compId, type, onClose, isSimulating }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const { simulationResult } = useStore();
  const waveType = simulationResult?.waveType || 'default';
  
  const isCRO = type === 'cro';
  
  // 🔥 CRO vs DSO Visual Styling
  const bgColor = isCRO ? '#051405' : '#0a0a0a'; // CRO: Dark CRT Green, DSO: Pitch Black
  const gridColor = isCRO ? '#0f2e0f' : '#333333'; // CRO: Faint Green Grid, DSO: Grey Grid
  const ch1Color = isCRO ? '#00ff00' : '#00e5ff'; // CRO: Phosphor Green, DSO: Cyan
  const ch2Color = isCRO ? '#aaff00' : '#ffb300'; // CRO: Yellow-Green, DSO: Amber/Orange

  // DSO has more precise default values, CRO is a bit more zoomed out
  const [voltsDivCH1, setVoltsDivCH1] = useState(isCRO ? 2 : 1);
  const [voltsDivCH2, setVoltsDivCH2] = useState(isCRO ? 2 : 1);
  const [timeDiv, setTimeDiv] = useState(isCRO ? 0.08 : 0.05); 
  const [posCH1, setPosCH1] = useState(-30);
  const [posCH2, setPosCH2] = useState(30);

  useEffect(() => {
    if (!isSimulating) return;
    let animationId;
    const animate = () => {
      setPhase(p => p + 0.05);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isSimulating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      const gridSize = 40;
      for(let i=0; i<w; i+=gridSize) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for(let i=0; i<h; i+=gridSize) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

      // Center Axes
      ctx.strokeStyle = isCRO ? '#1a4a1a' : '#555555';
      ctx.beginPath(); ctx.moveTo(0, h/2); ctx.lineTo(w, h/2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h); ctx.stroke();

      const data = generateWaveformData(w, timeDiv, 2, 20, phase, waveType);
      
      const ch1Peak = Math.max(...data.map(d => Math.abs(d.ch1)), 0.1);
      const ch2Peak = Math.max(...data.map(d => Math.abs(d.ch2)), 0.1);

      // 🔥 CH1 DRAWING LOGIC
      ctx.beginPath();
      ctx.strokeStyle = ch1Color;
      
      if (isCRO) {
        // CRO: Thick glowing lines with slight analog noise
        ctx.lineWidth = 3;
        ctx.shadowBlur = 8;
        ctx.shadowColor = ch1Color;
        ctx.lineJoin = 'round';
      } else {
        // DSO: Crisp, thin digital lines
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
        ctx.lineJoin = 'miter';
      }

      data.forEach((p, i) => {
        const scale = (h/2 * 0.9) / (ch1Peak * voltsDivCH1);
        // Add tiny noise for CRO to simulate analog imperfection
        const noise = isCRO ? (Math.random() - 0.5) * 1.5 : 0; 
        const y = (h/2) - (p.ch1 * scale) - posCH1 + noise;
        
        if(i===0) ctx.moveTo(p.x, y);
        else ctx.lineTo(p.x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 🔥 CH2 DRAWING LOGIC
      ctx.beginPath();
      ctx.strokeStyle = ch2Color;
      
      if (isCRO) {
        ctx.lineWidth = 3;
        ctx.shadowBlur = 8;
        ctx.shadowColor = ch2Color;
        ctx.lineJoin = 'round';
      } else {
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
        ctx.lineJoin = 'miter';
      }

      data.forEach((p, i) => {
        const scale = (h/2 * 0.9) / (ch2Peak * voltsDivCH2);
        const noise = isCRO ? (Math.random() - 0.5) * 1.5 : 0;
        const y = (h/2) - (p.ch2 * scale) - posCH2 + noise;
        
        if(i===0) ctx.moveTo(p.x, y);
        else ctx.lineTo(p.x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    draw();
  }, [phase, voltsDivCH1, voltsDivCH2, timeDiv, posCH1, posCH2, isSimulating, bgColor, gridColor, ch1Color, ch2Color, isCRO, waveType]);

  return (
    <div style={{ width: '100%', height: '100%', background: isCRO ? '#1a1a1a' : '#222', borderRadius: '8px', border: isCRO ? '4px solid #333' : '1px solid #444', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header */}
      <div className="dso-drag-handle" style={{ background: isCRO ? '#222' : '#2a2a2a', padding: '8px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #444', cursor: 'grab' }}>
        <div style={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
          <Move size={14} color="#888" /><span style={{ color: ch1Color }}>■</span> CH1<span style={{ color: ch2Color }}>■</span> CH2
          <span style={{ marginLeft: '10px', fontSize: '11px', color: '#aaa' }}>{isCRO ? 'ANALOG CRO' : 'DIGITAL DSO'}</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={16} /></button>
      </div>

      <div style={{ display: 'flex', flex: 1, padding: '15px', gap: '15px' }}>
        {/* Screen */}
        <div className="dso-drag-handle" style={{ flex: 1, background: bgColor, borderRadius: isCRO ? '20px' : '4px', border: '4px solid #111', overflow: 'hidden', cursor: 'grab', boxShadow: isCRO ? 'inset 0 0 30px rgba(0,0,0,0.8)' : 'none' }}>
          <canvas ref={canvasRef} width={400} height={300} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />
        </div>

        {/* Controls */}
        <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
           <label style={{ color: ch1Color, fontSize: '10px', fontWeight: 'bold' }}>CH1 V/Div: {voltsDivCH1.toFixed(1)}</label>
           <input type="range" min="0.1" max="5" step="0.1" value={voltsDivCH1} onChange={(e) => setVoltsDivCH1(parseFloat(e.target.value))} style={{ accentColor: ch1Color }} />
           <label style={{ color: ch1Color, fontSize: '10px', fontWeight: 'bold' }}>CH1 Pos: {posCH1}</label>
           <input type="range" min="-150" max="150" value={posCH1} onChange={(e) => setPosCH1(parseInt(e.target.value))} style={{ accentColor: ch1Color }} />
           
           <label style={{ color: ch2Color, fontSize: '10px', fontWeight: 'bold', marginTop: '5px' }}>CH2 V/Div: {voltsDivCH2.toFixed(1)}</label>
           <input type="range" min="0.1" max="5" step="0.1" value={voltsDivCH2} onChange={(e) => setVoltsDivCH2(parseFloat(e.target.value))} style={{ accentColor: ch2Color }} />
           <label style={{ color: ch2Color, fontSize: '10px', fontWeight: 'bold' }}>CH2 Pos: {posCH2}</label>
           <input type="range" min="-150" max="150" value={posCH2} onChange={(e) => setPosCH2(parseInt(e.target.value))} style={{ accentColor: ch2Color }} />
           
           <label style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', marginTop: '5px' }}>Time/Div: {timeDiv.toFixed(2)}</label>
           <input type="range" min="0.01" max="1" step="0.01" value={timeDiv} onChange={(e) => setTimeDiv(parseFloat(e.target.value))} style={{ accentColor: '#fff' }} />
        </div>
      </div>
    </div>
  );
}
