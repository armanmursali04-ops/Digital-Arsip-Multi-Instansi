<template>
  <div class="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
    <!-- 404 Not Found State if Slug doesn't exist -->
    <div v-if="app.initialized.value && !instansi" class="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
      <div class="h-11 w-11 rounded bg-[#0f2342] text-white flex items-center justify-center">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 class="text-lg font-bold text-slate-900">Halaman Instansi Tidak Ditemukan</h1>
      <p class="text-xs text-slate-500 max-w-md">
        Alamat portal <span class="font-mono font-semibold text-slate-800">/{{ slug }}</span> belum terdaftar.
      </p>
      <div class="pt-2">
        <NuxtLink
          to="/superadmin-login"
          class="inline-flex h-9 items-center rounded bg-[#1d4ed8] px-4 text-xs font-medium text-white hover:bg-[#1e40af] transition-colors"
        >
          Ke Halaman Login Utama
        </NuxtLink>
      </div>
    </div>

    <!-- Custom Landing Page for this Instansi -->
    <template v-else-if="instansi">
      <!-- Top Navbar -->
      <header class="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <NuxtLink :to="`/${instansi.slug}`" class="flex items-center gap-3 min-w-0">
            <img
              v-if="instansi.logo"
              :src="logoUrl"
              :alt="instansi.nama"
              class="h-9 w-9 rounded object-cover border border-slate-200 bg-white shrink-0"
            />
            <div
              v-else
              class="h-9 w-9 rounded bg-[#1d4ed8] flex items-center justify-center text-white shrink-0"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div class="min-w-0">
              <span class="block text-sm font-bold tracking-tight text-slate-900 truncate">{{ instansi.nama }}</span>
              <span class="block text-[11px] text-slate-500 truncate">{{ instansi.slogan || 'Sistem Arsip Digital' }}</span>
            </div>
          </NuxtLink>

          <div class="flex items-center gap-3 shrink-0">
            <NuxtLink
              :to="isCurrentTenantLoggedIn ? '/dashboard' : `/${instansi.slug}/login`"
              class="inline-flex h-9 items-center gap-2 rounded bg-[#1d4ed8] px-4 text-xs font-medium text-white hover:bg-[#1e40af] transition-colors"
            >
              <span>{{ isCurrentTenantLoggedIn ? 'Buka Dashboard' : 'Masuk Portal' }}</span>
            </NuxtLink>
          </div>
        </div>
      </header>

      <!-- Hero Section (Solid overlay, no fancy gradient) -->
      <section class="relative overflow-hidden bg-[#0f2342] border-b border-slate-200">
        <img
          :src="heroBgUrl"
          :alt="instansi.nama"
          class="absolute inset-0 h-full w-full object-cover object-center opacity-25"
        />

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div class="max-w-3xl space-y-5">
            <div class="text-xs font-medium text-slate-300">
              {{ instansi.nama }}
            </div>

            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug">
              {{
                instansi.hero_title ||
                `Pengelolaan Arsip Digital ${instansi.nama}`
              }}
            </h1>

            <p class="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              {{
                instansi.hero_subtitle ||
                instansi.slogan ||
                `Simpan, klasifikasikan, dan telusuri dokumen resmi ${instansi.nama} secara cepat, rapi, dan aman.`
              }}
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <NuxtLink
                :to="isCurrentTenantLoggedIn ? '/dashboard' : `/${instansi.slug}/login`"
                class="inline-flex h-10 items-center gap-2 rounded bg-[#1d4ed8] px-5 text-xs font-medium text-white hover:bg-[#1e40af] transition-colors"
              >
                <span>{{ isCurrentTenantLoggedIn ? 'Buka Dashboard' : `Masuk Portal ${instansi.nama}` }}</span>
              </NuxtLink>
              <a
                href="#fitur"
                class="inline-flex h-10 items-center gap-2 rounded border border-white/25 bg-white/10 px-5 text-xs font-medium text-white hover:bg-white/15 transition-colors"
              >
                Informasi Sistem
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="fitur" class="py-14 sm:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-2xl">
            <h2 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Layanan Pengelolaan Dokumen {{ instansi.nama }}
            </h2>
            <p class="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Seluruh dokumen dan arsip {{ instansi.nama }} dikelola secara terpisah dan hanya dapat diakses oleh pengguna resmi instansi.
            </p>
          </div>

          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div class="bg-white rounded-lg border border-slate-200 p-5">
              <div class="h-9 w-9 rounded bg-slate-100 border border-slate-200 text-[#1d4ed8] flex items-center justify-center">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 class="mt-3.5 text-sm font-semibold text-slate-900">Penyimpanan Arsip Digital</h3>
              <p class="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Simpan, cari, ekspor metadata ke Excel, dan kelola berbagai format dokumen seperti PDF, Gambar, Office, dan Video.
              </p>
            </div>

            <div class="bg-white rounded-lg border border-slate-200 p-5">
              <div class="h-9 w-9 rounded bg-slate-100 border border-slate-200 text-[#1d4ed8] flex items-center justify-center">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              </div>
              <h3 class="mt-3.5 text-sm font-semibold text-slate-900">Pemindaian Foto ke PDF</h3>
              <p class="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Ambil foto dokumen fisik melalui kamera perangkat atau unggah gambar untuk digabungkan menjadi satu dokumen PDF.
              </p>
            </div>

            <div class="bg-white rounded-lg border border-slate-200 p-5">
              <div class="h-9 w-9 rounded bg-slate-100 border border-slate-200 text-[#1d4ed8] flex items-center justify-center">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="mt-3.5 text-sm font-semibold text-slate-900">Pratinjau Dokumen &amp; QR Code</h3>
              <p class="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Tinjau isi PDF, gambar, video, dan tabel Excel langsung di browser serta bagikan tautan internal dengan QR Code.
              </p>
            </div>

            <div class="bg-white rounded-lg border border-slate-200 p-5">
              <div class="h-9 w-9 rounded bg-slate-100 border border-slate-200 text-[#1d4ed8] flex items-center justify-center">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                </svg>
              </div>
              <h3 class="mt-3.5 text-sm font-semibold text-slate-900">Klasifikasi Fungsi &amp; Subjek</h3>
              <p class="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Pengelompokan dokumen dua tingkat berdasarkan Fungsi Arsip dan Subjek untuk mempermudah pencarian.
              </p>
            </div>

            <div class="bg-white rounded-lg border border-slate-200 p-5">
              <div class="h-9 w-9 rounded bg-slate-100 border border-slate-200 text-[#1d4ed8] flex items-center justify-center">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="mt-3.5 text-sm font-semibold text-slate-900">Riwayat Versi &amp; Log Aktivitas</h3>
              <p class="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Setiap perubahan dokumen tercatat beserta arsip versi sebelumnya untuk menjaga ketertiban administrasi.
              </p>
            </div>

            <div class="bg-white rounded-lg border border-slate-200 p-5">
              <div class="h-9 w-9 rounded bg-slate-100 border border-slate-200 text-[#1d4ed8] flex items-center justify-center">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 class="mt-3.5 text-sm font-semibold text-slate-900">Hak Akses Pengguna</h3>
              <p class="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Pengaturan peran Admin Instansi, Writer, dan Viewer beserta pembatasan akses per kategori dokumen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="mt-auto bg-[#0f2342] text-slate-300 border-t border-[#173058]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="text-sm font-bold text-white">{{ instansi.nama }}</div>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ instansi.slogan || 'Sistem Pengelolaan Arsip Digital' }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <NuxtLink :to="`/${instansi.slug}/login`" class="hover:text-white transition-colors">Masuk Portal</NuxtLink>
            <span>&copy; {{ new Date().getFullYear() }} {{ instansi.nama }}</span>
          </div>
        </div>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const app = useArsipApp()

const slug = computed(() => String(route.params.slug || '').trim().toLowerCase())
const instansi = computed(() => app.getInstansiBySlug(slug.value))
const logoUrl = computed(() => app.getInstansiLogoUrl(instansi.value))
const heroBgUrl = computed(() => app.getInstansiHeroImageUrl(instansi.value))

const isCurrentTenantLoggedIn = computed(() => {
  if (!app.currentUser.value || !instansi.value) return false
  return app.currentInstansiId.value === instansi.value.id
})

useHead(() => ({
  title: instansi.value ? `Digital Arsip — ${instansi.value.nama}` : 'Portal Instansi'
}))

onMounted(async () => {
  await app.loadPublicSettings()
  await app.init()
})
</script>
