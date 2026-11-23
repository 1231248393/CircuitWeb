#!/usr/bin/env bash
set -euo pipefail
PROJECT="$HOME/circuitweb-clone/client"
PATCH_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="$PROJECT/src/components"
STAMP="$(date +%Y%m%d_%H%M%S)"
if [[ ! -d "$TARGET" ]]; then
  echo "ERROR: Cannot find $TARGET"
  exit 1
fi
for f in SandboxUI.jsx CircuitIcons.jsx; do
  [[ -f "$TARGET/$f" ]] || { echo "ERROR: Missing target $TARGET/$f"; exit 1; }
  cp -a "$TARGET/$f" "$TARGET/$f.backup_8051components_$STAMP"
  cp "$PATCH_DIR/client/src/components/$f" "$TARGET/$f"
  echo "Updated: $TARGET/$f"
done
echo
echo "Patch installed. Restart Vite from the client folder:"
echo "cd \"$PROJECT\" && pnpm dev -- --host 0.0.0.0"
