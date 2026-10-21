import React, { useState, useEffect } from 'react'
import {
  Users,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Mail,
  KeyRound,
  Trash2,
  Edit2,
  Plus,
  Search,
  ArrowLeft,
  Settings,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import {
  getAllUsers,
  getSystemStats,
  adminChangeRole,
  adminDeleteUser,
  adminResetPassword,
  adminCreateUser
} from '../utils/auth'
import { getSentEmails, clearSentEmails } from '../utils/emailService'
import { getEmailConfig, saveEmailConfig, isEmailConfigured } from '../constants/emailConfig'
import { formatCurrency } from '../utils/formatters'
import { loadTransactions } from '../utils/storage'

export default function AdminDashboard({ currentUser, onBackToApp, showToast }) {
  const [activeAdminTab, setActiveAdminTab] = useState('users') // 'users' | 'emails' | 'settings'
  const [users, setUsers] = useState(() => getAllUsers())
  const [stats, setStats] = useState(() => getSystemStats())
  const [sentEmails, setSentEmails] = useState(() => getSentEmails())
  const [searchKeyword, setSearchKeyword] = useState('')

  // State for Add User Modal
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newFullName, setNewFullName] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('user')

  // State for Reset Password Modal
  const [resetModalUser, setResetModalUser] = useState(null)
  const [adminNewPass, setAdminNewPass] = useState('')

  // Email Config State
  const [emailConfig, setEmailConfig] = useState(() => getEmailConfig())
  const [emailSavedToast, setEmailSavedToast] = useState(false)

  const reloadData = () => {
    setUsers(getAllUsers())
    setStats(getSystemStats())
    setSentEmails(getSentEmails())
  }

  // Filter users by keyword
  const filteredUsers = users.filter((u) => {
    if (!searchKeyword.trim()) return true
    const kw = searchKeyword.toLowerCase()
    return (
      (u.fullName || '').toLowerCase().includes(kw) ||
      (u.username || '').toLowerCase().includes(kw) ||
      (u.email || '').toLowerCase().includes(kw)
    )
  })

  // Handle Role Change
  const handleToggleRole = (u) => {
    const nextRole = u.role === 'admin' ? 'user' : 'admin'
    if (u.id === currentUser?.id && nextRole === 'user') {
      if (!window.confirm('Bạn đang tự hạ quyền Admin của chính mình. Bạn chắc chắn chứ?')) return
    }
    try {
      adminChangeRole(u.id, nextRole)
      reloadData()
      showToast(`Đã đổi vai trò của @${u.username} thành: ${nextRole.toUpperCase()}`)
    } catch (e) {
      alert(e.message)
    }
  }

  // Handle Delete User
  const handleDeleteUser = (u) => {
    if (u.id === currentUser?.id) {
      alert('Bạn không thể tự xóa tài khoản của chính mình.')
      return
    }
    if (window.confirm(`Xác nhận xóa tài khoản @${u.username} (${u.fullName}) và toàn bộ dữ liệu chi tiêu liên quan?`)) {
      try {
        adminDeleteUser(u.id, currentUser?.id)
        reloadData()
        showToast(`Đã xóa tài khoản @${u.username}`)
      } catch (e) {
        alert(e.message)
      }
    }
  }

  // Handle Reset User Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault()
    if (!resetModalUser || !adminNewPass) return
    try {
      await adminResetPassword(resetModalUser.id, adminNewPass)
      setResetModalUser(null)
      setAdminNewPass('')
      showToast(`Đã đổi mật khẩu cho @${resetModalUser.username} thành công!`)
    } catch (e) {
      alert(e.message)
    }
  }

  // Handle Create User
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault()
    try {
      await adminCreateUser({
        fullName: newFullName,
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole
      })
      setIsAddUserOpen(false)
      setNewFullName('')
      setNewUsername('')
      setNewEmail('')
      setNewPassword('')
      setNewRole('user')
      reloadData()
      showToast('Đã thêm người dùng mới thành công!')
    } catch (e) {
      alert(e.message)
    }
  }

  // Handle Save Email Config
  const handleSaveEmailConfig = (e) => {
    e.preventDefault()
    saveEmailConfig(emailConfig)
    setEmailSavedToast(true)
    setTimeout(() => setEmailSavedToast(false), 3000)
    showToast('Đã lưu cấu hình EmailJS thành công!')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* Admin Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-950">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Bảng Điều Khiển Quản Trị Hệ Thống
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/40">
                  ADMIN CONTROL
                </span>
              </div>
              <p className="text-xs text-slate-400">Quản lý người dùng, phân quyền & nhật ký gửi email OTP</p>
            </div>
          </div>

          <button
            onClick={onBackToApp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition border border-slate-700 hover:border-slate-600 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Sổ Chi Tiêu</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* KPI System Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng Người Dùng</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span className="text-purple-400 font-semibold">{stats.adminCount} Admin</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{stats.userCount} User</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng Giao Dịch</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.totalTransactionsCount}</div>
              <div className="text-xs text-slate-400 mt-1">Ghi chép thu chi trên toàn hệ thống</div>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dòng Tiền Hệ Thống</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-rose-400 truncate">
                -{formatCurrency(stats.totalSystemExpense)}
              </div>
              <div className="text-xs text-emerald-400 mt-1 truncate">
                +{formatCurrency(stats.totalSystemIncome)}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email & OTP Đã Gửi</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.totalEmailsSent}</div>
              <div className="text-xs text-amber-300 mt-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>{stats.otpEmailsSent} mã OTP khôi phục</span>
              </div>
            </div>
          </div>

        </div>

        {/* Tab Navigation in Admin */}
        <div className="flex items-center justify-between border-b border-slate-800 mb-6 pb-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveAdminTab('users')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'users'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Quản Lý Người Dùng ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('emails')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'emails'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Nhật Ký Email & OTP ({sentEmails.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'settings'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Cấu Hình EmailJS & Hệ Thống</span>
            </button>
          </div>

          <button
            onClick={reloadData}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* ======================= TAB 1: QUẢN LÝ NGƯỜI DÙNG ======================= */}
        {activeAdminTab === 'users' && (
          <div className="space-y-4 animate-fade-in">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, username..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <button
                onClick={() => setIsAddUserOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Người Dùng</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3.5 px-4">Người dùng</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Vai trò</th>
                      <th className="py-3.5 px-4">Giao dịch</th>
                      <th className="py-3.5 px-4">Ngày tạo</th>
                      <th className="py-3.5 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredUsers.map((u) => {
                      const userTxs = loadTransactions(u.id)
                      const isSelf = u.id === currentUser?.id
                      const isAdmin = u.role === 'admin'

                      return (
                        <tr key={u.id} className="hover:bg-slate-700/30 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold flex items-center justify-center text-xs">
                                {u.fullName ? u.fullName.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{u.fullName || u.username}</span>
                                  {isSelf && (
                                    <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-normal">
                                      (Bạn)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400">@{u.username}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-300">
                            {u.email || <span className="italic text-slate-500">Chưa có</span>}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                isAdmin
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : 'bg-slate-700/50 text-slate-300 border-slate-600'
                              }`}
                            >
                              {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                              <span>{isAdmin ? 'Admin' : 'User'}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-300 font-medium">
                            {userTxs.length} khoản
                          </td>

                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Change Role Button */}
                              <button
                                onClick={() => handleToggleRole(u)}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition ${
                                  isAdmin
                                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                    : 'bg-purple-600/30 hover:bg-purple-600 text-purple-200'
                                }`}
                                title={isAdmin ? 'Chuyển về quyền User' : 'Nâng cấp quyền Admin'}
                              >
                                {isAdmin ? 'Hạ quyền' : 'Nâng Admin'}
                              </button>

                              {/* Reset Password Button */}
                              <button
                                onClick={() => {
                                  setResetModalUser(u)
                                  setAdminNewPass('')
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-700 rounded-lg transition"
                                title="Đặt lại mật khẩu cho user"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete User Button */}
                              {!isSelf && (
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition"
                                  title="Xóa tài khoản"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: NHẬT KÝ GỬI EMAIL & OTP ======================= */}
        {activeAdminTab === 'emails' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  Nhật Ký Email & Mã OTP Phát Đi
                </h3>
                <p className="text-xs text-slate-400">Lưu lại toàn bộ lịch sử thư chào mừng và mã xác nhận OTP</p>
              </div>

              {sentEmails.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Xác nhận xóa toàn bộ lịch sử nhật ký email?')) {
                      clearSentEmails()
                      reloadData()
                      showToast('Đã xóa sạch nhật ký email!')
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Xóa Lịch Sử
                </button>
              )}
            </div>

            {sentEmails.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700">
                <Mail className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-400">Chưa có email hoặc OTP nào được phát đi.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sentEmails.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 hover:border-slate-600 transition text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-700/60">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            item.type === 'otp'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {item.type === 'otp' ? 'MÃ OTP' : 'CHÀO MỪNG'}
                        </span>
                        <span className="font-bold text-white text-sm">{item.subject}</span>
                      </div>

                      <span className="text-[11px] text-slate-400">
                        {new Date(item.sentAt).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-slate-300">
                      <div>
                        Người nhận: <strong className="text-purple-300">{item.to_email}</strong> ({item.to_name})
                      </div>
                      {item.otp_code && (
                        <div className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-lg font-mono font-bold text-xs">
                          MÃ OTP: {item.otp_code}
                        </div>
                      )}
                    </div>

                    <p className="text-slate-400 text-xs bg-slate-900/60 p-3 rounded-xl whitespace-pre-line border border-slate-800">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB 3: CẤU HÌNH EMAILJS ======================= */}
        {activeAdminTab === 'settings' && (
          <div className="max-w-2xl bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-5 animate-fade-in">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Cấu Hình Dịch Vụ EmailJS
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    isEmailConfigured()
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {isEmailConfigured() ? '🟢 Đã sẵn sàng gửi email thật' : '🟡 Chưa điền API key'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Điền trực tiếp các khóa API miễn phí từ <a href="https://www.emailjs.com/" target="_blank" rel="noreferrer" className="text-purple-400 underline">EmailJS</a> vào đây để gửi email thật tới hộp thư Gmail của người dùng.
              </p>
            </div>

            <form onSubmit={handleSaveEmailConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  EmailJS Service ID
                </label>
                <input
                  type="text"
                  placeholder="VD: service_xyz123"
                  value={emailConfig.SERVICE_ID}
                  onChange={(e) => setEmailConfig({ ...emailConfig, SERVICE_ID: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Welcome Template ID (Gửi khi Đăng Ký)
                </label>
                <input
                  type="text"
                  placeholder="VD: template_welcome123"
                  value={emailConfig.WELCOME_TEMPLATE_ID}
                  onChange={(e) => setEmailConfig({ ...emailConfig, WELCOME_TEMPLATE_ID: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  OTP Template ID (Gửi khi Quên Mật Khẩu)
                </label>
                <input
                  type="text"
                  placeholder="VD: template_otp123"
                  value={emailConfig.OTP_TEMPLATE_ID}
                  onChange={(e) => setEmailConfig({ ...emailConfig, OTP_TEMPLATE_ID: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Public Key (User ID)
                </label>
                <input
                  type="text"
                  placeholder="VD: user_abc123 hoặc public key"
                  value={emailConfig.PUBLIC_KEY}
                  onChange={(e) => setEmailConfig({ ...emailConfig, PUBLIC_KEY: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>

              {emailSavedToast && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-700 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Đã lưu thành công! Cấu hình sẽ có hiệu lực ngay lập tức.</span>
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Lưu Cấu Hình Email
              </button>
            </form>
          </div>
        )}

      </main>

      {/* MODAL THÊM NGƯỜI DÙNG */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full border border-slate-700 p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm">Thêm Người Dùng Mới</h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn A"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tên đăng nhập (Username)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: nguyenvana"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="VD: nguyenvana@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mật khẩu</label>
                <input
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vai trò</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="user">User thường</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white"
                >
                  Tạo Người Dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RESET MẬT KHẨU BỞI ADMIN */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-sm w-full border border-slate-700 p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm">Đặt Lại Mật Khẩu</h3>
              <button
                onClick={() => setResetModalUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Đặt mật khẩu mới cho tài khoản: <strong className="text-purple-300">@{resetModalUser.username}</strong> ({resetModalUser.fullName})
            </p>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={adminNewPass}
                  onChange={(e) => setAdminNewPass(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white"
                >
                  Cập Nhật Mật Khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
