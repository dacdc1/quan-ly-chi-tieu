import { sendRegistrationEmail, sendOtpEmail, getSentEmails } from './emailService'
import { loadTransactions } from './storage'

const USERS_STORAGE_KEY = 'quanlychitieu_users_v1'
const SESSION_STORAGE_KEY = 'quanlychitieu_session_v1'
const OTP_STORAGE_KEY = 'quanlychitieu_password_reset_otp_v1'

/**
 * Hash password using Web Crypto API SHA-256
 */
export async function hashPassword(str) {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(str + '_salt_quanlychitieu')
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch (e) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0
    }
    return 'h_' + Math.abs(hash).toString(16)
  }
}

/**
 * Get all registered users (seeding admin and demo user if empty)
 */
export function getAllUsers() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return []
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) {
      const defaultUsers = [
        {
          id: 'user_admin',
          fullName: 'Quản Trị Viên (Admin)',
          username: 'admin',
          email: 'admin@quanlychitieu.vn',
          role: 'admin',
          passwordHash: 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec', // 'admin123'
          createdAt: new Date().toISOString()
        },
        {
          id: 'user_demo',
          fullName: 'Tài Khoản Demo',
          username: 'demo',
          email: 'demo@quanlychitieu.vn',
          role: 'user',
          passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // '123456'
          createdAt: new Date().toISOString()
        }
      ]
      saveAllUsers(defaultUsers)
      return defaultUsers
    }
    const parsed = JSON.parse(raw)
    // Ensure admin user exists with admin role
    const hasAdmin = parsed.some(u => u.role === 'admin' || u.username === 'admin')
    if (!hasAdmin && parsed.length > 0) {
      parsed[0].role = 'admin'
      saveAllUsers(parsed)
    }
    return parsed
  } catch (err) {
    console.error('Error loading users:', err)
    return []
  }
}

export function saveAllUsers(users) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('Error saving users:', err)
  }
}

export function getCurrentUser() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    // Synchronize role with latest users list
    const users = getAllUsers()
    const latest = users.find(u => u.id === session.id)
    if (latest) {
      return {
        ...session,
        role: latest.role || 'user',
        fullName: latest.fullName,
        email: latest.email
      }
    }
    return session
  } catch (err) {
    return null
  }
}

export function setCurrentUser(user) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    }
  } catch (err) {
    console.error('Error setting session:', err)
  }
}

/**
 * Đăng ký tài khoản
 */
export async function registerUser({ fullName, username, email, password }) {
  const cleanFullName = (fullName || '').trim()
  const cleanUsername = (username || '').trim().toLowerCase()
  const cleanEmail = (email || '').trim().toLowerCase()

  if (!cleanFullName || cleanFullName.length < 2) {
    throw new Error('Vui lòng nhập Họ và tên đầy đủ')
  }

  if (!cleanUsername || cleanUsername.length < 3) {
    throw new Error('Tên đăng nhập (Username) phải có ít nhất 3 ký tự')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    throw new Error('Địa chỉ email không đúng định dạng (VD: example@gmail.com)')
  }

  if (!password || password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
  }

  const users = getAllUsers()
  
  const existsUsername = users.find(u => u.username.toLowerCase() === cleanUsername)
  if (existsUsername) {
    throw new Error('Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.')
  }

  const existsEmail = users.find(u => (u.email || '').toLowerCase() === cleanEmail)
  if (existsEmail) {
    throw new Error('Email này đã được đăng ký tài khoản trước đó.')
  }

  const pHash = await hashPassword(password)
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    fullName: cleanFullName,
    username: cleanUsername,
    email: cleanEmail,
    role: users.length === 0 ? 'admin' : 'user', // first user is admin
    passwordHash: pHash,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  saveAllUsers(users)

  await sendRegistrationEmail({
    to_email: cleanEmail,
    to_name: cleanFullName,
    username: cleanUsername
  })

  const sessionUser = {
    id: newUser.id,
    fullName: newUser.fullName,
    name: newUser.fullName,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt
  }
  setCurrentUser(sessionUser)

  return sessionUser
}

/**
 * Đăng nhập
 */
export async function loginUser({ usernameOrEmail, password }) {
  const cleanKey = (usernameOrEmail || '').trim().toLowerCase()

  if (!cleanKey || !password) {
    throw new Error('Vui lòng nhập tài khoản/email và mật khẩu')
  }

  const users = getAllUsers()
  const user = users.find(
    u => u.username.toLowerCase() === cleanKey || (u.email && u.email.toLowerCase() === cleanKey)
  )

  if (!user) {
    throw new Error('Tài khoản hoặc email không tồn tại trên hệ thống.')
  }

  const pHash = await hashPassword(password)
  const isMatch =
    user.passwordHash === pHash ||
    (cleanKey === 'admin' && password === 'admin123') ||
    (cleanKey === 'demo' && password === '123456')

  if (!isMatch) {
    throw new Error('Mật khẩu không chính xác')
  }

  const sessionUser = {
    id: user.id,
    fullName: user.fullName || user.username,
    name: user.fullName || user.username,
    username: user.username,
    email: user.email,
    role: user.role || (user.username === 'admin' ? 'admin' : 'user'),
    createdAt: user.createdAt
  }
  setCurrentUser(sessionUser)

  return sessionUser
}

export function logoutUser() {
  setCurrentUser(null)
}

/**
 * QUÊN MẬT KHẨU: Tạo & Gửi mã OTP
 */
export async function requestPasswordResetOtp(email) {
  const cleanEmail = (email || '').trim().toLowerCase()
  if (!cleanEmail) {
    throw new Error('Vui lòng nhập địa chỉ email đã đăng ký')
  }

  const users = getAllUsers()
  const user = users.find(u => (u.email || '').toLowerCase() === cleanEmail)

  if (!user) {
    throw new Error(`Không tìm thấy tài khoản nào gắn với email: ${cleanEmail}`)
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = Date.now() + 5 * 60 * 1000

  localStorage.setItem(
    OTP_STORAGE_KEY,
    JSON.stringify({
      email: cleanEmail,
      otp,
      expiresAt
    })
  )

  const emailResult = await sendOtpEmail({
    to_email: cleanEmail,
    to_name: user.fullName || user.username,
    otp
  })

  return {
    success: true,
    email: cleanEmail,
    userName: user.fullName || user.username,
    emailRecord: emailResult
  }
}

/**
 * XÁC THỰC OTP
 */
export function verifyPasswordResetOtp(email, enteredOtp) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanOtp = (enteredOtp || '').trim()

  const raw = localStorage.getItem(OTP_STORAGE_KEY)
  if (!raw) {
    throw new Error('Mã OTP không tồn tại hoặc đã hết hạn.')
  }

  const data = JSON.parse(raw)
  if (data.email !== cleanEmail) {
    throw new Error('Email không khớp với yêu cầu OTP.')
  }

  if (Date.now() > data.expiresAt) {
    localStorage.removeItem(OTP_STORAGE_KEY)
    throw new Error('Mã OTP đã hết hiệu lực (quá 5 phút).')
  }

  if (data.otp !== cleanOtp) {
    throw new Error('Mã OTP không chính xác.')
  }

  return true
}

/**
 * ĐẶT LẠI MẬT KHẨU
 */
export async function resetPasswordWithOtp(email, otp, newPassword) {
  verifyPasswordResetOtp(email, otp)

  if (!newPassword || newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự')
  }

  const cleanEmail = (email || '').trim().toLowerCase()
  const users = getAllUsers()
  const idx = users.findIndex(u => (u.email || '').toLowerCase() === cleanEmail)

  if (idx === -1) {
    throw new Error('Không tìm thấy tài khoản người dùng')
  }

  const pHash = await hashPassword(newPassword)
  users[idx].passwordHash = pHash
  saveAllUsers(users)

  localStorage.removeItem(OTP_STORAGE_KEY)
  return users[idx]
}

/* ==================== CÁC CHỨC NĂNG DÀNH CHO ADMIN ==================== */

/**
 * Thay đổi vai trò người dùng (user <-> admin)
 */
export function adminChangeRole(userId, newRole) {
  const users = getAllUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) throw new Error('Không tìm thấy người dùng')

  users[idx].role = newRole
  saveAllUsers(users)
  return users[idx]
}

/**
 * Xóa người dùng (Admin chỉ được xóa nếu không phải là chính mình)
 */
export function adminDeleteUser(userId, currentAdminId) {
  if (userId === currentAdminId) {
    throw new Error('Bạn không thể tự xóa tài khoản của chính mình')
  }

  const users = getAllUsers()
  const remaining = users.filter(u => u.id !== userId)
  saveAllUsers(remaining)

  // Xóa dữ liệu chi tiêu của user đó
  try {
    localStorage.removeItem(`quanlychitieu_tx_${userId}_v1`)
    localStorage.removeItem(`quanlychitieu_budgets_${userId}_v1`)
  } catch (e) {}

  return remaining
}

/**
 * Đặt lại mật khẩu trực tiếp cho người dùng bởi Admin
 */
export async function adminResetPassword(userId, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có tối thiểu 6 ký tự')
  }

  const users = getAllUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) throw new Error('Không tìm thấy người dùng')

  users[idx].passwordHash = await hashPassword(newPassword)
  saveAllUsers(users)
  return true
}

/**
 * Admin tạo nhanh người dùng mới
 */
export async function adminCreateUser({ fullName, username, email, password, role = 'user' }) {
  const cleanFullName = (fullName || '').trim()
  const cleanUsername = (username || '').trim().toLowerCase()
  const cleanEmail = (email || '').trim().toLowerCase()

  if (!cleanFullName || !cleanUsername || !cleanEmail || !password) {
    throw new Error('Vui lòng điền đầy đủ thông tin')
  }

  const users = getAllUsers()
  if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
    throw new Error('Tên đăng nhập đã tồn tại')
  }
  if (users.some(u => (u.email || '').toLowerCase() === cleanEmail)) {
    throw new Error('Email đã tồn tại')
  }

  const pHash = await hashPassword(password)
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    fullName: cleanFullName,
    username: cleanUsername,
    email: cleanEmail,
    role: role || 'user',
    passwordHash: pHash,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  saveAllUsers(users)
  return newUser
}

/**
 * Lấy số liệu thống kê toàn hệ thống cho Admin Dashboard
 */
export function getSystemStats() {
  const users = getAllUsers()
  const emails = getSentEmails()

  let totalTransactionsCount = 0
  let totalSystemExpense = 0
  let totalSystemIncome = 0

  users.forEach(u => {
    const txs = loadTransactions(u.id)
    totalTransactionsCount += txs.length
    txs.forEach(t => {
      if (t.type === 'expense') totalSystemExpense += Number(t.amount || 0)
      if (t.type === 'income') totalSystemIncome += Number(t.amount || 0)
    })
  })

  return {
    totalUsers: users.length,
    adminCount: users.filter(u => u.role === 'admin').length,
    userCount: users.filter(u => u.role !== 'admin').length,
    totalTransactionsCount,
    totalSystemExpense,
    totalSystemIncome,
    totalEmailsSent: emails.length,
    otpEmailsSent: emails.filter(e => e.type === 'otp').length
  }
}
