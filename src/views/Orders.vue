<template>
  <div class="space-y-4">
    <!-- 頂部操作區 -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">訂單列表</h2>
      <button class="flex items-center justify-center px-5 h-11 rounded bg-#ff7800 text-white text-sm font-medium border-0 hover:bg-#e66d00 transition-colors duration-200">
        <i class="i-carbon-add mr-2"></i>
        新增預約
      </button>
    </div>

    <!-- 搜尋區域 -->
    <div class="bg-white rounded-lg shadow-sm p-6 border border-[#e9ecef]">
      <div class="flex gap-4">
        <input 
          v-model="search.orderNo"
          type="text" 
          placeholder="搜尋訂單編號..."
          class="flex-1 px-4 py-2.5 rounded-md border border-[#ced4da] text-[#495057] placeholder-[#adb5bd]
                 focus:border-[#ff7800] focus:ring-2 focus:ring-[#ff7800] focus:ring-opacity-30 
                 outline-none transition-all duration-200"
        >
        <select 
          v-model="search.status"
          class="px-4 py-2.5 rounded-md border border-[#ced4da] text-[#495057]
                 focus:border-[#ff7800] focus:ring-2 focus:ring-[#ff7800] focus:ring-opacity-30
                 outline-none transition-all duration-200 w-40"
        >
          <option value="">所有狀態</option>
          <option value="pending">等待接單</option>
          <option value="accepted">已接單</option>
          <option value="completed">已完成</option>
        </select>
        <button 
          @click="fetchOrders"
          class="inline-flex items-center justify-center px-6 py-2.5 rounded-md bg-[#ff7800] text-white 
                 text-sm font-medium hover:bg-[#e66d00] transition-all duration-200 shadow-sm"
        >
          <i class="i-carbon-search mr-2"></i>
          搜尋
        </button>
      </div>
    </div>

    <!-- 訂單卡片列表 -->
    <div class="grid grid-cols-1 gap-4">
      <div v-for="order in orders" :key="order.id" 
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-[#e9ecef]">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div class="space-y-4">
              <!-- 訂單編號和狀態 -->
              <div class="flex items-center gap-3">
                <span class="text-[#495057] text-sm">訂單編號：</span>
                <span class="font-medium text-[#212529]">{{ order.id }}</span>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    order.status === 'pending' ? 'bg-[#fff8e6] text-[#ffa807] border border-[#ffe4b3]' :
                    order.status === 'accepted' ? 'bg-[#fff8f3] text-[#ff7800] border border-[#ffe4d1]' :
                    'bg-[#f0fff0] text-[#3ab000] border border-[#d1ffb3]'
                  ]"
                >
                  {{ getStatusText(order.status) }}
                </span>
              </div>

              <!-- 地址信息 -->
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-[#fff8f3] flex items-center justify-center">
                    <i class="i-carbon-location text-[#ff7800]"></i>
                  </div>
                  <span class="text-[#495057]">{{ order.pickup_address }}</span>
                </div>
                <i class="i-carbon-arrow-right text-[#adb5bd]"></i>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-[#fff8f3] flex items-center justify-center">
                    <i class="i-carbon-location-current text-[#ff7800]"></i>
                  </div>
                  <span class="text-[#495057]">{{ order.dropoff_address }}</span>
                </div>
              </div>

              <!-- 時間信息 -->
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-[#fff8f3] flex items-center justify-center">
                    <i class="i-carbon-time text-[#ff7800]"></i>
                  </div>
                  <span class="text-[#495057]">{{ formatDateTime(order.pickup_time) }}</span>
                </div>
              </div>

              <!-- 乘客信息 -->
              <div class="flex items-center gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <i class="i-carbon-user text-[#adb5bd]"></i>
                  <span class="text-[#6c757d]">{{ order.passenger_name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="i-carbon-phone text-[#adb5bd]"></i>
                  <span class="text-[#6c757d]">{{ order.passenger_phone }}</span>
                </div>
              </div>

              <!-- 備註 -->
              <div v-if="order.notes" class="text-sm text-[#6c757d] bg-[#f8f9fa] p-3 rounded-md">
                <i class="i-carbon-note text-[#adb5bd] mr-2"></i>
                {{ order.notes }}
              </div>
            </div>

            <!-- 操作按鈕 -->
            <div class="flex flex-col gap-2">
              <button class="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium border border-[#dee2e6] bg-white text-[#495057] hover:border-[#ff7800] hover:text-[#ff7800] transition-all duration-200 shadow-sm">
                <i class="i-carbon-edit mr-2"></i>
                編輯
              </button>
              <button class="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium border border-[#dee2e6] bg-white text-[#dc3545] hover:bg-[#dc3545] hover:text-white hover:border-[#dc3545] transition-all duration-200 shadow-sm">
                <i class="i-carbon-trash-can mr-2"></i>
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分頁 -->
    <div class="mt-6 flex justify-between items-center">
      <div class="text-gray-600">
        共 {{ total }} 筆訂單
      </div>
      <div class="flex gap-2">
        <button
          @click="page > 1 && (page--)"
          :disabled="page === 1"
          class="flex items-center justify-center px-4 h-9 rounded bg-white text-sm font-medium border border-solid border-#ccc hover:border-#ff7800 hover:text-#ff7800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一頁
        </button>
        <button
          @click="hasNextPage && (page++)"
          :disabled="!hasNextPage"
          class="flex items-center justify-center px-4 h-9 rounded bg-white text-sm font-medium border border-solid border-#ccc hover:border-#ff7800 hover:text-#ff7800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一頁
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api'

const orders = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = 10

const search = ref({
  orderNo: '',
  status: ''
})

const hasNextPage = computed(() => {
  return orders.value.length === pageSize
})

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '等待接單',
    'ACCEPTED': '已接單',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  }
  return statusMap[status] || status
}

const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString('zh-TW')
}

const fetchOrders = async () => {
  try {
    const { data } = await api.get('/orders', {
      params: {
        page: page.value,
        pageSize,
        orderNo: search.value.orderNo,
        status: search.value.status
      }
    })
    orders.value = data.data.list
    total.value = data.data.total
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  }
}

onMounted(() => {
  fetchOrders()
})
</script> 