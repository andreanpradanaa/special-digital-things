import { describe, expect, it } from 'vitest'
import { seedIds, seedRecords } from './unsaidGardenContent.ts'
import { initialUnsaidGardenState, unsaidGardenReducer } from './unsaidGardenReducer.ts'

function chooseAndPlant(state: ReturnType<typeof unsaidGardenReducer>, seedId: typeof seedIds[number]) {
  const chosen = unsaidGardenReducer(state, { type: 'SELECT_SEED', seedId })
  return unsaidGardenReducer(chosen, { type: 'PLANT_SEED' })
}

function growAndPreserve(state: ReturnType<typeof unsaidGardenReducer>, seedId: typeof seedIds[number]) {
  let next = chooseAndPlant(state, seedId)
  next = unsaidGardenReducer(next, { type: 'WATER_SEED' })
  next = unsaidGardenReducer(next, { type: 'ILLUMINATE_SEED' })
  next = unsaidGardenReducer(next, { type: 'BLOOM_SEED' })
  return unsaidGardenReducer(next, { type: 'PRESERVE_SEED' })
}

describe('unsaid garden content and reducer', () => {
  it('defines five unique complete seed records', () => {
    expect(new Set(seedIds).size).toBe(5)
    expect(seedRecords).toHaveLength(5)
    for (const seed of seedRecords) expect(seed.message && seed.visualKey && seed.accessibleDescription).toBeTruthy()
  })

  it('does not plant without a selected seed or tend before planting', () => {
    expect(unsaidGardenReducer(initialUnsaidGardenState, { type: 'PLANT_SEED' })).toEqual(initialUnsaidGardenState)
    const choosing = unsaidGardenReducer(initialUnsaidGardenState, { type: 'OPEN_GREENHOUSE' })
    expect(unsaidGardenReducer(choosing, { type: 'WATER_SEED' })).toEqual(choosing)
  })

  it('allows water and light in either order and makes care idempotent', () => {
    const choosing = unsaidGardenReducer(initialUnsaidGardenState, { type: 'OPEN_GREENHOUSE' })
    const planted = chooseAndPlant(choosing, 'moonflower')
    const lit = unsaidGardenReducer(planted, { type: 'ILLUMINATE_SEED' })
    const cared = unsaidGardenReducer(lit, { type: 'WATER_SEED' })
    expect(cared).toMatchObject({ phase: 'tending', care: { watered: true, illuminated: true } })
    expect(unsaidGardenReducer(cared, { type: 'WATER_SEED' })).toEqual(cared)
  })

  it('locks bloom until water and light are complete', () => {
    const choosing = unsaidGardenReducer(initialUnsaidGardenState, { type: 'OPEN_GREENHOUSE' })
    const planted = chooseAndPlant(choosing, 'moonflower')
    expect(unsaidGardenReducer(planted, { type: 'BLOOM_SEED' })).toEqual(planted)
  })

  it('preserves IDs uniquely, blocks reused seed, and unlocks herbarium at three', () => {
    let state = unsaidGardenReducer(initialUnsaidGardenState, { type: 'OPEN_GREENHOUSE' })
    state = growAndPreserve(state, 'moonflower')
    expect(state).toMatchObject({ phase: 'choosing', preservedSeedIds: ['moonflower'] })
    expect(unsaidGardenReducer(state, { type: 'SELECT_SEED', seedId: 'moonflower' })).toEqual(state)
    state = growAndPreserve(state, 'bellflower')
    expect(unsaidGardenReducer(state, { type: 'OPEN_HERBARIUM' })).toEqual(state)
    state = growAndPreserve(state, 'clover')
    expect(state).toMatchObject({ phase: 'bloom', preservedSeedIds: ['moonflower', 'bellflower', 'clover'] })
    expect(unsaidGardenReducer(state, { type: 'OPEN_HERBARIUM' })).toMatchObject({ phase: 'herbarium' })
  })

  it('replay resets selected seed, care, preserved IDs, and phase', () => {
    const choosing = unsaidGardenReducer(initialUnsaidGardenState, { type: 'OPEN_GREENHOUSE' })
    const state = growAndPreserve(choosing, 'moonflower')
    expect(unsaidGardenReducer(state, { type: 'RESET' })).toEqual(initialUnsaidGardenState)
  })
})
