<template>
  <div class="min-h-screen bg-gray-100 py-12">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow p-8">
      <h1 class="text-2xl font-bold text-center mb-6">註冊</h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">電子郵件</label>
            <input
              v-model="form.email"
              type="email"
              class="mt-1 block w-full rounded border-gray-300"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">密碼</label>
            <input
              v-model="form.password"
              type="password"
              class="mt-1 block w-full rounded border-gray-300"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">姓名</label>
            <input
              v-model="form.name"
              type="text"
              class="mt-1 block w-full rounded border-gray-300"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">手機號碼</label>
            <input
              v-model="form.phone"
              type="tel"
              class="mt-1 block w-full rounded border-gray-300"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">註冊身份</label>
            <select
              v-model="form.role"
              class="mt-1 block w-full rounded border-gray-300"
              required
            >
              <option value="customer">乘客</option>
              <option value="driver">司機</option>
            </select>
          </div>

          <!-- 司機額外資訊 -->
          <template v-if="form.role === 'driver'">
            <div>
              <label class="block text-sm font-medium text-gray-700">駕照號碼</label>
              <input
                v-model="form.license_number"
                type="text"
                class="mt-1 block w-full rounded border-gray-300"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">車牌號碼</label>
              <input
                v-model="form.vehicle_number"
                type="text"
                class="mt-1 block w-full rounded border-gray-300"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">車輛類型</label>
              <select
                v-model="form.vehicle_type"
                class="mt-1 block w-full rounded border-gray-300"
                required
              >
                <option value="轎車">轎車</option>
                <option value="休旅車">休旅車</option>
                <option value="商務車">商務車</option>
              </select>
            </div>
          </template>
          
          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="loading"
          >
            {{ loading ? '註冊中...' : '註冊' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

const form = ref({
  email: '',
  password: '',
  name: '',
  phone: '',
  role: 'customer',
  license_number: '',
  vehicle_number: '',
  vehicle_type: '轎車'
})

const handleSubmit = async () => {
  try {
    loading.value = true
    await authStore.register(form.value)
    router.push('/')
  } catch (error) {
    console.error('Register failed:', error)
    // TODO: 顯示錯誤訊息
  } finally {
    loading.value = false
  }
}
</script> 