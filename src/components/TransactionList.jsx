import React, { useState } from 'react'
import {
  Search,
  Filter,
  Trash2,
  Edit2,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  X
} from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../constants'
import { formatCurrency, formatVietnameseDate } from '../utils/formatters'
import CategoryIcon from './CategoryIcon'

export default function TransactionList({
  transactions,
  selectedDate,
  onClearDateFilter,
  selectedCategory,
  onClearCategoryFilter,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction
}) {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' | 'expense' | 'income'

  // Filter transactions
  const filtered = transactions.filter((t) => {
    // Filter by date
    if (selectedDate && t.date !== selectedDate) return false

    // Filter by type
    if (filterType !== 'all' && t.type !== filterType) return false

    // Filter by category
    if (selectedCategory && t.category !== selectedCategory) return false

    // Filter by keyword (note or amount)
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase()
      const noteMatch = (t.note || '').toLowerCase().includes(kw)
      const amountMatch = String(t.amount || '').includes(kw)
      if (!noteMatch && !amountMatch) return false
    }

    return true
  })

  // Sort descending by date, then createdAt
  const sorted = [...filtered].sort((a, b) => {
    if (b.date !== a.date) {
      return b.date.localeCompare(a.date)
    }
    return (b.createdAt || '').localeCompare(a.createdAt || '')
  })

  const getCategoryDetails = (catId, type) => {
    const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
    return list.find(c => c.id === catId) || {
      name: catId,
      icon: 'MoreHorizontal',
      color: '#64748b',
      bgLight: '#f1f5f9'
    }
  }

  const getPaymentName = (methodId) => {
    const found = PAYMENT_METHODS.find(m => m.id === methodId)
    return found ? found.name : methodId
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 mb-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Danh Sách Chi Tiêu & Thu Nhập
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filtered.length} khoản
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedDate
              ? `Đang hiển thị riêng cho: ${formatVietnameseDate(selectedDate)}`
              : 'Hiển thị các giao dịch trong tháng theo trình tự thời gian'}
          </p>
        </div>

        {/* Filter buttons & Search input */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo ghi chú, số tiền..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type tabs */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-medium border border-slate-200">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterType === 'expense'
                  ? 'bg-white text-rose-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Chi tiêu
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterType === 'income'
                  ? 'bg-white text-emerald-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Thu nhập
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {(selectedDate || selectedCategory) && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-slate-400 font-medium">Đang lọc theo:</span>
          {selectedDate && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Calendar className="w-3.5 h-3.5" />
              Ngày: {selectedDate}
              <button
                onClick={onClearDateFilter}
                className="hover:text-indigo-950 p-0.5 rounded"
                title="Bỏ lọc ngày"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              Danh mục: {getCategoryDetails(selectedCategory, 'expense').name}
              <button
                onClick={onClearCategoryFilter}
                className="hover:text-purple-950 p-0.5 rounded"
                title="Bỏ lọc danh mục"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Transaction Items */}
      {sorted.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Chưa tìm thấy giao dịch phù hợp</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {selectedDate
              ? `Ngày ${selectedDate} chưa có ghi chép nào. Bạn có thể thêm ngay bên dưới.`
              : 'Hãy ghi lại các khoản tiêu hoặc thu nhập hàng ngày để theo dõi sát sao.'}
          </p>
          <button
            onClick={() => onOpenAddModal(selectedDate || undefined)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm giao dịch ngay</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((t) => {
            const isExpense = t.type === 'expense'
            const cat = getCategoryDetails(t.category, t.type)

            return (
              <div
                key={t.id}
                className="group p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-all flex items-center justify-between gap-3 shadow-xs"
              >
                {/* Left: Category Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    <CategoryIcon name={cat.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {cat.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatVietnameseDate(t.date)}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-900 truncate mt-0.5">
                      {t.note || <span className="italic text-slate-400">Không có ghi chú</span>}
                    </p>

                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {getPaymentName(t.paymentMethod)}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-sm sm:text-base font-bold flex items-center justify-end gap-0.5 ${
                        isExpense ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {isExpense ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                      {formatCurrency(t.amount)}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onEditTransaction(t)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này không?')) {
                          onDeleteTransaction(t.id)
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
