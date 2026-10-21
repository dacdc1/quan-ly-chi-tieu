import React, { useState, useEffect } from 'react'
import { X, Check, SlidersHorizontal, Calculator, Sparkles } from 'lucide-react'
import { formatCurrency, getDaysInMonth } from '../utils/formatters'

export default function BudgetModal({
  isOpen,
  onClose,
  currentMonth,
  currentBudget,
  onSaveBudget
}) {
  const [yearStr, monthStr] = currentMonth.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)
  const daysInMonth = getDaysInMonth(year, month)

  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [alertThresholdPercent, setAlertThresholdPercent] = useState(85)

  useEffect(() => {
    if (currentBudget) {
      setMonthlyLimit(String(currentBudget.monthlyLimit || 12000000))
      setAlertThresholdPercent(currentBudget.alertThresholdPercent || 85)
    }
  }, [currentBudget, isOpen])

  if (!isOpen) return null

  const numLimit = parseInt(monthlyLimit, 10) || 0
  const dailyTarget = daysInMonth > 0 ? Math.round(numLimit / daysInMonth) : 0

  const handleQuickBudget = (amount) => {
    setMonthlyLimit(String(amount))
  }

  const handleAppendZeros = () => {
    if (!monthlyLimit) {
      setMonthlyLimit('1000000')
      return
    }
    const clean = String(monthlyLimit).replace(/^0+/, '')
    setMonthlyLimit(`${clean || '1'}000`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSaveBudget({
      monthlyLimit: numLimit,
      alertThresholdPercent: parseInt(alertThresholdPercent, 10) || 85
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Thiết Lập Ngân Sách</h3>
              <p className="text-xs text-slate-500">Áp dụng cho Tháng {month}/{year}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Monthly limit */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Hạn mức chi tiêu cả tháng (VND)
              </label>
              {monthlyLimit && parseInt(monthlyLimit, 10) > 0 && (
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  = {formatCurrency(parseInt(monthlyLimit, 10))}
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                step="500000"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="w-full text-xl font-bold text-slate-900 pl-4 pr-24 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                autoFocus
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleAppendZeros}
                  className="px-2.5 py-1 text-xs font-black bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg transition shadow-xs flex items-center gap-0.5"
                  title="Thêm 3 số 0 (nhân 1.000)"
                >
                  <span className="text-[10px] opacity-80">+</span>000
                </button>
                <span className="text-sm font-bold text-slate-400 pr-1">
                  ₫
                </span>
              </div>
            </div>

            {/* Quick choices */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {[8000000, 10000000, 12000000, 15000000, 20000000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleQuickBudget(v)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition font-medium ${
                    numLimit === v
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {formatCurrency(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Calculation Preview Box */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-indigo-800 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Định mức mỗi ngày (chia đều):
                </span>
                <div className="text-lg font-bold text-indigo-950">
                  {formatCurrency(dailyTarget)}
                  <span className="text-xs font-normal text-indigo-700 ml-1">/ngày ({daysInMonth} ngày)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Threshold alert */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Cảnh báo khi đã tiêu đạt mức:
              </label>
              <span className="text-xs font-bold text-indigo-600">
                {alertThresholdPercent}% ngân sách
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={alertThresholdPercent}
              onChange={(e) => setAlertThresholdPercent(e.target.value)}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Hệ thống sẽ hiển thị cảnh báo màu vàng khi bạn đã chi tiêu trên {alertThresholdPercent}% hạn mức tháng ({formatCurrency(Math.round((numLimit * alertThresholdPercent) / 100))}).
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Áp dụng ngân sách</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
