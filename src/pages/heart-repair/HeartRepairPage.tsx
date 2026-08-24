import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'
import {
  getHeartCondition,
  heartConditions,
  type HeartCondition,
} from './heartRepairContent.ts'
import {
  heartRepairReducer,
  initialHeartRepairState,
} from './heartRepairReducer.ts'
import {
  type HeartRepairGiftConfiguration,
  getHeartRepairGiftConfiguration,
} from './heartRepairGift.ts'
import { HeartCharacter, ToolVisual } from './HeartRepairVisuals.tsx'
import styles from './HeartRepairPage.module.css'

function getPhaseAnnouncements(gift: HeartRepairGiftConfiguration) {
  return {
  arrival: `Work order hati ${gift.recipientName} siap diperiksa.`,
  diagnosis: 'Pemeriksaan dimulai. Pilih kondisi yang paling mendekati.',
  prescription: 'Diagnosis selesai. Alat yang direkomendasikan sudah ditemukan.',
  repairing: 'Meja perbaikan siap digunakan.',
  reveal: `Pesan pribadi dari ${gift.senderName} sudah terbuka.`,
  certificate: 'Care certificate siap disimpan.',
  } as const
}

export function HeartRepairRoute() {
  return <HeartRepairPage gift={getHeartRepairGiftConfiguration()} />
}

type HeartRepairPageProps = {
  gift: HeartRepairGiftConfiguration
}

export function HeartRepairPage({ gift }: HeartRepairPageProps) {
  const [state, dispatch] = useReducer(heartRepairReducer, initialHeartRepairState)
  const shouldReduceMotion = useReducedMotion()
  const phaseHeadingRef = useRef<HTMLHeadingElement>(null)
  const repairTargetRef = useRef<HTMLDivElement>(null)
  const [shouldFocusArrival, setShouldFocusArrival] = useState(false)
  const condition =
    state.conditionId === null ? null : getHeartCondition(state.conditionId)
  const phaseAnnouncements = getPhaseAnnouncements(gift)

  const replayExperience = () => {
    setShouldFocusArrival(true)
    dispatch({ type: 'RESET' })
  }

  useEffect(() => {
    if (state.phase !== 'repairing' || state.repairStatus !== 'succeeded') {
      return
    }

    if (shouldReduceMotion) {
      dispatch({ type: 'OPEN_REVEAL' })
      return
    }

    const revealTimer = window.setTimeout(() => {
      dispatch({ type: 'OPEN_REVEAL' })
    }, 760)

    return () => window.clearTimeout(revealTimer)
  }, [shouldReduceMotion, state])

  const sceneMotion = shouldReduceMotion
    ? { initial: false as const }
    : { initial: { opacity: 0, y: 12 } }

  return (
    <section className={styles.workshop} data-phase={state.phase}>
      <div className={styles.workshopHeader}>
        <Link className={styles.exitLink} to="/">
          <span aria-hidden="true">←</span> Kembali ke koleksi
        </Link>
        <p className={styles.workshopName}>Tiny Heart Repair Shop</p>
      </div>

      <p className="visually-hidden" aria-atomic="true" aria-live="polite">
        {state.phase === 'repairing' && state.repairStatus === 'succeeded'
          ? `Perbaikan berhasil. Pesan ${gift.senderName} sedang dibuka.`
          : phaseAnnouncements[state.phase]}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {state.phase === 'arrival' ? (
          <motion.div
            {...sceneMotion}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            key="arrival"
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <ArrivalScene
              gift={gift}
              headingRef={phaseHeadingRef}
              onStart={() => dispatch({ type: 'START_INSPECTION' })}
              shouldFocus={shouldFocusArrival}
              onFocusApplied={() => setShouldFocusArrival(false)}
            />
          </motion.div>
        ) : null}

        {state.phase === 'diagnosis' ? (
          <motion.div
            {...sceneMotion}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            key="diagnosis"
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <DiagnosisScene
              headingRef={phaseHeadingRef}
              onSelect={(conditionId) =>
                dispatch({ type: 'SELECT_DIAGNOSIS', conditionId })
              }
            />
          </motion.div>
        ) : null}

        {state.phase === 'prescription' && condition ? (
          <motion.div
            {...sceneMotion}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            key="prescription"
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <PrescriptionScene
              condition={condition}
              recipientName={gift.recipientName}
              headingRef={phaseHeadingRef}
              onStartRepair={() => dispatch({ type: 'START_REPAIR' })}
            />
          </motion.div>
        ) : null}

        {state.phase === 'repairing' && condition ? (
          <motion.div
            {...sceneMotion}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            key="repairing"
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <RepairScene
              condition={condition}
              recipientName={gift.recipientName}
              headingRef={phaseHeadingRef}
              isRepaired={state.repairStatus === 'succeeded'}
              onComplete={() => dispatch({ type: 'COMPLETE_REPAIR' })}
              targetRef={repairTargetRef}
            />
          </motion.div>
        ) : null}

        {state.phase === 'reveal' && condition ? (
          <motion.div
            {...sceneMotion}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            key="reveal"
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <RevealScene
              condition={condition}
              gift={gift}
              headingRef={phaseHeadingRef}
              onOpenCertificate={() => dispatch({ type: 'OPEN_CERTIFICATE' })}
            />
          </motion.div>
        ) : null}

        {state.phase === 'certificate' && condition ? (
          <motion.div
            {...sceneMotion}
            animate={{ opacity: 1, y: 0 }}
            key="certificate"
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <CertificateScene
              condition={condition}
              gift={gift}
              headingRef={phaseHeadingRef}
              onReplay={replayExperience}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

type SceneHeadingProps = {
  id?: string
  headingRef: RefObject<HTMLHeadingElement | null>
  children: ReactNode
  shouldFocus?: boolean
  onFocusApplied?: () => void
}

function SceneHeading({
  id,
  headingRef,
  children,
  shouldFocus = false,
  onFocusApplied,
}: SceneHeadingProps) {
  useLayoutEffect(() => {
    if (shouldFocus) {
      headingRef.current?.focus({ preventScroll: true })
      onFocusApplied?.()
    }
  }, [headingRef, onFocusApplied, shouldFocus])

  return (
    <h1 className={styles.sceneHeading} id={id} ref={headingRef} tabIndex={-1}>
      {children}
    </h1>
  )
}

type ArrivalSceneProps = {
  gift: HeartRepairGiftConfiguration
  headingRef: RefObject<HTMLHeadingElement | null>
  onStart: () => void
  shouldFocus: boolean
  onFocusApplied: () => void
}

function ArrivalScene({
  gift,
  headingRef,
  onStart,
  shouldFocus,
  onFocusApplied,
}: ArrivalSceneProps) {
  return (
    <div className={styles.arrivalScene}>
      <article className={styles.workOrder} aria-labelledby="arrival-heading">
        <p className={styles.paperKicker}>Heart care work order</p>
        <SceneHeading
          headingRef={headingRef}
          id="arrival-heading"
          shouldFocus={shouldFocus}
          onFocusApplied={onFocusApplied}
        >
          Ada satu hati yang perlu sedikit dirawat.
        </SceneHeading>
        <p className={styles.sceneBody}>
          Tidak ada yang benar-benar rusak. Mungkin hanya lelah, terlalu ramai,
          atau sedang membutuhkan sedikit perhatian.
        </p>

        <dl className={styles.orderDetails}>
          <div>
            <dt>Pemilik hati</dt>
            <dd>{gift.recipientName}</dd>
          </div>
          <div>
            <dt>Dikirim oleh</dt>
            <dd>{gift.senderName}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>Menunggu pemeriksaan</dd>
          </div>
        </dl>

        <div className={styles.orderFooter}>
          <span className={styles.serviceStamp}>
            From {gift.senderName}, for {gift.recipientName}
          </span>
          <button className={styles.primaryAction} type="button" onClick={onStart}>
            Mulai pemeriksaan <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>

      <div className={styles.arrivalBench} aria-hidden="true">
        <p className={styles.shopSign}>Tiny Heart Repair Shop</p>
        <div className={styles.pegboard}>
          <span />
          <span />
          <span />
          <span />
        </div>
        <HeartCharacter recipientName={gift.recipientName} />
        <span className={styles.arrivalTag}>SERVICE 11:11</span>
      </div>
    </div>
  )
}

type DiagnosisSceneProps = {
  headingRef: RefObject<HTMLHeadingElement | null>
  onSelect: (conditionId: HeartCondition['id']) => void
}

function DiagnosisScene({ headingRef, onSelect }: DiagnosisSceneProps) {
  return (
    <div className={styles.diagnosisScene}>
      <div className={styles.diagnosisIntro}>
        <p className={styles.paperKicker}>Inspection desk</p>
        <SceneHeading headingRef={headingRef} shouldFocus>
          Bagian mana yang terasa paling berat hari ini?
        </SceneHeading>
        <p className={styles.sceneBody}>
          Pilih yang paling mendekati. Bengkel kecil ini akan menyiapkan alat yang
          tepat.
        </p>
      </div>

      <div className={styles.tagBoard} aria-label="Pilih diagnosis hati">
        {heartConditions.map((condition) => (
          <button
            className={styles.diagnosisTag}
            data-condition={condition.id}
            key={condition.id}
            type="button"
            onClick={() => onSelect(condition.id)}
          >
            <span className={styles.tagPin} aria-hidden="true" />
            <span className={styles.tagShort}>{condition.shortLabel}</span>
            <span className={styles.tagLabel}>{condition.label}</span>
            <span className={styles.tagAction}>Pilih label ini →</span>
          </button>
        ))}
      </div>
    </div>
  )
}

type PrescriptionSceneProps = {
  condition: HeartCondition
  recipientName: string
  headingRef: RefObject<HTMLHeadingElement | null>
  onStartRepair: () => void
}

function PrescriptionScene({
  condition,
  recipientName,
  headingRef,
  onStartRepair,
}: PrescriptionSceneProps) {
  return (
    <div className={styles.prescriptionScene}>
      <article className={styles.prescriptionSlip}>
        <p className={styles.paperKicker}>Diagnosis complete.</p>
        <SceneHeading headingRef={headingRef} shouldFocus>
          Bengkel menemukan alat yang mungkin membantu.
        </SceneHeading>
        <p className={styles.sceneBody}>Diagnosis: {condition.label}</p>
        <div className={styles.receiptRule} aria-hidden="true" />
        <p className={styles.toolName}>{condition.prescription.toolName}</p>
        <p className={styles.toolInstruction}>{condition.prescription.instruction}</p>
        <span className={styles.treatmentCode}>
          TREATMENT / {condition.prescription.toolId}
        </span>
        <button className={styles.primaryAction} type="button" onClick={onStartRepair}>
          Bawa ke meja repair <span aria-hidden="true">→</span>
        </button>
      </article>

      <div
        aria-hidden="true"
        className={styles.prescribedTool}
        data-tool={condition.prescription.visualKey}
      >
        <ToolVisual visualKey={condition.prescription.visualKey} />
        <span>Alat untuk {recipientName}</span>
      </div>
    </div>
  )
}

type RepairSceneProps = {
  condition: HeartCondition
  recipientName: string
  headingRef: RefObject<HTMLHeadingElement | null>
  isRepaired: boolean
  onComplete: () => void
  targetRef: RefObject<HTMLDivElement | null>
}

function RepairScene({
  condition,
  recipientName,
  headingRef,
  isRepaired,
  onComplete,
  targetRef,
}: RepairSceneProps) {
  const completeIfDroppedOnTarget = (point: { x: number; y: number }) => {
    const target = targetRef.current?.getBoundingClientRect()

    if (!target || isRepaired) {
      return
    }

    const targetPadding = 48
    const isInsideTarget =
      point.x >= target.left - targetPadding &&
      point.x <= target.right + targetPadding &&
      point.y >= target.top - targetPadding &&
      point.y <= target.bottom + targetPadding

    if (isInsideTarget) {
      onComplete()
    }
  }

  const completeFromDrag = (
    event: PointerEvent | MouseEvent | TouchEvent,
    fallbackPoint: { x: number; y: number },
  ) => {
    if ('clientX' in event) {
      completeIfDroppedOnTarget({ x: event.clientX, y: event.clientY })
      return
    }

    const touch = event.changedTouches[0]
    completeIfDroppedOnTarget(
      touch ? { x: touch.clientX, y: touch.clientY } : fallbackPoint,
    )
  }

  return (
    <div className={styles.repairScene}>
      <div className={styles.repairIntro}>
        <p className={styles.paperKicker}>Repair bay open</p>
        <SceneHeading headingRef={headingRef} shouldFocus>
          Tempelkan alat pada bagian hati yang perlu dirawat.
        </SceneHeading>
        <p className={styles.sceneBody}>{condition.prescription.instruction}</p>
      </div>

      <div className={styles.repairBench}>
        <div className={styles.targetLabel} aria-hidden="true">
          TARGET AREA
        </div>
        <HeartCharacter
          condition={condition}
          recipientName={recipientName}
          repaired={isRepaired}
          targetRef={targetRef}
        />

        {!isRepaired ? (
          <motion.div
            className={styles.draggableTool}
            data-testid="repair-tool"
            data-tool={condition.prescription.visualKey}
            drag
            dragMomentum={false}
            dragSnapToOrigin
            role="img"
            aria-label={`${condition.prescription.toolName}, alat yang dapat diseret ke hati`}
            whileDrag={{ scale: 1.06, rotate: -3 }}
            onDragEnd={(event, info) => completeFromDrag(event, info.point)}
          >
            <ToolVisual visualKey={condition.prescription.visualKey} />
          </motion.div>
        ) : null}

        <div className={styles.repairCounter}>
          <span>REPAIR STATUS</span>
          <strong>{isRepaired ? 'Handled with care' : 'Tool ready'}</strong>
        </div>
      </div>

      <div className={styles.repairAlternative}>
        <p>
          Seret alat ke hati, atau gunakan tombol ini jika kamu lebih nyaman tanpa
          drag.
        </p>
        <button
          className={styles.secondaryAction}
          type="button"
          disabled={isRepaired}
          onClick={onComplete}
        >
          {isRepaired
            ? 'Perbaikan selesai'
            : `Gunakan ${condition.prescription.toolName}`}
        </button>
      </div>

      {isRepaired ? (
        <motion.p
          className={styles.repairSuccess}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          role="status"
        >
          {condition.repair.successMessage}
        </motion.p>
      ) : null}
    </div>
  )
}

type RevealSceneProps = {
  condition: HeartCondition
  gift: HeartRepairGiftConfiguration
  headingRef: RefObject<HTMLHeadingElement | null>
  onOpenCertificate: () => void
}

function RevealScene({
  condition,
  gift,
  headingRef,
  onOpenCertificate,
}: RevealSceneProps) {
  return (
    <div className={styles.revealScene}>
      <div className={styles.revealWorkbench}>
        <HeartCharacter
          condition={condition}
          recipientName={gift.recipientName}
          repaired
        />
        <span aria-hidden="true" className={styles.revealTape}>
          OPENED GENTLY
        </span>
      </div>
      <article className={styles.personalLetter}>
        <p className={styles.paperKicker}>Pesan dari workbench</p>
        <SceneHeading headingRef={headingRef} shouldFocus>
          {condition.reveal.heading}
        </SceneHeading>
        <div className={styles.revealServiceReceipt} data-testid="reveal-success-confirmation">
          <p className={styles.revealReceiptKicker}>Repair selesai</p>
          <p className={styles.revealReceiptTreatment}>
            {condition.prescription.toolName}
          </p>
          <p className={styles.revealReceiptStatus}>
            Handled with care for {gift.recipientName}
          </p>
        </div>
        <p className={styles.letterBody}>{gift.personalMessage}</p>
        <p className={styles.signature}>— {gift.signature}</p>
        <button className={styles.primaryAction} type="button" onClick={onOpenCertificate}>
          Lihat care certificate <span aria-hidden="true">→</span>
        </button>
      </article>
    </div>
  )
}

type CertificateSceneProps = {
  condition: HeartCondition
  gift: HeartRepairGiftConfiguration
  headingRef: RefObject<HTMLHeadingElement | null>
  onReplay: () => void
}

function CertificateScene({
  condition,
  gift,
  headingRef,
  onReplay,
}: CertificateSceneProps) {
  return (
    <div className={styles.certificateScene}>
      <article className={styles.careCertificate}>
        <p className={styles.paperKicker}>Care certificate</p>
        <SceneHeading headingRef={headingRef} shouldFocus>
          Servis kecil selesai.
        </SceneHeading>
        <dl className={styles.certificateDetails}>
          <div>
            <dt>Pemilik hati</dt>
            <dd>{gift.recipientName}</dd>
          </div>
          <div>
            <dt>Dirawat oleh</dt>
            <dd>{gift.senderName}</dd>
          </div>
          <div>
            <dt>Perawatan</dt>
            <dd>{condition.certificateTreatmentLabel}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>Handled with care</dd>
          </div>
          {gift.occasionLabel ? (
            <div>
              <dt>Occasion</dt>
              <dd>{gift.occasionLabel}</dd>
            </div>
          ) : null}
        </dl>
        <p className={styles.warranty}>
          Garansi ini berlaku setiap kali dunia terasa terlalu berat dan {gift.recipientName}
          {' '}membutuhkan pengingat bahwa ia tidak sendirian.
        </p>
        {gift.certificateNote ? (
          <p className={styles.certificateNote}>{gift.certificateNote}</p>
        ) : null}
        <span className={styles.certificateStamp}>Repaired with care</span>
      </article>

      <div className={styles.certificateActions}>
        <button className={styles.primaryAction} type="button" onClick={onReplay}>
          Ulangi pengalaman
        </button>
        <Link className={styles.collectionLink} to="/">
          Kembali ke koleksi
        </Link>
      </div>
    </div>
  )
}
