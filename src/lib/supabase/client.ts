import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../types/database.types.ts'

export type SupabaseEnvironment = {
  publishableKey?: string
  url?: string
}

export type SupabaseConfigurationError = {
  code: 'missing_configuration'
  message: string
}

export type SupabaseClientResult =
  | { client: SupabaseClient<Database>; error: null }
  | { client: null; error: SupabaseConfigurationError }

let cachedClient: SupabaseClient<Database> | null = null
let cachedConfiguration: string | null = null

export function readSupabaseEnvironment(): SupabaseEnvironment {
  return {
    url: import.meta.env.VITE_SUPABASE_URL,
    publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  }
}

export function getSupabaseClient(
  environment: SupabaseEnvironment = readSupabaseEnvironment(),
): SupabaseClientResult {
  const url = environment.url?.trim()
  const publishableKey = environment.publishableKey?.trim()

  if (!url || !publishableKey) {
    return {
      client: null,
      error: {
        code: 'missing_configuration',
        message:
          'Commerce belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY untuk menggunakan fitur ini.',
      },
    }
  }

  const configuration = `${url}\u0000${publishableKey}`
  if (!cachedClient || cachedConfiguration !== configuration) {
    cachedClient = createClient<Database>(url, publishableKey)
    cachedConfiguration = configuration
  }

  return { client: cachedClient, error: null }
}
