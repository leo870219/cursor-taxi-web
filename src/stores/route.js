import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'
import { useAlertStore } from './alert'

export const useRouteStore = defineStore('route', () => {
  const hotRoutes = ref([])
  const loading = ref(false)
  const alertStore = useAlertStore()

  const fetchHotRoutes = async () => {
    try {
      loading.value = true
      const { data } = await api.get('/routes/hot')
      hotRoutes.value = data.data
    } catch (error) {
      console.error('Fetch hot routes failed:', error)
      alertStore.showAlert('獲取熱門路線失敗')
    } finally {
      loading.value = false
    }
  }

  const selectRoute = async (route) => {
    // 將選中的路線存到 localStorage
    localStorage.setItem('selectedRoute', JSON.stringify(route))
    return route
  }

  return {
    hotRoutes,
    loading,
    fetchHotRoutes,
    selectRoute
  }
})