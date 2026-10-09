import { GiftArt } from '../components/art'
import { ProductCard, TeaserCard } from '../components/cards'
import { FilterRow, Section } from '../components/layout'
import { Button } from '../components/ui'
import { comingSoonProducts, liveProducts } from '../data/products'
import s from './pages.module.css'

export function HomePage() {
  const primary = liveProducts[0]
  return (
    <main className="container">
      <section className={s.hero}>
        <div className={s.heroCopy}>
          <p className={['script', s.heroScript].join(' ')}>hadiah digital yang terasa personal</p>
          <h1 className={s.heroTitle}>Pilih hadiah digital, kirim lewat satu link.</h1>
          <p className={s.heroSub}>Kamu isi sendiri — surat, foto, voice note. Dia buka di browser, tanpa aplikasi, tanpa ongkir.</p>
          <div className={s.heroActions}>
            {primary?.href && <Button href={primary.href}>Buka {primary.name} →</Button>}
            <Button variant="secondary" to="/#segera">
              Lihat semua produk
            </Button>
          </div>
        </div>
        <div className={s.heroArt}>
          <GiftArt color={primary?.color} ratio="hero" rounded="lg" />
        </div>
      </section>

      <FilterRow active="semua" />

      <Section title="Tersedia sekarang" id="tersedia">
        <div className={s.liveList}>
          {liveProducts.map((p) => (
            <ProductCard key={p.slug} product={p} wide />
          ))}
        </div>
      </Section>

      <Section title="Segera hadir" subtitle="Tinggalkan email, kami kabari saat rilis." id="segera">
        <div className={s.teaserGrid}>
          {comingSoonProducts.map((p) => (
            <TeaserCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>

      <div className={s.spacer} />
    </main>
  )
}
