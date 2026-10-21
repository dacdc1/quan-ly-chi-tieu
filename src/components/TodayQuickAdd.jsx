import React, { useState } from 'react'
import { Plus, Zap, Check, Calendar, ArrowRight, Tag } from 'lucide-react'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../constants'
import { formatDateKey, formatCurrency, formatVietnameseDate } from '../utils/formatters'
import CategoryIcon from './CategoryIcon'

export default function TodayQuickAdd({
  onAddTransaction,
  todayExpense,
  dailyBudgetLimit,
  selectedDate,
  onResetToToday
}) {
  const todayStr = formatDateKey(new Date())
  const activeDate = selectedDate || todayStr
  const isToday = activeDate === todayStr

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const remainingToday = Math.max(0, dailyBudgetLimit - todayExpense)

  const handleQuickPill = (val) => {
    const current = parseInt(amount, 10) || 0
    setAmount(String(current + val))
    setError('')
  }

  const handleAppendZeros = () => {
    if (!amount) {
      setAmount('1000')
      setError('')
      return
    }
    const clean = String(amount).replace(/^0+/, '')
    setAmount(`${clean || '1'}000`)
    setError('')
  }

  const handleQuickSubmit = (e) => {
    e.preventDefault()
    const numeric = parseInt(amount, 10)
    if (!numeric || numeric <= 0) {
      setError('Vui lòng nhập số tiền (> 0)')
      return
    }

    onAddTransaction({
      id: `tx-${Date.now()}`,
      type: 'expense',
      amount: numeric,
      date: activeDate,
      category,
      paymentMethod: 'cash',
      note: note.trim() || 'Chi tiêu nhanh',
      createdAt: new Date().toISOString()
    })

    setAmount('')
    setNote('')
    setError('')
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl shadow-md p-5 sm:p-6 text-white mb-6 border border-indigo-800/40">
      
      {/* Top Banner: Date & Daily Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                {isToday ? 'Ghi Nhanh Chi Tiêu Hôm Nay' : `Ghi Nhanh Cho Ngày: ${activeDate}`}
              </span>
              {isToday ? (
                <span className="text-[10px] uppercase font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Hôm nay
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onResetToToday}
                  className="text-[11px] text-indigo-300 hover:text-white underline ml-1"
                >
                  (Về hôm nay)
                </button>
              )}
            </div>
            <p className="text-xs text-indigo-200/80">
              {formatVietnameseDate(activeDate)}
            </p>
          </div>
        </div>

        {/* Status of Today */}
        {isToday && (
          <div className="flex items-center gap-4 text-xs bg-indigo-950/60 border border-indigo-800/80 px-3.5 py-2 rounded-xl">
            <div>
              <span className="text-indigo-300 block text-[10px]">Hôm nay đã tiêu</span>
              <span className="font-bold text-white">{formatCurrency(todayExpense)}</span>
            </div>
            <div className="w-px h-6 bg-indigo-800"></div>
            <div>
              <span className="text-indigo-300 block text-[10px]">Định mức còn lại</span>
              <span className={`font-bold ${todayExpense > dailyBudgetLimit ? 'text-rose-400' : 'text-emerald-400'}`}>
                {todayExpense > dailyBudgetLimit ? 'Đã vượt mức' : formatCurrency(remainingToday)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleQuickSubmit} className="mt-4 space-y-3.5">
        
        {/* Row 1: Amount & Note inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Amount input */}
          <div className="sm:col-span-5 relative flex items-center">
            <input
              type="number"
              min="1000"
              step="1000"
              placeholder="Nhập số tiền (VD: 50000)"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError('')
              }}
              className="w-full bg-indigo-950/80 border border-indigo-700/60 rounded-xl pl-4 pr-24 py-2.5 text-base sm:text-lg font-bold text-white placeholder:text-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
            <div className="absolute right-2.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAppendZeros}
                className="px-2 py-1 text-xs font-black bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white rounded-lg transition border border-indigo-400/50 shadow-xs flex items-center gap-0.5"
                title="Thêm 3 số 0 (nhân 1.000)"
              >
                <span className="text-[10px] opacity-80">+</span>000
              </button>
              <span className="text-xs font-bold text-indigo-300 pr-1">
                ₫
              </span>
            </div>
          </div>

          {/* Note input */}
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="Ghi chú (VD: Cơm trưa, Xăng xe...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-indigo-950/80 border border-indigo-700/60 rounded-xl px-4 py-2.5 text-sm font-medium text-white placeholder:text-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full h-full min-h-[44px] bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white font-bold text-sm rounded-xl px-4 py-2.5 shadow-sm transition flex items-center justify-center gap-2 group"
            >
              <Plus className="w-4 h-4 transition group-hover:rotate-90" />
              <span>Lưu khoản này</span>
            </button>
          </div>

        </div>

        {/* Row 2: Quick Amount Pills & Category Selection */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
          
          {/* Quick Amount Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-indigo-300 mr-1 font-medium">Chọn nhanh:</span>
            <button
              type="button"
              onClick={handleAppendZeros}
              className="text-xs bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white px-2.5 py-1 rounded-lg border border-indigo-400/60 transition font-bold shadow-xs flex items-center gap-1"
              title="Thêm 3 số 0 vào số tiền đang nhập"
            >
              <span>+000</span>
              <span className="text-[10px] opacity-80">(x1.000)</span>
            </button>
            {[20000, 30000, 50000, 100000, 200000, 500000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleQuickPill(v)}
                className="text-xs bg-indigo-800/60 hover:bg-indigo-700/80 active:bg-indigo-600 text-indigo-200 px-2.5 py-1 rounded-lg border border-indigo-700/50 transition font-semibold"
              >
                +{v >= 1000 ? `${v / 1000}k` : v}
              </button>
            ))}
          </div>

          {/* Category Quick Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] text-indigo-300 mr-1 font-medium shrink-0">Danh mục:</span>
            {EXPENSE_CATEGORIES.slice(0, 5).map((cat) => {
              const isSelected = category === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1.5 transition border ${
                    isSelected
                      ? 'bg-white text-indigo-950 font-bold border-white shadow-xs'
                      : 'bg-indigo-900/40 text-indigo-200 hover:bg-indigo-800/50 border-indigo-700/40'
                  }`}
                >
                  <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>

        </div>

        {error && (
          <div className="text-xs text-rose-300 bg-rose-950/50 border border-rose-800/60 p-2 rounded-lg font-medium">
            {error}
          </div>
        )}

      </form>

    </div>
  )
}
