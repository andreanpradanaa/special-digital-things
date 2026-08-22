import { type SeedId } from './unsaidGardenContent.ts'

export type GardenPhase = 'arrival' | 'choosing' | 'planting' | 'tending' | 'bloom' | 'herbarium'
type Care = { watered: boolean; illuminated: boolean }
type ActiveGarden = { selectedSeedId: SeedId; planted: boolean; care: Care; preservedSeedIds: SeedId[] }

export type UnsaidGardenState =
  | { phase: 'arrival'; selectedSeedId: null; planted: false; care: Care; preservedSeedIds: SeedId[] }
  | ({ phase: 'choosing' } & Omit<ActiveGarden, 'selectedSeedId'> & { selectedSeedId: null })
  | ({ phase: 'planting' } & ActiveGarden)
  | ({ phase: 'tending' } & ActiveGarden)
  | ({ phase: 'bloom' } & ActiveGarden)
  | ({ phase: 'herbarium' } & Omit<ActiveGarden, 'selectedSeedId' | 'planted' | 'care'> & { selectedSeedId: null; planted: false; care: Care })

export type UnsaidGardenEvent =
  | { type: 'OPEN_GREENHOUSE' }
  | { type: 'SELECT_SEED'; seedId: SeedId }
  | { type: 'PLANT_SEED' }
  | { type: 'WATER_SEED' }
  | { type: 'ILLUMINATE_SEED' }
  | { type: 'BLOOM_SEED' }
  | { type: 'PRESERVE_SEED' }
  | { type: 'OPEN_HERBARIUM' }
  | { type: 'RESET' }

export const initialUnsaidGardenState: UnsaidGardenState = {
  phase: 'arrival', selectedSeedId: null, planted: false,
  care: { watered: false, illuminated: false }, preservedSeedIds: [],
}

function freshCare(): Care { return { watered: false, illuminated: false } }
function addUnique(ids: SeedId[], id: SeedId): SeedId[] { return ids.includes(id) ? ids : [...ids, id] }

export function unsaidGardenReducer(state: UnsaidGardenState, event: UnsaidGardenEvent): UnsaidGardenState {
  if (event.type === 'RESET') return initialUnsaidGardenState
  switch (state.phase) {
    case 'arrival': return event.type === 'OPEN_GREENHOUSE' ? { ...state, phase: 'choosing' } : state
    case 'choosing':
      return event.type === 'SELECT_SEED' && !state.preservedSeedIds.includes(event.seedId)
        ? { ...state, phase: 'planting', selectedSeedId: event.seedId, planted: false, care: freshCare() }
        : state
    case 'planting':
      return event.type === 'PLANT_SEED' ? { ...state, phase: 'tending', planted: true } : state
    case 'tending':
      if (!state.planted) return state
      if (event.type === 'WATER_SEED') return { ...state, care: { ...state.care, watered: true } }
      if (event.type === 'ILLUMINATE_SEED') return { ...state, care: { ...state.care, illuminated: true } }
      return event.type === 'BLOOM_SEED' && state.care.watered && state.care.illuminated
        ? { ...state, phase: 'bloom' }
        : state
    case 'bloom':
      if (event.type === 'OPEN_HERBARIUM') {
        return state.preservedSeedIds.length >= 3
          ? { phase: 'herbarium', selectedSeedId: null, planted: false, care: freshCare(), preservedSeedIds: state.preservedSeedIds }
          : state
      }
      if (event.type !== 'PRESERVE_SEED') return state
      const preservedSeedIds = addUnique(state.preservedSeedIds, state.selectedSeedId)
      return preservedSeedIds.length >= 3
        ? { ...state, preservedSeedIds }
        : { phase: 'choosing', selectedSeedId: null, planted: false, care: freshCare(), preservedSeedIds }
    case 'herbarium':
      return event.type === 'OPEN_HERBARIUM' ? state : state
  }
}
