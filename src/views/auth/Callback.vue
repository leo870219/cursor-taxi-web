<template>
  <div class="min-h-screen bg-#f8f9fa flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-sm">
      <p class="text-#6c757d">處理登入中...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useAlertStore } from '../../stores/alert'

const router = useRouter()
const authStore = useAuthStore()
const alertStore = useAlertStore()

onMounted(async () => {
  const token = new URLSearchParams(window.location.search).get('token')
  
  if (!token) {
    alertStore.showAlert('登入失敗：未收到認證令牌')
    return router.push('/login')
  }

  try {
    localStorage.setItem('token', token)
    authStore.token = token
    
    const userData = await authStore.getCurrentUser()
    if (userData) {
      alertStore.showAlert('登入成功', 'success')
      router.push('/')
    }
  } catch (error) {
    console.error('Login failed:', error)
    authStore.logout()
    alertStore.showAlert(error.message || '登入失敗')
    router.push('/login')
  }
})
</script> 