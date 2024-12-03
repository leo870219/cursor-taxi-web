export const emailValidator = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const phoneValidator = (phone) => {
  const re = /^09\d{8}$/
  return re.test(phone)
}

export const passwordValidator = (password) => {
  return password.length >= 6
} 