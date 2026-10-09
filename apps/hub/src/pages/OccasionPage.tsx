import { useParams } from 'react-router-dom'
import { ProductCard, TeaserCard } from '../components/cards'
import { FilterRow, Section, TopBar } from '../components/layout'
import { Button } from '../components/ui'
import { findOccasion } from '../data/occasions'
import { products } from '../data/products'
import { NotFoundPage } from './NotFoundPage'
import s from './pages.module.css'

export function OccasionPage() {
  const { occasion: id } = useParams()
  const occasion = findOccasion(id)
  if (!occasion) return <NotFoundPage />

  const matching = products.filter((p) => p.occasions.includes(occasion.id))
  const live = matching.filter((p) => p.status === 'live')
  const soon = matching.filter((p) => p.status === 'coming-soon')

  return (
    <main>
      <TopBar title={`Hadiah ${occasion.label.toLowerCase()}`} crumbs={[{ label: 'Untuk siapa', to: '/' }]} />
      <div className="container">
        <section className={s.occHero}>
          <p className="script">{occasion.script}</p>
          <h1 className={s.occTitle}>{occasion.title}</h1>
          <p className={s.heroSub}>{occasion.subtitle}</p>
        </section>

        <FilterRow active={occasion.id} />

        {matching.length === 0 ? (
          <div className={s.empty} role="status">
            <div className={s.emptyIcon} aria-hidden="true" />
            <p className={s.emptyTitle}>Belum ada hadiah untuk {occasion.label}</p>
            <p className={s.emptyBody}>Kami sedang menyiapkannya. Sementara itu, lihat hadiah lain yang sudah tersedia.</p>
            <Button variant="secondary" to="/">
              Lihat semua hadiah
            </Button>
          </div>
        ) : (
          <>
            {live.length > 0 && (
              <Section title={`Cocok untuk ${occasion.label.toLowerCase()}`}>
                <div className={s.liveList}>
                  {live.map((p) => (
                    <ProductCard key={p.slug} product={p} wide />
                  ))}
                </div>
              </Section>
            )}
            {soon.length > 0 && (
              <Section title="Segera hadir" subtitle="Tinggalkan email, kami kabari saat rilis.">
                <div className={s.teaserGrid}>
                  {soon.map((p) => (
                    <TeaserCard key={p.slug} product={p} />
                  ))}
                </div>
              </Section>
            )}
          </>
        )}
        <div className={s.spacer} />
      </div>
    </main>
  )
}
