import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../constants'

/**
 * Get category name by id
 */
function getCategoryName(categoryId, type) {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const found = list.find(c => c.id === categoryId)
  return found ? found.name : categoryId
}

/**
 * Get payment method name by id
 */
function getPaymentMethodName(methodId) {
  const found = PAYMENT_METHODS.find(m => m.id === methodId)
  return found ? found.name : methodId
}

/**
 * Export transactions to CSV (with UTF-8 BOM for Microsoft Excel compatibility)
 */
export function exportToCSV(transactions, monthKey) {
  const headers = ['Mã', 'Ngày', 'Loại', 'Danh mục', 'Số tiền (VND)', 'Phương thức', 'Ghi chú']
  
  const rows = transactions.map(t => [
    t.id,
    t.date,
    t.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
    `"${getCategoryName(t.category, t.type)}"`,
    t.amount,
    `"${getPaymentMethodName(t.paymentMethod)}"`,
    `"${(t.note || '').replace(/"/g, '""')}"`
  ])

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `chi_tieu_${monthKey || 'tat_ca'}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export all data to JSON (full backup)
 */
export function exportToJSON(transactions, budgets) {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    transactions,
    budgets
  }
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `sao_luu_chi_tieu_${new Date().toISOString().slice(0, 10)}.json`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Import data from JSON file
 */
export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
          throw new Error('Định dạng tệp JSON không hợp lệ.')
        }
        resolve(parsed)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Lỗi khi đọc tệp.'))
    reader.readAsText(file)
  })
}
