<template>
  <div class="shadcn-admin min-h-screen bg-white text-slate-900">
    <!-- Mobile Sidebar Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileOpen"
        @click="mobileOpen = false"
        class="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
      ></div>
    </Transition>

    <!-- Solid Corporate Navy Left Sidebar -->
    <aside
      :class="[
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-64',
        'fixed inset-y-0 left-0 z-50 w-64 bg-[#0f2342] text-slate-200 border-r border-[#173058] flex flex-col transition-all duration-150 ease-out'
      ]"
    >
      <!-- Sidebar Brand Header -->
      <div
        :class="[
          isCollapsed ? 'justify-center px-2' : 'justify-between px-4',
          'h-14 flex items-center border-b border-[#173058] shrink-0'
        ]"
      >
        <NuxtLink
          to="/dashboard"
          @click="mobileOpen = false"
          :title="isCollapsed ? (isSuperAdmin ? 'Portal Multi-Instansi' : settings.name || 'Digital Arsip') : undefined"
          :class="['flex items-center min-w-0', isCollapsed ? 'justify-center' : 'gap-2.5']"
        >
          <img
            v-if="!isSuperAdmin && settings.logo"
            :src="companyLogoUrl"
            alt="Logo Instansi"
            class="h-8 w-8 rounded object-cover border border-white/15 shrink-0 bg-white"
          />
          <div
            v-else
            class="h-8 w-8 rounded bg-[#1d4ed8] flex items-center justify-center text-white shrink-0"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div v-if="!isCollapsed" class="min-w-0">
            <div class="font-semibold text-white text-sm tracking-tight truncate leading-tight">
              {{ isSuperAdmin ? 'Super Admin' : 'Digital Arsip' }}
            </div>
            <div class="text-[11px] text-slate-400 truncate mt-0.5">
              {{ isSuperAdmin ? 'Pengelolaan Multi-Instansi' : (settings.name || 'Sistem Arsip Digital') }}
            </div>
          </div>
        </NuxtLink>

        <button
          type="button"
          @click="mobileOpen = false"
          aria-label="Tutup menu"
          class="lg:hidden p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#173058] transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Sidebar Navigation -->
      <nav
        :class="[
          isCollapsed ? 'px-2.5 space-y-2' : 'px-3 space-y-4',
          'sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden py-4 text-sm'
        ]"
      >
        <!-- SUPERADMIN NAVIGATION -->
        <template v-if="isSuperAdmin">
          <div class="space-y-1">
            <div v-if="!isCollapsed" class="px-2.5 pb-1.5 text-[11px] font-medium text-slate-400">
              Menu Utama
            </div>

            <NuxtLink
              to="/dashboard"
              @click="mobileOpen = false"
              title="Dashboard"
              :class="navItemClass('/dashboard', true)"
            >
              <svg
                :class="navIconClass('/dashboard', true)"
                class="w-[18px] h-[18px] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span v-if="!isCollapsed" class="truncate">Dashboard</span>
            </NuxtLink>

            <NuxtLink
              to="/dashboard/instansi"
              @click="mobileOpen = false"
              title="Data Instansi"
              :class="navItemClass('/dashboard/instansi')"
            >
              <span :class="isCollapsed ? 'flex items-center justify-center' : 'flex items-center gap-3 min-w-0'">
                <svg
                  :class="navIconClass('/dashboard/instansi')"
                  class="w-[18px] h-[18px] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
                <span v-if="!isCollapsed" class="truncate">Data Instansi</span>
              </span>
              <span
                v-if="!isCollapsed"
                :class="[
                  isNavActive('/dashboard/instansi') ? 'bg-white/20 text-white' : 'bg-[#173058] text-slate-300',
                  'ml-auto px-1.5 py-0.5 text-[11px] font-medium rounded tabular-nums shrink-0'
                ]"
              >
                {{ instansis.length }}
              </span>
            </NuxtLink>

            <NuxtLink
              to="/dashboard/admin-instansi"
              @click="mobileOpen = false"
              title="Admin Instansi"
              :class="navItemClass('/dashboard/admin-instansi')"
            >
              <span :class="isCollapsed ? 'flex items-center justify-center' : 'flex items-center gap-3 min-w-0'">
                <svg
                  :class="navIconClass('/dashboard/admin-instansi')"
                  class="w-[18px] h-[18px] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span v-if="!isCollapsed" class="truncate">Admin Instansi</span>
              </span>
              <span
                v-if="!isCollapsed"
                :class="[
                  isNavActive('/dashboard/admin-instansi') ? 'bg-white/20 text-white' : 'bg-[#173058] text-slate-300',
                  'ml-auto px-1.5 py-0.5 text-[11px] font-medium rounded tabular-nums shrink-0'
                ]"
              >
                {{ instansiAdmins.length }}
              </span>
            </NuxtLink>

            <NuxtLink
              to="/dashboard/audit-trails"
              @click="mobileOpen = false"
              title="Audit Trails"
              :class="navItemClass('/dashboard/audit-trails')"
            >
              <svg
                :class="navIconClass('/dashboard/audit-trails')"
                class="w-[18px] h-[18px] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span v-if="!isCollapsed" class="truncate">Audit Trails</span>
            </NuxtLink>
          </div>
        </template>

        <!-- INSTANSI NAVIGATION (Admin Instansi, Writer, Viewer) -->
        <template v-else>
          <!-- Menu Utama -->
          <div class="space-y-1">
            <div v-if="!isCollapsed" class="px-2.5 pb-1 text-[11px] font-medium text-slate-400">
              Menu Utama
            </div>

            <NuxtLink
              to="/dashboard"
              @click="mobileOpen = false"
              title="Dashboard"
              :class="navItemClass('/dashboard', true)"
            >
              <svg
                :class="navIconClass('/dashboard', true)"
                class="w-[18px] h-[18px] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span v-if="!isCollapsed" class="truncate">Dashboard</span>
            </NuxtLink>

            <NuxtLink
              v-if="hasPermission('view_any_arsip')"
              to="/dashboard/arsip"
              @click="mobileOpen = false"
              title="Arsip"
              :class="navItemClass('/dashboard/arsip')"
            >
              <span :class="isCollapsed ? 'flex items-center justify-center' : 'flex items-center gap-3 min-w-0'">
                <svg
                  :class="navIconClass('/dashboard/arsip')"
                  class="w-[18px] h-[18px] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
                <span v-if="!isCollapsed" class="truncate">Arsip</span>
              </span>
              <span
                v-if="!isCollapsed"
                :class="[
                  isNavActive('/dashboard/arsip') ? 'bg-white/20 text-white' : 'bg-[#173058] text-slate-300',
                  'ml-auto px-1.5 py-0.5 text-[11px] font-medium rounded tabular-nums shrink-0'
                ]"
              >
                {{ activeArsips.length }}
              </span>
            </NuxtLink>

            <NuxtLink
              v-if="canCreateArsip"
              to="/dashboard/picture-to-pdf"
              @click="mobileOpen = false"
              title="Picture to PDF"
              :class="navItemClass('/dashboard/picture-to-pdf')"
            >
              <svg
                :class="navIconClass('/dashboard/picture-to-pdf')"
                class="w-[18px] h-[18px] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              <span v-if="!isCollapsed" class="truncate">Picture to PDF</span>
            </NuxtLink>

            <NuxtLink
              to="/dashboard/petunjuk-penggunaan"
              @click="mobileOpen = false"
              title="Petunjuk Penggunaan"
              :class="navItemClass('/dashboard/petunjuk-penggunaan')"
            >
              <svg
                :class="navIconClass('/dashboard/petunjuk-penggunaan')"
                class="w-[18px] h-[18px] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span v-if="!isCollapsed" class="truncate">Petunjuk Penggunaan</span>
            </NuxtLink>
          </div>

          <!-- Collapsible Group: Master Data -->
          <div v-if="hasPermission('view_any_kategori') || hasPermission('view_any_subjek') || hasPermission('view_any_arsip') || canRestoreArsip || canForceDeleteArsip">
            <button
              v-if="!isCollapsed"
              type="button"
              @click="groups.manajemen = !groups.manajemen"
              class="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>Master Data</span>
              <svg
                :class="[groups.manajemen ? 'rotate-180' : '', 'w-3.5 h-3.5 transition-transform duration-150']"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-else class="my-2 border-t border-[#173058] mx-2"></div>
            <div v-show="groups.manajemen || isCollapsed" :class="[!isCollapsed ? 'mt-1' : '', 'space-y-1']">
              <NuxtLink
                v-if="hasPermission('view_any_kategori')"
                to="/dashboard/kategori"
                @click="mobileOpen = false"
                title="Fungsi Arsip"
                :class="navItemClass('/dashboard/kategori')"
              >
                <span :class="isCollapsed ? 'flex items-center justify-center' : 'flex items-center gap-3 min-w-0'">
                  <svg
                    :class="navIconClass('/dashboard/kategori')"
                    class="w-[18px] h-[18px] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  </svg>
                  <span v-if="!isCollapsed" class="truncate">Fungsi Arsip</span>
                </span>
                <span
                  v-if="!isCollapsed"
                  :class="[
                    isNavActive('/dashboard/kategori') ? 'bg-white/20 text-white' : 'bg-[#173058] text-slate-300',
                    'ml-auto px-1.5 py-0.5 text-[11px] font-medium rounded tabular-nums shrink-0'
                  ]"
                >
                  {{ visibleKategoris.length }}
                </span>
              </NuxtLink>

              <NuxtLink
                v-if="hasPermission('view_any_subjek')"
                to="/dashboard/subjek"
                @click="mobileOpen = false"
                title="Subjek Arsip"
                :class="navItemClass('/dashboard/subjek')"
              >
                <span :class="isCollapsed ? 'flex items-center justify-center' : 'flex items-center gap-3 min-w-0'">
                  <svg
                    :class="navIconClass('/dashboard/subjek')"
                    class="w-[18px] h-[18px] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                  <span v-if="!isCollapsed" class="truncate">Subjek Arsip</span>
                </span>
                <span
                  v-if="!isCollapsed"
                  :class="[
                    isNavActive('/dashboard/subjek') ? 'bg-white/20 text-white' : 'bg-[#173058] text-slate-300',
                    'ml-auto px-1.5 py-0.5 text-[11px] font-medium rounded tabular-nums shrink-0'
                  ]"
                >
                  {{ subjeks.length }}
                </span>
              </NuxtLink>

              <NuxtLink
                v-if="hasPermission('view_any_arsip')"
                to="/dashboard/metadata"
                @click="mobileOpen = false"
                title="Metadata"
                :class="navItemClass('/dashboard/metadata')"
              >
                <svg
                  :class="navIconClass('/dashboard/metadata')"
                  class="w-[18px] h-[18px] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25" />
                </svg>
                <span v-if="!isCollapsed" class="truncate">Metadata</span>
              </NuxtLink>

              <NuxtLink
                v-if="canRestoreArsip || canForceDeleteArsip"
                to="/dashboard/trash"
                @click="mobileOpen = false"
                title="Trash Arsip"
                :class="[
                  isNavActive('/dashboard/trash')
                    ? 'bg-[#1d4ed8] text-white font-medium'
                    : 'text-rose-300 hover:bg-[#173058] hover:text-rose-200',
                  isCollapsed ? 'flex items-center justify-center p-2 rounded transition-colors' : 'flex items-center justify-between px-2.5 py-2 rounded transition-colors'
                ]"
              >
                <span :class="isCollapsed ? 'flex items-center justify-center' : 'flex items-center gap-3 min-w-0'">
                  <svg class="w-[18px] h-[18px] shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  <span v-if="!isCollapsed" class="truncate">Trash Arsip</span>
                </span>
                <span v-if="!isCollapsed && trashedArsips.length > 0" class="px-1.5 py-0.5 text-[11px] font-medium rounded bg-rose-500/20 text-rose-200 tabular-nums shrink-0">
                  {{ trashedArsips.length }}
                </span>
              </NuxtLink>
            </div>
          </div>

          <!-- Collapsible Group: Pengaturan Instansi -->
          <div v-if="isAdminInstansi || hasPermission('view_audit_trail')">
            <button
              v-if="!isCollapsed"
              type="button"
              @click="groups.settings = !groups.settings"
              class="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>Pengaturan Instansi</span>
              <svg
                :class="[groups.settings ? 'rotate-180' : '', 'w-3.5 h-3.5 transition-transform duration-150']"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-else class="my-2 border-t border-[#173058] mx-2"></div>
            <div v-show="groups.settings || isCollapsed" :class="[!isCollapsed ? 'mt-1' : '', 'space-y-1']">
              <NuxtLink
                v-if="isAdminInstansi"
                to="/dashboard/users"
                @click="mobileOpen = false"
                title="Users Instansi"
                :class="navItemClass('/dashboard/users')"
              >
                <svg
                  :class="navIconClass('/dashboard/users')"
                  class="w-[18px] h-[18px] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span v-if="!isCollapsed" class="truncate">Users Instansi</span>
              </NuxtLink>

              <NuxtLink
                v-if="isAdminInstansi"
                to="/dashboard/roles"
                @click="mobileOpen = false"
                title="Roles & Akses"
                :class="navItemClass('/dashboard/roles')"
              >
                <svg
                  :class="navIconClass('/dashboard/roles')"
                  class="w-[18px] h-[18px] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span v-if="!isCollapsed" class="truncate">Roles &amp; Akses</span>
              </NuxtLink>

              <NuxtLink
                v-if="isAdminInstansi || hasPermission('view_audit_trail')"
                to="/dashboard/audit-trails"
                @click="mobileOpen = false"
                title="Audit Trails"
                :class="navItemClass('/dashboard/audit-trails')"
              >
                <svg
                  :class="navIconClass('/dashboard/audit-trails')"
                  class="w-[18px] h-[18px] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span v-if="!isCollapsed" class="truncate">Audit Trails</span>
              </NuxtLink>

              <NuxtLink
                v-if="isAdminInstansi"
                to="/dashboard/settings"
                @click="mobileOpen = false"
                title="Settings & Landing Page"
                :class="navItemClass('/dashboard/settings')"
              >
                <svg
                  :class="navIconClass('/dashboard/settings')"
                  class="w-[18px] h-[18px] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span v-if="!isCollapsed" class="truncate">Pengaturan &amp; Portal</span>
              </NuxtLink>
            </div>
          </div>
        </template>
      </nav>

      <!-- Sidebar Footer: Account Strip -->
      <div :class="['border-t border-[#173058] bg-[#0c1c36] shrink-0', isCollapsed ? 'p-2.5' : 'p-3']">
        <div :class="isCollapsed ? 'flex flex-col items-center gap-2' : 'flex items-center justify-between gap-2'">
          <NuxtLink
            to="/dashboard/profile"
            @click="mobileOpen = false"
            :title="isCollapsed ? 'Profil Saya' : undefined"
            :class="['flex items-center min-w-0 group rounded p-1.5 hover:bg-[#173058] transition-colors flex-1', isCollapsed ? 'justify-center' : 'gap-2.5']"
          >
            <div class="h-8 w-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center font-medium text-xs shrink-0">
              {{ userInitials }}
            </div>
            <div v-if="!isCollapsed" class="min-w-0">
              <div class="text-xs font-medium text-white truncate">
                {{ currentUser?.name || 'Pengguna' }}
              </div>
              <div class="text-[11px] text-slate-400 truncate">
                {{ formatRoleLabel(currentUser?.role) }}
              </div>
            </div>
          </NuxtLink>
          <button
            type="button"
            @click="handleLogout"
            title="Keluar"
            aria-label="Keluar"
            class="p-2 rounded text-slate-400 hover:text-white hover:bg-[#173058] transition-colors shrink-0"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Column Wrapper -->
    <div
      :class="[
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64',
        'flex flex-col min-h-screen transition-all duration-150 ease-out'
      ]"
    >
      <!-- Sticky Top Header Bar -->
      <header class="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            @click="mobileOpen = true"
            aria-label="Buka menu navigasi"
            class="lg:hidden inline-flex items-center justify-center h-8 w-8 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button
            type="button"
            @click="toggleDesktopSidebar"
            :title="sidebarCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'"
            :aria-label="sidebarCollapsed ? 'Buka sidebar' : 'Tutup sidebar'"
            class="hidden lg:inline-flex items-center justify-center h-8 w-8 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <svg
              v-if="sidebarCollapsed"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5A1.5 1.5 0 0121.75 6.75v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5zM9 5.25v13.5m3.75-8.25l2.25 1.5-2.25 1.5" />
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5A1.5 1.5 0 0121.75 6.75v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5zM9 5.25v13.5m5.25-8.25l-2.25 1.5 2.25 1.5" />
            </svg>
          </button>

          <div class="hidden sm:block h-4 w-px bg-slate-200 shrink-0"></div>

          <div class="flex items-center gap-1.5 text-sm min-w-0">
            <span class="hidden sm:inline text-slate-500 font-normal truncate">{{ pageInfo.section }}</span>
            <span class="hidden sm:inline text-slate-300">/</span>
            <span class="font-semibold text-slate-900 truncate">{{ pageInfo.title }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2.5 shrink-0">
          <!-- Instansi Public Portal Link -->
          <NuxtLink
            v-if="currentInstansi"
            :to="`/${currentInstansi.slug}`"
            target="_blank"
            class="hidden md:inline-flex items-center gap-1.5 h-8 rounded border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            title="Lihat Halaman Portal Instansi"
          >
            <span class="truncate max-w-[160px]">/{{ currentInstansi.slug }}</span>
            <span class="text-slate-400">&nearr;</span>
          </NuxtLink>

          <NuxtLink
            v-if="!isSuperAdmin && canCreateArsip && !route.path.startsWith('/dashboard/arsip')"
            to="/dashboard/arsip/create"
            class="hidden sm:inline-flex items-center gap-1.5 h-8 rounded bg-[#1d4ed8] px-3 text-xs font-medium text-white hover:bg-[#1e40af] transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Arsip Baru</span>
          </NuxtLink>

          <!-- User Dropdown -->
          <div class="relative">
            <div v-if="userMenuOpen" @click="userMenuOpen = false" class="fixed inset-0 z-40"></div>
            <button
              type="button"
              @click="userMenuOpen = !userMenuOpen"
              class="relative z-50 flex items-center gap-2 rounded px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div class="h-7 w-7 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center font-medium text-xs">
                {{ userInitials }}
              </div>
              <div class="hidden md:block text-left">
                <div class="text-xs font-medium text-slate-900 leading-tight">
                  {{ currentUser?.name || 'Pengguna' }}
                </div>
                <div class="text-[11px] text-slate-500 leading-tight">
                  {{ formatRoleLabel(currentUser?.role) }}
                </div>
              </div>
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="userMenuOpen"
              class="absolute right-0 mt-1.5 w-60 bg-white rounded border border-slate-200 p-1 shadow-md z-50"
            >
              <div class="px-2.5 py-2 border-b border-slate-100 mb-1">
                <p class="text-xs font-semibold text-slate-900 truncate">{{ currentUser?.name }}</p>
                <p class="text-[11px] text-slate-500 truncate mt-0.5">{{ currentUser?.email }}</p>
                <p v-if="currentInstansi" class="text-[11px] font-medium text-[#1d4ed8] truncate mt-1">
                  {{ currentInstansi.nama }}
                </p>
              </div>
              <NuxtLink
                to="/dashboard/profile"
                @click="userMenuOpen = false"
                class="block rounded px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Profil Saya
              </NuxtLink>
              <NuxtLink
                v-if="currentInstansi"
                :to="`/${currentInstansi.slug}`"
                target="_blank"
                @click="userMenuOpen = false"
                class="block rounded px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Halaman Portal (/{{ currentInstansi.slug }})
              </NuxtLink>
              <div class="my-1 border-t border-slate-100"></div>
              <button
                type="button"
                @click="handleLogout"
                class="w-full text-left rounded px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div v-if="showSkeleton" class="space-y-6 animate-pulse" aria-busy="true" aria-label="Memuat halaman">
          <div class="bg-white rounded-lg border border-slate-200 p-5 sm:p-6">
            <div class="h-6 w-52 rounded bg-slate-200"></div>
            <div class="h-4 w-72 rounded bg-slate-100 mt-2"></div>
          </div>
          <div class="bg-white rounded-lg border border-slate-200 p-6 h-64"></div>
        </div>

        <div v-show="!showSkeleton">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatRoleLabel } from '~/composables/useArsipApp'

const SIDEBAR_COLLAPSE_STORAGE_KEY = 'digital-arsip-multi:sidebar-collapsed'

const route = useRoute()
const app = useArsipApp()
const {
  currentUser,
  instansis,
  instansiAdmins,
  currentInstansi,
  activeArsips,
  trashedArsips,
  visibleKategoris,
  subjeks,
  settings,
  companyLogoUrl,
  isSuperAdmin,
  isAdminInstansi,
  canCreateArsip,
  canRestoreArsip,
  canForceDeleteArsip,
  hasPermission
} = app

const groups = reactive({
  manajemen: true,
  settings: true
})
const userMenuOpen = ref(false)
const mobileOpen = ref(false)
const sidebarCollapsed = ref(false)
const isCollapsed = computed(() => sidebarCollapsed.value && !mobileOpen.value)

const pageTransitionLoading = ref(true)
let skeletonTimer: ReturnType<typeof setTimeout> | null = null

const showSkeleton = computed(
  () => pageTransitionLoading.value || !app.initialized.value || app.loading.value
)

function triggerPageSkeleton(duration = 200) {
  pageTransitionLoading.value = true
  if (skeletonTimer) {
    clearTimeout(skeletonTimer)
  }
  skeletonTimer = setTimeout(() => {
    pageTransitionLoading.value = false
    skeletonTimer = null
  }, duration)
}

function toggleDesktopSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
  if (typeof window !== 'undefined') {
    localStorage.setItem(SIDEBAR_COLLAPSE_STORAGE_KEY, sidebarCollapsed.value ? '1' : '0')
  }
}

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    userMenuOpen.value = false
    triggerPageSkeleton(180)
  }
)

function isNavActive(path: string, exact = false): boolean {
  if (exact) return route.path === path
  return route.path === path || route.path.startsWith(`${path}/`)
}

function navItemClass(path: string, exact = false): string {
  const active = isNavActive(path, exact)
  const layout = isCollapsed.value
    ? 'flex items-center justify-center p-2 rounded transition-colors'
    : 'flex items-center gap-3 px-2.5 py-2 rounded transition-colors'
  if (active) {
    return `${layout} bg-[#1d4ed8] text-white font-medium`
  }
  return `${layout} text-slate-300 hover:bg-[#173058] hover:text-white`
}

function navIconClass(path: string, exact = false): string {
  return isNavActive(path, exact) ? 'text-white' : 'text-slate-400'
}

const pageInfo = computed(() => {
  const p = route.path
  const instName = currentInstansi.value?.nama || 'Instansi'
  if (p === '/dashboard') {
    return isSuperAdmin.value
      ? { section: 'Super Admin', title: 'Ringkasan Multi-Instansi' }
      : { section: instName, title: 'Dashboard' }
  }
  if (p === '/dashboard/instansi') return { section: 'Super Admin', title: 'Data Instansi' }
  if (p === '/dashboard/admin-instansi') return { section: 'Super Admin', title: 'Admin Instansi' }
  if (p === '/dashboard/arsip/create') return { section: instName, title: 'Buat Arsip Baru' }
  if (/^\/dashboard\/arsip\/[^/]+\/edit$/.test(p)) return { section: instName, title: 'Edit Arsip' }
  if (p.startsWith('/dashboard/arsip/')) return { section: instName, title: 'Detail Arsip' }
  if (p === '/dashboard/arsip') return { section: instName, title: 'Daftar Arsip' }
  if (p === '/dashboard/picture-to-pdf') return { section: instName, title: 'Picture to PDF' }
  if (p === '/dashboard/petunjuk-penggunaan') return { section: instName, title: 'Petunjuk Penggunaan' }
  if (p === '/dashboard/kategori') return { section: instName, title: 'Fungsi Arsip' }
  if (p === '/dashboard/subjek') return { section: instName, title: 'Subjek Arsip' }
  if (p === '/dashboard/metadata') return { section: instName, title: 'Metadata Arsip' }
  if (p === '/dashboard/trash') return { section: instName, title: 'Trash Arsip' }
  if (p === '/dashboard/users') return { section: instName, title: 'Users & Akses Data' }
  if (p === '/dashboard/roles') return { section: instName, title: 'Roles & Hak Akses' }
  if (p === '/dashboard/audit-trails') return { section: isSuperAdmin.value ? 'Super Admin' : instName, title: 'Audit Trails' }
  if (p === '/dashboard/settings') return { section: instName, title: 'Pengaturan & Portal' }
  if (p === '/dashboard/profile') return { section: 'Akun', title: 'Profil Saya' }
  return { section: 'Dashboard', title: settings.value.name || 'Digital Arsip' }
})

onMounted(async () => {
  if (typeof window !== 'undefined') {
    sidebarCollapsed.value = localStorage.getItem(SIDEBAR_COLLAPSE_STORAGE_KEY) === '1'
  }
  await app.init()
  triggerPageSkeleton(180)
  if (!currentUser.value) {
    await navigateTo('/superadmin-login')
  } else if (!app.canAccessPath(route.path)) {
    await navigateTo('/dashboard')
  }
})

onBeforeUnmount(() => {
  if (skeletonTimer) {
    clearTimeout(skeletonTimer)
    skeletonTimer = null
  }
})

const userInitials = computed(() => {
  const name = currentUser.value?.name || 'U'
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('')
})

async function handleLogout() {
  userMenuOpen.value = false
  mobileOpen.value = false
  const { wasSuperAdmin, instansiSlug } = await app.logout()
  if (wasSuperAdmin) {
    await navigateTo('/superadmin-login')
  } else if (instansiSlug) {
    await navigateTo(`/${instansiSlug}/login`)
  } else {
    await navigateTo('/superadmin-login')
  }
}
</script>
