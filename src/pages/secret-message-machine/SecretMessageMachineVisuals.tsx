import type { CSSProperties } from 'react'
import type { CapsuleColor, SecretMessage } from './secretMessageContent.ts'
import type { MachinePhase } from './secretMessageReducer.ts'
import styles from './SecretMessageMachinePage.module.css'

type MachineVisualProps = {
  phase: MachinePhase
  rotation: number
  capsuleColor: CapsuleColor | null
  cycleId: number
}

export function CapsuleSymbol({ symbol }: { symbol: SecretMessage['tinySymbol'] }) {
  const common = { 'aria-hidden': true, focusable: 'false' } as const
  if (symbol === 'flower') return <svg viewBox="0 0 24 24" {...common}><circle cx="12" cy="7" r="3" /><circle cx="17" cy="12" r="3" /><circle cx="12" cy="17" r="3" /><circle cx="7" cy="12" r="3" /><circle cx="12" cy="12" r="2" /></svg>
  if (symbol === 'cloud') return <svg viewBox="0 0 24 24" {...common}><path d="M5 17h13a3.5 3.5 0 0 0 .2-7A5.5 5.5 0 0 0 8 9.5 3.8 3.8 0 0 0 5 17Z" /></svg>
  if (symbol === 'envelope') return <svg viewBox="0 0 24 24" {...common}><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg>
  if (symbol === 'star' || symbol === 'spark') return <svg viewBox="0 0 24 24" {...common}><path d="m12 3 1.8 6.9L21 12l-7.2 2.1L12 21l-1.8-6.9L3 12l7.2-2.1Z" /></svg>
  if (symbol === 'heart') return <svg viewBox="0 0 24 24" {...common}><path d="M12 20S4 15.1 4 9.4C4 6.7 6 5 8.5 5c1.7 0 2.9.9 3.5 2  .6-1.1 1.8-2 3.5-2C18 5 20 6.7 20 9.4 20 15.1 12 20 12 20Z" /></svg>
  if (symbol === 'note') return <svg viewBox="0 0 24 24" {...common}><path d="M15 5v11.2a3 3 0 1 1-2-2.8V8l6-1.5v8.7a3 3 0 1 1-2-2.8V5Z" /></svg>
  return <svg viewBox="0 0 24 24" {...common}><path d="M5 5h14v10H9l-4 4Z" /><path d="M8 9h8m-8 3h5" /></svg>
}

export function CapsuleMachineVisual({ phase, rotation, capsuleColor, cycleId }: MachineVisualProps) {
  const dispensing = phase === 'dispensing'
  const ready = phase === 'capsule-ready' || phase === 'revealing'
  const active = phase === 'turning' || dispensing || ready

  return (
    <div className={styles.machineVisual} data-phase={phase}>
      <div className={styles.machineTopSign}>WORDS IN STORAGE</div>
      <div className={styles.machineCase}>
        <span className={styles.machineScrew} data-position="top-left" aria-hidden="true" />
        <span className={styles.machineScrew} data-position="top-right" aria-hidden="true" />
        <div className={styles.poster} aria-hidden="true">
          <span>TURN WHEN THE</span><strong>WORDS GET STUCK</strong><i>✦</i>
        </div>
        <div className={styles.chamber} aria-hidden="true">
          <div className={styles.chamberGlass} />
          <Capsule color="peach" position="one" />
          <Capsule color="mint" position="two" />
          <Capsule color="lavender" position="three" />
          <Capsule color="cream" position="four" />
          <Capsule color="gold" position="five" />
          {dispensing ? <Capsule color={capsuleColor ?? 'peach'} position="falling" cycleId={cycleId} /> : null}
        </div>
        <div className={styles.machineStickerRow} aria-hidden="true">
          <span>☁</span><span>✦</span><span>✿</span><span>⌁</span>
        </div>
        <div className={styles.machineControlPlate}>
          <div className={styles.slot} aria-hidden="true"><span /></div>
          <div className={styles.lamp} data-active={active} aria-hidden="true"><i /></div>
          <div className={styles.knobPlaceholder} style={{ '--knob-rotation': `${rotation + (phase === 'turning' ? 110 : 0)}deg` } as CSSProperties} aria-hidden="true"><span /><i /></div>
        </div>
        <p className={styles.machineSlogan}>ONE TRUTH PER TURN</p>
        <div className={styles.outputBay} data-ready={ready} aria-hidden="true">
          <span className={styles.outputLip} />
          {ready ? <Capsule color={capsuleColor ?? 'peach'} position="output" cycleId={cycleId} /> : <span className={styles.outputEmpty}>WAITING</span>}
        </div>
        <div className={styles.machineLabelRow}><span>FOR GUSTI</span><span>FROM ANDRE</span><span>SERIAL A–N 111</span></div>
      </div>
    </div>
  )
}

function Capsule({ color, position, cycleId }: { color: CapsuleColor; position: string; cycleId?: number }) {
  return <span className={styles.capsule} data-color={color} data-position={position} data-cycle={cycleId}><i /><b /></span>
}
