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
        v-if="confirmModalState.open"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/50 p-4"
        @click.self="resolveConfirmDialog(false)"
      >
        <div
          role="dialog"
          aria-modal="true"
          class="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-lg"
        >
          <div class="flex items-start gap-4">
            <div
              :class="[
                iconWrapperClass,
                'h-10 w-10 rounded-md flex items-center justify-center shrink-0 ring-1 ring-inset'
              ]"
            >
              <!-- Danger: Trash / Exclamation -->
              <svg
                v-if="variant === 'danger'"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.9"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>

              <!-- Warning -->
              <svg
                v-else-if="variant === 'warning'"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.9"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>

              <!-- Success / Restore -->
              <svg
                v-else-if="variant === 'success'"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.9"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <!-- Info -->
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.9"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold text-zinc-950 tracking-tight leading-snug">
                {{ confirmModalState.title }}
              </h3>
              <p class="mt-1.5 text-sm text-zinc-500 leading-relaxed">
                {{ confirmModalState.message }}
              </p>
            </div>
          </div>

          <div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <button
              v-if="confirmModalState.cancelText !== ''"
              type="button"
              @click="resolveConfirmDialog(false)"
              class="w-full sm:w-auto inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 transition-colors"
            >
              {{ confirmModalState.cancelText || 'Batal' }}
            </button>
            <button
              type="button"
              @click="resolveConfirmDialog(true)"
              :class="[
                confirmButtonClass,
                'w-full sm:w-auto inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors'
              ]"
            >
              {{ confirmModalState.confirmText || 'Ya, Lanjutkan' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { confirmModalState, resolveConfirmDialog } = useArsipApp()

const variant = computed(() => confirmModalState.value.variant || 'danger')

const iconWrapperClass = computed(() => {
  switch (variant.value) {
    case 'warning':
      return 'bg-amber-50 text-amber-600 ring-amber-200'
    case 'success':
      return 'bg-emerald-50 text-emerald-600 ring-emerald-200'
    case 'info':
      return 'bg-blue-50 text-blue-600 ring-blue-200'
    default:
      return 'bg-rose-50 text-rose-600 ring-rose-200'
  }
})

const confirmButtonClass = computed(() => {
  switch (variant.value) {
    case 'warning':
      return 'bg-amber-600 hover:bg-amber-700 focus:ring-1 focus:ring-amber-600'
    case 'success':
      return 'bg-emerald-600 hover:bg-emerald-700 focus:ring-1 focus:ring-emerald-600'
    case 'info':
      return 'bg-[#1d4ed8] hover:bg-[#1e40af] focus:ring-1 focus:ring-blue-600'
    default:
      return 'bg-rose-600 hover:bg-rose-700 focus:ring-1 focus:ring-rose-600'
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && confirmModalState.value.open) {
    resolveConfirmDialog(false)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeydown)
  }
})
</script>

