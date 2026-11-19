<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Metadata Arsip</h1>
        <p class="text-sm text-gray-500">Ringkasan metadata seluruh arsip aktif dengan ekspor langsung ke Excel (.xlsx).</p>
      </div>
      <button
        type="button"
        @click="exportExcel"
        class="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1e40af] transition-colors"
      >
        Export Excel (.xlsx)
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Cari Judul / Nama File</label>
        <input
          v-model="search"
          type="text"
          placeholder="Cari metadata..."
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Kategori</label>
        <select v-model="filterKategori" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
          <option value="">Semua Kategori</option>
          <option v-for="k in kategoris" :key="k.id" :value="k.id">{{ k.nama }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Subjek</label>
        <select v-model="filterSubjek" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
          <option value="">Semua Subjek</option>
          <option v-for="s in subjeks" :key="s.id" :value="s.id">{{ s.nama }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Dari Tanggal</label>
        <input v-model="createdFrom" type="date" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Sampai Tanggal</label>
        <input v-model="createdUntil" type="date" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Judul</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subjek</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pengunggah</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal Upload</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama File Asli</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Versi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="item in filtered" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-900">{{ item.judul }}</td>
              <td class="px-4 py-3 text-gray-600">{{ app.getKategori(item.kategori_id)?.nama || '-' }}</td>
              <td class="px-4 py-3 text-gray-600">{{ app.getSubjek(item.subjek_id)?.nama || '-' }}</td>
              <td class="px-4 py-3 text-gray-600">{{ app.getUserName(item) }}</td>
              <td class="px-4 py-3 text-gray-600 whitespace-nowrap">{{ formatDateTime(item.created_at) }}</td>
              <td class="px-4 py-3 text-gray-600">
                <div class="inline-flex items-center gap-2">
                  <FileTypeIcon :type="getDocType(item)" size="sm" />
                  <span>{{ item.original_file_name || '-' }}</span>
                </div>
              </td>
              <td class="px-4 py-3 font-semibold text-primary-700">v{{ item.version }}</td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">Tidak ada data metadata.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDocType } from '~/composables/useArsipApp'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const app = useArsipApp()
const { activeArsips, kategoris, subjeks } = app

const search = ref('')
const filterKategori = ref<string | number>('')
const filterSubjek = ref<string | number>('')
const createdFrom = ref('')
const createdUntil = ref('')

onMounted(async () => {
  await app.init()
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return activeArsips.value.filter((a) => {
    if (filterKategori.value !== '' && a.kategori_id !== Number(filterKategori.value)) return false
    if (filterSubjek.value !== '' && a.subjek_id !== Number(filterSubjek.value)) return false
    const dt = (a.created_at || '').slice(0, 10)
    if (createdFrom.value && dt < createdFrom.value) return false
    if (createdUntil.value && dt > createdUntil.value) return false
    if (q) {
      return (
        a.judul.toLowerCase().includes(q) ||
        (a.original_file_name || '').toLowerCase().includes(q)
      )
    }
    return true
  })
})

async function exportExcel() {
  if (!import.meta.client) return
  const XLSX = await import('xlsx')
  const rows = filtered.value.map((a) => ({
    Judul: a.judul,
    Deskripsi: a.deskripsi || '',
    Kategori: app.getKategori(a.kategori_id)?.nama || '-',
    Subjek: app.getSubjek(a.subjek_id)?.nama || '-',
    Pengunggah: app.getUserName(a),
    'Tanggal Upload': formatDateTime(a.created_at),
    'Nama File Asli': a.original_file_name || '-',
    Versi: a.version
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Metadata Arsip')

  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  XLSX.writeFile(workbook, `metadata-arsip-${stamp}.xlsx`)
}

function formatDateTime(iso: string): string {
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

