import { Link, Outlet } from 'react-router'
import { RouteAnnouncer } from '../shared/RouteAnnouncer.tsx'
import styles from './AppShell.module.css'

export function AppShell() {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Lewati ke konten utama
      </a>

      <RouteAnnouncer />

      <header className={styles.header}>
        <Link className={styles.brand} to="/">
          Special Digital Things
        </Link>
        <span className={styles.status}>Prototype foundation</span>
      </header>

      <main className={styles.main} id="main-content">
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>Hadiah digital dari Ari untuk Nara.</p>
      </footer>
    </div>
  )
}
