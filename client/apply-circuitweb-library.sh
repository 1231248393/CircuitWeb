#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-$HOME/circuitweb-clone/client}"
PATCH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ ! -d "$TARGET/src/components" ]]; then
  echo "ERROR: Cannot find $TARGET/src/components"
  echo "Usage: ./apply-circuitweb-library.sh /path/to/circuitweb-clone/client"
  exit 1
fi
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$TARGET/backups/circuitweb-library-$STAMP/src/components"
cp "$TARGET/src/components/SandboxUI.jsx" "$TARGET/backups/circuitweb-library-$STAMP/src/components/SandboxUI.jsx"
cp "$TARGET/src/components/CircuitIcons.jsx" "$TARGET/backups/circuitweb-library-$STAMP/src/components/CircuitIcons.jsx"
cp "$PATCH_DIR/src/components/SandboxUI.jsx" "$TARGET/src/components/SandboxUI.jsx"
cp "$PATCH_DIR/src/components/CircuitIcons.jsx" "$TARGET/src/components/CircuitIcons.jsx"
echo "CircuitWeb component-library update installed."
echo "Backup: $TARGET/backups/circuitweb-library-$STAMP"
echo "Next: cd '$TARGET' && pnpm build"
