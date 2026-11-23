#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -z "$TARGET_DIR" ]]; then
  echo "Usage: $0 /path/to/circuitweb-clone/client"
  exit 2
fi

TARGET_DIR="$(realpath "$TARGET_DIR")"
if [[ ! -f "$TARGET_DIR/package.json" || ! -f "$TARGET_DIR/src/components/DSOModal.jsx" ]]; then
  echo "ERROR: This does not look like the active CircuitWeb client folder: $TARGET_DIR"
  exit 1
fi
if [[ ! -f "$TARGET_DIR/src/components/SandboxUI.jsx" || ! -f "$TARGET_DIR/src/components/GuidedLabUI.jsx" || ! -f "$TARGET_DIR/src/components/CircuitIcons.jsx" ]]; then
  echo "ERROR: Required CircuitWeb UI files are missing. No files were changed."
  exit 1
fi
if ! grep -q "DSOModal" "$TARGET_DIR/src/components/SandboxUI.jsx" || ! grep -q "DSOModal" "$TARGET_DIR/src/components/GuidedLabUI.jsx"; then
  echo "ERROR: The active Sandbox/Guided Lab views do not both reference DSOModal. No files were changed."
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$TARGET_DIR/backups/circuitweb-stage3-$STAMP"
mkdir -p "$BACKUP_DIR/src/components" "$BACKUP_DIR/src/electrical" "$BACKUP_DIR/tests"
cp "$TARGET_DIR/src/components/DSOModal.jsx" "$BACKUP_DIR/src/components/DSOModal.jsx"
if [[ -f "$TARGET_DIR/src/electrical/simulationEngine.js" ]]; then
  cp "$TARGET_DIR/src/electrical/simulationEngine.js" "$BACKUP_DIR/src/electrical/simulationEngine.js"
fi

mkdir -p "$TARGET_DIR/src/electrical" "$TARGET_DIR/tests"
cp "$SCRIPT_DIR/src/components/DSOModal.jsx" "$TARGET_DIR/src/components/DSOModal.jsx"
cp "$SCRIPT_DIR/src/electrical/simulationEngine.js" "$TARGET_DIR/src/electrical/simulationEngine.js"
cp "$SCRIPT_DIR/tests/simulation-engine.test.mjs" "$TARGET_DIR/tests/simulation-engine.test.mjs"

printf '\nStage 3 installed into: %s\n' "$TARGET_DIR"
printf 'Backup created at: %s\n' "$BACKUP_DIR"
printf '\nNo existing circuits, localStorage keys, Guided Lab templates, or EduLabX portal files were removed.\n'
printf 'Sandbox and Guided Lab both continue to use the same DSOModal, now backed by the shared transient engine.\n'
