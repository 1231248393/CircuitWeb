#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-$HOME/circuitweb-clone/client}"
PATCH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
for f in package.json src/components/SandboxUI.jsx src/components/GuidedLabUI.jsx src/electrical/simulationEngine.js; do
  [[ -f "$TARGET/$f" ]] || { echo "ERROR: missing $TARGET/$f" >&2; exit 1; }
done
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$TARGET/.circuitweb-stage3.2-backup-$STAMP"
mkdir -p "$BACKUP/src/components"
cp -a "$TARGET/src/components/SandboxUI.jsx" "$BACKUP/src/components/"
cp -a "$TARGET/src/components/GuidedLabUI.jsx" "$BACKUP/src/components/"
cp -a "$PATCH_DIR/src/components/SandboxUI.jsx" "$TARGET/src/components/SandboxUI.jsx"
cp -a "$PATCH_DIR/src/components/GuidedLabUI.jsx" "$TARGET/src/components/GuidedLabUI.jsx"
echo "Stage 3.2 installed. Backup: $BACKUP"
echo "Next: cd $TARGET && pnpm build"
