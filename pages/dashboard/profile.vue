<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-gray-900">Profil Saya</h1>
      <p class="text-sm text-gray-500">Update informasi profil, email, dan password akun Anda.</p>
    </div>

    <div v-if="msg" class="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
      {{ msg }}
    </div>
    <div v-if="errMsg" class="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
      {{ errMsg }}
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <section class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <div>
          <h2 class="text-base font-semibold text-gray-900">Informasi Profil</h2>
          <p class="text-xs text-gray-500">Update informasi profil dan email akun Anda.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Masukkan nama lengkap"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="contoh@email.com"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <div>
          <h2 class="text-base font-semibold text-gray-900">Update Password</h2>
          <p class="text-xs text-gray-500">Pastikan menggunakan password yang kuat untuk keamanan akun Anda.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
          <input
            v-model="form.password"
            type="password"
            minlength="8"
            placeholder="Minimal 8 karakter (opsional)"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
          <input
            v-model="form.passwordConfirmation"
            type="password"
            :required="Boolean(form.password)"
            placeholder="Ketik ulang password baru"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </section>

      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="saving"
          class="rounded-lg bg-[#1d4ed8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:opacity-50"
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

const app = useArsipApp()
const { currentUser } = app

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
})
const saving = ref(false)
const msg = ref('')
const errMsg = ref('')

onMounted(async () => {
  await app.init()
  if (currentUser.value) {
    form.name = currentUser.value.name
    form.email = currentUser.value.email
  }
})

async function handleSave() {
  msg.value = ''
  errMsg.value = ''
  if (form.password && form.password !== form.passwordConfirmation) {
    errMsg.value = 'Konfirmasi password tidak cocok.'
    return
  }
  saving.value = true
  try {
    await app.updateProfile({ name: form.name, email: form.email })
    if (form.password) {
      const res = await app.updatePassword(form.password)
      if (!res.ok) {
        errMsg.value = res.error || 'Gagal memperbarui password.'
        return
      }
      form.password = ''
      form.passwordConfirmation = ''
    }
    msg.value = 'Profil berhasil diperbarui.'
  } finally {
    saving.value = false
  }
}
</script>

