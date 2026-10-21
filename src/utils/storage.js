import { formatDateKey, getMonthKey } from './formatters'
import { DEFAULT_BUDGET } from '../constants'

const TRANSACTIONS_KEY = 'quanlychitieu_transactions_v3'
const BUDGETS_KEY = 'quanlychitieu_budgets_v3'

/**
 * Empty by default as requested: clean slate for user to enter their own data
 */
export function generateInitialSampleData() {
  return []
}

/**
 * Load all transactions from localStorage (defaults to empty [])
 */
export function loadTransactions() {
  try {
    // Clear out old v1 cache if exists to guarantee empty month 10
    if (localStorage.getItem('quanlychitieu_transactions_v1')) {
      localStorage.removeItem('quanlychitieu_transactions_v1')
    }
    const raw = localStorage.getItem(TRANSACTIONS_KEY)
    if (!raw) {
      const initial = []
      saveTransactions(initial)
      return initial
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading transactions from localStorage:', err)
    return []
  }
}

/**
 * Save all transactions to localStorage
 */
export function saveTransactions(transactions) {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
  } catch (err) {
    console.error('Error saving transactions to localStorage:', err)
  }
}

/**
 * Load budgets map: { "YYYY-MM": { monthlyLimit: number, alertThresholdPercent: number } }
 */
export function loadBudgets() {
  try {
    const raw = localStorage.getItem(BUDGETS_KEY)
    if (!raw) {
      const currentMonthKey = getMonthKey()
      const initial = {
        [currentMonthKey]: {
          monthlyLimit: 10000000, // 10 triệu mặc định cho tháng
          alertThresholdPercent: 85
        }
      }
      saveBudgets(initial)
      return initial
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading budgets from localStorage:', err)
    return {}
  }
}

/**
 * Save budgets map to localStorage
 */
export function saveBudgets(budgets) {
  try {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets))
  } catch (err) {
    console.error('Error saving budgets to localStorage:', err)
  }
}

/**
 * Clear all transactions for a specific month
 */
export function clearMonthTransactions(monthKey) {
  try {
    const all = loadTransactions()
    const remaining = all.filter(t => !t.date || !t.date.startsWith(monthKey))
    saveTransactions(remaining)
    return remaining
  } catch (err) {
    console.error('Error clearing month transactions:', err)
    return []
  }
}
