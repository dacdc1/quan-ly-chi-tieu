const EMAIL_STORAGE_KEY = 'quanlychitieu_email_config_v1'

const DEFAULT_CONFIG = {
  SERVICE_ID: '',
  WELCOME_TEMPLATE_ID: '',
  OTP_TEMPLATE_ID: '',
  PUBLIC_KEY: '',
}

export function getEmailConfig() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_CONFIG
    const raw = localStorage.getItem(EMAIL_STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch (e) {
    return DEFAULT_CONFIG
  }
}

export function saveEmailConfig(config) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(config))
  } catch (e) {
    console.error('Error saving email config:', e)
  }
}

export function isEmailConfigured() {
  const conf = getEmailConfig()
  return Boolean(
    conf.SERVICE_ID &&
    conf.PUBLIC_KEY &&
    (conf.WELCOME_TEMPLATE_ID || conf.OTP_TEMPLATE_ID)
  )
}
