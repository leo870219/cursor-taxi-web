import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '../api'
import { useAlertStore } from './alert'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const alertStore = useAlertStore()

  const login = async (credentials) => {
    try {
      const { data } = await auth.login(credentials)
      if (data.code === 200) {
        token.value = data.data.token
        user.value = data.data.user
        localStorage.setItem('token', data.data.token)
        alertStore.showAlert('登入成功', 'success')
        return data.data
      } else {
        throw new Error(data.message || '登入失敗')
      }
    } catch (error) {
      console.error('Login failed:', error)
      alertStore.showAlert(error.response?.data?.message || '登入失敗')
      throw error
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const getCurrentUser = async () => {
    try {
      if (!token.value) {
        throw new Error('未登入狀態')
      }
      
      const { data } = await auth.getCurrentUser()
      if (data.code === 200) {
        user.value = data.data
        return data.data
      } else {
        throw new Error(data.message || '獲取用戶資訊失敗')
      }
    } catch (error) {
      console.error('Get current user failed:', error)
      logout() // 如果獲取用戶信息失敗，清除登入狀態
      throw error
    }
  }

  return {
    user,
    token,
    login,
    logout,
    getCurrentUser
  }
}) 