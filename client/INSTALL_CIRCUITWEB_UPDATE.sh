#!/usr/bin/env bash
set -euo pipefail

PROJECT="${CIRCUITWEB_PROJECT:-$HOME/circuitweb-clone}"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$PROJECT/client/src/components"
STAMP="$(date +%Y%m%d_%H%M%S)"

if [[ ! -d "$PROJECT/client" ]]; then
  echo "ERROR: CircuitWeb client folder not found: $PROJECT/client"
  echo "Set CIRCUITWEB_PROJECT to your project root if it is elsewhere."
  exit 1
fi

mkdir -p "$TARGET"
for file in SandboxUI.jsx DSOModal.jsx; do
  if [[ ! -f "$SOURCE_DIR/client/src/components/$file" ]]; then
    echo "ERROR: Patch file missing: $SOURCE_DIR/client/src/components/$file"
    exit 1
  fi
done

for file in SandboxUI.jsx DSOModal.jsx; do
  if [[ -f "$TARGET/$file" ]]; then
    cp -a "$TARGET/$file" "$TARGET/$file.backup_$STAMP"
    echo "Backup: $TARGET/$file.backup_$STAMP"
  fi
  install -m 0644 "$SOURCE_DIR/client/src/components/$file" "$TARGET/$file"
  echo "Updated: $TARGET/$file"
done

echo
echo "Patch installed. Start CircuitWeb with:"
echo "  cd \"$PROJECT/client\""
echo "  pnpm dev -- --host 0.0.0.0"
