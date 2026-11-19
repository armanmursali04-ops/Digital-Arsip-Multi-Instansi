<script setup lang="ts">
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/superadmin-login', { replace: true })
    }
  ]
})

onMounted(async () => {
  await navigateTo('/superadmin-login', { replace: true })
})
</script>

<template>
  <div class="min-h-screen bg-blue-950" />
</template>
