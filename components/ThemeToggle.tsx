'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'tpb-theme'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.remove('dark')
    root.style.colorScheme = 'light'
  }
  root.dataset.theme = theme
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY)) as Theme | null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      applyTheme(stored)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const fallback = prefersDark ? 'dark' : 'light'
      setTheme(fallback)
      applyTheme(fallback)
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved !== 'light' && saved !== 'dark') {
        const nextTheme: Theme = event.matches ? 'dark' : 'light'
        setTheme(nextTheme)
        applyTheme(nextTheme)
      }
    }
    media.addEventListener('change', handleChange)
    setMounted(true)

    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!mounted) return
    window.localStorage.setItem(STORAGE_KEY, theme)
    applyTheme(theme)
  }, [theme, mounted])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 animate-pulse" aria-hidden />
    )
  }

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 shadow-soft hover:shadow-md transition"
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === 'dark'}
    >
      <SunIcon className={`absolute transition-all duration-300 ${theme === 'light' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}`} />
      <MoonIcon className={`absolute transition-all duration-300 ${theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-90'}`} />
    </button>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`w-5 h-5 text-amber-500 ${className ?? ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.95 7.05-1.4-1.4M6.45 6.45 5.05 5.05m12.9 0-1.4 1.4M6.45 17.55l-1.4 1.4" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`w-5 h-5 text-sky-400 ${className ?? ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" />
    </svg>
  )
}
