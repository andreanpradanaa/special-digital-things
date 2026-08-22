import type { ArtifactVisualKey } from './lostAndFoundContent.ts'
import styles from './LostAndFoundPage.module.css'

export function OfficeStillLife() {
  return (
    <div className={styles.officeStillLife} aria-hidden="true">
      <svg viewBox="0 0 420 300" focusable="false">
        <rect className={styles.officeWall} x="20" y="18" width="380" height="240" rx="8" />
        <path className={styles.windowGlow} d="M287 30h85v132h-85z" />
        <path className={styles.windowBars} d="M329 30v132M287 96h85" />
        <rect className={styles.officeCabinet} x="52" y="56" width="132" height="177" rx="4" />
        <path className={styles.cabinetDrawers} d="M63 90h110M63 126h110M63 162h110M63 198h110" />
        <path className={styles.cabinetKnobs} d="M116 106h5m-5 36h5m-5 36h5m-5 36h5" />
        <path className={styles.counter} d="M24 230h372v47H24z" />
        <path className={styles.counterEdge} d="M24 230h372" />
        <path className={styles.lamp} d="M244 222v-82m-35 0h70l-17-45h-37zM230 222h29" />
        <path className={styles.envelope} d="m96 224 59-38 59 38v-48H96z" />
        <circle className={styles.bell} cx="323" cy="215" r="17" />
        <path className={styles.bellBase} d="M296 232h54" />
      </svg>
    </div>
  )
}

type ArtifactVisualProps = { visualKey: ArtifactVisualKey }

export function ArtifactVisual({ visualKey }: ArtifactVisualProps) {
  switch (visualKey) {
    case 'sound-jar':
      return <SoundJar />
    case 'pressed-flower':
      return <PressedFlower />
    case 'courage-token':
      return <CourageToken />
    case 'folded-map':
      return <FoldedMap />
    case 'heart-locket':
      return <HeartLocket />
  }
}

function SoundJar() {
  return (
    <svg className={styles.artifactSvg} viewBox="0 0 230 190" aria-hidden="true" focusable="false">
      <path className={styles.jarLid} d="M65 42h100v19H65z" />
      <path className={styles.jarBody} d="M73 61h84l10 88c-25 19-79 19-104 0Z" />
      <path className={styles.soundLines} d="M91 112c8-21 16 21 24 0s16 21 24 0 16 21 24 0" />
      <path className={styles.soundLines} d="M90 128c12-13 18 13 28 0s18 13 28 0 18 13 28 0" />
      <path className={styles.jarLabel} d="M87 75h56v22H87z" />
      <text className={styles.artifactText} x="115" y="89">LAUGHTER</text>
    </svg>
  )
}

function PressedFlower() {
  return (
    <svg className={styles.artifactSvg} viewBox="0 0 230 190" aria-hidden="true" focusable="false">
      <path className={styles.flowerPaper} d="m45 25 135 14-15 128-135-14Z" />
      <path className={styles.flowerStem} d="M113 143c4-31 4-61-4-90" />
      <path className={styles.flowerPetals} d="M109 62c-22-17-7-34 7-16 10-23 29-7 12 10 27 0 21 22 2 17 6 22-17 23-17 2-20 13-28-8-8-15Z" />
      <path className={styles.flowerStem} d="m111 112-22-14m23 24 24-15" />
      <text className={styles.artifactText} x="106" y="151">SUNDAY / 4:16 PM</text>
    </svg>
  )
}

function CourageToken() {
  return (
    <svg className={styles.artifactSvg} viewBox="0 0 230 190" aria-hidden="true" focusable="false">
      <path className={styles.tokenShadow} d="M51 137c35 20 94 20 129 0" />
      <circle className={styles.token} cx="115" cy="94" r="55" />
      <circle className={styles.tokenInner} cx="115" cy="94" r="42" />
      <path className={styles.tokenMark} d="m94 94 14 14 29-31" />
      <text className={styles.artifactText} x="115" y="137">BRAVE ENOUGH</text>
    </svg>
  )
}

function FoldedMap() {
  return (
    <svg className={styles.artifactSvg} viewBox="0 0 230 190" aria-hidden="true" focusable="false">
      <path className={styles.mapPaper} d="m45 43 48-14 48 15 44-14v116l-44 14-48-15-48 14Z" />
      <path className={styles.mapFold} d="M93 29v116m48-101v116" />
      <path className={styles.mapRoute} d="M65 116c24-43 38 13 64-24 22-31 27 14 41-31" />
      <path className={styles.mapPin} d="M145 68c0 12-17 22-17 22s-17-10-17-22a17 17 0 1 1 34 0Z" />
      <circle className={styles.mapPin} cx="128" cy="68" r="4" />
    </svg>
  )
}

function HeartLocket() {
  return (
    <svg className={styles.artifactSvg} viewBox="0 0 230 190" aria-hidden="true" focusable="false">
      <path className={styles.locketChain} d="M115 22c-45 0-59 45-27 66" />
      <path className={styles.locket} d="M115 158c-40-31-68-57-68-87 0-24 17-40 39-40 14 0 25 7 29 18 5-11 16-18 30-18 22 0 39 16 39 40 0 30-29 57-69 87Z" />
      <path className={styles.locketInlay} d="M115 142c-31-25-51-45-51-68 0-14 10-25 23-25 13 0 22 8 28 19 6-11 15-19 28-19 14 0 23 11 23 25 0 23-20 43-51 68Z" />
      <text className={styles.artifactText} x="115" y="103">A + N</text>
    </svg>
  )
}
