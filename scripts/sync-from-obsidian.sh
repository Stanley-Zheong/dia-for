#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."
node scripts/sync-obsidian-content.mjs "$@"
