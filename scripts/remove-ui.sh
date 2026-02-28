#!/usr/bin/env bash
# ─────────────────────────────────────────────────
# remove-ui.sh — Remove UI Kit components added by shadcn/add-ui
#
# Usage:
#   ./scripts/remove-ui.sh calendar            # single
#   ./scripts/remove-ui.sh calendar accordion  # multiple
#
# What it does:
#   1. Removes component source file from libs/ui-kit/src/components
#   2. Removes matching export lines from libs/ui-kit/src/index.ts
#   3. Removes generated .d.ts/.d.ts.map (if present)
# ─────────────────────────────────────────────────
set -euo pipefail

COMPONENTS_DIR="libs/ui-kit/src/components"
BARREL="libs/ui-kit/src/index.ts"

if [ $# -eq 0 ]; then
  echo "❌ Usage: ./scripts/remove-ui.sh <component-name> [component-name ...]"
  echo ""
  echo "Examples:"
  echo "  ./scripts/remove-ui.sh calendar"
  echo "  ./scripts/remove-ui.sh calendar accordion"
  exit 1
fi

if [ ! -d "$COMPONENTS_DIR" ]; then
  echo "❌ Components directory not found: $COMPONENTS_DIR"
  exit 1
fi

if [ ! -f "$BARREL" ]; then
  echo "❌ Barrel file not found: $BARREL"
  exit 1
fi

echo "🧹 Removing UI components: $*"
echo ""

removed_count=0
not_found=()

remove_export_lines() {
  local stem="$1"
  node - "$BARREL" "$stem" <<'NODE'
const fs = require('node:fs');

const [filePath, stem] = process.argv.slice(2);
if (!filePath || !stem || !fs.existsSync(filePath)) process.exit(0);

let source = fs.readFileSync(filePath, 'utf8');
const lines = source.split('\n');
const targetA = `from './components/${stem}'`;
const targetB = `from "./components/${stem}"`;

const out = [];
let i = 0;

while (i < lines.length) {
  const line = lines[i];
  const trimmed = line.trimStart();

  if (!trimmed.startsWith('export')) {
    out.push(line);
    i += 1;
    continue;
  }

  const statement = [line];
  i += 1;

  while (i < lines.length && !statement[statement.length - 1].includes(';')) {
    statement.push(lines[i]);
    i += 1;
  }

  const joined = statement.join('\n');
  const shouldRemove = joined.includes(targetA) || joined.includes(targetB);
  if (!shouldRemove) {
    out.push(...statement);
  }
}

const normalized = out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
fs.writeFileSync(filePath, normalized);
NODE
}

for input in "$@"; do
  name="${input%.tsx}"
  name="${name%.ts}"

  matched_file="$(find "$COMPONENTS_DIR" -maxdepth 1 -type f \( -name "$name.tsx" -o -name "$name.ts" -o -iname "$name.tsx" -o -iname "$name.ts" \) | head -n 1)"

  if [ -z "$matched_file" ]; then
    not_found+=("$input")
    continue
  fi

  basename_file="$(basename "$matched_file")"
  stem="${basename_file%.*}"

  echo "🗑  Removing $basename_file"
  rm -f "$matched_file"
  rm -f "$COMPONENTS_DIR/$stem.d.ts" "$COMPONENTS_DIR/$stem.d.ts.map"

  remove_export_lines "$stem"
  removed_count=$((removed_count + 1))
done

echo ""
if [ "$removed_count" -eq 0 ]; then
  echo "⚠️  No component removed."
  if [ "${#not_found[@]}" -gt 0 ]; then
    printf "Not found: %s\n" "${not_found[*]}"
  fi
  exit 1
fi

echo "✅ Removed $removed_count component(s)."
if [ "${#not_found[@]}" -gt 0 ]; then
  printf "⚠️  Not found (skipped): %s\n" "${not_found[*]}"
fi

echo ""
echo "Next:"
echo "  1) Run: pnpm typecheck"
echo "  2) (Optional) remove docs page mapping if you had custom docs for that component"
