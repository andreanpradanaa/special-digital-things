import {
  claimCode,
  requiredDrawerIds,
  type DrawerId,
  type RequiredDrawerId,
} from './lostAndFoundContent.ts'

export type ClaimError = 'empty' | 'wrong' | null
type CabinetState = {
  openedDrawerIds: RequiredDrawerId[]
  finalDrawerUnlocked: boolean
  finalDrawerOpened: boolean
  focusDrawerId: DrawerId | null
}

export type LostAndFoundState =
  | { phase: 'arrival' }
  | { phase: 'claim-ticket' }
  | { phase: 'verification'; claimValue: string; claimError: ClaimError; verified: boolean }
  | ({ phase: 'cabinet' } & CabinetState)
  | ({ phase: 'inspecting'; activeDrawerId: RequiredDrawerId } & CabinetState)
  | ({ phase: 'finale' } & CabinetState)
  | ({ phase: 'receipt' } & CabinetState)

export type LostAndFoundEvent =
  | { type: 'TAKE_TICKET' }
  | { type: 'OPEN_VERIFICATION' }
  | { type: 'SET_CLAIM_VALUE'; value: string }
  | { type: 'VERIFY_CLAIM' }
  | { type: 'OPEN_CABINET' }
  | { type: 'OPEN_DRAWER'; drawerId: RequiredDrawerId }
  | { type: 'CLOSE_INSPECTION' }
  | { type: 'CLEAR_DRAWER_FOCUS' }
  | { type: 'OPEN_FINALE' }
  | { type: 'OPEN_RECEIPT' }
  | { type: 'RETURN_TO_CABINET' }
  | { type: 'RESET' }

export const initialLostAndFoundState: LostAndFoundState = { phase: 'arrival' }

function cabinetState(
  openedDrawerIds: RequiredDrawerId[] = [],
  finalDrawerOpened = false,
  focusDrawerId: DrawerId | null = null,
): CabinetState {
  return {
    openedDrawerIds,
    finalDrawerUnlocked: openedDrawerIds.length === requiredDrawerIds.length,
    finalDrawerOpened,
    focusDrawerId,
  }
}

function addOpenedDrawer(
  openedDrawerIds: RequiredDrawerId[],
  drawerId: RequiredDrawerId,
): RequiredDrawerId[] {
  return openedDrawerIds.includes(drawerId)
    ? openedDrawerIds
    : [...openedDrawerIds, drawerId]
}

export function lostAndFoundReducer(
  state: LostAndFoundState,
  event: LostAndFoundEvent,
): LostAndFoundState {
  if (event.type === 'RESET') {
    return initialLostAndFoundState
  }

  switch (state.phase) {
    case 'arrival':
      return event.type === 'TAKE_TICKET' ? { phase: 'claim-ticket' } : state

    case 'claim-ticket':
      return event.type === 'OPEN_VERIFICATION'
        ? { phase: 'verification', claimValue: '', claimError: null, verified: false }
        : state

    case 'verification':
      if (event.type === 'SET_CLAIM_VALUE') {
        return { ...state, claimValue: event.value.replace(/\D/g, '').slice(0, 4), claimError: null, verified: false }
      }
      if (event.type === 'VERIFY_CLAIM') {
        if (!state.claimValue) return { ...state, claimError: 'empty', verified: false }
        if (state.claimValue !== claimCode) return { ...state, claimError: 'wrong', verified: false }
        return { ...state, claimError: null, verified: true }
      }
      return event.type === 'OPEN_CABINET' && state.verified
        ? { phase: 'cabinet', ...cabinetState() }
        : state

    case 'cabinet':
      if (event.type === 'OPEN_DRAWER') {
        const openedDrawerIds = addOpenedDrawer(state.openedDrawerIds, event.drawerId)
        return {
          phase: 'inspecting',
          ...cabinetState(openedDrawerIds, state.finalDrawerOpened),
          activeDrawerId: event.drawerId,
        }
      }
      if (event.type === 'OPEN_FINALE' && state.finalDrawerUnlocked) {
        return { phase: 'finale', ...cabinetState(state.openedDrawerIds, true) }
      }
      return event.type === 'CLEAR_DRAWER_FOCUS'
        ? { ...state, focusDrawerId: null }
        : state

    case 'inspecting':
      return event.type === 'CLOSE_INSPECTION'
        ? {
            phase: 'cabinet',
            ...cabinetState(state.openedDrawerIds, state.finalDrawerOpened, state.activeDrawerId),
          }
        : state

    case 'finale':
      return event.type === 'OPEN_RECEIPT'
        ? { phase: 'receipt', ...cabinetState(state.openedDrawerIds, true) }
        : state

    case 'receipt':
      return event.type === 'RETURN_TO_CABINET'
        ? { phase: 'cabinet', ...cabinetState(state.openedDrawerIds, true) }
        : state
  }
}
