<template>
  <div 
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-4 rounded-lg">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-[--primary] border-t-transparent"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean
})
</script> 