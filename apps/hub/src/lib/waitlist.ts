const STORAGE_KEY = 'sdt-waitlist'

/**
 * Daftar "Kabari saya" untuk produk yang belum rilis.
 * Kalau VITE_WAITLIST_URL belum diisi, data disimpan di localStorage
 * supaya alur UI tetap bisa dicoba tanpa backend.
 */
export async function subscribe(email: string, productSlug: string): Promise<void> {
  const url = import.meta.env.VITE_WAITLIST_URL
  if (!url) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown[]
    list.push({ email, product: productSlug, at: new Date().toISOString() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, product: productSlug }),
  })
  if (!res.ok) throw new Error(`Gagal mendaftar (${res.status})`)
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
