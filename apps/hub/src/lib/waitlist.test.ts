import { afterEach, describe, expect, test, vi } from 'vitest'
import { isValidEmail, subscribe } from './waitlist'

describe('isValidEmail', () => {
  test('menerima email umum dan menolak yang rusak', () => {
    expect(isValidEmail('andrean@email.com')).toBe(true)
    expect(isValidEmail('  andrean@email.com ')).toBe(true)
    expect(isValidEmail('andrean@email')).toBe(false)
    expect(isValidEmail('bukan email')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
})

describe('subscribe', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  test('mode lokal: menyimpan ke localStorage bila VITE_WAITLIST_URL kosong', async () => {
    vi.stubEnv('VITE_WAITLIST_URL', '')
    await subscribe('a@b.co', 'midnight-radio')
    const stored = JSON.parse(localStorage.getItem('sdt-waitlist') ?? '[]') as { email: string; product: string }[]
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject({ email: 'a@b.co', product: 'midnight-radio' })
  })

  test('mode server: POST JSON ke VITE_WAITLIST_URL', async () => {
    vi.stubEnv('VITE_WAITLIST_URL', 'https://api.test/waitlist')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await subscribe('a@b.co', 'heart-repair')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/waitlist',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'a@b.co', product: 'heart-repair' }) }),
    )
    expect(localStorage.getItem('sdt-waitlist')).toBeNull()
  })

  test('mode server: melempar error bila respons tidak ok', async () => {
    vi.stubEnv('VITE_WAITLIST_URL', 'https://api.test/waitlist')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await expect(subscribe('a@b.co', 'x')).rejects.toThrow('500')
  })
})
