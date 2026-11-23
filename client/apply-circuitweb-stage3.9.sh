#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 /path/to/circuitweb/client"
  exit 2
fi
TARGET="$(realpath -m "$TARGET")"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
required=(
  "$TARGET/package.json"
  "$TARGET/src/components/SandboxUI.jsx"
  "$TARGET/src/electrical/netlist.js"
  "$TARGET/src/electrical/simulationEngine.js"
  "$TARGET/src/electrical/directPinContacts.js"
  "$TARGET/src/electrical/wireRouting.js"
)
for file in "${required[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "ERROR: Required Stage 3.8 CircuitWeb file missing: $file"
    echo "Install the Stage 3.8 physical-contact patch first, then retry."
    exit 1
  fi
done
if ! grep -q "buildElectricalNets" "$TARGET/src/components/SandboxUI.jsx"; then
  echo "ERROR: SandboxUI.jsx does not look like the Stage 3.8 editor. No files changed."
  exit 1
fi
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$TARGET/.circuitweb-stage3.9-backup-$STAMP"
mkdir -p "$BACKUP/src/components"
cp -a "$TARGET/src/components/SandboxUI.jsx" "$BACKUP/src/components/SandboxUI.jsx"
cp "$SCRIPT_DIR/src/components/SandboxUI.jsx" "$TARGET/src/components/SandboxUI.jsx"
mkdir -p "$TARGET/tests"
cp "$SCRIPT_DIR/tests/editor-toolbar-smoke.test.mjs" "$TARGET/tests/editor-toolbar-smoke.test.mjs"
printf '\nCircuitWeb Stage 3.9 editor workspace installed.\n'
printf 'Backup: %s\n' "$BACKUP"
printf 'Run: cd "%s" && node --test tests/editor-toolbar-smoke.test.mjs\n' "$TARGET"
