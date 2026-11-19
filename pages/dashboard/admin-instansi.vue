<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="text-2xl font-bold tracking-tight text-zinc-950">Kelola Admin Instansi</h1>
          <span class="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 tabular-nums shadow-sm">
            {{ instansiAdmins.length }}
          </span>
        </div>
        <p class="text-sm text-zinc-500 mt-0.5">
          Kelola akun <span class="font-medium text-zinc-800">Admin Instansi</span> untuk setiap sekolah/instansi. Admin Instansi berwenang menambah user Writer &amp; Viewer serta mengatur tampilan Landing Page instansinya.
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
        <span>Tambah Admin Instansi</span>
      </button>
    </div>

    <div v-if="statusMsg" class="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
      {{ statusMsg }}
    </div>

    <!-- Filter & Search -->
    <div class="bg-white rounded-lg border border-zinc-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
      <input
        v-model="search"
        type="text"
        placeholder="Cari nama atau email admin..."
        class="w-full sm:w-80 h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950 placeholder:text-zinc-400"
      />
      <select
        v-model="filterInstansiId"
        class="h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm bg-white text-zinc-950"
      >
        <option value="">Semua Instansi</option>
        <option v-for="inst in instansis" :key="inst.id" :value="inst.id">{{ inst.nama }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-zinc-200 text-sm">
          <thead class="bg-zinc-50/80">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Nama Admin</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Instansi / Sekolah</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">URL Login Instansi</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Dibuat</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-zinc-500 w-14">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 bg-white">
            <tr v-for="adm in filtered" :key="adm.id" class="hover:bg-zinc-50/80 transition-colors">
              <td class="px-4 py-3.5 font-medium text-zinc-950 whitespace-nowrap">{{ adm.name }}</td>
              <td class="px-4 py-3.5 text-zinc-600 whitespace-nowrap">{{ adm.email }}</td>
              <td class="px-4 py-3.5 whitespace-nowrap">
                <span
                  v-if="instansiOf(adm)"
                  class="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-800"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>{{ instansiOf(adm)?.nama }}</span>
                </span>
                <span v-else class="text-xs text-rose-600">Belum terhubung</span>
              </td>
              <td class="px-4 py-3.5 whitespace-nowrap">
                <NuxtLink
                  v-if="instansiOf(adm)"
                  :to="`/${instansiOf(adm)?.slug}/login`"
                  target="_blank"
                  class="text-xs font-mono text-sky-700 hover:underline"
                >
                  /{{ instansiOf(adm)?.slug }}/login
                </NuxtLink>
                <span v-else class="text-xs text-zinc-400">-</span>
              </td>
              <td class="px-4 py-3.5 text-zinc-500 whitespace-nowrap text-xs tabular-nums">
                {{ formatDate(adm.created_at) }}
              </td>
              <td class="px-4 py-3.5 text-right whitespace-nowrap w-14">
                <RowActionMenu
                  :items="[
                    {
                      label: 'Edit Admin',
                      onClick: () => openEdit(adm),
                      icon: 'edit'
                    },
                    {
                      label: 'Hapus Admin',
                      onClick: () => handleDelete(adm),
                      icon: 'delete',
                      variant: 'danger'
                    }
                  ]"
                />
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-zinc-500">
                Belum ada akun Admin Instansi yang terdaftar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4">
      <div class="bg-white rounded-lg border border-zinc-200 shadow-lg max-w-lg w-full p-6 space-y-5">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 class="text-lg font-semibold text-zinc-950 tracking-tight">
              {{ editingId ? 'Edit Admin Instansi' : 'Tambah Admin Instansi Baru' }}
            </h3>
            <p class="text-xs text-zinc-500 mt-0.5">
              Tugaskan pengguna ini sebagai Admin penuh pada instansi yang dipilih.
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
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-1">Instansi / Sekolah *</label>
            <select
              v-model="form.instansi_id"
              required
              class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm bg-white text-zinc-950"
            >
              <option disabled value="">-- Pilih Instansi --</option>
              <option v-for="inst in instansis" :key="inst.id" :value="inst.id">
                {{ inst.nama }} (/{{ inst.slug }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-1">Nama Lengkap Admin *</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-1">Email Admin *</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="admin@sekolah.sch.id"
              class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950"
            />
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
              class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950"
            />
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
              {{ saving ? 'Menyimpan...' : 'Simpan Admin' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProfileRecord } from '~/types/arsip'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const app = useArsipApp()
const { instansis, instansiAdmins } = app

const search = ref('')
const filterInstansiId = ref<string | number>('')
const modalOpen = ref(false)
const saving = ref(false)
const statusMsg = ref('')
const modalErr = ref('')
const editingId = ref<string | null>(null)

const form = reactive({
  instansi_id: '' as string | number,
  name: '',
  email: '',
  password: ''
})

function instansiOf(user: ProfileRecord) {
  const tid = app.resolveEntityInstansiId('user', user)
  return app.getInstansiById(tid)
}

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return instansiAdmins.value.filter((u) => {
    const tid = app.resolveEntityInstansiId('user', u)
    if (filterInstansiId.value !== '' && tid !== Number(filterInstansiId.value)) return false
    if (q) {
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    }
    return true
  })
})

function openCreate() {
  modalErr.value = ''
  statusMsg.value = ''
  editingId.value = null
  form.instansi_id = instansis.value[0]?.id || ''
  form.name = ''
  form.email = ''
  form.password = ''
  modalOpen.value = true
}

function openEdit(adm: ProfileRecord) {
  modalErr.value = ''
  statusMsg.value = ''
  editingId.value = adm.id
  form.instansi_id = app.resolveEntityInstansiId('user', adm) || ''
  form.name = adm.name
  form.email = adm.email
  form.password = ''
  modalOpen.value = true
}

async function handleSave() {
  modalErr.value = ''
  if (!form.instansi_id) {
    modalErr.value = 'Silakan pilih instansi tujuan terlebih dahulu.'
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await app.updateInstansiAdmin(editingId.value, {
        name: form.name,
        email: form.email,
        instansi_id: Number(form.instansi_id),
        password: form.password || undefined
      })
      statusMsg.value = `Data Admin Instansi ${form.name} berhasil diperbarui.`
    } else {
      await app.createInstansiAdmin({
        name: form.name,
        email: form.email,
        password: form.password || 'password',
        instansi_id: Number(form.instansi_id)
      })
      statusMsg.value = `Admin Instansi ${form.name} berhasil ditambahkan.`
    }
    modalOpen.value = false
  } catch (err: any) {
    modalErr.value = err?.message || 'Gagal menyimpan Admin Instansi.'
  } finally {
    saving.value = false
  }
}

async function handleDelete(adm: ProfileRecord) {
  const ok = await app.confirmDialog({
    title: 'Hapus Admin Instansi?',
    message: `Hapus akun Admin Instansi "${adm.name}" (${adm.email})?`,
    confirmText: 'Ya, Hapus',
    variant: 'danger'
  })
  if (!ok) return
  await app.deleteUser(adm.id)
  statusMsg.value = `Admin Instansi ${adm.name} telah dihapus.`
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

