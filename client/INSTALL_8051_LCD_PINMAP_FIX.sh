#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT="${1:-$HOME/circuitweb-clone/client}"
TARGET="$PROJECT/src/components/CircuitIcons.jsx"

if [[ ! -f "$TARGET" ]]; then
  echo "ERROR: CircuitWeb source not found: $TARGET"
  echo "Usage: $0 [path-to-circuitweb-client]"
  exit 1
fi
if [[ ! -f "$SOURCE_DIR/client/src/components/CircuitIcons.jsx" ]]; then
  echo "ERROR: Patch source is incomplete."
  exit 1
fi

STAMP="$(date +%Y%m%d_%H%M%S)"
cp -a "$TARGET" "$TARGET.backup_8051lcd_pinmap_$STAMP"
cp -a "$SOURCE_DIR/client/src/components/CircuitIcons.jsx" "$TARGET"

echo "8051/LCD pin-map patch installed."
echo "Backup: $TARGET.backup_8051lcd_pinmap_$STAMP"
echo "Next: cd \"$PROJECT\" && pnpm run build"
