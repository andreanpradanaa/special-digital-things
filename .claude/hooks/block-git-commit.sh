#!/usr/bin/env bash
# PreToolUse (Bash): tolak `git commit` dan `git push` yang dijalankan Claude.
# exit 2 = blokir (pesan di stderr dibaca Claude); exit 0 = lolos.
set -u
exec node "$(dirname "$0")/block-git-commit.js"
