<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-950">Kustomisasi Landing Page &amp; Profil Instansi</h1>
        <p class="text-sm text-zinc-500 mt-0.5">
          Atur identitas sekolah/instansi, logo, URL portal, serta gambar latar dan teks Hero pada halaman Landing Page unik instansi Anda.
        </p>
      </div>
      <NuxtLink
        v-if="currentInstansi"
        :to="`/${currentInstansi.slug}`"
        target="_blank"
        class="inline-flex h-9 items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-medium text-blue-700 shadow-sm hover:bg-blue-100 shrink-0"
      >
        <span>Lihat Landing Page (/{{ currentInstansi.slug }})</span>
        <span>&nearr;</span>
      </NuxtLink>
    </div>

    <div v-if="savedMsg" class="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
      {{ savedMsg }}
    </div>
    <div v-if="errMsg" class="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
      {{ errMsg }}
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- Profil Instansi -->
      <div class="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-5">
        <div class="border-b border-zinc-100 pb-3">
          <h2 class="text-base font-semibold tracking-tight text-zinc-950">Profil &amp; URL Instansi</h2>
          <p class="text-xs text-zinc-500 mt-0.5">Nama, slug URL portal, slogan, dan logo yang tampil di sidebar serta halaman publik instansi.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-1">Nama Instansi / Sekolah *</label>
            <input
              v-model="form.name"
              type="text"
              required
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
                class="flex-1 h-9 rounded-r-md border border-zinc-200 px-3 py-1.5 text-sm font-mono text-zinc-950"
              />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-1">Slogan Instansi</label>
          <textarea
            v-model="form.slogan"
            rows="2"
            class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-950"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-2">Logo Instansi</label>
          <div class="flex flex-wrap items-center gap-4">
            <img
              :src="previewUrl || companyLogoUrl"
              alt="Preview Logo"
              class="h-20 w-20 rounded-lg object-cover border border-zinc-200 bg-zinc-50 shrink-0"
            />
            <div class="space-y-2">
              <input
                type="file"
                accept="image/*"
                @change="onLogoSelected"
                class="block text-sm text-zinc-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-zinc-200 file:text-xs file:font-medium file:bg-zinc-50 file:text-zinc-900 hover:file:bg-zinc-100"
              />
              <button
                v-if="(settings.logo && !clearLogoFlag) || previewUrl"
                type="button"
                @click="resetLogo"
                class="text-xs font-medium text-rose-600 hover:underline"
              >
                Hapus Logo Kustom
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hero Halaman Landing Page Instansi -->
      <div class="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-5">
        <div class="border-b border-zinc-100 pb-3">
          <h2 class="text-base font-semibold tracking-tight text-zinc-950">
            Hero Halaman Landing Page (/<span class="font-mono">{{ form.slug || currentInstansi?.slug }}</span>)
          </h2>
          <p class="text-xs text-zinc-500 mt-0.5">
            Atur gambar latar belakang, judul utama, dan deskripsi singkat pada banner halaman depan khusus instansi Anda.
          </p>
        </div>

        <!-- Live Preview Hero -->
        <div>
          <span class="block text-xs font-medium text-zinc-600 mb-2">Pratinjau Banner Hero Instansi</span>
          <div class="relative overflow-hidden rounded-lg border border-slate-200 bg-[#0f2342]">
            <img
              :src="heroPreviewSrc"
              alt="Pratinjau Latar Hero"
              class="absolute inset-0 h-full w-full object-cover object-center opacity-25"
            />
            <div class="relative z-10 p-5 sm:p-6 space-y-2 max-w-xl">
              <div class="text-xs font-medium text-slate-300">
                {{ form.name || 'Nama Instansi' }}
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-white leading-snug">
                {{ form.heroTitle || `Pengelolaan Arsip Digital ${form.name || 'Instansi'}` }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-2">
                {{
                  form.heroSubtitle ||
                  form.slogan ||
                  'Simpan, klasifikasikan, dan telusuri dokumen resmi instansi Anda secara cepat, rapi, dan aman.'
                }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-1">Gambar Latar Belakang Hero</label>
          <div class="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*"
              @change="onHeroSelected"
              class="block text-sm text-zinc-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-zinc-200 file:text-xs file:font-medium file:bg-zinc-50 file:text-zinc-900 hover:file:bg-zinc-100"
            />
            <button
              v-if="(heroConfig.image && !clearHeroFlag) || heroPreviewUrl"
              type="button"
              @click="resetHeroImage"
              class="text-xs font-medium text-rose-600 hover:underline"
            >
              Gunakan Gambar Default
            </button>
          </div>
          <p class="text-xs text-zinc-500 mt-1.5">Disarankan gambar lanskap (misalnya 1600x900 px). Bayangan gelap diterapkan otomatis agar teks tetap terbaca jelas.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-1">Judul Hero</label>
          <input
            v-model="form.heroTitle"
            type="text"
            placeholder="Pengelolaan Arsip Digital yang Terstruktur, Aman, dan Mudah Ditelusuri"
            class="w-full h-9 rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-1">Subjudul / Deskripsi Hero</label>
          <textarea
            v-model="form.heroSubtitle"
            rows="3"
            placeholder="Kosongkan untuk menampilkan Slogan Instansi secara otomatis."
            class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-950"
          ></textarea>
        </div>
      </div>

      <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div class="min-w-0">
          <div
            v-if="savedMsg"
            class="inline-flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs sm:text-sm font-medium text-emerald-800"
          >
            <span>{{ savedMsg }}</span>
          </div>
        </div>

        <button
          type="submit"
          :disabled="saving"
          class="inline-flex h-9 items-center justify-center rounded-md bg-[#1d4ed8] px-5 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-[#1e40af] disabled:opacity-50 transition-colors shrink-0 self-end sm:self-auto"
        >
          {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan Instansi' }}
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

const DEFAULT_HERO_FALLBACK =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80'

const app = useArsipApp()
const { currentInstansi, settings, companyLogoUrl, heroConfig, heroImageUrl } = app

const form = reactive({
  name: '',
  slug: '',
  slogan: '',
  heroTitle: '',
  heroSubtitle: ''
})
const selectedLogo = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const clearLogoFlag = ref(false)

const selectedHeroFile = ref<File | null>(null)
const heroPreviewUrl = ref<string | null>(null)
const clearHeroFlag = ref(false)

const saving = ref(false)
const savedMsg = ref('')
const errMsg = ref('')

const heroPreviewSrc = computed(() => {
  if (heroPreviewUrl.value) return heroPreviewUrl.value
  if (clearHeroFlag.value) return DEFAULT_HERO_FALLBACK
  return heroImageUrl.value
})

onMounted(async () => {
  await app.init()
  form.name = currentInstansi.value?.nama || settings.value.name
  form.slug = currentInstansi.value?.slug || ''
  form.slogan = currentInstansi.value?.slogan || settings.value.slogan || ''
  form.heroTitle = currentInstansi.value?.hero_title || heroConfig.value.title || ''
  form.heroSubtitle = currentInstansi.value?.hero_subtitle || heroConfig.value.subtitle || ''
})

function onLogoSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  if (!file) return
  selectedLogo.value = file
  clearLogoFlag.value = false
  previewUrl.value = URL.createObjectURL(file)
}

function resetLogo() {
  selectedLogo.value = null
  previewUrl.value = null
  clearLogoFlag.value = true
}

function onHeroSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  if (!file) return
  selectedHeroFile.value = file
  clearHeroFlag.value = false
  heroPreviewUrl.value = URL.createObjectURL(file)
}

function resetHeroImage() {
  selectedHeroFile.value = null
  heroPreviewUrl.value = null
  clearHeroFlag.value = true
}

async function handleSave() {
  saving.value = true
  savedMsg.value = ''
  errMsg.value = ''
  try {
    let logoPath: string | null | undefined = undefined
    if (clearLogoFlag.value) {
      logoPath = null
    } else if (selectedLogo.value) {
      const uploaded = await app.uploadFile(selectedLogo.value, selectedLogo.value.name, 'settings', 'settings')
      logoPath = uploaded.path
    }

    let heroImagePath: string | null | undefined = undefined
    if (clearHeroFlag.value) {
      heroImagePath = null
    } else if (selectedHeroFile.value) {
      const uploadedHero = await app.uploadFile(selectedHeroFile.value, selectedHeroFile.value.name, 'settings', 'settings')
      heroImagePath = uploadedHero.path
    }

    await app.updateSettings({
      name: form.name,
      slug: form.slug,
      slogan: form.slogan || null,
      logo: logoPath,
      hero: {
        title: form.heroTitle.trim() || `Pengelolaan Arsip Digital ${form.name} yang Terstruktur, Aman, dan Mudah Ditelusuri`,
        subtitle: form.heroSubtitle.trim(),
        image: heroImagePath
      }
    })
    selectedLogo.value = null
    selectedHeroFile.value = null
    clearLogoFlag.value = false
    clearHeroFlag.value = false
    previewUrl.value = null
    heroPreviewUrl.value = null
    savedMsg.value = `Pengaturan dan Landing Page (/${currentInstansi.value?.slug}) berhasil disimpan.`
  } catch (err: any) {
    errMsg.value = err?.message || 'Gagal menyimpan pengaturan.'
  } finally {
    saving.value = false
  }
}
</script>
