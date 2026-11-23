#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_CLIENT="${1:-$HOME/circuitweb-clone/client}"
STAMP="$(date +%Y%m%d_%H%M%S)"

if [[ ! -d "$PROJECT_CLIENT/src/components" ]]; then
  echo "ERROR: Cannot find CircuitWeb client at: $PROJECT_CLIENT"
  echo "Usage: ./INSTALL_CIRCUITWEB_DSO_SYNC_FIX.sh [path-to-circuitweb/client]"
  exit 1
fi

for file in SandboxUI.jsx DSOModal.jsx; do
  if [[ ! -f "$SOURCE_DIR/src/components/$file" ]]; then
    echo "ERROR: Patch source missing: $SOURCE_DIR/src/components/$file"
    exit 1
  fi
done

for file in SandboxUI.jsx DSOModal.jsx; do
  target="$PROJECT_CLIENT/src/components/$file"
  cp -a "$target" "$target.backup_dso_sync_$STAMP"
  cp "$SOURCE_DIR/src/components/$file" "$target"
  echo "Updated: $target"
  echo "Backup:  $target.backup_dso_sync_$STAMP"
done

echo
echo "DSO live-simulation synchronization patch installed."
echo "Run: cd \"$PROJECT_CLIENT\" && pnpm dev -- --host 0.0.0.0"
echo "NOTE: This patch does not add an 8051 CPU/C51 compiler or firmware execution."
