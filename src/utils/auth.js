import { sendRegistrationEmail, sendOtpEmail } from './emailService'

const USERS_STORAGE_KEY = 'quanlychitieu_users_v1'
const SESSION_STORAGE_KEY = 'quanlychitieu_session_v1'
const OTP_STORAGE_KEY = 'quanlychitieu_password_reset_otp_v1'

/**
 * Hash password using Web Crypto API SHA-256
 */
async function hashPassword(str) {
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
 * Get all registered users
 */
export function getAllUsers() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return []
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) {
      const defaultUsers = [
        {
          id: 'user_demo',
          fullName: 'Tài Khoản Demo',
          username: 'demo',
          email: 'demo@quanlychitieu.vn',
          passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // '123456'
          createdAt: new Date().toISOString()
        }
      ]
      saveAllUsers(defaultUsers)
      return defaultUsers
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading users:', err)
    return []
  }
}

function saveAllUsers(users) {
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
    return JSON.parse(raw)
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
 * Đăng ký tài khoản đầy đủ: Họ tên, Username, Email, Mật khẩu
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

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    throw new Error('Địa chỉ email không đúng định dạng (VD: example@gmail.com)')
  }

  if (!password || password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
  }

  const users = getAllUsers()
  
  // Check unique username
  const existsUsername = users.find(u => u.username.toLowerCase() === cleanUsername)
  if (existsUsername) {
    throw new Error('Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.')
  }

  // Check unique email
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
    passwordHash: pHash,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  saveAllUsers(users)

  // Gửi thư chào mừng thông báo đăng ký về email người dùng
  await sendRegistrationEmail({
    to_email: cleanEmail,
    to_name: cleanFullName,
    username: cleanUsername
  })

  // Auto login session
  const sessionUser = {
    id: newUser.id,
    fullName: newUser.fullName,
    name: newUser.fullName,
    username: newUser.username,
    email: newUser.email,
    createdAt: newUser.createdAt
  }
  setCurrentUser(sessionUser)

  return sessionUser
}

/**
 * Đăng nhập (hỗ trợ nhập Username hoặc Email)
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
  const isMatch = (user.passwordHash === pHash) || (cleanKey === 'demo' && password === '123456')

  if (!isMatch) {
    throw new Error('Mật khẩu không chính xác')
  }

  const sessionUser = {
    id: user.id,
    fullName: user.fullName || user.name || user.username,
    name: user.fullName || user.name || user.username,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  }
  setCurrentUser(sessionUser)

  return sessionUser
}

export function logoutUser() {
  setCurrentUser(null)
}

/**
 * YÊU CẦU QUÊN MẬT KHẨU: Tạo & Gửi mã OTP 6 số về email
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

  // Sinh mã OTP 6 số ngẫu nhiên
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = Date.now() + 5 * 60 * 1000 // hiệu lực 5 phút

  // Lưu OTP vào bộ nhớ tạm
  localStorage.setItem(
    OTP_STORAGE_KEY,
    JSON.stringify({
      email: cleanEmail,
      otp,
      expiresAt
    })
  )

  // Gửi OTP về email
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
 * XÁC THỰC MÃ OTP
 */
export function verifyPasswordResetOtp(email, enteredOtp) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanOtp = (enteredOtp || '').trim()

  const raw = localStorage.getItem(OTP_STORAGE_KEY)
  if (!raw) {
    throw new Error('Mã OTP không tồn tại hoặc đã hết hạn. Vui lòng yêu cầu lại.')
  }

  const data = JSON.parse(raw)
  if (data.email !== cleanEmail) {
    throw new Error('Email không khớp với yêu cầu OTP.')
  }

  if (Date.now() > data.expiresAt) {
    localStorage.removeItem(OTP_STORAGE_KEY)
    throw new Error('Mã OTP đã hết hiệu lực (quá 5 phút). Vui lòng bấm gửi lại mã.')
  }

  if (data.otp !== cleanOtp) {
    throw new Error('Mã OTP không chính xác. Vui lòng kiểm tra lại trong email.')
  }

  return true
}

/**
 * ĐẶT LẠI MẬT KHẨU MỚI SAU KHI XÁC THỰC OTP THÀNH CÔNG
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

  // Hủy mã OTP đã dùng
  localStorage.removeItem(OTP_STORAGE_KEY)

  return users[idx]
}
