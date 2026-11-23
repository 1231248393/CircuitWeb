#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-$HOME/circuitweb-clone/client}"
PATCH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -f "$TARGET/src/components/SandboxUI.jsx" || ! -f "$TARGET/src/components/CircuitIcons.jsx" ]]; then
  echo "ERROR: This does not look like the active CircuitWeb client:"
  echo "  $TARGET"
  echo "Expected src/components/SandboxUI.jsx and src/components/CircuitIcons.jsx."
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$TARGET/backups/circuitweb-active-renderer-$STAMP"
mkdir -p "$BACKUP/src/components" "$BACKUP/src/electrical"

cp "$TARGET/src/components/SandboxUI.jsx" "$BACKUP/src/components/SandboxUI.jsx"
cp "$TARGET/src/components/CircuitIcons.jsx" "$BACKUP/src/components/CircuitIcons.jsx"
if [[ -f "$TARGET/src/electrical/netlist.js" ]]; then
  cp "$TARGET/src/electrical/netlist.js" "$BACKUP/src/electrical/netlist.js"
fi

mkdir -p "$TARGET/src/electrical"
cp "$PATCH_DIR/src/components/SandboxUI.jsx" "$TARGET/src/components/SandboxUI.jsx"
cp "$PATCH_DIR/src/components/CircuitIcons.jsx" "$TARGET/src/components/CircuitIcons.jsx"
cp "$PATCH_DIR/src/electrical/netlist.js" "$TARGET/src/electrical/netlist.js"

echo
echo "CircuitWeb active-renderer patch installed."
echo "Backup saved at: $BACKUP"
echo "No package files, EduLabX files, saved localStorage projects, or other project folders were changed."
echo
echo "Next:"
echo "  cd \"$TARGET\""
echo "  pnpm build"
