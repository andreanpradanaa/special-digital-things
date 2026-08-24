import { describe, expect, it } from 'vitest'
import { getSecretMessage, secretMessageIds } from './secretMessageContent.ts'
import { createInitialMachineState, secretMessageMachineReducer } from './secretMessageReducer.ts'

const deck = [...secretMessageIds]
const idle = () => createInitialMachineState(deck)
const start = (state = idle()) => secretMessageMachineReducer(state, { type: 'START_TURN', deck, capsuleColor: 'peach' })

describe('secretMessageMachineReducer', () => {
  it('memiliki delapan ID unik dengan mapping konten lengkap', () => {
    expect(secretMessageIds).toHaveLength(8)
    expect(new Set(secretMessageIds).size).toBe(8)
    for (const id of secretMessageIds) expect(getSecretMessage(id).accessibleLabel).toBeTruthy()
  })

  it('hanya memulai satu turn dari idle', () => {
    const turning = start()
    expect(secretMessageMachineReducer(turning, { type: 'START_TURN', deck, capsuleColor: 'mint' })).toEqual(turning)
  })

  it('mengabaikan kapsul sebelum siap dan completion stale', () => {
    const turning = start()
    expect(secretMessageMachineReducer(turning, { type: 'OPEN_CAPSULE' })).toEqual(turning)
    expect(secretMessageMachineReducer(turning, { type: 'COMPLETE_TURN', cycleId: 77 })).toEqual(turning)
  })

  it('satu cycle hanya menyediakan satu kapsul dan close kembali idle', () => {
    const turning = start()
    const dispensing = secretMessageMachineReducer(turning, { type: 'COMPLETE_TURN', cycleId: turning.cycleId })
    const ready = secretMessageMachineReducer(dispensing, { type: 'COMPLETE_DISPENSE', cycleId: turning.cycleId })
    const revealing = secretMessageMachineReducer(ready, { type: 'OPEN_CAPSULE' })
    const closed = secretMessageMachineReducer(revealing, { type: 'CLOSE_MESSAGE' })

    expect(ready.phase).toBe('capsule-ready')
    expect(ready.revealedMessageIds).toHaveLength(1)
    expect(closed).toMatchObject({ phase: 'idle', currentCapsule: null, currentMessageId: null, pointerRotation: 0 })
  })

  it('tidak mengulang pesan sampai deck habis lalu memakai deck baru', () => {
    let state = idle()
    const received: string[] = []

    for (let index = 0; index < deck.length; index += 1) {
      state = start(state)
      received.push(state.currentMessageId ?? '')
      state = secretMessageMachineReducer(state, { type: 'COMPLETE_TURN', cycleId: state.cycleId })
      state = secretMessageMachineReducer(state, { type: 'COMPLETE_DISPENSE', cycleId: state.cycleId })
      state = secretMessageMachineReducer(state, { type: 'OPEN_CAPSULE' })
      state = secretMessageMachineReducer(state, { type: 'CLOSE_MESSAGE' })
    }

    expect(new Set(received).size).toBe(8)
    const ninth = secretMessageMachineReducer(state, { type: 'START_TURN', deck, capsuleColor: 'gold' })
    expect(ninth.currentMessageId).toBe(deck[0])
  })

  it('reset membersihkan seluruh transient state', () => {
    const turned = start()
    const reset = secretMessageMachineReducer(turned, { type: 'RESET_MACHINE', deck: [...deck].reverse() })

    expect(reset).toEqual(createInitialMachineState([...deck].reverse()))
  })
})
