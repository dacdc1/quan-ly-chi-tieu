export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Ăn uống', icon: 'Utensils', color: '#f59e0b', bgLight: '#fef3c7' },
  { id: 'transport', name: 'Đi lại & Xăng xe', icon: 'Car', color: '#3b82f6', bgLight: '#dbeafe' },
  { id: 'shopping', name: 'Mua sắm', icon: 'ShoppingBag', color: '#a855f7', bgLight: '#f3e8ff' },
  { id: 'bills', name: 'Hóa đơn & Tiện ích', icon: 'Receipt', color: '#06b6d4', bgLight: '#cffafe' },
  { id: 'housing', name: 'Nhà cửa & Tiền phòng', icon: 'Home', color: '#6366f1', bgLight: '#e0e7ff' },
  { id: 'entertainment', name: 'Giải trí & Cafe', icon: 'Coffee', color: '#ec4899', bgLight: '#fce7f3' },
  { id: 'health', name: 'Sức khỏe & Y tế', icon: 'HeartPulse', color: '#10b981', bgLight: '#d1fae5' },
  { id: 'education', name: 'Học tập & Sách', icon: 'BookOpen', color: '#14b8a6', bgLight: '#ccfbf1' },
  { id: 'other', name: 'Chi tiêu khác', icon: 'MoreHorizontal', color: '#64748b', bgLight: '#f1f5f9' },
]

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Tiền lương', icon: 'Briefcase', color: '#10b981', bgLight: '#d1fae5' },
  { id: 'bonus', name: 'Thưởng & Làm thêm', icon: 'Sparkles', color: '#f59e0b', bgLight: '#fef3c7' },
  { id: 'investment', name: 'Đầu tư & Tiết kiệm', icon: 'TrendingUp', color: '#3b82f6', bgLight: '#dbeafe' },
  { id: 'other_income', name: 'Thu nhập khác', icon: 'PlusCircle', color: '#8b5cf6', bgLight: '#ede9fe' },
]

export const PAYMENT_METHODS = [
  { id: 'bank', name: 'Chuyển khoản / App Bank' },
  { id: 'cash', name: 'Tiền mặt' },
  { id: 'e-wallet', name: 'Ví điện tử (Momo, ZaloPay...)' },
  { id: 'credit', name: 'Thẻ tín dụng' },
]

export const DEFAULT_BUDGET = {
  monthlyLimit: 12000000, // 12,000,000 VND default monthly budget
  alertThresholdPercent: 85, // Alert when monthly spend reaches 85%
}
