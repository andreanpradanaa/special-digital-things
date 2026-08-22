export type HeartConditionId =
  | 'tired'
  | 'overthinking'
  | 'bad-day'
  | 'missing-someone'

export type HeartToolId =
  | 'gentle-recharge'
  | 'quiet-mist'
  | 'hug-patch'
  | 'memory-tape'

export type HeartToolVisualKey =
  | 'recharge-cable'
  | 'quiet-mist'
  | 'hug-patch'
  | 'memory-tape'

export type HeartRepairVisualKey =
  | 'battery'
  | 'scribbles'
  | 'crack'
  | 'memory'

export type HeartCondition = {
  id: HeartConditionId
  label: string
  shortLabel: string
  prescription: {
    toolId: HeartToolId
    toolName: string
    visualKey: HeartToolVisualKey
    instruction: string
  }
  repair: {
    visualKey: HeartRepairVisualKey
    successMessage: string
  }
  reveal: {
    heading: string
    body: string
  }
  certificateTreatmentLabel: string
}

export const heartConditions = [
  {
    id: 'tired',
    label: 'Tenagaku hampir habis',
    shortLabel: 'Low energy',
    prescription: {
      toolId: 'gentle-recharge',
      toolName: 'Gentle Recharge Cable',
      visualKey: 'recharge-cable',
      instruction:
        'Sambungkan sedikit tenaga untuk membantu hati beristirahat.',
    },
    repair: {
      visualKey: 'battery',
      successMessage: 'Tenaga kecil sudah tersambung. Hati boleh beristirahat.',
    },
    reveal: {
      heading: 'Tidak apa-apa berhenti sebentar.',
      body:
        'Kamu tidak harus menyelesaikan semuanya hari ini. Nilaimu tidak berkurang hanya karena sekarang kamu membutuhkan istirahat.',
    },
    certificateTreatmentLabel: 'Gentle recharge untuk hari yang melelahkan',
  },
  {
    id: 'overthinking',
    label: 'Pikiranku terlalu ramai',
    shortLabel: 'Too many thoughts',
    prescription: {
      toolId: 'quiet-mist',
      toolName: 'Anti-Overthinking Mist',
      visualKey: 'quiet-mist',
      instruction:
        'Semprotkan sedikit ketenangan pada pikiran yang terlalu penuh.',
    },
    repair: {
      visualKey: 'scribbles',
      successMessage: 'Ruang di sekitar hati terasa sedikit lebih sunyi.',
    },
    reveal: {
      heading: 'Tidak semuanya harus diselesaikan malam ini.',
      body:
        'Tidak semua kemungkinan buruk akan benar-benar terjadi. Kita boleh menyimpan sebagian pikiran untuk besok.',
    },
    certificateTreatmentLabel: 'Quiet mist untuk pikiran yang terlalu ramai',
  },
  {
    id: 'bad-day',
    label: 'Hari ini tidak berjalan baik',
    shortLabel: 'Rough day',
    prescription: {
      toolId: 'hug-patch',
      toolName: 'Emergency Hug Patch',
      visualKey: 'hug-patch',
      instruction:
        'Tempelkan pelukan darurat pada bagian yang terasa retak.',
    },
    repair: {
      visualKey: 'crack',
      successMessage: 'Pelukan darurat sudah menempel dengan lembut.',
    },
    reveal: {
      heading: 'Satu hari tidak menentukan semuanya.',
      body:
        'Hari yang buruk tidak menghapus semua hal baik yang sudah kamu lakukan. Aku tetap bangga padamu.',
    },
    certificateTreatmentLabel: 'Emergency hug patch untuk hari yang berat',
  },
  {
    id: 'missing-someone',
    label: 'Aku sedang sangat merindukan seseorang',
    shortLabel: 'Missing someone',
    prescription: {
      toolId: 'memory-tape',
      toolName: 'Long-Distance Memory Tape',
      visualKey: 'memory-tape',
      instruction:
        'Rekatkan satu kenangan hangat pada bagian yang sedang merindu.',
    },
    repair: {
      visualKey: 'memory',
      successMessage: 'Satu kenangan hangat sudah ikut menjaga hati.',
    },
    reveal: {
      heading: 'Jarak tidak mengambil semuanya.',
      body:
        'Jarak hanya mengubah tempat kita berada, bukan seberapa dekat aku menyimpanmu.',
    },
    certificateTreatmentLabel: 'Long-distance memory tape untuk rasa rindu',
  },
] as const satisfies readonly HeartCondition[]

export function getHeartCondition(conditionId: HeartConditionId): HeartCondition {
  const condition = heartConditions.find(({ id }) => id === conditionId)

  if (!condition) {
    throw new Error(`Diagnosis hati tidak ditemukan: ${conditionId}`)
  }

  return condition
}
