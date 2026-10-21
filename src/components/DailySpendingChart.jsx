import React, { useState } from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'
import { formatCurrency, formatCompactCurrency, getDaysInMonth, formatDateKey } from '../utils/formatters'

export default function DailySpendingChart({
  currentMonth,
  transactions,
  budget,
  selectedDate,
  onSelectDate
}) {
  const [hoveredDay, setHoveredDay] = useState(null)

  const [yearStr, monthStr] = currentMonth.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)
  const daysInMonth = getDaysInMonth(year, month)

  const dailyTarget = Math.round((budget.monthlyLimit || 12000000) / daysInMonth)
  const todayStr = formatDateKey(new Date())

  // Compile daily data
  const days = []
  let maxSpend = dailyTarget * 1.2 // ensure at least some minimum height
  let highestSpendDay = null

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayTransactions = transactions.filter(t => t.date === dateStr)
    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    if (expense > maxSpend) {
      maxSpend = expense
    }

    if (expense > 0 && (!highestSpendDay || expense > highestSpendDay.expense)) {
      highestSpendDay = { day: d, dateStr, expense }
    }

    days.push({
      day: d,
      dateStr,
      expense,
      income,
      count: dayTransactions.length,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDate
    })
  }

  // Calculate target line percentage position from bottom (0 to 100)
  const targetPercent = Math.min(100, Math.round((dailyTarget / maxSpend) * 100))

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Biểu Đồ Chi Tiêu Từng Ngày
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi phân bổ ngân sách và biến động chi tiêu xuyên suốt cả tháng
          </p>
        </div>

        {highestSpendDay && (
          <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            <span>Ngày chi nhiều nhất: <strong>Ngày {highestSpendDay.day}</strong> ({formatCompactCurrency(highestSpendDay.expense)})</span>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="relative pt-6 pb-2">
        
        {/* Horizontal Target Limit Line */}
        <div
          className="absolute left-0 right-0 border-b border-dashed border-rose-400 z-10 pointer-events-none flex items-center justify-end"
          style={{ bottom: `calc(${targetPercent}% * 0.85 + 24px)` }}
        >
          <span className="text-[10px] font-semibold text-rose-600 bg-white/95 px-1.5 py-0.5 rounded shadow-xs border border-rose-200 mr-1 -translate-y-1/2">
            Hạn mức ngày: {formatCompactCurrency(dailyTarget)}
          </span>
        </div>

        {/* Bars Grid */}
        <div className="h-52 flex items-end justify-between gap-1 sm:gap-1.5 px-1 relative">
          {days.map((item) => {
            const heightPercent = maxSpend > 0 ? (item.expense / maxSpend) * 85 : 0
            const isOver = item.expense > dailyTarget

            return (
              <div
                key={item.day}
                onClick={() => onSelectDate(item.isSelected ? null : item.dateStr)}
                onMouseEnter={() => setHoveredDay(item)}
                onMouseLeave={() => setHoveredDay(null)}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group relative"
              >
                {/* Bar */}
                <div className="w-full max-w-[24px] flex items-end justify-center h-full">
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 relative ${
                      item.isSelected
                        ? 'ring-2 ring-indigo-600 ring-offset-1 ' + (isOver ? 'bg-rose-600' : 'bg-indigo-600')
                        : item.isToday
                        ? (isOver ? 'bg-rose-500 shadow-sm' : 'bg-indigo-600 shadow-sm')
                        : item.expense > 0
                        ? (isOver ? 'bg-rose-400 group-hover:bg-rose-500' : 'bg-indigo-400 group-hover:bg-indigo-500')
                        : 'bg-slate-100 group-hover:bg-slate-200'
                    }`}
                    style={{
                      height: `${Math.max(item.expense > 0 ? heightPercent : 4, 3)}%`,
                    }}
                  >
                    {/* Small dot if income exists */}
                    {item.income > 0 && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    )}
                  </div>
                </div>

                {/* Day label below */}
                <span
                  className={`text-[10px] sm:text-xs mt-2 transition font-medium ${
                    item.isSelected
                      ? 'text-indigo-600 font-bold'
                      : item.isToday
                      ? 'text-indigo-600 font-bold underline'
                      : 'text-slate-500 group-hover:text-slate-900'
                  }`}
                >
                  {item.day}
                </span>

                {/* Hover Tooltip */}
                {hoveredDay && hoveredDay.day === item.day && (
                  <div className="absolute bottom-full mb-3 z-30 bg-slate-900 text-white text-xs rounded-xl py-2 px-3 shadow-xl pointer-events-none whitespace-nowrap -translate-x-1/2 left-1/2 animate-fade-in border border-slate-700">
                    <div className="font-semibold text-slate-200 text-center pb-1 border-b border-slate-800">
                      Ngày {item.day}/{month}/{year} {item.isToday ? '(Hôm nay)' : ''}
                    </div>
                    <div className="pt-1.5 space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-400">Chi tiêu:</span>
                        <span className={`font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {formatCurrency(item.expense)}
                        </span>
                      </div>
                      {item.income > 0 && (
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-400">Thu nhập:</span>
                          <span className="font-bold text-emerald-400">
                            +{formatCurrency(item.income)}
                          </span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 text-center pt-0.5">
                        {item.count} giao dịch • Click để lọc
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Chart Footer description */}
      <div className="mt-2 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-400"></span>
            <span>Chi trong hạn mức</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-400"></span>
            <span>Vượt hạn mức ngày</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Có khoản thu nhập</span>
          </div>
        </div>
        <span>Nhấn vào cột để lọc chi tiết các khoản tiêu ngày đó</span>
      </div>

    </div>
  )
}
