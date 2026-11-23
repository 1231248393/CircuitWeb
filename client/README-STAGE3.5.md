# CircuitWeb Stage 3.5 — Pin-to-Pin Wiring & Editable Routes

This incremental patch is based on the uploaded `CircuitWeb-current.zip` source. It changes the active sandbox wiring interaction in `src/components/SandboxUI.jsx` and adds a small geometry helper plus Node tests.

## Interaction

1. Click a component pin to begin a wire.
2. Click empty canvas locations to add fixed bend points. The live preview follows the pointer from the last bend.
3. Click a different component pin to finish the wire. The wire retains its start/end component IDs and pin IDs, so it remains part of the electrical netlist.
4. Press `Esc` or right-click the canvas to cancel an unfinished wire.
5. Click an existing wire to select it and insert a bend node at the clicked location.
6. Drag a selected wire's blue/white bend nodes to reshape it. Endpoints remain attached to their component pins.
7. Select a wire and press `Delete` or `Backspace` to remove it.

The wire route points are stored as `wire.points` in canvas/world coordinates. Existing circuits with endpoint-only wires remain supported; they render as a straight segment until edited.

## Install

Stop only the CircuitWeb Vite process (`Ctrl+C` in its terminal), then run:

```bash
cd ~/Downloads
unzip CircuitWeb-Stage3.5-Pin-Routing.zip
cd circuitweb-stage3.5-pin-routing
chmod +x apply-circuitweb-stage3.5.sh
./apply-circuitweb-stage3.5.sh ~/circuitweb-clone/client
```

Start and test:

```bash
cd ~/circuitweb-clone/client
node --test tests/simulation-engine.test.mjs tests/wire-routing.test.mjs
pnpm build
pnpm dev -- --host 0.0.0.0
```

The installer backs up the files it replaces in `.circuitweb-stage3.5-backup-TIMESTAMP`. It does not modify the simulation engine, electrical netlist, saved circuits, or the EduLabX portal.

## Scope and limitations

- This patch implements editable pin-to-pin wire routing and route-node editing.
- Electrical connectivity still comes from the two endpoint pin IDs; visual bend points do not create extra electrical nodes.
- Breadboard internal connectivity remains handled by the existing netlist builder.
- It does not add autorouting, electrical-rule checking, multi-wire selection, or a full SPICE solver.
- A full Vite build/browser test must be run on the user's machine after installation.
