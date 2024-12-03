<template>
  <div class="space-y-4">
    <!-- 篩選器 -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center space-x-4">
        <input 
          type="text" 
          placeholder="搜尋訂單..."
          class="flex-1 px-3 py-2 rounded border border-[--gray-300] focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none transition-colors duration-200"
        >
        <select class="px-3 py-2 rounded border border-[--gray-300] focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none transition-colors duration-200 w-32">
          <option value="">全部狀態</option>
          <option value="pending">等待中</option>
          <option value="accepted">已接單</option>
          <option value="completed">已完成</option>
        </select>
        <button class="inline-flex items-center justify-center px-4 py-2 rounded text-sm font-medium bg-[--primary] text-white hover:bg-[--primary-hover] transition-colors duration-200">
          <i class="i-carbon-search mr-2"></i>
          搜尋
        </button>
      </div>
    </div>

    <!-- 訂單列表 -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-[--gray-200]">
        <h2 class="text-xl font-bold text-[--gray-800]">訂單列表</h2>
      </div>
      
      <div class="divide-y divide-[--gray-200]">
        <div v-for="order in orders" :key="order.id" class="p-4 hover:bg-[--gray-50]">
          <div class="flex justify-between">
            <div class="space-y-2">
              <div class="flex items-center space-x-4">
                <span class="font-medium">{{ order.pickup_address }}</span>
                <i class="i-carbon-arrow-right text-[--gray-400]"></i>
                <span class="font-medium">{{ order.dropoff_address }}</span>
                <span 
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    order.status === 'pending' ? 'bg-[--warning-light] text-[--warning]' :
                    order.status === 'accepted' ? 'bg-[--primary-light] text-[--primary]' :
                    'bg-[--success-light] text-[--success]'
                  ]"
                >
                  {{ order.status }}
                </span>
              </div>
              <div class="text-sm text-[--gray-500]">
                預約時間：{{ order.pickup_time }}
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button class="inline-flex items-center justify-center px-4 py-2 rounded text-sm font-medium border border-[--gray-300] bg-white text-[--gray-700] hover:border-[--primary] hover:text-[--primary] transition-colors duration-200">
                詳情
              </button>
              <button 
                v-if="order.status === 'pending'"
                class="inline-flex items-center justify-center px-4 py-2 rounded text-sm font-medium bg-[--primary] text-white hover:bg-[--primary-hover] transition-colors duration-200"
              >
                接單
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分頁 -->
    <div class="flex justify-center">
      <nav class="flex items-center space-x-1">
        <button class="inline-flex items-center justify-center w-8 h-8 rounded border border-[--gray-300] text-[--gray-600] hover:border-[--primary] hover:text-[--primary] transition-colors duration-200">
          <i class="i-carbon-chevron-left"></i>
        </button>
        <button class="inline-flex items-center justify-center w-8 h-8 rounded bg-[--primary] text-white">1</button>
        <button class="inline-flex items-center justify-center w-8 h-8 rounded border border-[--gray-300] text-[--gray-600] hover:border-[--primary] hover:text-[--primary] transition-colors duration-200">2</button>
        <button class="inline-flex items-center justify-center w-8 h-8 rounded border border-[--gray-300] text-[--gray-600] hover:border-[--primary] hover:text-[--primary] transition-colors duration-200">3</button>
        <button class="inline-flex items-center justify-center w-8 h-8 rounded border border-[--gray-300] text-[--gray-600] hover:border-[--primary] hover:text-[--primary] transition-colors duration-200">
          <i class="i-carbon-chevron-right"></i>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
const orders = [
  {
    id: 1,
    pickup_address: '台北車站',
    dropoff_address: '松山機場',
    status: 'pending',
    pickup_time: '2024-03-20 14:30'
  },
  // ... 更多訂單數據
]
</script> 