<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <NuxtLink to="/dashboard/arsip" class="text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors">
          &larr; Kembali ke Daftar Arsip
        </NuxtLink>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-950 mt-1">Detail Arsip</h1>
      </div>

      <div v-if="record" class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="openShareModal"
          class="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 transition-colors"
        >
          <span>Bagikan</span>
        </button>
        <button
          type="button"
          @click="handleDownloadMain"
          class="inline-flex h-9 items-center gap-2 rounded bg-[#1d4ed8] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#1e40af] transition-colors"
        >
          <span>Unduh</span>
        </button>
        <NuxtLink
          v-if="app.canEditArsipRecord(record)"
          :to="`/dashboard/arsip/${record.id}/edit`"
          class="inline-flex h-9 items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span>Edit</span>
        </NuxtLink>
      </div>
    </div>

    <div v-if="!record" class="bg-white rounded-lg border border-zinc-200 p-8 text-center text-zinc-500 shadow-sm">
      Arsip tidak ditemukan atau Anda tidak memiliki akses untuk melihat kategori arsip ini.
    </div>

    <div v-else class="p-6 bg-white rounded-lg border border-zinc-200 shadow-sm space-y-6">
      <!-- Header Info & Badges -->
      <div>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-2xl font-bold tracking-tight text-zinc-950">{{ record.judul }}</h2>
          <span class="px-2.5 py-0.5 rounded-md border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-900">
            Versi {{ record.version }}
          </span>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2">
          <FileTypeIcon :type="getDocType(record)" size="sm" />
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border border-zinc-200 text-xs font-medium bg-zinc-50 text-zinc-800">
            {{ record.download_count || 0 }} Unduhan
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border border-zinc-200 text-xs font-medium bg-zinc-50 text-zinc-800">
            {{ record.share_count || 0 }} Dibagikan
          </span>
          <span
            v-if="kategori"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium"
            :style="computeBadgeStyle(kategori.color)"
          >
            <span class="h-1.5 w-1.5 rounded-full shrink-0" :style="{ backgroundColor: kategori.color }"></span>
            <span>{{ kategori.nama }}</span>
          </span>
          <span
            v-if="subjek"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium"
            :style="computeBadgeStyle(subjek.color)"
          >
            <span class="h-1.5 w-1.5 rounded-full shrink-0" :style="{ backgroundColor: subjek.color }"></span>
            <span>{{ subjek.nama }}</span>
          </span>
        </div>

        <p v-if="record.deskripsi" class="text-gray-600 mt-4 text-sm leading-relaxed">
          {{ record.deskripsi }}
        </p>

        <dl class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 bg-white border border-slate-200 rounded-lg p-4 text-sm">
          <div>
            <dt class="text-xs font-medium text-gray-500">Judul Arsip</dt>
            <dd class="mt-0.5 font-semibold text-gray-900">{{ record.judul }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-gray-500">Kategori (Fungsi)</dt>
            <dd class="mt-0.5">
              <span
                v-if="kategori"
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium"
                :style="computeBadgeStyle(kategori.color)"
              >
                <span class="h-1.5 w-1.5 rounded-full shrink-0" :style="{ backgroundColor: kategori.color }"></span>
                <span>{{ kategori.nama }}</span>
              </span>
              <span v-else class="text-gray-700">-</span>
            </dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-gray-500">Subjek</dt>
            <dd class="mt-0.5">
              <span
                v-if="subjek"
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium"
                :style="computeBadgeStyle(subjek.color)"
              >
                <span class="h-1.5 w-1.5 rounded-full shrink-0" :style="{ backgroundColor: subjek.color }"></span>
                <span>{{ subjek.nama }}</span>
              </span>
              <span v-else class="text-gray-700">-</span>
            </dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-gray-500">Nama File</dt>
            <dd class="mt-1 flex items-center gap-2 text-gray-800 break-all">
              <FileTypeIcon :type="getDocType(record)" size="sm" />
              <span>{{ record.original_file_name || record.file_path || '-' }}</span>
            </dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-gray-500">Pengunggah</dt>
            <dd class="mt-0.5 text-gray-800">{{ app.getUserName(record) }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-gray-500">Tanggal Arsip</dt>
            <dd class="mt-0.5 text-gray-800">{{ record.tanggal_arsip || formatDateTime(record.created_at) }}</dd>
          </div>
          <div class="sm:col-span-2 lg:col-span-3">
            <dt class="text-xs font-medium text-gray-500">Deskripsi</dt>
            <dd class="mt-0.5 text-gray-700">{{ record.deskripsi || '-' }}</dd>
          </div>
        </dl>
      </div>

      <!-- In-Browser File Preview (exact logic from view-arsip.blade.php) -->
      <div>
        <div v-if="!fileUrl" class="p-4 bg-red-100 text-red-700 rounded-lg text-sm">
          File tidak ditemukan.
        </div>

        <div v-else-if="ext === 'pdf'" class="border rounded-lg overflow-hidden bg-white">
          <iframe :src="fileUrl" class="w-full h-[750px]" frameborder="0"></iframe>
        </div>

        <div
          v-else-if="['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)"
          class="flex justify-center items-center border rounded-lg overflow-hidden bg-gray-50 p-4"
        >
          <img
            :src="fileUrl"
            :alt="record.judul"
            class="max-h-[75vh] w-auto object-contain rounded-lg shadow-md"
          />
        </div>

        <div v-else-if="ext === 'mp4'" class="border rounded-lg overflow-hidden bg-black">
          <video controls class="w-full max-h-[75vh]" :src="fileUrl"></video>
        </div>

        <div v-else-if="['txt', 'md'].includes(ext)" class="border rounded-lg overflow-hidden p-4 bg-gray-50">
          <pre class="whitespace-pre-wrap text-sm text-gray-800 font-mono overflow-x-auto">{{ textPreview || 'Memuat isi teks...' }}</pre>
        </div>

        <div v-else-if="['xlsx', 'xls'].includes(ext)" class="border rounded-lg overflow-hidden p-4 bg-white">
          <div v-if="fileSize > 5 * 1024 * 1024" class="p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
            <p class="text-base font-semibold mb-1">File terlalu besar untuk ditampilkan.</p>
            <p class="text-sm mb-3">Untuk performa terbaik, silakan unduh file untuk melihatnya.</p>
            <button
              type="button"
              @click="handleDownloadMain"
              class="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 text-sm"
            >
              Unduh File
            </button>
          </div>
          <div v-else class="overflow-x-auto excel-preview" v-html="excelHtml || '<p class=text-sm text-gray-500>Memuat pratinjau Excel...</p>'"></div>
        </div>

        <div v-else class="p-6 bg-gray-100 rounded-lg text-center">
          <p class="text-base font-semibold mb-1 text-gray-900">
            Pratinjau tidak tersedia untuk tipe file ini ({{ ext.toUpperCase() || 'FILE' }}).
          </p>
          <p class="text-sm text-gray-600 mb-4">Anda dapat mengunduh file untuk melihatnya.</p>
          <button
            type="button"
            @click="handleDownloadMain"
            class="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 text-sm"
          >
            Unduh File
          </button>
        </div>
      </div>

      <!-- Riwayat Versi (5 per page) -->
      <div class="pt-4 border-t border-gray-200">
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Riwayat Versi</h3>

        <div
          v-if="recordVersions.length === 0"
          class="flex flex-col items-center justify-center p-8 text-center bg-gray-50 border border-gray-200 rounded-lg"
        >
          <p class="text-base font-medium text-gray-900">Belum ada riwayat versi</p>
          <p class="text-sm text-gray-500 mt-1">Setiap pembaruan pada arsip ini akan dicatat di sini.</p>
        </div>

        <div v-else class="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table class="w-full table-fixed divide-y divide-slate-200 text-sm">
            <thead class="bg-white">
              <tr>
                <th class="px-3 py-3 text-left text-xs font-semibold text-slate-600 w-20">Versi</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-slate-600">Judul &amp; File</th>
                <th class="px-2.5 py-3 text-left text-xs font-semibold text-slate-600 w-36 hidden sm:table-cell">Diubah oleh</th>
                <th class="px-2.5 py-3 text-left text-xs font-semibold text-slate-600 w-36">Tanggal Versi</th>
                <th class="px-3 py-3 text-right text-xs font-semibold text-slate-600 w-20">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="v in pagedVersions" :key="v.id" class="hover:bg-slate-50/70">
                <td class="px-3 py-3">
                  <span class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded border border-slate-200 bg-white text-[#1d4ed8]">
                    v{{ v.version }}
                  </span>
                </td>
                <td class="px-3 py-3 min-w-0">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <FileTypeIcon :file-name="v.original_file_name || v.file_path" :show-label="false" size="sm" />
                    <div class="min-w-0 flex-1">
                      <div class="font-medium text-slate-900 truncate">{{ v.judul }}</div>
                      <div class="text-xs text-slate-500 truncate">{{ v.original_file_name || v.file_path }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-2.5 py-3 text-xs text-slate-600 truncate hidden sm:table-cell">{{ app.getUserName(v) }}</td>
                <td class="px-2.5 py-3 text-xs text-slate-500 whitespace-nowrap tabular-nums">{{ formatDateTime(v.created_at) }}</td>
                <td class="px-3 py-3 text-right">
                  <button
                    type="button"
                    @click="app.downloadFile(v.file_path, v.original_file_name)"
                    class="text-xs font-semibold text-[#1d4ed8] hover:underline"
                  >
                    Unduh
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="px-4 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Menampilkan {{ pagedVersions.length }} dari {{ recordVersions.length }} versi</span>
            <div class="flex gap-2">
              <button type="button" :disabled="versionPage <= 1" @click="versionPage--" class="px-2.5 py-1 rounded border border-slate-200 bg-white disabled:opacity-40">Prev</button>
              <button type="button" :disabled="versionPage >= versionTotalPages" @click="versionPage++" class="px-2.5 py-1 rounded border border-slate-200 bg-white disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Riwayat Perubahan (Activity Logs, 5 per page) -->
      <div class="pt-4 border-t border-gray-200">
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Riwayat Perubahan</h3>
        <div v-if="recordActivities.length === 0" class="text-sm text-gray-500">
          Belum ada riwayat untuk arsip ini.
        </div>
        <div v-else class="space-y-3">
          <article
            v-for="act in pagedActivities"
            :key="act.id"
            class="bg-gray-50 border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <h4 class="font-semibold text-sm text-gray-900 capitalize">{{ act.description }}</h4>
                <p class="text-xs text-gray-500 mt-0.5">
                  oleh <span class="font-medium text-gray-700">{{ act.causer_name || 'System' }}</span>
                </p>
              </div>
              <div class="text-xs text-gray-400">{{ formatDateTime(act.created_at) }}</div>
            </div>

            <div v-if="act.properties?.attributes || act.properties?.old" class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div
                v-for="(val, key) in (act.properties.attributes || act.properties.old || {})"
                :key="String(key)"
                class="flex items-start gap-2"
              >
                <span class="font-medium text-gray-700 w-36 shrink-0">{{ app.formatFieldLabel(key) }}</span>
                <span class="text-gray-600">
                  <del v-if="act.properties.old && act.properties.old[key] !== undefined && act.properties.attributes" class="text-red-500 mr-2">
                    {{ app.formatFieldValue(key, act.properties.old[key]) }}
                  </del>
                  <span>{{ app.formatFieldValue(key, val) }}</span>
                </span>
              </div>
            </div>
          </article>

          <div class="flex items-center justify-between text-xs text-gray-600 pt-2">
            <span>Menampilkan {{ pagedActivities.length }} dari {{ recordActivities.length }} aktivitas</span>
            <div class="flex gap-2">
              <button type="button" :disabled="activityPage <= 1" @click="activityPage--" class="px-2.5 py-1 rounded border bg-white disabled:opacity-40">Prev</button>
              <button type="button" :disabled="activityPage >= activityTotalPages" @click="activityPage++" class="px-2.5 py-1 rounded border bg-white disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Modal (exact port of share-modal.blade.php) -->
    <div v-if="shareModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4">
      <div class="bg-white rounded-lg border border-zinc-200 shadow-lg max-w-2xl w-full p-6 space-y-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-zinc-950 tracking-tight">Bagikan Arsip</h3>
            <p class="text-sm text-zinc-500">
              Bagikan tautan ini dengan rekan yang berwenang — hanya pengguna yang terautentikasi yang dapat mengakses.
            </p>
          </div>
          <button type="button" @click="shareModalOpen = false" class="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 text-xl leading-none">
            &times;
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <label class="text-sm font-medium text-zinc-700">Tautan Arsip</label>
            <div class="mt-2 flex items-stretch">
              <input
                type="text"
                :value="shareUrl"
                readonly
                class="flex-1 rounded-l-md border border-zinc-200 px-3 py-2 text-sm text-zinc-800 bg-zinc-50 focus:outline-none"
              />
              <button
                type="button"
                @click="copyShareUrl"
                class="rounded-r-md bg-[#1d4ed8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e40af] transition-colors"
              >
                {{ copied ? 'Disalin' : 'Salin' }}
              </button>
            </div>
            <p class="mt-2 text-xs text-zinc-500">
              Tautan mengarah ke halaman detail arsip dalam aplikasi.
            </p>
          </div>

          <div class="flex flex-col items-center md:items-end">
            <div class="w-44 h-44 p-2 bg-white rounded-lg border border-zinc-200 flex items-center justify-center">
              <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR Code" class="w-full h-full object-contain" />
            </div>
            <p class="mt-2 text-xs text-zinc-500 text-center md:text-right">
              Pindai QR untuk membuka arsip di perangkat lain.
            </p>
          </div>
        </div>
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

const route = useRoute()
const app = useArsipApp()
const { arsips, versions, activityLogs } = app

const record = computed(() => {
  const found = arsips.value.find((a) => a.id === Number(route.params.id))
  if (!found) return undefined
  if (!app.hasPermission('view_any_arsip') || !app.canViewKategoriId(found.kategori_id)) {
    return undefined
  }
  return found
})
const kategori = computed(() => app.getKategori(record.value?.kategori_id))
const subjek = computed(() => app.getSubjek(record.value?.subjek_id))
const fileUrl = computed(() => app.getFileUrl(record.value?.file_path))
const fileSize = computed(() => (record.value ? app.getFileSize(record.value) : 0))
const ext = computed(() => {
  const name = record.value?.original_file_name || record.value?.file_path || ''
  return (name.split('.').pop() || '').toLowerCase()
})

const textPreview = ref('')
const excelHtml = ref('')
const shareModalOpen = ref(false)
const shareUrl = ref('')
const qrDataUrl = ref('')
const copied = ref(false)

const versionPage = ref(1)
const activityPage = ref(1)

const recordVersions = computed(() =>
  versions.value
    .filter((v) => v.arsip_id === record.value?.id)
    .sort((a, b) => b.version - a.version)
)
const versionTotalPages = computed(() => Math.max(1, Math.ceil(recordVersions.value.length / 5)))
const pagedVersions = computed(() => {
  const start = (versionPage.value - 1) * 5
  return recordVersions.value.slice(start, start + 5)
})

const recordActivities = computed(() =>
  activityLogs.value.filter(
    (l) => l.subject_type === 'Arsip' && String(l.subject_id) === String(record.value?.id)
  )
)
const activityTotalPages = computed(() => Math.max(1, Math.ceil(recordActivities.value.length / 5)))
const pagedActivities = computed(() => {
  const start = (activityPage.value - 1) * 5
  return recordActivities.value.slice(start, start + 5)
})

async function loadPreview() {
  if (!import.meta.client || !fileUrl.value) return
  if (['txt', 'md'].includes(ext.value)) {
    try {
      const res = await fetch(fileUrl.value)
      textPreview.value = await res.text()
    } catch {
      textPreview.value = 'Gagal membaca file teks.'
    }
  } else if (['xlsx', 'xls'].includes(ext.value) && fileSize.value <= 5 * 1024 * 1024) {
    try {
      if (import.meta.client) {
        const XLSX = await import('xlsx')
        const res = await fetch(fileUrl.value)
        const buf = await res.arrayBuffer()
        const wb = XLSX.read(buf, { type: 'array' })
        const sheet = wb.Sheets[wb.SheetNames[0]]
        excelHtml.value = XLSX.utils.sheet_to_html(sheet)
      }
    } catch {
      excelHtml.value = '<p class="text-sm text-red-600">Gagal merender file Excel.</p>'
    }
  }
}

onMounted(async () => {
  await app.init()
  await loadPreview()
})

watch(fileUrl, () => {
  loadPreview()
})

async function handleDownloadMain() {
  if (!record.value) return
  await app.recordDownload(record.value.id)
  await app.downloadFile(record.value.file_path, record.value.original_file_name)
}

async function openShareModal() {
  if (!record.value || !import.meta.client) return
  await app.recordShare(record.value.id)
  shareUrl.value = `${window.location.origin}/dashboard/arsip/${record.value.id}`
  const qrMod = await import('qrcode')
  const QRCode = qrMod.default || qrMod
  qrDataUrl.value = await QRCode.toDataURL(shareUrl.value, { width: 220, margin: 1 })
  copied.value = false
  shareModalOpen.value = true
}

async function copyShareUrl() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => {
      shareModalOpen.value = false
    }, 1000)
  } catch {
    await app.confirmDialog({
      title: 'Gagal Menyalin Tautan',
      message: 'Browser tidak mengizinkan penyalinan otomatis ke clipboard. Silakan salin tautan pada kolom secara manual.',
      confirmText: 'Mengerti',
      cancelText: '',
      variant: 'warning'
    })
  }
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

<style scoped>
.excel-preview :deep(table) {
  @apply min-w-full border-collapse text-xs;
}
.excel-preview :deep(td),
.excel-preview :deep(th) {
  @apply border border-gray-200 px-3 py-1.5 text-left;
}
</style>

