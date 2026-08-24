import { Link } from 'react-router'
import { getThemeById } from '../../app/themeRegistry.ts'
import previewStyles from './GalleryPreview.module.css'
import styles from './HeartRepairPreview.module.css'

export function HeartRepairPreview() {
  const theme = getThemeById('heart-repair')

  return (
    <Link
      className={`${previewStyles.link} ${styles.link}`}
      to={theme.path}
      aria-label={`${theme.title}. ${theme.summary} ${theme.previewAction}`}
    >
      <span className={previewStyles.visual}>
        <svg
          className={styles.illustration}
          viewBox="0 0 320 230"
          aria-hidden="true"
          focusable="false"
        >
          <ellipse className={styles.shadow} cx="157" cy="210" rx="126" ry="12" />
          <path className={styles.handle} d="M102 76V54c0-14 11-25 25-25h59c14 0 25 11 25 25v22" />
          <g className={styles.lid}>
            <rect x="45" y="73" width="224" height="52" rx="13" />
            <path d="M61 99h192" />
            <rect x="132" y="90" width="50" height="14" rx="4" />
          </g>
          <rect className={styles.box} x="39" y="113" width="236" height="91" rx="17" />
          <path className={styles.boxLine} d="M54 144h206" />
          <rect className={styles.latch} x="137" y="124" width="40" height="22" rx="5" />
          <g className={styles.heart}>
            <path d="M160 165c-21-18-46-34-46-57 0-15 11-26 26-26 10 0 17 5 20 13 4-8 11-13 21-13 15 0 26 11 26 26 0 23-26 39-47 57Z" />
            <g className={styles.patch}>
              <rect x="160" y="104" width="30" height="20" rx="5" transform="rotate(12 175 114)" />
              <path d="m166 107 19 14M164 115l17 12" />
            </g>
            <path className={styles.stitches} d="m146 107 8 3m-11 5 8 3m-9 5 8 3" />
          </g>
          <g className={styles.tape}>
            <circle cx="77" cy="158" r="22" />
            <circle cx="77" cy="158" r="9" />
            <path d="M98 158h24v18H88" />
          </g>
          <g className={styles.charger}>
            <rect x="220" y="145" width="30" height="42" rx="6" />
            <path d="m237 153-9 14h8l-5 12 12-16h-8l2-10Z" />
            <path d="M228 145v-8m14 8v-8" />
          </g>
          <path className={styles.tagString} d="M223 61c20-6 35 2 44 15" />
          <g className={styles.tag}>
            <path d="m253 63 45 8-8 42-45-8Z" />
            <circle cx="259" cy="76" r="3" />
            <text x="263" y="88">SERVICE</text>
            <text x="261" y="99">GUSTI</text>
          </g>
        </svg>
      </span>

      <span className={previewStyles.copy}>
        <span className={previewStyles.title}>{theme.title}</span>
        <span className={previewStyles.description}>{theme.summary}</span>
        <span className={previewStyles.action}>
          {theme.previewAction}
          <span className={previewStyles.arrow} aria-hidden="true">
            →
          </span>
        </span>
      </span>
    </Link>
  )
}
