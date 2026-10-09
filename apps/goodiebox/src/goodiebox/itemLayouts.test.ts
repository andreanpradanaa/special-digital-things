import { describe, expect, it } from 'vitest'
import {
  getItemLayout,
  getItemScale,
  HOVER_SCALE,
  ITEM_CEILING,
  ITEM_LAYOUT_BOUNDS,
  itemBounds,
  INSERT_TOP,
} from './itemLayouts'
import type { GiftItemData, GiftItemType } from './types'

const itemTypes = Object.keys(itemBounds) as GiftItemType[]

function item(type: GiftItemType, index: number): GiftItemData {
  const base = { id: `${type}-${index}`, title: type }
  switch (type) {
    case 'letter': return { ...base, type, message: '', signature: '' }
    case 'photo': return { ...base, type }
    case 'music': return { ...base, type, subtitle: '', url: '' }
    case 'voucher': return { ...base, type, description: '', code: '' }
    case 'audio': return { ...base, type, duration: '' }
    case 'video': return { ...base, type, url: '' }
  }
}

// Geometric validity only depends on the multiset of item types (the packer
// sorts them internally), so combinations with replacement cover every shape
// the packer can see without the 100x cost of ordered selections.
function combinations(count: number, chosen: GiftItemType[] = [], firstAllowed = 0): GiftItemType[][] {
  if (chosen.length === count) return [chosen]
  const result: GiftItemType[][] = []
  for (let index = firstAllowed; index < itemTypes.length; index += 1) {
    result.push(...combinations(count, [...chosen, itemTypes[index]], index))
  }
  return result
}

function footprint(type: GiftItemType, rotationY: number, scale: number, x: number, z: number) {
  const bounds = itemBounds[type]
  const quarterTurn = Math.abs(Math.sin(rotationY)) > 0.5
  const width = (quarterTurn ? bounds.depth : bounds.width) * scale * HOVER_SCALE
  const depth = (quarterTurn ? bounds.width : bounds.depth) * scale * HOVER_SCALE
  return {
    left: x - width / 2,
    right: x + width / 2,
    front: z - depth / 2,
    back: z + depth / 2,
  }
}

const usableWidth = ITEM_LAYOUT_BOUNDS.right - ITEM_LAYOUT_BOUNDS.left
const usableDepth = ITEM_LAYOUT_BOUNDS.back - ITEM_LAYOUT_BOUNDS.front

function boxesFor(types: GiftItemType[], layout: ReturnType<typeof getItemLayout>) {
  return layout.map((slot, index) => footprint(
    types[index],
    slot.rotation[1],
    getItemScale(types[index], slot.scale),
    slot.position[0],
    slot.position[2],
  ))
}

describe('adaptive item layouts', () => {
  it('packs three mixed cards edge to edge across the insert', () => {
    const types: GiftItemType[] = ['letter', 'video', 'music']
    const layout = getItemLayout(types.map(item))

    // One shared scale, at most two rows, and a clear size jump over the old
    // 1.34 per-count cap.
    expect(new Set(layout.map((slot) => slot.scale.toFixed(6))).size).toBe(1)
    expect(new Set(layout.map((slot) => slot.position[2].toFixed(6))).size).toBeLessThanOrEqual(2)
    expect(layout[0].scale).toBeGreaterThanOrEqual(1.4)

    const boxes = boxesFor(types, layout)
    expect(Math.min(...boxes.map((box) => box.left))).toBeCloseTo(ITEM_LAYOUT_BOUNDS.left, 6)
    expect(Math.max(...boxes.map((box) => box.right))).toBeCloseTo(ITEM_LAYOUT_BOUNDS.right, 6)
  })

  it('is deterministic for the same input', () => {
    const types: GiftItemType[] = ['voucher', 'photo', 'music', 'letter', 'audio', 'video']
    expect(JSON.stringify(getItemLayout(types.map(item)))).toBe(JSON.stringify(getItemLayout(types.map(item))))
  })

  it('centers a single item at the realism ceiling', () => {
    const layout = getItemLayout([item('letter', 0)])
    expect(layout).toHaveLength(1)
    expect(layout[0].scale).toBeCloseTo(1.9, 6)
    expect(layout[0].position[0]).toBeCloseTo(0, 6)
    expect(layout[0].position[2]).toBeCloseTo((ITEM_LAYOUT_BOUNDS.front + ITEM_LAYOUT_BOUNDS.back) / 2, 6)
  })

  for (let count = 1; count <= 6; count += 1) {
    it(`keeps every ${count}-item combination inside the insert without collisions`, () => {
      for (const types of combinations(count)) {
        const layout = getItemLayout(types.map(item))
        const boxes = layout.map((slot, index) => {
          const scale = getItemScale(types[index], slot.scale)
          const bounds = itemBounds[types[index]]
          expect(INSERT_TOP + (bounds.top - bounds.bottom) * scale * HOVER_SCALE).toBeLessThanOrEqual(ITEM_CEILING + 1e-7)
          return footprint(types[index], slot.rotation[1], scale, slot.position[0], slot.position[2])
        })

        for (const box of boxes) {
          expect(box.left).toBeGreaterThanOrEqual(ITEM_LAYOUT_BOUNDS.left - 1e-7)
          expect(box.right).toBeLessThanOrEqual(ITEM_LAYOUT_BOUNDS.right + 1e-7)
          expect(box.front).toBeGreaterThanOrEqual(ITEM_LAYOUT_BOUNDS.front - 1e-7)
          expect(box.back).toBeLessThanOrEqual(ITEM_LAYOUT_BOUNDS.back + 1e-7)
        }

        for (let first = 0; first < boxes.length; first += 1) {
          for (let second = first + 1; second < boxes.length; second += 1) {
            const a = boxes[first]
            const b = boxes[second]
            const separated = a.right + ITEM_LAYOUT_BOUNDS.gap <= b.left + 1e-7
              || b.right + ITEM_LAYOUT_BOUNDS.gap <= a.left + 1e-7
              || a.back + ITEM_LAYOUT_BOUNDS.gap <= b.front + 1e-7
              || b.back + ITEM_LAYOUT_BOUNDS.gap <= a.front + 1e-7
            expect(separated, `${count}: ${types.join(', ')}`).toBe(true)
          }
        }

        if (count >= 2) {
          const width = Math.max(...boxes.map((box) => box.right)) - Math.min(...boxes.map((box) => box.left))
          const depth = Math.max(...boxes.map((box) => box.back)) - Math.min(...boxes.map((box) => box.front))
          // Flat-only mixes must fill the insert on their binding axis.
          // MAX_SCALE-capped pairs top out around 0.9.
          expect(Math.max(width / usableWidth, depth / usableDepth), `${count}: ${types.join(', ')}`)
            .toBeGreaterThanOrEqual(0.88)
        }
      }
    })
  }
})
