/**
 * Format number into Vietnamese Dong currency string
 * e.g. 150000 -> "150.000 ₫"
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Compact currency for charts or badges
 * e.g. 15000000 -> "15 tr", 350000 -> "350k"
 */
export function formatCompactCurrency(amount) {
  if (!amount || isNaN(amount)) return '0 ₫'
  if (Math.abs(amount) >= 1000000) {
    const val = amount / 1000000
    return `${Number(val.toFixed(1))} tr`
  }
  if (Math.abs(amount) >= 1000) {
    const val = amount / 1000
    return `${Number(val.toFixed(0))}k`
  }
  return `${amount} ₫`
}

/**
 * Get days in a specific month (1-based month, e.g. 10 for October)
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

/**
 * Format Date to YYYY-MM-DD
 */
export function formatDateKey(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format Date to Vietnamese readable: "Thứ Hai, 19/10/2026"
 */
export function formatVietnameseDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const dayOfWeek = days[date.getDay()]
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${dayOfWeek}, ${day}/${month}/${year}`
}

/**
 * Get month string "YYYY-MM"
 */
export function getMonthKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}
