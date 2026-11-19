<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="text-2xl font-bold tracking-tight text-zinc-950">Kelola Instansi / Sekolah</h1>
          <span class="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 tabular-nums shadow-sm">
            {{ instansis.length }}
          </span>
        </div>
        <p class="text-sm text-zinc-500 mt-0.5">
          Daftarkan instansi atau sekolah baru. Setiap instansi memiliki halaman Landing Page unik (<code class="font-mono text-zinc-800">/:slug</code>) dan data arsip yang terisolasi.
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
        <span>Tambah Instansi</span>
      </button>
    </div>

    <div v-if="statusMsg" class="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
      {{ statusMsg }}
    </div>

    <!-- Search -->
    <div class="bg-white rounded-lg border border-zinc-200 shadow-sm p-4">
      <input
        v-model="search"
        type="text"
        placeholder="Cari nama instansi atau slug URL..."
        class="w-full sm:w-96 h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950 placeholder:text-zinc-400"
      />
    </div>

    <!-- Instansi Table -->
    <div class="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-zinc-200 text-sm">
          <thead class="bg-zinc-50/80">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Instansi / Sekolah</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">URL Landing Page</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Admin Instansi</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Total User</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Total Arsip</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Dibuat</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-zinc-500 w-14">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 bg-white">
            <tr v-for="inst in filtered" :key="inst.id" class="hover:bg-zinc-50/80 transition-colors">
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-3">
                  <img
                    :src="app.getInstansiLogoUrl(inst)"
                    :alt="inst.nama"
                    class="h-10 w-10 rounded-lg object-cover border border-zinc-200 bg-white shrink-0"
                  />
                  <div class="min-w-0">
                    <div class="font-semibold text-zinc-950 truncate">{{ inst.nama }}</div>
                    <div class="text-xs text-zinc-500 truncate max-w-xs">{{ inst.slogan || '-' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3.5 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <NuxtLink
                    :to="`/${inst.slug}`"
                    target="_blank"
                    class="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-mono font-medium text-zinc-800 hover:bg-zinc-100"
                    title="Buka Landing Page di tab baru"
                  >
                    <span>/{{ inst.slug }}</span>
                    <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </NuxtLink>
                </div>
              </td>
              <td class="px-4 py-3.5 text-xs">
                <div v-if="adminsOfInstansi(inst.id).length > 0" class="space-y-0.5">
                  <div v-for="adm in adminsOfInstansi(inst.id)" :key="adm.id" class="font-medium text-zinc-800">
                    {{ adm.name }} <span class="text-zinc-400">({{ adm.email }})</span>
                  </div>
                </div>
                <span v-else class="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                  Belum ada Admin
                </span>
              </td>
              <td class="px-4 py-3.5 whitespace-nowrap text-xs text-zinc-700 tabular-nums">
                {{ usersCountOfInstansi(inst.id) }} user
              </td>
              <td class="px-4 py-3.5 whitespace-nowrap text-xs text-zinc-700 tabular-nums">
                {{ arsipsCountOfInstansi(inst.id) }} arsip
              </td>
              <td class="px-4 py-3.5 text-zinc-500 whitespace-nowrap text-xs tabular-nums">
                {{ formatDate(inst.created_at) }}
              </td>
              <td class="px-4 py-3.5 text-right whitespace-nowrap w-14">
                <RowActionMenu
                  :items="[
                    {
                      label: 'Buka Landing Page',
                      to: `/${inst.slug}`,
                      icon: 'view'
                    },
                    {
                      label: 'Edit Instansi',
                      onClick: () => openEdit(inst),
                      icon: 'edit'
                    },
                    {
                      label: 'Hapus Instansi',
                      onClick: () => handleDelete(inst),
                      icon: 'delete',
                      variant: 'danger'
                    }
                  ]"
                />
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="7" class="px-6 py-10 text-center text-zinc-500">
                Belum ada instansi terdaftar. Klik <strong>Tambah Instansi</strong> untuk memulai.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Create / Edit Instansi -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4">
      <div class="bg-white rounded-lg border border-zinc-200 shadow-lg max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 class="text-lg font-semibold text-zinc-950 tracking-tight">
              {{ editingId ? 'Edit Instansi & Landing Page' : 'Tambah Instansi Baru' }}
            </h3>
            <p class="text-xs text-zinc-500 mt-0.5">
              Atur identitas instansi, URL Landing Page unik, serta akun Admin pertama.
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
              <label class="block text-sm font-medium text-zinc-700 mb-1">Nama Instansi / Sekolah *</label>
              <input
                v-model="form.nama"
                type="text"
                required
                placeholder="Contoh: SMA Negeri 1 Nusantara"
                @input="onNamaInput"
                class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">Slug URL Landing Page *</label>
              <div class="flex items-center">
                <span class="inline-flex items-center h-9 px-2.5 rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 text-xs text-zinc-500 font-mono">
                  /
                </span>
                <input
                  v-model="form.slug"
                  type="text"
                  required
                  placeholder="sman-1-nusantara"
                  @input="slugManuallyEdited = true"
                  class="flex-1 h-9 rounded-r-md border border-zinc-200 px-3 py-1.5 text-sm font-mono text-zinc-950"
                />
              </div>
              <p class="text-[11px] text-zinc-500 mt-1">
                Landing page: <code class="font-mono text-zinc-800">/{{ form.slug || 'nama-instansi' }}</code>
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-1">Slogan Instansi</label>
            <input
              v-model="form.slogan"
              type="text"
              placeholder="Contoh: Unggul dalam Prestasi, Tertib dalam Administrasi"
              class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">Judul Hero Landing Page</label>
              <input
                v-model="form.hero_title"
                type="text"
                placeholder="Otomatis mengikuti nama instansi jika dikosongkan"
                class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">Subjudul Hero Landing Page</label>
              <input
                v-model="form.hero_subtitle"
                type="text"
                placeholder="Otomatis mengikuti slogan jika dikosongkan"
                class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950"
              />
            </div>
          </div>

          <!-- Optional Initial Admin Creation when adding new Instansi -->
          <div v-if="!editingId" class="rounded-lg border border-zinc-200 bg-zinc-50/60 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-semibold text-zinc-950">Sekaligus Buat Akun Admin Instansi (Opsional)</h4>
                <p class="text-xs text-zinc-500">Admin ini nantinya dapat mengelola Writer, Viewer, Arsip, dan tampilan Landing Page instansinya.</p>
              </div>
              <input v-model="createAdminNow" type="checkbox" class="rounded border-zinc-300 text-zinc-900" />
            </div>

            <div v-if="createAdminNow" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-200/80">
              <div>
                <label class="block text-xs font-medium text-zinc-700 mb-1">Nama Admin *</label>
                <input
                  v-model="adminDraft.name"
                  type="text"
                  :required="createAdminNow"
                  placeholder="Admin Sekolah"
                  class="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-zinc-700 mb-1">Email Admin *</label>
                <input
                  v-model="adminDraft.email"
                  type="email"
                  :required="createAdminNow"
                  placeholder="admin@sekolah.sch.id"
                  class="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-zinc-700 mb-1">Password Admin *</label>
                <input
                  v-model="adminDraft.password"
                  type="password"
                  :required="createAdminNow"
                  minlength="6"
                  placeholder="Minimal 6 karakter"
                  class="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm"
                />
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
              {{ saving ? 'Menyimpan...' : 'Simpan Instansi' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { slugifyInstansi } from '~/composables/useArsipApp'
import type { InstansiRecord } from '~/types/arsip'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const app = useArsipApp()
const { instansis, allUsers, allArsips } = app

const search = ref('')
const modalOpen = ref(false)
const saving = ref(false)
const statusMsg = ref('')
const modalErr = ref('')
const editingId = ref<number | null>(null)
const slugManuallyEdited = ref(false)

const form = reactive({
  nama: '',
  slug: '',
  slogan: '',
  hero_title: '',
  hero_subtitle: ''
})

const createAdminNow = ref(true)
const adminDraft = reactive({
  name: '',
  email: '',
  password: 'password'
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return instansis.value
  return instansis.value.filter(
    (i) =>
      i.nama.toLowerCase().includes(q) ||
      i.slug.toLowerCase().includes(q) ||
      (i.slogan || '').toLowerCase().includes(q)
  )
})

function adminsOfInstansi(instansiId: number) {
  return allUsers.value.filter(
    (u) => u.role === 'admin' && app.resolveEntityInstansiId('user', u) === instansiId
  )
}

function usersCountOfInstansi(instansiId: number): number {
  return allUsers.value.filter((u) => app.resolveEntityInstansiId('user', u) === instansiId).length
}

function arsipsCountOfInstansi(instansiId: number): number {
  return allArsips.value.filter(
    (a) => !a.deleted_at && app.resolveEntityInstansiId('arsip', a) === instansiId
  ).length
}

function onNamaInput() {
  if (!slugManuallyEdited.value) {
    form.slug = slugifyInstansi(form.nama)
  }
}

function openCreate() {
  modalErr.value = ''
  statusMsg.value = ''
  editingId.value = null
  slugManuallyEdited.value = false
  form.nama = ''
  form.slug = ''
  form.slogan = ''
  form.hero_title = ''
  form.hero_subtitle = ''
  createAdminNow.value = true
  adminDraft.name = ''
  adminDraft.email = ''
  adminDraft.password = 'password'
  modalOpen.value = true
}

function openEdit(inst: InstansiRecord) {
  modalErr.value = ''
  statusMsg.value = ''
  editingId.value = inst.id
  slugManuallyEdited.value = true
  form.nama = inst.nama
  form.slug = inst.slug
  form.slogan = inst.slogan || ''
  form.hero_title = inst.hero_title || ''
  form.hero_subtitle = inst.hero_subtitle || ''
  createAdminNow.value = false
  modalOpen.value = true
}

async function handleSave() {
  modalErr.value = ''
  saving.value = true
  try {
    if (editingId.value) {
      const updated = await app.updateInstansi(editingId.value, {
        nama: form.nama,
        slug: form.slug,
        slogan: form.slogan || null,
        hero_title: form.hero_title || null,
        hero_subtitle: form.hero_subtitle || null
      })
      statusMsg.value = `Instansi "${updated.nama}" (/${updated.slug}) berhasil diperbarui.`
    } else {
      const created = await app.createInstansi({
        nama: form.nama,
        slug: form.slug,
        slogan: form.slogan || null,
        hero_title: form.hero_title || null,
        hero_subtitle: form.hero_subtitle || null
      })
      if (createAdminNow.value && adminDraft.email.trim()) {
        await app.createInstansiAdmin({
          name: adminDraft.name || `Admin ${created.nama}`,
          email: adminDraft.email,
          password: adminDraft.password || 'password',
          instansi_id: created.id
        })
      }
      statusMsg.value = `Instansi "${created.nama}" berhasil dibuat. Landing page tersedia di /${created.slug}.`
    }
    modalOpen.value = false
  } catch (err: any) {
    modalErr.value = err?.message || 'Gagal menyimpan data instansi.'
  } finally {
    saving.value = false
  }
}

async function handleDelete(inst: InstansiRecord) {
  const ok = await app.confirmDialog({
    title: `Hapus Instansi "${inst.nama}"?`,
    message: `Seluruh data arsip, kategori, subjek, dan akun pengguna di dalam instansi "${inst.nama}" (/${inst.slug}) akan ikut dihapus secara permanen.`,
    confirmText: 'Ya, Hapus Instansi',
    variant: 'danger'
  })
  if (!ok) return
  await app.deleteInstansi(inst.id)
  statusMsg.value = `Instansi "${inst.nama}" telah dihapus.`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  await app.init()
})
</script>

