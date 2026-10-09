// Pembungkus tipis di atas Midtrans Snap (hosted payment page).
// snap.js dimuat dinamis agar URL & client key bisa datang dari respons
// order (sandbox vs production) atau env untuk keperluan dev/mock.
export const SNAP_JS_URL: string = import.meta.env.VITE_MIDTRANS_SNAP_JS_URL ?? 'https://app.sandbox.midtrans.com/snap/snap.js'

export type SnapCallbacks = {
  onSuccess?: (result: unknown) => void
  onPending?: (result: unknown) => void
  onError?: (result: unknown) => void
  onClose?: () => void
}

declare global {
  interface Window {
    snap?: { pay: (token: string, callbacks?: SnapCallbacks) => void }
  }
}

let snapScript: Promise<void> | null = null

function loadSnapJs(clientKey: string): Promise<void> {
  snapScript ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SNAP_JS_URL
    script.dataset.clientKey = clientKey
    script.onload = () => resolve()
    script.onerror = () => {
      snapScript = null
      reject(new Error('Gagal memuat Midtrans Snap. Periksa koneksi atau konfigurasi.'))
    }
    document.head.appendChild(script)
  })
  return snapScript
}

export async function payWithSnap(options: { token: string; clientKey: string } & SnapCallbacks): Promise<void> {
  await loadSnapJs(options.clientKey)
  if (!window.snap) throw new Error('Midtrans Snap tidak tersedia.')
  window.snap.pay(options.token, {
    onSuccess: options.onSuccess,
    onPending: options.onPending,
    onError: options.onError,
    onClose: options.onClose,
  })
}
