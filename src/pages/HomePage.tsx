import { Link } from 'react-router'
import { homeRoute, themeRegistry } from '../app/themeRegistry.ts'
import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <section className={styles.page} aria-labelledby="home-title">
      <p className={styles.eyebrow}>Milestone 1</p>
      <h1 id="home-title">{homeRoute.title}</h1>
      <p className={styles.intro}>
        Fondasi satu aplikasi untuk tiga hadiah digital Ari dan Nara. Pada tahap
        ini, setiap halaman masih berupa placeholder yang dapat diuji.
      </p>

      <nav className={styles.navigation} aria-labelledby="theme-navigation-title">
        <h2 id="theme-navigation-title">Pilih route tema</h2>
        <ul className={styles.list}>
          {themeRegistry.map((theme) => (
            <li className={styles.item} key={theme.id}>
              <Link className={styles.link} to={theme.path}>
                <span className={styles.linkTitle}>{theme.title}</span>
                <span className={styles.linkSummary}>{theme.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
