# CircuitWeb source update

## What this update changes
1. Adds separate Arduino Uno and 8051 AT89C51 source buffers in the Code tab.
2. Saves both code buffers and the selected target with design profiles. Older profiles containing only `codeText` continue to load as Arduino source.
3. Animates the DSO trace sweep while the scope is open and the simulation is running, using the measured sample set from the circuit solver.
4. Keeps the existing voltage/div and time/div controls and solver-derived CH1/CH2 readings.

## Important execution limitation
This update does **not** add a full 8051 C51 compiler/emulator or an Arduino firmware toolchain. The code editor remains a source editor. The Run button still runs the existing educational electrical circuit solver. Therefore arbitrary pasted 8051/Arduino programs will not yet drive MCU pins, LCD text, LEDs, or DSO inputs. The existing `mcu8051Lcd.js` is a limited LCD-call interpreter, not a complete CPU emulator.

The DSO animation sweeps the solver's measured trace across the display; it does not invent a waveform or recalculate a new transient at every animation frame. Only connected and ground-referenced channels are plotted.

## Install
Extract this ZIP, then run:

```bash
cd ~/Downloads/CircuitWeb_Permanent_Update
chmod +x INSTALL_CIRCUITWEB_UPDATE.sh
./INSTALL_CIRCUITWEB_UPDATE.sh
```

If your project root is not `~/circuitweb-clone`:

```bash
CIRCUITWEB_PROJECT="/absolute/path/to/circuitweb-clone" ./INSTALL_CIRCUITWEB_UPDATE.sh
```

The installer creates timestamped backups of both files before replacing them.

## Start
```bash
cd ~/circuitweb-clone/client
pnpm dev -- --host 0.0.0.0
```

## Verification performed on the supplied source
- Existing Node tests: 16 passed, 0 failed.
- JSX syntax transpilation check: `SandboxUI.jsx` and `DSOModal.jsx` passed.
- A full Vite production build was not run because dependencies are not included in the supplied source ZIP.
