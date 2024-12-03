import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'
import { useAlertStore } from './alert'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const total = ref(0)
  const loading = ref(false)
  const alertStore = useAlertStore()

  const fetchOrders = async (params) => {
    try {
      loading.value = true
      const { data } = await api.get('/orders', { params })
      orders.value = data.data.list
      total.value = data.data.total
      return data
    } catch (error) {
      console.error('Fetch orders failed:', error)
      alertStore.showAlert('獲取訂單列表失敗')
      throw error
    } finally {
      loading.value = false
    }
  }

  const createBooking = async (formData) => {
    try {
      loading.value = true
      const { data } = await api.post('/bookings', formData)
      alertStore.showAlert('預約成功', 'success')
      return data
    } catch (error) {
      console.error('Create booking failed:', error)
      alertStore.showAlert(error.response?.data?.message || '預約失敗')
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      loading.value = true
      const { data } = await api.put(`/orders/${orderId}/status`, { status })
      alertStore.showAlert('更新成功', 'success')
      return data
    } catch (error) {
      console.error('Update order status failed:', error)
      alertStore.showAlert('更新訂單狀態失敗')
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    total,
    loading,
    fetchOrders,
    createBooking,
    updateOrderStatus
  }
}) 