import type { GiftItemData, GiftItemType, LayoutSlot } from './types'

export const INSERT_TOP = 1.2
export const ITEM_CEILING = 1.55
export const HOVER_SCALE = 1.02

// Item footprints may use almost the whole insert. The front edge stops at the
// old reserve because the default camera sight line grazes the front rim just
// behind it; the other edges keep only a lining-width breathing room.
export const ITEM_LAYOUT_BOUNDS = {
  left: -2.72,
  right: 2.72,
  front: -1.58,
  back: 1.95,
  gap: 0.12,
} as const

// Local model bounds include raised decorations and the voucher bevel.
export const itemBounds: Record<GiftItemType, { width: number; depth: number; bottom: number; top: number }> = {
  letter: { width: 1.65, depth: 1.15, bottom: -0.03, top: 0.079 },
  photo: { width: 1.35, depth: 1.55, bottom: -0.035, top: 0.058 },
  music: { width: 1.35, depth: 1.25, bottom: -0.0325, top: 0.053 },
  voucher: { width: 1.784, depth: 0.964, bottom: -0.04, top: 0.055 },
  audio: { width: 1.45, depth: 1.05, bottom: -0.0325, top: 0.061 },
  video: { width: 1.68, depth: 1.05, bottom: -0.035, top: 0.073 },
}

// Realism ceiling shared by every count: the packer decides how large the
// group grows, this only stops one or two small items from becoming billboards.
const MAX_SCALE = 1.9
// Leftover space first widens the gaps up to this width, then spills into the
// outer margins so neighbouring items stay visually related.
const MAX_DISTRIBUTED_GAP = 0.6
const MAX_ROWS = 3
// Stands in for count-only calls (animation fallbacks) that carry no item data.
const FALLBACK_TYPE: GiftItemType = 'audio'

const usableWidth = ITEM_LAYOUT_BOUNDS.right - ITEM_LAYOUT_BOUNDS.left
const usableDepth = ITEM_LAYOUT_BOUNDS.back - ITEM_LAYOUT_BOUNDS.front

// Largest scale a type may render at before its height hits ITEM_CEILING.
function heightCap(type: GiftItemType) {
  const bounds = itemBounds[type]
  return (ITEM_CEILING - INSERT_TOP) / ((bounds.top - bounds.bottom) * HOVER_SCALE)
}

// Unit footprint already inflated by HOVER_SCALE so the collision math and the
// hover state agree; effective size = unit * min(scale, heightCap).
type PackedItem = { type: GiftItemType; index: number; turned: boolean; width: number; depth: number }

function packedItem(type: GiftItemType, index: number, turned: boolean): PackedItem {
  const bounds = itemBounds[type]
  return {
    type,
    index,
    turned,
    width: (turned ? bounds.depth : bounds.width) * HOVER_SCALE,
    depth: (turned ? bounds.width : bounds.depth) * HOVER_SCALE,
  }
}

function effectiveSize(packed: PackedItem, scale: number) {
  const size = Math.min(scale, heightCap(packed.type))
  return { width: packed.width * size, depth: packed.depth * size }
}

// Whether every row fits inside the usable bounds at this scale. Monotone in
// scale, which lets the capped case use a bisection below.
function fitsAt(rows: readonly PackedItem[][], scale: number): boolean {
  let totalDepth = ITEM_LAYOUT_BOUNDS.gap * (rows.length - 1)
  for (const row of rows) {
    let width = ITEM_LAYOUT_BOUNDS.gap * (row.length - 1)
    let depth = 0
    for (const packed of row) {
      const size = effectiveSize(packed, scale)
      width += size.width
      depth = Math.max(depth, size.depth)
    }
    if (width > usableWidth + 1e-9) return false
    totalDepth += depth
  }
  return totalDepth <= usableDepth + 1e-9
}

// Largest shared scale for this arrangement. Flat-only arrangements grow
// linearly so the limit has a closed form; a height-capped item keeps a fixed
// footprint past its cap, and the largest fitting scale is found by bisection
// on the monotone fitsAt predicate.
function fitScale(rows: readonly PackedItem[][]): number {
  const anyCapped = rows.some((row) => row.some((packed) => heightCap(packed.type) < MAX_SCALE))
  if (!anyCapped) {
    let limit = MAX_SCALE
    for (const row of rows) {
      const unitWidth = row.reduce((sum, packed) => sum + packed.width, 0)
      limit = Math.min(limit, (usableWidth - ITEM_LAYOUT_BOUNDS.gap * (row.length - 1)) / unitWidth)
    }
    const unitDepth = rows.reduce((sum, row) => sum + Math.max(...row.map((packed) => packed.depth)), 0)
    limit = Math.min(limit, (usableDepth - ITEM_LAYOUT_BOUNDS.gap * (rows.length - 1)) / unitDepth)
    return Math.max(0, limit)
  }
  let lo = 0
  let hi = MAX_SCALE
  for (let step = 0; step < 40; step += 1) {
    const mid = (lo + hi) / 2
    if (fitsAt(rows, mid)) lo = mid
    else hi = mid
  }
  return lo
}

function compositions(total: number, parts: number): number[][] {
  if (parts === 1) return [[total]]
  const result: number[][] = []
  for (let first = 1; first <= total - (parts - 1); first += 1) {
    for (const rest of compositions(total - first, parts - 1)) result.push([first, ...rest])
  }
  return result
}

type Arrangement = { rows: PackedItem[][]; scale: number; turns: number }

// Slice the size-sorted items into 1-3 consecutive rows and pick the
// arrangement that reaches the largest shared scale, preferring fewer rotated
// items and fewer rows on ties.
function bestArrangement(types: readonly GiftItemType[]): Arrangement {
  const order = types
    .map((type, index) => ({ type, index }))
    .sort((a, b) => {
      const boundsA = itemBounds[a.type]
      const boundsB = itemBounds[b.type]
      const heightA = boundsA.top - boundsA.bottom
      const heightB = boundsB.top - boundsB.bottom
      if (heightB !== heightA) return heightB - heightA
      const areaA = boundsA.width * boundsA.depth
      const areaB = boundsB.width * boundsB.depth
      if (areaB !== areaA) return areaB - areaA
      return a.index - b.index
    })

  let best: Arrangement | null = null
  for (let mask = 0; mask < 2 ** order.length; mask += 1) {
    const packed = order.map((entry, position) => packedItem(entry.type, entry.index, Boolean(mask & (1 << position))))
    const turns = packed.filter((item) => item.turned).length
    for (let rowCount = 1; rowCount <= Math.min(MAX_ROWS, packed.length); rowCount += 1) {
      for (const sizes of compositions(packed.length, rowCount)) {
        const rows: PackedItem[][] = []
        let cursor = 0
        for (const size of sizes) {
          rows.push(packed.slice(cursor, cursor + size))
          cursor += size
        }
        const scale = fitScale(rows)
        if (
          !best
          || scale > best.scale + 1e-6
          || (Math.abs(scale - best.scale) <= 1e-6 && (turns < best.turns || (turns === best.turns && rowCount < best.rows.length)))
        ) {
          best = { rows, scale, turns }
        }
      }
    }
  }
  return best as Arrangement
}

// Place the winning arrangement so the cluster spans the usable bounds: rows
// run back to front, leftover depth widens the row gaps (capped) and what
// remains becomes equal outer margins; each row justifies its own width the
// same way. Slots come back indexed like the input items.
function emit(rows: readonly PackedItem[][], scale: number): LayoutSlot[] {
  const slots: LayoutSlot[] = new Array(rows.reduce((count, row) => count + row.length, 0))
  const rowDepths = rows.map((row) => Math.max(...row.map((packed) => effectiveSize(packed, scale).depth)))
  const rowGaps = rows.length - 1

  const depthUsed = rowDepths.reduce((sum, depth) => sum + depth, 0) + ITEM_LAYOUT_BOUNDS.gap * rowGaps
  const interRowGap = rowGaps > 0
    ? Math.min(MAX_DISTRIBUTED_GAP, ITEM_LAYOUT_BOUNDS.gap + Math.max(0, usableDepth - depthUsed) / rowGaps)
    : ITEM_LAYOUT_BOUNDS.gap
  const depthMargin = Math.max(0, (usableDepth - (depthUsed + (interRowGap - ITEM_LAYOUT_BOUNDS.gap) * rowGaps)) / 2)

  let cursorZ = ITEM_LAYOUT_BOUNDS.back - depthMargin
  rows.forEach((row, rowIndex) => {
    const sizes = row.map((packed) => effectiveSize(packed, scale))
    const widthUsed = sizes.reduce((sum, size) => sum + size.width, 0) + ITEM_LAYOUT_BOUNDS.gap * (row.length - 1)
    const interGap = row.length > 1
      ? Math.min(MAX_DISTRIBUTED_GAP, ITEM_LAYOUT_BOUNDS.gap + Math.max(0, usableWidth - widthUsed) / (row.length - 1))
      : ITEM_LAYOUT_BOUNDS.gap
    const widthMargin = Math.max(0, (usableWidth - (widthUsed + (interGap - ITEM_LAYOUT_BOUNDS.gap) * (row.length - 1))) / 2)

    const centerZ = cursorZ - rowDepths[rowIndex] / 2
    let cursorX = ITEM_LAYOUT_BOUNDS.left + widthMargin
    sizes.forEach((size, position) => {
      const packed = row[position]
      slots[packed.index] = {
        position: [cursorX + size.width / 2, INSERT_TOP, centerZ],
        rotation: [0, packed.turned ? Math.PI / 2 : 0, 0],
        scale,
      }
      cursorX += size.width + interGap
    })
    cursorZ -= rowDepths[rowIndex] + interRowGap
  })
  return slots
}

export function getItemLayout(itemsOrCount: readonly GiftItemData[] | number): LayoutSlot[] {
  const items = typeof itemsOrCount === 'number' ? [] : itemsOrCount.slice(0, 6)
  const count = Math.max(1, Math.min(6, typeof itemsOrCount === 'number' ? itemsOrCount : items.length))

  // Count-only calls are retained for animation fallbacks; real layouts pack
  // the actual item footprints.
  const types = items.length > 0
    ? items.map((item) => item.type)
    : Array.from({ length: count }, () => FALLBACK_TYPE)
  const arrangement = bestArrangement(types)
  return emit(arrangement.rows, arrangement.scale)
}

export function getItemScale(type: GiftItemType, scale: number): number {
  return Math.min(scale, heightCap(type))
}
