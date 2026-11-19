import { defineEventHandler, setHeader, send } from 'h3'

const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="14" fill="#0B192C"/><path d="M48.5 23L47.1 45.7A4.5 4.5 0 0 1 42.6 50H21.4a4.5 4.5 0 0 1-4.5-4.3L15.5 23m16.5 6v13.5m0 0l-6-6m6 6l6-6M14.75 23h34.5c1.24 0 2.25-1.01 2.25-2.25v-3c0-1.24-1.01-2.25-2.25-2.25h-34.5c-1.24 0-2.25 1.01-2.25 2.25v3c0 1.24 1.01 2.25 2.25 2.25Z" stroke="#38BDF8" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const supabaseUrl = String(config.public.supabaseUrl || '').replace(/\/+$/, '')
  const supabaseKey = String(config.public.supabaseAnonKey || '').trim()

  setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/settings?select=logo&limit=1`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        },
        signal: AbortSignal.timeout(3000)
      })
      if (res.ok) {
        const rows = (await res.json()) as Array<{ logo?: string | null }>
        const logoPath = rows?.[0]?.logo?.trim()
        if (logoPath) {
          let logoUrl = logoPath
          if (!logoPath.startsWith('http://') && !logoPath.startsWith('https://') && !logoPath.startsWith('data:')) {
            if (logoPath.startsWith('settings/')) {
              const clean = logoPath.replace(/^settings\//, '')
              logoUrl = `${supabaseUrl}/storage/v1/object/public/settings/${clean}`
            } else {
              logoUrl = `${supabaseUrl}/storage/v1/object/public/arsip/${logoPath}`
            }
          }
          if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
            const imgRes = await fetch(logoUrl, { signal: AbortSignal.timeout(3000) })
            if (imgRes.ok) {
              const contentType = imgRes.headers.get('content-type') || 'image/png'
              const buf = Buffer.from(await imgRes.arrayBuffer())
              setHeader(event, 'Content-Type', contentType)
              return send(event, buf)
            }
          }
        }
      }
    } catch {
      // fall through to SVG fallback
    }
  }

  setHeader(event, 'Content-Type', 'image/svg+xml')
  return send(event, FALLBACK_SVG)
})

