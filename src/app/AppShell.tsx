import { useRef, type MouseEvent } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { getHeartRepairGiftConfiguration } from '../pages/heart-repair/heartRepairGift.ts'
import { RouteAnnouncer } from '../shared/RouteAnnouncer.tsx'
import styles from './AppShell.module.css'

export function AppShell() {
  const mainRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const heartRepairGift =
    location.pathname === '/heart-repair' ? getHeartRepairGiftConfiguration() : null

  const skipToMainContent = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    mainRef.current?.focus()
  }

  return (
    <div className={styles.shell}>
      <a
        className={styles.skipLink}
        href="#main-content"
        onClick={skipToMainContent}
      >
        Lewati ke konten utama
      </a>

      <RouteAnnouncer />

      <header className={styles.header}>
        <Link className={styles.brand} to="/">
          Special Digital Things
        </Link>
        <span className={styles.status}>A small collection of big feelings</span>
      </header>

      <main className={styles.main} id="main-content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>
          {heartRepairGift
            ? `Hadiah digital dari ${heartRepairGift.senderName} untuk ${heartRepairGift.recipientName}.`
            : 'Hadiah digital dari Andre untuk Gusti.'}
        </p>
      </footer>
    </div>
  )
}
