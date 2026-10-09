#!/usr/bin/env bash
# PostToolUse (Edit|Write): format file yang baru ditulis + pemeriksaan cepat.
# TS/JS/CSS/MD: prettier (hanya bila app punya config prettier) + eslint (hanya bila app punya eslint.config.js).
# Go: gofmt -w + go vet untuk paket file itu.
# Selalu exit 0 — hook ini tidak boleh menghentikan Claude.
set -u

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
INPUT="$(cat)"

if command -v jq >/dev/null 2>&1; then
  FILE="$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)"
else
  FILE="$(printf '%s' "$INPUT" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{process.stdout.write(JSON.parse(d).tool_input?.file_path||"")}catch{}})' 2>/dev/null)"
fi

[ -z "${FILE:-}" ] && exit 0
[ -f "$FILE" ] || exit 0
case "$FILE" in "$ROOT"/*) ;; *) exit 0 ;; esac
case "$FILE" in */node_modules/*|*/dist/*|*/coverage/*|*/graphify-out/*|"$ROOT"/.claude/*) exit 0 ;; esac

BIN="$ROOT/node_modules/.bin"

# Direktori paket terdekat (berisi package.json atau go.mod) untuk file ini
pkg_dir() {
  local d
  d="$(dirname "$1")"
  while [ "$d" != "$ROOT" ] && [ "$d" != "/" ]; do
    { [ -f "$d/package.json" ] || [ -f "$d/go.mod" ]; } && { echo "$d"; return; }
    d="$(dirname "$d")"
  done
  echo "$ROOT"
}

run_prettier() {
  [ -x "$BIN/prettier" ] || return 0
  # Hanya format bila ada config prettier yang berlaku untuk file ini (app lama tanpa config tidak diformat ulang)
  "$BIN/prettier" --find-config-path "$FILE" >/dev/null 2>&1 || return 0
  # --ignore-path root supaya apps/goodiebox, services/, .claude/ tetap dikecualikan
  (cd "$ROOT" && "$BIN/prettier" --ignore-path "$ROOT/.prettierignore" --log-level warn --write "$FILE" >/dev/null 2>&1)
}

case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs)
    run_prettier
    DIR="$(pkg_dir "$FILE")"
    if [ -x "$BIN/eslint" ] && [ -f "$DIR/eslint.config.js" ]; then
      OUT="$(cd "$DIR" && "$BIN/eslint" --no-warn-ignored "$FILE" 2>&1)" || echo "[format.sh] eslint: $OUT" >&2
    fi
    ;;
  *.css|*.json|*.md|*.yml|*.yaml|*.html)
    run_prettier
    ;;
  *.go)
    command -v gofmt >/dev/null 2>&1 && gofmt -w "$FILE" 2>/dev/null
    DIR="$(pkg_dir "$FILE")"
    if command -v go >/dev/null 2>&1 && [ -f "$DIR/go.mod" ]; then
      REL="./$(dirname "${FILE#"$DIR"/}")"
      OUT="$(cd "$DIR" && go vet "$REL" 2>&1)" || echo "[format.sh] go vet: $OUT" >&2
    fi
    ;;
esac

exit 0
