import { Link } from 'react-router'
import { getThemeById } from '../../app/themeRegistry.ts'
import previewStyles from './GalleryPreview.module.css'
import styles from './MidnightRadioPreview.module.css'

export function MidnightRadioPreview() {
  const theme = getThemeById('midnight-radio')

  return (
    <Link
      className={`${previewStyles.link} ${styles.link}`}
      to={theme.path}
      aria-label={`${theme.title}. ${theme.summary} ${theme.previewAction}`}
    >
      <span className={previewStyles.visual}>
        <svg
          className={styles.illustration}
          viewBox="0 0 340 235"
          aria-hidden="true"
          focusable="false"
        >
          <ellipse className={styles.shadow} cx="174" cy="219" rx="134" ry="11" />
          <path className={styles.antenna} d="m72 55 116-44" />
          <circle className={styles.antennaTip} cx="190" cy="10" r="4" />
          <rect className={styles.radio} x="37" y="55" width="272" height="151" rx="28" />
          <path className={styles.radioHighlight} d="M66 72h213" />
          <rect className={styles.display} x="64" y="83" width="117" height="46" rx="8" />
          <text className={styles.frequency} x="122" y="112">11:11</text>
          <path className={styles.scale} d="M73 121h98M82 121v-5m18 5v-8m20 8v-5m18 5v-8m20 8v-5" />
          <g className={styles.needle}>
            <path d="M122 121V92" />
            <circle cx="122" cy="121" r="3" />
          </g>
          <circle className={styles.indicatorRing} cx="199" cy="92" r="9" />
          <circle className={styles.indicator} cx="199" cy="92" r="5" />
          <g className={styles.speaker}>
            <circle cx="248" cy="129" r="48" />
            <circle cx="226" cy="107" r="3" />
            <circle cx="241" cy="104" r="3" />
            <circle cx="257" cy="104" r="3" />
            <circle cx="271" cy="111" r="3" />
            <circle cx="218" cy="124" r="3" />
            <circle cx="235" cy="121" r="3" />
            <circle cx="252" cy="120" r="3" />
            <circle cx="269" cy="125" r="3" />
            <circle cx="222" cy="143" r="3" />
            <circle cx="240" cy="139" r="3" />
            <circle cx="258" cy="140" r="3" />
            <circle cx="273" cy="146" r="3" />
            <circle cx="234" cy="157" r="3" />
            <circle cx="252" cy="158" r="3" />
            <circle cx="265" cy="162" r="3" />
          </g>
          <g className={styles.dial}>
            <circle cx="101" cy="162" r="22" />
            <circle cx="101" cy="162" r="12" />
            <path d="m101 148 7-7" />
          </g>
          <g className={styles.volume}>
            <circle cx="157" cy="162" r="16" />
            <path d="M157 150v-6" />
          </g>
          <path className={styles.feet} d="M75 206v10m196-10v10" />
          <g className={styles.staticLines}>
            <path d="M201 43h23" />
            <path d="M230 35h17" />
            <path d="M253 46h28" />
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
