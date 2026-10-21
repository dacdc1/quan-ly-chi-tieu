/**
 * Cấu hình EmailJS (https://www.emailjs.com/)
 * 
 * Miễn phí 200 email/tháng, gửi trực tiếp từ trình duyệt đến hộp thư Gmail/Outlook của người dùng.
 * 
 * Các bước lấy mã miễn phí trong 2 phút:
 * 1. Đăng ký tài khoản tại https://www.emailjs.com/
 * 2. Vào tab "Email Services" -> Add Service (chọn Gmail hoặc Outlook) -> lấy SERVICE_ID
 * 3. Vào tab "Email Templates" -> Create New Template -> lấy TEMPLATE_ID
 *    - Tiêu đề: Thông báo từ Sổ Chi Tiêu Hàng Ngày
 *    - Nội dung có các biến: {{to_name}}, {{to_email}}, {{otp_code}}, {{message}}
 * 4. Vào tab "Account" -> API Keys -> lấy PUBLIC_KEY
 * 
 * Dán 3 mã của bạn vào dưới đây:
 */
export const EMAIL_CONFIG = {
  // Thay thế bằng Service ID của bạn (ví dụ: 'service_abc123')
  SERVICE_ID: '',

  // Template ID cho thư chào mừng đăng ký (ví dụ: 'template_welcome123')
  WELCOME_TEMPLATE_ID: '',

  // Template ID cho thư gửi mã OTP quên mật khẩu (ví dụ: 'template_otp123')
  OTP_TEMPLATE_ID: '',

  // Public Key của bạn (ví dụ: 'user_xyz789...')
  PUBLIC_KEY: '',
}

/**
 * Kiểm tra xem EmailJS đã được cấu hình khóa thật chưa
 */
export function isEmailConfigured() {
  return Boolean(
    EMAIL_CONFIG.SERVICE_ID &&
    EMAIL_CONFIG.PUBLIC_KEY &&
    (EMAIL_CONFIG.WELCOME_TEMPLATE_ID || EMAIL_CONFIG.OTP_TEMPLATE_ID)
  )
}
