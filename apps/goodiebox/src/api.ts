import { v4 as uuidv4 } from 'uuid'
import type { GiftItemData, GoodieBoxBuilderState } from './goodiebox/types'

// Tanpa trailing slash agar URL endpoint tidak menjadi //v1/...
// kalau env di platform deploy tidak sengaja diisi ber-slash.
export const API_BASE: string = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/+$/, '')

type OrderCustomer = { name?: string; email: string; phone?: string }

type CreateOrderBody = {
  recipientName: string
  senderName: string
  mood: string
  innerNote: string
  boxColor: string
  boxTheme?: string
  items: GiftItemData[]
  customer: OrderCustomer
}

export type OrderCreateResponse = {
  order_code: string
  public_slug: string
  status: string
  amount: number
  currency: string
  snap_token: string
  snap_redirect_url: string
  client_key: string
  is_production: boolean
}

export type OrderStatusResponse = {
  order_code: string
  public_slug: string
  status: string
  amount: number
  currency: string
  payment_status: string
  payment_type?: string
  paid_at?: string
}

// Status alur checkout di sisi UI (dipakai App + BuilderPanel).
export type CheckoutState =
  | { status: 'idle' }
  | { status: 'creating' }
  | { status: 'paying'; orderCode: string; slug: string }
  | { status: 'verifying' }
  | { status: 'success'; giftUrl: string }
  | { status: 'pending'; orderCode: string; slug: string }
  | { status: 'error'; message: string }

type ApiError = { code: number; message: string }

async function callApi<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, init)
  } catch {
    throw { code: 0, message: 'Tidak bisa terhubung ke server. Pastikan goodiebox-server berjalan.' } satisfies ApiError
  }
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw { code: response.status, message: body?.error?.message ?? `Permintaan gagal (${response.status})` } satisfies ApiError
  }
  return body as T
}

export function createOrder(builder: GoodieBoxBuilderState, customerEmail: string): Promise<OrderCreateResponse> {
  const body: CreateOrderBody = {
    recipientName: builder.recipientName,
    senderName: builder.senderName,
    mood: builder.mood,
    innerNote: builder.innerNote,
    boxColor: builder.boxColor,
    boxTheme: builder.boxTheme,
    items: builder.items,
    customer: { name: builder.senderName, email: customerEmail },
  }
  return callApi<OrderCreateResponse>('/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': uuidv4() },
    body: JSON.stringify(body),
  })
}

export function getOrderStatus(orderCode: string): Promise<OrderStatusResponse> {
  return callApi<OrderStatusResponse>(`/v1/orders/${encodeURIComponent(orderCode)}`)
}

// fetchGift mengambil isi box untuk halaman penerima; hanya aktif
// setelah order paid — server menolak dengan 403 GIFT_LOCKED.
export async function fetchGift(slug: string): Promise<GoodieBoxBuilderState> {
  const raw = await callApi<GoodieBoxBuilderState & { items?: GiftItemData[] }>(`/v1/gifts/${encodeURIComponent(slug)}`)
  return { ...raw, items: raw.items ?? [] }
}

type UploadResponse = { id: string; url: string }

// Upload asset (photo/video) ke backend. Mengembalikan URL untuk disimpan di order.
export async function uploadAsset(file: Blob, itemId: string, type: 'photo' | 'video'): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('itemId', itemId)
  formData.append('type', type)

  const response = await fetch(`${API_BASE}/v1/uploads`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw { code: response.status, message: body?.error?.message ?? `Upload gagal (${response.status})` }
  }

  const result = await response.json() as UploadResponse
  return result.url
}
