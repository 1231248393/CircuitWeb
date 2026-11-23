#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${1:-$HOME/circuitweb-clone/client}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$TARGET/.circuitweb-stage3.4-backup-$STAMP"

required=(
  "package.json"
  "src/components/SandboxUI.jsx"
  "src/components/DSOModal.jsx"
  "src/electrical/simulationEngine.js"
  "tests/simulation-engine.test.mjs"
)
for rel in "${required[@]}"; do
  if [[ ! -f "$TARGET/$rel" ]]; then
    echo "ERROR: expected CircuitWeb file not found: $TARGET/$rel" >&2
    echo "No files were changed." >&2
    exit 1
  fi
done

mkdir -p "$BACKUP"
for rel in "${required[@]}"; do
  [[ "$rel" == "package.json" ]] && continue
  mkdir -p "$BACKUP/$(dirname "$rel")"
  cp -a "$TARGET/$rel" "$BACKUP/$rel"
done

for rel in "src/components/SandboxUI.jsx" "src/components/DSOModal.jsx" "src/electrical/simulationEngine.js" "tests/simulation-engine.test.mjs"; do
  mkdir -p "$TARGET/$(dirname "$rel")"
  cp -a "$SCRIPT_DIR/$rel" "$TARGET/$rel"
done

echo "CircuitWeb Stage 3.4 patch installed."
echo "Backup: $BACKUP"
echo "Next: cd \"$TARGET\" && node --test tests/simulation-engine.test.mjs"
