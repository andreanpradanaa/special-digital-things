import styles from './UnsaidGardenPage.module.css'
import type { SeedRecord, SeedVisualKey } from './unsaidGardenContent.ts'

export function GreenhouseVisual({
  seed,
  planted = false,
  watered = false,
  illuminated = false,
  bloomed = false,
  preserved = [],
}: {
  seed?: SeedRecord
  planted?: boolean
  watered?: boolean
  illuminated?: boolean
  bloomed?: boolean
  preserved?: readonly SeedRecord[]
}) {
  return <div className={styles.greenhouse} data-watered={watered} data-warmed={illuminated} data-bloomed={bloomed}>
    <svg className={styles.houseSvg} viewBox="0 0 420 310" aria-hidden="true" focusable="false"><path d="M48 278V109l162-77 162 77v169M48 109h324M210 32v246M48 278h324M92 86v192m236-192v192" /><path d="M18 285h384" /></svg>
    <span className={styles.glassLight} aria-hidden="true" />
    <span className={styles.botanicalTag}>FOR NARA</span>
    <span className={styles.sunWheel} aria-hidden="true">☼</span>
    <div className={styles.soilBed} data-testid="soil-bed"><span className={styles.soilLabel}>SOIL BED / PATIENCE</span>{planted && seed ? <FlowerVisual visualKey={seed.visualKey} bloomed={bloomed} /> : null}{preserved.map((item) => <span className={styles.tinyBloom} data-accent={item.accent} key={item.id} />)}</div>
    <span className={styles.wateringCan} aria-hidden="true">⌇</span>
  </div>
}

export function FlowerVisual({ visualKey, bloomed }: { visualKey: SeedVisualKey; bloomed: boolean }) {
  return <span className={styles.flower} data-flower={visualKey} data-bloomed={bloomed} aria-hidden="true"><i className={styles.stem} /><i className={styles.leafOne} /><i className={styles.leafTwo} /><b className={styles.blossom} /></span>
}
