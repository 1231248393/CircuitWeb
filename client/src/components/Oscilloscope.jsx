// src/components/Oscilloscope.jsx
import React, { useEffect, useRef } from 'react';
import { generateWaveformData } from '../simulation';

export default function Oscilloscope() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const draw = () => {
      ctx.fillStyle = '#111'; // Dark DSO background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      for(let i=0; i<canvas.width; i+=40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
      for(let i=0; i<canvas.height; i+=40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

      // Generate Data (Audio = 2Hz, Carrier = 20Hz for visual clarity)
      const data = generateWaveformData(canvas.width, 1, 2, 20);

      // Draw CH1: Audio (Green)
      ctx.beginPath();
      ctx.strokeStyle = '#00ff00'; 
      ctx.lineWidth = 2;
      data.forEach((p, i) => {
        const y = canvas.height/2 - (p.audio * 60);
        if(i===0) ctx.moveTo(p.x, y);
        else ctx.lineTo(p.x, y);
      });
      ctx.stroke();

      // Draw CH2: DSB-SC Output (Blue)
      ctx.beginPath();
      ctx.strokeStyle = '#00bfff'; 
      ctx.lineWidth = 2;
      data.forEach((p, i) => {
        const y = canvas.height/2 - (p.dsbsc * 60);
        if(i===0) ctx.moveTo(p.x, y);
        else ctx.lineTo(p.x, y);
      });
      ctx.stroke();

      time += 0.01;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ padding: '20px', background: '#222', borderRadius: '8px', display: 'inline-block' }}>
      <div style={{ color: '#fff', marginBottom: '10px', fontFamily: 'monospace' }}>
        <span style={{ color: '#00ff00' }}>CH1: Audio</span> | <span style={{ color: '#00bfff' }}>CH2: DSB-SC</span>
      </div>
      <canvas ref={canvasRef} width={600} height={300} style={{ borderRadius: '4px', border: '2px solid #444' }} />
    </div>
  );
}
