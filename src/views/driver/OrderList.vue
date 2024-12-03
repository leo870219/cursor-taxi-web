<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-lg shadow p-6">
          <h1 class="text-2xl font-bold mb-6">可接訂單列表</h1>

          <!-- 訂單列表 -->
          <div class="space-y-4">
            <div 
              v-for="order in orders" 
              :key="order.id"
              class="border rounded p-4"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium">訂單編號: {{ order.order_no }}</p>
                  <p class="text-gray-600">上車地點: {{ order.pickup_address }}</p>
                  <p class="text-gray-600">目的地: {{ order.dropoff_address }}</p>
                  <p class="text-gray-600">預約時間: {{ formatDateTime(order.pickup_time) }}</p>
                </div>
                <div>
                  <button
                    v-if="order.status === 'PENDING'"
                    @click="acceptOrder(order.id)"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    :disabled="loading"
                  >
                    接單
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOrderStore } from '../../stores/order'
import { formatDateTime } from '../../utils/formatters'

const orderStore = useOrderStore()
const loading = ref(false)

const fetchOrders = async () => {
  try {
    loading.value = true
    await orderStore.fetchOrders({ status: 'PENDING' })
  } finally {
    loading.value = false
  }
}

const acceptOrder = async (orderId) => {
  try {
    loading.value = true
    await orderStore.updateOrderStatus(orderId, 'ACCEPTED')
    await fetchOrders()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script> 