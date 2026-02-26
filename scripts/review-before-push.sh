#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BASE_REF="${NX_BASE_REF:-origin/main}"
HEAD_REF="${NX_HEAD_REF:-HEAD}"

if ! git rev-parse --verify --quiet "$BASE_REF" >/dev/null; then
  BASE_REF="$(git rev-list --max-parents=0 HEAD | tail -n 1)"
fi

echo "==> Pre-push review"
echo "    base: ${BASE_REF}"
echo "    head: ${HEAD_REF}"

echo "==> 1/6 Format check (affected)"
pnpm nx format:check --base="$BASE_REF" --head="$HEAD_REF"

echo "==> 2/6 Lint (affected)"
pnpm nx affected --target=lint --base="$BASE_REF" --head="$HEAD_REF" --parallel=3

echo "==> 3/6 Typecheck (affected)"
pnpm nx affected --target=typecheck --base="$BASE_REF" --head="$HEAD_REF" --parallel=3

echo "==> 4/6 Test (affected)"
pnpm nx affected --target=test --base="$BASE_REF" --head="$HEAD_REF" --parallel=3

echo "==> 5/6 Build (affected)"
pnpm nx affected --target=build --base="$BASE_REF" --head="$HEAD_REF" --parallel=3

echo "==> 6/6 Bundle budget"
pnpm budget:check

echo "==> Git whitespace check"
git diff --check

echo "Pre-push review passed."
