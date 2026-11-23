#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-$HOME/circuitweb-clone/client}"
PATCH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ ! -f "$TARGET/src/components/SandboxUI.jsx" || ! -f "$TARGET/src/components/CircuitIcons.jsx" ]]; then
  echo "ERROR: Cannot find CircuitWeb source files under $TARGET/src/components"; exit 1
fi
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$TARGET/backups/circuitweb-pin-details-$STAMP/src/components"
mkdir -p "$BACKUP"
cp "$TARGET/src/components/SandboxUI.jsx" "$BACKUP/SandboxUI.jsx"
cp "$TARGET/src/components/CircuitIcons.jsx" "$BACKUP/CircuitIcons.jsx"
cp "$PATCH_DIR/src/components/SandboxUI.jsx" "$TARGET/src/components/SandboxUI.jsx"
cp "$PATCH_DIR/src/components/CircuitIcons.jsx" "$TARGET/src/components/CircuitIcons.jsx"
echo "Installed physical component view and pin tooltips."
echo "Backup saved at: $TARGET/backups/circuitweb-pin-details-$STAMP"
