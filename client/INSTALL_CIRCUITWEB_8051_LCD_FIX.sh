#!/usr/bin/env bash
set -euo pipefail

PROJECT="${CIRCUITWEB_DIR:-$HOME/circuitweb-clone}"
TARGET="$PROJECT/client/src/electrical/mcu8051Lcd.js"
SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/client/src/electrical/mcu8051Lcd.js"

if [[ ! -d "$PROJECT/client/src" ]]; then
  echo "ERROR: CircuitWeb client source not found at: $PROJECT/client/src"
  echo "Set CIRCUITWEB_DIR if your project is in a different folder."
  exit 1
fi

if [[ ! -f "$SOURCE" ]]; then
  echo "ERROR: Repair source file is missing: $SOURCE"
  exit 1
fi

mkdir -p "$(dirname "$TARGET")"
if [[ -f "$TARGET" ]]; then
  BACKUP="$TARGET.backup_8051lcd_$(date +%Y%m%d_%H%M%S)"
  cp -a "$TARGET" "$BACKUP"
  echo "Backup created: $BACKUP"
fi

install -m 0644 "$SOURCE" "$TARGET"
echo "Updated: $TARGET"
echo
echo "Next, restart CircuitWeb:"
echo "  cd \"$PROJECT/client\""
echo "  pnpm dev -- --host 0.0.0.0"
