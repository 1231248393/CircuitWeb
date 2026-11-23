#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-}"
if [[ -z "$TARGET" || ! -d "$TARGET/src/components" ]]; then
  echo "Usage: $0 /path/to/circuitweb/client" >&2
  exit 2
fi
if [[ ! -f "$TARGET/src/electrical/simulationEngine.js" ]]; then
  echo "Stage 3 simulation engine not found at $TARGET/src/electrical/simulationEngine.js" >&2
  echo "Install the Stage 3 unified simulation patch first, then run this patch." >&2
  exit 3
fi
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$TARGET/backups/circuitweb-scope-policy-$STAMP"
mkdir -p "$BACKUP/src/components"
for FILE in SandboxUI.jsx GuidedLabUI.jsx; do
  if [[ -f "$TARGET/src/components/$FILE" ]]; then
    cp "$TARGET/src/components/$FILE" "$BACKUP/src/components/$FILE"
  fi
done
cp "$SCRIPT_DIR/src/components/SandboxUI.jsx" "$TARGET/src/components/SandboxUI.jsx"
cp "$SCRIPT_DIR/src/components/GuidedLabUI.jsx" "$TARGET/src/components/GuidedLabUI.jsx"
echo "Installed Run Simulation instrument policy."
echo "Backup: $BACKUP"
echo "Behavior: Run always evaluates the circuit; DSO/CRO modal opens only if a DSO/CRO/Oscilloscope component is placed."
