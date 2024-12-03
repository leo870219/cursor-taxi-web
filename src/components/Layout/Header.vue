<template>
  <header>
    <!-- 主導航欄 -->
    <nav class="bg-white border-b border-[--gray-200]">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2">
            <span class="text-lg font-bold text-[--primary]">TAXI</span>
            <span class="text-lg font-bold text-[--gray-900]">計程車預約</span>
          </RouterLink>

          <!-- 導航連結 -->
          <div class="flex items-center gap-8">
            <RouterLink 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path"
              class="text-[--gray-700] hover:text-[--primary] transition-colors duration-200"
            >
              {{ item.name }}
            </RouterLink>
          </div>

          <!-- 用戶區域 -->
          <div class="flex items-center gap-4">
            <template v-if="authStore.user">
              <RouterLink 
                to="/orders" 
                class="text-[--gray-700] hover:text-[--primary] transition-colors duration-200"
              >
                訂單管理
              </RouterLink>
              <button 
                @click="handleLogout" 
                class="text-[--gray-700] hover:text-[--primary] transition-colors duration-200"
              >
                登出
              </button>
            </template>
            <template v-else>
              <RouterLink 
                to="/login"
                class="text-[--gray-700] hover:text-[--primary] transition-colors duration-200"
              >
                登入
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// 在登入、註冊等頁面隱藏搜尋欄
const hideSearchBar = computed(() => {
  const hiddenRoutes = ['/login', '/register', '/auth/callback']
  return hiddenRoutes.includes(route.path)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>