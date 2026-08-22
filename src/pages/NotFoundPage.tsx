import { Link } from 'react-router'
import { notFoundRoute } from '../app/themeRegistry.ts'
import styles from './ThemePlaceholderPage.module.css'

export function NotFoundPage() {
  return (
    <section className={styles.page} aria-labelledby="not-found-title">
      <p className={styles.eyebrow}>404</p>
      <h1 id="not-found-title">{notFoundRoute.title}</h1>
      <p className={styles.message}>
        Alamat ini belum menjadi bagian dari koleksi hadiah digital.
      </p>
      <Link className={styles.backLink} to="/">
        Kembali ke halaman utama
      </Link>
    </section>
  )
}
