# Setup Claude Code — monorepo

Dipasang 2026-10-09 mengikuti panduan "Setup Claude Code untuk Proyek Baru" (varian fullstack). Sumber agent/rules/skills: [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) (salinan lokal `~/everything-claude-code`).

## `CLAUDE.md`

- `CLAUDE.md` root: peta monorepo, workflow, hemat token, git & secret, perintah.
- `apps/hub/CLAUDE.md`, `apps/goodiebox/CLAUDE.md`, `services/api/CLAUDE.md`: detail lokal; dibaca otomatis saat Claude bekerja di folder itu.

## `.claude/`

| Folder          | Isi                                                                                                                                                                                                                     | Asal                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `agents/`       | `react-reviewer`, `typescript-reviewer`, `react-build-resolver`, `a11y-architect`, `go-reviewer`, `go-build-resolver`, `database-reviewer`, `security-reviewer`                                                         | ECC, tanpa perubahan |
| `commands/`     | `react-test`, `react-build`, `react-review`, `go-test`, `go-build`, `go-review` (ECC) · `feature`, `figma-spec`, `ui-check`, `postman` (proyek)                                                                         | ECC + proyek         |
| `rules/`        | `common`, `typescript`, `react`, `web`, `golang` — frontmatter `paths:` dipertahankan sehingga aturan Go hanya aktif untuk `*.go`, aturan React untuk `*.tsx`                                                           | ECC                  |
| `skills/`       | `tdd-workflow`, `react-testing`, `react-patterns`, `frontend-patterns`, `frontend-a11y`, `vite-patterns`, `golang-patterns`, `golang-testing`, `api-design`, `backend-patterns`, `postgres-patterns`, `security-review` | ECC                  |
| `scripts/`      | `setup-package-manager.js` (dirujuk `tdd-workflow`)                                                                                                                                                                     | ECC                  |
| `hooks/`        | `format.sh` (PostToolUse Edit\|Write: prettier+eslint bila app punya config; gofmt+go vet untuk Go) · `block-git-commit.sh`+`.js` (PreToolUse Bash: tolak `git commit`/`git push`)                                      | proyek               |
| `settings.json` | allowlist perintah rutin (npm, go, graphify, git baca), deny commit/push dan baca `.env*`                                                                                                                               | proyek               |
| `launch.json`   | preview `hub` (5173) dan `goodiebox` (5174)                                                                                                                                                                             | proyek               |

Sengaja **tidak** diambil: hooks/scripts ECC lain, agent/rules bahasa lain, command epic/orch/prp.

## Cara kerja harian

1. Dari desain: `/figma-spec <node atau screen> <fitur>` → review spec → `/feature <fitur>`.
2. Bug: deskripsikan saja; Claude mengikuti alur `/feature` (test reproduksi dulu).
3. Tampilan berubah: `/ui-check <app> <rute>`. Endpoint berubah: `/postman`.
4. Fullstack: API dulu, lalu frontend dengan kontrak yang sama.
5. Commit manual memakai pesan yang diusulkan (scope = app).

## Memperbarui komponen ECC

`git pull` di `~/everything-claude-code`, lalu minta Claude membandingkan `.claude/{agents,rules,skills}` dan command `react-*`/`go-*` dengan versi terbaru dan menerapkan hanya file yang belum disesuaikan.
