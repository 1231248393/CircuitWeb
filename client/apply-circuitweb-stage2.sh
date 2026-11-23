#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-$HOME/circuitweb-clone/client}"
PATCH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for file in \
  "$TARGET/src/components/SandboxUI.jsx" \
  "$TARGET/src/components/CircuitIcons.jsx"; do
  if [[ ! -f "$file" ]]; then
    echo "ERROR: Missing expected active CircuitWeb file: $file"
    echo "No files were changed. Check the target path."
    exit 1
  fi
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$TARGET/backups/circuitweb-stage2-physical-scale-$STAMP"
mkdir -p "$BACKUP/src/components"
cp "$TARGET/src/components/SandboxUI.jsx" "$BACKUP/src/components/SandboxUI.jsx"
cp "$TARGET/src/components/CircuitIcons.jsx" "$BACKUP/src/components/CircuitIcons.jsx"
if [[ -f "$TARGET/src/components/physicalDimensions.js" ]]; then
  cp "$TARGET/src/components/physicalDimensions.js" "$BACKUP/src/components/physicalDimensions.js"
fi

cp "$PATCH_DIR/src/components/SandboxUI.jsx" "$TARGET/src/components/SandboxUI.jsx"
cp "$PATCH_DIR/src/components/CircuitIcons.jsx" "$TARGET/src/components/CircuitIcons.jsx"
cp "$PATCH_DIR/src/components/physicalDimensions.js" "$TARGET/src/components/physicalDimensions.js"

echo
echo "CircuitWeb Stage 2 physical-scale patch installed."
echo "Backup: $BACKUP"
echo "No package files, EduLabX portal files, saved browser circuits, or localStorage keys were changed."
echo
echo "Next:"
echo "  cd \"$TARGET\""
echo "  pnpm build"
echo "  pnpm dev -- --host 0.0.0.0"
