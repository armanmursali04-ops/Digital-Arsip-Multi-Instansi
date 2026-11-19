export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  const app = useArsipApp()
  await app.init()
  if (!app.currentUser.value && to.path.startsWith('/dashboard')) {
    if (typeof window !== 'undefined' && to.fullPath !== '/dashboard') {
      sessionStorage.setItem('digital_arsip_redirect_after_login', to.fullPath)
    }
    return navigateTo('/superadmin-login')
  }
  if (app.currentUser.value && to.path.startsWith('/dashboard') && !app.canAccessPath(to.path)) {
    return navigateTo('/dashboard')
  }
})
