import { describe, expect, it } from 'vitest'
import { claimCode, drawerRecords, requiredDrawerIds } from './lostAndFoundContent.ts'

describe('lost and found content', () => {
  it('menyimpan nomor klaim dan empat record wajib yang lengkap', () => {
    expect(claimCode).toBe('0427')
    expect(drawerRecords.map((record) => record.id)).toEqual(requiredDrawerIds)
    for (const record of drawerRecords) {
      expect(record.accessibleLabel).toBeTruthy()
      expect(record.heading).toBeTruthy()
      expect(record.body).toBeTruthy()
      expect(record.requiredForFinale).toBe(true)
    }
  })
})
