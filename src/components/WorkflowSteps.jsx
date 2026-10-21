import React from 'react'
import {
  Wallet,
  CalendarCheck,
  PieChart,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { formatCurrency, formatCompactCurrency, getDaysInMonth } from '../utils/formatters'

export default function WorkflowSteps({
  currentMonth,
  monthlyBudget,
  totalExpense,
  todayExpense,
  activeTab,
  setActiveTab,
  onOpenBudgetModal,
  onOpenAddModal
}) {
  const [yearStr, monthStr] = currentMonth.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)
  const daysInMonth = getDaysInMonth(year, month)

  const limit = monthlyBudget.monthlyLimit || 0
  const dailyTarget = daysInMonth > 0 ? Math.round(limit / daysInMonth) : 0
  const remaining = limit - totalExpense
  const spentPercent = limit > 0 ? Math.round((totalExpense / limit) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 mb-6">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Luồng Quản Lý Chi Tiêu Tháng {month}/{year}
          </h2>
        </div>
        <span className="text-[11px] font-medium text-indigo-600 hidden sm:inline">
          3 bước chuẩn: Cài đặt ➔ Ghi chép ngày ➔ Đánh giá
        </span>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* BƯỚC 1: Cài đặt ngân sách */}
        <div
          onClick={onOpenBudgetModal}
          className="group relative p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-300 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
              BƯỚC 1: NGÂN SÁCH
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">
              {limit > 0 ? formatCurrency(limit) : 'Chưa đặt ngân sách'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Định mức ngày: <strong className="text-indigo-900">{formatCurrency(dailyTarget)}</strong>/ngày
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-indigo-100/60 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
            <span>Bấm để chỉnh ngân sách</span>
            <ChevronRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* BƯỚC 2: Ghi chép từng ngày */}
        <div
          onClick={() => setActiveTab('daily')}
          className={`group relative p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'daily'
              ? 'border-emerald-300 bg-emerald-50/50 ring-2 ring-emerald-500/20'
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              BƯỚC 2: CHI TIÊU HÔM NAY
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
              {formatCurrency(todayExpense)}
              <span className="text-xs font-normal text-slate-400 ml-1">/ {formatCompactCurrency(dailyTarget)}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {todayExpense === 0 ? (
                <span className="text-emerald-600 font-medium">Chưa có khoản chi nào hôm nay</span>
              ) : todayExpense <= dailyTarget ? (
                <span className="text-emerald-600 font-medium">Chi tiêu trong hạn mức an toàn</span>
              ) : (
                <span className="text-rose-600 font-medium">Hôm nay đã vượt định mức ngày</span>
              )}
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
            <span>Ghi chép & Lịch ngày</span>
            <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* BƯỚC 3: Tổng kết & Báo cáo */}
        <div
          onClick={() => setActiveTab('analytics')}
          className={`group relative p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'analytics'
              ? 'border-purple-300 bg-purple-50/50 ring-2 ring-purple-500/20'
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md">
              BƯỚC 3: TỔNG KẾT THÁNG
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <PieChart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition">
              Còn lại: {formatCurrency(remaining)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Đã tiêu: <strong className="text-slate-800">{formatCurrency(totalExpense)}</strong> ({spentPercent}%)
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-purple-700 font-semibold">
            <span>Xem biểu đồ phân tích</span>
            <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
          </div>
        </div>

      </div>

    </div>
  )
}
