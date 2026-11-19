<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Trash Arsip</h1>
        <p class="text-sm text-gray-500">Arsip yang dihapus sementara dapat dipulihkan atau dihapus permanen.</p>
      </div>
      <div v-if="(canRestoreArsip || canForceDeleteArsip) && selectedIds.length > 0" class="flex items-center gap-2">
        <button
          v-if="canRestoreArsip"
          type="button"
          @click="handleBulkRestore"
          class="rounded-lg bg-[#1d4ed8] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#1e40af] transition-colors"
        >
          Restore Terpilih ({{ selectedIds.length }})
        </button>
        <button
          v-if="canForceDeleteArsip"
          type="button"
          @click="handleBulkForceDelete"
          class="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Hapus Permanen Terpilih ({{ selectedIds.length }})
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Cari Judul</label>
        <input
          v-model="search"
          type="text"
          placeholder="Cari judul arsip..."
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Filter Kategori</label>
        <select v-model="filterKategori" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
          <option value="">Semua Kategori</option>
          <option v-for="k in visibleKategoris" :key="k.id" :value="k.id">{{ k.nama }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Filter Subjek</label>
        <select v-model="filterSubjek" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
          <option value="">Semua Subjek</option>
          <option v-for="s in subjeks" :key="s.id" :value="s.id">{{ s.nama }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Dihapus dari</label>
        <input v-model="deletedFrom" type="date" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Dihapus sampai</label>
        <input v-model="deletedUntil" type="date" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th v-if="canRestoreArsip || canForceDeleteArsip" class="px-4 py-3 text-left w-10">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-primary-600"
                />
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Judul Arsip</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Subjek</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Pengunggah</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal Dihapus</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase w-14">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="item in filtered" :key="item.id" class="hover:bg-gray-50">
              <td v-if="canRestoreArsip || canForceDeleteArsip" class="px-4 py-3">
                <input
                  v-model="selectedIds"
                  type="checkbox"
                  :value="item.id"
                  :disabled="!app.canEditKategoriId(item.kategori_id)"
                  class="rounded border-gray-300 text-primary-600 disabled:opacity-40"
                />
              </td>
              <td class="px-4 py-3 font-medium text-gray-900">
                <NuxtLink :to="`/dashboard/arsip/${item.id}`" class="flex items-center gap-2.5 group">
                  <FileTypeIcon :type="getDocType(item)" size="sm" />
                  <span class="group-hover:text-primary-600 transition-colors">{{ item.judul }}</span>
                </NuxtLink>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  v-if="app.getKategori(item.kategori_id)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium"
                  :style="computeBadgeStyle(app.getKategori(item.kategori_id)?.color)"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full shrink-0"
                    :style="{ backgroundColor: app.getKategori(item.kategori_id)?.color || '#64748b' }"
                  />
                  <span>{{ app.getKategori(item.kategori_id)?.nama }}</span>
                </span>
                <span v-else class="text-xs text-slate-400">-</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                <span
                  v-if="app.getSubjek(item.subjek_id)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium"
                  :style="computeBadgeStyle(app.getSubjek(item.subjek_id)?.color)"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full shrink-0"
                    :style="{ backgroundColor: app.getSubjek(item.subjek_id)?.color || '#64748b' }"
                  />
                  <span>{{ app.getSubjek(item.subjek_id)?.nama }}</span>
                </span>
                <span v-else class="text-xs text-slate-400">-</span>
              </td>
              <td class="px-4 py-3 text-slate-600 hidden lg:table-cell whitespace-nowrap text-xs">{{ app.getUserName(item) }}</td>
              <td class="px-4 py-3 text-slate-500 whitespace-nowrap text-xs tabular-nums">{{ formatDateTime(item.deleted_at) }}</td>
              <td class="px-4 py-3 text-right whitespace-nowrap w-14">
                <RowActionMenu
                  :items="[
                    {
                      label: 'Lihat Detail',
                      to: `/dashboard/arsip/${item.id}`,
                      icon: 'view'
                    },
                    {
                      label: 'Pulihkan Arsip',
                      onClick: () => handleRestore(item.id),
                      icon: 'restore',
                      show: canRestoreArsip && app.canEditKategoriId(item.kategori_id)
                    },
                    {
                      label: 'Hapus Permanen',
                      onClick: () => handleForceDelete(item.id),
                      icon: 'delete',
                      variant: 'danger',
                      show: canForceDeleteArsip && app.canEditKategoriId(item.kategori_id)
                    }
                  ]"
                />
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td :colspan="(canRestoreArsip || canForceDeleteArsip) ? 7 : 6" class="px-6 py-10 text-center text-gray-500">
                Trash Arsip kosong.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computeBadgeStyle, getDocType } from '~/composables/useArsipApp'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const app = useArsipApp()
const { trashedArsips, kategoris, visibleKategoris, subjeks, canRestoreArsip, canForceDeleteArsip } = app

const search = ref('')
const filterKategori = ref<string | number>('')
const filterSubjek = ref<string | number>('')
const deletedFrom = ref('')
const deletedUntil = ref('')
const selectedIds = ref<number[]>([])

onMounted(async () => {
  await app.init()
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return trashedArsips.value
    .filter((a) => {
      if (filterKategori.value !== '' && a.kategori_id !== Number(filterKategori.value)) return false
      if (filterSubjek.value !== '' && a.subjek_id !== Number(filterSubjek.value)) return false
      const delDate = (a.deleted_at || '').slice(0, 10)
      if (deletedFrom.value && delDate < deletedFrom.value) return false
      if (deletedUntil.value && delDate > deletedUntil.value) return false
      if (q && !a.judul.toLowerCase().includes(q)) return false
      return true
    })
    .sort((a, b) => (b.deleted_at || '').localeCompare(a.deleted_at || ''))
})

const allSelected = computed(() => filtered.value.length > 0 && filtered.value.every((a) => selectedIds.value.includes(a.id)))

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = filtered.value.map((a) => a.id)
  }
}

async function handleRestore(id: number) {
  const ok = await app.confirmDialog({
    title: 'Pulihkan Arsip?',
    message: 'Arsip ini akan dikembalikan ke daftar arsip aktif utama.',
    confirmText: 'Ya, Pulihkan',
    variant: 'success'
  })
  if (!ok) return
  await app.restoreArsip(id)
  selectedIds.value = selectedIds.value.filter((x) => x !== id)
}

async function handleForceDelete(id: number) {
  const ok = await app.confirmDialog({
    title: 'Hapus Permanen Arsip?',
    message: 'Tindakan ini akan menghapus data arsip beserta file fisiknya secara permanen dan tidak dapat dibatalkan.',
    confirmText: 'Ya, Hapus Permanen',
    variant: 'danger'
  })
  if (!ok) return
  await app.forceDeleteArsip(id)
  selectedIds.value = selectedIds.value.filter((x) => x !== id)
}

async function handleBulkRestore() {
  const ok = await app.confirmDialog({
    title: 'Pulihkan Arsip Terpilih?',
    message: `Pulihkan ${selectedIds.value.length} arsip terpilih ke daftar utama?`,
    confirmText: 'Ya, Pulihkan Semua',
    variant: 'success'
  })
  if (!ok) return
  for (const id of [...selectedIds.value]) {
    await app.restoreArsip(id)
  }
  selectedIds.value = []
}

async function handleBulkForceDelete() {
  const ok = await app.confirmDialog({
    title: 'Hapus Permanen Arsip Terpilih?',
    message: `Hapus permanen ${selectedIds.value.length} arsip terpilih? File fisik juga akan ikut dihapus.`,
    confirmText: 'Ya, Hapus Permanen',
    variant: 'danger'
  })
  if (!ok) return
  for (const id of [...selectedIds.value]) {
    await app.forceDeleteArsip(id)
  }
  selectedIds.value = []
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

