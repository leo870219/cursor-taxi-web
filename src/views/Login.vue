<template>
  <div class="min-h-[calc(100vh-136px)] bg-#f8f9fa py-12">
    <div class="max-w-md mx-auto">
      <!-- 登入卡片 -->
      <div class="bg-white rounded-lg shadow-sm border border-#e9ecef overflow-hidden">
        <div class="px-6 py-4 border-b border-#e9ecef">
          <h1 class="text-xl font-bold text-#343a40">會員登入</h1>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- 電子郵件 -->
            <div>
              <label class="block text-sm font-medium text-#495057 mb-1">
                電子郵件
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-4 py-2.5 rounded-md border border-#ced4da text-#495057
                       placeholder-#adb5bd bg-white
                       hover:border-#ff7800
                       focus:(border-#ff7800 ring-2 ring-#ff7800 ring-opacity-30)
                       outline-none transition-all duration-200"
                placeholder="請輸入電子郵件"
                required
              >
            </div>
            
            <!-- 密碼 -->
            <div>
              <div class="flex justify-between mb-1">
                <label class="text-sm font-medium text-#495057">
                  密碼
                </label>
                <a href="#" class="text-sm text-#ff7800 hover:text-#e66d00">
                  忘記密碼？
                </a>
              </div>
              <input
                v-model="form.password"
                type="password"
                class="w-full px-4 py-2.5 rounded-md border border-#ced4da text-#495057
                       placeholder-#adb5bd bg-white
                       hover:border-#ff7800
                       focus:(border-#ff7800 ring-2 ring-#ff7800 ring-opacity-30)
                       outline-none transition-all duration-200"
                placeholder="請輸入密碼"
                required
              >
            </div>
            
            <!-- 記住我 -->
            <div class="flex items-center">
              <input
                type="checkbox"
                id="remember"
                class="w-4 h-4 text-#ff7800 border-#ced4da rounded
                       focus:(ring-2 ring-#ff7800 ring-opacity-30)"
              >
              <label for="remember" class="ml-2 text-sm text-#6c757d">
                記住我
              </label>
            </div>
            
            <!-- 登入按鈕 -->
            <button
              type="submit"
              class="w-full inline-flex items-center justify-center px-6 py-2.5 rounded-md
                     bg-#ff7800 text-white text-sm font-medium
                     hover:bg-#e66d00 transition-all duration-200 shadow-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     outline-none focus:outline-none"
              :disabled="loading"
            >
              <i v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></i>
              <span>{{ loading ? '登入中...' : '登入' }}</span>
            </button>
            
            <!-- 分隔線 -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-#e9ecef"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-#adb5bd">或</span>
              </div>
            </div>
            
            <!-- Google 登入 -->
            <button
              type="button"
              class="w-full inline-flex items-center justify-center px-6 py-2.5 rounded-md
                     bg-white text-#495057 text-sm font-medium border border-#ced4da
                     hover:(border-#ff7800 text-#ff7800) transition-all duration-200 shadow-sm
                     outline-none focus:outline-none"
              @click="handleGoogleLogin"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              使用 Google 帳號登入
            </button>
          </form>
        </div>
      </div>

      <!-- 註冊提示 -->
      <div class="mt-6 text-center">
        <span class="text-#6c757d">還不是會員？</span>
        <router-link to="/register" class="text-#ff7800 hover:text-#e66d00 ml-1">
          立即註冊
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useAlertStore } from '../stores/alert'

const authStore = useAuthStore()
const alertStore = useAlertStore()
const router = useRouter()
const loading = ref(false)

const form = ref({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    loading.value = true
    await authStore.login(form.value)
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
    alertStore.showAlert(error.response?.data?.message || '登入失敗')
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
}
</script> 