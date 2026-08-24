import type { RefObject } from 'react'
import type {
  HeartCondition,
  HeartToolVisualKey,
} from './heartRepairContent.ts'
import styles from './HeartRepairPage.module.css'

type HeartCharacterProps = {
  condition?: HeartCondition
  recipientName: string
  repaired?: boolean
  targetRef?: RefObject<HTMLDivElement | null>
}

export function HeartCharacter({
  condition,
  recipientName,
  repaired = false,
  targetRef,
}: HeartCharacterProps) {
  return (
    <div
      className={styles.heartTarget}
      data-condition={condition?.id ?? 'neutral'}
      data-repaired={repaired}
      data-testid={targetRef ? 'repair-target' : undefined}
      ref={targetRef}
    >
      <svg
        className={styles.heartCharacter}
        viewBox="0 0 310 310"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse className={styles.heartShadow} cx="155" cy="282" rx="102" ry="14" />
        <path className={styles.heartLeg} d="M118 233v39m76-39v39" />
        <path className={styles.heartShoe} d="M101 275h31m46 0h31" />
        <path
          className={styles.heartBody}
          d="M155 242C113 207 67 169 67 111c0-39 28-65 62-65 24 0 43 12 51 31 9-19 28-31 52-31 34 0 61 26 61 65 0 58-47 96-138 131Z"
        />
        <path className={styles.heartHighlight} d="M104 102c5-21 20-35 39-40" />
        <g className={styles.heartFace}>
          <path d="M124 139v2m62-2v2" />
          <path d="M143 164c7 6 17 6 24 0" />
        </g>
        <g className={styles.batteryIndicator}>
          <rect x="201" y="166" width="30" height="48" rx="6" />
          <path d="M209 162v-7m14 7v-7" />
          <rect className={styles.batteryFill} x="207" y="190" width="18" height="18" rx="2" />
        </g>
        <g className={styles.scribbles}>
          <path d="M69 93c-24-17 13-24-4-38 29-14 20 17 42 0" />
          <path d="M200 47c9-24 29 6 35-18 14 20-7 23 11 40" />
          <path d="M37 146c-17-8 5-19-8-28 24-5 17 17 35 10" />
        </g>
        <g className={styles.crack}>
          <path d="m164 111-13 29 14 7-16 32" />
          <path d="m151 140-17-8" />
        </g>
        <g className={styles.hugPatch}>
          <path d="M129 128c12-12 28-8 34 3 7-11 23-15 35-3 14 15-2 32-35 52-32-20-48-37-34-52Z" />
          <path d="m146 145 34 21m-29-27 34 21" />
        </g>
        <g className={styles.memoryTape}>
          <path d="M90 177c26-19 92-21 131-1l-7 27c-38-15-85-12-119 2Z" />
          <path d="M114 183c9 0 11 11 20 11s11-11 20-11 11 11 20 11 11-11 20-11" />
          <path d="M104 164h2m101-14h2m-6 72h2" />
        </g>
        <g className={styles.memoryMarks}>
          <path d="M231 119v-14m-7 7h14" />
          <path d="M82 218v-12m-6 6h12" />
        </g>
      </svg>
      <span className="visually-hidden">
        {condition
          ? `Hati ${recipientName} dengan kondisi ${condition.label}`
          : `Hati ${recipientName} sedang menunggu pemeriksaan`}
      </span>
    </div>
  )
}

type ToolVisualProps = {
  visualKey: HeartToolVisualKey
}

export function ToolVisual({ visualKey }: ToolVisualProps) {
  switch (visualKey) {
    case 'recharge-cable':
      return (
        <svg viewBox="0 0 160 130" aria-hidden="true" focusable="false">
          <path d="M24 93c10-24 29-30 52-17 17 9 31 9 43-2" />
          <rect x="93" y="54" width="34" height="48" rx="7" />
          <path d="M101 54v-10m18 10v-10" />
          <path d="m110 65-9 15h8l-4 12 14-17h-8l3-10Z" />
          <rect x="17" y="82" width="20" height="23" rx="4" />
          <path d="M22 82V72m10 10V72" />
        </svg>
      )
    case 'quiet-mist':
      return (
        <svg viewBox="0 0 160 130" aria-hidden="true" focusable="false">
          <path d="M71 35h21v19H71Z" />
          <path d="M79 35V21h37v11H92" />
          <rect x="56" y="53" width="52" height="56" rx="13" />
          <path d="M68 74c7-11 13 8 20-5 8 13 16-3 22 7" />
          <path d="M118 33c15-8 23-4 30 2m-22 10c13-2 19 2 25 9" />
        </svg>
      )
    case 'hug-patch':
      return (
        <svg viewBox="0 0 160 130" aria-hidden="true" focusable="false">
          <path d="M80 111C45 88 25 68 25 45c0-17 12-29 28-29 12 0 22 7 27 18 6-11 16-18 28-18 16 0 28 12 28 29 0 23-21 43-56 66Z" />
          <path d="m49 48 62 38M45 59l54 33M61 34l51 31" />
          <path d="M42 39h8m60 51h8m-21-72v8" />
        </svg>
      )
    case 'memory-tape':
      return (
        <svg viewBox="0 0 160 130" aria-hidden="true" focusable="false">
          <circle cx="63" cy="65" r="38" />
          <circle cx="63" cy="65" r="15" />
          <path d="M100 55h38v25h-24" />
          <path d="M104 83c12 4 19 10 27 19" />
          <path d="M45 52c8 0 10 10 17 10s10-10 17-10 10 10 17 10" />
          <path d="M51 80h3m21 13h3m18-15h3" />
        </svg>
      )
  }
}
