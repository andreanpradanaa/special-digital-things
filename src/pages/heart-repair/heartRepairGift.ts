export const heartRepairGiftLimits = {
  giftId: 80,
  recipientName: 40,
  senderName: 40,
  personalMessage: 320,
  signature: 40,
  certificateNote: 180,
  occasionLabel: 80,
} as const

export type HeartRepairGiftConfigurationInput = {
  giftId: string
  recipientName: string
  senderName: string
  personalMessage: string
  signature?: string
  certificateNote?: string
  occasionLabel?: string
}

export type HeartRepairGiftConfiguration = {
  giftId: string
  recipientName: string
  senderName: string
  personalMessage: string
  signature: string
  certificateNote?: string
  occasionLabel?: string
}

function normalizeRequiredField(
  field: keyof HeartRepairGiftConfigurationInput,
  value: string,
  maximumLength: number,
) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new Error(`${field} wajib diisi.`)
  }

  if (normalizedValue.length > maximumLength) {
    throw new Error(`${field} maksimal ${maximumLength} karakter.`)
  }

  return normalizedValue
}

function normalizeOptionalField(
  field: 'signature' | 'certificateNote' | 'occasionLabel',
  value: string | undefined,
  maximumLength: number,
) {
  const normalizedValue = value?.trim()

  if (!normalizedValue) {
    return undefined
  }

  if (normalizedValue.length > maximumLength) {
    throw new Error(`${field} maksimal ${maximumLength} karakter.`)
  }

  return normalizedValue
}

export function loadHeartRepairGiftConfiguration(
  input: HeartRepairGiftConfigurationInput,
): HeartRepairGiftConfiguration {
  const senderName = normalizeRequiredField(
    'senderName',
    input.senderName,
    heartRepairGiftLimits.senderName,
  )

  return {
    giftId: normalizeRequiredField('giftId', input.giftId, heartRepairGiftLimits.giftId),
    recipientName: normalizeRequiredField(
      'recipientName',
      input.recipientName,
      heartRepairGiftLimits.recipientName,
    ),
    senderName,
    personalMessage: normalizeRequiredField(
      'personalMessage',
      input.personalMessage,
      heartRepairGiftLimits.personalMessage,
    ),
    signature:
      normalizeOptionalField(
        'signature',
        input.signature,
        heartRepairGiftLimits.signature,
      ) ?? senderName,
    certificateNote: normalizeOptionalField(
      'certificateNote',
      input.certificateNote,
      heartRepairGiftLimits.certificateNote,
    ),
    occasionLabel: normalizeOptionalField(
      'occasionLabel',
      input.occasionLabel,
      heartRepairGiftLimits.occasionLabel,
    ),
  }
}

/**
 * Development fixture only. A future private-link loader should pass an order's
 * input through loadHeartRepairGiftConfiguration instead of changing scene code.
 */
export const developmentHeartRepairGift = loadHeartRepairGiftConfiguration({
  giftId: 'development-heart-repair-001',
  recipientName: 'Rani',
  senderName: 'Dimas',
  personalMessage:
    'Terima kasih sudah bertahan hari ini. Tidak semua hal harus kamu selesaikan sendiri; aku tetap ada untukmu.',
  signature: 'Dimas',
  certificateNote: 'Simpan surat kecil ini saat kamu membutuhkan pengingat.',
  occasionLabel: 'Untuk hari yang berat',
})

declare global {
  interface Window {
    __HEART_REPAIR_GIFT_CONFIGURATION__?: HeartRepairGiftConfigurationInput
  }
}

export function getHeartRepairGiftConfiguration() {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const developmentOverride = window.__HEART_REPAIR_GIFT_CONFIGURATION__

    if (developmentOverride) {
      return loadHeartRepairGiftConfiguration(developmentOverride)
    }
  }

  return developmentHeartRepairGift
}
