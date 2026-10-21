import { formatDateKey, getMonthKey } from './formatters'
import { DEFAULT_BUDGET } from '../constants'

function getTxKey(userId) {
  return userId ? `quanlychitieu_tx_${userId}_v1` : 'quanlychitieu_transactions_v3'
}

function getBudgetKey(userId) {
  return userId ? `quanlychitieu_budgets_${userId}_v1` : 'quanlychitieu_budgets_v3'
}

/**
 * Empty by default as requested: clean slate for user to enter their own data
 */
export function generateInitialSampleData() {
  return []
}

/**
 * Load all transactions from localStorage for a specific user
 */
export function loadTransactions(userId = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return []
    const key = getTxKey(userId)
    const raw = localStorage.getItem(key)
    if (!raw) {
      // If user-specific key is empty but global transactions exist, migrate them
      if (userId) {
        const oldGlobal = localStorage.getItem('quanlychitieu_transactions_v3')
        if (oldGlobal) {
          const parsed = JSON.parse(oldGlobal)
          if (Array.isArray(parsed) && parsed.length > 0) {
            saveTransactions(parsed, userId)
            return parsed
          }
        }
      }
      return []
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading transactions from localStorage:', err)
    return []
  }
}

/**
 * Save all transactions to localStorage for a specific user
 */
export function saveTransactions(transactions, userId = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    const key = getTxKey(userId)
    localStorage.setItem(key, JSON.stringify(transactions))
  } catch (err) {
    console.error('Error saving transactions to localStorage:', err)
  }
}

/**
 * Load budgets map for a specific user
 */
export function loadBudgets(userId = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return {}
    const key = getBudgetKey(userId)
    const raw = localStorage.getItem(key)
    if (!raw) {
      const currentMonthKey = getMonthKey()
      const initial = {
        [currentMonthKey]: {
          monthlyLimit: 10000000,
          alertThresholdPercent: 85
        }
      }
      saveBudgets(initial, userId)
      return initial
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading budgets from localStorage:', err)
    return {}
  }
}

/**
 * Save budgets map for a specific user
 */
export function saveBudgets(budgets, userId = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    const key = getBudgetKey(userId)
    localStorage.setItem(key, JSON.stringify(budgets))
  } catch (err) {
    console.error('Error saving budgets to localStorage:', err)
  }
}

/**
 * Clear all transactions for a specific month for a user
 */
export function clearMonthTransactions(monthKey, userId = null) {
  try {
    const all = loadTransactions(userId)
    const remaining = all.filter(t => !t.date || !t.date.startsWith(monthKey))
    saveTransactions(remaining, userId)
    return remaining
  } catch (err) {
    console.error('Error clearing month transactions:', err)
    return []
  }
}
