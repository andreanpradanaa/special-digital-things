import { Button } from '../components/ui'
import s from './pages.module.css'

export function NotFoundPage() {
  return (
    <main className="container">
      <div className={s.empty} role="status">
        <div className={s.emptyIcon} aria-hidden="true" />
        <p className={s.emptyTitle}>Halaman ini belum ada</p>
        <p className={s.emptyBody}>Mungkin link-nya salah ketik, atau produknya belum kami rilis.</p>
        <Button variant="secondary" to="/">
          Kembali ke beranda
        </Button>
      </div>
    </main>
  )
}
