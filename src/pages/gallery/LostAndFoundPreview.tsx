import { Link } from 'react-router'
import { getThemeById } from '../../app/themeRegistry.ts'
import previewStyles from './GalleryPreview.module.css'
import styles from './LostAndFoundPreview.module.css'

export function LostAndFoundPreview() {
  const theme = getThemeById('lost-and-found')

  return (
    <Link
      className={`${previewStyles.link} ${styles.link}`}
      to={theme.path}
      aria-label={`${theme.title}. ${theme.summary} ${theme.previewAction}`}
    >
      <span className={previewStyles.visual}>
        <svg
          className={styles.illustration}
          viewBox="0 0 280 260"
          aria-hidden="true"
          focusable="false"
        >
          <ellipse className={styles.shadow} cx="141" cy="244" rx="91" ry="10" />
          <path className={styles.cabinetTop} d="M51 43h179l10 15H41Z" />
          <rect className={styles.cabinet} x="47" y="56" width="186" height="181" rx="7" />
          <rect className={styles.sign} x="83" y="28" width="114" height="34" rx="3" />
          <text className={styles.signText} x="140" y="42">LOST + FOUND</text>
          <text className={styles.signSmall} x="140" y="53">EST. SOME TIME AGO</text>
          <g className={styles.ticket}>
            <path d="M177 62h41v67h-41V62Z" />
            <path d="M182 75h31M182 82h23" />
            <text x="182" y="99">CLAIM</text>
            <text x="182" y="115">1111</text>
          </g>
          <g className={styles.drawerTop}>
            <rect x="60" y="74" width="72" height="48" rx="3" />
            <rect className={styles.label} x="77" y="86" width="38" height="12" rx="2" />
            <path className={styles.handle} d="M86 108h20" />
          </g>
          <g>
            <rect className={styles.drawer} x="143" y="74" width="77" height="48" rx="3" />
            <rect className={styles.label} x="162" y="86" width="39" height="12" rx="2" />
            <path className={styles.handle} d="M171 108h21" />
          </g>
          <g>
            <rect className={styles.drawer} x="60" y="132" width="160" height="41" rx="3" />
            <rect className={styles.label} x="113" y="143" width="54" height="12" rx="2" />
            <path className={styles.handle} d="M129 163h22" />
          </g>
          <g>
            <rect className={styles.drawer} x="60" y="183" width="72" height="39" rx="3" />
            <rect className={styles.label} x="79" y="193" width="34" height="11" rx="2" />
            <circle className={styles.knob} cx="96" cy="213" r="4" />
          </g>
          <g>
            <rect className={styles.drawer} x="143" y="183" width="77" height="39" rx="3" />
            <rect className={styles.label} x="164" y="193" width="35" height="11" rx="2" />
            <circle className={styles.knob} cx="181" cy="213" r="4" />
          </g>
          <path className={styles.feet} d="M63 237v8m153-8v8" />
          <g className={styles.paperTag}>
            <path d="m32 146 40-6 6 42-40 6Z" />
            <circle cx="43" cy="153" r="3" />
            <path d="m43 153-13-9" />
            <text x="43" y="168">KEPT</text>
            <text x="43" y="178">SAFE</text>
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
