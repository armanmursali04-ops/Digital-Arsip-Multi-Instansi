import fs from 'node:fs'
import path from 'node:path'

function readEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {}
  const result: Record<string, string> = {}
  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
    result[key] = val
  }
  return result
}

const localEnv = {
  ...readEnvFile(path.resolve(process.cwd(), '.env')),
  ...readEnvFile(path.resolve(process.cwd(), '.env.local'))
}

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || localEnv.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || localEnv.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
    }
  },
  app: {
    head: {
      title: 'Digital Arsip',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.bunny.net' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.bunny.net/css?family=figtree:400,500,600,700,800&display=swap'
        }
      ]
    }
  },
  tailwindcss: {
    configPath: '~/tailwind.config.js'
  },
  vite: {
    optimizeDeps: {
      include: ['@supabase/supabase-js', 'chart.js', 'vue-chartjs', 'qrcode', 'xlsx', 'jspdf']
    }
  }
})
