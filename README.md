# Special Digital Things

Prototype mobile-first untuk menguji tiga konsep interactive digital gift dalam satu React application. Repository saat ini baru menyelesaikan Milestone 1: project foundation dan quality harness.

## Prasyarat

- Node.js versi modern yang kompatibel dengan versi Vite pada `package.json`.
- npm.

## Setup

```bash
npm install
```

Untuk memasang browser Chromium yang dibutuhkan smoke test:

```bash
npx playwright install chromium
```

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test:unit
npm run test:unit:watch
npm run build
npm run test:e2e -- --project=chromium
npm run preview
```

## Routes

- `/` — daftar semantic link menuju route tema.
- `/heart-repair` — placeholder Tiny Heart Repair Shop.
- `/lost-and-found` — placeholder The Things You Left With Me.
- `/midnight-radio` — placeholder 11:11 Midnight Radio.
- Route lain — halaman Not Found.

## Struktur utama

- `src/app` — application shell, router, dan typed theme registry.
- `src/pages` — home, placeholder, dan Not Found.
- `src/shared` — utilitas global yang sudah mempunyai kebutuhan nyata.
- `src/styles` — reset, tokens, dan global styles.
- `tests/e2e` — Playwright smoke tests.
- `docs/PROJECT_PLAN.md` — scope dan milestone project.

Milestone ini sengaja belum berisi final gallery, pengalaman tema, state machine, ilustrasi, atau audio.
