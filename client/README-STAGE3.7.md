# CircuitWeb Stage 3.7 — Reliable Click-to-Connect Pin Fix

This is a focused correction to Stage 3.6's pin event handling.

## What changed
- Uses a single `onClick` event path for pin-to-pin connection.
- Removes the competing `pointerdown` / `pointerup` connection completion path.
- Click a source pin once: it becomes highlighted amber.
- Click a different destination pin: a wire is committed and the source selection clears.
- Click the same source pin again or press Esc to cancel.
- Click empty canvas while a source is selected to add wire bend points.
- Existing wire node editing and breadboard lead-contact logic are retained.

## Install

Stop only the CircuitWeb Vite terminal with Ctrl+C. Do not stop EduLabX / port 3000.

```bash
cd ~/Downloads
unzip -o CircuitWeb-Stage3.7-Click-Pin-Fix.zip
cd circuitweb-stage3.6-pin-breadboard-fix
chmod +x apply-circuitweb-stage3.7.sh
./apply-circuitweb-stage3.7.sh ~/circuitweb-clone/client
cd ~/circuitweb-clone/client
pnpm build
pnpm dev -- --host 0.0.0.0
```

The installer creates a `.circuitweb-stage3.7-backup-*` backup before replacing files.

## Test
1. Place two resistors with clear space between them.
2. Click the first resistor's left terminal. It must turn amber.
3. Click the second resistor's right terminal.
4. A wire must remain between the two pins and the amber source selection must clear.
5. Click the wire to insert a bend node; drag that node to reshape.

This patch focuses on reliable click-click wiring. Drag-to-connect is intentionally not used in this version so that one consistent event path handles pin connections.

## Verification
This patch is a source-level event-path correction. A full build and real browser click test must be performed in the user's CircuitWeb environment. It is not claimed to be browser-verified here.
