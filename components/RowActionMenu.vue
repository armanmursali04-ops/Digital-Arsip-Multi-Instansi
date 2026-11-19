<template>
  <div v-if="visibleItems.length > 0" class="inline-flex items-center justify-end">
    <button
      ref="triggerRef"
      type="button"
      @click.stop="toggleMenu"
      :aria-expanded="open"
      aria-haspopup="menu"
      aria-label="Menu Aksi"
      class="h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-colors"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
      </svg>
    </button>

    <Teleport to="body">
      <div v-if="open" @click="close" class="fixed inset-0 z-[80]" />
      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="open"
          role="menu"
          :style="menuStyle"
          class="fixed z-[90] w-44 rounded-md border border-zinc-200 bg-white p-1 shadow-md"
        >
          <template v-for="(item, idx) in visibleItems" :key="`${item.label}-${idx}`">
            <NuxtLink
              v-if="item.to"
              :to="item.to"
              role="menuitem"
              @click="close"
              :class="[
                item.variant === 'danger'
                  ? 'text-rose-600 hover:bg-rose-50'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950',
                'flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium transition-colors'
              ]"
            >
              <svg class="w-3.5 h-3.5 shrink-0" :class="item.variant === 'danger' ? 'text-rose-500' : 'text-zinc-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path v-if="item.icon === 'view'" stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path v-if="item.icon === 'view'" stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path v-else-if="item.icon === 'download'" stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                <path v-else-if="item.icon === 'edit'" stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                <path v-else-if="item.icon === 'restore'" stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                <path v-else-if="item.icon === 'delete'" stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
              </svg>
              <span class="truncate">{{ item.label }}</span>
            </NuxtLink>

            <button
              v-else
              type="button"
              role="menuitem"
              @click="handleAction(item)"
              :class="[
                item.variant === 'danger'
                  ? 'text-rose-600 hover:bg-rose-50'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950',
                'w-full text-left flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium transition-colors'
              ]"
            >
              <svg class="w-3.5 h-3.5 shrink-0" :class="item.variant === 'danger' ? 'text-rose-500' : 'text-zinc-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path v-if="item.icon === 'view'" stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path v-if="item.icon === 'view'" stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path v-else-if="item.icon === 'download'" stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                <path v-else-if="item.icon === 'edit'" stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                <path v-else-if="item.icon === 'restore'" stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                <path v-else-if="item.icon === 'delete'" stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
              </svg>
              <span class="truncate">{{ item.label }}</span>
            </button>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
export interface RowActionItem {
  label: string
  to?: string
  onClick?: () => void | Promise<void>
  variant?: 'default' | 'danger'
  icon?: 'view' | 'download' | 'edit' | 'delete' | 'restore'
  show?: boolean
}

const props = defineProps<{
  items: RowActionItem[]
}>()

const visibleItems = computed(() => props.items.filter((i) => i.show !== false))

const triggerRef = ref<HTMLElement | null>(null)
const open = ref(false)
const menuPos = ref<{ top: number; left: number }>({ top: 0, left: 0 })

const menuStyle = computed(() => ({
  top: `${menuPos.value.top}px`,
  left: `${menuPos.value.left}px`
}))

function updatePosition() {
  if (!triggerRef.value || typeof window === 'undefined') return
  const rect = triggerRef.value.getBoundingClientRect()
  const menuWidth = 176
  const estimatedHeight = Math.max(48, visibleItems.value.length * 36 + 12)
  const spaceBelow = window.innerHeight - rect.bottom
  const top = spaceBelow >= estimatedHeight + 12 ? rect.bottom + 6 : Math.max(8, rect.top - estimatedHeight - 6)
  const left = Math.min(Math.max(8, rect.right - menuWidth), window.innerWidth - menuWidth - 8)
  menuPos.value = { top, left }
}

function toggleMenu() {
  if (open.value) {
    open.value = false
    return
  }
  updatePosition()
  open.value = true
}

function close() {
  open.value = false
}

async function handleAction(item: RowActionItem) {
  close()
  if (item.onClick) {
    await item.onClick()
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>
