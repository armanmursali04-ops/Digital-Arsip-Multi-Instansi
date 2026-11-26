<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc] text-slate-900">
    <!-- Left Panel: Solid Corporate Navy -->
    <aside class="hidden lg:flex lg:w-5/12 xl:w-[42%] bg-[#0f2342] border-r border-[#173058] text-white p-10 xl:p-12 flex-col justify-between">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded bg-[#1d4ed8] flex items-center justify-center text-white">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <div>
          <div class="text-sm font-semibold tracking-tight text-white">Digital Arsip</div>
          <div class="text-xs text-slate-400">Pengelolaan Multi-Instansi</div>
        </div>
      </div>

      <div class="space-y-6 my-auto py-8">
        <div class="space-y-3">
          <div class="text-xs font-medium text-slate-400">Panel Administrasi Pusat</div>
          <h1 class="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-snug">
            Pengelolaan Data Instansi &amp; Otoritas Admin
          </h1>
          <p class="text-sm leading-relaxed text-slate-300 max-w-md">
            Gunakan halaman ini untuk mendaftarkan sekolah atau instansi baru, mengatur alamat halaman portal masing-masing instansi, serta menugaskan akun Admin Instansi.
          </p>
        </div>

        <div class="border-t border-[#173058] pt-6 space-y-3 text-xs text-slate-300">
          <div class="flex items-start gap-2.5">
            <span class="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0"></span>
            <span>Pendaftaran instansi baru beserta alamat halaman portal (<code class="font-mono text-white">/:slug</code>)</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0"></span>
            <span>Penugasan akun Admin untuk setiap sekolah atau instansi</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0"></span>
            <span>Pemisahan penuh data arsip dan pengguna antar-instansi</span>
          </div>
        </div>
      </div>

      <div class="text-xs text-slate-400 border-t border-[#173058] pt-5">
        &copy; {{ new Date().getFullYear() }} Digital Arsip
      </div>
    </aside>

    <!-- Right Form Panel -->
    <main class="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12">
      <div class="w-full max-w-md space-y-6">
        <!-- Mobile Header -->
        <div class="lg:hidden flex items-center gap-2.5">
          <div class="h-8 w-8 rounded bg-[#1d4ed8] flex items-center justify-center text-white">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div>
            <div class="text-sm font-bold text-slate-900">Digital Arsip</div>
            <div class="text-xs text-slate-500">Super Admin</div>
          </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
          <div>
            <h2 class="text-lg font-bold tracking-tight text-slate-900">
              Masuk Super Admin
            </h2>
            <p class="mt-1 text-xs text-slate-500">
              Masukkan email dan password Super Admin untuk mengelola instansi.
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
                placeholder="superadmin@digitalarsip.id"
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
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const app = useArsipApp()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const submitting = ref(false)

onMounted(async () => {
  await app.init()
  if (app.currentUser.value && app.isSuperAdmin.value) {
    await router.replace('/dashboard')
  }
})

async function handleSubmit() {
  errorMsg.value = ''
  submitting.value = true
  try {
    const res = await app.loginSuperAdmin(email.value, password.value)
    if (!res.ok) {
      errorMsg.value = res.error || 'Gagal masuk sebagai Super Admin.'
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
