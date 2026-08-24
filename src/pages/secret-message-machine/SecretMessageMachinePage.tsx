import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, type PointerEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'
import { getSecretMessage } from './secretMessageContent.ts'
import { freshMessageDeck } from './messageDeck.ts'
import { CapsuleMachineVisual } from './SecretMessageMachineVisuals.tsx'
import { createInitialMachineState, secretMessageMachineReducer } from './secretMessageReducer.ts'
import styles from './SecretMessageMachinePage.module.css'

const phaseCopy = {
  idle: 'Putar knob untuk meminta satu kata yang disimpan Andre.',
  turning: 'Mesin sedang memilih satu pesan.',
  dispensing: 'Satu kapsul sedang menuju kompartemen.',
  'capsule-ready': 'Satu pesan menunggu di kompartemen.',
  revealing: 'Pesan rahasia sedang dibaca.',
} as const

type PointerState = { id: number; angle: number; rotation: number; triggered: boolean }

function pointerAngle(event: PointerEvent<HTMLButtonElement>) {
  const bounds = event.currentTarget.getBoundingClientRect()
  return Math.atan2(event.clientY - (bounds.top + bounds.height / 2), event.clientX - (bounds.left + bounds.width / 2)) * (180 / Math.PI)
}

function clampRotation(rotation: number) {
  return Math.max(-150, Math.min(150, rotation))
}

export function SecretMessageMachinePage() {
  const [state, dispatch] = useReducer(secretMessageMachineReducer, undefined, () => createInitialMachineState(freshMessageDeck()))
  const shouldReduceMotion = useReducedMotion()
  const phaseHeadingRef = useRef<HTMLHeadingElement>(null)
  const turnButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const pointerRef = useRef<PointerState | null>(null)
  const message = state.currentMessageId ? getSecretMessage(state.currentMessageId) : null

  const startTurn = useCallback(() => {
    const deck = state.remainingMessageIds.length > 0 ? state.remainingMessageIds : freshMessageDeck()
    const next = deck[0]
    if (!next) return
    dispatch({ type: 'START_TURN', deck: freshMessageDeck(), capsuleColor: getSecretMessage(next).capsuleColor })
  }, [state.remainingMessageIds])

  useEffect(() => {
    if (state.phase !== 'turning' && state.phase !== 'dispensing') return undefined
    const cycleId = state.cycleId
    const delay = shouldReduceMotion ? 0 : state.phase === 'turning' ? 180 : 420
    const timer = window.setTimeout(() => {
      dispatch({ type: state.phase === 'turning' ? 'COMPLETE_TURN' : 'COMPLETE_DISPENSE', cycleId })
    }, delay)
    return () => window.clearTimeout(timer)
  }, [shouldReduceMotion, state.cycleId, state.phase])

  useLayoutEffect(() => {
    if (state.phase !== 'idle') phaseHeadingRef.current?.focus({ preventScroll: true })
  }, [state.phase])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined
    if (state.phase === 'revealing') {
      const frame = window.requestAnimationFrame(() => {
        if (!dialog.open) dialog.showModal()
        closeButtonRef.current?.focus()
      })
      return () => window.cancelAnimationFrame(frame)
    }
    if (dialog.open) dialog.close()
    return undefined
  }, [state.phase])

  const releasePointer = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    pointerRef.current = null
  }

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (state.phase !== 'idle') return
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      // Synthetic pointer events used by assistive test environments do not always own a pointer capture.
    }
    pointerRef.current = { id: event.pointerId, angle: pointerAngle(event), rotation: 0, triggered: false }
  }

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const pointer = pointerRef.current
    if (!pointer || pointer.id !== event.pointerId || state.phase !== 'idle') return
    const nextAngle = pointerAngle(event)
    let delta = nextAngle - pointer.angle
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    pointer.angle = nextAngle
    pointer.rotation = clampRotation(pointer.rotation + delta)
    dispatch({ type: 'UPDATE_ROTATION', rotation: pointer.rotation })
    if (Math.abs(pointer.rotation) >= 72 && !pointer.triggered) {
      pointer.triggered = true
      startTurn()
      releasePointer(event)
    }
  }

  const finishMessage = () => {
    dispatch({ type: 'CLOSE_MESSAGE' })
    window.requestAnimationFrame(() => turnButtonRef.current?.focus({ preventScroll: true }))
  }

  return (
    <section className={styles.page} data-phase={state.phase}>
      <header className={styles.header}>
        <Link to="/">← Kembali ke koleksi</Link>
        <p>Secret Message Machine</p>
      </header>
      <p className="visually-hidden" aria-live="polite" aria-atomic="true">{state.liveAnnouncement}</p>

      <div className={styles.intro}>
        <p className={styles.eyebrow}>PRIVATE MESSAGE DISPENSER</p>
        <h1>Secret Message</h1>
        <p className={styles.body}>Putar mesin kecil ini ketika ada sesuatu yang sulit dikatakan.</p>
      </div>

      <div className={styles.machineStage} aria-labelledby="machine-status">
        <h2 className={styles.phaseHeading} id="machine-status" ref={phaseHeadingRef} tabIndex={-1}>{phaseCopy[state.phase]}</h2>
        <motion.div
          className={styles.machineFrame}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <CapsuleMachineVisual phase={state.phase} rotation={state.pointerRotation} capsuleColor={state.currentCapsule} cycleId={state.cycleId} />
          <button
            className={styles.knobGesture}
            type="button"
            aria-label="Putar knob secara melingkar untuk meminta pesan"
            aria-describedby="knob-help"
            disabled={state.phase !== 'idle'}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={releasePointer}
            onPointerCancel={releasePointer}
            onClick={startTurn}
          >
            <span aria-hidden="true" />
          </button>
          <button className={styles.turnButton} ref={turnButtonRef} type="button" disabled={state.phase !== 'idle'} onClick={startTurn}>Putar knob</button>
          <p className={styles.knobHelp} id="knob-help">Geser knob melingkar, atau gunakan tombol putar. Satu putaran menyimpan satu pesan.</p>
          <button className={styles.outputButton} data-testid="machine-output" type="button" disabled={state.phase !== 'capsule-ready'} onClick={() => dispatch({ type: 'OPEN_CAPSULE' })} aria-label="Buka kapsul pesan untuk Gusti" aria-describedby="output-help">Buka kapsul</button>
          <p className={styles.outputHelp} id="output-help">{state.phase === 'capsule-ready' ? 'Satu pesan menunggu.' : 'Kompartemen akan terbuka setelah kapsul tersedia.'}</p>
          <p className={styles.cycleCounter}>CYCLE {String(state.cycleId).padStart(2, '0')} · {state.revealedMessageIds.length} / 8 WORDS RELEASED</p>
          <p className={styles.secondaryText}>ONE SMALL TRUTH IS WAITING INSIDE</p>
        </motion.div>
      </div>

      <dialog className={styles.messageDialog} ref={dialogRef} aria-labelledby="secret-message-title" onClose={finishMessage}>
        <article className={styles.messageNote}>
          <p className={styles.dialogEyebrow}>ONE SMALL TRUTH</p>
          <h2 id="secret-message-title">You got a secret message.</h2>
          <p className={styles.messageBody}>“{message?.message}”</p>
          <p className={styles.signature}>— Andre</p>
          <button ref={closeButtonRef} type="button" onClick={() => dialogRef.current?.close()}>Simpan pesan ini</button>
        </article>
      </dialog>
    </section>
  )
}
