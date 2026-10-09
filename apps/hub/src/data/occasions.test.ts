import { describe, expect, test } from 'vitest'
import { findOccasion, occasions } from './occasions'

describe('momen (occasions)', () => {
  test('id unik dan setiap momen punya judul landing', () => {
    expect(new Set(occasions.map((o) => o.id)).size).toBe(occasions.length)
    expect(occasions.every((o) => o.title && o.script && o.subtitle)).toBe(true)
  })

  test('findOccasion', () => {
    expect(findOccasion('ulang-tahun')?.label).toBe('Ulang tahun')
    expect(findOccasion('natal')).toBeUndefined()
    expect(findOccasion(undefined)).toBeUndefined()
  })
})
