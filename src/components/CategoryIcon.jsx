import React from 'react'
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Home,
  Coffee,
  HeartPulse,
  BookOpen,
  MoreHorizontal,
  Briefcase,
  Sparkles,
  TrendingUp,
  PlusCircle,
  HelpCircle
} from 'lucide-react'

const iconMap = {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Home,
  Coffee,
  HeartPulse,
  BookOpen,
  MoreHorizontal,
  Briefcase,
  Sparkles,
  TrendingUp,
  PlusCircle,
}

export default function CategoryIcon({ name, className = "w-5 h-5", color }) {
  const IconComponent = iconMap[name] || HelpCircle
  return <IconComponent className={className} style={color ? { color } : undefined} />
}
