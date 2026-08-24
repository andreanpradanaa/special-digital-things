import { describe, expect, it, vi } from 'vitest'
import type { AuthError, SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseClient } from '../../lib/supabase/client.ts'
import type { Database } from '../../types/database.types.ts'
import { createCommerceRepository } from './commerceRepository.ts'

function authError(message: string): AuthError {
  return { name: 'AuthApiError', message } as AuthError
}

function clientBoundary(value: object): SupabaseClient<Database> {
  return value as SupabaseClient<Database>
}

describe('Commerce data-access layer', () => {
  it('menangani konfigurasi Supabase yang belum tersedia tanpa membuat client', () => {
    const result = getSupabaseClient({})

    expect(result).toEqual({
      client: null,
      error: {
        code: 'missing_configuration',
        message:
          'Commerce belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY untuk menggunakan fitur ini.',
      },
    })
  })

  it('mengembalikan error auth terketik ketika anonymous sign-in ditolak', async () => {
    const client = clientBoundary({
      auth: {
        signInAnonymously: vi.fn().mockResolvedValue({ data: { user: null }, error: authError('Anonymous sign-in disabled') }),
      },
    })

    const result = await createCommerceRepository(client).signInAsDemoBuyer()

    expect(result).toEqual({
      data: null,
      error: { code: 'authentication', message: 'Anonymous sign-in disabled' },
    })
  })

  it('membedakan respons entitlement duplikat dari RPC', async () => {
    const client = clientBoundary({
      rpc: vi.fn().mockResolvedValue({
        data: [{ entitlement_id: 'entitlement-1', already_owned: true }],
        error: null,
      }),
    })

    const result = await createCommerceRepository(client).claimDemoProduct('product-1')

    expect(result).toEqual({
      data: { entitlementId: 'entitlement-1', alreadyOwned: true },
      error: null,
    })
  })

  it('meneruskan harga rupiah integer dan currency tanpa perhitungan floating point', async () => {
    const order = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'product-1',
          category_id: 'category-1',
          slug: 'secret-message-machine',
          name: 'Secret Message Machine',
          short_description: 'Pesan kecil.',
          experience_path: '/secret-message-machine',
          price_amount: 69000,
          currency: 'IDR',
          sort_order: 1,
          is_featured: true,
          is_active: true,
          created_at: '2026-08-24T00:00:00.000Z',
          updated_at: '2026-08-24T00:00:00.000Z',
        },
      ],
      error: null,
    })
    const client = clientBoundary({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ order }),
        }),
      }),
    })

    const result = await createCommerceRepository(client).listActiveProducts()

    expect(result.error).toBeNull()
    expect(result.data?.[0]).toMatchObject({ price_amount: 69000, currency: 'IDR' })
    expect(Number.isInteger(result.data?.[0]?.price_amount)).toBe(true)
  })
})
