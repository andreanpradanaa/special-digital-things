import { Fragment, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { occasions, type OccasionId } from '../data/occasions'
import { liveProducts } from '../data/products'
import { Button, Chip } from './ui'
import s from './layout.module.css'

const primaryProduct = liveProducts[0]

export function Header() {
  return (
    <header className={s.header}>
      <div className="container">
        <div className={s.headerRow}>
          <Link to="/" className={s.brand}>
            Special Digital Things
          </Link>
          <nav className={s.nav} aria-label="Navigasi utama">
            <NavLink to="/" end className={({ isActive }) => [s.navLink, isActive ? s.navLinkActive : ''].join(' ')}>
              Produk
            </NavLink>
            <NavLink to="/untuk/ulang-tahun" className={({ isActive }) => [s.navLink, isActive ? s.navLinkActive : ''].join(' ')}>
              Untuk siapa
            </NavLink>
            <a className={s.navLink} href="#tentang">
              Tentang
            </a>
          </nav>
          {primaryProduct?.href && (
            <div className={s.headerCta}>
              <Button href={primaryProduct.href} size="small">
                Buka {primaryProduct.name} →
              </Button>
            </div>
          )}
          <a className={s.mobileAbout} href="#tentang">
            Tentang
          </a>
        </div>
        <p className={['script', s.tagline].join(' ')}>hadiah digital yang terasa personal</p>
      </div>
    </header>
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

type SectionProps = { title: string; subtitle?: string; children: ReactNode; id?: string }

export function Section({ title, subtitle, children, id }: SectionProps) {
  return (
    <section className={s.section} id={id}>
      <div className={s.sectionHead}>
        <h2 className={s.sectionTitle}>{title}</h2>
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
