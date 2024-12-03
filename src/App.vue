<template>
  <Alert 
    :show="alertStore.show"
    :message="alertStore.message"
    :type="alertStore.type"
  />
  <Header />
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from './components/Layout/Header.vue'
import Alert from './components/Common/Alert.vue'
import { useAuthStore } from './stores/auth'
import { useAlertStore } from './stores/alert'

const authStore = useAuthStore()
const alertStore = useAlertStore()

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.getCurrentUser()
    } catch (error) {
      console.error('Failed to get current user:', error)
      authStore.logout()
      alertStore.showAlert('請重新登入')
    }
  }
})
</script>

<style>
@import './styles/main.css';
@import 'uno.css';
</style> 