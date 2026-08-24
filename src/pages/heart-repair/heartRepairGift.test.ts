import { describe, expect, it } from 'vitest'
import { getHeartCondition } from './heartRepairContent.ts'
import {
  heartRepairReducer,
  initialHeartRepairState,
} from './heartRepairReducer.ts'
import {
  heartRepairGiftLimits,
  loadHeartRepairGiftConfiguration,
} from './heartRepairGift.ts'

const validGiftInput = {
  giftId: 'order-2026-001',
  recipientName: 'Rani',
  senderName: 'Dimas',
  personalMessage: 'Terima kasih sudah bertahan hari ini. Aku selalu ada untukmu.',
  signature: 'Dengan sayang, Dimas',
  certificateNote: 'Simpan surat kecil ini saat kamu membutuhkannya.',
  occasionLabel: 'Untuk hari yang berat',
} as const

describe('Heart Repair gift configuration', () => {
  it('memuat konfigurasi valid, trim input, dan memakai sender sebagai fallback signature', () => {
    const gift = loadHeartRepairGiftConfiguration({
      ...validGiftInput,
      recipientName: '  Rani  ',
      senderName: '  Dimas  ',
      personalMessage: '  Baris pertama.\nBaris kedua.  ',
      signature: '   ',
      certificateNote: '  Simpan surat kecil ini.  ',
      occasionLabel: '  Untuk hari yang berat  ',
    })

    expect(gift).toEqual({
      giftId: 'order-2026-001',
      recipientName: 'Rani',
      senderName: 'Dimas',
      personalMessage: 'Baris pertama.\nBaris kedua.',
      signature: 'Dimas',
      certificateNote: 'Simpan surat kecil ini.',
      occasionLabel: 'Untuk hari yang berat',
    })
  })

  it('menolak setiap required field yang kosong atau hanya whitespace', () => {
    for (const field of ['giftId', 'recipientName', 'senderName', 'personalMessage'] as const) {
      expect(() =>
        loadHeartRepairGiftConfiguration({ ...validGiftInput, [field]: '   ' }),
      ).toThrow(`${field} wajib diisi.`)
    }
  })

  it('menerima optional field kosong tanpa mengganti certificate atau occasion secara diam-diam', () => {
    const gift = loadHeartRepairGiftConfiguration({
      ...validGiftInput,
      signature: '',
      certificateNote: ' \n ',
      occasionLabel: ' ',
    })

    expect(gift.signature).toBe(validGiftInput.senderName)
    expect(gift.certificateNote).toBeUndefined()
    expect(gift.occasionLabel).toBeUndefined()
  })

  it('menolak nilai yang melampaui setiap maximum length', () => {
    const cases = [
      ['giftId', heartRepairGiftLimits.giftId],
      ['recipientName', heartRepairGiftLimits.recipientName],
      ['senderName', heartRepairGiftLimits.senderName],
      ['personalMessage', heartRepairGiftLimits.personalMessage],
      ['signature', heartRepairGiftLimits.signature],
      ['certificateNote', heartRepairGiftLimits.certificateNote],
      ['occasionLabel', heartRepairGiftLimits.occasionLabel],
    ] as const

    for (const [field, maximumLength] of cases) {
      expect(() =>
        loadHeartRepairGiftConfiguration({
          ...validGiftInput,
          [field]: 'x'.repeat(maximumLength + 1),
        }),
      ).toThrow(`${field} maksimal ${maximumLength} karakter.`)
    }
  })

  it('menerima nilai tepat pada setiap maximum length', () => {
    const gift = loadHeartRepairGiftConfiguration({
      giftId: 'g'.repeat(heartRepairGiftLimits.giftId),
      recipientName: 'r'.repeat(heartRepairGiftLimits.recipientName),
      senderName: 's'.repeat(heartRepairGiftLimits.senderName),
      personalMessage: 'm'.repeat(heartRepairGiftLimits.personalMessage),
      signature: 't'.repeat(heartRepairGiftLimits.signature),
      certificateNote: 'n'.repeat(heartRepairGiftLimits.certificateNote),
      occasionLabel: 'o'.repeat(heartRepairGiftLimits.occasionLabel),
    })

    expect(gift.giftId).toHaveLength(heartRepairGiftLimits.giftId)
    expect(gift.recipientName).toHaveLength(heartRepairGiftLimits.recipientName)
    expect(gift.senderName).toHaveLength(heartRepairGiftLimits.senderName)
    expect(gift.personalMessage).toHaveLength(heartRepairGiftLimits.personalMessage)
    expect(gift.signature).toHaveLength(heartRepairGiftLimits.signature)
    expect(gift.certificateNote).toHaveLength(heartRepairGiftLimits.certificateNote)
    expect(gift.occasionLabel).toHaveLength(heartRepairGiftLimits.occasionLabel)
  })

  it('tidak membawa diagnosis atau treatment dari configuration; recipient tetap memilihnya', () => {
    const gift = loadHeartRepairGiftConfiguration(validGiftInput)
    const diagnosisState = heartRepairReducer(initialHeartRepairState, {
      type: 'START_INSPECTION',
    })
    const prescriptionState = heartRepairReducer(diagnosisState, {
      type: 'SELECT_DIAGNOSIS',
      conditionId: 'missing-someone',
    })

    expect(gift).not.toHaveProperty('diagnosis')
    expect(gift).not.toHaveProperty('treatment')
    expect(prescriptionState).toEqual({
      phase: 'prescription',
      conditionId: 'missing-someone',
    })
    expect(getHeartCondition('missing-someone').prescription.toolName).toBe(
      'Long-Distance Memory Tape',
    )
  })
})
