import { describe, expect, it } from 'vitest'
import {
  heartRepairReducer,
  initialHeartRepairState,
} from './heartRepairReducer.ts'

describe('heartRepairReducer', () => {
  it('hanya mengizinkan transition yang valid dan membawa repair selesai ke reveal', () => {
    const invalidStart = heartRepairReducer(initialHeartRepairState, {
      type: 'START_REPAIR',
    })
    const diagnosis = heartRepairReducer(initialHeartRepairState, {
      type: 'START_INSPECTION',
    })
    const prescription = heartRepairReducer(diagnosis, {
      type: 'SELECT_DIAGNOSIS',
      conditionId: 'bad-day',
    })
    const repairReady = heartRepairReducer(prescription, {
      type: 'START_REPAIR',
    })
    const invalidReveal = heartRepairReducer(repairReady, {
      type: 'OPEN_REVEAL',
    })
    const repaired = heartRepairReducer(repairReady, {
      type: 'COMPLETE_REPAIR',
    })
    const reveal = heartRepairReducer(repaired, { type: 'OPEN_REVEAL' })

    expect(invalidStart).toEqual(initialHeartRepairState)
    expect(prescription).toEqual({ phase: 'prescription', conditionId: 'bad-day' })
    expect(invalidReveal).toEqual(repairReady)
    expect(repaired).toEqual({
      phase: 'repairing',
      conditionId: 'bad-day',
      repairStatus: 'succeeded',
    })
    expect(reveal).toEqual({ phase: 'reveal', conditionId: 'bad-day' })
  })

  it('reset selalu mengembalikan work order awal', () => {
    const certificate = {
      phase: 'certificate' as const,
      conditionId: 'tired' as const,
    }

    expect(heartRepairReducer(certificate, { type: 'RESET' })).toEqual(
      initialHeartRepairState,
    )
  })
})
