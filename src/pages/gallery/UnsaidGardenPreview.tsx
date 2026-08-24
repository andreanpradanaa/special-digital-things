import { Link } from 'react-router'
import { getThemeById } from '../../app/themeRegistry.ts'
import previewStyles from './GalleryPreview.module.css'
import styles from './UnsaidGardenPreview.module.css'

export function UnsaidGardenPreview() {
  const theme = getThemeById('unsaid-garden')
  return <Link className={`${previewStyles.link} ${styles.link}`} to={theme.path} aria-label={`${theme.title}. ${theme.summary} ${theme.previewAction}`}>
    <span className={previewStyles.visual}><svg className={styles.greenhouse} viewBox="0 0 390 245" aria-hidden="true" focusable="false"><path className={styles.frame} d="M35 218V94l160-67 160 67v124M35 94h320M195 27v191M77 77v141m236-141v141M26 223h338"/><path className={styles.glass} d="M41 100h148v112H41zm160 0h148v112H201z"/><path className={styles.soil} d="M76 193c33-18 99-18 132 0 35-18 86-18 111 0v20H76z"/><path className={styles.stem} d="M195 193v-72"/><path className={styles.leaf} d="m194 155-29-17m30-3 28-17"/><circle className={styles.bud} cx="195" cy="109" r="20"/><path className={styles.tag} d="M54 114h54v30H54z"/><text className={styles.tagText} x="81" y="133">FOR GUSTI</text><path className={styles.envelope} d="M255 162h75v44h-75zM255 162l37 28 38-28"/></svg></span><span className={previewStyles.copy}><span className={previewStyles.title}>{theme.title}</span><span className={previewStyles.description}>{theme.summary}</span><span className={previewStyles.action}>{theme.previewAction}<span className={previewStyles.arrow} aria-hidden="true">→</span></span></span></Link>
}
