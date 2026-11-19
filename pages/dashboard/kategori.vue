<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="text-2xl font-bold tracking-tight text-zinc-950">Fungsi Arsip (Kategori)</h1>
          <span class="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 tabular-nums shadow-sm">
            {{ filtered.length }}
          </span>
        </div>
        <p class="text-sm text-zinc-500 mt-0.5">Kelola klasifikasi fungsi arsip beserta warna badge visual.</p>
      </div>
      <div v-if="canDeleteKategori || canCreateKategori" class="flex items-center gap-2">
        <button
          v-if="canDeleteKategori && selectedIds.length > 0"
          type="button"
          @click="handleBulkDelete"
          class="inline-flex h-9 items-center gap-1.5 rounded-md bg-rose-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition-colors"
        >
          Hapus Terpilih ({{ selectedIds.length }})
        </button>
        <button
          v-if="canCreateKategori"
          type="button"
          @click="openCreate"
          class="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#1d4ed8] px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-[#1e40af] transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Buat Fungsi</span>
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-lg border border-zinc-200 shadow-sm p-4">
      <div class="relative w-full sm:w-80">
        <svg
          class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama fungsi arsip..."
          class="w-full h-9 rounded-md border border-zinc-200 pl-9 pr-3 py-1.5 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 focus:outline-none"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-zinc-200 text-sm">
          <thead class="bg-zinc-50/80">
            <tr>
              <th v-if="canDeleteKategori" class="px-4 py-3 text-left w-10">
                <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" class="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950" />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Nama</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Badge</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Deskripsi</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-zinc-500">Dibuat</th>
              <th v-if="canUpdateKategori || canDeleteKategori" class="px-4 py-3 text-right text-xs font-medium text-zinc-500">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 bg-white">
            <tr v-for="item in filtered" :key="item.id" class="hover:bg-zinc-50/80 transition-colors">
              <td v-if="canDeleteKategori" class="px-4 py-3.5">
                <input
                  v-model="selectedIds"
                  type="checkbox"
                  :value="item.id"
                  :disabled="!app.canEditKategoriId(item.id)"
                  class="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 disabled:opacity-40"
                />
              </td>
              <td class="px-4 py-3.5 font-medium text-zinc-950 whitespace-nowrap">{{ item.nama }}</td>
              <td class="px-4 py-3.5 whitespace-nowrap">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium whitespace-nowrap"
                  :style="computeBadgeStyle(item.color)"
                >
                  <span class="h-1.5 w-1.5 rounded-full shrink-0" :style="{ backgroundColor: item.color }"></span>
                  <span>{{ item.nama }}</span>
                </span>
              </td>
              <td class="px-4 py-3.5 text-zinc-600 max-w-md truncate">{{ item.deskripsi || '-' }}</td>
              <td class="px-4 py-3.5 text-zinc-500 whitespace-nowrap tabular-nums">{{ formatDate(item.created_at) }}</td>
              <td v-if="canUpdateKategori || canDeleteKategori" class="px-4 py-3.5 text-right whitespace-nowrap w-14">
                <RowActionMenu
                  :items="[
                    {
                      label: 'Edit Fungsi',
                      onClick: () => openEdit(item),
                      icon: 'edit',
                      show: canUpdateKategori && app.canEditKategoriId(item.id)
                    },
                    {
                      label: 'Hapus Fungsi',
                      onClick: () => handleDelete(item.id),
                      icon: 'delete',
                      variant: 'danger',
                      show: canDeleteKategori && app.canEditKategoriId(item.id)
                    }
                  ]"
                />
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td :colspan="4 + (canDeleteKategori ? 1 : 0) + (canUpdateKategori || canDeleteKategori ? 1 : 0)" class="px-6 py-10 text-center text-zinc-500">Belum ada data fungsi arsip.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4">
      <div class="bg-white rounded-lg border border-zinc-200 shadow-lg max-w-md w-full p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 class="text-lg font-semibold text-zinc-950 tracking-tight">{{ editingId ? 'Edit Fungsi Arsip' : 'Buat Fungsi Arsip' }}</h3>
          <button type="button" @click="modalOpen = false" class="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-1">Nama Kategori *</label>
            <input
              v-model="form.nama"
              type="text"
              required
              maxlength="255"
              placeholder="Contoh: Keuangan"
              class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-1">Deskripsi</label>
            <textarea
              v-model="form.deskripsi"
              rows="3"
              placeholder="Keterangan singkat klasifikasi..."
              class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-950 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 focus:outline-none"
            ></textarea>
          </div>
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-zinc-700">Warna Badge *</label>
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium whitespace-nowrap"
                :style="computeBadgeStyle(form.color)"
              >
                <span class="h-1.5 w-1.5 rounded-full shrink-0" :style="{ backgroundColor: form.color }"></span>
                <span>{{ form.nama || 'Contoh Badge' }}</span>
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button
                v-for="preset in ['#0EA5A4', '#2563EB', '#7C3AED', '#F97316', '#DC2626', '#059669', '#0F172A', '#D97706']"
                :key="preset"
                type="button"
                @click="form.color = preset"
                :title="`Pilih warna ${preset}`"
                class="h-7 w-7 rounded-full border transition-transform hover:scale-110 focus:outline-none"
                :class="form.color.toUpperCase() === preset ? 'ring-2 ring-offset-2 ring-zinc-900 border-white scale-105' : 'border-zinc-200'"
                :style="{ backgroundColor: preset }"
              ></button>
              <label class="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer transition-colors">
                <input v-model="form.color" type="color" class="h-5 w-5 border-0 bg-transparent p-0 cursor-pointer" />
                <span>Kustom</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-zinc-100">
            <button type="button" @click="modalOpen = false" class="inline-flex h-9 items-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 transition-colors">Batal</button>
            <button type="submit" class="inline-flex h-9 items-center rounded-md bg-[#1d4ed8] px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-[#1e40af] transition-colors">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computeBadgeStyle } from '~/composables/useArsipApp'
import type { KategoriRecord } from '~/types/arsip'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const app = useArsipApp()
const { visibleKategoris, canCreateKategori, canUpdateKategori, canDeleteKategori } = app

const search = ref('')
const selectedIds = ref<number[]>([])
const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({
  nama: '',
  deskripsi: '',
  color: '#F97316'
})

onMounted(async () => {
  await app.init()
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return visibleKategoris.value
  return visibleKategoris.value.filter(
    (k) => k.nama.toLowerCase().includes(q) || (k.deskripsi || '').toLowerCase().includes(q)
  )
})

const selectableFiltered = computed(() => filtered.value.filter((k) => app.canEditKategoriId(k.id)))
const allSelected = computed(() => selectableFiltered.value.length > 0 && selectableFiltered.value.every((k) => selectedIds.value.includes(k.id)))

function toggleSelectAll() {
  selectedIds.value = allSelected.value ? [] : selectableFiltered.value.map((k) => k.id)
}

function openCreate() {
  editingId.value = null
  form.nama = ''
  form.deskripsi = ''
  form.color = '#F97316'
  modalOpen.value = true
}

function openEdit(item: KategoriRecord) {
  editingId.value = item.id
  form.nama = item.nama
  form.deskripsi = item.deskripsi || ''
  form.color = item.color || '#F97316'
  modalOpen.value = true
}

async function handleSave() {
  if (editingId.value) {
    await app.updateKategori(editingId.value, { ...form })
  } else {
    await app.createKategori({ ...form })
  }
  modalOpen.value = false
}

async function handleDelete(id: number) {
  const ok = await app.confirmDialog({
    title: 'Hapus Fungsi Arsip?',
    message: 'Fungsi arsip (kategori) ini akan dihapus dari daftar klasifikasi.',
    confirmText: 'Ya, Hapus',
    variant: 'danger'
  })
  if (!ok) return
  await app.deleteKategori(id)
  selectedIds.value = selectedIds.value.filter((x) => x !== id)
}

async function handleBulkDelete() {
  const ok = await app.confirmDialog({
    title: 'Hapus Fungsi Terpilih?',
    message: `Hapus ${selectedIds.value.length} fungsi arsip terpilih?`,
    confirmText: 'Ya, Hapus Semua',
    variant: 'danger'
  })
  if (!ok) return
  for (const id of [...selectedIds.value]) {
    await app.deleteKategori(id)
  }
  selectedIds.value = []
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

