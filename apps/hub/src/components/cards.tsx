import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { findOccasion } from '../data/occasions'
import { formatIdr, type Product } from '../data/products'
import { GiftArt, TeaserArt } from './art'
import { EmailCapture } from './EmailCapture'
import { Badge, Button, Chip } from './ui'
import s from './cards.module.css'

type ProductCardProps = {
  product: Product
  /** Tata letak horizontal untuk desktop (katalog utama) */
  wide?: boolean
}

/** Kartu produk yang sudah bisa dibeli. CTA utama keluar dari hub ke halaman produk. */
export function ProductCard({ product, wide }: ProductCardProps) {
  const detailTo = `/produk/${product.slug}`
  const occasionLabels = product.occasions
    .slice(0, 3)
    .map((id) => findOccasion(id)?.label)
    .filter(Boolean)
    .join(' · ')

  return (
    <article className={[s.card, s.live, wide ? s.wide : ''].join(' ')}>
      <Link to={detailTo} className={s.art} aria-label={`Lihat detail ${product.name}`}>
        <GiftArt ratio={wide ? 'hero' : 'wide'} animated={false} />
      </Link>
      <div className={s.body}>
        <div className={s.titleRow}>
          <h3 className={[s.title, 'display-joy'].join(' ')}>
            <Link to={detailTo} className={s.titleLink}>
              {product.name}
            </Link>
          </h3>
          <Badge tone="joy">Tersedia</Badge>
        </div>
        <p className={s.tagline}>{wide ? product.description : product.tagline}</p>
        <div className={s.chips}>
          {product.items.slice(0, wide ? 6 : 4).map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </div>
        <div className={s.priceRow}>
          {product.priceIdr && (
            <span className={s.price}>
              {formatIdr(product.priceIdr)}
              <span className={s.priceUnit}> / kotak</span>
            </span>
          )}
          <span className={s.priceNote}>{wide ? `sekali bayar · ${occasionLabels}` : occasionLabels}</span>
        </div>
        <div className={s.actions}>
          <Button variant="joy" href={product.href} full={!wide} arrow>
            Bikin {product.name} sekarang
          </Button>
          {wide && (
            <Button variant="secondary" to={detailTo}>
              Lihat detail
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

type TeaserCardProps = { product: Product }

/**
 * Kartu produk yang belum rilis: tanpa CTA beli, hanya "Kabari saya".
 * Di mobile tautan ke halaman detail (form ada di sana); di desktop form email langsung di kartu.
 */
export function TeaserCard({ product }: TeaserCardProps) {
  const detailTo = `/produk/${product.slug}`
  const style = { '--teaser-tint': product.color } as CSSProperties
  return (
    <article className={[s.card, s.teaser].join(' ')} style={style}>
      <Link to={detailTo} aria-label={`Lihat ${product.name}`}>
        <TeaserArt color={product.color} icon={product.icon} />
      </Link>
      <div className={s.teaserBody}>
        <div>
          <Badge tone="amber">Segera</Badge>
        </div>
        <h3 className={s.title}>
          <Link to={detailTo} className={s.titleLink}>
            {product.name}
          </Link>
        </h3>
        <p className={s.teaserTagline}>{product.tagline}</p>
        <Link to={detailTo} className={s.teaserLink}>
          Kabari saya →
        </Link>
        <div className={s.teaserCapture}>
          <EmailCapture productSlug={product.slug} productName={product.name} compact />
        </div>
      </div>
    </article>
  )
}
