<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="text-2xl font-bold tracking-tight text-zinc-950">Users &amp; Akses Data Instansi</h1>
          <span class="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 tabular-nums shadow-sm">
            {{ users.length }}
          </span>
        </div>
        <p class="text-sm text-zinc-500 mt-0.5">
          Kelola pengguna di <span class="font-medium text-zinc-800">{{ currentInstansi?.nama || 'instansi Anda' }}</span>. Tambahkan akun <span class="font-medium">writer</span> atau <span class="font-medium">viewer</span> beserta cakupan kategori arsipnya.
        </p>
      </div>
      <button
        type="button"
        @click="openCreate"
        class="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#1d4ed8] px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-[#1e40af] transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Tambah User Instansi</span>
      </button>
    </div>

    <div v-if="statusMsg" class="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
      {{ statusMsg }}
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table class="w-full table-fixed divide-y divide-slate-200 text-sm">
        <thead class="bg-white">
          <tr>
            <th class="px-3 py-3 text-left text-xs font-semibold text-slate-600">Nama</th>
            <th class="px-3 py-3 text-left text-xs font-semibold text-slate-600">Email</th>
            <th class="px-2.5 py-3 text-left text-xs font-semibold text-slate-600 w-32">Role</th>
            <th class="px-2.5 py-3 text-left text-xs font-semibold text-slate-600 w-48 hidden md:table-cell">Cakupan Akses Data</th>
            <th class="px-2.5 py-3 text-left text-xs font-semibold text-slate-600 w-28 hidden sm:table-cell">Dibuat</th>
            <th class="px-3 py-3 text-right text-xs font-semibold text-slate-600 w-14">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50/70 transition-colors">
            <td class="px-3 py-3 font-medium text-slate-900 truncate">{{ u.name }}</td>
            <td class="px-3 py-3 text-slate-600 truncate">{{ u.email }}</td>
            <td class="px-2.5 py-3">
              <span
                :class="[
                  roleBadgeClass(u.role),
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium'
                ]"
              >
                {{ formatRoleLabel(u.role) }}
              </span>
            </td>
            <td class="px-2.5 py-3 text-xs text-slate-600 hidden md:table-cell truncate">
              <span
                v-if="normalizeRole(u.role) === 'admin'"
                class="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 bg-white text-slate-700 font-medium"
              >
                Akses Penuh Instansi
              </span>
              <span
                v-else-if="app.getUserCustomPermissions(u.id)"
                class="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium"
              >
                {{ formatUserScopeSummary(u.id) }}
              </span>
              <span v-else class="text-slate-500">
                Mengikuti Role {{ formatRoleLabel(u.role) }}
              </span>
            </td>
            <td class="px-2.5 py-3 text-slate-500 text-xs tabular-nums hidden sm:table-cell">{{ formatDate(u.created_at) }}</td>
            <td class="px-3 py-3 text-right w-14">
              <RowActionMenu
                v-if="normalizeRole(u.role) !== 'admin'"
                :items="[
                  {
                    label: 'Edit & Atur Akses',
                    onClick: () => openEdit(u),
                    icon: 'edit'
                  },
                  {
                    label: 'Hapus User',
                    onClick: () => handleDelete(u.id),
                    icon: 'delete',
                    variant: 'danger',
                    show: u.id !== currentUser?.id
                  }
                ]"
              />
              <span v-else class="text-xs text-slate-400">Admin</span>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="6" class="px-6 py-10 text-center text-slate-500">Belum ada pengguna terdaftar di instansi ini.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4">
      <div class="bg-white rounded-lg border border-zinc-200 shadow-lg max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 class="text-lg font-semibold text-zinc-950 tracking-tight">
              {{ editingId ? 'Edit User & Atur Akses Data' : 'Tambah User Instansi Baru' }}
            </h3>
            <p class="text-xs text-zinc-500 mt-0.5">
              Pengguna ini hanya akan memiliki akses ke ruang kerja <span class="font-medium text-zinc-700">{{ currentInstansi?.nama }}</span>.
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

        <div v-if="modalErr" class="rounded-md bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-800">
          {{ modalErr }}
        </div>

        <form @submit.prevent="handleSave" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">Nama *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">Email *</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-1">Role Pengguna *</label>
            <select
              v-model="form.role"
              required
              class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm bg-white text-zinc-950"
            >
              <option value="writer">Writer (writer) — Lihat, Buat, Edit, &amp; Hapus Arsip</option>
              <option value="viewer">Viewer (viewer) — Hanya Lihat &amp; Unduh Arsip</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-1">
              Password {{ editingId ? '(Kosongkan jika tidak diubah)' : '*' }}
            </label>
            <input
              v-model="form.password"
              type="password"
              :required="!editingId"
              minlength="6"
              placeholder="Minimal 6 karakter"
              class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm"
            />
          </div>

          <!-- Role-specific Data Access Controls -->
          <div class="rounded-lg border border-slate-200 p-4 space-y-4 bg-white">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-semibold text-zinc-950">Atur Data yang Bisa Dilihat / Diedit</h4>
                <p class="text-xs text-zinc-500">Pilih ikut pengaturan role instansi atau kustomisasi khusus untuk pengguna ini.</p>
              </div>
              <select
                v-model="aclMode"
                class="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium bg-white text-zinc-800"
              >
                <option value="role">Ikuti Pengaturan Role ({{ formatRoleLabel(form.role) }})</option>
                <option value="custom">Kustomisasi Akses Data User Ini</option>
              </select>
            </div>

            <div v-if="aclMode === 'custom'" class="space-y-4 pt-2 border-t border-zinc-200/80">
              <div
                v-if="form.role === 'viewer'"
                class="rounded-md bg-zinc-100 border border-zinc-200 px-3 py-2 text-xs text-zinc-800"
              >
                Role <span class="font-semibold">Viewer</span> hanya bisa diatur modul dan kategori yang boleh <span class="font-semibold">dilihat</span>. Akses buat/edit/hapus dinonaktifkan.
              </div>

              <!-- Module Toggles -->
              <div>
                <div class="text-xs font-medium text-zinc-700 mb-2">Akses Modul &amp; Aksi Data</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    v-for="mod in USER_MODULE_TOGGLES"
                    :key="mod.id"
                    :class="[
                      form.role === 'viewer' && mod.writeOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                      'flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700'
                    ]"
                  >
                    <input
                      type="checkbox"
                      :checked="isModuleEnabled(mod.perms)"
                      :disabled="form.role === 'viewer' && mod.writeOnly"
                      @change="toggleUserModule(mod.perms, ($event.target as HTMLInputElement).checked)"
                      class="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950"
                    />
                    <span>{{ mod.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Viewable Category Scope -->
              <div class="space-y-2">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span class="text-xs font-semibold text-slate-700">Kategori Data yang Dapat Dilihat</span>
                  <select
                    v-model="viewScopeMode"
                    class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs bg-white text-slate-800"
                  >
                    <option value="all">Semua Kategori Instansi</option>
                    <option value="custom">Pilih Kategori Tertentu</option>
                  </select>
                </div>
                <div
                  v-if="viewScopeMode === 'custom'"
                  class="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-white p-3 max-h-40 overflow-y-auto"
                >
                  <label
                    v-for="k in kategoris"
                    :key="`u-view-${k.id}`"
                    class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
                  >
                    <input v-model="customViewKategoriIds" type="checkbox" :value="k.id" class="rounded border-zinc-300 text-zinc-900" />
                    <span class="inline-flex items-center gap-1.5">
                      <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: k.color }"></span>
                      <span>{{ k.nama }}</span>
                    </span>
                  </label>
                </div>
              </div>

              <!-- Editable Category Scope (Writer only) -->
              <div v-if="form.role === 'writer'" class="space-y-2">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span class="text-xs font-semibold text-zinc-700">Kategori Data yang Dapat Diedit / Dihapus</span>
                  <select
                    v-model="editScopeMode"
                    class="rounded-md border border-zinc-200 px-2.5 py-1 text-xs bg-white text-zinc-800"
                  >
                    <option value="all">Semua Kategori yang Dapat Dilihat</option>
                    <option value="custom">Pilih Kategori Tertentu</option>
                  </select>
                </div>
                <div
                  v-if="editScopeMode === 'custom'"
                  class="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-md border border-zinc-200 bg-white p-3 max-h-40 overflow-y-auto"
                >
                  <label
                    v-for="k in selectableEditKategoris"
                    :key="`u-edit-${k.id}`"
                    class="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer"
                  >
                    <input v-model="customEditKategoriIds" type="checkbox" :value="k.id" class="rounded border-zinc-300 text-zinc-900" />
                    <span class="inline-flex items-center gap-1.5">
                      <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: k.color }"></span>
                      <span>{{ k.nama }}</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              @click="modalOpen = false"
              class="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex h-9 items-center justify-center rounded-md bg-[#1d4ed8] px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-[#1e40af] disabled:opacity-50 transition-colors"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DEFAULT_ROLE_PERMISSIONS,
  buildPermissionsWithScopes,
  extractBasePermissions,
  extractScopeIds,
  formatRoleLabel,
  normalizeRole,
  sanitizePermissionsForRole
} from '~/composables/useArsipApp'
import type { ProfileRecord } from '~/types/arsip'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const USER_MODULE_TOGGLES = [
  { id: 'view_arsip', label: 'Lihat Daftar & Detail Arsip', perms: ['view_any_arsip', 'view_arsip'], writeOnly: false },
  { id: 'create_arsip', label: 'Buat / Upload Arsip', perms: ['create_arsip'], writeOnly: true },
  { id: 'update_arsip', label: 'Edit Arsip & Versi Baru', perms: ['update_arsip'], writeOnly: true },
  {
    id: 'delete_arsip',
    label: 'Hapus & Pulihkan Arsip (Trash)',
    perms: ['delete_arsip', 'restore_arsip', 'force_delete_arsip'],
    writeOnly: true
  },
  { id: 'view_kategori', label: 'Lihat Fungsi Arsip (Kategori)', perms: ['view_any_kategori'], writeOnly: false },
  {
    id: 'manage_kategori',
    label: 'Kelola Fungsi Arsip (Buat/Edit/Hapus)',
    perms: ['create_kategori', 'update_kategori', 'delete_kategori'],
    writeOnly: true
  },
  { id: 'view_subjek', label: 'Lihat Subjek Arsip', perms: ['view_any_subjek'], writeOnly: false },
  {
    id: 'manage_subjek',
    label: 'Kelola Subjek Arsip (Buat/Edit/Hapus)',
    perms: ['create_subjek', 'update_subjek', 'delete_subjek'],
    writeOnly: true
  }
]

const app = useArsipApp()
const { users, roles, kategoris, currentUser, currentInstansi } = app

const modalOpen = ref(false)
const saving = ref(false)
const statusMsg = ref('')
const modalErr = ref('')
const editingId = ref<string | null>(null)
const form = reactive({
  name: '',
  email: '',
  role: 'writer' as 'writer' | 'viewer',
  password: ''
})

const aclMode = ref<'role' | 'custom'>('role')
const customBasePerms = ref<string[]>([...DEFAULT_ROLE_PERMISSIONS.writer])
const viewScopeMode = ref<'all' | 'custom'>('all')
const customViewKategoriIds = ref<number[]>([])
const editScopeMode = ref<'all' | 'custom'>('all')
const customEditKategoriIds = ref<number[]>([])

const selectableEditKategoris = computed(() => {
  if (viewScopeMode.value === 'all') return kategoris.value
  return kategoris.value.filter((k) => customViewKategoriIds.value.includes(k.id))
})

watch(
  () => form.role,
  (nextRole) => {
    if (nextRole === 'viewer') {
      customBasePerms.value = sanitizePermissionsForRole('viewer', customBasePerms.value)
    } else if (nextRole === 'writer' && customBasePerms.value.length === 0) {
      customBasePerms.value = [...DEFAULT_ROLE_PERMISSIONS.writer]
    }
  }
)

onMounted(async () => {
  await app.init()
})

function roleBadgeClass(role?: string | null): string {
  const norm = normalizeRole(role)
  if (norm === 'admin') return 'bg-[#1d4ed8] text-white'
  if (norm === 'writer') return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200'
  return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200'
}

function formatUserScopeSummary(userId: string): string {
  const custom = app.getUserCustomPermissions(userId)
  if (!custom) return 'Default Role'
  const viewCats = extractScopeIds(custom, 'scope_view_kategori:')
  const editCats = extractScopeIds(custom, 'scope_edit_kategori:')
  const parts: string[] = []
  if (viewCats.length > 0) parts.push(`Lihat ${viewCats.length} Kategori`)
  if (editCats.length > 0) parts.push(`Edit ${editCats.length} Kategori`)
  if (parts.length === 0) {
    return `Kustom (${extractBasePermissions(custom).length} modul)`
  }
  return `Kustom: ${parts.join(' · ')}`
}

function isModuleEnabled(perms: string[]): boolean {
  return perms.some((p) => customBasePerms.value.includes(p))
}

function toggleUserModule(perms: string[], checked: boolean) {
  const set = new Set(customBasePerms.value)
  for (const p of perms) {
    if (checked) set.add(p)
    else set.delete(p)
  }
  customBasePerms.value = Array.from(set)
}

function loadAclDraft(role: 'writer' | 'viewer', userId?: string | null) {
  const existing = userId ? app.getUserCustomPermissions(userId) : null
  if (existing) {
    aclMode.value = 'custom'
    customBasePerms.value = extractBasePermissions(existing)
    const viewIds = extractScopeIds(existing, 'scope_view_kategori:')
    const editIds = extractScopeIds(existing, 'scope_edit_kategori:')
    viewScopeMode.value = viewIds.length > 0 ? 'custom' : 'all'
    customViewKategoriIds.value = viewIds.length > 0 ? [...viewIds] : kategoris.value.map((k) => k.id)
    editScopeMode.value = editIds.length > 0 ? 'custom' : 'all'
    customEditKategoriIds.value = editIds.length > 0 ? [...editIds] : kategoris.value.map((k) => k.id)
  } else {
    aclMode.value = 'role'
    const roleDefault = roles.value.find((r) => r.name === role)?.permissions || DEFAULT_ROLE_PERMISSIONS[role]
    customBasePerms.value = extractBasePermissions(roleDefault)
    const viewIds = extractScopeIds(roleDefault, 'scope_view_kategori:')
    const editIds = extractScopeIds(roleDefault, 'scope_edit_kategori:')
    viewScopeMode.value = viewIds.length > 0 ? 'custom' : 'all'
    customViewKategoriIds.value = viewIds.length > 0 ? [...viewIds] : kategoris.value.map((k) => k.id)
    editScopeMode.value = editIds.length > 0 ? 'custom' : 'all'
    customEditKategoriIds.value = editIds.length > 0 ? [...editIds] : kategoris.value.map((k) => k.id)
  }
}

function openCreate() {
  modalErr.value = ''
  statusMsg.value = ''
  editingId.value = null
  form.name = ''
  form.email = ''
  form.role = 'writer'
  form.password = ''
  loadAclDraft('writer', null)
  modalOpen.value = true
}

function openEdit(u: ProfileRecord) {
  modalErr.value = ''
  statusMsg.value = ''
  editingId.value = u.id
  form.name = u.name
  form.email = u.email
  const norm = normalizeRole(u.role)
  form.role = norm === 'viewer' ? 'viewer' : 'writer'
  form.password = ''
  loadAclDraft(form.role, u.id)
  modalOpen.value = true
}

async function handleSave() {
  modalErr.value = ''
  if (aclMode.value === 'custom') {
    if (viewScopeMode.value === 'custom' && customViewKategoriIds.value.length === 0) {
      modalErr.value = 'Pilih minimal 1 kategori yang dapat dilihat, atau ubah ke Semua Kategori.'
      return
    }
    if (form.role === 'writer' && editScopeMode.value === 'custom' && customEditKategoriIds.value.length === 0) {
      modalErr.value = 'Pilih minimal 1 kategori yang dapat diedit, atau ubah ke Semua Kategori.'
      return
    }
  }

  saving.value = true
  try {
    let targetId = editingId.value
    if (targetId) {
      await app.updateUser(targetId, {
        name: form.name,
        email: form.email,
        role: form.role,
        password: form.password || undefined
      })
    } else {
      const created = await app.createUser({
        name: form.name,
        email: form.email,
        role: form.role,
        password: form.password || 'password'
      })
      targetId = created.id
    }

    if (targetId) {
      if (aclMode.value === 'role') {
        await app.saveUserCustomPermissions(targetId, null)
      } else {
        const viewIds = viewScopeMode.value === 'custom' ? customViewKategoriIds.value : []
        const editIds =
          form.role === 'writer' && editScopeMode.value === 'custom'
            ? customEditKategoriIds.value.filter((id) => viewIds.length === 0 || viewIds.includes(id))
            : []
        const nextPerms = buildPermissionsWithScopes(customBasePerms.value, viewIds, editIds)
        await app.saveUserCustomPermissions(targetId, nextPerms)
      }
    }

    statusMsg.value = editingId.value
      ? `Data dan akses pengguna ${form.name} berhasil diperbarui.`
      : `Pengguna ${form.name} berhasil ditambahkan ke ${currentInstansi.value?.nama || 'instansi'}.`
    modalOpen.value = false
  } catch (err: any) {
    modalErr.value = err?.message || 'Gagal menyimpan data pengguna.'
  } finally {
    saving.value = false
  }
}

async function handleDelete(id: string) {
  const ok = await app.confirmDialog({
    title: 'Hapus Pengguna Instansi?',
    message: 'Data profil dan hak akses pengguna ini akan dihapus secara permanen dari instansi Anda.',
    confirmText: 'Ya, Hapus Pengguna',
    variant: 'danger'
  })
  if (!ok) return
  await app.deleteUser(id)
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
