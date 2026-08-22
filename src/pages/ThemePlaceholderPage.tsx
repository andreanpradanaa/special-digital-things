import { Link } from 'react-router'
import { getThemeById, type ThemeId } from '../app/themeRegistry.ts'
import styles from './ThemePlaceholderPage.module.css'

type ThemePlaceholderPageProps = {
  themeId: ThemeId
}

export function ThemePlaceholderPage({ themeId }: ThemePlaceholderPageProps) {
  const theme = getThemeById(themeId)

  return (
    <section className={styles.page} aria-labelledby={`${theme.id}-title`}>
      <p className={styles.eyebrow}>Placeholder Milestone 1</p>
      <h1 id={`${theme.id}-title`}>{theme.title}</h1>
      <p className={styles.message}>{theme.placeholderMessage}</p>
      <Link className={styles.backLink} to="/">
        Kembali ke koleksi
      </Link>
    </section>
  )
}
