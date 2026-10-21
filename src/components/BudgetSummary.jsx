import React from 'react'
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { formatCurrency, formatCompactCurrency, getDaysInMonth } from '../utils/formatters'

export default function BudgetSummary({
  currentMonth,
  transactions,
  budget,
  onOpenBudgetModal
}) {
  const [yearStr, monthStr] = currentMonth.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)

  const totalDays = getDaysInMonth(year, month)
  
  // Check if current view is the active ongoing month
  const today = new Date()
  const isCurrentActiveMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month
  
  // Passed days and remaining days calculation
  let passedDays = totalDays
  let remainingDays = 0

  if (isCurrentActiveMonth) {
    passedDays = Math.min(today.getDate(), totalDays)
    remainingDays = Math.max(1, totalDays - passedDays + 1) // includes today
  } else if (today < new Date(year, month - 1, 1)) {
    // Future month
    passedDays = 0
    remainingDays = totalDays
  } else {
    // Past month
    passedDays = totalDays
    remainingDays = 0
  }

  // Calculate totals for this month
  const monthExpenses = transactions.filter(t => t.type === 'expense')
  const totalExpense = monthExpenses.reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const monthIncomes = transactions.filter(t => t.type === 'income')
  const totalIncome = monthIncomes.reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const monthlyLimit = budget.monthlyLimit || 0
  const remainingBudget = monthlyLimit - totalExpense
  const spentPercent = monthlyLimit > 0 ? Math.round((totalExpense / monthlyLimit) * 100) : 0

  // Daily calculations
  const avgDailySpent = passedDays > 0 ? Math.round(totalExpense / passedDays) : 0
  const initialDailyBudget = totalDays > 0 ? Math.round(monthlyLimit / totalDays) : 0
  
  let safeDailyBudgetRemaining = 0
  if (remainingDays > 0 && remainingBudget > 0) {
    safeDailyBudgetRemaining = Math.round(remainingBudget / remainingDays)
  }

  // Health Status
  let statusBadge = {
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: CheckCircle2,
    text: 'Chi tiêu rất tốt'
  }

  if (spentPercent > 100) {
    statusBadge = {
      color: 'text-red-700 bg-red-50 border-red-200',
      icon: AlertTriangle,
      text: 'Đã vượt quá ngân sách'
    }
  } else if (spentPercent >= (budget.alertThresholdPercent || 85)) {
    statusBadge = {
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      icon: AlertTriangle,
      text: 'Sắp chạm ngưỡng tối đa'
    }
  } else if (avgDailySpent > initialDailyBudget && passedDays > 3) {
    statusBadge = {
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      icon: AlertTriangle,
      text: 'Tốc độ tiêu nhanh hơn định mức'
    }
  }

  const StatusIcon = statusBadge.icon

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 mb-6">
      
      {/* Top row: Status Banner & Quick Edit */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {statusBadge.text}
          </span>
          <span className="text-xs text-slate-500">
            {isCurrentActiveMonth ? `Hôm nay là ngày ${passedDays}/${totalDays} (còn ${remainingDays} ngày)` : `Tháng có ${totalDays} ngày`}
          </span>
        </div>

        <button
          onClick={onOpenBudgetModal}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
        >
          <span>Ngân sách tháng: {formatCurrency(monthlyLimit)}</span>
          <span className="underline ml-1">Thay đổi</span>
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-5">
        
        {/* Card 1: Tổng chi tiêu */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng Đã Chi</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(totalExpense)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{spentPercent}%</span> của ngân sách
            </div>
          </div>
        </div>

        {/* Card 2: Ngân sách còn lại */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ngân Sách Còn Lại</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${remainingBudget >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold tracking-tight ${remainingBudget >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(remainingBudget)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {remainingBudget >= 0 ? 'Trong hạn mức an toàn' : 'Vượt mức dự kiến'}
            </div>
          </div>
        </div>

        {/* Card 3: Chi tiêu an toàn mỗi ngày (FEATURE FOCUS) */}
        <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100/80 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 opacity-10">
            <Sparkles className="w-20 h-20 text-indigo-700" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Định Mức Ngày Còn Lại
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-950 tracking-tight">
              {remainingDays > 0 ? formatCurrency(safeDailyBudgetRemaining) : '0 ₫'}
              <span className="text-xs font-normal text-indigo-700 ml-1">/ngày</span>
            </div>
            <div className="mt-1 text-xs text-indigo-700/90">
              {remainingDays > 0 ? (
                <>Chia đều cho <strong className="font-semibold">{remainingDays} ngày</strong> tiếp theo</>
              ) : (
                'Tháng đã hoàn thành'
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Tổng thu nhập & Số dư */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng Thu Nhập</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(totalIncome)}
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              Dòng tiền ròng:
              <span className={`font-semibold ${totalIncome - totalExpense >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {totalIncome - totalExpense >= 0 ? '+' : ''}{formatCurrency(totalIncome - totalExpense)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Progress Bar: Percent of budget consumed vs month passed */}
      <div className="pt-2">
        <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-medium">
          <span>Tiến độ chi tiêu tháng: <strong>{spentPercent}%</strong></span>
          <span>
            TB đã tiêu: <strong className="text-slate-800">{formatCurrency(avgDailySpent)}</strong>/ngày 
            (kế hoạch gốc: {formatCurrency(initialDailyBudget)}/ngày)
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              spentPercent > 100
                ? 'bg-red-500'
                : spentPercent > (budget.alertThresholdPercent || 85)
                ? 'bg-amber-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${Math.min(spentPercent, 100)}%` }}
          />
        </div>
      </div>

    </div>
  )
}
