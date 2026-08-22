import type { HeartConditionId } from './heartRepairContent.ts'

export type HeartRepairState =
  | { phase: 'arrival'; conditionId: null }
  | { phase: 'diagnosis'; conditionId: null }
  | { phase: 'prescription'; conditionId: HeartConditionId }
  | {
      phase: 'repairing'
      conditionId: HeartConditionId
      repairStatus: 'ready' | 'succeeded'
    }
  | { phase: 'reveal'; conditionId: HeartConditionId }
  | { phase: 'certificate'; conditionId: HeartConditionId }

export type HeartRepairEvent =
  | { type: 'START_INSPECTION' }
  | { type: 'SELECT_DIAGNOSIS'; conditionId: HeartConditionId }
  | { type: 'START_REPAIR' }
  | { type: 'COMPLETE_REPAIR' }
  | { type: 'OPEN_REVEAL' }
  | { type: 'OPEN_CERTIFICATE' }
  | { type: 'RESET' }

export const initialHeartRepairState: HeartRepairState = {
  phase: 'arrival',
  conditionId: null,
}

export function heartRepairReducer(
  state: HeartRepairState,
  event: HeartRepairEvent,
): HeartRepairState {
  if (event.type === 'RESET') {
    return initialHeartRepairState
  }

  switch (state.phase) {
    case 'arrival':
      return event.type === 'START_INSPECTION'
        ? { phase: 'diagnosis', conditionId: null }
        : state

    case 'diagnosis':
      return event.type === 'SELECT_DIAGNOSIS'
        ? { phase: 'prescription', conditionId: event.conditionId }
        : state

    case 'prescription':
      return event.type === 'START_REPAIR'
        ? {
            phase: 'repairing',
            conditionId: state.conditionId,
            repairStatus: 'ready',
          }
        : state

    case 'repairing':
      if (event.type === 'COMPLETE_REPAIR' && state.repairStatus === 'ready') {
        return { ...state, repairStatus: 'succeeded' }
      }

      return event.type === 'OPEN_REVEAL' && state.repairStatus === 'succeeded'
        ? { phase: 'reveal', conditionId: state.conditionId }
        : state

    case 'reveal':
      return event.type === 'OPEN_CERTIFICATE'
        ? { phase: 'certificate', conditionId: state.conditionId }
        : state

    case 'certificate':
      return state
  }
}
