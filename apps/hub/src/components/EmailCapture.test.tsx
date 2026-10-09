import { afterEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmailCapture } from './EmailCapture'

describe('EmailCapture', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  test('menolak email tidak valid tanpa mengirim', async () => {
    vi.stubEnv('VITE_WAITLIST_URL', '')
    render(<EmailCapture productSlug="midnight-radio" productName="Midnight Radio" />)

    await userEvent.type(screen.getByLabelText('Kabari saya kalau sudah siap'), 'bukan-email')
    await userEvent.click(screen.getByRole('button', { name: 'Kabari saya' }))

    expect(screen.getByText('Masukkan alamat email yang valid.')).toBeInTheDocument()
    expect(localStorage.getItem('sdt-waitlist')).toBeNull()
  })

  test('sukses: menampilkan konfirmasi dengan email dan nama produk', async () => {
    vi.stubEnv('VITE_WAITLIST_URL', '')
    render(<EmailCapture productSlug="midnight-radio" productName="Midnight Radio" />)

    await userEvent.type(screen.getByRole('textbox'), 'andrean@email.com')
    await userEvent.click(screen.getByRole('button', { name: 'Kabari saya' }))

    expect(await screen.findByRole('status')).toHaveTextContent('andrean@email.com')
    expect(screen.getByRole('status')).toHaveTextContent('Midnight Radio')
  })

  test('gagal: menampilkan pesan error dan tetap bisa dicoba lagi', async () => {
    vi.stubEnv('VITE_WAITLIST_URL', 'https://api.test/waitlist')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))
    render(<EmailCapture productSlug="x" productName="X" />)

    await userEvent.type(screen.getByRole('textbox'), 'a@b.co')
    await userEvent.click(screen.getByRole('button', { name: 'Kabari saya' }))

    expect(await screen.findByText('Belum berhasil. Coba lagi sebentar.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kabari saya' })).toBeEnabled()
  })

  test('versi compact memakai aria-label, tanpa label dan hint', () => {
    render(<EmailCapture productSlug="x" productName="X" compact />)
    expect(screen.getByLabelText('Email untuk kabar rilis X')).toBeInTheDocument()
    expect(screen.queryByText(/Tanpa spam/)).toBeNull()
  })
})
