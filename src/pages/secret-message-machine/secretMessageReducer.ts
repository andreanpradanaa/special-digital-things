import type { CapsuleColor, MessageId } from './secretMessageContent.ts'

export type MachinePhase = 'idle' | 'turning' | 'dispensing' | 'capsule-ready' | 'revealing'

export type SecretMessageMachineState = {
  phase: MachinePhase
  cycleId: number
  currentCapsule: CapsuleColor | null
  currentMessageId: MessageId | null
  remainingMessageIds: MessageId[]
  revealedMessageIds: MessageId[]
  liveAnnouncement: string
  pointerRotation: number
}

export type SecretMessageMachineEvent =
  | { type: 'START_TURN'; deck: MessageId[]; capsuleColor: CapsuleColor }
  | { type: 'UPDATE_ROTATION'; rotation: number }
  | { type: 'COMPLETE_TURN'; cycleId: number }
  | { type: 'COMPLETE_DISPENSE'; cycleId: number }
  | { type: 'OPEN_CAPSULE' }
  | { type: 'CLOSE_MESSAGE' }
  | { type: 'RESET_MACHINE'; deck: MessageId[] }

export function createInitialMachineState(deck: MessageId[]): SecretMessageMachineState {
  return {
    phase: 'idle',
    cycleId: 0,
    currentCapsule: null,
    currentMessageId: null,
    remainingMessageIds: [...deck],
    revealedMessageIds: [],
    liveAnnouncement: 'Mesin pesan rahasia Andre untuk Gusti siap digunakan.',
    pointerRotation: 0,
  }
}

export function secretMessageMachineReducer(
  state: SecretMessageMachineState,
  event: SecretMessageMachineEvent,
): SecretMessageMachineState {
  if (event.type === 'RESET_MACHINE') {
    return createInitialMachineState(event.deck)
  }

  if (event.type === 'UPDATE_ROTATION') {
    return state.phase === 'idle'
      ? { ...state, pointerRotation: event.rotation }
      : state
  }

  if (event.type === 'START_TURN') {
    if (state.phase !== 'idle') return state

    const deck = state.remainingMessageIds.length > 0 ? state.remainingMessageIds : event.deck
    const [messageId, ...remainingMessageIds] = deck
    if (!messageId) return state

    return {
      ...state,
      phase: 'turning',
      cycleId: state.cycleId + 1,
      currentCapsule: event.capsuleColor,
      currentMessageId: messageId,
      remainingMessageIds,
      revealedMessageIds: state.revealedMessageIds.includes(messageId)
        ? state.revealedMessageIds
        : [...state.revealedMessageIds, messageId],
      liveAnnouncement: 'Knob diputar. Mesin sedang memilih satu pesan.',
      pointerRotation: 0,
    }
  }

  if (event.type === 'COMPLETE_TURN') {
    return state.phase === 'turning' && state.cycleId === event.cycleId
      ? { ...state, phase: 'dispensing', liveAnnouncement: 'Satu kapsul sedang turun ke kompartemen.' }
      : state
  }

  if (event.type === 'COMPLETE_DISPENSE') {
    return state.phase === 'dispensing' && state.cycleId === event.cycleId
      ? { ...state, phase: 'capsule-ready', liveAnnouncement: 'Satu pesan untuk Gusti sudah menunggu di kompartemen.' }
      : state
  }

  if (event.type === 'OPEN_CAPSULE') {
    return state.phase === 'capsule-ready'
      ? { ...state, phase: 'revealing', liveAnnouncement: 'Pesan rahasia Andre untuk Gusti telah dibuka.' }
      : state
  }

  if (event.type === 'CLOSE_MESSAGE') {
    return state.phase === 'revealing'
      ? {
          ...state,
          phase: 'idle',
          currentCapsule: null,
          currentMessageId: null,
          liveAnnouncement: 'Pesan disimpan. Mesin siap untuk satu putaran lagi.',
          pointerRotation: 0,
        }
      : state
  }

  return state
}
