import { useState } from 'react'
import { GiftArt } from '../components/art'
import { ProductCard, TeaserCard } from '../components/cards'
import { FilterRow, Section, StickyCta } from '../components/layout'
import { Button } from '../components/ui'
import { comingSoonProducts, formatIdr, liveProducts } from '../data/products'
import { howItWorks, letters, makerNote } from '../data/story'
import h from './home.module.css'
import s from './pages.module.css'

const TEASER_LIMIT = 3

export function HomePage() {
  const primary = liveProducts[0]
  const [showAllSoon, setShowAllSoon] = useState(false)
  const visibleSoon = showAllSoon ? comingSoonProducts : comingSoonProducts.slice(0, TEASER_LIMIT)
  const hiddenCount = comingSoonProducts.length - TEASER_LIMIT
  const price = primary?.priceIdr ? formatIdr(primary.priceIdr) : undefined

  return (
    <main className="container">
      {/* ---------- Hero ---------- */}
      <section className={h.hero} aria-labelledby="hero-title">
        <div className={h.heroCopy}>
          <p className={['script', h.heroScript].join(' ')}>bikin dia senyum lebar hari ini</p>
          <h1 id="hero-title" className={['display-joy', h.heroTitle].join(' ')}>
            Kirim kejutan yang bikin dia buka <span className={h.marker}>berkali-kali.</span>
          </h1>
          <p className={h.heroSub}>
            Isi dengan surat, foto, dan voice note. Dia tinggal klik, pita ditarik, hadiahnya muncul satu per satu. Tanpa aplikasi, tanpa
            ongkir.
          </p>
          <div className={h.heroActions}>
            {primary?.href && (
              <Button variant="joy" size="large" href={primary.href} arrow>
                Bikin {primary.name} sekarang
              </Button>
            )}
            <Button variant="secondary" size="large" to="/#cara-kerja">
              Lihat cara kerjanya
            </Button>
          </div>
          <ul className={h.trust}>
            <li>Tanpa aplikasi</li>
            <li>Tanpa ongkir</li>
            {price && <li>Mulai {price}</li>}
          </ul>
        </div>
        <div className={h.heroArt}>
          <GiftArt
            animated
            ratio="hero"
            rounded="lg"
            note={
              <>
                Untuk Sinta,
                <br />
                selamat ulang tahun! ♡
              </>
            }
          />
        </div>
      </section>

      <FilterRow active="semua" />

      {/* ---------- Produk live ---------- */}
      <Section title="Tersedia sekarang" id="tersedia" joy>
        <div className={s.liveList}>
          {liveProducts.map((p) => (
            <ProductCard key={p.slug} product={p} wide />
          ))}
        </div>
      </Section>

      {/* ---------- Cara kerja ---------- */}
      <section className={h.how} id="cara-kerja" aria-labelledby="how-title">
        <div className={h.sectionHead}>
          <p className="script">gampang, kok</p>
          <h2 id="how-title" className={['display-joy', h.sectionTitle].join(' ')}>
            Dari kamu, sampai dia senyum
          </h2>
        </div>
        <ol className={h.steps}>
          {howItWorks.map((step, i) => (
            <li key={step.title} className={h.step}>
              <span className={[h.stepNo, step.who === 'dia' ? h.stepNoDia : ''].join(' ')}>{i + 1}</span>
              <span className={[h.who, step.who === 'dia' ? h.whoDia : ''].join(' ')}>{step.who === 'kamu' ? 'kamu' : 'dia'}</span>
              <h3 className={h.stepTitle}>{step.title}</h3>
              <p className={h.stepBody}>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Contoh isi kotak (scrapbook) ---------- */}
      <section className={h.letters} aria-labelledby="letters-title">
        <div className={h.sectionHead}>
          <p className="script">contoh isi kotak</p>
          <h2 id="letters-title" className={['display-joy', h.sectionTitle].join(' ')}>
            Kata-kata kecil yang disimpan lama
          </h2>
          <p className={h.sectionSub}>Setiap kotak berbeda, karena isinya datang dari kamu.</p>
        </div>
        <div className={h.letterGrid}>
          {letters.map((l) => (
            <figure key={l.to} className={[h.letter, h[`tone_${l.tone}`]].join(' ')}>
              <span className={h.tape} aria-hidden="true" />
              <span className={h.letterTag}>{l.occasion}</span>
              <blockquote className={h.letterText}>
                <p className={h.letterTo}>{l.to}</p>
                <p>{l.body}</p>
              </blockquote>
              <figcaption className={h.letterFrom}>{l.from}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- Segera hadir ---------- */}
      <Section title="Segera hadir" subtitle="Masih dimasak. Tinggalkan email, kamu yang pertama tahu." id="segera">
        <div className={s.teaserGrid}>
          {visibleSoon.map((p) => (
            <TeaserCard key={p.slug} product={p} />
          ))}
        </div>
        {!showAllSoon && hiddenCount > 0 && (
          <div className={h.moreRow}>
            <Button variant="secondary" onClick={() => setShowAllSoon(true)}>
              Lihat {hiddenCount} lagi
            </Button>
          </div>
        )}
      </Section>

      {/* ---------- Catatan pembuat ---------- */}
      <section className={h.maker} id="cerita" aria-labelledby="maker-title">
        <div className={h.makerCard}>
          <span className={h.tape} aria-hidden="true" />
          <div className={h.avatars} aria-hidden="true">
            {makerNote.makers.map((name) => (
              <span key={name} className={h.avatar}>
                {name.slice(0, 1)}
              </span>
            ))}
          </div>
          <div className={h.makerBody}>
            <h2 id="maker-title" className={['display-joy', h.makerTitle].join(' ')}>
              {makerNote.greeting}
            </h2>
            <p className={h.makerText}>{makerNote.body}</p>
            <p className={h.makerSign}>
              {makerNote.signoff}
              <br />
              <span className={h.signature}>{makerNote.makers.join(' & ')}</span>
            </p>
          </div>
        </div>
      </section>

      <StickyCta href={primary?.href} label={`Bikin ${primary?.name ?? ''}`} price={price} />
    </main>
  )
}
