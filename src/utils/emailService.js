import emailjs from '@emailjs/browser'
import { getEmailConfig, isEmailConfigured } from '../constants/emailConfig'

const SENT_EMAILS_KEY = 'quanlychitieu_sent_emails_v1'

/**
 * Get all sent emails from local mailbox history
 */
export function getSentEmails() {
  try {
    const raw = localStorage.getItem(SENT_EMAILS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

/**
 * Clear sent emails history
 */
export function clearSentEmails() {
  try {
    localStorage.removeItem(SENT_EMAILS_KEY)
    window.dispatchEvent(new CustomEvent('quanlychitieu_new_email'))
  } catch (e) {}
}

/**
 * Save an outgoing email to local mailbox history
 */
function recordSentEmail(emailRecord) {
  try {
    const list = getSentEmails()
    const updated = [emailRecord, ...list].slice(0, 50) // keep last 50
    localStorage.setItem(SENT_EMAILS_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('quanlychitieu_new_email', { detail: emailRecord }))
  } catch (e) {
    console.error('Error recording sent email:', e)
  }
}

/**
 * Gửi email chào mừng khi đăng ký tài khoản thành công
 */
export async function sendRegistrationEmail({ to_email, to_name, username }) {
  const emailRecord = {
    id: `email_${Date.now()}`,
    type: 'registration',
    to_name,
    to_email,
    username,
    subject: '🎉 Chào mừng bạn đến với Sổ Chi Tiêu Hàng Ngày',
    body: `Xin chào ${to_name},\n\nTài khoản của bạn (@${username}) đã được tạo thành công trên hệ thống Sổ Chi Tiêu Hàng Ngày.\n\nBắt đầu theo dõi ngân sách và chi tiêu mỗi ngày của bạn ngay hôm nay!`,
    sentAt: new Date().toISOString()
  }

  recordSentEmail(emailRecord)

  const config = getEmailConfig()
  if (isEmailConfigured() && config.WELCOME_TEMPLATE_ID) {
    try {
      await emailjs.send(
        config.SERVICE_ID,
        config.WELCOME_TEMPLATE_ID,
        {
          to_name,
          to_email,
          username,
          message: emailRecord.body
        },
        config.PUBLIC_KEY
      )
    } catch (err) {
      console.warn('EmailJS error (email is recorded in local mailbox):', err)
    }
  }

  return emailRecord
}

/**
 * Gửi mã OTP xác nhận quên mật khẩu
 */
export async function sendOtpEmail({ to_email, to_name, otp }) {
  const emailRecord = {
    id: `email_${Date.now()}`,
    type: 'otp',
    to_name,
    to_email,
    otp_code: otp,
    subject: `🔐 Mã OTP đặt lại mật khẩu: ${otp}`,
    body: `Xin chào ${to_name},\n\nBạn vừa yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email này.\n\nMã xác nhận OTP của bạn là: ${otp}\n(Mã có hiệu lực trong vòng 5 phút). Vui lòng không chia sẻ mã này cho bất kỳ ai.`,
    sentAt: new Date().toISOString()
  }

  recordSentEmail(emailRecord)

  const config = getEmailConfig()
  if (isEmailConfigured() && config.OTP_TEMPLATE_ID) {
    try {
      await emailjs.send(
        config.SERVICE_ID,
        config.OTP_TEMPLATE_ID,
        {
          to_name,
          to_email,
          otp_code: otp,
          message: emailRecord.body
        },
        config.PUBLIC_KEY
      )
    } catch (err) {
      console.warn('EmailJS error (email is recorded in local mailbox):', err)
    }
  }

  return emailRecord
}
