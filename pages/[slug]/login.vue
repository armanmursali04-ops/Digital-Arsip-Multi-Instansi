<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc] text-slate-900">
    <!-- Left Branding Panel: Solid Corporate Navy -->
    <aside class="hidden lg:flex lg:w-5/12 xl:w-[42%] bg-[#0f2342] border-r border-[#173058] text-white p-10 xl:p-12 flex-col justify-between">
      <div class="flex items-center justify-between">
        <NuxtLink :to="instansi ? `/${instansi.slug}` : '/superadmin-login'" class="inline-flex items-center gap-3">
          <img
            v-if="instansi?.logo"
            :src="logoUrl"
            :alt="instansi.nama"
            class="h-9 w-9 rounded object-cover border border-white/15 bg-white"
          />
          <div
            v-else
            class="h-9 w-9 rounded bg-[#1d4ed8] flex items-center justify-center text-white"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div>
            <div class="text-sm font-semibold tracking-tight text-white">
              {{ instansi?.nama || 'Portal Instansi' }}
            </div>
            <div class="text-xs text-slate-400">Digital Arsip — /{{ slug }}</div>
          </div>
        </NuxtLink>
      </div>

      <div class="space-y-6 my-auto py-8">
        <div class="space-y-3">
          <div class="text-xs font-medium text-slate-400">Portal Pengarsipan Instansi</div>
          <h1 class="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-snug">
            {{ instansi?.nama || 'Ruang Kerja Arsip Instansi' }}
          </h1>
          <p class="text-sm leading-relaxed text-slate-300 max-w-md">
            {{
              instansi?.slogan ||
              'Kelola dokumen resmi sekolah atau instansi secara terstruktur, aman, terklasifikasi, dan mudah ditelusuri.'
            }}
          </p>
        </div>

        <div class="border-t border-[#173058] pt-6 space-y-2.5 text-xs text-slate-300">
          <div class="font-medium text-white">Akses Pengguna Terdaftar</div>
          <p class="text-slate-400 leading-relaxed">
            Hanya akun Admin, Writer, dan Viewer yang terdaftar pada {{ instansi?.nama || 'instansi ini' }} yang dapat mengakses halaman dashboard dan dokumen.
          </p>
        </div>
      </div>

      <div class="text-xs text-slate-400 flex items-center justify-between border-t border-[#173058] pt-5">
        <span>&copy; {{ new Date().getFullYear() }} {{ instansi?.nama || 'Digital Arsip' }}</span>
        <NuxtLink v-if="instansi" :to="`/${instansi.slug}`" class="text-slate-300 hover:text-white transition-colors">
          &larr; Halaman Depan
        </NuxtLink>
      </div>
    </aside>

    <!-- Right Form Panel -->
    <main class="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12">
      <div class="w-full max-w-md space-y-6">
        <!-- Mobile Header -->
        <div class="lg:hidden flex items-center justify-between">
          <NuxtLink :to="instansi ? `/${instansi.slug}` : '/superadmin-login'" class="inline-flex items-center gap-2.5">
            <img
              v-if="instansi?.logo"
              :src="logoUrl"
              :alt="instansi.nama"
              class="h-8 w-8 rounded object-cover border border-slate-200 bg-white"
            />
            <div
              v-else
              class="h-8 w-8 rounded bg-[#1d4ed8] flex items-center justify-center text-white"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <div class="text-sm font-bold text-slate-900">{{ instansi?.nama || 'Digital Arsip' }}</div>
              <div class="text-xs text-slate-500">/{{ slug }}</div>
            </div>
          </NuxtLink>
          <NuxtLink v-if="instansi" :to="`/${instansi.slug}`" class="text-xs font-medium text-slate-600 hover:text-slate-900">
            Halaman Depan
          </NuxtLink>
        </div>

        <div v-if="app.initialized.value && !instansi" class="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 text-center space-y-3">
          <h2 class="text-base font-bold text-slate-900">Instansi Tidak Ditemukan</h2>
          <p class="text-xs text-slate-500">
            Portal dengan alamat <span class="font-mono font-semibold text-slate-800">/{{ slug }}</span> tidak terdaftar.
          </p>
        </div>

        <div v-else class="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
          <div>
            <div class="text-xs font-medium text-[#1d4ed8] mb-1">
              {{ instansi?.nama || slug }}
            </div>
            <h2 class="text-lg font-bold tracking-tight text-slate-900">
              Masuk ke Akun
            </h2>
            <p class="mt-1 text-xs text-slate-500">
              Masukkan email dan password yang terdaftar pada {{ instansi?.nama || 'instansi ini' }}.
            </p>
          </div>

          <div v-if="errorMsg" class="rounded bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-700">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
              <input
                v-model="email"
                type="email"
                required
                placeholder="nama@sekolah.sch.id"
                class="w-full h-9 rounded border border-slate-300 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full h-9 rounded border border-slate-300 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full h-9 rounded bg-[#1d4ed8] px-4 text-sm font-medium text-white hover:bg-[#1e40af] focus:outline-none disabled:opacity-50 transition-colors"
            >
              {{ submitting ? 'Memverifikasi...' : 'Masuk' }}
            </button>
          </form>

          <p class="text-xs text-slate-500 text-center border-t border-slate-100 pt-4">
            Belum memiliki akun? Hubungi Admin {{ instansi?.nama || 'Instansi Anda' }}.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const app = useArsipApp()

const slug = computed(() => String(route.params.slug || '').trim().toLowerCase())
const instansi = computed(() => app.getInstansiBySlug(slug.value))
const logoUrl = computed(() => app.getInstansiLogoUrl(instansi.value))

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const submitting = ref(false)

onMounted(async () => {
  await app.loadPublicSettings()
  await app.init()
  if (app.currentUser.value && instansi.value && app.currentInstansiId.value === instansi.value.id) {
    await router.replace('/dashboard')
  }
})

async function handleSubmit() {
  errorMsg.value = ''
  submitting.value = true
  try {
    const res = await app.loginInstansi(email.value, password.value, slug.value)
    if (!res.ok) {
      errorMsg.value = res.error || 'Gagal melakukan autentikasi.'
      return
    }
    await router.replace('/dashboard')
  } catch (err: any) {
    errorMsg.value = err?.message || 'Terjadi kesalahan saat memproses autentikasi.'
  } finally {
    submitting.value = false
  }
}
</script>
