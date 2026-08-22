import {
  radioFrequencyRange,
  type RadioBroadcast,
} from './midnightRadioContent.ts'

export type SignalStatus = 'STATIC' | 'WEAK' | 'ALMOST CLEAR' | 'SIGNAL LOCKED'

export function formatFrequency(frequency: number): string {
  return `${Math.floor(frequency / 10)}.${Math.abs(frequency % 10)}`
}

export function clampFrequency(frequency: number): number {
  return Math.min(
    radioFrequencyRange.max,
    Math.max(radioFrequencyRange.min, Math.round(frequency)),
  )
}

export function getSignalStatus(
  frequency: number,
  broadcast: RadioBroadcast | null,
): SignalStatus {
  if (!broadcast) return 'STATIC'

  const distance = Math.abs(frequency - broadcast.frequency)

  if (distance <= 1) return 'SIGNAL LOCKED'
  if (distance <= 5) return 'ALMOST CLEAR'
  if (distance <= 14) return 'WEAK'
  return 'STATIC'
}

export function isSignalLocked(
  frequency: number,
  broadcast: RadioBroadcast | null,
): boolean {
  return getSignalStatus(frequency, broadcast) === 'SIGNAL LOCKED'
}

export function getSignalAriaText(
  frequency: number,
  broadcast: RadioBroadcast | null,
): string {
  const status = getSignalStatus(frequency, broadcast)
  const target = broadcast ? ` Mencari ${broadcast.callSign}.` : ''
  return `${formatFrequency(frequency)} FM. Status ${status}.${target}`
}

export function getNarrativeTime(receivedCount: number): string {
  const minute = Math.min(11, 8 + receivedCount)
  return `11:${String(minute).padStart(2, '0')} PM`
}
