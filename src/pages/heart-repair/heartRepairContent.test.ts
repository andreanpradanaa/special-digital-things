import { describe, expect, it } from 'vitest'
import { heartConditions } from './heartRepairContent.ts'

describe('heart repair content', () => {
  it('memberi setiap diagnosis tepat satu prescription, reveal, dan treatment certificate', () => {
    expect(heartConditions).toHaveLength(4)
    expect(new Set(heartConditions.map(({ id }) => id)).size).toBe(4)
    expect(
      new Set(heartConditions.map(({ prescription }) => prescription.toolId)).size,
    ).toBe(4)

    for (const condition of heartConditions) {
      expect(condition.prescription.toolName).not.toHaveLength(0)
      expect(condition.prescription.instruction).not.toHaveLength(0)
      expect(condition.reveal.heading).not.toHaveLength(0)
      expect(condition.reveal.body).not.toHaveLength(0)
      expect(condition.certificateTreatmentLabel).not.toHaveLength(0)
    }
  })
})
