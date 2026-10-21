import React from 'react'
import { PieChart as PieChartIcon } from 'lucide-react'
import { EXPENSE_CATEGORIES } from '../constants'
import { formatCurrency, formatCompactCurrency } from '../utils/formatters'
import CategoryIcon from './CategoryIcon'

export default function CategoryPieChart({
  transactions,
  selectedCategory,
  onSelectCategory
}) {
  // Filter only expenses
  const expenses = transactions.filter(t => t.type === 'expense')
  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount || 0), 0)

  // Aggregate by category
  const categoryTotals = {}
  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount || 0)
  })

  // Format and sort descending
  const data = Object.entries(categoryTotals)
    .map(([catId, amount]) => {
      const config = EXPENSE_CATEGORIES.find(c => c.id === catId) || {
        id: catId,
        name: catId,
        color: '#64748b',
        icon: 'MoreHorizontal'
      }
      const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0
      return {
        ...config,
        amount,
        percentage
      }
    })
    .sort((a, b) => b.amount - a.amount)

  // Calculate SVG Donut slices
  let accumulatedAngle = 0
  const radius = 38
  const circumference = 2 * Math.PI * radius

  const slices = data.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
    const strokeDashoffset = -((accumulatedAngle / 100) * circumference)
    accumulatedAngle += item.percentage
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset
    }
  })

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-indigo-600" />
            Cơ Cấu Chi Tiêu Theo Danh Mục
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phân bổ ngân sách vào các nhu cầu thiết yếu và giải trí
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Hiện tất cả
          </button>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          Chưa có chi tiêu nào trong tháng này để hiển thị biểu đồ.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Donut Chart SVG */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-48 h-48 sm:w-52 sm:h-52">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="16"
                />
                {/* Segments */}
                {slices.map((slice) => {
                  const isSelected = selectedCategory === slice.id
                  return (
                    <circle
                      key={slice.id}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isSelected ? "19" : "16"}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer hover:opacity-90"
                      onClick={() => onSelectCategory(isSelected ? null : slice.id)}
                    />
                  )
                })}
              </svg>

              {/* Center text in donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Tổng chi</span>
                <span className="text-sm sm:text-base font-bold text-slate-900 px-2 truncate max-w-[120px]">
                  {formatCompactCurrency(totalExpense)}
                </span>
                <span className="text-[10px] text-slate-400">{data.length} nhóm</span>
              </div>
            </div>
          </div>

          {/* Category Legend & Details */}
          <div className="md:col-span-7 space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {data.map((cat) => {
              const isSelected = selectedCategory === cat.id
              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                        <span>{cat.name}</span>
                        <span className="text-xs text-slate-400 font-normal">
                          ({cat.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-24 sm:w-36 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${cat.percentage}%`,
                            backgroundColor: cat.color
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block">
                      {formatCurrency(cat.amount)}
                    </span>
                    <span className="text-[11px] text-indigo-600 hover:underline">
                      {isSelected ? 'Đang lọc' : 'Lọc danh mục'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      )}
    </div>
  )
}
