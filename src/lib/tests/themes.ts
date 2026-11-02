import type { ThemeKey } from './types'

// Tailwind v4는 소스에 문자열 그대로 있는 클래스만 생성하므로 동적 조합 금지. 전부 리터럴로 둔다.
export interface Theme {
  pageBg: string
  badge: string
  accentText: string
  progress: string
  option: string
  optionActive: string
  primaryBtn: string
  softBtn: string
  card: string
  /** satori(OG)·canvas용 hex */
  hex: { bg: string; card: string; label: string; name: string }
}

export const THEMES: Record<ThemeKey, Theme> = {
  rose: {
    pageBg: 'bg-gradient-to-b from-rose-50 to-white',
    badge: 'bg-rose-100 text-rose-700',
    accentText: 'text-rose-700',
    progress: 'bg-rose-400',
    option: 'hover:border-rose-300 hover:bg-rose-50',
    optionActive: 'bg-rose-500 text-white border-rose-500',
    primaryBtn: 'bg-rose-500 hover:bg-rose-600 text-white',
    softBtn: 'border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100',
    card: 'bg-rose-50 border-rose-200',
    hex: { bg: '#ffe4e6', card: '#fff1f2', label: '#e11d48', name: '#be123c' },
  },
  sky: {
    pageBg: 'bg-gradient-to-b from-sky-50 to-white',
    badge: 'bg-sky-100 text-sky-700',
    accentText: 'text-sky-700',
    progress: 'bg-sky-400',
    option: 'hover:border-sky-300 hover:bg-sky-50',
    optionActive: 'bg-sky-500 text-white border-sky-500',
    primaryBtn: 'bg-sky-500 hover:bg-sky-600 text-white',
    softBtn: 'border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100',
    card: 'bg-sky-50 border-sky-200',
    hex: { bg: '#e0f2fe', card: '#f0f9ff', label: '#0284c7', name: '#0369a1' },
  },
  violet: {
    pageBg: 'bg-gradient-to-b from-violet-50 to-white',
    badge: 'bg-violet-100 text-violet-700',
    accentText: 'text-violet-700',
    progress: 'bg-violet-400',
    option: 'hover:border-violet-300 hover:bg-violet-50',
    optionActive: 'bg-violet-500 text-white border-violet-500',
    primaryBtn: 'bg-violet-500 hover:bg-violet-600 text-white',
    softBtn: 'border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100',
    card: 'bg-violet-50 border-violet-200',
    hex: { bg: '#ede9fe', card: '#f5f3ff', label: '#7c3aed', name: '#6d28d9' },
  },
  amber: {
    pageBg: 'bg-gradient-to-b from-amber-50 to-white',
    badge: 'bg-amber-100 text-amber-800',
    accentText: 'text-amber-700',
    progress: 'bg-amber-400',
    option: 'hover:border-amber-300 hover:bg-amber-50',
    optionActive: 'bg-amber-500 text-white border-amber-500',
    primaryBtn: 'bg-amber-500 hover:bg-amber-600 text-white',
    softBtn: 'border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100',
    card: 'bg-amber-50 border-amber-200',
    hex: { bg: '#fef3c7', card: '#fffbeb', label: '#d97706', name: '#b45309' },
  },
  emerald: {
    pageBg: 'bg-gradient-to-b from-emerald-50 to-white',
    badge: 'bg-emerald-100 text-emerald-700',
    accentText: 'text-emerald-700',
    progress: 'bg-emerald-400',
    option: 'hover:border-emerald-300 hover:bg-emerald-50',
    optionActive: 'bg-emerald-500 text-white border-emerald-500',
    primaryBtn: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    softBtn: 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100',
    card: 'bg-emerald-50 border-emerald-200',
    hex: { bg: '#d1fae5', card: '#ecfdf5', label: '#059669', name: '#047857' },
  },
  pink: {
    pageBg: 'bg-gradient-to-b from-pink-50 to-white',
    badge: 'bg-pink-100 text-pink-700',
    accentText: 'text-pink-700',
    progress: 'bg-pink-400',
    option: 'hover:border-pink-300 hover:bg-pink-50',
    optionActive: 'bg-pink-500 text-white border-pink-500',
    primaryBtn: 'bg-pink-500 hover:bg-pink-600 text-white',
    softBtn: 'border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100',
    card: 'bg-pink-50 border-pink-200',
    hex: { bg: '#fce7f3', card: '#fdf2f8', label: '#db2777', name: '#be185d' },
  },
  indigo: {
    pageBg: 'bg-gradient-to-b from-indigo-50 to-white',
    badge: 'bg-indigo-100 text-indigo-700',
    accentText: 'text-indigo-700',
    progress: 'bg-indigo-400',
    option: 'hover:border-indigo-300 hover:bg-indigo-50',
    optionActive: 'bg-indigo-500 text-white border-indigo-500',
    primaryBtn: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    softBtn: 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100',
    card: 'bg-indigo-50 border-indigo-200',
    hex: { bg: '#e0e7ff', card: '#eef2ff', label: '#4f46e5', name: '#4338ca' },
  },
  teal: {
    pageBg: 'bg-gradient-to-b from-teal-50 to-white',
    badge: 'bg-teal-100 text-teal-700',
    accentText: 'text-teal-700',
    progress: 'bg-teal-400',
    option: 'hover:border-teal-300 hover:bg-teal-50',
    optionActive: 'bg-teal-500 text-white border-teal-500',
    primaryBtn: 'bg-teal-500 hover:bg-teal-600 text-white',
    softBtn: 'border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100',
    card: 'bg-teal-50 border-teal-200',
    hex: { bg: '#ccfbf1', card: '#f0fdfa', label: '#0d9488', name: '#0f766e' },
  },
}
