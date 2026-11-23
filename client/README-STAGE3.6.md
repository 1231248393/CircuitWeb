# CircuitWeb Stage 3.6 — Pin Interaction & Breadboard Connectivity Fix

## What this update addresses

1. **Pin-to-pin connection**
   - Click a pin, then click another pin to create a wire.
   - Also supports press/drag/release from one pin onto another.
   - Canvas clicks between pins add wire bend points.
   - `Esc` or right-click cancels an unfinished wire.
2. **Pin targeting**
   - Only the active source pin and hovered target pin are highlighted.
   - Removes the previous behaviour that highlighted every component pin at once.
   - Larger hit targets for ordinary two-terminal components; smaller hit targets for dense board / IC headers.
3. **Breadboard electrical contacts**
   - A component lead very close to a breadboard hole centre is electrically joined to that hole's breadboard strip.
   - The same contact calculation is used by the net counter and the simulation topology.
   - Jumper wires are still supported; bend nodes are visual routing points and do not create extra nets.
4. **Real LED state**
   - LED glow is driven by the solver's forward current and forward voltage.
   - An isolated / unconnected LED does not glow.
   - Removed the fake Arduino onboard LED blink preview. Arduino firmware is not emulated by this patch.

## Breadboard placement

Place the Breadboard component, then position LED / resistor / battery leads directly over the hole centres. The auto-contact tolerance is 2.8 canvas world units. If a lead is slightly off-centre, zoom in and align it to a hole.

This is a coordinate-based breadboard contact approximation, not a 3D physical insertion detector.

## Install

Stop only the CircuitWeb Vite terminal with Ctrl+C. Do not stop EduLabX / port 3000.

```bash
cd ~/Downloads
unzip -o CircuitWeb-Stage3.6-Pin-Breadboard-Fix.zip
cd circuitweb-stage3.6-pin-breadboard-fix
chmod +x apply-circuitweb-stage3.6.sh
./apply-circuitweb-stage3.6.sh ~/circuitweb-clone/client

cd ~/circuitweb-clone/client
node --test tests/simulation-engine.test.mjs tests/wire-routing.test.mjs tests/pin-breadboard-behavior.test.mjs
pnpm build
pnpm dev -- --host 0.0.0.0
```

The installer backs up the files it replaces in `.circuitweb-stage3.6-backup-*`.

## Verification limits

- Automated engine, breadboard contact and wire-routing tests are included.
- JSX is syntax-transpiled for validation.
- A full Vite build and browser pointer-interaction test must still be run on the user's machine.
- Breadboard snapping uses world-coordinate proximity; components may need manual alignment to hole centres.
- This does not add Arduino AVR firmware emulation or support for all electrical component models.
