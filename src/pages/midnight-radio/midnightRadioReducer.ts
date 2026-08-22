import { broadcastIds, getBroadcast, type BroadcastId } from './midnightRadioContent.ts'
import { clampFrequency, isSignalLocked } from './midnightRadioSignal.ts'

export type MidnightRadioPhase =
  | 'arrival'
  | 'tuning'
  | 'fragment'
  | 'private-unlock'
  | 'final-broadcast'
  | 'qsl'

type PoweredState = {
  power: 'on'
  frequency: number
  receivedSignalIds: BroadcastId[]
  audioEnabled: boolean
}

export type MidnightRadioState =
  | { phase: 'arrival'; power: 'off'; frequency: 880; receivedSignalIds: []; audioEnabled: false }
  | ({ phase: 'tuning' } & PoweredState)
  | ({ phase: 'fragment'; activeSignalId: BroadcastId } & PoweredState)
  | ({ phase: 'private-unlock' } & PoweredState)
  | ({ phase: 'final-broadcast' } & PoweredState)
  | ({ phase: 'qsl' } & PoweredState)

export type MidnightRadioEvent =
  | { type: 'POWER_ON' }
  | { type: 'SET_FREQUENCY'; frequency: number }
  | { type: 'CAPTURE_SIGNAL' }
  | { type: 'RETURN_TO_TUNER' }
  | { type: 'OPEN_FINAL_BROADCAST' }
  | { type: 'CONFIRM_MESSAGE' }
  | { type: 'SET_AUDIO'; enabled: boolean }
  | { type: 'RESET' }

export const initialMidnightRadioState: MidnightRadioState = {
  phase: 'arrival',
  power: 'off',
  frequency: 880,
  receivedSignalIds: [],
  audioEnabled: false,
}

export function getCurrentSignal(state: MidnightRadioState): BroadcastId | null {
  const receivedSignalIds: readonly BroadcastId[] = state.receivedSignalIds
  return broadcastIds.find((id) => !receivedSignalIds.includes(id)) ?? null
}

function addReceivedSignal(
  receivedSignalIds: BroadcastId[],
  id: BroadcastId,
): BroadcastId[] {
  return receivedSignalIds.includes(id)
    ? receivedSignalIds
    : [...receivedSignalIds, id]
}

export function midnightRadioReducer(
  state: MidnightRadioState,
  event: MidnightRadioEvent,
): MidnightRadioState {
  if (event.type === 'RESET') return initialMidnightRadioState

  if (state.phase === 'arrival') {
    return event.type === 'POWER_ON'
      ? { ...state, phase: 'tuning', power: 'on' }
      : state
  }

  if (event.type === 'SET_AUDIO') {
    return { ...state, audioEnabled: event.enabled }
  }

  switch (state.phase) {
    case 'tuning': {
      if (event.type === 'SET_FREQUENCY') {
        return { ...state, frequency: clampFrequency(event.frequency) }
      }

      if (event.type === 'CAPTURE_SIGNAL') {
        const signalId = getCurrentSignal(state)
        const broadcast = signalId ? getBroadcast(signalId) : null

        if (!signalId || !isSignalLocked(state.frequency, broadcast)) return state

        return {
          ...state,
          phase: 'fragment',
          activeSignalId: signalId,
          receivedSignalIds: addReceivedSignal(state.receivedSignalIds, signalId),
        }
      }

      return state
    }

    case 'fragment':
      if (event.type !== 'RETURN_TO_TUNER') return state
      return state.receivedSignalIds.length === broadcastIds.length
        ? { ...state, phase: 'private-unlock' }
        : { ...state, phase: 'tuning' }

    case 'private-unlock':
      return event.type === 'OPEN_FINAL_BROADCAST'
        ? { ...state, phase: 'final-broadcast' }
        : state

    case 'final-broadcast':
      return event.type === 'CONFIRM_MESSAGE'
        ? { ...state, phase: 'qsl', audioEnabled: false }
        : state

    case 'qsl':
      return state
  }
}
