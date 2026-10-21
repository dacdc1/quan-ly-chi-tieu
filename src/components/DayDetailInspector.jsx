import React from 'react'
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles
} from 'lucide-react'
import { formatCurrency, formatVietnameseDate } from '../utils/formatters'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../constants'
import CategoryIcon from './CategoryIcon'

export default function DayDetailInspector({
  selectedDate,
  transactions,
  dailyBudgetLimit,
  onOpenAddModalWithDate,
  onEditTransaction,
  onDeleteTransaction,
  onClearSelectedDate
}) {
  if (!selectedDate) return null

  const dayTransactions = transactions.filter(t => t.date === selectedDate)
  
  const dayExpense = dayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const dayIncome = dayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const isOverBudget = dayExpense > dailyBudgetLimit
  const diff = Math.abs(dayExpense - dailyBudgetLimit)

  const getCategoryDetails = (catId, type) => {
    const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
    return list.find(c => c.id === catId) || {
      name: catId,
      icon: 'MoreHorizontal',
      color: '#64748b'
    }
  }

  const getPaymentName = (methodId) => {
    const found = PAYMENT_METHODS.find(m => m.id === methodId)
    return found ? found.name : methodId
  }

  return (
    <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5 mb-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Nhật Ký: {formatVietnameseDate(selectedDate)}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Định mức chuẩn ngày: <strong>{formatCurrency(dailyBudgetLimit)}</strong>
          </p>
        </div>

        {/* Quick Summary Pill & Add button */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border ${
            dayExpense === 0
              ? 'bg-slate-50 text-slate-600 border-slate-200'
              : isOverBudget
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {dayExpense === 0 ? (
              <span>Chưa phát sinh chi</span>
            ) : isOverBudget ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Vượt {formatCurrency(diff)}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dư định mức {formatCurrency(diff)}</span>
              </>
            )}
          </div>

          <button
            onClick={() => onOpenAddModalWithDate(selectedDate)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm khoản</span>
          </button>
        </div>
      </div>

      {/* Transaction List of the Day */}
      <div className="mt-4">
        {dayTransactions.length === 0 ? (
          <div className="text-center py-8 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
            <Sparkles className="w-7 h-7 text-indigo-400 mx-auto mb-2 opacity-70" />
            <p className="text-xs font-semibold text-slate-700">Ngày này chưa có chi tiêu nào</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Bạn có thể bấm "+ Thêm khoản" để ghi lại các khoản tiêu của ngày này.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {dayTransactions.map((t) => {
              const isExpense = t.type === 'expense'
              const cat = getCategoryDetails(t.category, t.type)

              return (
                <div
                  key={t.id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          • {getPaymentName(t.paymentMethod)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-0.5">
                        {t.note || <span className="italic text-slate-400">Không ghi chú</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-sm font-bold flex items-center gap-0.5 ${
                        isExpense ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {isExpense ? '-' : '+'}{formatCurrency(t.amount)}
                    </span>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => onEditTransaction(t)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded transition"
                        title="Sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Bạn có chắc muốn xóa giao dịch này?')) {
                            onDeleteTransaction(t.id)
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
