import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config
