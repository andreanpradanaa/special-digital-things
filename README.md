# Special Digital Things

Prototype mobile-first untuk menguji koleksi interactive digital gift dalam satu React application.

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

- `/` — gallery koleksi interactive gift.
- `/secret-message-machine` — Secret Message Machine.
- `/unsaid-garden` — The Unsaid Garden.
- `/heart-repair` — Tiny Heart Repair Shop.
- `/lost-and-found` — The Things You Left With Me.
- `/midnight-radio` — 11:11 Midnight Radio.
- Route lain — halaman Not Found.

## Struktur utama

- `src/app` — application shell, router, dan typed theme registry.
- `src/pages` — gallery, lima experience route-scoped, dan Not Found.
- `src/shared` — utilitas global yang sudah mempunyai kebutuhan nyata.
- `src/styles` — reset, tokens, dan global styles.
- `tests/e2e` — Playwright smoke tests.
- `docs/PROJECT_PLAN.md` — scope dan milestone project.

Setiap experience memakai sample sender Andre dan recipient Gusti; seluruh visual dibuat dengan CSS/inline SVG original. Midnight Radio menyediakan ambience Web Audio optional yang default OFF.
