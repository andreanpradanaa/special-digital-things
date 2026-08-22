import { describe, expect, it } from 'vitest'
import { lostAndFoundReducer, initialLostAndFoundState } from './lostAndFoundReducer.ts'

function verifiedCabinet() {
  let state = lostAndFoundReducer(initialLostAndFoundState, { type: 'TAKE_TICKET' })
  state = lostAndFoundReducer(state, { type: 'OPEN_VERIFICATION' })
  state = lostAndFoundReducer(state, { type: 'SET_CLAIM_VALUE', value: '0427' })
  state = lostAndFoundReducer(state, { type: 'VERIFY_CLAIM' })
  return lostAndFoundReducer(state, { type: 'OPEN_CABINET' })
}

describe('lost and found reducer', () => {
  it('menahan empty dan wrong claim dari kabinet', () => {
    let state = lostAndFoundReducer(initialLostAndFoundState, { type: 'TAKE_TICKET' })
    state = lostAndFoundReducer(state, { type: 'OPEN_VERIFICATION' })
    state = lostAndFoundReducer(state, { type: 'VERIFY_CLAIM' })
    expect(state).toMatchObject({ phase: 'verification', claimError: 'empty' })
    state = lostAndFoundReducer(state, { type: 'SET_CLAIM_VALUE', value: '1234' })
    state = lostAndFoundReducer(state, { type: 'VERIFY_CLAIM' })
    expect(state).toMatchObject({ phase: 'verification', claimError: 'wrong' })
  })

  it('membuka kabinet untuk claim benar serta drawer unik dalam urutan bebas', () => {
    let state = verifiedCabinet()
    expect(state.phase).toBe('cabinet')
    state = lostAndFoundReducer(state, { type: 'OPEN_DRAWER', drawerId: 'home' })
    state = lostAndFoundReducer(state, { type: 'CLOSE_INSPECTION' })
    state = lostAndFoundReducer(state, { type: 'OPEN_DRAWER', drawerId: 'home' })
    expect(state).toMatchObject({ openedDrawerIds: ['home'] })
    state = lostAndFoundReducer(state, { type: 'CLOSE_INSPECTION' })
    state = lostAndFoundReducer(state, { type: 'OPEN_DRAWER', drawerId: 'sound' })
    expect(state).toMatchObject({ openedDrawerIds: ['home', 'sound'] })
  })

  it('mengunci final sampai seluruh record dibuka dan reset membersihkan state', () => {
    let state = verifiedCabinet()
    expect(lostAndFoundReducer(state, { type: 'OPEN_FINALE' })).toBe(state)
    for (const drawerId of ['sunday', 'sound', 'home', 'courage'] as const) {
      state = lostAndFoundReducer(state, { type: 'OPEN_DRAWER', drawerId })
      state = lostAndFoundReducer(state, { type: 'CLOSE_INSPECTION' })
    }
    expect(state).toMatchObject({ phase: 'cabinet', finalDrawerUnlocked: true })
    state = lostAndFoundReducer(state, { type: 'OPEN_FINALE' })
    state = lostAndFoundReducer(state, { type: 'OPEN_RECEIPT' })
    state = lostAndFoundReducer(state, { type: 'RETURN_TO_CABINET' })
    expect(state).toMatchObject({ finalDrawerOpened: true, openedDrawerIds: ['sunday', 'sound', 'home', 'courage'] })
    expect(lostAndFoundReducer(state, { type: 'RESET' })).toEqual(initialLostAndFoundState)
  })
})
