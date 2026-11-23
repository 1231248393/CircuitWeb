import React, { useState } from 'react';

export default function ControlsPanel({ experiment }) {
  const [powerOn, setPowerOn] = useState(false);
  const [voltage, setVoltage] = useState(115);
  const [readings, setReadings] = useState([]);

  const handleRecord = () => {
    if (!powerOn) return;
    const output = -(voltage * voltage / 1000).toFixed(3);
    setReadings([...readings, { id: readings.length + 1, input: voltage, output }]);
  };

  return (
    <div style={{ width: '320px', backgroundColor: 'white', borderLeft: '1px solid #ccc', padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      {/* Controls (Always visible) */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>Controls</div>
        <div style={{ padding: '16px', backgroundColor: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', color: '#374151' }}>Power On/Off</span>
            <button onClick={() => setPowerOn(!powerOn)} style={{ backgroundColor: powerOn ? '#14b8a6' : '#d1d5db', width: '40px', height: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer', position: 'relative' }}>
              <div style={{ backgroundColor: 'white', width: '16px', height: '16px', borderRadius: '50%', position: 'absolute', top: '2px', left: powerOn ? '22px' : '2px', transition: 'left 0.2s' }}></div>
            </button>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span>Voltage (V)</span>
              <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{voltage} V</span>
            </div>
            <input type="range" min="0" max="200" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} disabled={!powerOn} style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* 🚨 Data Table (ONLY shows if opened via SimuLab) */}
      {experiment === 'am-demodulation' && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', flex: 1 }}>
          <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px', fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Readings</span>
            <button onClick={handleRecord} style={{ backgroundColor: 'white', color: '#2563eb', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Record</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
              <tr><th style={{ padding: '8px' }}>S.No</th><th style={{ padding: '8px' }}>In (V)</th><th style={{ padding: '8px' }}>Out (V)</th></tr>
            </thead>
            <tbody>
              {readings.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <td style={{ padding: '8px' }}>{r.id}</td>
                  <td style={{ padding: '8px' }}>{r.input}</td>
                  <td style={{ padding: '8px', color: '#ef4444' }}>{r.output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sandbox Mode Message */}
      {experiment !== 'am-demodulation' && (
        <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: 'auto' }}>
          Data recording is only available in Guided Experiment Mode.
        </div>
      )}
    </div>
  );
}
