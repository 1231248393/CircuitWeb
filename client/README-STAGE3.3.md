# CircuitWeb Stage 3.3 — Instrument Display & Activity Feedback

## What this upgrade adds
- Multimeter, voltmeter and ammeter show a digital LCD-style screen over the physical instrument artwork.
- Meter values are taken from the Stage 3 electrical solver's `instrumentReadings` for the placed instrument. A meter with unconnected probes displays `OPEN` / dashes rather than a made-up value.
- Ammeter values are formatted in mA or A; voltage meters show V.
- Function generator and carrier generator show an animated waveform preview and output/standby status while the simulation session runs.
- A placed CRO/DSO shows a compact animated CH1 preview on its canvas display only when CH1 has a valid connected reference; the full instrument window remains available.
- Waveform preview shape follows the component's selected Sine, Square or Triangle setting.
- The DSO/CRO modal behavior and Stage 3.2 Run/Pause/Stop controls remain intact.

## Important accuracy limits
- Meter readings are the solved values from the simulation run snapshot. Stage 3.3 does not yet recalculate the circuit continuously at every simulation time step; the RUN animation is not proof of continuous electrical solving.
- Generator screen animation is a visual activity preview. The selected frequency and amplitude are not yet a complete calibrated source model across all circuit devices.
- The existing solver supports only its documented subset. It is not SPICE and does not yet emulate all ICs, motors, sensors, displays, Arduino firmware or ESP32 firmware.
- DSO/CRO traces still require valid connected probes and supported circuit nodes.

## Install
Stop the CircuitWeb Vite terminal with Ctrl+C first. Do not stop the EduLabX portal on port 3000.

```bash
cd ~/Downloads/circuitweb-stage3.3-instrument-display-patch
chmod +x apply-circuitweb-stage3.3.sh
./apply-circuitweb-stage3.3.sh ~/circuitweb-clone/client
cd ~/circuitweb-clone/client
pnpm build
pnpm dev -- --host 0.0.0.0
```

The installer backs up `src/components/SandboxUI.jsx` before replacing it. It does not modify the electrical solver, saved circuits, or EduLabX portal.
