import React, { useState, useEffect } from 'react'
import {
  Calendar,
  BarChart3,
  ListOrdered,
  Plus,
  Sparkles,
  PieChart,
  CheckCircle2,
  CalendarDays,
  Receipt,
  RotateCcw
} from 'lucide-react'

import Header from './components/Header'
import WorkflowSteps from './components/WorkflowSteps'
import TodayQuickAdd from './components/TodayQuickAdd'
import DayDetailInspector from './components/DayDetailInspector'
import BudgetSummary from './components/BudgetSummary'
import DailyCalendarView from './components/DailyCalendarView'
import DailySpendingChart from './components/DailySpendingChart'
import CategoryPieChart from './components/CategoryPieChart'
import TransactionList from './components/TransactionList'
import TransactionModal from './components/TransactionModal'
import BudgetModal from './components/BudgetModal'
import ImportModal from './components/ImportModal'

import {
  loadTransactions,
  saveTransactions,
  loadBudgets,
  saveBudgets,
  clearMonthTransactions
} from './utils/storage'
import { exportToCSV, exportToJSON } from './utils/exportImport'
import { getMonthKey, formatDateKey, getDaysInMonth, formatCurrency } from './utils/formatters'
import { DEFAULT_BUDGET } from './constants'

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(() => getMonthKey())
  const [transactions, setTransactions] = useState(() => loadTransactions())
  const [budgets, setBudgets] = useState(() => loadBudgets())

  // Core navigation tab: 'daily' (Nhật ký hàng ngày) | 'analytics' (Báo cáo biểu đồ) | 'all_tx' (Sổ giao dịch)
  const [activeTab, setActiveTab] = useState('daily')

  // Selected date defaults to Today
  const todayStr = formatDateKey(new Date())
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Modals state
  const [txModal, setTxModal] = useState({
    isOpen: false,
    initialData: null,
    defaultDate: null
  })
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  // Toast notification
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3200)
  }

  // Filter transactions belonging to currentMonth
  const monthTransactions = transactions.filter(t => t.date && t.date.startsWith(currentMonth))

  // Budget for current month
  const currentBudget = budgets[currentMonth] || DEFAULT_BUDGET
  const [yearStr, monthStr] = currentMonth.split('-')
  const daysInMonth = getDaysInMonth(parseInt(yearStr, 10), parseInt(monthStr, 10))
  const dailyBudgetLimit = Math.round((currentBudget.monthlyLimit || 10000000) / daysInMonth)

  // Expenses summary
  const totalExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const todayExpense = monthTransactions
    .filter(t => t.date === todayStr && t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  // Handlers for Transactions
  const handleSaveTransaction = (transactionData) => {
    let updated
    const index = transactions.findIndex(t => t.id === transactionData.id)
    if (index >= 0) {
      updated = [...transactions]
      updated[index] = transactionData
      showToast('Đã cập nhật giao dịch!')
    } else {
      updated = [transactionData, ...transactions]
      showToast('Đã lưu khoản chi tiêu!')
    }
    setTransactions(updated)
    saveTransactions(updated)
  }

  const handleDeleteTransaction = (id) => {
    const updated = transactions.filter(t => t.id !== id)
    setTransactions(updated)
    saveTransactions(updated)
    showToast('Đã xóa giao dịch!')
  }

  // Handlers for Budget
  const handleSaveBudget = (newBudget) => {
    const updated = {
      ...budgets,
      [currentMonth]: newBudget
    }
    setBudgets(updated)
    saveBudgets(updated)
    showToast('Đã cập nhật hạn mức ngân sách!')
  }

  // Handlers for Export / Import
  const handleExportCSV = () => {
    exportToCSV(monthTransactions, currentMonth)
    showToast('Đã xuất file Excel (CSV)!')
  }

  const handleExportJSON = () => {
    exportToJSON(transactions, budgets)
    showToast('Đã tải xuống file sao lưu JSON!')
  }

  const handleImportSuccess = (importedData) => {
    if (importedData.transactions) {
      setTransactions(importedData.transactions)
      saveTransactions(importedData.transactions)
    }
    if (importedData.budgets) {
      setBudgets(importedData.budgets)
      saveBudgets(importedData.budgets)
    }
    showToast('Khôi phục dữ liệu thành công!')
  }

  // Reset / Clear month data as user requested
  const handleResetData = () => {
    const remaining = clearMonthTransactions(currentMonth)
    setTransactions(remaining)
    setSelectedCategory(null)
    showToast(`Đã làm trống toàn bộ tháng ${monthStr} để bạn tự điền!`)
  }

  // Open Add modal with optional specific date
  const handleOpenAddModal = (date = null) => {
    setTxModal({
      isOpen: true,
      initialData: null,
      defaultDate: date || selectedDate || todayStr
    })
  }

  // Open Edit modal
  const handleEditTransaction = (tx) => {
    setTxModal({
      isOpen: true,
      initialData: tx,
      defaultDate: tx.date
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        onOpenAddModal={() => handleOpenAddModal()}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* LUỒNG CHÍNH 1: Tiến trình 3 bước cốt lõi */}
        <WorkflowSteps
          currentMonth={currentMonth}
          monthlyBudget={currentBudget}
          totalExpense={totalExpense}
          todayExpense={todayExpense}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          onOpenAddModal={() => handleOpenAddModal()}
        />

        {/* LUỒNG CHÍNH 2: Thanh điều hướng Tab trực quan */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-6 pb-2 overflow-x-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                activeTab === 'daily'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>1. Theo Dõi & Lịch Hàng Ngày</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>2. Biểu Đồ & Báo Cáo Tháng</span>
            </button>

            <button
              onClick={() => setActiveTab('all_tx')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                activeTab === 'all_tx'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>3. Sổ Giao Dịch ({monthTransactions.length})</span>
            </button>
          </div>

          {/* Quick empty month reminder button */}
          {monthTransactions.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Xác nhận xóa toàn bộ chi tiêu tháng ${monthStr} để nhập lại từ đầu?`)) {
                  handleResetData()
                }
              }}
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
              title="Làm trống tháng này"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm trống tháng {monthStr}</span>
            </button>
          )}
        </div>

        {/* ===================== TAB 1: THEO DÕI & LỊCH HÀNG NGÀY ===================== */}
        {activeTab === 'daily' && (
          <div className="space-y-6 animate-fade-in">
            {/* 1. Form Nhập Nhanh Hôm Nay / Ngày đang chọn (3 giây 1 chạm) */}
            <TodayQuickAdd
              onAddTransaction={handleSaveTransaction}
              todayExpense={todayExpense}
              dailyBudgetLimit={dailyBudgetLimit}
              selectedDate={selectedDate}
              onResetToToday={() => setSelectedDate(todayStr)}
            />

            {/* 2. Chi tiết & Nhật ký của ngày đang click chọn trên lịch */}
            <DayDetailInspector
              selectedDate={selectedDate}
              transactions={monthTransactions}
              dailyBudgetLimit={dailyBudgetLimit}
              onOpenAddModalWithDate={handleOpenAddModal}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onClearSelectedDate={() => setSelectedDate(null)}
            />

            {/* 3. Lịch Chi Tiêu 31 Ngày */}
            <DailyCalendarView
              currentMonth={currentMonth}
              transactions={monthTransactions}
              budget={currentBudget}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onOpenAddModalWithDate={handleOpenAddModal}
            />
          </div>
        )}

        {/* ===================== TAB 2: BIỂU ĐỒ & BÁO CÁO THÁNG ===================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            {/* Tóm tắt ngân sách & tiến độ tiêu */}
            <BudgetSummary
              currentMonth={currentMonth}
              transactions={monthTransactions}
              budget={currentBudget}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />

            {/* Biểu đồ chi tiêu theo ngày & cơ cấu danh mục */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DailySpendingChart
                currentMonth={currentMonth}
                transactions={monthTransactions}
                budget={currentBudget}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />

              <CategoryPieChart
                transactions={monthTransactions}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </div>
        )}

        {/* ===================== TAB 3: SỔ GIAO DỊCH ===================== */}
        {activeTab === 'all_tx' && (
          <div className="space-y-6 animate-fade-in">
            <TransactionList
              transactions={monthTransactions}
              selectedDate={selectedDate}
              onClearDateFilter={() => setSelectedDate(null)}
              selectedCategory={selectedCategory}
              onClearCategoryFilter={() => setSelectedCategory(null)}
              onOpenAddModal={handleOpenAddModal}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        )}

      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => handleOpenAddModal()}
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2 group"
        title="Thêm khoản chi tiêu"
      >
        <Plus className="w-6 h-6" />
        <span className="hidden sm:inline-block font-semibold text-sm pr-1">Thêm giao dịch</span>
      </button>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fade-in border border-slate-700 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Modals */}
      <TransactionModal
        isOpen={txModal.isOpen}
        onClose={() => setTxModal({ isOpen: false, initialData: null, defaultDate: null })}
        onSave={handleSaveTransaction}
        initialData={txModal.initialData}
        defaultDate={txModal.defaultDate}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentMonth={currentMonth}
        currentBudget={currentBudget}
        onSaveBudget={handleSaveBudget}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400 mt-12">
        <p>Sổ Quản Lý Chi Tiêu Cá Nhân Hàng Ngày • Dữ liệu lưu an toàn trên máy của bạn</p>
      </footer>
    </div>
  )
}
