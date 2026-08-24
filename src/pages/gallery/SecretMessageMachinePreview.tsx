import { Link } from 'react-router'
import { getThemeById } from '../../app/themeRegistry.ts'
import previewStyles from './GalleryPreview.module.css'
import styles from './SecretMessageMachinePreview.module.css'

export function SecretMessageMachinePreview() {
  const theme = getThemeById('secret-message-machine')

  return (
    <Link className={`${previewStyles.link} ${styles.link}`} to={theme.path} aria-label={`${theme.title}. ${theme.summary} ${theme.previewAction}`}>
      <span className={`${previewStyles.visual} ${styles.visual}`}>
        <span className={styles.machine} aria-hidden="true">
          <span className={styles.topLabel}>WORDS IN STORAGE</span>
          <span className={styles.case}>
            <span className={styles.poster}>TURN WHEN THE<br />WORDS GET STUCK</span>
            <span className={styles.chamber}><i data-capsule="peach" /><i data-capsule="mint" /><i data-capsule="lavender" /><i data-capsule="gold" /></span>
            <span className={styles.control}><i className={styles.slot} /><i className={styles.lamp} /><i className={styles.knob} /></span>
            <span className={styles.output}><i data-capsule="cream" /></span>
          </span>
        </span>
      </span>
      <span className={previewStyles.copy}>
        <span className={previewStyles.title}>{theme.title}</span>
        <span className={previewStyles.description}>{theme.summary}</span>
        <span className={previewStyles.action}>{theme.previewAction}<span className={previewStyles.arrow} aria-hidden="true">→</span></span>
      </span>
    </Link>
  )
}
