<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Edit Arsip</h1>
        <p class="text-sm text-gray-500">
          Setiap perubahan akan menyimpan versi sebelumnya ke Riwayat Versi (v{{ currentRecord?.version || 1 }}).
        </p>
      </div>
      <NuxtLink
        :to="`/dashboard/arsip/${route.params.id}`"
        class="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        &larr; Kembali ke Detail
      </NuxtLink>
    </div>

    <div v-if="!currentRecord" class="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
      Arsip tidak ditemukan.
    </div>

    <div v-else-if="!app.canEditArsipRecord(currentRecord)" class="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
      <p class="text-sm font-medium text-rose-600">Anda tidak memiliki izin untuk mengedit arsip pada kategori ini.</p>
      <NuxtLink
        to="/dashboard/arsip"
        class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Kembali ke Daftar Arsip
      </NuxtLink>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div v-if="errorMsg" class="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
        {{ errorMsg }}
      </div>

      <section class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 class="text-base font-semibold text-gray-900">Detail Arsip</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Judul Arsip *</label>
          <input
            v-model="form.judul"
            type="text"
            required
            maxlength="255"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            v-model="form.deskripsi"
            rows="3"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          ></textarea>
        </div>
      </section>

      <section class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 class="text-base font-semibold text-gray-900">Klasifikasi &amp; File</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fungsi *</label>
            <select
              v-model="form.kategori_id"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-primary-500 focus:outline-none"
            >
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
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ganti File Arsip (Opsional)</label>
          <p class="text-xs text-gray-500 mb-2">
            File saat ini: <span class="font-medium text-gray-700">{{ currentRecord.original_file_name || currentRecord.file_path }}</span>
          </p>
          <input
            type="file"
            @change="onFileSelected"
            class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 border border-gray-300 rounded-lg p-1.5"
          />
        </div>
      </section>

      <section class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 class="text-base font-semibold text-gray-900">Metadata</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Arsip</label>
          <input
            v-model="form.tanggal_arsip"
            type="date"
            class="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>
      </section>

      <div class="flex items-center justify-end gap-3">
        <NuxtLink
          :to="`/dashboard/arsip/${route.params.id}`"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Batal
        </NuxtLink>
        <button
          type="submit"
          :disabled="saving"
          class="rounded-md bg-[#1d4ed8] px-5 py-2 text-sm font-medium text-white hover:bg-[#1e40af] disabled:opacity-50 transition-colors"
        >
          {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
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

const route = useRoute()
const app = useArsipApp()
const { arsips, kategoris, editableKategoris, subjeks } = app

const currentRecord = computed(() => arsips.value.find((a) => a.id === Number(route.params.id)))

const form = reactive({
  judul: '',
  deskripsi: '',
  kategori_id: '' as string | number,
  subjek_id: '' as string | number,
  tanggal_arsip: ''
})
const newFile = ref<File | null>(null)
const saving = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  await app.init()
  if (currentRecord.value) {
    form.judul = currentRecord.value.judul
    form.deskripsi = currentRecord.value.deskripsi || ''
    form.kategori_id = currentRecord.value.kategori_id ?? ''
    form.subjek_id = currentRecord.value.subjek_id ?? ''
    form.tanggal_arsip = (currentRecord.value.tanggal_arsip || currentRecord.value.created_at || '').slice(0, 10)
  }
})

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  newFile.value = input.files?.[0] || null
}

async function handleSubmit() {
  if (!currentRecord.value) return
  saving.value = true
  errorMsg.value = ''
  try {
    let filePath = currentRecord.value.file_path
    let originalFileName = currentRecord.value.original_file_name
    let fileSize = currentRecord.value.file_size

    if (newFile.value) {
      const uploaded = await app.uploadFile(newFile.value, newFile.value.name, 'arsip', 'arsip')
      filePath = uploaded.path
      originalFileName = uploaded.original_file_name
      fileSize = uploaded.size
    }

    await app.updateArsip(currentRecord.value.id, {
      judul: form.judul,
      deskripsi: form.deskripsi || null,
      kategori_id: form.kategori_id ? Number(form.kategori_id) : null,
      subjek_id: form.subjek_id ? Number(form.subjek_id) : null,
      file_path: filePath,
      original_file_name: originalFileName,
      file_size: fileSize,
      tanggal_arsip: form.tanggal_arsip || null
    })

    await navigateTo(`/dashboard/arsip/${currentRecord.value.id}`)
  } catch (err: any) {
    errorMsg.value = err?.message || 'Gagal memperbarui arsip.'
  } finally {
    saving.value = false
  }
}
</script>

