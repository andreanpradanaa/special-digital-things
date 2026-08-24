import { describe, expect, it } from 'vitest'
import { secretMessageIds } from './secretMessageContent.ts'
import { shuffleMessageIds } from './messageDeck.ts'

describe('shuffleMessageIds', () => {
  it('menghasilkan semua ID tepat sekali', () => {
    const deck = shuffleMessageIds(secretMessageIds, () => 0.5)

    expect(deck).toHaveLength(secretMessageIds.length)
    expect(new Set(deck)).toEqual(new Set(secretMessageIds))
  })

  it('mengikuti RNG yang diinjeksi secara deterministik', () => {
    const random = () => 0

    expect(shuffleMessageIds(['tell-you', 'ordinary-day', 'calmer'], random)).toEqual([
      'ordinary-day',
      'calmer',
      'tell-you',
    ])
  })
})
