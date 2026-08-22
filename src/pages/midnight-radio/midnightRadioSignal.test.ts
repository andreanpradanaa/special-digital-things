import { describe, expect, it } from 'vitest'
import { getBroadcast } from './midnightRadioContent.ts'
import { formatFrequency, getNarrativeTime, getSignalStatus, isSignalLocked } from './midnightRadioSignal.ts'

describe('midnight radio signal helpers', () => {
  it('formats integer tenths without floating point conversion', () => {
    expect(formatFrequency(883)).toBe('88.3')
    expect(formatFrequency(1049)).toBe('104.9')
  })

  it('reports deterministic statuses around the active broadcast', () => {
    const broadcast = getBroadcast('way-home')
    expect(getSignalStatus(930, broadcast)).toBe('STATIC')
    expect(getSignalStatus(956, broadcast)).toBe('WEAK')
    expect(getSignalStatus(962, broadcast)).toBe('ALMOST CLEAR')
    expect(getSignalStatus(968, broadcast)).toBe('SIGNAL LOCKED')
    expect(isSignalLocked(968, broadcast)).toBe(true)
  })

  it('advances fictional time only from received signal count', () => {
    expect(getNarrativeTime(0)).toBe('11:08 PM')
    expect(getNarrativeTime(1)).toBe('11:09 PM')
    expect(getNarrativeTime(2)).toBe('11:10 PM')
    expect(getNarrativeTime(3)).toBe('11:11 PM')
  })
})
