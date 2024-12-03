import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAlertStore } from '../stores/alert'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    component: () => import('../views/Register.vue'),
    meta: { guest: true }
  },
  {
    path: '/booking',
    component: () => import('../views/Booking.vue'),
    meta: { requiresAuth: true, roles: ['customer'] }
  },
  {
    path: '/orders',
    component: () => import('../views/Orders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/driver/orders',
    component: () => import('../views/driver/OrderList.vue'),
    meta: { requiresAuth: true, roles: ['driver'] }
  },
  {
    path: '/auth/callback',
    component: () => import('../views/auth/Callback.vue'),
    meta: { guest: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const alertStore = useAlertStore()
  
  // 檢查是否需要登入
  if (to.meta.requiresAuth && !authStore.token) {
    alertStore.showAlert('請先登入')
    return next('/login')
  }

  // 已登入用戶不能訪問登入/註冊頁
  if (to.meta.guest && authStore.token) {
    return next('/')
  }

  // 檢查角色權限
  if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
    alertStore.showAlert('無權限訪問此頁面')
    return next('/')
  }

  next()
})

export default router 