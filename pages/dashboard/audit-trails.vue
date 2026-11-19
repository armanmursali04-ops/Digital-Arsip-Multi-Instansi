<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-gray-900">
        {{ isSuperAdmin ? 'Audit Trails Global (Seluruh Instansi)' : `Audit Trails — ${currentInstansi?.nama || 'Instansi'}` }}
      </h1>
      <p class="text-sm text-gray-500">
        {{
          isSuperAdmin
            ? 'Log seluruh aktivitas penambahan instansi, admin, dan arsip di seluruh sistem.'
            : 'Log seluruh aktivitas created, updated, dan deleted di dalam instansi Anda.'
        }}
      </p>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
      <input
        v-model="search"
        type="text"
        placeholder="Cari aktivitas, model, atau nama pengguna..."
        class="w-full sm:w-96 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
      />
      <select
        v-if="isSuperAdmin"
        v-model="filterInstansiId"
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
      >
        <option value="">Semua Instansi</option>
        <option v-for="inst in instansis" :key="inst.id" :value="inst.id">{{ inst.nama }}</option>
      </select>
    </div>

    <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table class="w-full table-fixed divide-y divide-slate-200 text-sm">
        <thead class="bg-white">
          <tr>
            <th class="px-3 py-3 text-left text-xs font-semibold text-slate-600 w-28">Aktivitas</th>
            <th v-if="isSuperAdmin" class="px-2.5 py-3 text-left text-xs font-semibold text-slate-600 w-40">Instansi</th>
            <th class="px-3 py-3 text-left text-xs font-semibold text-slate-600">Model / Data</th>
            <th class="px-2.5 py-3 text-left text-xs font-semibold text-slate-600 w-36 hidden sm:table-cell">Pengguna</th>
            <th class="px-2.5 py-3 text-left text-xs font-semibold text-slate-600 w-36">Waktu</th>
            <th class="px-3 py-3 text-right text-xs font-semibold text-slate-600 w-14">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-for="log in filtered" :key="log.id" class="hover:bg-slate-50/70">
            <td class="px-3 py-3">
              <span :class="[activityBadgeClass(log.description), 'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold']">
                {{ log.description }}
              </span>
            </td>
            <td v-if="isSuperAdmin" class="px-2.5 py-3 text-xs text-slate-600 truncate">
              {{ instansiNameOfLog(log) }}
            </td>
            <td class="px-3 py-3 font-medium text-slate-800 truncate" :title="app.getActivitySubjectName(log)">
              {{ app.getActivitySubjectName(log) }}
            </td>
            <td class="px-2.5 py-3 text-slate-600 text-xs truncate hidden sm:table-cell">{{ log.causer_name || 'System' }}</td>
            <td class="px-2.5 py-3 text-slate-500 text-xs whitespace-nowrap tabular-nums">{{ formatDateTime(log.created_at) }}</td>
            <td class="px-3 py-3 text-right w-14">
              <RowActionMenu
                :items="[
                  {
                    label: 'Lihat Detail',
                    onClick: () => { selectedLog = log },
                    icon: 'view'
                  }
                ]"
              />
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td :colspan="isSuperAdmin ? 6 : 5" class="px-6 py-8 text-center text-slate-500">Belum ada catatan aktivitas.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal (Data Baru vs Data Lama) -->
    <div v-if="selectedLog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-5">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Detail Audit Trail</h3>
          <button type="button" @click="selectedLog = null" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div class="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 text-sm">
          <div>
            <span class="text-xs text-gray-500 block">Aktivitas</span>
            <span class="font-semibold text-gray-900">{{ selectedLog.description }}</span>
          </div>
          <div>
            <span class="text-xs text-gray-500 block">Model / Data</span>
            <span class="font-semibold text-gray-900">{{ app.getActivitySubjectName(selectedLog) }}</span>
          </div>
          <div>
            <span class="text-xs text-gray-500 block">Dilakukan oleh</span>
            <span class="font-semibold text-gray-900">{{ selectedLog.causer_name || 'System' }}</span>
          </div>
          <div>
            <span class="text-xs text-gray-500 block">Waktu</span>
            <span class="font-semibold text-gray-900">{{ formatDateTime(selectedLog.created_at) }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border border-gray-200 rounded-lg p-4">
            <h4 class="text-xs font-semibold text-gray-600 uppercase mb-3">Data Baru</h4>
            <dl
              v-if="selectedLog.properties?.attributes && Object.keys(selectedLog.properties.attributes).length > 0"
              class="space-y-2 text-xs"
            >
              <div
                v-for="(val, key) in selectedLog.properties.attributes"
                :key="`new-${String(key)}`"
                class="flex items-start gap-2"
              >
                <dt class="font-medium text-gray-700 w-32 shrink-0">{{ app.formatFieldLabel(key) }}</dt>
                <dd class="text-gray-900 break-words">{{ app.formatFieldValue(key, val) }}</dd>
              </div>
            </dl>
            <p v-else class="text-xs text-gray-400">Tidak ada data</p>
          </div>
          <div class="border border-gray-200 rounded-lg p-4">
            <h4 class="text-xs font-semibold text-gray-600 uppercase mb-3">Data Lama</h4>
            <dl
              v-if="selectedLog.properties?.old && Object.keys(selectedLog.properties.old).length > 0"
              class="space-y-2 text-xs"
            >
              <div
                v-for="(val, key) in selectedLog.properties.old"
                :key="`old-${String(key)}`"
                class="flex items-start gap-2"
              >
                <dt class="font-medium text-gray-700 w-32 shrink-0">{{ app.formatFieldLabel(key) }}</dt>
                <dd class="text-gray-700 break-words">{{ app.formatFieldValue(key, val) }}</dd>
              </div>
            </dl>
            <p v-else class="text-xs text-gray-400">Tidak ada data</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityLogRecord } from '~/types/arsip'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const app = useArsipApp()
const { activityLogs, isSuperAdmin, instansis, currentInstansi } = app

const search = ref('')
const filterInstansiId = ref<string | number>('')
const selectedLog = ref<ActivityLogRecord | null>(null)

onMounted(async () => {
  await app.init()
})

function instansiNameOfLog(log: ActivityLogRecord): string {
  const tid = app.resolveEntityInstansiId('log', log)
  if (!tid) return 'Global / Platform'
  return app.getInstansiById(tid)?.nama || `Instansi #${tid}`
}

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return activityLogs.value.filter((l) => {
    if (isSuperAdmin.value && filterInstansiId.value !== '') {
      const tid = app.resolveEntityInstansiId('log', l)
      if (tid !== Number(filterInstansiId.value)) return false
    }
    if (!q) return true
    return (
      l.description.toLowerCase().includes(q) ||
      (l.subject_type || '').toLowerCase().includes(q) ||
      (l.causer_name || '').toLowerCase().includes(q)
    )
  })
})

function activityBadgeClass(desc: string): string {
  switch (desc) {
    case 'created':
      return 'bg-emerald-100 text-emerald-700'
    case 'updated':
      return 'bg-amber-100 text-amber-700'
    case 'deleted':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
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
