#!/usr/bin/env bash
# ─────────────────────────────────────────────────
# add-ui.sh — Install shadcn components into @synapse/ui-kit
#
# Usage:
#   ./scripts/add-ui.sh accordion          # single
#   ./scripts/add-ui.sh accordion tabs     # multiple
#
# What it does:
#   1. Runs `npx shadcn@latest add <components>`
#   2. Fixes internal imports (@/lib/utils → ../utils/cn)
#   3. Auto-adds export to libs/ui-kit/src/index.ts
#   4. Shows what was installed
# ─────────────────────────────────────────────────
set -euo pipefail

COMPONENTS_DIR="libs/ui-kit/src/components"
BARREL="libs/ui-kit/src/index.ts"

if [ $# -eq 0 ]; then
  echo "❌ Usage: ./scripts/add-ui.sh <component-name> [component-name ...]"
  echo ""
  echo "Examples:"
  echo "  ./scripts/add-ui.sh accordion"
  echo "  ./scripts/add-ui.sh accordion tabs dialog"
  echo ""
  echo "Available components:"
  npx shadcn@latest search shadcn 2>/dev/null || true
  exit 1
fi

echo "🚀 Installing shadcn components: $@"
echo ""

# Allow pnpm to install deps at workspace root
export npm_config_ignore_workspace_root_check=true

# Track existing files before install
BEFORE=$(ls "$COMPONENTS_DIR"/*.tsx 2>/dev/null | sort)

# 1. Run shadcn CLI (use --pm pnpm to avoid npm fallback)
npx shadcn@latest add "$@" --yes --overwrite

# Track new files after install
AFTER=$(ls "$COMPONENTS_DIR"/*.tsx 2>/dev/null | sort)

# Find newly added files
NEW_FILES=$(comm -13 <(echo "$BEFORE") <(echo "$AFTER"))

if [ -z "$NEW_FILES" ]; then
  echo ""
  echo "⚠️  No new component files detected."
  exit 0
fi

echo ""
echo "📁 New files detected:"
echo "$NEW_FILES"
echo ""

# 2. Fix imports in new files
for file in $NEW_FILES; do
  filename=$(basename "$file")
  echo "🔧 Fixing imports in $filename..."

  # Fix @/lib/utils → ../utils/cn
  sed -i '' 's|from "@/lib/utils"|from "../utils/cn"|g' "$file"
  sed -i '' "s|from '@/lib/utils'|from '../utils/cn'|g" "$file"

  # Fix @/components/XYZ → ./XYZ (same directory)
  sed -i '' 's|from "@/components/\([^"]*\)"|from "./\1"|g' "$file"
  sed -i '' "s|from '@/components/\([^']*\)'|from './\1'|g" "$file"

  # Fix @/hooks/XYZ → ../hooks/XYZ
  sed -i '' 's|from "@/hooks/\([^"]*\)"|from "../hooks/\1"|g' "$file"
  sed -i '' "s|from '@/hooks/\([^']*\)'|from '../hooks/\1'|g" "$file"
done

# 3. Auto-export from barrel (index.ts)
echo ""
for file in $NEW_FILES; do
  filename=$(basename "$file" .tsx)

  # Skip if already exported
  if grep -q "from './components/$filename'" "$BARREL" 2>/dev/null; then
    echo "⏭️  $filename already exported in index.ts"
    continue
  fi

  # Extract exports — handle both patterns:
  #   Pattern A: export function Foo / export const Bar
  #   Pattern B: export { Foo, Bar, Baz }
  EXPORTS=""

  # Pattern A: individual exports
  INDIVIDUAL=$(grep -E '^export (function|const|class) ' "$file" 2>/dev/null | sed -E 's/export (function|const|class) ([A-Za-z0-9_]+).*/\2/' | tr '\n' ', ' | sed 's/,$//' || true)

  # Pattern B: grouped exports (may span multiple lines)
  GROUPED=$(sed -n '/^export {/,/}/p' "$file" 2>/dev/null | tr '\n' ' ' | sed -E 's/export \{([^}]*)\}/\1/' | sed 's/,*$//' | xargs || true)

  # Combine
  if [ -n "$INDIVIDUAL" ] && [ -n "$GROUPED" ]; then
    EXPORTS="$INDIVIDUAL, $GROUPED"
  elif [ -n "$INDIVIDUAL" ]; then
    EXPORTS="$INDIVIDUAL"
  elif [ -n "$GROUPED" ]; then
    EXPORTS="$GROUPED"
  fi

  # Clean up trailing/leading commas and spaces
  EXPORTS=$(echo "$EXPORTS" | sed 's/^[, ]*//' | sed 's/[, ]*$//')

  if [ -n "$EXPORTS" ]; then
    echo "" >> "$BARREL"
    echo "export { $EXPORTS } from './components/$filename';" >> "$BARREL"
    echo "✅ Exported { $EXPORTS } from $filename"
  else
    echo "⚠️  No exports found in $filename — please add manually to index.ts"
  fi
done

echo ""
echo "─────────────────────────────────────────"
echo "✅ Done! Komponen sudah ter-install dan ter-export."
echo ""
echo "Import di MFE:"
for file in $NEW_FILES; do
  filename=$(basename "$file" .tsx)
  echo "  import { $filename } from '@synapse/ui-kit';"
done
echo ""
echo "Komponen akan otomatis muncul di sidebar UI Kit."
echo "─────────────────────────────────────────"
