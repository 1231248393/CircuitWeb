import React, { useEffect, useMemo, useState } from 'react';
import { componentPins } from './CircuitIcons';
import { formatEngineering, simulateTransient } from '../electrical/simulationEngine';

const plotWidth = 800;
const plotHeight = 380;
const channelCenters = { ch1: 96, ch2: 286 };

function buildTrace(samples, channel, voltsPerDivision, position, phase = 0) {
  const points = samples.filter((sample) => Number.isFinite(sample[channel]));
  if (points.length < 2) return '';
  const center = channelCenters[channel];
  const pixelsPerDivision = 34;
  const safeScale = Math.max(0.05, Number(voltsPerDivision) || 1);
  const commands = [];
  points.forEach((sample, index) => {
    const rawX = (index / (points.length - 1)) * plotWidth - phase;
    const x = ((rawX % plotWidth) + plotWidth) % plotWidth;
    const y = center - ((sample[channel] - position) / safeScale) * pixelsPerDivision;
    const clampedY = Math.max(8, Math.min(plotHeight - 8, y));
    const wrapped = index > 0 && x < (((((index - 1) / (points.length - 1)) * plotWidth - phase) % plotWidth) + plotWidth) % plotWidth;
    commands.push(`${index === 0 || wrapped ? 'M' : 'L'} ${x.toFixed(2)} ${clampedY.toFixed(2)}`);
  });
  return commands.join(' ');
}

function Stat({ label, value, color }) {
  return (
    <div style={{ background: '#111827', border: '1px solid #273449', borderRadius: 7, padding: '7px 9px' }}>
      <div style={{ color: '#94a3b8', fontSize: 10, marginBottom: 3 }}>{label}</div>
      <div style={{ color: color || '#f8fafc', fontWeight: 750, fontSize: 12 }}>{value}</div>
    </div>
  );
}

export default function DSOModal({ isOpen, onClose, components = [], wires = [], liveSimulation = null, simulationRunState = 'running', simulationElapsed = null, onPauseResume = null }) {
  const [ch1VDiv, setCh1VDiv] = useState(2);
  const [ch2VDiv, setCh2VDiv] = useState(2);
  const [ch1Position, setCh1Position] = useState(0);
  const [ch2Position, setCh2Position] = useState(0);
  const [timeDivMs, setTimeDivMs] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [readings, setReadings] = useState([]);
  const [tracePhase, setTracePhase] = useState(0);

  // Sweep measured samples across the scope while RUN is active. This animates
  // the measured trace; it does not fabricate a new electrical signal.
  useEffect(() => {
    if (!isOpen || !isRunning || simulationRunState !== 'running') return undefined;
    const timer = window.setInterval(() => setTracePhase((phase) => (phase + 3) % plotWidth), 40);
    return () => window.clearInterval(timer);
  }, [isOpen, isRunning, simulationRunState]);

  const fallbackSimulation = useMemo(() => {
    if (!isOpen) return null;
    return simulateTransient(components, wires, componentPins, {
      durationSeconds: Math.max(0.0001, timeDivMs * 10 / 1000),
      steps: 900
    });
  }, [isOpen, components, wires, timeDivMs]);
  // Prefer the shared sandbox runtime so the scope follows the running circuit.
  const simulation = liveSimulation || fallbackSimulation;

  useEffect(() => {
    if (!isOpen || !isRunning || simulationRunState !== 'running' || Number.isFinite(simulationElapsed)) return undefined;
    const timer = window.setInterval(() => {
      setElapsedSeconds((previous) => previous + 0.1);
    }, 100);
    return () => window.clearInterval(timer);
  }, [isOpen, isRunning, simulationRunState, simulationElapsed]);
  const displayElapsedSeconds = Number.isFinite(simulationElapsed) ? simulationElapsed : elapsedSeconds;

  if (!isOpen) return null;

  const ch1 = simulation?.channels?.ch1;
  const ch2 = simulation?.channels?.ch2;
  const ch1Path = simulation ? buildTrace(simulation.samples, 'ch1', ch1VDiv, ch1Position, tracePhase) : '';
  const ch2Path = simulation ? buildTrace(simulation.samples, 'ch2', ch2VDiv, ch2Position, tracePhase) : '';
  const hasCH1Trace = Boolean(ch1?.connected && ch1?.referenceFound && ch1Path);
  const hasCH2Trace = Boolean(ch2?.connected && ch2?.referenceFound && ch2Path);

  const handleRecord = () => {
    setReadings((previous) => [...previous, {
      id: previous.length + 1,
      time: displayElapsedSeconds,
      ch1Rms: ch1?.rms ?? null,
      ch2Rms: ch2?.rms ?? null,
      ch1Max: ch1?.max ?? null,
      ch2Max: ch2?.max ?? null
    }]);
  };

  const resetSimulationClock = () => {
    setElapsedSeconds(0);
    setReadings([]);
    setIsRunning(false);
  };

  const handleClose = () => {
    setIsRunning(true);
    setElapsedSeconds(0);
    setReadings([]);
    onClose();
  };

  const labelStyle = { color: '#cbd5e1', fontSize: 11, display: 'flex', justifyContent: 'space-between', marginBottom: 3 };
  const rangeStyle = { width: '100%', accentColor: '#38bdf8' };

  return (
    <div role="dialog" aria-modal="true" aria-label="CircuitWeb digital oscilloscope" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(2,6,23,.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14 }}>
      <div style={{ width: 'min(1180px, 98vw)', maxHeight: '94vh', overflow: 'auto', background: '#172033', color: '#e5e7eb', border: '1px solid #334155', borderRadius: 12, boxShadow: '0 24px 70px rgba(0,0,0,.5)' }}>
        <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', background: '#0b1220', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <strong style={{ color: '#f8fafc', letterSpacing: '.04em' }}>DIGITAL OSCILLOSCOPE</strong>
            <span style={{ color: hasCH1Trace ? '#34d399' : '#64748b', fontSize: 11, fontWeight: 700 }}>● CH1 {hasCH1Trace ? 'CONNECTED' : 'NOT CONNECTED'}</span>
            <span style={{ color: hasCH2Trace ? '#60a5fa' : '#64748b', fontSize: 11, fontWeight: 700 }}>● CH2 {hasCH2Trace ? 'CONNECTED' : 'NOT CONNECTED'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#94a3b8', fontVariantNumeric: 'tabular-nums', fontSize: 11 }}>SIM TIME {displayElapsedSeconds.toFixed(2)} s</span>
            <button type="button" onClick={() => onPauseResume ? onPauseResume() : setIsRunning((value) => !value)} style={{ background: simulationRunState === 'running' ? '#92400e' : '#047857', color: 'white', border: 0, borderRadius: 6, padding: '7px 11px', cursor: 'pointer', fontWeight: 700 }}>{simulationRunState === 'running' ? 'Ⅱ Pause' : '▶ Resume'}</button>
            <button type="button" onClick={resetSimulationClock} style={{ background: '#334155', color: 'white', border: 0, borderRadius: 6, padding: '7px 10px', cursor: 'pointer' }}>Reset</button>
            <button type="button" onClick={handleClose} aria-label="Close oscilloscope" style={{ background: 'transparent', color: '#cbd5e1', border: 0, fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: 14, padding: 14 }}>
          <section>
            <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <svg viewBox={`0 0 ${plotWidth} ${plotHeight}`} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'min(48vh, 390px)' }}>
                <rect x="0" y="0" width={plotWidth} height={plotHeight} fill="#020617" />
                {Array.from({ length: 11 }, (_, index) => <line key={`v-${index}`} x1={index * (plotWidth / 10)} y1="0" x2={index * (plotWidth / 10)} y2={plotHeight} stroke="#1e293b" strokeWidth="1" />)}
                {Array.from({ length: 11 }, (_, index) => <line key={`h-${index}`} x1="0" y1={index * (plotHeight / 10)} x2={plotWidth} y2={index * (plotHeight / 10)} stroke="#1e293b" strokeWidth="1" />)}
                <line x1="0" y1="190" x2={plotWidth} y2="190" stroke="#475569" strokeDasharray="5 5" />
                <text x="12" y="18" fill="#34d399" fontSize="12" fontWeight="700">CH1</text>
                <text x="12" y="208" fill="#60a5fa" fontSize="12" fontWeight="700">CH2</text>
                {hasCH1Trace && <path d={ch1Path} fill="none" stroke="#34d399" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />}
                {hasCH2Trace && <path d={ch2Path} fill="none" stroke="#60a5fa" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />}
                {!hasCH1Trace && <text x="400" y="92" textAnchor="middle" fill="#64748b" fontSize="15">{ch1?.connected ? 'CH1 GROUND NOT REFERENCED' : 'CH1 NOT CONNECTED'}</text>}
                {!hasCH2Trace && <text x="400" y="282" textAnchor="middle" fill="#64748b" fontSize="15">{ch2?.connected ? 'CH2 GROUND NOT REFERENCED' : 'CH2 NOT CONNECTED'}</text>}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', color: '#94a3b8', fontSize: 10, borderTop: '1px solid #1e293b' }}>
                <span>10 horizontal divisions</span>
                <span>TIME/DIV: {timeDivMs.toFixed(2)} ms</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginTop: 10 }}>
              <Stat label="CH1 RMS" value={ch1?.samples ? formatEngineering(ch1.rms) : '—'} color="#34d399" />
              <Stat label="CH1 PEAK" value={ch1?.samples ? `${formatEngineering(ch1.max)} / ${formatEngineering(ch1.min)}` : '—'} color="#34d399" />
              <Stat label="CH2 RMS" value={ch2?.samples ? formatEngineering(ch2.rms) : '—'} color="#60a5fa" />
            </div>

            {simulation?.warnings?.length > 0 && (
              <div style={{ marginTop: 10, background: '#3b2b13', border: '1px solid #854d0e', borderRadius: 7, padding: '9px 11px' }}>
                <strong style={{ color: '#fbbf24', fontSize: 11 }}>Simulation diagnostics</strong>
                {simulation.warnings.map((warning, index) => <p key={index} style={{ color: '#fde68a', fontSize: 11, margin: '5px 0 0', lineHeight: 1.45 }}>{warning}</p>)}
              </div>
            )}
            {simulation && simulation.success && <p style={{ color: '#86efac', fontSize: 10, margin: '8px 2px 0' }}>Solved {simulation.samples.length} circuit time samples using the connected component topology. Unsupported device models are listed above.</p>}
          </section>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 11 }}>
              <strong style={{ fontSize: 12, display: 'block', marginBottom: 10 }}>Channel controls</strong>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}><span>CH1 V/div</span><b>{ch1VDiv.toFixed(1)} V</b></label>
                <input aria-label="CH1 volts per division" type="range" min="0.1" max="10" step="0.1" value={ch1VDiv} onChange={(event) => setCh1VDiv(Number(event.target.value))} style={rangeStyle} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}><span>CH1 position</span><b>{ch1Position.toFixed(1)} V</b></label>
                <input aria-label="CH1 vertical position" type="range" min="-10" max="10" step="0.1" value={ch1Position} onChange={(event) => setCh1Position(Number(event.target.value))} style={rangeStyle} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}><span>CH2 V/div</span><b>{ch2VDiv.toFixed(1)} V</b></label>
                <input aria-label="CH2 volts per division" type="range" min="0.1" max="10" step="0.1" value={ch2VDiv} onChange={(event) => setCh2VDiv(Number(event.target.value))} style={rangeStyle} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}><span>CH2 position</span><b>{ch2Position.toFixed(1)} V</b></label>
                <input aria-label="CH2 vertical position" type="range" min="-10" max="10" step="0.1" value={ch2Position} onChange={(event) => setCh2Position(Number(event.target.value))} style={rangeStyle} />
              </div>
              <div>
                <label style={labelStyle}><span>Time/div</span><b>{timeDivMs.toFixed(2)} ms</b></label>
                <input aria-label="Time per division" type="range" min="0.1" max="10" step="0.1" value={timeDivMs} onChange={(event) => setTimeDivMs(Number(event.target.value))} style={rangeStyle} />
              </div>
            </div>

            {simulation?.instrumentReadings?.length > 0 && (
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 11 }}>
                <strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Meter measurements</strong>
                {simulation.instrumentReadings.map((reading) => (
                  <div key={reading.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '5px 0', borderTop: '1px solid #263449', fontSize: 11 }}>
                    <span style={{ color: '#cbd5e1' }}>{reading.name}</span>
                    <b style={{ color: reading.kind === 'current' ? '#fbbf24' : '#a7f3d0' }}>{formatEngineering(reading.value, reading.unit)}</b>
                  </div>
                ))}
              </div>
            )}

            {simulation?.warnings?.length > 0 && (
              <div role="status" style={{ background: '#2b1d0b', border: '1px solid #92400e', borderRadius: 8, padding: 10, color: '#fde68a', fontSize: 10, lineHeight: 1.45 }}>
                <strong style={{ display: 'block', marginBottom: 5 }}>Simulation diagnostics</strong>
                {simulation.warnings.map((warning, index) => <div key={`${index}-${warning}`}>• {warning}</div>)}
              </div>
            )}

            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 11, flex: 1, minHeight: 135 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 5, marginBottom: 8 }}>
                <strong style={{ fontSize: 12 }}>Captured readings</strong>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button type="button" onClick={handleRecord} style={{ background: '#0369a1', color: 'white', border: 0, borderRadius: 5, padding: '5px 8px', fontSize: 10, cursor: 'pointer' }}>Record</button>
                  <button type="button" onClick={() => setReadings([])} style={{ background: '#7f1d1d', color: 'white', border: 0, borderRadius: 5, padding: '5px 8px', fontSize: 10, cursor: 'pointer' }}>Clear</button>
                </div>
              </div>
              <div style={{ maxHeight: 180, overflow: 'auto' }}>
                {readings.length === 0 ? <p style={{ color: '#64748b', fontSize: 11 }}>No readings recorded.</p> : readings.map((reading) => (
                  <div key={reading.id} style={{ borderTop: '1px solid #334155', padding: '7px 0', fontSize: 10, color: '#cbd5e1' }}>
                    <b>#{reading.id}</b> · {reading.time.toFixed(2)} s<br />
                    CH1 RMS: {reading.ch1Rms == null ? '—' : formatEngineering(reading.ch1Rms)} · CH2 RMS: {reading.ch2Rms == null ? '—' : formatEngineering(reading.ch2Rms)}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
