import { describe, expect, test } from 'vitest'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAt, renderRoute } from '../test/render'
import { App } from '../App'
import { Footer, Header } from '../components/layout'
import { comingSoonProducts, liveProducts } from '../data/products'
import { letters, makerNote } from '../data/story'
import { HomePage } from './HomePage'
import { OccasionPage } from './OccasionPage'
import { ProductPage } from './ProductPage'

describe('HomePage', () => {
  test('menampilkan semua produk live dengan CTA keluar ke link produk', () => {
    renderAt('/', <HomePage />)
    for (const p of liveProducts) {
      const cta = screen.getAllByRole('link', { name: `Bikin ${p.name} sekarang` })
      expect(cta.length).toBeGreaterThan(0)
      expect(cta[0]).toHaveAttribute('href', p.href)
    }
  })

  test('coming-soon: 3 teaser dulu, sisanya muncul setelah "Lihat N lagi", tanpa tombol beli', async () => {
    renderAt('/', <HomePage />)
    const [first3, rest] = [comingSoonProducts.slice(0, 3), comingSoonProducts.slice(3)]
    for (const p of first3) expect(screen.getAllByRole('link', { name: p.name }).length).toBeGreaterThan(0)
    for (const p of rest) expect(screen.queryByRole('link', { name: p.name })).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: `Lihat ${rest.length} lagi` }))

    for (const p of comingSoonProducts) {
      expect(screen.getAllByRole('link', { name: p.name }).length).toBeGreaterThan(0)
      expect(screen.queryByRole('link', { name: new RegExp(`Bikin ${p.name}`) })).toBeNull()
    }
    expect(screen.queryByRole('button', { name: /lagi$/ })).toBeNull()
  })

  test('urutan coming-soon: produk ceria di depan', () => {
    expect(comingSoonProducts.map((p) => p.slug).slice(0, 3)).toEqual(['secret-trip-terminal', 'midnight-radio', 'secret-message-machine'])
  })

  test('sisi manusia: contoh isi kotak, cara kerja kamu/dia, dan catatan pembuat', () => {
    renderAt('/', <HomePage />)
    for (const l of letters) expect(screen.getByText(l.to)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dari kamu, sampai dia senyum' })).toBeInTheDocument()
    expect(screen.getAllByText('dia').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: makerNote.greeting })).toBeInTheDocument()
  })

  test('CTA melayang muncul setelah digulir dan sembunyi di atas', () => {
    renderAt('/', <HomePage />)
    const sticky = screen.getByTestId('sticky-cta')
    expect(sticky).toHaveAttribute('aria-hidden', 'true')
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 5000, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    })
    expect(sticky).toHaveAttribute('aria-hidden', 'false')
    expect(within(sticky).getByRole('link')).toHaveAttribute('href', liveProducts[0].href)
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    })
    expect(sticky).toHaveAttribute('aria-hidden', 'true')
  })

  test('filter momen mengarah ke landing per momen', () => {
    renderAt('/', <HomePage />)
    expect(screen.getByRole('link', { name: 'Ulang tahun' })).toHaveAttribute('href', '/untuk/ulang-tahun')
    expect(screen.getByRole('link', { name: 'Semua' })).toHaveAttribute('aria-current', 'page')
  })
})

describe('ProductPage', () => {
  test('produk live: harga, langkah, FAQ, dan CTA ke link produk', () => {
    renderRoute('/produk/:slug', '/produk/goodiebox', <ProductPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Goodiebox' })).toBeInTheDocument()
    expect(screen.getAllByText('Rp 20.000').length).toBeGreaterThan(0)
    expect(screen.getByText('Yang akan dia alami')).toBeInTheDocument()
    expect(screen.getByText('Pertanyaan umum')).toBeInTheDocument()
    const ctas = screen.getAllByRole('link', { name: 'Bikin Goodiebox sekarang' })
    expect(ctas.every((a) => a.getAttribute('href') === liveProducts[0].href)).toBe(true)
  })

  test('produk coming-soon: badge Segera dan form Kabari saya', () => {
    renderRoute('/produk/:slug', '/produk/midnight-radio', <ProductPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Midnight Radio' })).toBeInTheDocument()
    expect(screen.getByText('Segera')).toBeInTheDocument()
    expect(screen.getByLabelText('Kabari saya kalau sudah siap')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Bikin Midnight Radio/ })).toBeNull()
  })

  test('slug tidak dikenal: halaman tidak ditemukan', () => {
    renderRoute('/produk/:slug', '/produk/tidak-ada', <ProductPage />)
    expect(screen.getByText('Halaman ini belum ada')).toBeInTheDocument()
  })
})

describe('OccasionPage', () => {
  test('menampilkan produk yang cocok dengan momen dan chip aktif', () => {
    renderRoute('/untuk/:occasion', '/untuk/ulang-tahun', <OccasionPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('ulang tahun')
    expect(screen.getByRole('link', { name: 'Ulang tahun' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Cocok untuk ulang tahun')).toBeInTheDocument()
  })

  test('momen tidak dikenal: halaman tidak ditemukan', () => {
    renderRoute('/untuk/:occasion', '/untuk/lebaran', <OccasionPage />)
    expect(screen.getByText('Halaman ini belum ada')).toBeInTheDocument()
  })
})

describe('App & layout', () => {
  test('App merender header, home, dan footer (BrowserRouter sendiri)', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getAllByText('Special Digital Things').length).toBeGreaterThan(0)
    expect(screen.getByText('Tersedia sekarang')).toBeInTheDocument()
  })

  test('Header punya navigasi utama (tersembunyi di mobile) dan Footer punya metode pembayaran', () => {
    renderAt(
      '/',
      <>
        <Header />
        <Footer />
      </>,
    )
    // nav desktop display:none di bawah 900px, jadi perlu hidden: true di jsdom
    const nav = screen.getByLabelText('Navigasi utama')
    expect(within(nav).getByText('Produk')).toHaveAttribute('href', '/')
    expect(screen.getByText('QRIS')).toBeInTheDocument()
  })
})
