import type {
  ActivityLogRecord,
  ArsipRecord,
  ArsipVersionRecord,
  InstansiRecord,
  KategoriRecord,
  ProfileRecord,
  RoleRecord,
  SettingRecord,
  SubjekRecord
} from '~/types/arsip'

const DEFAULT_PLACEHOLDER_LOGO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'%3E%3Crect width='64' height='64' rx='14' fill='%230B192C'/%3E%3Cpath d='M48.5 23L47.1 45.7A4.5 4.5 0 0 1 42.6 50H21.4a4.5 4.5 0 0 1-4.5-4.3L15.5 23m16.5 6v13.5m0 0l-6-6m6 6l6-6M14.75 23h34.5c1.24 0 2.25-1.01 2.25-2.25v-3c0-1.24-1.01-2.25-2.25-2.25h-34.5c-1.24 0-2.25 1.01-2.25 2.25v3c0 1.24 1.01 2.25 2.25 2.25Z' stroke='%2338BDF8' stroke-width='3.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"

export interface HeroConfig {
  title: string
  subtitle: string
  image: string | null
}

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80'

const DEFAULT_HERO_CONFIG: HeroConfig = {
  title: 'Pengelolaan Arsip Digital yang Terstruktur, Aman, dan Mudah Ditelusuri',
  subtitle: '',
  image: null
}

const PENDING_USER_STORAGE_KEY = 'digital_arsip_multi_pending_user'

export const RESERVED_SLUGS = new Set([
  'login',
  'superadmin-login',
  'dashboard',
  'api',
  '_nuxt',
  'favicon.ico',
  'admin',
  'register',
  'auth'
])

export const DEFAULT_KATEGORI_SEEDS = [
  { nama: 'Surat Masuk', color: '#0EA5A4', deskripsi: 'Arsip surat-surat masuk instansi atau sekolah.' },
  { nama: 'Surat Keluar', color: '#2563EB', deskripsi: 'Arsip surat keluar resmi yang diterbitkan.' },
  { nama: 'Laporan', color: '#7C3AED', deskripsi: 'Laporan berkala, laporan kegiatan, dan evaluasi.' },
  { nama: 'Notulen / Risalah', color: '#F97316', deskripsi: 'Catatan hasil rapat dan risalah pertemuan.' },
  { nama: 'Kontrak / SK', color: '#DC2626', deskripsi: 'Dokumen surat keputusan, kontrak, dan perjanjian.' },
  { nama: 'SOP / Prosedur', color: '#059669', deskripsi: 'Standar Operasional Prosedur dan panduan kerja.' },
  { nama: 'Keuangan', color: '#0B7A75', deskripsi: 'Dokumen keuangan, anggaran, dan transaksi.' },
  { nama: 'Kepegawaian / Guru', color: '#EA580C', deskripsi: 'Dokumen kepegawaian, guru, dan SDM.' },
  { nama: 'Kesiswaan / Akademik', color: '#7F1D1D', deskripsi: 'Dokumen akademik, kurikulum, dan kesiswaan.' },
  { nama: 'Presentasi / Materi', color: '#0F172A', deskripsi: 'Slide presentasi, materi pembelajaran, dan paparan.' }
]

export const DEFAULT_SUBJEK_SEEDS = [
  { nama: 'Administrasi Umum', color: '#0EA5A4', deskripsi: 'Dokumen administrasi umum seperti surat-menyurat, nota, memo.' },
  { nama: 'Keuangan & BOS', color: '#2563EB', deskripsi: 'Laporan keuangan, bukti pembayaran, anggaran.' },
  { nama: 'Pendidik & Tenaga Kependidikan', color: '#7C3AED', deskripsi: 'Data guru, staf, SK penugasan, absensi.' },
  { nama: 'Kurikulum & Pembelajaran', color: '#DC2626', deskripsi: 'Silabus, RPP, jadwal akademik, penilaian.' },
  { nama: 'Kesiswaan & Alumni', color: '#059669', deskripsi: 'Data siswa, prestasi, kegiatan ekstrakurikuler, ijazah.' },
  { nama: 'Sarana & Prasarana', color: '#0B7A75', deskripsi: 'Inventaris barang, gedung, laboratorium, perpustakaan.' },
  { nama: 'Humas & Kerja Sama', color: '#EA580C', deskripsi: 'MoU instansi luar, komite sekolah, publikasi.' },
  { nama: 'Akreditasi & Mutu', color: '#F97316', deskripsi: 'Dokumen borang akreditasi, evaluasi diri, sertifikat.' },
  { nama: 'Kegiatan & Acara', color: '#7F1D1D', deskripsi: 'Proposal, dokumentasi, dan laporan kepanitiaan.' },
  { nama: 'Audit & Kepatuhan', color: '#0F172A', deskripsi: 'Laporan pengawasan, pemeriksaan, dan kepatuhan.' }
]

export interface ConfirmDialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'success' | 'info'
}

let confirmResolver: ((val: boolean) => void) | null = null

function encodeCredential(password: string): string {
  if (typeof btoa === 'function') {
    return `cred_v1:${btoa(unescape(encodeURIComponent(password)))}`
  }
  return `cred_v1:${Buffer.from(password, 'utf8').toString('base64')}`
}

function verifyCredential(password: string, stored?: string | null): boolean {
  if (!stored) return false
  return stored === encodeCredential(password) || stored === password
}

function nowIso(): string {
  return new Date().toISOString()
}

export function slugifyInstansi(text: string): string {
  return (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function sanitizeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() || 'file'
  return base.replace(/[ #&{}<>*?/\\$!'"`:@+|=\s]/g, '-')
}

function formatStorageFileName(originalName: string): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  const rand = Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10)
  return `${stamp}_${rand}_${sanitizeFileName(originalName)}`
}

export function computeBadgeStyle(_hex?: string | null): {
  backgroundColor: string
  color: string
  borderColor: string
  borderWidth: string
  borderStyle: string
} {
  return {
    backgroundColor: '#f8fafc',
    color: '#334155',
    borderColor: '#e2e8f0',
    borderWidth: '1px',
    borderStyle: 'solid'
  }
}

export function getDocType(arsip: Partial<ArsipRecord>): string {
  const name = arsip.original_file_name || arsip.file_path || ''
  const parts = name.split('.')
  if (parts.length < 2) return 'FILE'
  return (parts.pop() || 'FILE').toUpperCase()
}

export function getDocTypeBadgeClass(ext: string): string {
  switch (ext.toUpperCase()) {
    case 'PDF':
      return 'bg-red-100 text-red-700 ring-red-600/20'
    case 'DOC':
    case 'DOCX':
      return 'bg-blue-100 text-blue-700 ring-blue-600/20'
    case 'XLS':
    case 'XLSX':
      return 'bg-emerald-100 text-emerald-700 ring-emerald-600/20'
    case 'PPT':
    case 'PPTX':
      return 'bg-amber-100 text-amber-700 ring-amber-600/20'
    case 'JPG':
    case 'JPEG':
    case 'PNG':
    case 'GIF':
    case 'WEBP':
    case 'TIFF':
    case 'SVG':
      return 'bg-sky-100 text-sky-700 ring-sky-600/20'
    case 'ZIP':
    case 'RAR':
    case '7Z':
      return 'bg-purple-100 text-purple-700 ring-purple-600/20'
    default:
      return 'bg-gray-100 text-gray-700 ring-gray-600/20'
  }
}

// 4 Roles: superadmin, admin, writer, viewer
export const SYSTEM_ROLES = ['superadmin', 'admin', 'writer', 'viewer'] as const
export type AppRole = (typeof SYSTEM_ROLES)[number]
export const INSTANSI_ROLES = ['admin', 'writer', 'viewer'] as const
export type InstansiRole = (typeof INSTANSI_ROLES)[number]

export const ALL_PERMISSIONS: string[] = [
  'view_any_arsip',
  'view_arsip',
  'create_arsip',
  'update_arsip',
  'delete_arsip',
  'restore_arsip',
  'force_delete_arsip',
  'view_any_kategori',
  'create_kategori',
  'update_kategori',
  'delete_kategori',
  'view_any_subjek',
  'create_subjek',
  'update_subjek',
  'delete_subjek',
  'view_any_user',
  'create_user',
  'update_user',
  'delete_user',
  'view_any_role',
  'create_role',
  'update_role',
  'delete_role',
  'view_audit_trail',
  'manage_settings',
  'manage_instansi',
  'manage_instansi_admin'
]

export const ADMIN_INSTANSI_PERMISSIONS: string[] = [
  'view_any_arsip',
  'view_arsip',
  'create_arsip',
  'update_arsip',
  'delete_arsip',
  'restore_arsip',
  'force_delete_arsip',
  'view_any_kategori',
  'create_kategori',
  'update_kategori',
  'delete_kategori',
  'view_any_subjek',
  'create_subjek',
  'update_subjek',
  'delete_subjek',
  'view_any_user',
  'create_user',
  'update_user',
  'delete_user',
  'view_any_role',
  'update_role',
  'view_audit_trail',
  'manage_settings'
]

export const WRITER_ALLOWED_PERMISSIONS: string[] = [
  'view_any_arsip',
  'view_arsip',
  'create_arsip',
  'update_arsip',
  'delete_arsip',
  'restore_arsip',
  'force_delete_arsip',
  'view_any_kategori',
  'create_kategori',
  'update_kategori',
  'delete_kategori',
  'view_any_subjek',
  'create_subjek',
  'update_subjek',
  'delete_subjek',
  'view_audit_trail'
]

export const VIEWER_ALLOWED_PERMISSIONS: string[] = [
  'view_any_arsip',
  'view_arsip',
  'view_any_kategori',
  'view_any_subjek'
]

export const DEFAULT_ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  superadmin: ['manage_instansi', 'manage_instansi_admin', 'view_audit_trail'],
  admin: [...ADMIN_INSTANSI_PERMISSIONS],
  writer: [
    'view_any_arsip',
    'view_arsip',
    'create_arsip',
    'update_arsip',
    'delete_arsip',
    'restore_arsip',
    'force_delete_arsip',
    'view_any_kategori',
    'create_kategori',
    'update_kategori',
    'delete_kategori',
    'view_any_subjek',
    'create_subjek',
    'update_subjek',
    'delete_subjek'
  ],
  viewer: [...VIEWER_ALLOWED_PERMISSIONS]
}

export function normalizeRole(role?: string | null): AppRole {
  const clean = (role || '').trim().toLowerCase()
  if (clean === 'superadmin' || clean === 'super_admin') {
    return 'superadmin'
  }
  if (clean === 'admin' || clean === 'admin_instansi') {
    return 'admin'
  }
  if (clean === 'writer' || clean === 'operator') {
    return 'writer'
  }
  return 'viewer'
}

export function formatRoleLabel(role?: string | null): string {
  const normalized = normalizeRole(role)
  if (normalized === 'superadmin') return 'Super Admin'
  if (normalized === 'admin') return 'Admin Instansi'
  if (normalized === 'writer') return 'Writer'
  return 'Viewer'
}

export function extractScopeIds(
  perms: string[],
  prefix: 'scope_view_kategori:' | 'scope_edit_kategori:'
): number[] {
  const ids = new Set<number>()
  for (const p of perms) {
    if (typeof p === 'string' && p.startsWith(prefix)) {
      const id = Number(p.slice(prefix.length))
      if (Number.isFinite(id) && id > 0) {
        ids.add(id)
      }
    }
  }
  return Array.from(ids)
}

export function extractBasePermissions(perms: string[]): string[] {
  return (perms || []).filter((p) => !p.startsWith('scope_view_kategori:') && !p.startsWith('scope_edit_kategori:'))
}

export function sanitizePermissionsForRole(role: AppRole, perms: string[]): string[] {
  if (role === 'superadmin') {
    return [...DEFAULT_ROLE_PERMISSIONS.superadmin]
  }
  if (role === 'admin') {
    return [...ADMIN_INSTANSI_PERMISSIONS]
  }
  const viewScopes = extractScopeIds(perms, 'scope_view_kategori:').map((id) => `scope_view_kategori:${id}`)
  if (role === 'viewer') {
    const base = Array.from(new Set(perms.filter((p) => VIEWER_ALLOWED_PERMISSIONS.includes(p))))
    return [...base, ...viewScopes]
  }
  const base = Array.from(new Set(perms.filter((p) => WRITER_ALLOWED_PERMISSIONS.includes(p))))
  const editScopes = extractScopeIds(perms, 'scope_edit_kategori:').map((id) => `scope_edit_kategori:${id}`)
  return [...base, ...viewScopes, ...editScopes]
}

export function buildPermissionsWithScopes(
  basePerms: string[],
  viewKategoriIds: number[],
  editKategoriIds: number[]
): string[] {
  const cleanBase = extractBasePermissions(basePerms)
  const viewTokens = Array.from(new Set(viewKategoriIds.filter((id) => Number.isFinite(id) && id > 0))).map(
    (id) => `scope_view_kategori:${id}`
  )
  const editTokens = Array.from(new Set(editKategoriIds.filter((id) => Number.isFinite(id) && id > 0))).map(
    (id) => `scope_edit_kategori:${id}`
  )
  return [...cleanBase, ...viewTokens, ...editTokens]
}

export function useArsipApp() {
  const supabase = useSupabaseClient()
  const isSupabase = computed(() => Boolean(supabase))

  const initialized = useState<boolean>('arsip_multi_initialized', () => false)
  const loading = useState<boolean>('arsip_multi_loading', () => false)
  const currentUser = useState<ProfileRecord | null>('arsip_multi_current_user', () => null)

  // Raw database state (all tenants)
  const instansis = useState<InstansiRecord[]>('arsip_multi_instansis', () => [])
  const hasInstansiTable = useState<boolean>('arsip_multi_has_instansi_table', () => true)
  const rawRoles = useState<RoleRecord[]>('arsip_multi_raw_roles', () => [])
  const userAclMap = useState<Record<string, string[]>>('arsip_multi_user_acl', () => ({}))
  const userCredMap = useState<Record<string, string>>('arsip_multi_user_cred', () => ({}))
  const entityTenantMap = useState<Record<string, number>>('arsip_multi_entity_tenant', () => ({}))
  const instansiRoleAclMap = useState<Record<string, string[]>>('arsip_multi_instansi_role_acl', () => ({}))

  const allUsers = useState<ProfileRecord[]>('arsip_multi_all_users', () => [])
  const allKategoris = useState<KategoriRecord[]>('arsip_multi_all_kategoris', () => [])
  const allSubjeks = useState<SubjekRecord[]>('arsip_multi_all_subjeks', () => [])
  const allArsips = useState<ArsipRecord[]>('arsip_multi_all_arsips', () => [])
  const versions = useState<ArsipVersionRecord[]>('arsip_multi_versions', () => [])
  const allActivityLogs = useState<ActivityLogRecord[]>('arsip_multi_all_activity_logs', () => [])

  const platformSettings = useState<SettingRecord>('arsip_multi_platform_settings', () => ({
    id: 1,
    name: 'Portal Digital Arsip Multi-Instansi',
    slogan: 'Platform Pengelolaan Arsip Digital Terpadu untuk Sekolah & Instansi',
    logo: null,
    created_at: nowIso(),
    updated_at: nowIso()
  }))

  const confirmModalState = useState<ConfirmDialogOptions & { open: boolean }>('arsip_multi_confirm_modal', () => ({
    open: false,
    title: '',
    message: '',
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batal',
    variant: 'danger'
  }))

  function confirmDialog(options: ConfirmDialogOptions): Promise<boolean> {
    if (confirmResolver) {
      confirmResolver(false)
      confirmResolver = null
    }
    confirmModalState.value = {
      open: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText ?? 'Ya, Lanjutkan',
      cancelText: options.cancelText ?? 'Batal',
      variant: options.variant ?? 'danger'
    }
    return new Promise<boolean>((resolve) => {
      confirmResolver = resolve
    })
  }

  function resolveConfirmDialog(result: boolean) {
    confirmModalState.value = { ...confirmModalState.value, open: false }
    if (confirmResolver) {
      const fn = confirmResolver
      confirmResolver = null
      fn(result)
    }
  }

  const actionLoadingCount = useState<number>('arsip_multi_action_loading_count', () => 0)
  const actionLoadingText = useState<string>('arsip_multi_action_loading_text', () => 'Memproses...')
  const actionLoading = computed(() => actionLoadingCount.value > 0)

  async function withActionLoading<T>(label: string, fn: () => Promise<T>): Promise<T> {
    actionLoadingText.value = label
    actionLoadingCount.value += 1
    const startedAt = Date.now()
    try {
      return await fn()
    } finally {
      const elapsed = Date.now() - startedAt
      if (elapsed < 220 && typeof window !== 'undefined') {
        await new Promise((resolve) => setTimeout(resolve, 220 - elapsed))
      }
      actionLoadingCount.value = Math.max(0, actionLoadingCount.value - 1)
    }
  }

  function requireSupabase() {
    if (!supabase) {
      throw new Error('Konfigurasi Supabase belum diatur. Periksa NUXT_PUBLIC_SUPABASE_URL dan NUXT_PUBLIC_SUPABASE_ANON_KEY pada file .env.')
    }
    return supabase
  }

  // Resolve tenant id for any entity (supports both native instansi_id column and fallback entityTenantMap)
  function resolveEntityInstansiId(
    type: 'user' | 'kategori' | 'subjek' | 'arsip' | 'log',
    record: { id: string | number; instansi_id?: number | null }
  ): number | null {
    if (record.instansi_id !== undefined && record.instansi_id !== null) {
      return Number(record.instansi_id)
    }
    const key = `${type}:${record.id}`
    const mapped = entityTenantMap.value[key]
    return typeof mapped === 'number' && Number.isFinite(mapped) ? mapped : null
  }

  async function saveEntityTenantBinding(
    type: 'user' | 'kategori' | 'subjek' | 'arsip' | 'log',
    id: string | number,
    instansiId: number | null
  ) {
    const sb = requireSupabase()
    const key = `${type}:${id}`
    const roleKey = `tenant_bind:${key}`
    if (!instansiId) {
      await sb.from('roles').delete().eq('name', roleKey)
      const next = { ...entityTenantMap.value }
      delete next[key]
      entityTenantMap.value = next
      return
    }
    await sb
      .from('roles')
      .upsert({ name: roleKey, permissions: [String(instansiId)] }, { onConflict: 'name' })
    entityTenantMap.value = { ...entityTenantMap.value, [key]: instansiId }
  }

  // Current user's role & tenant
  const userRole = computed<AppRole>(() => normalizeRole(currentUser.value?.role))
  const isSuperAdmin = computed(() => userRole.value === 'superadmin')
  const isAdminInstansi = computed(() => userRole.value === 'admin')
  const isWriter = computed(() => userRole.value === 'writer')
  const isViewer = computed(() => userRole.value === 'viewer')

  const currentInstansiId = computed<number | null>(() => {
    if (!currentUser.value || isSuperAdmin.value) return null
    return resolveEntityInstansiId('user', currentUser.value)
  })

  const currentInstansi = computed<InstansiRecord | null>(() => {
    if (!currentInstansiId.value) return null
    return instansis.value.find((i) => i.id === currentInstansiId.value) || null
  })

  function getInstansiById(id?: number | null): InstansiRecord | undefined {
    if (!id) return undefined
    return instansis.value.find((i) => i.id === Number(id))
  }

  function getInstansiBySlug(slug?: string | null): InstansiRecord | undefined {
    const clean = (slug || '').trim().toLowerCase()
    if (!clean) return undefined
    return instansis.value.find((i) => i.slug.toLowerCase() === clean)
  }

  // Tenant-scoped collections for Admin Instansi, Writer, and Viewer
  const kategoris = computed<KategoriRecord[]>(() => {
    if (isSuperAdmin.value) return allKategoris.value
    const tid = currentInstansiId.value
    if (!tid) return []
    return allKategoris.value.filter((k) => resolveEntityInstansiId('kategori', k) === tid)
  })

  const subjeks = computed<SubjekRecord[]>(() => {
    if (isSuperAdmin.value) return allSubjeks.value
    const tid = currentInstansiId.value
    if (!tid) return []
    return allSubjeks.value.filter((s) => resolveEntityInstansiId('subjek', s) === tid)
  })

  const arsips = computed<ArsipRecord[]>(() => {
    if (isSuperAdmin.value) return allArsips.value
    const tid = currentInstansiId.value
    if (!tid) return []
    return allArsips.value.filter((a) => resolveEntityInstansiId('arsip', a) === tid)
  })

  // For Admin Instansi: only users in their instansi (writer & viewer, plus themselves)
  const users = computed<ProfileRecord[]>(() => {
    if (isSuperAdmin.value) return allUsers.value
    const tid = currentInstansiId.value
    if (!tid) return []
    return allUsers.value.filter(
      (u) => normalizeRole(u.role) !== 'superadmin' && resolveEntityInstansiId('user', u) === tid
    )
  })

  // For Superadmin: list of all Admin Instansi accounts
  const instansiAdmins = computed<ProfileRecord[]>(() => {
    return allUsers.value.filter((u) => normalizeRole(u.role) === 'admin')
  })

  const activityLogs = computed<ActivityLogRecord[]>(() => {
    if (isSuperAdmin.value) return allActivityLogs.value
    const tid = currentInstansiId.value
    if (!tid) return []
    return allActivityLogs.value.filter((l) => resolveEntityInstansiId('log', l) === tid)
  })

  // Roles scoped to current instansi (Admin Instansi sees admin, writer, viewer for their instansi)
  const roles = computed<RoleRecord[]>(() => {
    const tid = currentInstansiId.value
    const roleList: InstansiRole[] = ['admin', 'writer', 'viewer']
    return roleList.map((roleName, idx) => {
      if (roleName === 'admin') {
        return {
          id: idx + 1,
          name: 'admin',
          permissions: [...ADMIN_INSTANSI_PERMISSIONS],
          created_at: nowIso()
        }
      }
      const tenantKey = tid ? `${tid}:${roleName}` : ''
      const customTenantPerms = tenantKey ? instansiRoleAclMap.value[tenantKey] : undefined
      const globalRole = rawRoles.value.find((r) => r.name === roleName)
      const rawPerms = customTenantPerms || globalRole?.permissions || DEFAULT_ROLE_PERMISSIONS[roleName]
      return {
        id: idx + 1,
        name: roleName,
        permissions: sanitizePermissionsForRole(roleName, rawPerms),
        created_at: globalRole?.created_at || nowIso()
      }
    })
  })

  // Settings computed: for instansi user, reflects their currentInstansi; for superadmin, reflects platformSettings
  const settings = computed<SettingRecord>(() => {
    if (currentInstansi.value) {
      return {
        id: currentInstansi.value.id,
        name: currentInstansi.value.nama,
        slogan: currentInstansi.value.slogan,
        logo: currentInstansi.value.logo,
        hero_title: currentInstansi.value.hero_title,
        hero_subtitle: currentInstansi.value.hero_subtitle,
        hero_image: currentInstansi.value.hero_image,
        created_at: currentInstansi.value.created_at,
        updated_at: currentInstansi.value.updated_at
      }
    }
    return platformSettings.value
  })

  const heroConfig = computed<HeroConfig>(() => {
    if (currentInstansi.value) {
      return {
        title: currentInstansi.value.hero_title || DEFAULT_HERO_CONFIG.title,
        subtitle: currentInstansi.value.hero_subtitle || currentInstansi.value.slogan || '',
        image: currentInstansi.value.hero_image || null
      }
    }
    return {
      title: platformSettings.value.hero_title || DEFAULT_HERO_CONFIG.title,
      subtitle: platformSettings.value.hero_subtitle || platformSettings.value.slogan || '',
      image: platformSettings.value.hero_image || null
    }
  })

  async function addActivityLog(entry: Omit<ActivityLogRecord, 'id' | 'created_at'>) {
    const sb = requireSupabase()
    const instansiId = entry.instansi_id !== undefined ? entry.instansi_id : currentInstansiId.value
    const payloadWithTenant: Record<string, any> = {
      instansi_id: instansiId,
      log_name: entry.log_name,
      description: entry.description,
      subject_type: entry.subject_type,
      subject_id: entry.subject_id,
      causer_id: entry.causer_id,
      causer_name: entry.causer_name,
      properties: entry.properties
    }
    let { data, error } = await sb.from('activity_logs').insert(payloadWithTenant).select().single()
    if (error && /instansi_id|column|schema cache/i.test(error.message || '')) {
      const { instansi_id: _omit, ...fallbackPayload } = payloadWithTenant
      const retry = await sb.from('activity_logs').insert(fallbackPayload).select().single()
      data = retry.data
      error = retry.error
      if (!error && data && instansiId) {
        await saveEntityTenantBinding('log', data.id, instansiId)
      }
    }
    if (!error && data) {
      const rec: ActivityLogRecord = {
        ...(data as ActivityLogRecord),
        instansi_id: instansiId
      }
      allActivityLogs.value.unshift(rec)
    }
  }

  async function persistInstansiMetaFallback(record: InstansiRecord) {
    const sb = requireSupabase()
    await sb
      .from('roles')
      .upsert(
        {
          name: `instansi_meta:${record.id}`,
          permissions: [JSON.stringify(record)]
        },
        { onConflict: 'name' }
      )
  }

  async function loadPublicSettings() {
    if (!supabase) return null
    try {
      const [setRes, instRes, rolesRes] = await Promise.all([
        supabase.from('settings').select('*').limit(1).maybeSingle(),
        supabase.from('instansis').select('*').order('id', { ascending: true }),
        supabase.from('roles').select('*').like('name', 'instansi_meta:%')
      ])
      if (setRes.data) {
        platformSettings.value = setRes.data as SettingRecord
      }
      if (!instRes.error && Array.isArray(instRes.data)) {
        hasInstansiTable.value = true
        instansis.value = instRes.data as InstansiRecord[]
      } else if (rolesRes.data) {
        hasInstansiTable.value = false
        const parsedList: InstansiRecord[] = []
        for (const r of rolesRes.data) {
          if (Array.isArray(r.permissions) && typeof r.permissions[0] === 'string') {
            try {
              parsedList.push(JSON.parse(r.permissions[0]) as InstansiRecord)
            } catch {
              // ignore
            }
          }
        }
        instansis.value = parsedList.sort((a, b) => a.id - b.id)
      }
      return settings.value
    } catch {
      return null
    }
  }

  async function ensureSuperadminSeeded() {
    const sb = requireSupabase()
    const hasSA = allUsers.value.some((u) => normalizeRole(u.role) === 'superadmin')
    if (hasSA) return

    const saEmail = 'superadmin@digitalarsip.id'
    const { data: existing } = await sb.from('profiles').select('*').ilike('email', saEmail).maybeSingle()
    if (existing) {
      if (normalizeRole(existing.role) !== 'superadmin') {
        await sb.from('profiles').update({ role: 'superadmin' }).eq('id', existing.id)
      }
      return
    }
    const { data: created } = await sb
      .from('profiles')
      .insert({
        name: 'Super Administrator',
        email: saEmail,
        role: 'superadmin'
      })
      .select()
      .single()
    if (created) {
      const profile = { ...(created as ProfileRecord), role: 'superadmin' }
      allUsers.value.unshift(profile)
      await saveUserCredential(profile.id, 'password')
    }
  }

  async function init(force = false) {
    if (initialized.value && !force) return
    if (typeof window === 'undefined') return
    const sb = requireSupabase()

    loading.value = true
    try {
      const [instRes, kRes, sRes, aRes, vRes, lRes, uRes, rRes, setRes] = await Promise.all([
        sb.from('instansis').select('*').order('id', { ascending: true }),
        sb.from('kategoris').select('*').order('id', { ascending: true }),
        sb.from('subjeks').select('*').order('id', { ascending: true }),
        sb.from('arsips').select('*').order('created_at', { ascending: false }),
        sb.from('arsip_versions').select('*').order('version', { ascending: false }),
        sb.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(300),
        sb.from('profiles').select('*').order('created_at', { ascending: false }),
        sb.from('roles').select('*').order('id', { ascending: true }),
        sb.from('settings').select('*').limit(1).maybeSingle()
      ])

      const fetchedRoles = (rRes.data || []) as RoleRecord[]
      rawRoles.value = fetchedRoles

      const nextAclMap: Record<string, string[]> = {}
      const nextCredMap: Record<string, string> = {}
      const nextTenantBindMap: Record<string, number> = {}
      const nextInstansiRoleAcl: Record<string, string[]> = {}
      const fallbackInstansis: InstansiRecord[] = []

      for (const r of fetchedRoles) {
        if (r.name.startsWith('user_cred:')) {
          const uid = r.name.slice('user_cred:'.length)
          if (uid && Array.isArray(r.permissions) && typeof r.permissions[0] === 'string') {
            nextCredMap[uid] = r.permissions[0]
          }
          continue
        }
        if (r.name.startsWith('user_acl:')) {
          const uid = r.name.slice('user_acl:'.length)
          if (uid) {
            nextAclMap[uid] = Array.isArray(r.permissions) ? r.permissions : []
          }
          continue
        }
        if (r.name.startsWith('tenant_bind:')) {
          const entityKey = r.name.slice('tenant_bind:'.length)
          const tid = Number(Array.isArray(r.permissions) ? r.permissions[0] : 0)
          if (entityKey && Number.isFinite(tid) && tid > 0) {
            nextTenantBindMap[entityKey] = tid
          }
          continue
        }
        if (r.name.startsWith('role_acl:')) {
          // role_acl:<instansi_id>:<role>
          const rest = r.name.slice('role_acl:'.length)
          if (rest) {
            nextInstansiRoleAcl[rest] = Array.isArray(r.permissions) ? r.permissions : []
          }
          continue
        }
        if (r.name.startsWith('instansi_meta:')) {
          if (Array.isArray(r.permissions) && typeof r.permissions[0] === 'string') {
            try {
              fallbackInstansis.push(JSON.parse(r.permissions[0]) as InstansiRecord)
            } catch {
              // ignore
            }
          }
          continue
        }
      }

      userCredMap.value = nextCredMap
      userAclMap.value = nextAclMap
      entityTenantMap.value = nextTenantBindMap
      instansiRoleAclMap.value = nextInstansiRoleAcl

      if (!instRes.error && Array.isArray(instRes.data)) {
        hasInstansiTable.value = true
        instansis.value = instRes.data as InstansiRecord[]
      } else {
        hasInstansiTable.value = false
        instansis.value = fallbackInstansis.sort((a, b) => a.id - b.id)
      }

      allKategoris.value = ((kRes.data || []) as KategoriRecord[]).map((k) => ({
        ...k,
        instansi_id: k.instansi_id ?? nextTenantBindMap[`kategori:${k.id}`] ?? null
      }))
      allSubjeks.value = ((sRes.data || []) as SubjekRecord[]).map((s) => ({
        ...s,
        instansi_id: s.instansi_id ?? nextTenantBindMap[`subjek:${s.id}`] ?? null
      }))
      allArsips.value = ((aRes.data || []) as ArsipRecord[]).map((a) => ({
        ...a,
        instansi_id: a.instansi_id ?? nextTenantBindMap[`arsip:${a.id}`] ?? null
      }))
      versions.value = (vRes.data || []) as ArsipVersionRecord[]
      allActivityLogs.value = ((lRes.data || []) as ActivityLogRecord[]).map((l) => ({
        ...l,
        instansi_id: l.instansi_id ?? nextTenantBindMap[`log:${l.id}`] ?? null
      }))
      allUsers.value = ((uRes.data || []) as ProfileRecord[]).map((u) => ({
        ...u,
        role: normalizeRole(u.role),
        instansi_id: u.instansi_id ?? nextTenantBindMap[`user:${u.id}`] ?? null
      }))

      if (setRes.data) {
        platformSettings.value = setRes.data as SettingRecord
      }

      await ensureSuperadminSeeded()

      // Restore session
      const { data: sessionData } = await sb.auth.getSession()
      const authUser = sessionData.session?.user || null

      let resolvedUser: ProfileRecord | null = null
      const savedPending = localStorage.getItem(PENDING_USER_STORAGE_KEY)
      if (savedPending) {
        try {
          const parsed = JSON.parse(savedPending) as ProfileRecord
          const liveMatch = allUsers.value.find(
            (u) => u.id === parsed.id || u.email.toLowerCase() === (parsed.email || '').toLowerCase()
          )
          if (liveMatch) {
            resolvedUser = liveMatch
          }
        } catch {
          // ignore
        }
      }

      if (!resolvedUser && authUser) {
        const liveMatch = allUsers.value.find(
          (u) =>
            u.id === authUser.id ||
            (authUser.email && u.email.toLowerCase() === authUser.email.trim().toLowerCase())
        )
        if (liveMatch) {
          resolvedUser = liveMatch
        }
      }

      if (resolvedUser) {
        currentUser.value = resolvedUser
        localStorage.setItem(PENDING_USER_STORAGE_KEY, JSON.stringify(resolvedUser))
      } else {
        currentUser.value = null
        localStorage.removeItem(PENDING_USER_STORAGE_KEY)
      }

      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  // Auth helpers
  async function saveUserCredential(userId: string, rawPassword: string) {
    if (!userId || !rawPassword) return
    const sb = requireSupabase()
    const encoded = encodeCredential(rawPassword)
    const credName = `user_cred:${userId}`
    await sb.from('roles').upsert({ name: credName, permissions: [encoded] }, { onConflict: 'name' })
    userCredMap.value = { ...userCredMap.value, [userId]: encoded }
  }

  async function findProfileByEmail(email: string): Promise<ProfileRecord | null> {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) return null
    const localMatch = allUsers.value.find((u) => u.email.toLowerCase() === cleanEmail)
    if (localMatch) return localMatch

    const sb = requireSupabase()
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .ilike('email', cleanEmail)
      .maybeSingle()
    if (error || !data) return null
    const rec = data as ProfileRecord
    return {
      ...rec,
      role: normalizeRole(rec.role),
      instansi_id: rec.instansi_id ?? entityTenantMap.value[`user:${rec.id}`] ?? null
    }
  }

  async function verifyUserPassword(profile: ProfileRecord, password: string): Promise<boolean> {
    const sb = requireSupabase()
    let storedCred = userCredMap.value[profile.id]
    if (!storedCred) {
      const { data: credRow } = await sb
        .from('roles')
        .select('permissions')
        .eq('name', `user_cred:${profile.id}`)
        .maybeSingle()
      if (credRow && Array.isArray(credRow.permissions) && typeof credRow.permissions[0] === 'string') {
        storedCred = credRow.permissions[0]
      }
    }

    if (storedCred) {
      return verifyCredential(password, storedCred)
    }

    // Fallback check against Supabase Auth if no stored credential entry yet
    const { data, error } = await sb.auth.signInWithPassword({
      email: profile.email.trim().toLowerCase(),
      password
    })
    if (!error && data.user) {
      await saveUserCredential(profile.id, password)
      return true
    }

    // First-time default password fallback for seeded accounts without user_cred
    if (password === 'password') {
      await saveUserCredential(profile.id, password)
      return true
    }

    return false
  }

  // Login khusus Superadmin (/superadmin-login)
  async function loginSuperAdmin(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    return withActionLoading('Memverifikasi akun Super Admin...', async () => {
      await init()
      const cleanEmail = email.trim().toLowerCase()
      const profile = await findProfileByEmail(cleanEmail)
      if (!profile) {
        return {
          ok: false,
          error: 'Akun tidak ditemukan. Halaman ini khusus untuk Super Admin.'
        }
      }
      if (normalizeRole(profile.role) !== 'superadmin') {
        return {
          ok: false,
          error: 'Akses ditolak: Akun ini bukan Super Admin. Silakan masuk melalui halaman Login Instansi.'
        }
      }

      const valid = await verifyUserPassword(profile, password)
      if (!valid) {
        return { ok: false, error: 'Email atau password Super Admin salah.' }
      }

      const normalizedProfile: ProfileRecord = {
        ...profile,
        role: 'superadmin',
        instansi_id: null
      }
      currentUser.value = normalizedProfile
      if (typeof window !== 'undefined') {
        localStorage.setItem(PENDING_USER_STORAGE_KEY, JSON.stringify(normalizedProfile))
      }
      await init(true)
      return { ok: true }
    })
  }

  // Login khusus Instansi (/login atau /:slug/login)
  async function loginInstansi(
    email: string,
    password: string,
    expectedSlug?: string
  ): Promise<{ ok: boolean; error?: string }> {
    return withActionLoading('Memverifikasi akun instansi...', async () => {
      await init()
      const cleanEmail = email.trim().toLowerCase()
      const profile = await findProfileByEmail(cleanEmail)
      if (!profile) {
        return {
          ok: false,
          error: `Akses ditolak: Email (${cleanEmail}) belum terdaftar pada instansi mana pun.`
        }
      }

      if (normalizeRole(profile.role) === 'superadmin') {
        return {
          ok: false,
          error: 'Akun Super Admin harus masuk melalui halaman /superadmin-login.'
        }
      }

      const userInstansiId = resolveEntityInstansiId('user', profile)
      const userInstansi = getInstansiById(userInstansiId)
      if (!userInstansiId || !userInstansi) {
        return {
          ok: false,
          error: 'Akun Anda belum terhubung ke instansi aktif. Hubungi Super Admin.'
        }
      }

      if (expectedSlug) {
        const targetInstansi = getInstansiBySlug(expectedSlug)
        if (!targetInstansi) {
          return {
            ok: false,
            error: 'Instansi tidak ditemukan.'
          }
        }
        if (targetInstansi.id !== userInstansi.id) {
          return {
            ok: false,
            error: `Akses ditolak: Akun Anda terdaftar di "${userInstansi.nama}", bukan di "${targetInstansi.nama}".`
          }
        }
      }

      const valid = await verifyUserPassword(profile, password)
      if (!valid) {
        return { ok: false, error: 'Email atau password yang Anda masukkan salah.' }
      }

      const normalizedProfile: ProfileRecord = {
        ...profile,
        role: normalizeRole(profile.role),
        instansi_id: userInstansi.id
      }
      currentUser.value = normalizedProfile
      if (typeof window !== 'undefined') {
        localStorage.setItem(PENDING_USER_STORAGE_KEY, JSON.stringify(normalizedProfile))
      }
      await init(true)
      return { ok: true }
    })
  }

  async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    return loginInstansi(email, password)
  }

  async function logout(): Promise<{ wasSuperAdmin: boolean; instansiSlug: string | null }> {
    const wasSA = isSuperAdmin.value
    const slug = currentInstansi.value?.slug || null
    await withActionLoading('Keluar dari sesi...', async () => {
      const sb = requireSupabase()
      await sb.auth.signOut()
      if (typeof window !== 'undefined') {
        localStorage.removeItem(PENDING_USER_STORAGE_KEY)
      }
      currentUser.value = null
    })
    return { wasSuperAdmin: wasSA, instansiSlug: slug }
  }

  async function updateProfile(payload: { name: string; email: string }) {
    if (!currentUser.value) return
    return withActionLoading('Menyimpan profil...', async () => {
      if (!currentUser.value) return
      const sb = requireSupabase()
      const oldData = { name: currentUser.value.name, email: currentUser.value.email }
      const { error } = await sb
        .from('profiles')
        .update({ name: payload.name, email: payload.email.trim().toLowerCase() })
        .eq('id', currentUser.value.id)
      if (error) throw error

      const updated: ProfileRecord = {
        ...currentUser.value,
        name: payload.name,
        email: payload.email.trim().toLowerCase(),
        updated_at: nowIso()
      }
      currentUser.value = updated
      const idx = allUsers.value.findIndex((u) => u.id === updated.id)
      if (idx !== -1) allUsers.value[idx] = updated
      if (typeof window !== 'undefined') {
        localStorage.setItem(PENDING_USER_STORAGE_KEY, JSON.stringify(updated))
      }

      await addActivityLog({
        instansi_id: currentInstansiId.value,
        log_name: 'user',
        description: 'updated',
        subject_type: 'User',
        subject_id: currentUser.value.id,
        causer_id: currentUser.value.id,
        causer_name: currentUser.value.name,
        properties: { old: oldData, attributes: payload }
      })
    })
  }

  async function updatePassword(newPassword: string): Promise<{ ok: boolean; error?: string }> {
    if (!currentUser.value) return { ok: false, error: 'Tidak ada sesi pengguna.' }
    return withActionLoading('Memperbarui password...', async () => {
      if (!currentUser.value) return { ok: false, error: 'Tidak ada sesi pengguna.' }
      try {
        await saveUserCredential(currentUser.value.id, newPassword)
        return { ok: true }
      } catch (err: any) {
        return { ok: false, error: err?.message || 'Gagal memperbarui password.' }
      }
    })
  }

  // Storage helpers
  async function uploadFile(
    file: File | Blob,
    originalName: string,
    bucket: 'arsip' | 'settings' = 'arsip',
    folder = 'arsip'
  ): Promise<{ path: string; original_file_name: string; size: number }> {
    return withActionLoading('Mengunggah file...', async () => {
      const sb = requireSupabase()
      const storedName = formatStorageFileName(originalName)
      const tenantFolder = currentInstansiId.value ? `instansi-${currentInstansiId.value}` : 'global'
      const objectPath =
        bucket === 'settings' ? `${tenantFolder}_${storedName}` : `${folder}/${tenantFolder}/${storedName}`

      const { error } = await sb.storage.from(bucket).upload(objectPath, file, {
        upsert: true,
        contentType: file.type || undefined
      })
      if (error) {
        throw new Error(`Gagal upload ke Supabase Storage: ${error.message}`)
      }
      return {
        path: bucket === 'settings' ? `settings/${objectPath}` : objectPath,
        original_file_name: originalName,
        size: file.size
      }
    })
  }

  function getFileUrl(filePath?: string | null): string | null {
    if (!filePath) return null
    if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('data:')) {
      return filePath
    }
    if (!supabase) return null
    if (filePath.startsWith('settings/')) {
      const clean = filePath.replace(/^settings\//, '')
      return supabase.storage.from('settings').getPublicUrl(clean).data.publicUrl
    }
    return supabase.storage.from('arsip').getPublicUrl(filePath).data.publicUrl
  }

  function getInstansiLogoUrl(instansi?: InstansiRecord | null): string {
    if (instansi?.logo) {
      return getFileUrl(instansi.logo) || DEFAULT_PLACEHOLDER_LOGO
    }
    return DEFAULT_PLACEHOLDER_LOGO
  }

  function getInstansiHeroImageUrl(instansi?: InstansiRecord | null): string {
    if (instansi?.hero_image) {
      return getFileUrl(instansi.hero_image) || DEFAULT_HERO_IMAGE
    }
    return DEFAULT_HERO_IMAGE
  }

  function getFileSize(arsip: ArsipRecord): number {
    return typeof arsip.file_size === 'number' ? arsip.file_size : 0
  }

  async function deleteStoredFile(filePath?: string | null) {
    if (!filePath) return
    const sb = requireSupabase()
    if (filePath.startsWith('settings/')) {
      await sb.storage.from('settings').remove([filePath.replace(/^settings\//, '')])
    } else {
      await sb.storage.from('arsip').remove([filePath])
    }
  }

  // Permissions & RBAC
  const effectivePermissions = computed<string[]>(() => {
    if (!currentUser.value) return []
    if (userRole.value === 'superadmin') {
      return [...DEFAULT_ROLE_PERMISSIONS.superadmin]
    }
    if (userRole.value === 'admin') {
      return [...ADMIN_INSTANSI_PERMISSIONS]
    }
    const customAcl = userAclMap.value[currentUser.value.id]
    if (Array.isArray(customAcl)) {
      return sanitizePermissionsForRole(userRole.value, customAcl)
    }
    const roleRecord = roles.value.find((r) => r.name === userRole.value)
    const basePerms = roleRecord?.permissions || DEFAULT_ROLE_PERMISSIONS[userRole.value]
    return sanitizePermissionsForRole(userRole.value, basePerms)
  })

  function hasPermission(perm: string): boolean {
    if (!currentUser.value) return false
    if (isSuperAdmin.value) {
      return DEFAULT_ROLE_PERMISSIONS.superadmin.includes(perm)
    }
    if (isAdminInstansi.value) {
      return ADMIN_INSTANSI_PERMISSIONS.includes(perm)
    }
    return effectivePermissions.value.includes(perm)
  }

  const canCreateArsip = computed(() => isAdminInstansi.value || (isWriter.value && hasPermission('create_arsip')))
  const canUpdateArsip = computed(() => isAdminInstansi.value || (isWriter.value && hasPermission('update_arsip')))
  const canDeleteArsip = computed(() => isAdminInstansi.value || (isWriter.value && hasPermission('delete_arsip')))
  const canRestoreArsip = computed(() => isAdminInstansi.value || (isWriter.value && hasPermission('restore_arsip')))
  const canForceDeleteArsip = computed(() => isAdminInstansi.value || (isWriter.value && hasPermission('force_delete_arsip')))

  const canCreateKategori = computed(() => isAdminInstansi.value || (isWriter.value && hasPermission('create_kategori')))
  const canUpdateKategori = computed(() => isAdminInstansi.value || (isWriter.value && hasPermission('update_kategori')))
  const canDeleteKategori = computed(() => isAdminInstansi.value || (isWriter.value && hasPermission('delete_kategori')))
  const canManageKategori = computed(
    () => canCreateKategori.value || canUpdateKategori.value || canDeleteKategori.value
  )

  const canCreateSubjek = computed(() => isAdminInstansi.value || (isWriter.value && hasPermission('create_subjek')))
  const canUpdateSubjek = computed(() => isAdminInstansi.value || (isWriter.value && hasPermission('update_subjek')))
  const canDeleteSubjek = computed(() => isAdminInstansi.value || (isWriter.value && hasPermission('delete_subjek')))
  const canManageSubjek = computed(
    () => canCreateSubjek.value || canUpdateSubjek.value || canDeleteSubjek.value
  )

  const canWrite = computed(
    () =>
      isAdminInstansi.value ||
      (isWriter.value &&
        (canCreateArsip.value ||
          canUpdateArsip.value ||
          canDeleteArsip.value ||
          canRestoreArsip.value ||
          canForceDeleteArsip.value ||
          canManageKategori.value ||
          canManageSubjek.value))
  )

  const allowedViewKategoriIds = computed<number[]>(() =>
    isAdminInstansi.value || isSuperAdmin.value
      ? []
      : extractScopeIds(effectivePermissions.value, 'scope_view_kategori:')
  )
  const allowedEditKategoriIds = computed<number[]>(() =>
    isAdminInstansi.value || isSuperAdmin.value
      ? []
      : extractScopeIds(effectivePermissions.value, 'scope_edit_kategori:')
  )

  function canViewKategoriId(kategoriId?: number | null): boolean {
    if (isAdminInstansi.value || isSuperAdmin.value) return true
    const allowed = allowedViewKategoriIds.value
    if (allowed.length === 0) return true
    if (!kategoriId) return false
    return allowed.includes(kategoriId)
  }

  function canEditKategoriId(kategoriId?: number | null): boolean {
    if (isAdminInstansi.value) return true
    if (!isWriter.value) return false
    if (!canViewKategoriId(kategoriId)) return false
    const allowed = allowedEditKategoriIds.value
    if (allowed.length === 0) return true
    if (!kategoriId) return false
    return allowed.includes(kategoriId)
  }

  function canEditArsipRecord(arsip: Partial<ArsipRecord>): boolean {
    return canUpdateArsip.value && canEditKategoriId(arsip.kategori_id)
  }

  function canDeleteArsipRecord(arsip: Partial<ArsipRecord>): boolean {
    return canDeleteArsip.value && canEditKategoriId(arsip.kategori_id)
  }

  const visibleKategoris = computed(() => kategoris.value.filter((k) => canViewKategoriId(k.id)))
  const editableKategoris = computed(() => kategoris.value.filter((k) => canEditKategoriId(k.id)))

  function canAccessPath(path: string): boolean {
    if (!currentUser.value) return false

    // Superadmin dedicated routes
    if (path.startsWith('/dashboard/instansi') || path.startsWith('/dashboard/admin-instansi')) {
      return isSuperAdmin.value
    }

    if (isSuperAdmin.value) {
      // Superadmin focuses on Instansi, Admin Instansi, Dashboard, Audit Trails, Profile
      return (
        path === '/dashboard' ||
        path.startsWith('/dashboard/instansi') ||
        path.startsWith('/dashboard/admin-instansi') ||
        path.startsWith('/dashboard/audit-trails') ||
        path.startsWith('/dashboard/profile')
      )
    }

    // Instansi routes (admin, writer, viewer)
    if (
      path.startsWith('/dashboard/users') ||
      path.startsWith('/dashboard/roles') ||
      path.startsWith('/dashboard/settings')
    ) {
      return isAdminInstansi.value
    }
    if (path.startsWith('/dashboard/audit-trails')) {
      return isAdminInstansi.value || hasPermission('view_audit_trail')
    }
    if (path === '/dashboard/arsip/create' || path.startsWith('/dashboard/picture-to-pdf')) {
      return canCreateArsip.value
    }
    if (/^\/dashboard\/arsip\/[^/]+\/edit/.test(path)) {
      return canUpdateArsip.value
    }
    if (path.startsWith('/dashboard/trash')) {
      return canRestoreArsip.value || canForceDeleteArsip.value
    }
    if (path.startsWith('/dashboard/kategori')) {
      return hasPermission('view_any_kategori')
    }
    if (path.startsWith('/dashboard/subjek')) {
      return hasPermission('view_any_subjek')
    }
    return true
  }

  const activeArsips = computed(() => {
    if (isSuperAdmin.value) return allArsips.value.filter((a) => !a.deleted_at)
    if (!hasPermission('view_any_arsip')) return []
    return arsips.value.filter((a) => !a.deleted_at && canViewKategoriId(a.kategori_id))
  })
  const trashedArsips = computed(() => {
    if (isSuperAdmin.value) return allArsips.value.filter((a) => Boolean(a.deleted_at))
    if (!hasPermission('view_any_arsip')) return []
    return arsips.value.filter((a) => Boolean(a.deleted_at) && canViewKategoriId(a.kategori_id))
  })

  // ============================================================================
  // SUPERADMIN CRUD: Instansi & Admin Instansi
  // ============================================================================
  async function seedInstansiDefaults(instansiId: number) {
    const sb = requireSupabase()
    const existingKats = allKategoris.value.filter((k) => resolveEntityInstansiId('kategori', k) === instansiId)
    if (existingKats.length === 0) {
      for (const seed of DEFAULT_KATEGORI_SEEDS) {
        const payloadWithTenant: Record<string, any> = {
          instansi_id: instansiId,
          nama: seed.nama,
          color: seed.color,
          deskripsi: seed.deskripsi
        }
        let { data, error } = await sb.from('kategoris').insert(payloadWithTenant).select().single()
        if (error && /instansi_id|column|schema cache/i.test(error.message || '')) {
          const { instansi_id: _omit, ...fallback } = payloadWithTenant
          const retry = await sb.from('kategoris').insert(fallback).select().single()
          data = retry.data
          error = retry.error
          if (!error && data) {
            await saveEntityTenantBinding('kategori', data.id, instansiId)
          }
        }
        if (!error && data) {
          allKategoris.value.push({ ...(data as KategoriRecord), instansi_id: instansiId })
        }
      }
    }

    const existingSubs = allSubjeks.value.filter((s) => resolveEntityInstansiId('subjek', s) === instansiId)
    if (existingSubs.length === 0) {
      for (const seed of DEFAULT_SUBJEK_SEEDS) {
        const payloadWithTenant: Record<string, any> = {
          instansi_id: instansiId,
          nama: seed.nama,
          color: seed.color,
          deskripsi: seed.deskripsi
        }
        let { data, error } = await sb.from('subjeks').insert(payloadWithTenant).select().single()
        if (error && /instansi_id|column|schema cache/i.test(error.message || '')) {
          const { instansi_id: _omit, ...fallback } = payloadWithTenant
          const retry = await sb.from('subjeks').insert(fallback).select().single()
          data = retry.data
          error = retry.error
          if (!error && data) {
            await saveEntityTenantBinding('subjek', data.id, instansiId)
          }
        }
        if (!error && data) {
          allSubjeks.value.push({ ...(data as SubjekRecord), instansi_id: instansiId })
        }
      }
    }
  }

  function validateSlug(rawSlug: string, excludeId?: number | null): string {
    const clean = slugifyInstansi(rawSlug)
    if (!clean || clean.length < 2) {
      throw new Error('Slug URL instansi minimal 2 karakter (huruf/angka/strip).')
    }
    if (RESERVED_SLUGS.has(clean)) {
      throw new Error(`Slug "${clean}" tidak dapat digunakan karena merupakan rute sistem.`)
    }
    const clash = instansis.value.find(
      (i) => i.slug.toLowerCase() === clean && (!excludeId || i.id !== excludeId)
    )
    if (clash) {
      throw new Error(`Slug URL "/${clean}" sudah digunakan oleh instansi "${clash.nama}".`)
    }
    return clean
  }

  async function createInstansi(payload: {
    nama: string
    slug: string
    slogan?: string | null
    logo?: string | null
    hero_title?: string | null
    hero_subtitle?: string | null
    hero_image?: string | null
  }): Promise<InstansiRecord> {
    if (!isSuperAdmin.value) {
      throw new Error('Akses ditolak: Hanya Super Admin yang dapat menambahkan instansi.')
    }
    return withActionLoading('Membuat instansi & menyiapkan ruang kerja...', async () => {
      const sb = requireSupabase()
      const cleanSlug = validateSlug(payload.slug || payload.nama)
      const insertPayload = {
        nama: payload.nama.trim(),
        slug: cleanSlug,
        slogan: payload.slogan?.trim() || `Sistem Arsip Digital ${payload.nama.trim()}`,
        logo: payload.logo || null,
        hero_title:
          payload.hero_title?.trim() ||
          `Pusat Dokumentasi & Arsip Digital ${payload.nama.trim()}`,
        hero_subtitle:
          payload.hero_subtitle?.trim() ||
          payload.slogan?.trim() ||
          `Kelola, klasifikasikan, dan telusuri dokumen resmi ${payload.nama.trim()} secara aman dan terstruktur.`,
        hero_image: payload.hero_image || null
      }

      let created: InstansiRecord | null = null
      const { data, error } = await sb.from('instansis').insert(insertPayload).select().single()
      if (!error && data) {
        hasInstansiTable.value = true
        created = data as InstansiRecord
      } else {
        hasInstansiTable.value = false
        const nextId = instansis.value.reduce((max, item) => Math.max(max, item.id), 0) + 1
        created = {
          id: nextId,
          ...insertPayload,
          created_at: nowIso(),
          updated_at: nowIso()
        }
        await persistInstansiMetaFallback(created)
      }

      instansis.value.push(created)
      await seedInstansiDefaults(created.id)

      await addActivityLog({
        instansi_id: created.id,
        log_name: 'instansi',
        description: 'created',
        subject_type: 'Instansi',
        subject_id: String(created.id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'Super Admin',
        properties: { attributes: { nama: created.nama, slug: created.slug } }
      })

      return created
    })
  }

  async function updateInstansi(
    id: number,
    payload: {
      nama: string
      slug?: string
      slogan?: string | null
      logo?: string | null
      hero_title?: string | null
      hero_subtitle?: string | null
      hero_image?: string | null
    }
  ): Promise<InstansiRecord> {
    if (!isSuperAdmin.value && !(isAdminInstansi.value && currentInstansiId.value === id)) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin untuk mengubah instansi ini.')
    }
    return withActionLoading('Menyimpan data instansi...', async () => {
      const sb = requireSupabase()
      const idx = instansis.value.findIndex((i) => i.id === id)
      if (idx === -1) throw new Error('Instansi tidak ditemukan.')
      const current = instansis.value[idx]
      const cleanSlug = payload.slug !== undefined ? validateSlug(payload.slug, id) : current.slug

      const updateData = {
        nama: payload.nama.trim(),
        slug: cleanSlug,
        slogan: payload.slogan !== undefined ? payload.slogan : current.slogan,
        logo: payload.logo !== undefined ? payload.logo : current.logo,
        hero_title: payload.hero_title !== undefined ? payload.hero_title : current.hero_title,
        hero_subtitle: payload.hero_subtitle !== undefined ? payload.hero_subtitle : current.hero_subtitle,
        hero_image: payload.hero_image !== undefined ? payload.hero_image : current.hero_image
      }

      let updated: InstansiRecord = {
        ...current,
        ...updateData,
        updated_at: nowIso()
      }

      if (hasInstansiTable.value) {
        const { data, error } = await sb.from('instansis').update(updateData).eq('id', id).select().single()
        if (!error && data) {
          updated = data as InstansiRecord
        } else {
          await persistInstansiMetaFallback(updated)
        }
      } else {
        await persistInstansiMetaFallback(updated)
      }

      instansis.value[idx] = updated

      await addActivityLog({
        instansi_id: id,
        log_name: 'instansi',
        description: 'updated',
        subject_type: 'Instansi',
        subject_id: String(id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'System',
        properties: {
          old: { nama: current.nama, slug: current.slug, slogan: current.slogan },
          attributes: { nama: updated.nama, slug: updated.slug, slogan: updated.slogan }
        }
      })

      return updated
    })
  }

  async function deleteInstansi(id: number) {
    if (!isSuperAdmin.value) {
      throw new Error('Akses ditolak: Hanya Super Admin yang dapat menghapus instansi.')
    }
    return withActionLoading('Menghapus instansi & seluruh data terkait...', async () => {
      const sb = requireSupabase()
      const existing = instansis.value.find((i) => i.id === id)
      if (!existing) return

      if (hasInstansiTable.value) {
        await sb.from('instansis').delete().eq('id', id)
      }
      await sb.from('roles').delete().eq('name', `instansi_meta:${id}`)

      // Remove users, kategoris, subjeks, arsips belonging to this instansi if not cascaded
      const tenantUsers = allUsers.value.filter((u) => resolveEntityInstansiId('user', u) === id)
      for (const u of tenantUsers) {
        await sb.from('profiles').delete().eq('id', u.id)
        await sb.from('roles').delete().eq('name', `user_cred:${u.id}`)
        await sb.from('roles').delete().eq('name', `user_acl:${u.id}`)
        await sb.from('roles').delete().eq('name', `tenant_bind:user:${u.id}`)
      }

      instansis.value = instansis.value.filter((i) => i.id !== id)
      allUsers.value = allUsers.value.filter((u) => resolveEntityInstansiId('user', u) !== id)
      allKategoris.value = allKategoris.value.filter((k) => resolveEntityInstansiId('kategori', k) !== id)
      allSubjeks.value = allSubjeks.value.filter((s) => resolveEntityInstansiId('subjek', s) !== id)
      allArsips.value = allArsips.value.filter((a) => resolveEntityInstansiId('arsip', a) !== id)
    })
  }

  // Superadmin creates or edits an Admin Instansi (role = 'admin')
  async function createInstansiAdmin(payload: {
    name: string
    email: string
    password: string
    instansi_id: number
  }): Promise<ProfileRecord> {
    if (!isSuperAdmin.value) {
      throw new Error('Akses ditolak: Hanya Super Admin yang dapat menambahkan Admin Instansi.')
    }
    return withActionLoading('Menambahkan Admin Instansi...', async () => {
      const sb = requireSupabase()
      const cleanEmail = payload.email.trim().toLowerCase()
      const inst = getInstansiById(payload.instansi_id)
      if (!inst) throw new Error('Pilih instansi tujuan terlebih dahulu.')

      const insertPayload: Record<string, any> = {
        name: payload.name.trim(),
        email: cleanEmail,
        role: 'admin',
        instansi_id: inst.id
      }

      let { data, error } = await sb.from('profiles').insert(insertPayload).select().single()
      if (error && /instansi_id|column|schema cache/i.test(error.message || '')) {
        const { instansi_id: _omit, ...fallback } = insertPayload
        const retry = await sb.from('profiles').insert(fallback).select().single()
        data = retry.data
        error = retry.error
      }
      if (error) throw error

      const inserted: ProfileRecord = {
        ...(data as ProfileRecord),
        role: 'admin',
        instansi_id: inst.id
      }
      await saveEntityTenantBinding('user', inserted.id, inst.id)
      await saveUserCredential(inserted.id, payload.password || 'password')
      allUsers.value.unshift(inserted)

      await addActivityLog({
        instansi_id: inst.id,
        log_name: 'user',
        description: 'created',
        subject_type: 'User',
        subject_id: inserted.id,
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'Super Admin',
        properties: {
          attributes: {
            name: inserted.name,
            email: inserted.email,
            role: 'admin',
            instansi: inst.nama
          }
        }
      })
      return inserted
    })
  }

  async function updateInstansiAdmin(
    id: string,
    payload: {
      name: string
      email: string
      instansi_id: number
      password?: string
    }
  ) {
    if (!isSuperAdmin.value) {
      throw new Error('Akses ditolak: Hanya Super Admin yang dapat mengubah Admin Instansi.')
    }
    return withActionLoading('Memperbarui Admin Instansi...', async () => {
      const sb = requireSupabase()
      const idx = allUsers.value.findIndex((u) => u.id === id)
      if (idx === -1) throw new Error('Admin tidak ditemukan.')
      const inst = getInstansiById(payload.instansi_id)
      if (!inst) throw new Error('Instansi tujuan tidak valid.')

      const cleanEmail = payload.email.trim().toLowerCase()
      const updatePayload: Record<string, any> = {
        name: payload.name.trim(),
        email: cleanEmail,
        role: 'admin',
        instansi_id: inst.id
      }

      let { data, error } = await sb.from('profiles').update(updatePayload).eq('id', id).select().single()
      if (error && /instansi_id|column|schema cache/i.test(error.message || '')) {
        const { instansi_id: _omit, ...fallback } = updatePayload
        const retry = await sb.from('profiles').update(fallback).eq('id', id).select().single()
        data = retry.data
        error = retry.error
      }
      if (error) throw error

      const updated: ProfileRecord = {
        ...(data as ProfileRecord),
        role: 'admin',
        instansi_id: inst.id
      }
      await saveEntityTenantBinding('user', id, inst.id)
      if (payload.password && payload.password.trim()) {
        await saveUserCredential(id, payload.password.trim())
      }
      allUsers.value[idx] = updated
    })
  }

  // ============================================================================
  // INSTANSI CRUD: Kategoris, Subjeks, Arsips, Users (Writer/Viewer), Settings
  // ============================================================================
  async function createKategori(payload: { nama: string; deskripsi?: string | null; color: string }) {
    if (!canCreateKategori.value || !currentInstansiId.value) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin untuk membuat kategori.')
    }
    return withActionLoading('Menyimpan fungsi arsip...', async () => {
      const sb = requireSupabase()
      const tid = currentInstansiId.value!
      const insertData: Record<string, any> = {
        ...payload,
        instansi_id: tid
      }
      let { data, error } = await sb.from('kategoris').insert(insertData).select().single()
      if (error && /instansi_id|column|schema cache/i.test(error.message || '')) {
        const { instansi_id: _omit, ...fallback } = insertData
        const retry = await sb.from('kategoris').insert(fallback).select().single()
        data = retry.data
        error = retry.error
        if (!error && data) {
          await saveEntityTenantBinding('kategori', data.id, tid)
        }
      }
      if (error) throw error
      const rec: KategoriRecord = { ...(data as KategoriRecord), instansi_id: tid }
      allKategoris.value.push(rec)
      await addActivityLog({
        instansi_id: tid,
        log_name: 'kategori',
        description: 'created',
        subject_type: 'Kategori',
        subject_id: String(rec.id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'System',
        properties: { attributes: payload }
      })
      return rec
    })
  }

  async function updateKategori(id: number, payload: { nama: string; deskripsi?: string | null; color: string }) {
    const existing = kategoris.value.find((k) => k.id === id)
    if (!existing || !canUpdateKategori.value || !canEditKategoriId(id)) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin untuk mengubah kategori ini.')
    }
    return withActionLoading('Memperbarui fungsi arsip...', async () => {
      const sb = requireSupabase()
      const oldData = { nama: existing.nama, deskripsi: existing.deskripsi, color: existing.color }
      const { data, error } = await sb.from('kategoris').update(payload).eq('id', id).select().single()
      if (error) throw error
      const idx = allKategoris.value.findIndex((k) => k.id === id)
      if (idx !== -1) {
        allKategoris.value[idx] = {
          ...(data as KategoriRecord),
          instansi_id: existing.instansi_id ?? currentInstansiId.value
        }
      }
      await addActivityLog({
        instansi_id: currentInstansiId.value,
        log_name: 'kategori',
        description: 'updated',
        subject_type: 'Kategori',
        subject_id: String(id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'System',
        properties: { old: oldData, attributes: payload }
      })
    })
  }

  async function deleteKategori(id: number) {
    const existing = kategoris.value.find((k) => k.id === id)
    if (!existing || !canDeleteKategori.value || !canEditKategoriId(id)) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin untuk menghapus kategori ini.')
    }
    return withActionLoading('Menghapus fungsi arsip...', async () => {
      const sb = requireSupabase()
      const { error } = await sb.from('kategoris').delete().eq('id', id)
      if (error) throw error
      await saveEntityTenantBinding('kategori', id, null)
      allKategoris.value = allKategoris.value.filter((k) => k.id !== id)
      await addActivityLog({
        instansi_id: currentInstansiId.value,
        log_name: 'kategori',
        description: 'deleted',
        subject_type: 'Kategori',
        subject_id: String(id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'System',
        properties: { old: { nama: existing.nama, color: existing.color } }
      })
    })
  }

  async function createSubjek(payload: { nama: string; deskripsi?: string | null; color: string }) {
    if (!canCreateSubjek.value || !currentInstansiId.value) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin untuk membuat subjek.')
    }
    return withActionLoading('Menyimpan subjek arsip...', async () => {
      const sb = requireSupabase()
      const tid = currentInstansiId.value!
      const insertData: Record<string, any> = {
        ...payload,
        instansi_id: tid
      }
      let { data, error } = await sb.from('subjeks').insert(insertData).select().single()
      if (error && /instansi_id|column|schema cache/i.test(error.message || '')) {
        const { instansi_id: _omit, ...fallback } = insertData
        const retry = await sb.from('subjeks').insert(fallback).select().single()
        data = retry.data
        error = retry.error
        if (!error && data) {
          await saveEntityTenantBinding('subjek', data.id, tid)
        }
      }
      if (error) throw error
      const rec: SubjekRecord = { ...(data as SubjekRecord), instansi_id: tid }
      allSubjeks.value.push(rec)
      await addActivityLog({
        instansi_id: tid,
        log_name: 'subjek',
        description: 'created',
        subject_type: 'Subjek',
        subject_id: String(rec.id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'System',
        properties: { attributes: payload }
      })
      return rec
    })
  }

  async function updateSubjek(id: number, payload: { nama: string; deskripsi?: string | null; color: string }) {
    const existing = subjeks.value.find((s) => s.id === id)
    if (!existing || !canUpdateSubjek.value) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin untuk mengubah subjek.')
    }
    return withActionLoading('Memperbarui subjek arsip...', async () => {
      const sb = requireSupabase()
      const oldData = { nama: existing.nama, deskripsi: existing.deskripsi, color: existing.color }
      const { data, error } = await sb.from('subjeks').update(payload).eq('id', id).select().single()
      if (error) throw error
      const idx = allSubjeks.value.findIndex((s) => s.id === id)
      if (idx !== -1) {
        allSubjeks.value[idx] = {
          ...(data as SubjekRecord),
          instansi_id: existing.instansi_id ?? currentInstansiId.value
        }
      }
      await addActivityLog({
        instansi_id: currentInstansiId.value,
        log_name: 'subjek',
        description: 'updated',
        subject_type: 'Subjek',
        subject_id: String(id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'System',
        properties: { old: oldData, attributes: payload }
      })
    })
  }

  async function deleteSubjek(id: number) {
    const existing = subjeks.value.find((s) => s.id === id)
    if (!existing || !canDeleteSubjek.value) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin untuk menghapus subjek.')
    }
    return withActionLoading('Menghapus subjek arsip...', async () => {
      const sb = requireSupabase()
      const { error } = await sb.from('subjeks').delete().eq('id', id)
      if (error) throw error
      await saveEntityTenantBinding('subjek', id, null)
      allSubjeks.value = allSubjeks.value.filter((s) => s.id !== id)
      await addActivityLog({
        instansi_id: currentInstansiId.value,
        log_name: 'subjek',
        description: 'deleted',
        subject_type: 'Subjek',
        subject_id: String(id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'System',
        properties: { old: { nama: existing.nama, color: existing.color } }
      })
    })
  }

  async function createArsip(payload: {
    judul: string
    deskripsi?: string | null
    kategori_id: number | null
    subjek_id?: number | null
    file_path: string
    original_file_name: string
    file_size?: number
    tanggal_arsip?: string
    created_at?: string
  }) {
    if (!canCreateArsip.value || !canEditKategoriId(payload.kategori_id) || !currentInstansiId.value) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin untuk membuat arsip pada kategori ini.')
    }
    return withActionLoading('Menyimpan dokumen arsip...', async () => {
      const sb = requireSupabase()
      const tid = currentInstansiId.value!
      const createdAt = payload.created_at ? new Date(payload.created_at).toISOString() : nowIso()
      const recordToInsert: Record<string, any> = {
        instansi_id: tid,
        judul: payload.judul,
        deskripsi: payload.deskripsi || null,
        file_path: payload.file_path,
        original_file_name: payload.original_file_name,
        kategori_id: payload.kategori_id,
        subjek_id: payload.subjek_id || null,
        user_id: currentUser.value?.id || null,
        user_name: currentUser.value?.name || 'Administrator',
        tanggal_arsip: payload.tanggal_arsip || createdAt.slice(0, 10),
        version: 1,
        download_count: 0,
        share_count: 0,
        deleted_at: null,
        created_at: createdAt
      }

      let { data, error } = await sb.from('arsips').insert(recordToInsert).select().single()
      if (error && /instansi_id|column|schema cache/i.test(error.message || '')) {
        const { instansi_id: _omit, ...fallback } = recordToInsert
        const retry = await sb.from('arsips').insert(fallback).select().single()
        data = retry.data
        error = retry.error
        if (!error && data) {
          await saveEntityTenantBinding('arsip', data.id, tid)
        }
      }
      if (error) throw error
      const created: ArsipRecord = { ...(data as ArsipRecord), instansi_id: tid }
      allArsips.value.unshift(created)

      await addActivityLog({
        instansi_id: tid,
        log_name: 'arsip',
        description: 'created',
        subject_type: 'Arsip',
        subject_id: String(created.id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'System',
        properties: {
          attributes: {
            judul: created.judul,
            kategori_id: created.kategori_id,
            subjek_id: created.subjek_id,
            original_file_name: created.original_file_name,
            tanggal_arsip: created.tanggal_arsip,
            deskripsi: created.deskripsi
          }
        }
      })
      return created
    })
  }

  async function updateArsip(
    id: number,
    payload: {
      judul: string
      deskripsi?: string | null
      kategori_id: number | null
      subjek_id?: number | null
      file_path?: string
      original_file_name?: string | null
      file_size?: number
      tanggal_arsip?: string | null
    }
  ) {
    return withActionLoading('Memperbarui dokumen arsip...', async () => {
      const sb = requireSupabase()
      const current = arsips.value.find((a) => a.id === id)
      if (!current) throw new Error('Arsip tidak ditemukan di instansi Anda.')
      if (!canUpdateArsip.value || !canEditKategoriId(current.kategori_id) || !canEditKategoriId(payload.kategori_id)) {
        throw new Error('Akses ditolak: Anda tidak memiliki izin untuk mengubah arsip pada kategori ini.')
      }

      const isDirty =
        current.judul !== payload.judul ||
        (current.deskripsi || null) !== (payload.deskripsi || null) ||
        current.kategori_id !== payload.kategori_id ||
        (current.subjek_id || null) !== (payload.subjek_id || null) ||
        (payload.file_path && payload.file_path !== current.file_path) ||
        (payload.tanggal_arsip && payload.tanggal_arsip !== current.tanggal_arsip)

      if (!isDirty) return current

      const versionSnapshot = {
        arsip_id: current.id,
        version: current.version,
        judul: current.judul,
        deskripsi: current.deskripsi,
        file_path: current.file_path,
        original_file_name: current.original_file_name,
        user_id: currentUser.value?.id || current.user_id,
        user_name: currentUser.value?.name || current.user_name || 'Administrator',
        created_at: current.updated_at || current.created_at
      }

      const nextVersion = current.version + 1
      const updateData = {
        judul: payload.judul,
        deskripsi: payload.deskripsi ?? null,
        kategori_id: payload.kategori_id,
        subjek_id: payload.subjek_id ?? null,
        file_path: payload.file_path || current.file_path,
        original_file_name: payload.original_file_name ?? current.original_file_name,
        tanggal_arsip: payload.tanggal_arsip ?? current.tanggal_arsip,
        version: nextVersion
      }

      const { data: vData } = await sb.from('arsip_versions').insert(versionSnapshot).select().single()
      if (vData) versions.value.unshift(vData as ArsipVersionRecord)
      const { data: aData, error } = await sb.from('arsips').update(updateData).eq('id', id).select().single()
      if (error) throw error
      const globalIdx = allArsips.value.findIndex((a) => a.id === id)
      const updatedRecord: ArsipRecord = {
        ...(aData as ArsipRecord),
        instansi_id: current.instansi_id ?? currentInstansiId.value
      }
      if (globalIdx !== -1) allArsips.value[globalIdx] = updatedRecord

      await addActivityLog({
        instansi_id: currentInstansiId.value,
        log_name: 'arsip',
        description: 'updated',
        subject_type: 'Arsip',
        subject_id: String(id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'System',
        properties: {
          old: {
            judul: current.judul,
            kategori_id: current.kategori_id,
            subjek_id: current.subjek_id,
            original_file_name: current.original_file_name,
            tanggal_arsip: current.tanggal_arsip,
            deskripsi: current.deskripsi
          },
          attributes: {
            judul: updateData.judul,
            kategori_id: updateData.kategori_id,
            subjek_id: updateData.subjek_id,
            original_file_name: updateData.original_file_name,
            tanggal_arsip: updateData.tanggal_arsip,
            deskripsi: updateData.deskripsi
          }
        }
      })
      return updatedRecord
    })
  }

  async function softDeleteArsip(id: number) {
    const target = arsips.value.find((a) => a.id === id)
    if (!target) return
    if (!canDeleteArsip.value || !canEditKategoriId(target.kategori_id)) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin untuk menghapus arsip ini.')
    }
    return withActionLoading('Memindahkan arsip ke Trash...', async () => {
      const sb = requireSupabase()
      const deletedAt = nowIso()
      const { error } = await sb.from('arsips').update({ deleted_at: deletedAt }).eq('id', id)
      if (error) throw error
      const idx = allArsips.value.findIndex((a) => a.id === id)
      if (idx !== -1) {
        allArsips.value[idx] = { ...allArsips.value[idx], deleted_at: deletedAt }
      }
      await addActivityLog({
        instansi_id: currentInstansiId.value,
        log_name: 'arsip',
        description: 'deleted',
        subject_type: 'Arsip',
        subject_id: String(id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'System',
        properties: { old: { judul: target.judul } }
      })
    })
  }

  async function restoreArsip(id: number) {
    const target = arsips.value.find((a) => a.id === id)
    if (!target) return
    if (!canRestoreArsip.value || !canEditKategoriId(target.kategori_id)) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin untuk memulihkan arsip ini.')
    }
    return withActionLoading('Memulihkan arsip dari Trash...', async () => {
      const sb = requireSupabase()
      const { error } = await sb.from('arsips').update({ deleted_at: null }).eq('id', id)
      if (error) throw error
      const idx = allArsips.value.findIndex((a) => a.id === id)
      if (idx !== -1) {
        allArsips.value[idx] = { ...allArsips.value[idx], deleted_at: null }
      }
      await addActivityLog({
        instansi_id: currentInstansiId.value,
        log_name: 'arsip',
        description: 'restored',
        subject_type: 'Arsip',
        subject_id: String(id),
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'System',
        properties: { attributes: { judul: target.judul } }
      })
    })
  }

  async function forceDeleteArsip(id: number) {
    const target = arsips.value.find((a) => a.id === id)
    if (!target) return
    if (!canForceDeleteArsip.value || !canEditKategoriId(target.kategori_id)) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin untuk menghapus permanen arsip ini.')
    }
    return withActionLoading('Menghapus permanen arsip...', async () => {
      const sb = requireSupabase()
      await deleteStoredFile(target.file_path)
      const { error } = await sb.from('arsips').delete().eq('id', id)
      if (error) throw error
      await saveEntityTenantBinding('arsip', id, null)
      allArsips.value = allArsips.value.filter((a) => a.id !== id)
      versions.value = versions.value.filter((v) => v.arsip_id !== id)
    })
  }

  async function recordDownload(id: number) {
    const sb = requireSupabase()
    const idx = allArsips.value.findIndex((a) => a.id === id)
    if (idx === -1) return
    const nextCount = (allArsips.value[idx].download_count || 0) + 1
    allArsips.value[idx] = { ...allArsips.value[idx], download_count: nextCount }
    await sb.from('arsips').update({ download_count: nextCount }).eq('id', id)
  }

  async function recordShare(id: number) {
    const sb = requireSupabase()
    const idx = allArsips.value.findIndex((a) => a.id === id)
    if (idx === -1) return
    const nextCount = (allArsips.value[idx].share_count || 0) + 1
    allArsips.value[idx] = { ...allArsips.value[idx], share_count: nextCount }
    await sb.from('arsips').update({ share_count: nextCount }).eq('id', id)
  }

  async function downloadFile(filePath: string, downloadName?: string | null) {
    const url = getFileUrl(filePath)
    if (!url || typeof window === 'undefined') return
    const fileName = (downloadName || filePath.split('/').pop() || 'arsip-file').trim()

    await withActionLoading('Mengunduh file...', async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        link.remove()
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000)
      } catch {
        const sep = url.includes('?') ? '&' : '?'
        const attachmentUrl = `${url}${sep}download=${encodeURIComponent(fileName)}`
        const link = document.createElement('a')
        link.href = attachmentUrl
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    })
  }

  // Admin Instansi User Management (Writer & Viewer inside their instansi)
  async function createUser(payload: { name: string; email: string; role: string; password?: string }) {
    if (!isAdminInstansi.value || !currentInstansiId.value) {
      throw new Error('Akses ditolak: Hanya Admin Instansi yang dapat menambahkan user di instansinya.')
    }
    return withActionLoading('Menambahkan pengguna instansi...', async () => {
      const sb = requireSupabase()
      const tid = currentInstansiId.value!
      const rawRole = normalizeRole(payload.role)
      const allowedRole: 'writer' | 'viewer' = rawRole === 'viewer' ? 'viewer' : 'writer'
      const cleanEmail = payload.email.trim().toLowerCase()

      const insertPayload: Record<string, any> = {
        name: payload.name.trim(),
        email: cleanEmail,
        role: allowedRole,
        instansi_id: tid
      }

      let { data, error } = await sb.from('profiles').insert(insertPayload).select().single()
      if (error && /instansi_id|column|schema cache/i.test(error.message || '')) {
        const { instansi_id: _omit, ...fallback } = insertPayload
        const retry = await sb.from('profiles').insert(fallback).select().single()
        data = retry.data
        error = retry.error
      }
      if (error) throw error

      const inserted: ProfileRecord = {
        ...(data as ProfileRecord),
        role: allowedRole,
        instansi_id: tid
      }
      await saveEntityTenantBinding('user', inserted.id, tid)
      if (payload.password) {
        await saveUserCredential(inserted.id, payload.password)
      }
      allUsers.value.unshift(inserted)
      await addActivityLog({
        instansi_id: tid,
        log_name: 'user',
        description: 'created',
        subject_type: 'User',
        subject_id: inserted.id,
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'Admin Instansi',
        properties: { attributes: { name: inserted.name, email: inserted.email, role: inserted.role } }
      })
      return inserted
    })
  }

  async function updateUser(id: string, payload: { name: string; email: string; role: string; password?: string }) {
    if (!isAdminInstansi.value || !currentInstansiId.value) {
      throw new Error('Akses ditolak: Hanya Admin Instansi yang dapat memperbarui user di instansinya.')
    }
    return withActionLoading('Memperbarui data pengguna...', async () => {
      const sb = requireSupabase()
      const tid = currentInstansiId.value!
      const idx = allUsers.value.findIndex((u) => u.id === id)
      if (idx === -1) return
      const target = allUsers.value[idx]
      if (resolveEntityInstansiId('user', target) !== tid) {
        throw new Error('Akses ditolak: Pengguna bukan bagian dari instansi Anda.')
      }

      const rawRole = normalizeRole(payload.role)
      const nextRole: AppRole =
        target.id === currentUser.value?.id
          ? 'admin'
          : rawRole === 'viewer'
          ? 'viewer'
          : 'writer'

      const old = { name: target.name, email: target.email, role: target.role }
      const { data, error } = await sb
        .from('profiles')
        .update({ name: payload.name.trim(), email: payload.email.trim().toLowerCase(), role: nextRole })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error

      const updated: ProfileRecord = {
        ...(data as ProfileRecord),
        role: nextRole,
        instansi_id: tid
      }
      allUsers.value[idx] = updated
      if (payload.password && payload.password.trim()) {
        await saveUserCredential(id, payload.password)
      }
      if (currentUser.value?.id === id) {
        currentUser.value = { ...currentUser.value, ...updated }
      }
      if (nextRole === 'admin') {
        await saveUserCustomPermissions(id, null)
      } else if (userAclMap.value[id]) {
        await saveUserCustomPermissions(id, userAclMap.value[id])
      }
      await addActivityLog({
        instansi_id: tid,
        log_name: 'user',
        description: 'updated',
        subject_type: 'User',
        subject_id: id,
        causer_id: currentUser.value?.id || null,
        causer_name: currentUser.value?.name || 'Admin Instansi',
        properties: { old, attributes: { name: payload.name, email: payload.email, role: nextRole } }
      })
    })
  }

  async function deleteUser(id: string) {
    if (!isSuperAdmin.value && !isAdminInstansi.value) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin menghapus pengguna.')
    }
    return withActionLoading('Menghapus pengguna...', async () => {
      const sb = requireSupabase()
      const target = allUsers.value.find((u) => u.id === id)
      if (!target) return
      if (isAdminInstansi.value && resolveEntityInstansiId('user', target) !== currentInstansiId.value) {
        throw new Error('Akses ditolak: Pengguna bukan dari instansi Anda.')
      }
      const { error } = await sb.from('profiles').delete().eq('id', id)
      if (error) throw error
      await sb.from('roles').delete().eq('name', `user_acl:${id}`)
      await sb.from('roles').delete().eq('name', `user_cred:${id}`)
      await saveEntityTenantBinding('user', id, null)
      const nextAcl = { ...userAclMap.value }
      delete nextAcl[id]
      userAclMap.value = nextAcl
      const nextCred = { ...userCredMap.value }
      delete nextCred[id]
      userCredMap.value = nextCred
      allUsers.value = allUsers.value.filter((u) => u.id !== id)
    })
  }

  function getUserCustomPermissions(userId: string): string[] | null {
    const entry = userAclMap.value[userId]
    return Array.isArray(entry) ? [...entry] : null
  }

  async function saveUserCustomPermissions(userId: string, permissions: string[] | null) {
    if (!isAdminInstansi.value && !isSuperAdmin.value) {
      throw new Error('Akses ditolak: Hanya Admin Instansi yang dapat mengatur akses data pengguna.')
    }
    return withActionLoading('Menyimpan hak akses pengguna...', async () => {
      const sb = requireSupabase()
      const targetUser = allUsers.value.find((u) => u.id === userId)
      const targetRole = normalizeRole(targetUser?.role)
      const aclName = `user_acl:${userId}`

      if (targetRole === 'superadmin' || targetRole === 'admin' || permissions === null) {
        const { error } = await sb.from('roles').delete().eq('name', aclName)
        if (error) throw error
        const nextAcl = { ...userAclMap.value }
        delete nextAcl[userId]
        userAclMap.value = nextAcl
        return null
      }

      const sanitized = sanitizePermissionsForRole(targetRole, permissions)
      const { error } = await sb
        .from('roles')
        .upsert({ name: aclName, permissions: sanitized }, { onConflict: 'name' })
        .select()
        .single()
      if (error) throw error
      userAclMap.value = { ...userAclMap.value, [userId]: sanitized }
      return sanitized
    })
  }

  async function updateRole(_id: number, payload: { name: string; permissions: string[] }) {
    if (!isAdminInstansi.value || !currentInstansiId.value) {
      throw new Error('Akses ditolak: Hanya Admin Instansi yang dapat mengubah konfigurasi role di instansinya.')
    }
    return withActionLoading('Menyimpan konfigurasi role instansi...', async () => {
      const sb = requireSupabase()
      const tid = currentInstansiId.value!
      const targetRole = normalizeRole(payload.name)
      if (targetRole !== 'writer' && targetRole !== 'viewer') {
        throw new Error('Hanya role Writer dan Viewer yang dapat dikustomisasi.')
      }
      const sanitized = sanitizePermissionsForRole(targetRole, payload.permissions)
      const roleKey = `role_acl:${tid}:${targetRole}`
      const { error } = await sb
        .from('roles')
        .upsert({ name: roleKey, permissions: sanitized }, { onConflict: 'name' })
      if (error) throw error
      instansiRoleAclMap.value = {
        ...instansiRoleAclMap.value,
        [`${tid}:${targetRole}`]: sanitized
      }
    })
  }

  // Update Settings for Current Instansi (Admin Instansi updates their own instansi landing page)
  async function updateSettings(payload: {
    name: string
    slug?: string
    slogan: string | null
    logo?: string | null
    hero?: { title?: string; subtitle?: string | null; image?: string | null }
  }) {
    if (isAdminInstansi.value && currentInstansiId.value) {
      await updateInstansi(currentInstansiId.value, {
        nama: payload.name,
        slug: payload.slug,
        slogan: payload.slogan,
        logo: payload.logo,
        hero_title: payload.hero?.title,
        hero_subtitle: payload.hero?.subtitle,
        hero_image: payload.hero?.image
      })
      return
    }
    throw new Error('Akses ditolak: Hanya Admin Instansi yang dapat mengubah pengaturan halaman instansinya.')
  }

  const companyLogoUrl = computed(() => {
    if (settings.value.logo) {
      return getFileUrl(settings.value.logo) || DEFAULT_PLACEHOLDER_LOGO
    }
    return DEFAULT_PLACEHOLDER_LOGO
  })

  const heroImageUrl = computed(() => {
    if (heroConfig.value.image) {
      return getFileUrl(heroConfig.value.image) || DEFAULT_HERO_IMAGE
    }
    return DEFAULT_HERO_IMAGE
  })

  function getKategori(id?: number | null): KategoriRecord | undefined {
    return allKategoris.value.find((k) => k.id === id)
  }

  function getSubjek(id?: number | null): SubjekRecord | undefined {
    return allSubjeks.value.find((s) => s.id === id)
  }

  function getUserName(arsip: { user_id?: string | null; user_name?: string | null }): string {
    if (arsip.user_id) {
      const u = allUsers.value.find((x) => x.id === arsip.user_id)
      if (u) return u.name
    }
    return arsip.user_name || 'N/A'
  }

  function formatFieldLabel(key: string | number): string {
    const raw = String(key)
    const labelMap: Record<string, string> = {
      judul: 'Judul Arsip',
      kategori_id: 'Kategori (Fungsi)',
      kategori: 'Kategori (Fungsi)',
      subjek_id: 'Subjek',
      subjek: 'Subjek',
      deskripsi: 'Deskripsi',
      original_file_name: 'Nama File',
      file_path: 'Path File',
      tanggal_arsip: 'Tanggal Arsip',
      user_id: 'Pengunggah',
      user_name: 'Pengunggah',
      nama: 'Nama',
      slug: 'Slug URL',
      instansi: 'Instansi',
      color: 'Warna Badge',
      name: 'Nama Pengguna',
      email: 'Email',
      role: 'Role',
      slogan: 'Slogan',
      version: 'Versi'
    }
    if (labelMap[raw]) return labelMap[raw]
    return raw.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  function formatFieldValue(key: string | number, val: any): string {
    if (val === null || val === undefined || val === '') return '-'
    const k = String(key)
    if (k === 'kategori_id') {
      return getKategori(Number(val))?.nama || String(val)
    }
    if (k === 'subjek_id') {
      return getSubjek(Number(val))?.nama || '-'
    }
    if (k === 'user_id') {
      return allUsers.value.find((u) => u.id === String(val))?.name || String(val)
    }
    return String(val)
  }

  function getActivitySubjectName(log: ActivityLogRecord): string {
    const attr = log.properties?.attributes || {}
    const old = log.properties?.old || {}
    let resolved =
      attr.judul ||
      old.judul ||
      attr.nama ||
      old.nama ||
      attr.name ||
      old.name ||
      ''

    if (!resolved && log.subject_id) {
      const sid = String(log.subject_id)
      if (log.subject_type === 'Arsip') {
        resolved = allArsips.value.find((a) => String(a.id) === sid)?.judul || ''
      } else if (log.subject_type === 'Kategori') {
        resolved = allKategoris.value.find((k) => String(k.id) === sid)?.nama || ''
      } else if (log.subject_type === 'Subjek') {
        resolved = allSubjeks.value.find((s) => String(s.id) === sid)?.nama || ''
      } else if (log.subject_type === 'User') {
        resolved = allUsers.value.find((u) => String(u.id) === sid)?.name || ''
      } else if (log.subject_type === 'Instansi') {
        resolved = instansis.value.find((i) => String(i.id) === sid)?.nama || ''
      }
    }

    if (resolved) {
      return log.subject_type ? `${log.subject_type}: ${resolved}` : String(resolved)
    }
    return `${log.subject_type || '-'}${log.subject_id ? ` #${log.subject_id}` : ''}`
  }

  return {
    isSupabase,
    loading,
    initialized,
    currentUser,
    instansis,
    currentInstansiId,
    currentInstansi,
    getInstansiById,
    getInstansiBySlug,
    getInstansiLogoUrl,
    getInstansiHeroImageUrl,
    resolveEntityInstansiId,
    roles,
    userAclMap,
    allUsers,
    users,
    instansiAdmins,
    allKategoris,
    kategoris,
    allSubjeks,
    subjeks,
    allArsips,
    arsips,
    activeArsips,
    trashedArsips,
    versions,
    activityLogs,
    platformSettings,
    settings,
    companyLogoUrl,
    heroConfig,
    heroImageUrl,
    userRole,
    isSuperAdmin,
    isAdminInstansi,
    isWriter,
    isViewer,
    canWrite,
    effectivePermissions,
    hasPermission,
    canCreateArsip,
    canUpdateArsip,
    canDeleteArsip,
    canRestoreArsip,
    canForceDeleteArsip,
    canCreateKategori,
    canUpdateKategori,
    canDeleteKategori,
    canManageKategori,
    canCreateSubjek,
    canUpdateSubjek,
    canDeleteSubjek,
    canManageSubjek,
    allowedViewKategoriIds,
    allowedEditKategoriIds,
    canViewKategoriId,
    canEditKategoriId,
    canEditArsipRecord,
    canDeleteArsipRecord,
    visibleKategoris,
    editableKategoris,
    canAccessPath,
    loadPublicSettings,
    init,
    loginSuperAdmin,
    loginInstansi,
    login,
    logout,
    updateProfile,
    updatePassword,
    uploadFile,
    getFileUrl,
    getFileSize,
    deleteStoredFile,
    downloadFile,
    createInstansi,
    updateInstansi,
    deleteInstansi,
    createInstansiAdmin,
    updateInstansiAdmin,
    createKategori,
    updateKategori,
    deleteKategori,
    createSubjek,
    updateSubjek,
    deleteSubjek,
    createArsip,
    updateArsip,
    softDeleteArsip,
    restoreArsip,
    forceDeleteArsip,
    recordDownload,
    recordShare,
    createUser,
    updateUser,
    deleteUser,
    getUserCustomPermissions,
    saveUserCustomPermissions,
    updateRole,
    updateSettings,
    getKategori,
    getSubjek,
    getUserName,
    formatFieldLabel,
    formatFieldValue,
    getActivitySubjectName,
    confirmModalState,
    confirmDialog,
    resolveConfirmDialog,
    actionLoading,
    actionLoadingText,
    withActionLoading
  }
}
