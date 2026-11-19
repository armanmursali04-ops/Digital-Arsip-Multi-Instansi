<script setup lang="ts">
const app = useArsipApp()
const { settings, companyLogoUrl } = app

const faviconHref = computed(() => (settings.value.logo ? companyLogoUrl.value : '/favicon.ico'))

useHead(() => ({
  title: settings.value.name ? `Digital Arsip — ${settings.value.name}` : 'Digital Arsip Multi-Instansi',
  link: [
    {
      key: 'favicon',
      rel: 'icon',
      href: faviconHref.value
    },
    {
      key: 'shortcut-icon',
      rel: 'shortcut icon',
      href: faviconHref.value
    },
    {
      key: 'apple-touch-icon',
      rel: 'apple-touch-icon',
      href: faviconHref.value
    }
  ]
}))

onMounted(async () => {
  await app.loadPublicSettings()
  await app.init()
})
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-[#1d4ed8] selection:text-white">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ConfirmModal />
    <ActionLoadingModal />
  </div>
</template>

<style>
summary {
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.16);
  border-radius: 4px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.28);
}

/* Clean Enterprise Form & Table Tokens */
.shadcn-admin input[type="text"],
.shadcn-admin input[type="email"],
.shadcn-admin input[type="password"],
.shadcn-admin input[type="date"],
.shadcn-admin input[type="search"],
.shadcn-admin input[type="number"],
.shadcn-admin select,
.shadcn-admin textarea {
  border-color: #cbd5e1;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: #0f172a;
  transition: border-color 120ms ease;
}

.shadcn-admin input[type="text"]:focus,
.shadcn-admin input[type="email"]:focus,
.shadcn-admin input[type="password"]:focus,
.shadcn-admin input[type="date"]:focus,
.shadcn-admin input[type="search"]:focus,
.shadcn-admin input[type="number"]:focus,
.shadcn-admin select:focus,
.shadcn-admin textarea:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 1px #1d4ed8;
  outline: none;
}

.shadcn-admin input[type="checkbox"] {
  accent-color: #1d4ed8;
  border-radius: 0.25rem;
}

.shadcn-admin table thead {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.shadcn-admin table thead th {
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  letter-spacing: 0.01em;
  text-transform: none;
}
</style>
