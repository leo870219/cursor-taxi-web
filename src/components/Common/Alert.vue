<template>
  <Transition name="fade">
    <div
      v-if="show"
      :class="[
        'fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50',
        type === 'error' 
          ? 'bg-[--error-light] text-[--error]' 
          : 'bg-[--success-light] text-[--success]'
      ]"
    >
      <div class="flex items-center">
        <i 
          :class="[
            'mr-2',
            type === 'error' 
              ? 'i-carbon-warning-filled text-[--error]' 
              : 'i-carbon-checkmark-filled text-[--success]'
          ]"
        ></i>
        <span class="text-sm font-medium">{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String,
    default: 'error'
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>