import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null = null

export function useSupabaseClient(): SupabaseClient | null {
  const config = useRuntimeConfig()
  const url = String(config.public.supabaseUrl || '').trim()
  const key = String(config.public.supabaseAnonKey || '').trim()

  if (!url || !key) {
    return null
  }

  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  }

  return cachedClient
}

export function isSupabaseConfigured(): boolean {
  const config = useRuntimeConfig()
  const url = String(config.public.supabaseUrl || '').trim()
  const key = String(config.public.supabaseAnonKey || '').trim()
  return Boolean(url && key)
}

