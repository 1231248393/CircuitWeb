#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 /path/to/circuitweb/client"
  exit 2
fi
TARGET="$(realpath -m "$TARGET")"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -f "$TARGET/package.json" || ! -f "$TARGET/src/components/SandboxUI.jsx" || ! -f "$TARGET/src/electrical/netlist.js" ]]; then
  echo "ERROR: This does not look like the CircuitWeb client folder: $TARGET"
  echo "Required: package.json, src/components/SandboxUI.jsx, src/electrical/netlist.js"
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$TARGET/.circuitweb-stage3.5-backup-$STAMP"
mkdir -p "$BACKUP/src/components" "$BACKUP/src/electrical" "$BACKUP/tests"
cp -a "$TARGET/src/components/SandboxUI.jsx" "$BACKUP/src/components/SandboxUI.jsx"
if [[ -f "$TARGET/src/electrical/wireRouting.js" ]]; then
  cp -a "$TARGET/src/electrical/wireRouting.js" "$BACKUP/src/electrical/wireRouting.js"
fi
if [[ -f "$TARGET/tests/wire-routing.test.mjs" ]]; then
  cp -a "$TARGET/tests/wire-routing.test.mjs" "$BACKUP/tests/wire-routing.test.mjs"
fi

mkdir -p "$TARGET/src/components" "$TARGET/src/electrical" "$TARGET/tests"
cp "$SCRIPT_DIR/src/components/SandboxUI.jsx" "$TARGET/src/components/SandboxUI.jsx"
cp "$SCRIPT_DIR/src/electrical/wireRouting.js" "$TARGET/src/electrical/wireRouting.js"
cp "$SCRIPT_DIR/tests/wire-routing.test.mjs" "$TARGET/tests/wire-routing.test.mjs"

printf '\nCircuitWeb Stage 3.5 pin-routing patch installed.\n'
printf 'Backup: %s\n' "$BACKUP"
printf 'Next: cd "%s" && node --test tests/simulation-engine.test.mjs tests/wire-routing.test.mjs\n' "$TARGET"
