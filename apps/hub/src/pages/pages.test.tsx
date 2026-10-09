import { describe, expect, test } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { renderAt, renderRoute } from '../test/render'
import { App } from '../App'
import { Footer, Header } from '../components/layout'
import { comingSoonProducts, liveProducts } from '../data/products'
import { HomePage } from './HomePage'
import { OccasionPage } from './OccasionPage'
import { ProductPage } from './ProductPage'

describe('HomePage', () => {
  test('menampilkan semua produk live dengan CTA keluar ke link produk', () => {
    renderAt('/', <HomePage />)
    for (const p of liveProducts) {
      const cta = screen.getAllByRole('link', { name: `Buka ${p.name} →` })
      expect(cta.length).toBeGreaterThan(0)
      expect(cta[0]).toHaveAttribute('href', p.href)
    }
  })

  test('menampilkan semua produk coming-soon sebagai teaser tanpa tombol beli', () => {
    renderAt('/', <HomePage />)
    for (const p of comingSoonProducts) {
      expect(screen.getAllByRole('link', { name: p.name }).length).toBeGreaterThan(0)
      expect(screen.queryByRole('link', { name: `Buka ${p.name} →` })).toBeNull()
    }
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
    expect(screen.getAllByText('Rp 49.000').length).toBeGreaterThan(0)
    expect(screen.getByText('Yang akan dia alami')).toBeInTheDocument()
    expect(screen.getByText('Pertanyaan umum')).toBeInTheDocument()
    const ctas = screen.getAllByRole('link', { name: 'Buka Goodiebox →' })
    expect(ctas.every((a) => a.getAttribute('href') === liveProducts[0].href)).toBe(true)
  })

  test('produk coming-soon: badge Segera dan form Kabari saya', () => {
    renderRoute('/produk/:slug', '/produk/midnight-radio', <ProductPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Midnight Radio' })).toBeInTheDocument()
    expect(screen.getByText('Segera')).toBeInTheDocument()
    expect(screen.getByLabelText('Kabari saya kalau sudah siap')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Buka Midnight Radio/ })).toBeNull()
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
