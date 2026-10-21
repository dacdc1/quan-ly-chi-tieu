import React, { useState, useEffect } from 'react'
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Inbox,
  RefreshCw,
  X
} from 'lucide-react'
import {
  loginUser,
  registerUser,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPasswordWithOtp
} from '../utils/auth'
import { getSentEmails } from '../utils/emailService'
import { isEmailConfigured } from '../constants/emailConfig'

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  isForceLock = false
}) {
  // Modes: 'login' | 'register' | 'forgot_email' | 'forgot_otp' | 'forgot_new_password'
  const [mode, setMode] = useState('login')
  
  // Registration & Login fields
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [countdown, setCountdown] = useState(0)

  // UI state
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMailboxModal, setShowMailboxModal] = useState(false)
  const [sentMails, setSentMails] = useState([])

  // Reset form when opening or changing mode
  useEffect(() => {
    setError('')
    setSuccessMsg('')
  }, [mode, isOpen])

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // Listen for sent emails to update mailbox
  useEffect(() => {
    const handleNewEmail = () => {
      setSentMails(getSentEmails())
    }
    window.addEventListener('quanlychitieu_new_email', handleNewEmail)
    setSentMails(getSentEmails())
    return () => window.removeEventListener('quanlychitieu_new_email', handleNewEmail)
  }, [])

  if (!isOpen) return null

  // 1. Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await loginUser({ usernameOrEmail: username, password })
      onAuthSuccess(user)
      if (onClose) onClose()
    } catch (err) {
      setError(err.message || 'Đăng nhập không thành công')
    } finally {
      setLoading(false)
    }
  }

  // 2. Submit Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp')
      return
    }

    setLoading(true)

    try {
      const user = await registerUser({
        fullName,
        username,
        email,
        password
      })

      setSuccessMsg(`Đăng ký thành công! Hệ thống đã gửi thư xác nhận đến email: ${email}`)
      setTimeout(() => {
        onAuthSuccess(user)
        if (onClose) onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  // 3. Forgot Password - Bước 1: Gửi OTP về Email
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await requestPasswordResetOtp(forgotEmail)
      setCountdown(60) // 60s cooldown
      setSuccessMsg(`Mã OTP đã được gửi về email ${forgotEmail}. Vui lòng kiểm tra hộp thư!`)
      setMode('forgot_otp')
    } catch (err) {
      setError(err.message || 'Không thể gửi mã OTP')
    } finally {
      setLoading(false)
    }
  }

  // 4. Forgot Password - Bước 2: Xác nhận OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault()
    setError('')

    try {
      verifyPasswordResetOtp(forgotEmail, otpCode)
      setSuccessMsg('Xác thực OTP thành công! Vui lòng đặt mật khẩu mới.')
      setMode('forgot_new_password')
    } catch (err) {
      setError(err.message || 'Mã OTP không hợp lệ')
    }
  }

  // 5. Forgot Password - Bước 3: Đổi Mật Khẩu Mới
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu mới xác nhận không khớp.')
      return
    }

    setLoading(true)

    try {
      await resetPasswordWithOtp(forgotEmail, otpCode, newPassword)
      setSuccessMsg('Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới ngay.')
      setTimeout(() => {
        setUsername(forgotEmail)
        setPassword('')
        setMode('login')
        setSuccessMsg('Đổi mật khẩu thành công! Vui lòng đăng nhập.')
      }, 1800)
    } catch (err) {
      setError(err.message || 'Không thể đổi mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  // Quick Demo Login
  const handleQuickDemo = async () => {
    setLoading(true)
    setError('')
    try {
      const user = await loginUser({ usernameOrEmail: 'demo', password: '123456' })
      onAuthSuccess(user)
      if (onClose) onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-fade-in relative">
        
        {/* Close Button */}
        {!isForceLock && onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition z-10"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-2.5 shadow-lg">
            {mode === 'login' && <Lock className="w-6 h-6 text-indigo-300" />}
            {mode === 'register' && <User className="w-6 h-6 text-emerald-300" />}
            {(mode.startsWith('forgot')) && <KeyRound className="w-6 h-6 text-amber-300" />}
          </div>

          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'login' && 'Đăng Nhập Tài Khoản'}
            {mode === 'register' && 'Đăng Ký Tài Khoản Mới'}
            {mode === 'forgot_email' && 'Quên Mật Khẩu'}
            {mode === 'forgot_otp' && 'Xác Thực Mã OTP'}
            {mode === 'forgot_new_password' && 'Đặt Lại Mật Khẩu Mới'}
          </h2>

          <p className="text-xs text-indigo-200/80 mt-1 max-w-xs mx-auto">
            {mode === 'login' && 'Quản lý thu chi & bảo mật ngân sách cá nhân'}
            {mode === 'register' && 'Điền thông tin để tạo tài khoản & nhận thư xác nhận'}
            {mode === 'forgot_email' && 'Nhập email đã đăng ký để nhận mã OTP lấy lại mật khẩu'}
            {mode === 'forgot_otp' && `Nhập mã 6 chữ số vừa gửi tới: ${forgotEmail}`}
            {mode === 'forgot_new_password' && 'Nhập mật khẩu mới cho tài khoản của bạn'}
          </p>
        </div>

        {/* Tab Switcher for Login / Register */}
        {(mode === 'login' || mode === 'register') && (
          <div className="px-6 pt-5 pb-1">
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2 text-xs font-bold rounded-xl transition ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đăng Nhập
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`py-2 text-xs font-bold rounded-xl transition ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đăng Ký
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 pt-3 space-y-4">
          
          {/* Notifications */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================= FORM 1: ĐĂNG NHẬP ======================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên đăng nhập hoặc Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="VD: caodac hoặc email@gmail.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(username.includes('@') ? username : '')
                      setMode('forgot_email')
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Đăng nhập nhanh Demo (demo / 123456)</span>
              </button>
            </form>
          )}

          {/* ======================= FORM 2: ĐĂNG KÝ ======================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên đầy đủ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cao Đắc"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên đăng nhập (Username) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: caodac (tối thiểu 3 ký tự)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="VD: ban@gmail.com (để nhận thư & OTP)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Hệ thống sẽ gửi thư xác nhận đăng ký về email này.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="≥ 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Xác nhận mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Nhập lại"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Đang tạo tài khoản & gửi thư...' : 'Đăng Ký & Nhận Email Xác Nhận'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ======================= QUÊN MẬT KHẨU - BƯỚC 1: NHẬP EMAIL ======================= */}
          {mode === 'forgot_email' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhập địa chỉ Email đã đăng ký
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="VD: caodac@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Hệ thống sẽ gửi mã xác thực OTP gồm 6 chữ số đến email này để xác minh quyền sở hữu tài khoản.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Đang gửi mã OTP...' : 'Gửi Mã OTP Về Email'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại màn hình Đăng nhập</span>
              </button>
            </form>
          )}

          {/* ======================= QUÊN MẬT KHẨU - BƯỚC 2: NHẬP MÃ OTP ======================= */}
          {mode === 'forgot_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhập mã OTP (6 chữ số)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-2xl font-bold tracking-[0.4em] py-2.5 rounded-xl border-2 border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:tracking-normal placeholder:text-slate-300"
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>Mã có hiệu lực trong 5 phút</span>
                  {countdown > 0 ? (
                    <span className="text-slate-400 font-medium">Gửi lại mã ({countdown}s)</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestOtp()}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Gửi lại mã</span>
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={otpCode.length < 6}
                className={`w-full py-2.5 px-4 font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 ${
                  otpCode.length === 6
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Xác Nhận Mã OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setMode('forgot_email')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Đổi email khác</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMailboxModal(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Xem thư OTP đã gửi ({sentMails.length})</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================= QUÊN MẬT KHẨU - BƯỚC 3: ĐẶT MẬT KHẨU MỚI ======================= */}
          {mode === 'forgot_new_password' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Đang cập nhật mật khẩu...' : 'Lưu Mật Khẩu Mới'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

        {/* Footer & Live Mailbox Trigger */}
        <div className="bg-slate-50 py-3 px-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Hệ thống bảo mật 2 lớp qua Email OTP</span>
          <button
            type="button"
            onClick={() => setShowMailboxModal(true)}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Hộp thư gửi ({sentMails.length})</span>
          </button>
        </div>

      </div>

      {/* MODAL XEM HỘP THƯ ĐÃ GỬI (Virtual Mailbox Inspector) */}
      {showMailboxModal && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 max-h-[80vh] flex flex-col shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Hộp Thư Hệ Thống Đã Gửi</h3>
              </div>
              <button
                onClick={() => setShowMailboxModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {sentMails.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Chưa có email nào được gửi từ hệ thống.
                </div>
              ) : (
                sentMails.map((mail) => (
                  <div
                    key={mail.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 truncate max-w-[240px]">
                        {mail.subject}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(mail.sentAt).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600">
                      Gửi đến: <strong className="text-slate-800">{mail.to_email}</strong> ({mail.to_name})
                    </div>

                    {mail.otp_code && (
                      <div className="inline-block bg-amber-100 border border-amber-300 text-amber-900 px-2 py-0.5 rounded-md font-bold text-xs tracking-wider">
                        Mã OTP: {mail.otp_code}
                      </div>
                    )}

                    <p className="text-slate-600 text-[11px] whitespace-pre-line bg-white p-2 rounded-lg border border-slate-100">
                      {mail.body}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{isEmailConfigured() ? '🟢 Đã cấu hình EmailJS gửi thật' : '🟡 Lưu ý: Bạn có thể điền khóa EmailJS trong emailConfig.js để gửi mail thật'}</span>
              <button
                onClick={() => setShowMailboxModal(false)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
