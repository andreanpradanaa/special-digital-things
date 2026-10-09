# goodiebox-v2

Frontend untuk [goodiebox-server](../goodiebox-server): gift box builder dengan **3D preview** (React Three.js) + **Midtrans Snap** payment gateway. Ditulis di **React + Vite + TypeScript**.

## Demo

- **Builder**: Customize nama, mood, pesan, warna box, item-item hadiah
- **3D Preview**: Real-time render gift box dengan Three.js
- **Payment**: Midtrans Snap popup untuk QRIS, e-wallet, kartu kredit
- **Gift Link**: Public share link `goodiebox.com/gift/{slug}` untuk penerima buka hadiah

---

## Setup Development

### Prerequisites

- Node.js 18+ (check: `node --version`)
- npm atau pnpm

### Install & Run

```bash
cd goodiebox-v2
npm install

# Development server di localhost:5173
npm run dev
```

Buka browser: `http://localhost:5173`

### Environment Variables

Create `.env.development`:

```
VITE_API_BASE_URL=http://localhost:8080
VITE_MIDTRANS_SNAP_JS_URL=https://app.sandbox.midtrans.com/snap/snap.js
```

| Variable | Default | Usage |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API endpoint |
| `VITE_MIDTRANS_SNAP_JS_URL` | (Midtrans sandbox/prod snap.js) | Payment popup script |

Build akan auto-pick `.env.production` saat `npm run build`.

---

## Build & Deployment

### Build Static Files

```bash
npm run build
```

Output → `dist/` (static HTML + JS + assets)

Hasilnya siap di-serve dengan Nginx atau static host.

### Deploy via SCP (Manual)

Transfer static files ke VPS Nginx:

```bash
# Build dulu
npm run build

# SCP ke VPS
scp -r dist/* deploy@202.155.16.133:/tmp/goodiebox-v2-dist/

# Di VPS, install & reload nginx
ssh deploy@202.155.16.133  # login hanya dengan SSH key, tanpa password
sudo cp -r /tmp/goodiebox-v2-dist/* /var/www/goodiebox-v2/
sudo systemctl reload nginx
```

### Deploy via GitHub Actions

Jika backend sudah setup GitHub Actions, frontend bisa di-trigger juga:

Push ke `main` → GitHub Actions build & deploy otomatis (jika workflow ada).

---

## Running Locally

### Development Server

```bash
npm run dev
```

Vite HMR (hot reload) aktif otomatis. Ubah code → browser refresh instant.

### Production Preview

```bash
npm run build
npm run preview
```

Preview `dist/` secara lokal di server statis (test sebelum deploy).

### Testing

```bash
npm run test
```

Vitest untuk unit tests (jika ada test files di `src/`).

---

## Project Structure

```
src/
  ├── App.tsx              main app + checkout flow
  ├── api.ts               backend client (fetch orders, create order)
  ├── goodiebox/
  │   ├── types.ts         builder state types
  │   ├── Builder.tsx      gift box customizer (nama, mood, items, warna)
  │   ├── GiftBox3D.tsx    three.js 3D preview component
  │   └── ...other components
  ├── midtransSnap.ts      Midtrans Snap popup wrapper
  ├── main.tsx             React root
  └── style.css            global styles

public/
  └── ...static assets (images, icons)

dist/                       (generated after npm run build)
  └── ...static output

index.html                 entry HTML template
vite.config.ts            Vite configuration
tsconfig.json             TypeScript config
package.json              dependencies
```

---

## Environment & Configuration

### Change Backend API URL

Edit `.env.development` (dev) atau `.env.production` (build):

```
VITE_API_BASE_URL=https://api.specialdigitalthings.com
```

Rebuild & deploy saat URL berubah.

### Change Midtrans Environment

Sandbox (testing):
```
VITE_MIDTRANS_SNAP_JS_URL=https://app.sandbox.midtrans.com/snap/snap.js
```

Production (live):
```
VITE_MIDTRANS_SNAP_JS_URL=https://app.midtrans.com/snap/snap.js
```

Backend juga harus set `MIDTRANS_IS_PRODUCTION=true` saat production.

---

## Logs & Debugging

### Browser Console

Open DevTools (`F12`) → **Console** tab:
- API errors (`404`, `403`, `500`)
- Midtrans Snap load issues
- TypeScript/React warnings

### Network Tab

**Network** → Filter `Fetch/XHR`:
- `POST /v1/orders` — create order request
- Check response untuk `snap_token` & `snap_redirect_url`

### Check Backend Connectivity

```bash
# Test backend alive
curl https://api.specialdigitalthings.com/healthz

# Test create order endpoint
curl -X POST https://api.specialdigitalthings.com/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"test":true}'
```

---

## Troubleshooting

### "Tidak bisa terhubung ke server"

1. Verify `VITE_API_BASE_URL` di `.env`
2. Check backend running: `curl $VITE_API_BASE_URL/healthz`
3. Check CORS: backend `ALLOWED_ORIGINS` harus include frontend domain

### "crypto.randomUUID is not a function"

Fixed in v0.0.0+, uses `uuid` library. Rebuild: `npm run build`.

### Snap Popup Tidak Muncul

1. Check `VITE_MIDTRANS_SNAP_JS_URL` correct (sandbox vs production)
2. Browser console → check Snap load error
3. Check backend return valid `snap_token`

### Build Size Large

1. Check `dist/assets/index-*.js` size: `du -sh dist/assets/`
2. Optimize: lazy-load 3D components, tree-shake unused Three.js code
3. Use `npm run build -- --minify=terser` untuk aggressive minification

---

## Deployment Checklist

Before deploy ke production:

- [ ] Test locally: `npm run dev` checkout flow end-to-end
- [ ] Build: `npm run build` tanpa error
- [ ] Set `.env.production` dengan production API URL
- [ ] Verify backend `ALLOWED_ORIGINS` include frontend domain
- [ ] Set Midtrans to production (backend + frontend)
- [ ] Test payment flow di Midtrans sandbox dulu
- [ ] Monitor browser console setelah deploy: lihat ada CORS/network error

---

## Monitoring & Updates

### Check Live Site

```bash
curl https://specialdigitalthings.com/  # should return HTML

curl https://specialdigitalthings.com/assets/index-*.js  # check file size
```

### Clear Browser Cache

User perlu hard-refresh saat deploy baru:
- Chrome/Edge: `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)
- Firefox: `Ctrl+F5` atau `Cmd+Shift+R`

### Update Only Frontend

Jika backend stable, bisa update hanya frontend:

```bash
npm run build
scp -r dist/* deploy@202.155.16.133:/tmp/goodiebox-v2-dist/
ssh deploy@202.155.16.133 "sudo cp -r /tmp/goodiebox-v2-dist/* /var/www/goodiebox-v2/ && sudo systemctl reload nginx"
```

---

## Performance Tips

1. **Lazy-load 3D component** — GiftBox3D hanya render saat builder page
2. **Image optimization** — compress background PNGs sebelum deploy
3. **Tree-shake Three.js** — import hanya yang dipakai (material, geometry, dll)
4. **CSS modules** — scope styles agar tidak conflict

---

## Stack & Tools

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3+ | UI framework |
| Vite | 6+ | Build tool (fast, modern) |
| Three.js | 0.171+ | 3D rendering |
| TypeScript | 5.7+ | Type safety |
| Midtrans | Snap API | Payment gateway |

---

## Resources

- [Backend API docs](../goodiebox-server/README.md#api)
- [Midtrans Snap integration](../goodiebox-server/README.md#menguji-pembayaran-di-sandbox-asli)
- [Three.js docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Vite docs](https://vitejs.dev/)
