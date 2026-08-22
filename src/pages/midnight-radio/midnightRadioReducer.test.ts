import { describe, expect, it } from 'vitest'
import { initialMidnightRadioState, midnightRadioReducer } from './midnightRadioReducer.ts'

function tuneAndCapture(state: ReturnType<typeof midnightRadioReducer>, frequency: number) {
  const tuned = midnightRadioReducer(state, { type: 'SET_FREQUENCY', frequency })
  return midnightRadioReducer(tuned, { type: 'CAPTURE_SIGNAL' })
}

describe('midnight radio reducer', () => {
  it('does not capture before a signal is locked', () => {
    const powered = midnightRadioReducer(initialMidnightRadioState, { type: 'POWER_ON' })
    expect(midnightRadioReducer(powered, { type: 'CAPTURE_SIGNAL' })).toEqual(powered)
  })

  it('captures each unique signal once and advances in order', () => {
    const powered = midnightRadioReducer(initialMidnightRadioState, { type: 'POWER_ON' })
    const first = tuneAndCapture(powered, 883)
    expect(first).toMatchObject({ phase: 'fragment', activeSignalId: 'laugh', receivedSignalIds: ['laugh'] })
    const duplicate = midnightRadioReducer(first, { type: 'CAPTURE_SIGNAL' })
    expect(duplicate).toEqual(first)
    const next = midnightRadioReducer(first, { type: 'RETURN_TO_TUNER' })
    expect(next).toMatchObject({ phase: 'tuning', receivedSignalIds: ['laugh'] })
  })

  it('keeps PRIVATE 11:11 locked until exactly three unique signals are returned', () => {
    let state = midnightRadioReducer(initialMidnightRadioState, { type: 'POWER_ON' })
    state = midnightRadioReducer(tuneAndCapture(state, 883), { type: 'RETURN_TO_TUNER' })
    state = midnightRadioReducer(tuneAndCapture(state, 967), { type: 'RETURN_TO_TUNER' })
    expect(state).toMatchObject({ phase: 'tuning', receivedSignalIds: ['laugh', 'way-home'] })
    const lastFragment = tuneAndCapture(state, 1049)
    const unlocked = midnightRadioReducer(lastFragment, { type: 'RETURN_TO_TUNER' })
    expect(unlocked).toMatchObject({ phase: 'private-unlock', receivedSignalIds: ['laugh', 'way-home', 'stay'] })
  })

  it('replay resets all state, including frequency, audio, and received signals', () => {
    const powered = midnightRadioReducer(initialMidnightRadioState, { type: 'POWER_ON' })
    const audioOn = midnightRadioReducer(powered, { type: 'SET_AUDIO', enabled: true })
    const captured = tuneAndCapture(audioOn, 883)
    expect(midnightRadioReducer(captured, { type: 'RESET' })).toEqual(initialMidnightRadioState)
  })

  it('turns ambience state off when the final message is confirmed', () => {
    const finalState = {
      phase: 'final-broadcast' as const,
      power: 'on' as const,
      frequency: 1049,
      receivedSignalIds: ['laugh', 'way-home', 'stay'] as ('laugh' | 'way-home' | 'stay')[],
      audioEnabled: true,
    }
    expect(midnightRadioReducer(finalState, { type: 'CONFIRM_MESSAGE' })).toMatchObject({
      phase: 'qsl',
      audioEnabled: false,
    })
  })
})
