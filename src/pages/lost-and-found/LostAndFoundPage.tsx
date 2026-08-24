import { useLayoutEffect, useReducer, useRef, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'
import {
  claimCode,
  getDrawerRecord,
  drawerRecords,
  unreturnableRecord,
  type RequiredDrawerId,
} from './lostAndFoundContent.ts'
import { initialLostAndFoundState, lostAndFoundReducer } from './lostAndFoundReducer.ts'
import { ArtifactVisual, OfficeStillLife } from './LostAndFoundVisuals.tsx'
import styles from './LostAndFoundPage.module.css'

const phaseAnnouncement = {
  arrival: 'Kantor lost and found sedang menyimpan satu klaim untuk Gusti.',
  'claim-ticket': 'Tiket klaim sudah siap.',
  verification: 'Catatan klaim siap diverifikasi.',
  cabinet: 'Kabinet penyimpanan tersedia untuk diperiksa.',
  inspecting: 'Satu barang temuan sedang diperiksa.',
  finale: 'Barang terakhir sudah dapat diperiksa.',
  receipt: 'Bukti klaim selesai tersedia.',
} as const

export function LostAndFoundPage() {
  const [state, dispatch] = useReducer(lostAndFoundReducer, initialLostAndFoundState)
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className={styles.office} data-phase={state.phase}>
      <div className={styles.officeHeader}>
        <Link className={styles.exitLink} to="/">← Kembali ke koleksi</Link>
        <p>The Little Lost &amp; Found</p>
      </div>

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {state.phase === 'cabinet' && state.finalDrawerUnlocked
          ? 'Empat record telah ditemukan. Laci UNRETURNABLE sekarang dapat dibuka.'
          : phaseAnnouncement[state.phase]}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {state.phase === 'arrival' && <SceneMotion key="arrival" reduce={shouldReduceMotion}><Arrival onTake={() => dispatch({ type: 'TAKE_TICKET' })} /></SceneMotion>}
        {state.phase === 'claim-ticket' && <SceneMotion key="ticket" reduce={shouldReduceMotion}><ClaimTicket onContinue={() => dispatch({ type: 'OPEN_VERIFICATION' })} /></SceneMotion>}
        {state.phase === 'verification' && <SceneMotion key="verification" reduce={shouldReduceMotion}><Verification state={state} onChange={(value) => dispatch({ type: 'SET_CLAIM_VALUE', value })} onSubmit={() => dispatch({ type: 'VERIFY_CLAIM' })} onOpenCabinet={() => dispatch({ type: 'OPEN_CABINET' })} /></SceneMotion>}
        {state.phase === 'cabinet' && <SceneMotion key="cabinet" reduce={shouldReduceMotion}><Cabinet state={state} onOpen={(drawerId) => dispatch({ type: 'OPEN_DRAWER', drawerId })} onFinale={() => dispatch({ type: 'OPEN_FINALE' })} onFocusRestored={() => dispatch({ type: 'CLEAR_DRAWER_FOCUS' })} /></SceneMotion>}
        {state.phase === 'inspecting' && <SceneMotion key={`inspect-${state.activeDrawerId}`} reduce={shouldReduceMotion}><Inspection drawerId={state.activeDrawerId} onClose={() => dispatch({ type: 'CLOSE_INSPECTION' })} /></SceneMotion>}
        {state.phase === 'finale' && <SceneMotion key="finale" reduce={shouldReduceMotion}><Finale onComplete={() => dispatch({ type: 'OPEN_RECEIPT' })} /></SceneMotion>}
        {state.phase === 'receipt' && <SceneMotion key="receipt" reduce={shouldReduceMotion}><Receipt onReturn={() => dispatch({ type: 'RETURN_TO_CABINET' })} onReplay={() => dispatch({ type: 'RESET' })} /></SceneMotion>}
      </AnimatePresence>
    </section>
  )
}

function SceneMotion({ children, reduce }: { children: ReactNode; reduce: boolean | null }) {
  return <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: 'easeOut' }}>{children}</motion.div>
}

function SceneTitle({ children, focus = true }: { children: ReactNode; focus?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => { if (focus) ref.current?.focus({ preventScroll: true }) }, [focus])
  return <h1 className={styles.sceneTitle} ref={ref} tabIndex={-1}>{children}</h1>
}

function Arrival({ onTake }: { onTake: () => void }) {
  return <div className={styles.arrival}><div className={styles.arrivalCopy}><p className={styles.kicker}>THE LITTLE LOST &amp; FOUND</p><SceneTitle focus={false}>Ada beberapa hal milikmu yang masih tersimpan di sini.</SceneTitle><p className={styles.body}>Sebagian ditemukan di percakapan lama. Sebagian tertinggal pada hari-hari biasa yang ternyata sulit dilupakan.</p><p className={styles.smallNote}>Disimpan oleh Andre untuk Gusti.</p><button className={styles.primaryAction} onClick={onTake} type="button">Ambil tiket klaim <span aria-hidden="true">→</span></button></div><div className={styles.arrivalDesk}><OfficeStillLife /><span className={styles.claimEnvelope}>UNTUK GUSTI<br />CLAIM 0427</span></div></div>
}

function ClaimTicket({ onContinue }: { onContinue: () => void }) {
  return <div className={styles.ticketScene}><article className={styles.claimTicket}><p className={styles.ticketOffice}>LOST &amp; FOUND</p><p className={styles.ticketNumber}>CLAIM NO. {claimCode}</p><dl><div><dt>CLAIMANT</dt><dd>GUSTI</dd></div><div><dt>FILED BY</dt><dd>ANDRE</dd></div><div><dt>ITEM COUNT</dt><dd>UNKNOWN</dd></div><div><dt>STATUS</dt><dd>WAITING</dd></div></dl><span className={styles.ticketPunches} aria-hidden="true">◦ ◦ ◦ ◦</span></article><div className={styles.ticketCopy}><p className={styles.kicker}>CLAIM TICKET</p><SceneTitle>Tiket ini sudah menunggumu.</SceneTitle><p className={styles.body}>Masukkan empat angka yang tercetak pada tiket untuk membuka catatan penyimpanan.</p><button className={styles.primaryAction} onClick={onContinue} type="button">Periksa nomor klaim <span aria-hidden="true">→</span></button></div></div>
}

function Verification({ state, onChange, onSubmit, onOpenCabinet }: { state: Extract<typeof initialLostAndFoundState | { phase: 'verification'; claimValue: string; claimError: 'empty' | 'wrong' | null; verified: boolean }, { phase: 'verification' }>; onChange: (value: string) => void; onSubmit: () => void; onOpenCabinet: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => { inputRef.current?.focus() }, [])
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSubmit() }
  const error = state.claimError === 'empty' ? 'Masukkan nomor klaim yang tercetak pada tiket.' : state.claimError === 'wrong' ? 'Nomor itu tidak tercatat. Periksa kembali tiket milik Gusti.' : null
  return <div className={styles.verificationScene}><div className={styles.ledger}><p className={styles.kicker}>RECORD VERIFICATION</p><SceneTitle>Catatan penyimpanan perlu satu nomor.</SceneTitle><p className={styles.body}>Tiket milik Gusti dicatat dengan tangan. Periksa setiap angka sebelum menekan stempel.</p><form onSubmit={submit} noValidate><label htmlFor="claim-code">Nomor klaim pada tiket</label><input ref={inputRef} id="claim-code" inputMode="numeric" autoComplete="one-time-code" maxLength={4} value={state.claimValue} aria-describedby={error ? 'claim-error' : undefined} aria-invalid={Boolean(error)} onChange={(event) => onChange(event.target.value)} /><button className={styles.primaryAction} type="submit">Verifikasi tiket</button></form>{error && <p className={styles.claimError} id="claim-error" role="alert"><span aria-hidden="true">NOT FOUND</span>{error}</p>}{state.verified && <div className={styles.claimVerified} role="status"><span>CLAIM VERIFIED</span><p>Nomor klaim ditemukan. Kabinet penyimpanan dapat dibuka.</p><button className={styles.primaryAction} onClick={onOpenCabinet} type="button">Buka kabinet <span aria-hidden="true">→</span></button></div>}</div><OfficeStillLife /></div>
}

function Cabinet({ state, onOpen, onFinale, onFocusRestored }: { state: Extract<ReturnType<typeof lostAndFoundReducer>, { phase: 'cabinet' }>; onOpen: (id: RequiredDrawerId) => void; onFinale: () => void; onFocusRestored: () => void }) {
  useLayoutEffect(() => { if (state.focusDrawerId) { document.getElementById(`lost-drawer-${state.focusDrawerId}`)?.focus(); onFocusRestored() } }, [onFocusRestored, state.focusDrawerId])
  return <div className={styles.cabinetScene}><div className={styles.cabinetIntro}><p className={styles.kicker}>ARCHIVE CABINET / GUSTI</p><SceneTitle>Boleh periksa satu per satu.</SceneTitle><p className={styles.body}>Empat record bisa diambil dalam urutan apa pun. Setiap yang dibuka akan diberi cap pada tiket klaim.</p><ClaimStamps opened={state.openedDrawerIds} /></div><div className={styles.cabinet}><div className={styles.cabinetSign}>LOST &amp; FOUND<br /><span>KEEPING THINGS SAFE</span></div>{drawerRecords.map((drawer) => <button key={drawer.id} id={`lost-drawer-${drawer.id}`} aria-label={drawer.accessibleLabel} className={styles.drawerButton} data-opened={state.openedDrawerIds.includes(drawer.id)} type="button" aria-expanded={false} aria-controls="inspection-counter" onClick={() => onOpen(drawer.id)}><span className={styles.drawerLabel}>{drawer.cabinetLabel}</span><span className={styles.drawerHandle} aria-hidden="true" /><span className={styles.drawerStatus}>{state.openedDrawerIds.includes(drawer.id) ? 'RECORD CHECKED' : 'OPEN RECORD'}</span></button>)}<button id="lost-drawer-unreturnable" aria-label="Buka laci UNRETURNABLE" className={`${styles.drawerButton} ${styles.finalDrawer}`} type="button" disabled={!state.finalDrawerUnlocked} aria-expanded={false} aria-controls="final-record" onClick={onFinale}><span className={styles.drawerLabel}>UNRETURNABLE</span><span className={styles.drawerHandle} aria-hidden="true" /><span className={styles.drawerStatus}>{state.finalDrawerUnlocked ? 'SEAL RELEASED' : '4 RECORDS REQUIRED'}</span></button></div></div>
}

function ClaimStamps({ opened }: { opened: readonly RequiredDrawerId[] }) {
  return <div className={styles.claimStamps} aria-label={`${opened.length} dari 4 record diperiksa`}><span>CLAIM STAMPS</span>{drawerRecords.map((drawer) => <span className={styles.stampSlot} data-filled={opened.includes(drawer.id)} key={drawer.id}>{opened.includes(drawer.id) ? 'FOUND' : drawer.cabinetLabel}</span>)}</div>
}

function Inspection({ drawerId, onClose }: { drawerId: RequiredDrawerId; onClose: () => void }) {
  const drawer = getDrawerRecord(drawerId)
  return <div className={styles.inspectionScene} id="inspection-counter"><div className={styles.inspectionObject}><ArtifactVisual visualKey={drawer.artifactVisualKey} /><span>{drawer.objectLabel}</span></div><article className={styles.inventorySheet}><p className={styles.kicker}>{drawer.eyebrow}</p><SceneTitle>{drawer.heading}</SceneTitle><p className={styles.body}>{drawer.body}</p><p className={styles.inventoryLabel}>ITEM / {drawer.artifactName}</p><button className={styles.secondaryAction} onClick={onClose} type="button">Kembalikan ke kabinet</button></article></div>
}

function Finale({ onComplete }: { onComplete: () => void }) {
  return <div className={styles.finaleScene} id="final-record"><div className={styles.locketCase}><ArtifactVisual visualKey={unreturnableRecord.artifactVisualKey} /><span>CATALOGUED WITH CARE</span></div><article className={styles.finalePaper}><p className={styles.kicker}>UNRETURNABLE ITEM</p><SceneTitle>Barang terakhir tidak dapat dikembalikan.</SceneTitle><dl><div><dt>Item</dt><dd>Hatiku</dd></div><div><dt>Ditemukan bersama</dt><dd>Gusti</dd></div><div><dt>Pemilik sebelumnya</dt><dd>Andre</dd></div><div><dt>Status</dt><dd>Already where it belongs</dd></div></dl><p className={styles.body}>Sepertinya benda ini tidak pernah benar-benar tersesat. Ia hanya menemukan rumahnya lebih dulu.</p><p className={styles.signature}>— Andre</p><button className={styles.primaryAction} onClick={onComplete} type="button">Selesaikan klaim <span aria-hidden="true">→</span></button></article></div>
}

function Receipt({ onReturn, onReplay }: { onReturn: () => void; onReplay: () => void }) {
  return <div className={styles.receiptScene}><article className={styles.receipt}><p className={styles.kicker}>LOST &amp; FOUND CLAIM RECEIPT</p><SceneTitle>Klaim selesai.</SceneTitle><dl><div><dt>Penerima</dt><dd>Gusti</dd></div><div><dt>Dicatat oleh</dt><dd>Andre</dd></div><div><dt>Barang ditemukan</dt><dd>5</dd></div><div><dt>Barang dikembalikan</dt><dd>4</dd></div><div><dt>Barang tetap tersimpan</dt><dd>1</dd></div></dl><p className={styles.body}>Simpan bukti ini. Beberapa hal memang tidak dimaksudkan untuk dikembalikan.</p><span className={styles.completedStamp}>CLAIM COMPLETED</span><p className={styles.handNote}>Thank you for giving these memories somewhere to stay.</p></article><div className={styles.receiptActions}><button className={styles.primaryAction} onClick={onReturn} type="button">Buka kembali kabinet</button><button className={styles.secondaryAction} onClick={onReplay} type="button">Ulangi klaim</button><Link className={styles.collectionLink} to="/">Kembali ke koleksi</Link></div></div>
}
