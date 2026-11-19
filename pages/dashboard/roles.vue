<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="text-2xl font-bold tracking-tight text-zinc-950">Roles &amp; Pengaturan Akses Instansi</h1>
          <span class="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 tabular-nums shadow-sm">
            {{ roles.length }}
          </span>
        </div>
        <p class="text-sm text-zinc-500 mt-0.5">
          Atur cakupan modul dan kategori default untuk role <span class="font-medium text-zinc-800">writer</span> dan
          <span class="font-medium text-zinc-800">viewer</span> di <span class="font-medium text-zinc-800">{{ currentInstansi?.nama || 'instansi ini' }}</span>.
        </p>
      </div>
    </div>

    <div v-if="statusMsg" class="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
      {{ statusMsg }}
    </div>
    <div v-if="errMsg" class="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
      {{ errMsg }}
    </div>

    <!-- 3 Instansi Role Cards (admin, writer, viewer) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div
        v-for="r in roles"
        :key="r.name"
        class="bg-white rounded-lg border border-zinc-200 shadow-sm p-5 flex flex-col justify-between gap-5"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-lg font-semibold tracking-tight text-zinc-950">{{ formatRoleLabel(r.name) }}</h2>
                <span
                  :class="[
                    roleBadgeClass(r.name),
                    'px-2 py-0.5 rounded-md text-[11px] font-medium font-mono'
                  ]"
                >
                  {{ r.name }}
                </span>
              </div>
              <p class="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                {{ roleDescription(r.name) }}
              </p>
            </div>
          </div>

          <!-- Category Scope Summary -->
          <div class="rounded-md bg-white border border-slate-200 p-3 space-y-2.5 text-xs">
            <div>
              <div class="font-medium text-zinc-700 mb-1">Cakupan Data Dilihat</div>
              <div v-if="r.name === 'admin'" class="text-zinc-600">Semua kategori &amp; seluruh data instansi</div>
              <div v-else-if="getScopeIds(r.permissions, 'scope_view_kategori:').length === 0" class="text-zinc-600">
                Semua Kategori Instansi ({{ kategoris.length }})
              </div>
              <div v-else class="flex flex-wrap gap-1.5">
                <span
                  v-for="kid in getScopeIds(r.permissions, 'scope_view_kategori:')"
                  :key="`v-${kid}`"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium"
                  :style="computeBadgeStyle(app.getKategori(kid)?.color)"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: app.getKategori(kid)?.color || '#64748b' }"></span>
                  <span>{{ app.getKategori(kid)?.nama || `Kategori #${kid}` }}</span>
                </span>
              </div>
            </div>

            <div v-if="r.name !== 'viewer'">
              <div class="font-medium text-zinc-700 mb-1">Cakupan Data Diedit / Dikelola</div>
              <div v-if="r.name === 'admin'" class="text-zinc-600">Semua kategori &amp; pengaturan penuh instansi</div>
              <div v-else-if="getScopeIds(r.permissions, 'scope_edit_kategori:').length === 0" class="text-zinc-600">
                Semua kategori yang dapat dilihat
              </div>
              <div v-else class="flex flex-wrap gap-1.5">
                <span
                  v-for="kid in getScopeIds(r.permissions, 'scope_edit_kategori:')"
                  :key="`e-${kid}`"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium"
                  :style="computeBadgeStyle(app.getKategori(kid)?.color)"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: app.getKategori(kid)?.color || '#64748b' }"></span>
                  <span>{{ app.getKategori(kid)?.nama || `Kategori #${kid}` }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Active Permissions -->
          <div>
            <div class="flex items-center justify-between text-xs mb-2">
              <span class="font-medium text-zinc-700">Permission Aktif</span>
              <span class="text-zinc-500 tabular-nums">{{ extractBase(r.permissions).length }} modul/aksi</span>
            </div>
            <div class="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
              <span
                v-for="perm in extractBase(r.permissions)"
                :key="perm"
                class="px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-700 text-[11px] font-medium"
              >
                {{ formatPermLabel(perm) }}
              </span>
              <span v-if="extractBase(r.permissions).length === 0" class="text-xs text-zinc-400">
                Tidak ada modul aktif.
              </span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-zinc-100">
          <div
            v-if="r.name === 'admin'"
            class="w-full text-center rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-600"
          >
            Semua Permission Instansi Aktif (Terkunci)
          </div>
          <button
            v-else
            type="button"
            @click="openEdit(r)"
            class="w-full h-9 rounded-md bg-[#1d4ed8] px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-[#1e40af] transition-colors"
          >
            Atur Akses Data &amp; Permission
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Configure Role Data Scope & Permissions -->
    <div v-if="modalOpen && editingRole" class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4">
      <div class="bg-white rounded-lg border border-zinc-200 shadow-lg max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 class="text-lg font-semibold text-zinc-950 tracking-tight">
              Atur Akses Role: {{ formatRoleLabel(editingRole.name) }}
            </h3>
            <p class="text-xs text-zinc-500 mt-0.5">
              Tentukan modul, aksi, dan kategori data yang boleh diakses oleh role ini di {{ currentInstansi?.nama }}.
            </p>
          </div>
          <button
            type="button"
            @click="modalOpen = false"
            class="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          v-if="editingRole.name === 'viewer'"
          class="rounded-md bg-zinc-100 border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-800"
        >
          Role <span class="font-semibold">Viewer</span> hanya diperbolehkan melihat data. Seluruh akses tambah, edit, dan hapus data dinonaktifkan secara otomatis.
        </div>

        <div
          v-if="modalErr"
          class="rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-800"
        >
          {{ modalErr }}
        </div>

        <form @submit.prevent="handleSave" class="space-y-5">
          <!-- Section 1: Module & Action Permissions -->
          <div class="space-y-3">
            <h4 class="text-sm font-semibold text-zinc-950">1. Akses Modul &amp; Aksi Data</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="group in PERMISSION_GROUPS"
                :key="group.title"
                class="rounded-md border border-slate-200 p-3.5 space-y-2.5 bg-white"
              >
                <div class="text-xs font-semibold text-zinc-600">{{ group.title }}</div>
                <div class="space-y-1.5">
                  <label
                    v-for="item in group.items"
                    :key="item.key"
                    :class="[
                      isPermDisabled(item.key) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                      'flex items-center gap-2 text-xs text-zinc-700'
                    ]"
                  >
                    <input
                      type="checkbox"
                      :checked="hasDraftPerm(item.key)"
                      :disabled="isPermDisabled(item.key)"
                      @change="toggleDraftPerm(item.key, ($event.target as HTMLInputElement).checked)"
                      class="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950"
                    />
                    <span>{{ item.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Viewable Category Data Scope -->
          <div class="space-y-2.5 border-t border-zinc-100 pt-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-semibold text-zinc-950">2. Data Kategori (Fungsi Arsip) yang Bisa Dilihat</h4>
                <p class="text-xs text-zinc-500">Batasi arsip dan fungsi arsip berdasarkan kategori tertentu.</p>
              </div>
              <select
                v-model="draft.viewScopeMode"
                class="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium bg-white text-zinc-800"
              >
                <option value="all">Semua Kategori Instansi</option>
                <option value="custom">Pilih Kategori Tertentu</option>
              </select>
            </div>

            <div
              v-if="draft.viewScopeMode === 'custom'"
              class="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-md border border-zinc-200 p-3 bg-zinc-50/50 max-h-48 overflow-y-auto"
            >
              <label
                v-for="k in kategoris"
                :key="`view-cat-${k.id}`"
                class="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer"
              >
                <input
                  v-model="draft.viewKategoriIds"
                  type="checkbox"
                  :value="k.id"
                  class="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950"
                />
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: k.color }"></span>
                  <span>{{ k.nama }}</span>
                </span>
              </label>
              <p v-if="kategoris.length === 0" class="text-xs text-zinc-400 col-span-2">Belum ada data kategori.</p>
            </div>
          </div>

          <!-- Section 3: Editable Category Data Scope (Writer only) -->
          <div v-if="editingRole.name === 'writer'" class="space-y-2.5 border-t border-zinc-100 pt-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-semibold text-zinc-950">3. Data Kategori yang Bisa Dibuat / Diedit / Dihapus</h4>
                <p class="text-xs text-zinc-500">Atur kategori mana saja yang dapat diubah oleh Writer.</p>
              </div>
              <select
                v-model="draft.editScopeMode"
                class="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium bg-white text-zinc-800"
              >
                <option value="all">Semua Kategori yang Dapat Dilihat</option>
                <option value="custom">Pilih Kategori Tertentu</option>
              </select>
            </div>

            <div
              v-if="draft.editScopeMode === 'custom'"
              class="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-md border border-zinc-200 p-3 bg-zinc-50/50 max-h-48 overflow-y-auto"
            >
              <label
                v-for="k in selectableEditKategoris"
                :key="`edit-cat-${k.id}`"
                class="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer"
              >
                <input
                  v-model="draft.editKategoriIds"
                  type="checkbox"
                  :value="k.id"
                  class="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950"
                />
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: k.color }"></span>
                  <span>{{ k.nama }}</span>
                </span>
              </label>
              <p v-if="selectableEditKategoris.length === 0" class="text-xs text-zinc-400 col-span-2">
                Pilih minimal satu kategori yang dapat dilihat terlebih dahulu.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              @click="resetDraftToDefault"
              class="inline-flex h-9 items-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 transition-colors"
            >
              Reset Default Role
            </button>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="modalOpen = false"
                class="inline-flex h-9 items-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="inline-flex h-9 items-center rounded-md bg-[#1d4ed8] px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-[#1e40af] disabled:opacity-50 transition-colors"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DEFAULT_ROLE_PERMISSIONS,
  VIEWER_ALLOWED_PERMISSIONS,
  buildPermissionsWithScopes,
  computeBadgeStyle,
  extractBasePermissions,
  extractScopeIds,
  formatRoleLabel,
  type AppRole
} from '~/composables/useArsipApp'
import type { RoleRecord } from '~/types/arsip'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const PERMISSION_GROUPS = [
  {
    title: 'Data Arsip',
    items: [
      { key: 'view_any_arsip', label: 'Lihat Daftar & Detail Arsip' },
      { key: 'create_arsip', label: 'Buat / Upload Arsip' },
      { key: 'update_arsip', label: 'Edit & Versi Baru Arsip' },
      { key: 'delete_arsip', label: 'Hapus ke Trash' },
      { key: 'restore_arsip', label: 'Pulihkan dari Trash' },
      { key: 'force_delete_arsip', label: 'Hapus Permanen Arsip' }
    ]
  },
  {
    title: 'Fungsi Arsip (Kategori)',
    items: [
      { key: 'view_any_kategori', label: 'Lihat Fungsi Arsip' },
      { key: 'create_kategori', label: 'Buat Fungsi Arsip' },
      { key: 'update_kategori', label: 'Edit Fungsi Arsip' },
      { key: 'delete_kategori', label: 'Hapus Fungsi Arsip' }
    ]
  },
  {
    title: 'Subjek Arsip',
    items: [
      { key: 'view_any_subjek', label: 'Lihat Subjek Arsip' },
      { key: 'create_subjek', label: 'Buat Subjek Arsip' },
      { key: 'update_subjek', label: 'Edit Subjek Arsip' },
      { key: 'delete_subjek', label: 'Hapus Subjek Arsip' }
    ]
  },
  {
    title: 'Monitoring',
    items: [{ key: 'view_audit_trail', label: 'Lihat Log Audit Trail Instansi' }]
  }
]

const PERM_LABELS: Record<string, string> = {
  view_any_arsip: 'Lihat Arsip',
  view_arsip: 'Detail Arsip',
  create_arsip: 'Buat Arsip',
  update_arsip: 'Edit Arsip',
  delete_arsip: 'Hapus Arsip',
  restore_arsip: 'Restore Trash',
  force_delete_arsip: 'Hapus Permanen',
  view_any_kategori: 'Lihat Kategori',
  create_kategori: 'Buat Kategori',
  update_kategori: 'Edit Kategori',
  delete_kategori: 'Hapus Kategori',
  view_any_subjek: 'Lihat Subjek',
  create_subjek: 'Buat Subjek',
  update_subjek: 'Edit Subjek',
  delete_subjek: 'Hapus Subjek',
  view_any_user: 'Lihat Users',
  create_user: 'Buat User',
  update_user: 'Edit User',
  delete_user: 'Hapus User',
  view_any_role: 'Lihat Roles',
  update_role: 'Atur Role',
  view_audit_trail: 'Audit Trail',
  manage_settings: 'Landing Page & Profil'
}

const app = useArsipApp()
const { roles, kategoris, currentInstansi } = app

const modalOpen = ref(false)
const saving = ref(false)
const statusMsg = ref('')
const errMsg = ref('')
const modalErr = ref('')
const editingRole = ref<RoleRecord | null>(null)

const draft = reactive({
  permissions: [] as string[],
  viewScopeMode: 'all' as 'all' | 'custom',
  viewKategoriIds: [] as number[],
  editScopeMode: 'all' as 'all' | 'custom',
  editKategoriIds: [] as number[]
})

const selectableEditKategoris = computed(() => {
  if (draft.viewScopeMode === 'all') return kategoris.value
  return kategoris.value.filter((k) => draft.viewKategoriIds.includes(k.id))
})

onMounted(async () => {
  await app.init()
})

function getScopeIds(perms: string[], prefix: 'scope_view_kategori:' | 'scope_edit_kategori:') {
  return extractScopeIds(perms, prefix)
}

function extractBase(perms: string[]) {
  return extractBasePermissions(perms)
}

function formatPermLabel(perm: string): string {
  return PERM_LABELS[perm] || perm
}

function roleBadgeClass(name: string): string {
  if (name === 'admin') return 'bg-[#1d4ed8] text-white'
  if (name === 'writer') return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200'
  return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200'
}

function roleDescription(name: string): string {
  if (name === 'admin') {
    return 'Admin Instansi: Akses penuh untuk mengelola arsip, pengguna (Writer & Viewer), serta tampilan Landing Page instansinya.'
  }
  if (name === 'writer') {
    return 'Dapat melihat, membuat, mengedit, dan menghapus data arsip serta master data sesuai cakupan yang diatur.'
  }
  return 'Hanya dapat melihat data yang diizinkan di dalam instansi ini. Seluruh aksi tambah, ubah, dan hapus data dinonaktifkan.'
}

function isPermDisabled(permKey: string): boolean {
  if (!editingRole.value) return true
  if (editingRole.value.name === 'viewer') {
    return !VIEWER_ALLOWED_PERMISSIONS.includes(permKey)
  }
  return false
}

function hasDraftPerm(permKey: string): boolean {
  return draft.permissions.includes(permKey)
}

function toggleDraftPerm(permKey: string, checked: boolean) {
  const set = new Set(draft.permissions)
  if (checked) {
    set.add(permKey)
    if (permKey === 'view_any_arsip') set.add('view_arsip')
  } else {
    set.delete(permKey)
    if (permKey === 'view_any_arsip') set.delete('view_arsip')
  }
  draft.permissions = Array.from(set)
}

function openEdit(r: RoleRecord) {
  errMsg.value = ''
  modalErr.value = ''
  statusMsg.value = ''
  editingRole.value = r
  draft.permissions = extractBasePermissions(r.permissions)
  const viewIds = extractScopeIds(r.permissions, 'scope_view_kategori:')
  const editIds = extractScopeIds(r.permissions, 'scope_edit_kategori:')
  draft.viewScopeMode = viewIds.length > 0 ? 'custom' : 'all'
  draft.viewKategoriIds = viewIds.length > 0 ? [...viewIds] : kategoris.value.map((k) => k.id)
  draft.editScopeMode = editIds.length > 0 ? 'custom' : 'all'
  draft.editKategoriIds = editIds.length > 0 ? [...editIds] : kategoris.value.map((k) => k.id)
  modalOpen.value = true
}

function resetDraftToDefault() {
  if (!editingRole.value) return
  const rName = editingRole.value.name as AppRole
  draft.permissions = [...DEFAULT_ROLE_PERMISSIONS[rName]]
  draft.viewScopeMode = 'all'
  draft.viewKategoriIds = kategoris.value.map((k) => k.id)
  draft.editScopeMode = 'all'
  draft.editKategoriIds = kategoris.value.map((k) => k.id)
}

async function handleSave() {
  if (!editingRole.value) return
  errMsg.value = ''
  modalErr.value = ''
  if (draft.viewScopeMode === 'custom' && draft.viewKategoriIds.length === 0) {
    modalErr.value = 'Pilih minimal 1 kategori yang dapat dilihat, atau ubah ke Semua Kategori.'
    return
  }
  if (editingRole.value.name === 'writer' && draft.editScopeMode === 'custom' && draft.editKategoriIds.length === 0) {
    modalErr.value = 'Pilih minimal 1 kategori yang dapat diedit, atau ubah ke Semua Kategori.'
    return
  }

  saving.value = true
  try {
    const viewIds = draft.viewScopeMode === 'custom' ? draft.viewKategoriIds : []
    const editIds =
      editingRole.value.name === 'writer' && draft.editScopeMode === 'custom'
        ? draft.editKategoriIds.filter((id) => viewIds.length === 0 || viewIds.includes(id))
        : []
    const nextPermissions = buildPermissionsWithScopes(draft.permissions, viewIds, editIds)
    await app.updateRole(editingRole.value.id, {
      name: editingRole.value.name,
      permissions: nextPermissions
    })
    statusMsg.value = `Pengaturan akses role ${formatRoleLabel(editingRole.value.name)} di ${currentInstansi.value?.nama || 'instansi ini'} berhasil diperbarui.`
    modalOpen.value = false
  } catch (err: any) {
    modalErr.value = err?.message || 'Gagal menyimpan pengaturan role.'
  } finally {
    saving.value = false
  }
}
</script>
