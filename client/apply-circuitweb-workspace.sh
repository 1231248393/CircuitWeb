#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-$HOME/circuitweb-clone/client}"
PATCH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
for f in src/components/SandboxUI.jsx src/components/CircuitIcons.jsx; do
  [[ -f "$TARGET/$f" ]] || { echo "ERROR: Missing $TARGET/$f"; exit 1; }
done
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$TARGET/backups/circuitweb-workspace-$STAMP"
mkdir -p "$BACKUP/src/components"
cp "$TARGET/src/components/SandboxUI.jsx" "$BACKUP/src/components/SandboxUI.jsx"
cp "$TARGET/src/components/CircuitIcons.jsx" "$BACKUP/src/components/CircuitIcons.jsx"
cp "$PATCH_DIR/src/components/SandboxUI.jsx" "$TARGET/src/components/SandboxUI.jsx"
cp "$PATCH_DIR/src/components/CircuitIcons.jsx" "$TARGET/src/components/CircuitIcons.jsx"
echo "CircuitWeb workspace patch installed."
echo "Backup: $BACKUP"
