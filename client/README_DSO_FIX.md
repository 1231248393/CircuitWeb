# CircuitWeb DSO Live-Simulation Synchronization Fix

## What this patch changes
- Passes the sandbox's latest `simulateTransient()` result into the DSO modal.
- Passes the shared Run/Pause state and elapsed simulation time into the DSO.
- Makes DSO Pause/Resume use the same simulation session as the main toolbar.
- Displays electrical solver warnings inside the DSO so a flat/zero trace has a visible explanation.

## Install
```bash
cd ~/Downloads
unzip -o CircuitWeb_DSO_Live_Sync_Fix.zip
cd CircuitWeb_DSO_Live_Sync_Fix
chmod +x INSTALL_CIRCUITWEB_DSO_SYNC_FIX.sh
./INSTALL_CIRCUITWEB_DSO_SYNC_FIX.sh
```

Then start the app:
```bash
cd ~/circuitweb-clone/client
pnpm dev -- --host 0.0.0.0
```

## Important scope limitation
This patch fixes the missing connection between the sandbox simulation result and the DSO UI. It does **not** implement an AT89C51 CPU, a Keil C51 compiler, arbitrary 8051 firmware execution, or Arduino firmware execution. The existing circuit solver explicitly reports unsupported devices; an 8051 output pin will not produce a program-driven waveform until a microcontroller execution model is implemented and connected to the electrical solver.

This is a source patch, not a claim that the 8051/Arduino firmware feature is complete.
