#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-$HOME/circuitweb-clone/client}"
PATCH_DIR="$(cd "$(dirname "$0")" && pwd)"
[[ -f "$TARGET/package.json" && -f "$TARGET/Canvas.jsx" ]] || { echo "CircuitWeb root not found: $TARGET"; exit 1; }
STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP="$TARGET/.edulabx-stage1-backup-$STAMP"
mkdir -p "$BACKUP"
for f in Canvas.jsx store.js Sidebar.jsx TopBar.jsx App.jsx components/pins.js components/index.jsx; do
  if [[ -f "$TARGET/$f" ]]; then mkdir -p "$BACKUP/$(dirname "$f")"; cp -a "$TARGET/$f" "$BACKUP/$f"; fi
done
mkdir -p "$TARGET/electrical" "$TARGET/components"
cp "$PATCH_DIR/electrical/"*.js "$TARGET/electrical/"
cp "$PATCH_DIR/components/"*.jsx "$TARGET/components/"
cp "$PATCH_DIR/components/pinLibrary.js" "$TARGET/components/pinLibrary.js"
cp "$PATCH_DIR/Scene3DView.jsx" "$TARGET/Scene3DView.jsx"
python3 "$PATCH_DIR/apply_patch.py" "$TARGET"
cp "$PATCH_DIR/CIRCUITWEB_STAGE1_README.md" "$TARGET/"
echo "Stage 1 applied. Backup: $BACKUP"
echo "Next: cd '$TARGET' && pnpm build"
