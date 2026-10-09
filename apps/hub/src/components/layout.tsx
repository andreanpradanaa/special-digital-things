import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { occasions, type OccasionId } from '../data/occasions'
import { liveProducts } from '../data/products'
import { Button, Chip } from './ui'
import s from './layout.module.css'

const primaryProduct = liveProducts[0]

const navClass = ({ isActive }: { isActive: boolean }) => [s.navLink, isActive ? s.navLinkActive : ''].join(' ')

export function Header() {
  return (
    <header className={s.header}>
      <div className="container">
        <div className={s.headerRow}>
          <Link to="/" className={s.brand}>
            <span className={s.logo} aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <rect x="5" y="13" width="22" height="15" rx="3" className={s.logoBox} />
                <rect x="3" y="9" width="26" height="6" rx="2" className={s.logoLid} />
                <rect x="14" y="9" width="4" height="19" className={s.logoRibbon} />
                <path d="M16 9c-3-5-8-4-6-1 1 1.5 4 1.6 6 1zm0 0c3-5 8-4 6-1-1 1.5-4 1.6-6 1z" className={s.logoRibbon} />
              </svg>
            </span>
            <span>Special Digital Things</span>
          </Link>
          <nav className={s.nav} aria-label="Navigasi utama">
            <NavLink to="/" end className={navClass}>
              Produk
            </NavLink>
            <NavLink to="/untuk/ulang-tahun" className={navClass}>
              Untuk siapa
            </NavLink>
            <a className={s.navLink} href="/#cerita">
              Cerita kami
            </a>
          </nav>
          {primaryProduct?.href && (
            <div className={s.headerCta}>
              <Button variant="joy" href={primaryProduct.href} size="small" arrow>
                Bikin {primaryProduct.name}
              </Button>
            </div>
          )}
        </div>
        <nav className={s.mobileNav} aria-label="Navigasi">
          <NavLink to="/" end className={navClass}>
            Produk
          </NavLink>
          <NavLink to="/untuk/ulang-tahun" className={navClass}>
            Untuk siapa
          </NavLink>
          <a className={s.navLink} href="/#cerita">
            Cerita kami
          </a>
        </nav>
      </div>
    </header>
  )
}

type StickyCtaProps = { href?: string; label: string; price?: string }

/**
 * CTA melayang di bawah layar (mobile). Muncul setelah pengguna menggulir ±1 layar,
 * dan sembunyi lagi saat footer terlihat supaya tidak menutupi tautan footer.
 */
export function StickyCta({ href, label, price }: StickyCtaProps) {
  const [scrolled, setScrolled] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const footer = document.getElementById('tentang')
    if (!footer || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting))
    io.observe(footer)
    return () => io.disconnect()
  }, [])

  if (!href) return null
  const visible = scrolled && !footerVisible
  return (
    <div className={[s.sticky, visible ? s.stickyVisible : ''].join(' ')} aria-hidden={!visible} data-testid="sticky-cta">
      <a className={s.stickyLink} href={href} tabIndex={visible ? 0 : -1}>
        <span>{label}</span>
        {price && <span className={s.stickyPrice}>{price}</span>}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  )
}

type TopBarProps = { title: string; crumbs?: { label: string; to?: string }[] }

/** Bar atas halaman detail: tombol kembali di mobile, breadcrumb di desktop. */
export function TopBar({ title, crumbs }: TopBarProps) {
  return (
    <div className="container">
      <div className={s.topBar}>
        <Link to="/" className={s.back}>
          <span aria-hidden="true">←</span> Kembali
        </Link>
        <span className={s.topBarTitle}>{title}</span>
        <span style={{ width: 72 }} aria-hidden="true" />
      </div>
      <nav className={s.crumbs} aria-label="Breadcrumb">
        {(crumbs ?? [{ label: 'Produk', to: '/' }]).map((c, i) => (
          <Fragment key={i}>
            {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
            <span aria-hidden="true">›</span>
          </Fragment>
        ))}
        <span className={s.crumbCurrent}>{title}</span>
      </nav>
    </div>
  )
}

type FilterRowProps = { active?: OccasionId | 'semua' }

export function FilterRow({ active = 'semua' }: FilterRowProps) {
  return (
    <div className={s.filters} role="navigation" aria-label="Filter berdasarkan momen">
      <span className={s.filtersLabel}>Untuk siapa:</span>
      <Chip to="/" active={active === 'semua'}>
        Semua
      </Chip>
      {occasions.map((o) => (
        <Chip key={o.id} to={`/untuk/${o.id}`} active={active === o.id}>
          {o.label}
        </Chip>
      ))}
    </div>
  )
}

type SectionProps = {
  title: string
  subtitle?: string
  children: ReactNode
  id?: string
  /** Judul pakai font ceria (Fraunces) */ joy?: boolean
}

export function Section({ title, subtitle, children, id, joy }: SectionProps) {
  return (
    <section className={s.section} id={id}>
      <div className={s.sectionHead}>
        <h2 className={[s.sectionTitle, joy ? 'display-joy' : ''].join(' ')}>{title}</h2>
        {subtitle && <p className={s.sectionSub}>{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

export function Footer() {
  return (
    <footer className={s.footer} id="tentang">
      <div className="container">
        <div className={s.footerGrid}>
          <div className={s.footerCol}>
            <span className={s.footerBrand}>Special Digital Things</span>
            <p className={s.footerAbout}>
              Studio kecil yang membuat hadiah digital untuk orang-orang yang kamu sayang. Dibuat di Indonesia.
            </p>
          </div>
          <div className={s.footerCol}>
            <span className={s.footerHead}>Produk</span>
            <div className={s.footerLinks}>
              {liveProducts.map((p) => (
                <Link key={p.slug} to={`/produk/${p.slug}`}>
                  {p.name}
                </Link>
              ))}
              <Link to="/#segera">Segera hadir</Link>
              <Link to="/untuk/ulang-tahun">Untuk ulang tahun</Link>
              <Link to="/untuk/romantis">Untuk romantis</Link>
            </div>
          </div>
          <div className={s.footerCol}>
            <span className={s.footerHead}>Bantuan</span>
            <div className={s.footerLinks}>
              <a href="mailto:halo@specialdigitalthings.com">Kontak</a>
              <a href="https://instagram.com/specialdigitalthings" rel="noreferrer" target="_blank">
                Instagram
              </a>
              <a href="https://wa.me/" rel="noreferrer" target="_blank">
                WhatsApp
              </a>
              <a href="#syarat">Syarat &amp; privasi</a>
            </div>
          </div>
          <div className={s.footerCol}>
            <span className={s.footerHead}>Pembayaran</span>
            <div className={s.payments}>
              {['QRIS', 'GoPay', 'Transfer Bank', 'Visa / Mastercard'].map((p) => (
                <span key={p} className={s.pay}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={s.footerBottom}>
          <span>© {new Date().getFullYear()} Special Digital Things</span>
          <span>Pembayaran diproses oleh Midtrans</span>
        </div>
      </div>
    </footer>
  )
}
