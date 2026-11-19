<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="actionLoading"
        role="status"
        aria-live="polite"
        aria-busy="true"
        class="fixed inset-0 z-[110] flex items-center justify-center bg-zinc-950/50 p-4"
      >
        <div class="flex items-center gap-3.5 rounded-lg border border-zinc-200 bg-white px-5 py-4 shadow-lg min-w-[260px] max-w-sm">
          <div class="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <svg class="h-6 w-6 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3.5" />
              <path
                class="opacity-95"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V1.5C6.201 1.5 1.5 6.201 1.5 12H4z"
              />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-zinc-950 truncate">{{ actionLoadingText || 'Memproses...' }}</p>
            <p class="mt-0.5 text-xs text-zinc-500">Mohon tunggu, aplikasi sedang bekerja...</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { actionLoading, actionLoadingText } = useArsipApp()
</script>

