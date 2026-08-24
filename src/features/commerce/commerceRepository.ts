import type { AuthError, SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseClient } from '../../lib/supabase/client.ts'
import type { Database } from '../../types/database.types.ts'

type Category = Database['public']['Tables']['categories']['Row']
type Product = Database['public']['Tables']['products']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']
type Order = Database['public']['Tables']['orders']['Row']
type Entitlement = Database['public']['Tables']['entitlements']['Row']

export type Buyer = Pick<Profile, 'id' | 'display_name'> & { isAnonymous: boolean }

export type DemoClaim = {
  alreadyOwned: boolean
  entitlementId: string
}

export type CommerceErrorCode =
  | 'missing_configuration'
  | 'authentication'
  | 'database'
  | 'invalid_response'

export type CommerceError = {
  code: CommerceErrorCode
  message: string
}

export type CommerceResult<T> =
  | { data: T; error: null }
  | { data: null; error: CommerceError }

export type CommerceRepository = {
  getCurrentBuyer: () => Promise<CommerceResult<Buyer | null>>
  signInAsDemoBuyer: () => Promise<CommerceResult<Buyer>>
  signOutBuyer: () => Promise<CommerceResult<undefined>>
  listActiveCategories: () => Promise<CommerceResult<Category[]>>
  listActiveProducts: () => Promise<CommerceResult<Product[]>>
  claimDemoProduct: (productId: string) => Promise<CommerceResult<DemoClaim>>
  listBuyerEntitlements: () => Promise<CommerceResult<Entitlement[]>>
  listBuyerOrders: () => Promise<CommerceResult<Order[]>>
}

function failure(code: CommerceErrorCode, message: string): CommerceResult<never> {
  return { data: null, error: { code, message } }
}

function fromAuthError(error: AuthError): CommerceResult<never> {
  return failure('authentication', error.message)
}

function fromDatabaseError(message: string): CommerceResult<never> {
  return failure('database', message)
}

function isMissingSessionError(error: AuthError): boolean {
  return error.name === 'AuthSessionMissingError'
}

async function readBuyer(
  client: SupabaseClient<Database>,
): Promise<CommerceResult<Buyer | null>> {
  const { data: userData, error: userError } = await client.auth.getUser()

  if (userError) {
    return isMissingSessionError(userError) ? { data: null, error: null } : fromAuthError(userError)
  }

  if (!userData.user) return { data: null, error: null }

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('id, display_name')
    .eq('id', userData.user.id)
    .maybeSingle()

  if (profileError) return fromDatabaseError(profileError.message)
  if (!profile) return failure('invalid_response', 'Profile pembeli belum tersedia.')

  return {
    data: {
      id: profile.id,
      display_name: profile.display_name,
      isAnonymous: userData.user.is_anonymous === true,
    },
    error: null,
  }
}

export function createCommerceRepository(client: SupabaseClient<Database>): CommerceRepository {
  return {
    getCurrentBuyer: () => readBuyer(client),

    async signInAsDemoBuyer() {
      const { data, error } = await client.auth.signInAnonymously()
      if (error) return fromAuthError(error)
      if (!data.user) return failure('invalid_response', 'Supabase tidak mengembalikan akun demo.')

      return readBuyer(client).then((result) => {
        if (result.error || !result.data) {
          return result.error
            ? result
            : failure('invalid_response', 'Profile akun demo belum tersedia.')
        }
        return { data: result.data, error: null }
      })
    },

    async signOutBuyer() {
      const { error } = await client.auth.signOut()
      return error ? fromAuthError(error) : { data: undefined, error: null }
    },

    async listActiveCategories() {
      const { data, error } = await client
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      return error ? fromDatabaseError(error.message) : { data, error: null }
    },

    async listActiveProducts() {
      const { data, error } = await client
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      return error ? fromDatabaseError(error.message) : { data, error: null }
    },

    async claimDemoProduct(productId) {
      const { data, error } = await client.rpc('claim_demo_product', { product_id: productId })
      if (error) return fromDatabaseError(error.message)

      const claim = data[0]
      if (!claim) return failure('invalid_response', 'Claim demo tidak mengembalikan entitlement.')

      return {
        data: { entitlementId: claim.entitlement_id, alreadyOwned: claim.already_owned },
        error: null,
      }
    },

    async listBuyerEntitlements() {
      const { data, error } = await client
        .from('entitlements')
        .select('*')
        .order('granted_at', { ascending: false })

      return error ? fromDatabaseError(error.message) : { data, error: null }
    },

    async listBuyerOrders() {
      const { data, error } = await client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      return error ? fromDatabaseError(error.message) : { data, error: null }
    },
  }
}

function getConfiguredRepository(): CommerceResult<CommerceRepository> {
  const result = getSupabaseClient()
  return result.error
    ? failure('missing_configuration', result.error.message)
    : { data: createCommerceRepository(result.client), error: null }
}

async function withRepository<T>(
  operation: (repository: CommerceRepository) => Promise<CommerceResult<T>>,
): Promise<CommerceResult<T>> {
  const result = getConfiguredRepository()
  return result.error ? result : operation(result.data)
}

export function getCurrentBuyer(): Promise<CommerceResult<Buyer | null>> {
  return withRepository((repository) => repository.getCurrentBuyer())
}

export function signInAsDemoBuyer(): Promise<CommerceResult<Buyer>> {
  return withRepository((repository) => repository.signInAsDemoBuyer())
}

export function signOutBuyer(): Promise<CommerceResult<undefined>> {
  return withRepository((repository) => repository.signOutBuyer())
}

export function listActiveCategories(): Promise<CommerceResult<Category[]>> {
  return withRepository((repository) => repository.listActiveCategories())
}

export function listActiveProducts(): Promise<CommerceResult<Product[]>> {
  return withRepository((repository) => repository.listActiveProducts())
}

export function claimDemoProduct(productId: string): Promise<CommerceResult<DemoClaim>> {
  return withRepository((repository) => repository.claimDemoProduct(productId))
}

export function listBuyerEntitlements(): Promise<CommerceResult<Entitlement[]>> {
  return withRepository((repository) => repository.listBuyerEntitlements())
}

export function listBuyerOrders(): Promise<CommerceResult<Order[]>> {
  return withRepository((repository) => repository.listBuyerOrders())
}
