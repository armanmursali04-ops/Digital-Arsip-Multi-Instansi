<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-gray-900">Picture to PDF</h1>
      <p class="text-sm text-gray-500">
        Ambil beberapa foto dokumen melalui kamera (atau pilih gambar) lalu gabungkan menjadi satu dokumen PDF siap arsip.
      </p>
    </div>

    <div v-if="errorMsg" class="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
      {{ errorMsg }}
    </div>

    <form @submit.prevent="handleGenerateAndSave" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left 2 columns: Ambil Foto (Repeater) -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-base font-semibold text-gray-900">Ambil Foto ({{ photos.length }})</h2>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="openCameraModal"
                class="inline-flex items-center gap-1.5 rounded-lg bg-[#1d4ed8] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#1e40af]"
              >
                + Ambil Gambar (Kamera)
              </button>
              <label class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                <span>Pilih File Gambar</span>
                <input type="file" accept="image/*" multiple class="hidden" @change="onFilesSelected" />
              </label>
            </div>
          </div>

          <div
            v-if="photos.length === 0"
            class="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center text-sm text-gray-500"
          >
            Belum ada foto yang diambil. Klik <strong>+ Ambil Gambar (Kamera)</strong> atau pilih file gambar.
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="(photo, idx) in photos"
              :key="photo.id"
              class="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
            >
              <img :src="photo.dataUrl" :alt="`Foto ${idx + 1}`" class="w-full aspect-video object-cover" />
              <div class="p-2.5 bg-white flex items-center justify-between border-t border-gray-100">
                <span class="text-xs font-medium text-gray-700">Halaman {{ idx + 1 }}</span>
                <div class="flex items-center gap-2">
                  <button
                    v-if="idx > 0"
                    type="button"
                    @click="movePhoto(idx, -1)"
                    class="text-xs text-gray-500 hover:text-gray-900"
                    title="Geser ke atas"
                  >
                    &uarr;
                  </button>
                  <button
                    v-if="idx < photos.length - 1"
                    type="button"
                    @click="movePhoto(idx, 1)"
                    class="text-xs text-gray-500 hover:text-gray-900"
                    title="Geser ke bawah"
                  >
                    &darr;
                  </button>
                  <button
                    type="button"
                    @click="removePhoto(idx)"
                    class="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 1 column: Detail Dokumen + Petunjuk -->
      <div class="space-y-4">
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 class="text-base font-semibold text-gray-900">Detail Dokumen</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Judul Arsip *</label>
            <input
              v-model="form.judul"
              type="text"
              required
              maxlength="255"
              placeholder="Contoh: Scan Dokumen Kontrak"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fungsi *</label>
            <select
              v-model="form.kategori_id"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-primary-500 focus:outline-none"
            >
              <option disabled value="">Pilih Fungsi</option>
              <option v-for="k in editableKategoris" :key="k.id" :value="k.id">{{ k.nama }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
            <select
              v-model="form.subjek_id"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-primary-500 focus:outline-none"
            >
              <option value="">-- Opsional --</option>
              <option v-for="s in subjeks" :key="s.id" :value="s.id">{{ s.nama }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              v-model="form.deskripsi"
              rows="4"
              placeholder="Catatan tambahan..."
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="saving || photos.length === 0"
            class="w-full rounded-lg bg-[#1d4ed8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1e40af] disabled:opacity-50"
          >
            {{ saving ? 'Mengonversi & Menyimpan PDF...' : 'Simpan ke Arsip (Buat PDF)' }}
          </button>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-1.5">Petunjuk</h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            Ambil foto satu per satu. Gunakan tombol "Ambil Gambar (Kamera)" atau pilih file gambar. Setelah selesai, klik Simpan untuk menggabungkan foto menjadi satu dokumen PDF (A4 Portrait) yang akan disimpan di menu Arsip.
          </p>
        </div>
      </div>
    </form>

    <!-- Camera Modal -->
    <div v-if="cameraModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Kamera Dokumen (16:9)</h3>
          <button type="button" @click="closeCameraModal" class="text-gray-400 hover:text-gray-700 text-2xl leading-none">
            &times;
          </button>
        </div>

        <div v-if="cameraDevices.length > 1" class="flex items-center gap-2">
          <label class="text-xs font-medium text-gray-600">Pilih Kamera:</label>
          <select
            v-model="selectedDeviceId"
            @change="startCameraStream"
            class="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-white"
          >
            <option v-for="dev in cameraDevices" :key="dev.deviceId" :value="dev.deviceId">
              {{ dev.label || `Kamera ${dev.deviceId.slice(0, 6)}` }}
            </option>
          </select>
        </div>

        <div v-if="cameraError" class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {{ cameraError }}
        </div>

        <div class="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
          <video ref="videoEl" autoplay playsinline muted class="w-full h-full object-cover"></video>
        </div>

        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            @click="closeCameraModal"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Tutup
          </button>
          <button
            type="button"
            @click="captureFrame"
            :disabled="Boolean(cameraError)"
            class="rounded-lg bg-[#1d4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:opacity-50"
          >
            Ambil Foto
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface CapturedPhoto {
  id: string
  dataUrl: string
}

const app = useArsipApp()
const { kategoris, editableKategoris, subjeks } = app

const form = reactive({
  judul: '',
  kategori_id: '' as string | number,
  subjek_id: '' as string | number,
  deskripsi: ''
})

const photos = ref<CapturedPhoto[]>([])
const saving = ref(false)
const errorMsg = ref('')

// Camera state
const cameraModalOpen = ref(false)
const cameraDevices = ref<MediaDeviceInfo[]>([])
const selectedDeviceId = ref('')
const cameraError = ref('')
const videoEl = ref<HTMLVideoElement | null>(null)
let activeStream: MediaStream | null = null

onMounted(async () => {
  await app.init()
})

onBeforeUnmount(() => {
  stopCameraStream()
})

function stopCameraStream() {
  if (activeStream) {
    activeStream.getTracks().forEach((t) => t.stop())
    activeStream = null
  }
}

async function openCameraModal() {
  cameraModalOpen.value = true
  cameraError.value = ''
  if (!navigator.mediaDevices?.getUserMedia) {
    cameraError.value = 'Browser Anda tidak mendukung akses kamera atau memerlukan koneksi HTTPS / localhost.'
    return
  }
  await startCameraStream()
  try {
    const allDevices = await navigator.mediaDevices.enumerateDevices()
    cameraDevices.value = allDevices.filter((d) => d.kind === 'videoinput')
    if (!selectedDeviceId.value && cameraDevices.value.length > 0) {
      selectedDeviceId.value = cameraDevices.value[0].deviceId
    }
  } catch {
    // ignore enumerate failure
  }
}

async function startCameraStream() {
  stopCameraStream()
  cameraError.value = ''
  try {
    const constraints: MediaStreamConstraints = {
      video: selectedDeviceId.value
        ? { deviceId: { exact: selectedDeviceId.value }, aspectRatio: 16 / 9 }
        : { facingMode: 'environment', aspectRatio: 16 / 9 },
      audio: false
    }
    activeStream = await navigator.mediaDevices.getUserMedia(constraints)
    await nextTick()
    if (videoEl.value) {
      videoEl.value.srcObject = activeStream
    }
  } catch (err: any) {
    cameraError.value = `Gagal membuka kamera: ${err?.message || 'Izin kamera ditolak.'}`
  }
}

function captureFrame() {
  if (!videoEl.value) return
  const video = videoEl.value
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth || 1280
  canvas.height = video.videoHeight || 720
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
  photos.value.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    dataUrl
  })
  closeCameraModal()
}

function closeCameraModal() {
  stopCameraStream()
  cameraModalOpen.value = false
}

function onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = () => {
      photos.value.push({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        dataUrl: String(reader.result || '')
      })
    }
    reader.readAsDataURL(file)
  }
  input.value = ''
}

function movePhoto(idx: number, delta: number) {
  const target = idx + delta
  if (target < 0 || target >= photos.value.length) return
  const arr = [...photos.value]
  const [item] = arr.splice(idx, 1)
  arr.splice(target, 0, item)
  photos.value = arr
}

function removePhoto(idx: number) {
  photos.value.splice(idx, 1)
}

function loadImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width || 1280, height: img.height || 720 })
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

async function handleGenerateAndSave() {
  if (photos.value.length === 0) {
    errorMsg.value = 'Tidak ada foto yang diambil.'
    return
  }
  saving.value = true
  errorMsg.value = ''
  try {
    // A4 portrait in mm: 210 x 297
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = 210
    const pageH = 297
    const margin = 12

    for (let i = 0; i < photos.value.length; i++) {
      if (i > 0) doc.addPage()
      const photo = photos.value[i]
      const dims = await loadImageDimensions(photo.dataUrl)
      const maxW = pageW - margin * 2
      const maxH = pageH - margin * 2
      const ratio = Math.min(maxW / dims.width, maxH / dims.height)
      const renderW = dims.width * ratio
      const renderH = dims.height * ratio
      const x = (pageW - renderW) / 2
      const y = (pageH - renderH) / 2
      const fmt = photo.dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG'
      doc.addImage(photo.dataUrl, fmt, x, y, renderW, renderH)
    }

    const pdfBlob = doc.output('blob')
    const baseName = (form.judul || 'dokumen-foto').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const originalFileName = `${baseName}.pdf`

    const uploaded = await app.uploadFile(pdfBlob, originalFileName, 'arsip', 'arsip')
    await app.createArsip({
      judul: form.judul || 'Dokumen Foto',
      deskripsi: form.deskripsi || null,
      kategori_id: form.kategori_id ? Number(form.kategori_id) : null,
      subjek_id: form.subjek_id ? Number(form.subjek_id) : null,
      file_path: uploaded.path,
      original_file_name: uploaded.original_file_name,
      file_size: uploaded.size,
      tanggal_arsip: new Date().toISOString().slice(0, 10)
    })

    await navigateTo('/dashboard/arsip')
  } catch (err: any) {
    errorMsg.value = err?.message || 'Gagal mengonversi foto ke PDF.'
  } finally {
    saving.value = false
  }
}
</script>

