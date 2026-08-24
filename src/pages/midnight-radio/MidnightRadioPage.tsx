import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'
import { broadcasts, getBroadcast, radioFrequencyRange } from './midnightRadioContent.ts'
import {
  getCurrentSignal,
  initialMidnightRadioState,
  midnightRadioReducer,
} from './midnightRadioReducer.ts'
import { formatFrequency, getNarrativeTime, getSignalAriaText, getSignalStatus } from './midnightRadioSignal.ts'
import { RadioConsole, Waveform } from './MidnightRadioVisuals.tsx'
import styles from './MidnightRadioPage.module.css'

function useRadioAmbience() {
  const contextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  const stop = useCallback(() => {
    oscillatorRef.current?.stop()
    oscillatorRef.current?.disconnect()
    gainRef.current?.disconnect()
    void contextRef.current?.close()
    oscillatorRef.current = null
    gainRef.current = null
    contextRef.current = null
  }, [])

  const start = useCallback(async () => {
    try {
      stop()
      const AudioContextConstructor = window.AudioContext
      if (!AudioContextConstructor) return false
      const context = new AudioContextConstructor()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'triangle'
      oscillator.frequency.value = 82
      gain.gain.value = 0.006
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start()
      await context.resume()
      contextRef.current = context
      oscillatorRef.current = oscillator
      gainRef.current = gain
      return true
    } catch {
      stop()
      return false
    }
  }, [stop])

  useEffect(() => stop, [stop])
  return { start, stop }
}

const phaseAnnouncements = {
  arrival: 'Radio pribadi untuk Gusti dalam keadaan mati. Jam menunjukkan 11:08 PM.',
  tuning: 'Radio menyala. Cari sinyal pertama pada skala frekuensi.',
  fragment: 'Satu potongan siaran telah diterima.',
  'private-unlock': 'PRIVATE 11:11 telah terbuka.',
  'final-broadcast': 'Pesan pribadi Andre untuk Gusti sedang mengudara.',
  qsl: 'Kartu QSL penerimaan siaran sudah siap disimpan.',
} as const

export function MidnightRadioPage() {
  const [state, dispatch] = useReducer(midnightRadioReducer, initialMidnightRadioState)
  const shouldReduceMotion = useReducedMotion()
  const { start: startAmbience, stop: stopAmbience } = useRadioAmbience()
  const currentSignalId = getCurrentSignal(state)
  const currentBroadcast = currentSignalId ? getBroadcast(currentSignalId) : null
  const signalStatus = getSignalStatus(state.frequency, currentBroadcast)

  useEffect(() => {
    if (!state.audioEnabled) stopAmbience()
  }, [state.audioEnabled, stopAmbience])

  const toggleAudio = async () => {
    if (state.audioEnabled) {
      stopAmbience()
      dispatch({ type: 'SET_AUDIO', enabled: false })
      return
    }

    const started = await startAmbience()
    dispatch({ type: 'SET_AUDIO', enabled: started })
  }

  const replay = () => {
    stopAmbience()
    dispatch({ type: 'RESET' })
  }

  const sceneMotion = shouldReduceMotion
    ? { initial: false as const }
    : { initial: { opacity: 0, y: 12 } }

  return (
    <section className={styles.radioRoom} data-phase={state.phase}>
      <div className={styles.roomHeader}>
        <Link className={styles.exitLink} to="/">← Kembali ke koleksi</Link>
        <p>11:11 Midnight Radio</p>
      </div>

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {phaseAnnouncements[state.phase]}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {state.phase === 'arrival' ? <SceneMotion key="arrival" reduce={shouldReduceMotion} {...sceneMotion}><Arrival onPower={() => dispatch({ type: 'POWER_ON' })} /></SceneMotion> : null}
        {state.phase === 'tuning' ? <SceneMotion key="tuning" reduce={shouldReduceMotion} {...sceneMotion}><Tuning state={state} broadcast={currentBroadcast} status={signalStatus} onFrequency={(frequency) => dispatch({ type: 'SET_FREQUENCY', frequency })} onCapture={() => dispatch({ type: 'CAPTURE_SIGNAL' })} onAudio={toggleAudio} /></SceneMotion> : null}
        {state.phase === 'fragment' ? <SceneMotion key={`fragment-${state.activeSignalId}`} reduce={shouldReduceMotion} {...sceneMotion}><Fragment broadcast={getBroadcast(state.activeSignalId)} receivedCount={state.receivedSignalIds.length} onReturn={() => dispatch({ type: 'RETURN_TO_TUNER' })} /></SceneMotion> : null}
        {state.phase === 'private-unlock' ? <SceneMotion key="private" reduce={shouldReduceMotion} {...sceneMotion}><PrivateUnlock onOpen={() => dispatch({ type: 'OPEN_FINAL_BROADCAST' })} /></SceneMotion> : null}
        {state.phase === 'final-broadcast' ? <SceneMotion key="final" reduce={shouldReduceMotion} {...sceneMotion}><FinalBroadcast onConfirm={() => dispatch({ type: 'CONFIRM_MESSAGE' })} /></SceneMotion> : null}
        {state.phase === 'qsl' ? <SceneMotion key="qsl" reduce={shouldReduceMotion} {...sceneMotion}><QslCard onReplay={replay} /></SceneMotion> : null}
      </AnimatePresence>
    </section>
  )
}

function SceneMotion({ children, reduce }: { children: ReactNode; reduce: boolean | null }) {
  return <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.26, ease: 'easeOut' }}>{children}</motion.div>
}

function SceneTitle({ children, focus = true }: { children: ReactNode; focus?: boolean }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => { if (focus) titleRef.current?.focus({ preventScroll: true }) }, [focus])
  return <h1 className={styles.sceneTitle} ref={titleRef} tabIndex={-1}>{children}</h1>
}

function Arrival({ onPower }: { onPower: () => void }) {
  return <div className={styles.arrival}><div className={styles.arrivalCopy}><p className={styles.kicker}>PRIVATE BROADCAST / FOR GUSTI</p><SceneTitle focus={false}>Ada satu siaran yang hanya muncul saat dunia sudah tenang.</SceneTitle><p className={styles.body}>Tiga sinyal kecil sedang mencari jalan menuju pukul 11:11.</p><button className={styles.primaryAction} type="button" onClick={onPower}>Nyalakan radio <span aria-hidden="true">→</span></button></div><div className={styles.radioStage}><RadioConsole frequency="88.0" time="11:08 PM" status="STATIC" powered={false} receivedCount={0} /><p className={styles.offLabel}>SPEAKER / SILENT</p></div></div>
}

function Tuning({ state, broadcast, status, onFrequency, onCapture, onAudio }: { state: Exclude<ReturnType<typeof midnightRadioReducer>, { phase: 'arrival' }>; broadcast: ReturnType<typeof getBroadcast> | null; status: ReturnType<typeof getSignalStatus>; onFrequency: (frequency: number) => void; onCapture: () => void; onAudio: () => void }) {
  const frequency = formatFrequency(state.frequency)
  const locked = status === 'SIGNAL LOCKED'
  return <div className={styles.tuningScene}><div className={styles.tuningCopy}><p className={styles.kicker}>MIDNIGHT TUNER / {getNarrativeTime(state.receivedSignalIds.length)}</p><SceneTitle>Cari tiga suara kecil di antara static.</SceneTitle><p className={styles.body}>Catatan siaran menunjukkan frekuensi berikutnya: <strong>{broadcast ? `${formatFrequency(broadcast.frequency)} FM — ${broadcast.callSign}` : 'semua sinyal telah diterima'}</strong>.</p><BroadcastLog received={state.receivedSignalIds} /><div className={styles.statusLine}><span>STATUS SINYAL</span><strong data-locked={locked}>{status}</strong><p>{locked ? 'Siaran sudah jelas. Tangkap sebelum ia menghilang.' : 'Putar dial perlahan sampai sinyal terasa jelas.'}</p></div></div><div className={styles.radioStage}><RadioConsole frequency={frequency} time={getNarrativeTime(state.receivedSignalIds.length)} status={status} powered receivedCount={state.receivedSignalIds.length} /><div className={styles.controls}><label htmlFor="radio-frequency">Putar tuning dial</label><input id="radio-frequency" type="range" min={radioFrequencyRange.min} max={radioFrequencyRange.max} step={radioFrequencyRange.step} value={state.frequency} aria-valuetext={getSignalAriaText(state.frequency, broadcast)} aria-describedby="frequency-help" onChange={(event) => onFrequency(Number(event.target.value))} /><p id="frequency-help"><output>{frequency} FM</output> · gunakan tombol panah atau geser dial. Status: {status}.</p><div className={styles.stepControls}><button type="button" onClick={() => onFrequency(state.frequency - 1)}>Turunkan 0.1</button><button type="button" onClick={() => onFrequency(state.frequency + 1)}>Naikkan 0.1</button></div><div className={styles.controlActions}><button className={styles.primaryAction} type="button" disabled={!locked} onClick={onCapture}>Tangkap siaran</button><button className={styles.soundButton} type="button" aria-pressed={state.audioEnabled} onClick={onAudio}>{state.audioEnabled ? 'Matikan suara' : 'Aktifkan suara'}</button></div></div></div></div>
}

function BroadcastLog({ received }: { received: readonly string[] }) {
  return <ol className={styles.broadcastLog} aria-label="Broadcast log">
    {broadcasts.map((broadcast, index) => <li data-received={received.includes(broadcast.id)} key={broadcast.id}><span>0{index + 1}</span><strong>{broadcast.callSign}</strong><em>{received.includes(broadcast.id) ? 'RECEIVED' : `${formatFrequency(broadcast.frequency)} FM`}</em></li>)}
  </ol>
}

function Fragment({ broadcast, receivedCount, onReturn }: { broadcast: ReturnType<typeof getBroadcast>; receivedCount: number; onReturn: () => void }) {
  return <div className={styles.fragmentScene}><div className={styles.radioStage}><RadioConsole frequency={formatFrequency(broadcast.frequency)} time={getNarrativeTime(receivedCount)} status="SIGNAL LOCKED" powered receivedCount={receivedCount} /><div className={styles.fragmentScreen}><p>TRANSMISSION FRAGMENT 0{receivedCount}</p><Waveform active /><span>{broadcast.callSign}</span></div></div><article className={styles.fragmentPaper}><p className={styles.kicker}>BROADCAST RECEIVED</p><SceneTitle>{broadcast.revealHeading}</SceneTitle><p className={styles.transcript}>“{broadcast.transcript}”</p><p className={styles.fragmentLabel}>FILED UNDER / {broadcast.callSign}</p><button className={styles.primaryAction} type="button" onClick={onReturn}>Kembali ke frekuensi <span aria-hidden="true">→</span></button></article></div>
}

function PrivateUnlock({ onOpen }: { onOpen: () => void }) {
  return <div className={styles.privateScene}><div className={styles.radioStage}><RadioConsole frequency="11:11" time="11:11 PM" status="SIGNAL LOCKED" powered privateChannel onAir receivedCount={3} /><Waveform active /></div><article className={styles.privatePaper}><p className={styles.kicker}>PRIVATE FREQUENCY FOUND</p><SceneTitle>Sekarang hanya tersisa satu suara.</SceneTitle><p className={styles.body}>Frekuensi ini tidak tercatat di radio mana pun. Tetapi malam ini, ia tahu harus menuju siapa.</p><button className={styles.primaryAction} type="button" onClick={onOpen}>Buka siaran 11:11 <span aria-hidden="true">→</span></button></article></div>
}

function FinalBroadcast({ onConfirm }: { onConfirm: () => void }) {
  return <div className={styles.finalScene}><div className={styles.radioStage}><RadioConsole frequency="11:11" time="11:11 PM" status="SIGNAL LOCKED" powered privateChannel onAir receivedCount={3} /><Waveform active /></div><article className={styles.finalPaper}><p className={styles.kicker}>LIVE AT 11:11 / ANDRE TO GUSTI</p><SceneTitle>Untuk satu orang yang membuat malam terasa lebih dekat.</SceneTitle><p className={styles.transcript}>“Gusti, kalau malam ini terasa terlalu sunyi, anggap saja ini caraku duduk di sebelahmu. Di antara semua suara di dunia, kamu tetap menjadi yang paling ingin kudengar.”</p><p className={styles.signature}>— Andre</p><button className={styles.primaryAction} type="button" onClick={onConfirm}>Konfirmasi pesan diterima <span aria-hidden="true">→</span></button></article></div>
}

function QslCard({ onReplay }: { onReplay: () => void }) {
  return <div className={styles.qslScene}><article className={styles.qslCard}><p className={styles.kicker}>MIDNIGHT RADIO QSL</p><SceneTitle>Pesan diterima.</SceneTitle><dl><div><dt>RECEIVER</dt><dd>Gusti</dd></div><div><dt>SENDER</dt><dd>Andre</dd></div><div><dt>TIME</dt><dd>23:11</dd></div><div><dt>CHANNEL</dt><dd>PRIVATE 11:11</dd></div><div><dt>SIGNALS RECEIVED</dt><dd>3 + 1 dedication</dd></div><div><dt>RECEPTION</dt><dd>STRONG &amp; CLEAR</dd></div></dl><span className={styles.messageStamp}>MESSAGE RECEIVED</span><p className={styles.closingLine}>Some messages travel farther at night.</p></article><div className={styles.qslActions}><button className={styles.primaryAction} type="button" onClick={onReplay}>Putar ulang siaran</button><Link className={styles.collectionLink} to="/">Kembali ke koleksi</Link></div></div>
}
