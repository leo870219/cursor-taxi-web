export const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

export const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  })
} 