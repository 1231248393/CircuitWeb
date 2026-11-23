# CircuitWeb Stage 3.8 — Physical Pin Contact + Instrument Terminals

## What this fixes

### 1. Direct pin-to-pin contact without a wire
- Two component terminals are electrically joined when their terminal centers are within 12 world units.
- No wire object is required for this physical contact.
- Contact is recalculated from component positions whenever the circuit topology is rebuilt.
- Moving parts apart opens the contact again.
- Same-component pins are never joined by proximity.
- Breadboard holes retain their dedicated five-hole strip / power-rail rules and are excluded from generic proximity joining.

### 2. Shared connectivity in the editor and solver
- `buildElectricalNets()` and `buildSimulationTopology()` use the same physical-contact helper.
- The displayed net count and the simulation use the same direct-contact rules.
- Wire connections, direct terminal contact, and breadboard contacts all feed the same electrical graph.

### 3. Visible electrical terminals
- Pin hit targets are now visible as small terminal markers rather than transparent click areas.
- Connected terminals are shown in teal, hovered terminals in blue, and the selected source terminal in amber.
- This makes `Signal OUT`, `RF OUT`, `GND`, DMM probes, DSO/CRO probes, battery snaps and component leads easier to locate.
- The function generator's white front-panel circles are controls/decorative panel elements, not its electrical output. Its actual `Signal OUT` and `GND` pins are on the right edge and are now visibly marked.

### 4. DMM direct probe-to-battery example
With the Multimeter's `VΩ` pin touching the 9V battery's positive snap and its `COM` pin touching the negative snap, the solver reads approximately 9.000 V without drawing separate wires.

## Install

Stop only the CircuitWeb Vite terminal with Ctrl+C. Do not stop EduLabX / port 3000.

```bash
cd ~/Downloads
unzip -o CircuitWeb-Stage3.8-Physical-Contact-Fix.zip
cd circuitweb-stage3.8-physical-contact-fix
chmod +x apply-circuitweb-stage3.8.sh
./apply-circuitweb-stage3.8.sh ~/circuitweb-clone/client
```

Then test and restart:

```bash
cd ~/circuitweb-clone/client
node --test tests/simulation-engine.test.mjs tests/wire-routing.test.mjs tests/pin-breadboard-behavior.test.mjs
pnpm build
pnpm dev -- --host 0.0.0.0
```

The installer creates `.circuitweb-stage3.8-backup-*` before replacing files.

## Manual checks

1. Place a 9V battery and a Multimeter.
2. Move the meter so its red VΩ probe touches battery `+` and black COM touches battery `−`.
3. Do not draw wires. The two contact nets should appear and the DMM should show about 9.000 V.
4. Move the meter away. The contacts and 9V reading should disappear.
5. Place a function generator. Its `Signal OUT` and `GND` terminals should be visible on its right edge. The two white circles on its face are not electrical pins.
6. Connect `Signal OUT` to DSO CH1 and generator GND to DSO GND (with wires or direct terminal contact). Run Simulation; CH1 should show the generated waveform.

## Verification and limitations

- Automated Node tests: 16 passed, including a new test that places a DMM directly on a 9V battery with no wires and verifies a 9V reading.
- ZIP integrity and installer smoke test are performed before delivery.
- A full Vite build and live browser test are not claimed here because this isolated patch environment does not contain the project's `node_modules`.
- The 12-unit contact tolerance is a practical 2D editor approximation. It is not a 3D physical collision engine; terminals from different components placed very close together will be treated as touching.
- The current simulator still models only the device behaviours implemented in its simulation engine. This patch fixes electrical connectivity, not full Arduino firmware emulation or every component model.
