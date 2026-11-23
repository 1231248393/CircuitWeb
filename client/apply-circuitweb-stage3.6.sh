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
)
for file in "${required[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "ERROR: Required CircuitWeb file missing: $file"
    exit 1
  fi
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$TARGET/.circuitweb-stage3.6-backup-$STAMP"
mkdir -p "$BACKUP/src/components" "$BACKUP/src/electrical" "$BACKUP/tests"

for rel in \
  src/components/SandboxUI.jsx \
  src/electrical/netlist.js \
  src/electrical/simulationEngine.js; do
  cp -a "$TARGET/$rel" "$BACKUP/$rel"
done
for rel in src/electrical/wireRouting.js tests/simulation-engine.test.mjs tests/wire-routing.test.mjs; do
  if [[ -f "$TARGET/$rel" ]]; then
    mkdir -p "$BACKUP/$(dirname "$rel")"
    cp -a "$TARGET/$rel" "$BACKUP/$rel"
  fi
done

mkdir -p "$TARGET/src/components" "$TARGET/src/electrical" "$TARGET/tests"
cp "$SCRIPT_DIR/src/components/SandboxUI.jsx" "$TARGET/src/components/SandboxUI.jsx"
cp "$SCRIPT_DIR/src/electrical/netlist.js" "$TARGET/src/electrical/netlist.js"
cp "$SCRIPT_DIR/src/electrical/simulationEngine.js" "$TARGET/src/electrical/simulationEngine.js"
cp "$SCRIPT_DIR/src/electrical/breadboardContacts.js" "$TARGET/src/electrical/breadboardContacts.js"
cp "$SCRIPT_DIR/src/electrical/wireRouting.js" "$TARGET/src/electrical/wireRouting.js"
cp "$SCRIPT_DIR/tests/pin-breadboard-behavior.test.mjs" "$TARGET/tests/pin-breadboard-behavior.test.mjs"
cp "$SCRIPT_DIR/tests/wire-routing.test.mjs" "$TARGET/tests/wire-routing.test.mjs"

printf '\nCircuitWeb Stage 3.6 pin + breadboard connectivity patch installed.\n'
printf 'Backup: %s\n' "$BACKUP"
printf 'Next: cd "%s" && node --test tests/simulation-engine.test.mjs tests/wire-routing.test.mjs tests/pin-breadboard-behavior.test.mjs\n' "$TARGET"
