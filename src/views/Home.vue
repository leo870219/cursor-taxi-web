<template>
  <div class="min-h-[calc(100vh-136px)]">
    <!-- 搜尋區塊 -->
    <div class="bg-[--primary-bg] py-16">
      <div class="container">
        <div class="max-w-3xl mx-auto">
          <h1 class="text-2xl font-bold text-center text-[--gray-900] mb-12">
            快速預約計程車
          </h1>
          
          <!-- 預約卡片 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="space-y-4">
              <!-- 上車地點 -->
              <div class="relative">
                <label class="block text-sm font-medium text-[--gray-700] mb-1">上車地點</label>
                <div class="relative">
                  <input 
                    ref="pickupInput"
                    v-model="form.pickup"
                    type="text" 
                    placeholder="請輸入上車地點..."
                    @input="handlePickupInput"
                    :class="[
                      'w-full pl-10 pr-4 py-2.5 rounded border hover:border-[--primary] focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none transition-colors duration-200',
                      isPickupValid ? 'border-[--gray-300]' : 'border-red-500'
                    ]"
                  >
                  <button 
                    @click="getCurrentLocation"
                    type="button"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[--gray-500] hover:text-[--primary] transition-colors duration-200"
                    title="定位目前位置"
                  >
                    <i class="i-carbon-location text-xl"></i>
                  </button>
                </div>
                <p v-if="!isPickupValid" class="mt-1 text-xs text-red-500">
                  請選擇有效的地址
                </p>
              </div>

              <!-- 下車地點 -->
              <div>
                <label class="block text-sm font-medium text-[--gray-700] mb-1">下車地點</label>
                <div class="relative">
                  <input 
                    ref="dropoffInput"
                    v-model="form.dropoff"
                    type="text" 
                    placeholder="請輸入下車地點..."
                    @input="handleDropoffInput"
                    :class="[
                      'w-full px-4 py-2.5 rounded border hover:border-[--primary] focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none transition-colors duration-200',
                      isDropoffValid ? 'border-[--gray-300]' : 'border-red-500'
                    ]"
                  >
                </div>
                <p v-if="!isDropoffValid" class="mt-1 text-xs text-red-500">
                  請選擇有效的地址
                </p>
              </div>

              <!-- 預約按鈕 -->
              <button 
                @click="handleBooking"
                :disabled="!canBooking"
                :class="[
                  'w-full h-11 mt-2 rounded font-medium transition-colors duration-200 flex items-center justify-center',
                  canBooking 
                    ? 'bg-[--primary] text-white hover:bg-[--primary-hover]' 
                    : 'bg-[--gray-200] text-[--gray-500] cursor-not-allowed'
                ]"
              >
                <i class="i-carbon-calendar mr-2"></i>
                立即預約
              </button>

              <!-- 錯誤提示 -->
              <p v-if="sameLocationError" class="mt-2 text-xs text-red-500">
                上車地點與下車地點不能相同
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 熱門路線 -->
    <div class="container py-12">
      <h2 class="text-xl font-bold text-[--gray-800] mb-6">熱門路線</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="route in routeStore.hotRoutes" 
          :key="route.id" 
          class="bg-white rounded-lg border border-[--gray-200] hover:border-[--primary] hover:shadow-md transition-all duration-200 cursor-pointer p-6"
          @click="handleRouteSelect(route)"
        >
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 rounded-full bg-[--primary-light] flex items-center justify-center">
              <i class="i-carbon-location text-[--primary]"></i>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <span class="text-[--gray-800]">{{ route.from }}</span>
                <i class="i-carbon-arrow-right text-[--gray-400]"></i>
                <span class="text-[--gray-800]">{{ route.to }}</span>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-[--primary] font-medium">NT$ {{ route.price }}</span>
                <span class="text-sm text-[--gray-500]">約 {{ route.duration }} 分鐘</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteStore } from '../stores/route'
import { useAuthStore } from '../stores/auth'
import { useAlertStore } from '../stores/alert'

const router = useRouter()
const routeStore = useRouteStore()
const authStore = useAuthStore()
const alertStore = useAlertStore()

const pickupInput = ref(null)
const dropoffInput = ref(null)
const form = ref({
  pickup: '',
  dropoff: ''
})

const isPickupValid = ref(true)
const isDropoffValid = ref(true)
const selectedPickupPlace = ref(null)
const selectedDropoffPlace = ref(null)

let pickupAutocomplete = null
let dropoffAutocomplete = null

const sameLocationError = ref(false)

// 定義台灣的邊界
const TAIWAN_BOUNDS = {
  north: 25.298401, // 台灣最北端
  south: 21.885834, // 台灣最南端
  west: 119.534686, // 台灣最西端
  east: 122.000000  // 台灣最東端
}

// 主要城市列表
const MAIN_CITIES = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', 
  '高雄市', '基隆市', '新竹市', '嘉義市'
]

// 初始化 Google Places Autocomplete
const initPlacesAutocomplete = () => {
  const options = {
    componentRestrictions: { country: 'tw' }, // 限制在台灣
    bounds: new google.maps.LatLngBounds(
      { lat: TAIWAN_BOUNDS.south, lng: TAIWAN_BOUNDS.west },
      { lat: TAIWAN_BOUNDS.north, lng: TAIWAN_BOUNDS.east }
    ),
    strictBounds: true, // 嚴格限制在設定的範圍內
    fields: ['formatted_address', 'geometry', 'name', 'address_components'],
    types: ['establishment', 'geocode']
  }

  pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput.value, options)
  dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffInput.value, options)

  // 監聽上車地點選擇
  pickupAutocomplete.addListener('place_changed', () => {
    const place = pickupAutocomplete.getPlace()
    if (isValidTaiwanAddress(place)) {
      form.value.pickup = place.formatted_address
      selectedPickupPlace.value = place
      isPickupValid.value = true
    } else {
      isPickupValid.value = false
      alertStore.showAlert('請選擇台灣地區的有效地址')
    }
  })

  // 監聽下車地點選擇
  dropoffAutocomplete.addListener('place_changed', () => {
    const place = dropoffAutocomplete.getPlace()
    if (isValidTaiwanAddress(place)) {
      form.value.dropoff = place.formatted_address
      selectedDropoffPlace.value = place
      isDropoffValid.value = true
    } else {
      isDropoffValid.value = false
      alertStore.showAlert('請選擇台灣地區的有效地址')
    }
  })
}

// 驗證是否為台灣地址
const isValidTaiwanAddress = (place) => {
  if (!place || !place.address_components) {
    return false
  }

  // 檢查是否在台灣
  const isInTaiwan = place.address_components.some(component => 
    component.long_name === 'Taiwan' || 
    component.long_name === '台灣' ||
    MAIN_CITIES.some(city => component.long_name.includes(city))
  )

  // 檢查經緯度是否在合理範圍內
  const lat = place.geometry?.location?.lat()
  const lng = place.geometry?.location?.lng()
  
  const isWithinBounds = lat && lng && 
    lat >= TAIWAN_BOUNDS.south && 
    lat <= TAIWAN_BOUNDS.north && 
    lng >= TAIWAN_BOUNDS.west && 
    lng <= TAIWAN_BOUNDS.east

  return isInTaiwan && isWithinBounds
}

// 處理手動輸入
const handlePickupInput = () => {
  if (selectedPickupPlace.value?.formatted_address !== form.value.pickup) {
    isPickupValid.value = false
  }
}

const handleDropoffInput = () => {
  if (selectedDropoffPlace.value?.formatted_address !== form.value.dropoff) {
    isDropoffValid.value = false
  }
}

// 獲取當前位置
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alertStore.showAlert('您的瀏覽器不支持地理定位')
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords

      // 檢查是否在台灣範圍內
      if (latitude < TAIWAN_BOUNDS.south || 
          latitude > TAIWAN_BOUNDS.north || 
          longitude < TAIWAN_BOUNDS.west || 
          longitude > TAIWAN_BOUNDS.east) {
        alertStore.showAlert('目前位置不在服務範圍內')
        return
      }

      try {
        const geocoder = new google.maps.Geocoder()
        const response = await geocoder.geocode({
          location: { lat: latitude, lng: longitude }
        })

        if (response.results[0] && isValidTaiwanAddress(response.results[0])) {
          form.value.pickup = response.results[0].formatted_address
          selectedPickupPlace.value = response.results[0]
          isPickupValid.value = true
        } else {
          alertStore.showAlert('無法獲取有效的台灣地址')
        }
      } catch (error) {
        console.error('Geocoding failed:', error)
        alertStore.showAlert('地址解析失敗')
      }
    },
    (error) => {
      console.error('Geolocation failed:', error)
      alertStore.showAlert('無法獲取您的位置')
    }
  )
}

// 當選擇熱門路線時
const handleRouteSelect = async (route) => {
  // 自動填入起訖點
  form.value.pickup = route.from
  form.value.dropoff = route.to
  
  if (!authStore.user) {
    alertStore.showAlert('請先登入')
    router.push('/login')
    return
  }
  
  // 跳轉到預約頁面
  router.push({
    path: '/booking',
    query: {
      from: route.from,
      to: route.to,
      price: route.price
    }
  })
}

// 檢查是否可以預約
const canBooking = computed(() => {
  return isPickupValid.value && 
         isDropoffValid.value && 
         form.value.pickup && 
         form.value.dropoff && 
         !isSameLocation()
})

// 檢查是否為相同地點
const isSameLocation = () => {
  if (!selectedPickupPlace.value || !selectedDropoffPlace.value) {
    return false
  }

  // 比較經緯度（考慮小數點誤差）
  const pickupLat = selectedPickupPlace.value.geometry?.location?.lat()
  const pickupLng = selectedPickupPlace.value.geometry?.location?.lng()
  const dropoffLat = selectedDropoffPlace.value.geometry?.location?.lat()
  const dropoffLng = selectedDropoffPlace.value.geometry?.location?.lng()

  const isSameCoordinates = 
    Math.abs(pickupLat - dropoffLat) < 0.0001 && 
    Math.abs(pickupLng - dropoffLng) < 0.0001

  // 比較地址文字
  const isSameAddress = form.value.pickup === form.value.dropoff

  return isSameCoordinates || isSameAddress
}

// 監聽地點變化
watch([() => form.value.pickup, () => form.value.dropoff], () => {
  sameLocationError.value = isSameLocation()
})

// 修改預約處理函數
const handleBooking = () => {
  if (!isPickupValid.value || !isDropoffValid.value) {
    alertStore.showAlert('請選擇有效的地址')
    return
  }

  if (!form.value.pickup || !form.value.dropoff) {
    alertStore.showAlert('請輸入上車地點和下車地點')
    return
  }

  if (isSameLocation()) {
    alertStore.showAlert('上車地點與下車地點不能相同')
    return
  }

  if (!authStore.user) {
    alertStore.showAlert('請先登入')
    router.push('/login')
    return
  }

  router.push({
    path: '/booking',
    query: {
      from: form.value.pickup,
      to: form.value.dropoff,
      fromLat: selectedPickupPlace.value?.geometry?.location?.lat(),
      fromLng: selectedPickupPlace.value?.geometry?.location?.lng(),
      toLat: selectedDropoffPlace.value?.geometry?.location?.lat(),
      toLng: selectedDropoffPlace.value?.geometry?.location?.lng()
    }
  })
}

onMounted(() => {
  initPlacesAutocomplete()
  routeStore.fetchHotRoutes()
})
</script> 

<style scoped>
.i-carbon-location {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
}
</style> 