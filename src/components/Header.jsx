import React, { useState, useRef, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  SlidersHorizontal,
  Download,
  Upload,
  Calendar as CalendarIcon,
  Wallet,
  FileSpreadsheet,
  FileJson,
  RotateCcw
} from 'lucide-react'

export default function Header({
  currentMonth,
  setCurrentMonth,
  onOpenAddModal,
  onOpenBudgetModal,
  onExportCSV,
  onExportJSON,
  onOpenImportModal,
  onResetData
}) {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const menuRef = useRef(null)

  const [yearStr, monthStr] = currentMonth.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)

  // Handle outside click to close export dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePrevMonth = () => {
    let newYear = year
    let newMonth = month - 1
    if (newMonth < 1) {
      newMonth = 12
      newYear -= 1
    }
    setCurrentMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`)
  }

  const handleNextMonth = () => {
    let newYear = year
    let newMonth = month + 1
    if (newMonth > 12) {
      newMonth = 1
      newYear += 1
    }
    setCurrentMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`)
  }

  const handleCurrentMonth = () => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    setCurrentMonth(`${y}-${m}`)
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Sổ Chi Tiêu Hàng Ngày
                  <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                    Tháng {month}/{year}
                  </span>
                </h1>
                <p className="text-xs text-slate-500">Quản lý ngân sách & chi tiêu chi tiết theo ngày</p>
              </div>
            </div>

            {/* Quick action button for mobile */}
            <button
              onClick={() => onOpenAddModal()}
              className="sm:hidden p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              title="Thêm giao dịch"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Month Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition hover:shadow-xs"
              title="Tháng trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center px-3 py-1 font-semibold text-slate-800 text-sm gap-1.5">
              <CalendarIcon className="w-4 h-4 text-indigo-600" />
              <span>Tháng {month}, {year}</span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition hover:shadow-xs"
              title="Tháng sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleCurrentMonth}
              className="ml-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2 py-1 hover:bg-indigo-50 rounded-md transition"
              title="Về tháng hiện tại"
            >
              Hôm nay
            </button>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            
            {/* Budget Settings */}
            <button
              onClick={onOpenBudgetModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Cài đặt ngân sách</span>
              <span className="md:hidden">Ngân sách</span>
            </button>

            {/* Export/Import dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition shadow-xs"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span className="hidden lg:inline">Sao lưu / Xuất</span>
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-fade-in text-sm">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Xuất dữ liệu
                  </div>
                  <button
                    onClick={() => {
                      setShowExportMenu(false)
                      onExportCSV()
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Xuất file Excel (CSV)</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false)
                      onExportJSON()
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                  >
                    <FileJson className="w-4 h-4 text-amber-600" />
                    <span>Sao lưu toàn bộ (JSON)</span>
                  </button>

                  <div className="my-1 border-t border-slate-100"></div>

                  <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Khôi phục & Dữ liệu
                  </div>
                  <button
                    onClick={() => {
                      setShowExportMenu(false)
                      onOpenImportModal()
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>Nhập từ file sao lưu (JSON)</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false)
                      if (window.confirm('Bạn có chắc muốn xóa sạch toàn bộ chi tiêu tháng này để tự điền lại từ đầu?')) {
                        onResetData()
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-500" />
                    <span>Xóa sạch tháng {month} (để tự điền)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Add Transaction Button */}
            <button
              onClick={() => onOpenAddModal()}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition transform active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Ghi chép mới</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  )
}
