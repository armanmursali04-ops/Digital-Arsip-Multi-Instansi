<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Buat Arsip</h1>
        <p class="text-sm text-gray-500">Tambahkan dokumen baru ke dalam sistem Digital Arsip.</p>
      </div>
      <NuxtLink to="/dashboard/arsip" class="text-sm font-medium text-gray-600 hover:text-gray-900">
        &larr; Kembali
      </NuxtLink>
    </div>

    <div v-if="errorMsg" class="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
      {{ errorMsg }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Detail Arsip -->
      <section class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <div>
          <h2 class="text-base font-semibold text-gray-900">Detail Arsip</h2>
          <p class="text-xs text-gray-500">Masukkan informasi utama mengenai arsip ini.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Judul Arsip *</label>
          <input
            v-model="form.judul"
            type="text"
            required
            maxlength="255"
            placeholder="Contoh: Laporan Keuangan Tahunan 2026"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            v-model="form.deskripsi"
            rows="3"
            placeholder="Deskripsi singkat mengenai dokumen arsip..."
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          ></textarea>
        </div>
      </section>

      <!-- Klasifikasi & File -->
      <section class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 class="text-base font-semibold text-gray-900">Klasifikasi &amp; File</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fungsi *</label>
            <select
              v-model="form.kategori_id"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-primary-500 focus:outline-none"
            >
              <option disabled value="">Pilih Fungsi Arsip</option>
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
            <p class="text-xs text-gray-400 mt-1">Opsional</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">File Arsip *</label>
          <input
            type="file"
            required
            @change="onFileSelected"
            class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 border border-gray-300 rounded-lg p-1.5"
          />
          <p class="text-xs text-gray-500 mt-1">
            Upload file apapun (DOC, PDF, XLS, JPG, ZIP, MP4, dll). Maksimal 100MB.
          </p>
          <p v-if="selectedFile" class="text-xs font-medium text-primary-700 mt-1">
            Terpilih: {{ selectedFile.name }} ({{ formatBytes(selectedFile.size) }})
          </p>
        </div>
      </section>

      <!-- Metadata -->
      <section class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 class="text-base font-semibold text-gray-900">Metadata</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Arsip *</label>
          <input
            v-model="form.tanggal_arsip"
            type="date"
            required
            :max="todayDate"
            class="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>
      </section>

      <div class="flex items-center justify-end gap-3">
        <NuxtLink
          to="/dashboard/arsip"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Batal
        </NuxtLink>
        <button
          type="submit"
          :disabled="saving"
          class="rounded-lg bg-[#1d4ed8] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1e40af] disabled:opacity-50"
        >
          {{ saving ? 'Menyimpan...' : 'Buat' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const app = useArsipApp()
const { kategoris, editableKategoris, subjeks } = app

const todayDate = new Date().toISOString().slice(0, 10)
const form = reactive({
  judul: '',
  deskripsi: '',
  kategori_id: '' as string | number,
  subjek_id: '' as string | number,
  tanggal_arsip: todayDate
})

const selectedFile = ref<File | null>(null)
const saving = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  await app.init()
})

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  if (file && file.size > 102400 * 1024) {
    errorMsg.value = 'Ukuran file melebihi batas 100MB.'
    selectedFile.value = null
    return
  }
  errorMsg.value = ''
  selectedFile.value = file
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function handleSubmit() {
  if (!selectedFile.value) {
    errorMsg.value = 'Silakan pilih file arsip terlebih dahulu.'
    return
  }
  saving.value = true
  errorMsg.value = ''
  try {
    const uploaded = await app.uploadFile(selectedFile.value, selectedFile.value.name, 'arsip', 'arsip')
    const created = await app.createArsip({
      judul: form.judul,
      deskripsi: form.deskripsi || null,
      kategori_id: form.kategori_id ? Number(form.kategori_id) : null,
      subjek_id: form.subjek_id ? Number(form.subjek_id) : null,
      file_path: uploaded.path,
      original_file_name: uploaded.original_file_name,
      file_size: uploaded.size,
      tanggal_arsip: form.tanggal_arsip,
      created_at: new Date(`${form.tanggal_arsip}T12:00:00`).toISOString()
    })
    await navigateTo(`/dashboard/arsip/${created.id}`)
  } catch (err: any) {
    errorMsg.value = err?.message || 'Gagal menyimpan arsip.'
  } finally {
    saving.value = false
  }
}
</script>

