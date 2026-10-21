import React from 'react'
import {
  Calendar as CalendarIcon,
  Plus,
  AlertCircle,
  CheckCircle,
  Filter,
  X
} from 'lucide-react'
import { formatCompactCurrency, formatCurrency, getDaysInMonth, formatDateKey } from '../utils/formatters'

export default function DailyCalendarView({
  currentMonth,
  transactions,
  budget,
  selectedDate,
  onSelectDate,
  onOpenAddModalWithDate
}) {
  const [yearStr, monthStr] = currentMonth.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)

  const daysInMonth = getDaysInMonth(year, month)
  
  // Calculate day of week of the 1st day of month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  // Let's use Monday as starting day of week (European / Vietnamese standard)
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
  // Adjust so Monday = 0, Tuesday = 1, ..., Sunday = 6
  const startOffset = (firstDayOfWeek + 6) % 7

  const todayStr = formatDateKey(new Date())

  // Calculate default daily budget threshold
  const dailyTarget = Math.round((budget.monthlyLimit || 12000000) / daysInMonth)

  // Aggregate daily expenses and incomes
  const dailyStats = {}
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    dailyStats[dayStr] = {
      expense: 0,
      income: 0,
      count: 0,
      items: []
    }
  }

  transactions.forEach(t => {
    if (dailyStats[t.date]) {
      if (t.type === 'expense') {
        dailyStats[t.date].expense += Number(t.amount || 0)
      } else {
        dailyStats[t.date].income += Number(t.amount || 0)
      }
      dailyStats[t.date].count += 1
      dailyStats[t.date].items.push(t)
    }
  })

  const weekHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 mb-6">
      
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            Lịch Chi Tiêu Theo Ngày
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhấn vào ngày để lọc giao dịch hoặc bấm dấu <strong>+</strong> để thêm chi tiêu cho ngày đó. 
            Định mức gợi ý: <span className="font-semibold text-slate-700">{formatCurrency(dailyTarget)}/ngày</span>
          </p>
        </div>

        {/* Selected date tag with clear button */}
        {selectedDate && (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs px-3 py-1.5 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Đang lọc ngày: <strong>{selectedDate}</strong></span>
            <button
              onClick={() => onSelectDate(null)}
              className="p-0.5 hover:bg-indigo-200/70 rounded text-indigo-600 hover:text-indigo-900 transition ml-1"
              title="Xem toàn bộ tháng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 bg-slate-100/80 text-center border-b border-slate-200 text-xs font-semibold text-slate-600 py-2">
          {weekHeaders.map((day, idx) => (
            <div key={day} className={idx >= 5 ? 'text-rose-500' : ''}>
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-50/30">
          {/* Empty cells before start offset */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[82px] sm:min-h-[96px] bg-slate-50/50 p-1.5" />
          ))}

          {/* Actual days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
            const data = dailyStats[dateStr] || { expense: 0, income: 0, count: 0 }
            const isToday = dateStr === todayStr
            const isSelected = selectedDate === dateStr
            const isOverBudget = data.expense > dailyTarget

            let statusBg = 'hover:bg-indigo-50/30'
            let statusBorder = ''
            
            if (isSelected) {
              statusBorder = 'ring-2 ring-indigo-600 ring-inset bg-indigo-50/60'
            } else if (data.expense > 0) {
              if (isOverBudget) {
                statusBg = 'bg-rose-50/60 hover:bg-rose-100/60'
              } else {
                statusBg = 'bg-emerald-50/40 hover:bg-emerald-100/50'
              }
            }

            return (
              <div
                key={dateStr}
                onClick={() => onSelectDate(isSelected ? null : dateStr)}
                className={`min-h-[82px] sm:min-h-[96px] p-2 relative cursor-pointer transition flex flex-col justify-between group ${statusBg} ${statusBorder}`}
              >
                {/* Top of day cell: day number and add button */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : isSelected
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-700'
                    }`}
                  >
                    {dayNum}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenAddModalWithDate(dateStr)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-white transition"
                    title={`Thêm giao dịch ngày ${dayNum}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content: Daily Expense / Income */}
                <div className="mt-1">
                  {data.expense > 0 ? (
                    <div>
                      <div
                        className={`text-xs font-bold leading-tight ${
                          isOverBudget ? 'text-rose-600' : 'text-slate-900'
                        }`}
                      >
                        -{formatCompactCurrency(data.expense)}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`text-[10px] px-1 py-0.2 rounded font-medium ${
                            isOverBudget
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isOverBudget ? 'Vượt mức' : 'Hợp lý'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-300 italic group-hover:text-slate-400">
                      0 ₫
                    </div>
                  )}

                  {data.income > 0 && (
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      +{formatCompactCurrency(data.income)}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 text-xs text-slate-500 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300"></span>
            <span>Chi tiêu an toàn (≤ {formatCompactCurrency(dailyTarget)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-300"></span>
            <span>Vượt định mức (&gt; {formatCompactCurrency(dailyTarget)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600 text-white text-[8px] flex items-center justify-center font-bold">●</span>
            <span>Hôm nay</span>
          </div>
        </div>

        {selectedDate && (
          <button
            onClick={() => onSelectDate(null)}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Bỏ chọn ngày / Xem cả tháng
          </button>
        )}
      </div>

    </div>
  )
}
