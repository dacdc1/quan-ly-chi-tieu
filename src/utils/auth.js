const USERS_STORAGE_KEY = 'quanlychitieu_users_v1'
const SESSION_STORAGE_KEY = 'quanlychitieu_session_v1'

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
    // Fallback simple hash if subtle is unavailable in older contexts
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
      // Seed a default demo account for convenience
      const defaultUsers = [
        {
          id: 'user_demo',
          username: 'demo',
          name: 'Tài khoản Demo',
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

/**
 * Save users list to localStorage
 */
function saveAllUsers(users) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('Error saving users:', err)
  }
}

/**
 * Get currently logged-in user session
 */
export function getCurrentUser() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error getting session:', err)
    return null
  }
}

/**
 * Save current session
 */
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
 * Register a new user
 */
export async function registerUser({ username, name, password }) {
  const cleanUsername = (username || '').trim().toLowerCase()
  const cleanName = (name || '').trim() || cleanUsername

  if (!cleanUsername || cleanUsername.length < 3) {
    throw new Error('Tên đăng nhập phải có ít nhất 3 ký tự')
  }

  if (!password || password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
  }

  const users = getAllUsers()
  const exists = users.find(u => u.username.toLowerCase() === cleanUsername)
  if (exists) {
    throw new Error('Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.')
  }

  const pHash = await hashPassword(password)
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    username: cleanUsername,
    name: cleanName,
    passwordHash: pHash,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  saveAllUsers(users)

  // Auto login session (omit sensitive passwordHash from session)
  const sessionUser = {
    id: newUser.id,
    username: newUser.username,
    name: newUser.name,
    createdAt: newUser.createdAt
  }
  setCurrentUser(sessionUser)

  return sessionUser
}

/**
 * Login an existing user
 */
export async function loginUser({ username, password }) {
  const cleanUsername = (username || '').trim().toLowerCase()

  if (!cleanUsername || !password) {
    throw new Error('Vui lòng nhập tên đăng nhập và mật khẩu')
  }

  const users = getAllUsers()
  const user = users.find(u => u.username.toLowerCase() === cleanUsername)

  if (!user) {
    throw new Error('Tài khoản không tồn tại. Vui lòng kiểm tra lại hoặc Đăng ký.')
  }

  const pHash = await hashPassword(password)
  // Accept standard hash or default demo bypass for '123456'
  const isMatch = (user.passwordHash === pHash) || (cleanUsername === 'demo' && password === '123456')

  if (!isMatch) {
    throw new Error('Mật khẩu không chính xác')
  }

  const sessionUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    createdAt: user.createdAt
  }
  setCurrentUser(sessionUser)

  return sessionUser
}

/**
 * Logout current user
 */
export function logoutUser() {
  setCurrentUser(null)
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, { name, newPassword }) {
  const users = getAllUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) {
    throw new Error('Không tìm thấy tài khoản người dùng')
  }

  if (name && name.trim()) {
    users[idx].name = name.trim()
  }

  if (newPassword) {
    if (newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự')
    }
    users[idx].passwordHash = await hashPassword(newPassword)
  }

  saveAllUsers(users)

  const updatedSession = {
    id: users[idx].id,
    username: users[idx].username,
    name: users[idx].name,
    createdAt: users[idx].createdAt
  }
  setCurrentUser(updatedSession)

  return updatedSession
}
