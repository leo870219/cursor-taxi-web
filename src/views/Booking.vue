<template>
  <div class="min-h-[calc(100vh-136px)] bg-#f8f9fa py-12">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm border border-#e9ecef overflow-hidden">
        <div class="px-6 py-4 border-b border-#e9ecef">
          <h1 class="text-xl font-bold text-#343a40">預約計程車</h1>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- 乘客資訊 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-#495057 mb-1">乘客姓名</label>
                <input
                  v-model="form.passenger_name"
                  type="text"
                  class="w-full px-4 py-2.5 rounded border border-[--gray-300] hover:border-[--primary] focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none transition-colors duration-200"
                  :class="{ 'border-red-500': errors.passenger_name }"
                >
                <span v-if="errors.passenger_name" class="text-xs text-red-500 mt-1">
                  {{ errors.passenger_name }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-#495057 mb-1">聯絡電話</label>
                <input
                  v-model="form.passenger_phone"
                  type="tel"
                  class="w-full px-4 py-2.5 rounded border border-[--gray-300] hover:border-[--primary] focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none transition-colors duration-200"
                  :class="{ 'border-red-500': errors.passenger_phone }"
                >
                <span v-if="errors.passenger_phone" class="text-xs text-red-500 mt-1">
                  {{ errors.passenger_phone }}
                </span>
              </div>
            </div>

            <!-- 上車地點 -->
            <div>
              <label class="block text-sm font-medium text-#495057 mb-1">上車地點</label>
              <input
                v-model="form.pickup_address"
                type="text"
                class="w-full px-4 py-2.5 rounded border border-[--gray-300] hover:border-[--primary] focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none transition-colors duration-200"
                :class="{ 'border-red-500': errors.pickup_address }"
              >
              <span v-if="errors.pickup_address" class="text-xs text-red-500 mt-1">
                {{ errors.pickup_address }}
              </span>
            </div>

            <!-- 下車地點 -->
            <div>
              <label class="block text-sm font-medium text-#495057 mb-1">下車地點</label>
              <input
                v-model="form.dropoff_address"
                type="text"
                class="w-full px-4 py-2.5 rounded border border-[--gray-300] hover:border-[--primary] focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none transition-colors duration-200"
                :class="{ 'border-red-500': errors.dropoff_address }"
              >
              <span v-if="errors.dropoff_address" class="text-xs text-red-500 mt-1">
                {{ errors.dropoff_address }}
              </span>
            </div>

            <!-- 預估金額 -->
            <div v-if="form.price" class="bg-[--primary-light] p-4 rounded">
              <div class="flex justify-between items-center">
                <span class="text-sm text-[--gray-700]">預估金額</span>
                <span class="text-lg font-medium text-[--primary]">NT$ {{ form.price }}</span>
              </div>
            </div>

            <!-- 預約時間 -->
            <div>
              <label class="block text-sm font-medium text-#495057 mb-1">預約時間</label>
              <input
                v-model="form.pickup_time"
                type="datetime-local"
                class="w-full px-4 py-2.5 rounded border border-[--gray-300] hover:border-[--primary] focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none transition-colors duration-200"
                :class="{ 'border-red-500': errors.pickup_time }"
                :min="minDateTime"
              >
              <span v-if="errors.pickup_time" class="text-xs text-red-500 mt-1">
                {{ errors.pickup_time }}
              </span>
            </div>

            <!-- 備註 -->
            <div>
              <label class="block text-sm font-medium text-#495057 mb-1">備註</label>
              <textarea
                v-model="form.notes"
                rows="3"
                class="w-full px-4 py-2.5 rounded border border-[--gray-300] hover:border-[--primary] focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none transition-colors duration-200"
              ></textarea>
            </div>

            <!-- 提交按鈕 -->
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-6 py-2.5 bg-[--primary] text-white rounded hover:bg-[--primary-hover] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="loading"
              >
                <span v-if="loading">預約中...</span>
                <span v-else>確認預約</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAlertStore } from '../stores/alert'
import { useOrderStore } from '../stores/order'
import { phoneValidator } from '../utils/validators'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const alertStore = useAlertStore()
const orderStore = useOrderStore()

const loading = ref(false)
const errors = ref({})

// 表單數據
const form = ref({
  passenger_name: authStore.user?.name || '',
  passenger_phone: '',
  pickup_address: '',
  dropoff_address: '',
  pickup_time: '',
  price: '',
  notes: ''
})

// 最小可選時間（當前時間後30分鐘）
const minDateTime = computed(() => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 30)
  return date.toISOString().slice(0, 16)
})

// 驗證表單
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.passenger_name) {
    errors.value.passenger_name = '請輸入乘客姓名'
  }
  
  if (!form.value.passenger_phone) {
    errors.value.passenger_phone = '請輸入聯絡電話'
  } else if (!phoneValidator(form.value.passenger_phone)) {
    errors.value.passenger_phone = '請輸入正確的手機號碼格式'
  }
  
  if (!form.value.pickup_address) {
    errors.value.pickup_address = '請輸入上車地點'
  }
  
  if (!form.value.dropoff_address) {
    errors.value.dropoff_address = '請輸入下車地點'
  }
  
  if (!form.value.pickup_time) {
    errors.value.pickup_time = '請選擇預約時間'
  }
  
  return Object.keys(errors.value).length === 0
}

// 提交表單
const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    await orderStore.createBooking(form.value)
    alertStore.showAlert('預約成功', 'success')
    router.push('/orders')
  } catch (error) {
    console.error('Booking failed:', error)
    alertStore.showAlert(error.response?.data?.message || '預約失敗')
  } finally {
    loading.value = false
  }
}

// 從路由參數獲取預填資料
onMounted(() => {
  const { from, to, price } = route.query
  if (from) form.value.pickup_address = from
  if (to) form.value.dropoff_address = to
  if (price) form.value.price = price
  
  // 設置預設預約時間（當前時間後1小時）
  const date = new Date()
  date.setHours(date.getHours() + 1)
  form.value.pickup_time = date.toISOString().slice(0, 16)
})
</script> 