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

run_nx_with_sqlite_retry() {
  local output_file
  output_file="$(mktemp)"

  set +e
  "$@" 2>&1 | tee "$output_file"
  local exit_code=${PIPESTATUS[0]}
  set -e

  if [[ $exit_code -eq 0 ]]; then
    rm -f "$output_file"
    return 0
  fi

  if grep -Eiq 'DB transaction error|SqliteFailure|disk I/O error' "$output_file"; then
    echo "    Nx sqlite I/O issue detected. Retrying with NX_DAEMON=false ..."
    rm -f "$output_file"
    NX_DAEMON=false "$@"
    return $?
  fi

  rm -f "$output_file"
  return $exit_code
}

echo "==> 1/6 Format check (affected)"
run_nx_with_sqlite_retry pnpm nx format:check --base="$BASE_REF" --head="$HEAD_REF"

echo "==> 2/6 Lint (affected)"
run_nx_with_sqlite_retry pnpm nx affected --target=lint --base="$BASE_REF" --head="$HEAD_REF" --parallel=3

echo "==> 3/6 Typecheck (affected)"
run_nx_with_sqlite_retry pnpm nx affected --target=typecheck --base="$BASE_REF" --head="$HEAD_REF" --parallel=3

echo "==> 4/6 Test (affected)"
run_nx_with_sqlite_retry pnpm nx affected --target=test --base="$BASE_REF" --head="$HEAD_REF" --parallel=3

echo "==> 5/6 Build (affected)"
run_nx_with_sqlite_retry pnpm nx affected --target=build --base="$BASE_REF" --head="$HEAD_REF" --parallel=3

echo "==> 6/6 Bundle budget"
pnpm budget:check

echo "==> Git whitespace check"
git diff --check

echo "Pre-push review passed."
