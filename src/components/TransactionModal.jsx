import React, { useState, useEffect } from 'react'
import { X, Check, Plus, Minus, Calendar, Tag, CreditCard, FileText } from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../constants'
import { formatDateKey, formatCurrency } from '../utils/formatters'
import CategoryIcon from './CategoryIcon'

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  defaultDate = null
}) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(defaultDate || formatDateKey(new Date()))
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id)
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense')
      setAmount(String(initialData.amount || ''))
      setDate(initialData.date || formatDateKey(new Date()))
      setCategory(initialData.category || EXPENSE_CATEGORIES[0].id)
      setPaymentMethod(initialData.paymentMethod || PAYMENT_METHODS[0].id)
      setNote(initialData.note || '')
    } else {
      setType('expense')
      setAmount('')
      setDate(defaultDate || formatDateKey(new Date()))
      setCategory(EXPENSE_CATEGORIES[0].id)
      setPaymentMethod(PAYMENT_METHODS[0].id)
      setNote('')
    }
    setError('')
  }, [initialData, defaultDate, isOpen])

  // When switching type, reset category if not compatible
  const handleTypeChange = (newType) => {
    setType(newType)
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0].id)
    } else {
      setCategory(EXPENSE_CATEGORIES[0].id)
    }
  }

  const handleQuickAmount = (val) => {
    const current = parseInt(amount, 10) || 0
    setAmount(String(current + val))
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const numericAmount = parseInt(amount, 10)
    if (!numericAmount || numericAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ (> 0)')
      return
    }

    if (!date) {
      setError('Vui lòng chọn ngày')
      return
    }

    onSave({
      id: initialData ? initialData.id : `tx-${Date.now()}`,
      type,
      amount: numericAmount,
      date,
      category,
      paymentMethod,
      note: note.trim(),
      createdAt: initialData ? initialData.createdAt : new Date().toISOString()
    })

    onClose()
  }

  if (!isOpen) return null

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {initialData ? 'Chỉnh Sửa Giao Dịch' : 'Thêm Giao Dịch Mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Type Toggle: Expense / Income */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              Chi tiêu
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Thu nhập
            </button>
          </div>

          {/* Amount input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Số tiền (VND) <span className="text-rose-500">*</span>
              </label>
              {amount && parseInt(amount, 10) > 0 && (
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  = {formatCurrency(parseInt(amount, 10))}
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                type="number"
                placeholder="0"
                min="1000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-xl font-bold text-slate-900 pl-4 pr-24 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-300"
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

            {/* Quick amount suggestion buttons */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <button
                type="button"
                onClick={handleAppendZeros}
                className="px-2.5 py-1 text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 border border-indigo-200 rounded-lg transition shadow-xs flex items-center gap-1"
                title="Bấm để thêm 3 số 0 vào số tiền đang nhập"
              >
                <span>+000</span>
                <span className="text-[10px] text-indigo-500 font-normal">(x1.000)</span>
              </button>
              {[50000, 100000, 200000, 500000, 1000000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleQuickAmount(v)}
                  className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  +{formatCurrency(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Ngày giao dịch <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Danh mục
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-100 rounded-xl">
              {categories.map((cat) => {
                const isSelected = category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition border ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold shadow-xs'
                        : 'border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}25`, color: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              Phương thức thanh toán
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full text-sm font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Ghi chú mô tả (Tùy chọn)
            </label>
            <input
              type="text"
              placeholder="VD: Cơm trưa với đồng nghiệp, Mua sách..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 font-medium">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Cập nhật' : 'Lưu giao dịch'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
