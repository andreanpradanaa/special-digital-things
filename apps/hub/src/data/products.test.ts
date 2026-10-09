import { describe, expect, test } from 'vitest'
import { comingSoonProducts, findProduct, formatIdr, liveProducts, products } from './products'

describe('katalog produk', () => {
  test('membagi produk menjadi live dan coming-soon tanpa tumpang tindih', () => {
    expect(liveProducts.length + comingSoonProducts.length).toBe(products.length)
    expect(liveProducts.every((p) => p.status === 'live')).toBe(true)
    expect(comingSoonProducts.every((p) => p.status === 'coming-soon')).toBe(true)
  })

  test('produk live punya href, harga, langkah, dan FAQ', () => {
    for (const p of liveProducts) {
      expect(p.href).toBeTruthy()
      expect(p.priceIdr).toBeGreaterThan(0)
      expect(p.steps?.length).toBeGreaterThan(0)
      expect(p.faq?.length).toBeGreaterThan(0)
    }
  })

  test('slug unik dan setiap produk punya minimal satu momen', () => {
    const slugs = new Set(products.map((p) => p.slug))
    expect(slugs.size).toBe(products.length)
    expect(products.every((p) => p.occasions.length > 0)).toBe(true)
  })

  test('findProduct mengembalikan produk sesuai slug, undefined bila tidak ada', () => {
    expect(findProduct('goodiebox')?.name).toBe('Goodiebox')
    expect(findProduct('tidak-ada')).toBeUndefined()
    expect(findProduct(undefined)).toBeUndefined()
  })

  test('formatIdr memakai pemisah ribuan Indonesia', () => {
    expect(formatIdr(49000)).toBe('Rp 49.000')
    expect(formatIdr(1250000)).toBe('Rp 1.250.000')
  })
})
