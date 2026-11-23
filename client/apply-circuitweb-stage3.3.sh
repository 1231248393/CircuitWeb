#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-$HOME/circuitweb-clone/client}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILE="$TARGET/src/components/SandboxUI.jsx"
if [[ ! -f "$TARGET/package.json" || ! -f "$FILE" || ! -f "$TARGET/src/electrical/simulationEngine.js" || ! -f "$TARGET/src/components/CircuitIcons.jsx" ]]; then
  echo "ERROR: Target does not look like the expected CircuitWeb client: $TARGET" >&2
  echo "Expected package.json, SandboxUI.jsx, CircuitIcons.jsx and simulationEngine.js." >&2
  exit 1
fi
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$TARGET/.circuitweb-stage3.3-backup-$STAMP"
mkdir -p "$BACKUP/src/components"
cp "$FILE" "$BACKUP/src/components/SandboxUI.jsx"
cp "$SCRIPT_DIR/src/components/SandboxUI.jsx" "$FILE"
echo "Installed Stage 3.3 instrument-display upgrade into: $TARGET"
echo "Backup: $BACKUP"
echo "No solver, saved circuits, or EduLabX portal files were changed."
