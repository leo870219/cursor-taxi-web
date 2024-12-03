import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const show = ref(false)
  const message = ref('')
  const type = ref('error')

  const showAlert = (msg, alertType = 'error') => {
    message.value = msg
    type.value = alertType
    show.value = true
    setTimeout(() => {
      show.value = false
    }, 3000)
  }

  return {
    show,
    message,
    type,
    showAlert
  }
}) 