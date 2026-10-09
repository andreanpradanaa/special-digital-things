import { useParams } from 'react-router-dom'
import { GiftArt, TeaserArt } from '../components/art'
import { EmailCapture } from '../components/EmailCapture'
import { Faq } from '../components/Faq'
import { TopBar } from '../components/layout'
import { Badge, Button, Chip } from '../components/ui'
import { findProduct, formatIdr, type Product } from '../data/products'
import { NotFoundPage } from './NotFoundPage'
import s from './pages.module.css'

export function ProductPage() {
  const { slug } = useParams()
  const product = findProduct(slug)
  if (!product) return <NotFoundPage />
  return product.status === 'live' ? <LiveProduct product={product} /> : <ComingSoonProduct product={product} />
}

function LiveProduct({ product }: { product: Product }) {
  const price = product.priceIdr ? formatIdr(product.priceIdr) : null
  return (
    <main>
      <TopBar title={product.name} />
      <div className="container">
        <div className={s.detailLayout}>
          <div className={s.detailArt}>
            <GiftArt
              animated
              ratio="hero"
              rounded="lg"
              note={
                <>
                  Untuk kamu,
                  <br />
                  buka pelan-pelan ya ♡
                </>
              }
            />
          </div>

          <div className={s.detail}>
            <div className={s.detailHead}>
              <div className={s.detailTitleRow}>
                <h1 className={s.detailTitle}>{product.name}</h1>
                <Badge tone="joy">Tersedia</Badge>
              </div>
              <p className="script">{product.script}</p>
              <p className={s.detailLead}>{product.description}</p>
              {price && (
                <div className={s.priceRow}>
                  <span className={s.price}>{price}</span>
                  <span className={s.priceNote}>sekali bayar · link aktif 30 hari</span>
                </div>
              )}
              <div className={s.detailActions}>
                <Button variant="joy" href={product.href} arrow>
                  Bikin {product.name} sekarang
                </Button>
                <Button variant="secondary" href={product.href}>
                  Lihat contoh hadiah
                </Button>
              </div>
            </div>

            {product.steps && (
              <div className={s.block}>
                <h2 className={s.blockTitle}>Yang akan dia alami</h2>
                <ol className={s.steps} style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {product.steps.map((step, i) => (
                    <li key={step.title} className={s.step}>
                      <span className={s.stepNo}>{i + 1}</span>
                      <div className={s.stepBody}>
                        <span className={s.stepTitle}>{step.title}</span>
                        <span className={s.stepDesc}>{step.description}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className={s.block}>
              <h2 className={s.blockTitle}>Yang kamu isi</h2>
              <div className={s.chips}>
                {product.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </div>

            {product.faq && (
              <div className={s.block}>
                <h2 className={s.blockTitle}>Pertanyaan umum</h2>
                <Faq items={product.faq} />
              </div>
            )}

            <a className={s.inlineLink} href={product.href}>
              Lihat contoh hadiah →
            </a>
          </div>
        </div>

        {price && (
          <div className={s.stickyBar}>
            <div className={s.stickyPrice}>
              <strong>{price}</strong>
              <span>sekali bayar</span>
            </div>
            <Button variant="joy" href={product.href} arrow>
              Bikin {product.name} sekarang
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

function ComingSoonProduct({ product }: { product: Product }) {
  return (
    <main>
      <TopBar
        title={product.name}
        crumbs={[
          { label: 'Produk', to: '/' },
          { label: 'Segera hadir', to: '/#segera' },
        ]}
      />
      <div className="container">
        <div className={s.detailLayout}>
          <div className={s.detailArt}>
            <TeaserArt color={product.color} icon={product.icon} rounded="lg" />
          </div>
          <div className={s.detail}>
            <div className={s.detailHead}>
              <div>
                <Badge tone="amber">Segera</Badge>
              </div>
              <h1 className={s.detailTitle}>{product.name}</h1>
              <p className="script">{product.script}</p>
              <p className={s.detailLead}>{product.description}</p>
            </div>

            <div className={s.moods} aria-hidden="true">
              <TeaserArt color={shade(product.color, -10)} rounded />
              <TeaserArt color={shade(product.color, 8)} rounded />
            </div>

            <div className={s.block}>
              <h2 className={s.blockTitle}>Yang nanti kamu isi</h2>
              <div className={s.chips}>
                {product.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </div>

            <div className={s.capture}>
              <EmailCapture productSlug={product.slug} productName={product.name} />
            </div>
          </div>
        </div>
        <div className={s.spacer} />
      </div>
    </main>
  )
}

/** Geser terang/gelap warna hex sedikit, untuk variasi gambar mood. */
function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16)
  const ch = (v: number) => Math.max(0, Math.min(255, v + amount))
  const r = ch((n >> 16) & 255)
  const g = ch((n >> 8) & 255)
  const b = ch(n & 255)
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}
