# 🎨 Design System & UI Architecture

**Date**: October 2, 2025  
**Status**: Production-Ready Specification  
**Implementation**: Drop-in ready

---

## 🎯 Overview

Complete design system with:
- Tokenized theme (CSS variables)
- Tailwind configuration
- Component library specs
- Typography & spacing system
- Dark mode support

---

## 🎨 Color Tokens

### CSS Variables (app/globals.css)

```css
:root {
  /* ========================================
     BRAND CORE
     ======================================== */
  --brand-950: #061823;
  --brand-900: #0b2a3b;  /* Primary - Navy */
  --brand-700: #124960;
  --brand-500: #1f6f8a;

  /* ========================================
     ACCENT & FEEDBACK
     ======================================== */
  --accent-500: #ef7d00;  /* Orange - buttons, chips, links */
  --accent-600: #cc6d00;  /* Orange hover */
  --ok-500: #10b981;      /* Success - green */
  --warn-500: #f59e0b;    /* Warning - amber */
  --err-500: #ef4444;     /* Error - red */

  /* ========================================
     NEUTRALS
     ======================================== */
  --fg: #0f172a;          /* Foreground - zinc-900 */
  --fg-soft: #334155;     /* Secondary text - zinc-700 */
  --muted: #64748b;       /* Muted text - zinc-500 */
  --border: #e5e7eb;      /* Borders - gray-200 */
  --bg: #ffffff;          /* Background - white */
  --bg-soft: #f8fafc;     /* Soft background - zinc-50 */

  /* ========================================
     DESIGN TOKENS
     ======================================== */
  --radius: 16px;         /* Border radius - rounded-2xl */
  --shadow: 0 8px 30px rgba(2, 6, 23, 0.08);
  --ring: 0 0 0 3px rgba(239, 125, 0, 0.35);  /* Focus ring */
}

/* ========================================
   DARK MODE
   ======================================== */
.dark {
  --fg: #e5e7eb;          /* gray-200 */
  --fg-soft: #cbd5e1;     /* gray-300 */
  --muted: #94a3b8;       /* gray-400 */
  --bg: #0b1220;          /* Dark navy */
  --bg-soft: #0f172a;     /* zinc-900 */
  --border: #1f2937;      /* gray-800 */
  --shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  --ring: 0 0 0 3px rgba(239, 125, 0, 0.45);
}
```

---

## ⚙️ Tailwind Configuration

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: 'var(--brand-950)',
          900: 'var(--brand-900)',
          700: 'var(--brand-700)',
          500: 'var(--brand-500)',
        },
        accent: {
          600: 'var(--accent-600)',
          500: 'var(--accent-500)',
        },
        ok: {
          500: 'var(--ok-500)',
        },
        warn: {
          500: 'var(--warn-500)',
        },
        err: {
          500: 'var(--err-500)',
        },
        fg: {
          DEFAULT: 'var(--fg)',
          soft: 'var(--fg-soft)',
          muted: 'var(--muted)',
        },
        surface: {
          DEFAULT: 'var(--bg)',
          soft: 'var(--bg-soft)',
        },
        border: 'var(--border)',
      },
      borderRadius: {
        xl: 'var(--radius)',     // 16px
        photo: '12px',            // Photos use slightly tighter radius
      },
      boxShadow: {
        brand: 'var(--shadow)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],  // Newsreader, Recoleta
        sans: ['var(--font-sans)', 'sans-serif'],   // Inter
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      lineHeight: {
        body: '1.6',
        heading: '1.25',
      },
      spacing: {
        section: '4rem',          // py-16 (64px)
        'section-lg': '6rem',     // py-24 (96px)
      },
      maxWidth: {
        content: '65ch',          // Optimal reading width
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 📐 Typography System

### Font Setup (app/layout.tsx)

```typescript
import { Inter } from 'next/font/google';
import { Newsreader } from 'next/font/google';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Newsreader({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

### Typography Scale

| Class | Size | Use Case |
|-------|------|----------|
| `text-xs` | 12px | Captions, metadata |
| `text-sm` | 14px | Secondary text, labels |
| `text-base` | 16px | Body copy |
| `text-lg` | 18px | Lead paragraphs |
| `text-xl` | 20px | Section headings |
| `text-2xl` | 24px | Card titles |
| `text-3xl` | 30px | Page headings |
| `text-4xl` | 36px | Hero headings |

### Line Height

- **Body text**: `leading-body` (1.6)
- **Headings**: `leading-heading` (1.25)

---

## 🧩 Component Specifications

### Button Variants

```tsx
// components/ui/Button.tsx
const buttonVariants = {
  // Primary: Main actions
  primary: 'bg-brand-900 hover:bg-brand-700 text-white',
  
  // Accent: Fun actions (share, follow)
  accent: 'bg-accent-500 hover:bg-accent-600 text-white',
  
  // Ghost: Subtle actions
  ghost: 'hover:bg-surface-soft text-fg',
  
  // Outline: Secondary actions
  outline: 'border-2 border-border hover:bg-surface-soft text-fg',
  
  // Destructive: Delete, remove
  destructive: 'bg-err-500 hover:bg-red-600 text-white',
};

// All buttons share these base classes:
const baseClasses = 'rounded-xl px-4 py-2 font-medium transition-colors focus:outline-none focus-visible:[box-shadow:var(--ring)]';
```

### Card

```tsx
// components/ui/Card.tsx
<div className="rounded-xl shadow-brand border border-border bg-surface p-6">
  {children}
</div>
```

### Chip/Tag

```tsx
// components/ui/Chip.tsx
<span className="inline-flex items-center rounded-full bg-surface-soft text-fg-soft text-sm px-3 py-1">
  {label}
</span>
```

### Photo Card

```tsx
// components/PhotoCard.tsx
<div className="relative rounded-photo overflow-hidden group">
  <img src={photo.variants.grid} alt={photo.altText} className="w-full" />
  
  {/* Overlay gradient */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
    {/* EXIF icons */}
    <div className="absolute bottom-2 left-2 flex gap-2 text-white text-xs">
      {photo.camera && <span>📷 {photo.camera}</span>}
      {photo.lat && <span>📍 {place.name}</span>}
    </div>
  </div>
</div>
```

### Alert Variants

```tsx
// components/ui/Alert.tsx
const alertVariants = {
  success: 'bg-ok-500/10 border-ok-500 text-ok-500',
  warning: 'bg-warn-500/10 border-warn-500 text-warn-500',
  error: 'bg-err-500/10 border-err-500 text-err-500',
  info: 'bg-brand-500/10 border-brand-500 text-brand-500',
};
```

### Skeleton Loader

```tsx
// components/ui/Skeleton.tsx
<div className="animate-pulse bg-surface-soft rounded-xl h-48" />
```

---

## 📏 Spacing & Rhythm

### Grid System

- **Base unit**: 8px
- **Section padding**: `py-16 md:py-24` (64px → 96px)
- **Card spacing**: `p-6` (24px)
- **Element gaps**: `gap-4` (16px) or `gap-6` (24px)

### Max Widths

```tsx
// Content (text)
<div className="max-w-content">  {/* 65ch - optimal reading */}

// Standard layout
<div className="max-w-screen-lg"> {/* 1024px */}

// Wide galleries
<div className="max-w-screen-2xl"> {/* 1536px */}
```

---

## 🎯 Focus & Accessibility

### Focus Ring

All interactive elements:
```tsx
className="focus:outline-none focus-visible:[box-shadow:var(--ring)]"
```

### Alt Text Strategy

```typescript
// Priority order:
1. photo.altText (user-provided)
2. photo.description (fallback)
3. `${place.name} – ${trip.title} – ${formatDate(photo.takenAt)}` (generated)
```

---

## 🎨 Style Guardrails

### Rules

1. **Buttons**: Primary for main actions, accent for "fun" actions (share, follow). Never mix in one row.

2. **Widths**: Content max `max-w-screen-lg` for readability; galleries can bleed to `max-w-screen-2xl`.

3. **Radius**: 16px (`rounded-xl`) everywhere; photos use 12px (`rounded-photo`) to differentiate.

4. **Shadows**: Only on interactive cards; static content uses borders.

5. **Alt text**: Always required. Fallback to Place – Trip – Date if missing.

6. **Color usage**:
   - Brand navy (`brand-900`): Navigation, primary actions
   - Accent orange (`accent-500`): CTAs, highlights, interactive elements
   - Never use accent for text (accessibility)

---

## 🌓 Dark Mode

### Implementation

```tsx
// components/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl hover:bg-surface-soft"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

### Theme Provider

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

---

## 📦 Component Library (shadcn/ui)

### Install

```bash
npx shadcn-ui@latest init
```

### Components to Add

```bash
# Core UI
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast

# Forms
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group

# Data Display
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar

# Navigation
npx shadcn-ui@latest add navigation-menu
npx shadcn-ui@latest add command  # For search

# Advanced
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add sheet     # For mobile drawer
```

### Customization

All shadcn components automatically use your CSS variables!

```tsx
// Example: Button already uses your tokens
<Button variant="default">  {/* Uses brand-900 */}
<Button variant="destructive">  {/* Uses err-500 */}
```

---

## 🎬 Animation Tokens

```css
/* Add to app/globals.css */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

/* Usage */
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-slide-up { animation: slideUp 0.4s ease-out; }
```

---

## 📝 Implementation Checklist

### Phase 1: Foundation
- [ ] Add CSS variables to `app/globals.css`
- [ ] Update `tailwind.config.ts` with theme
- [ ] Install fonts (Inter + Newsreader)
- [ ] Add `next-themes` for dark mode

### Phase 2: Components
- [ ] Initialize shadcn/ui
- [ ] Add core components (button, card, dialog)
- [ ] Create custom photo card component
- [ ] Build chip/tag component

### Phase 3: Polish
- [ ] Add focus ring utilities
- [ ] Create skeleton loaders
- [ ] Test dark mode across all components
- [ ] Document component usage

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install next-themes
npm install @next/font

# 2. Initialize shadcn/ui
npx shadcn-ui@latest init

# 3. Copy CSS variables to app/globals.css

# 4. Update tailwind.config.ts

# 5. Add fonts to app/layout.tsx

# 6. Start using!
```

---

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Status**: ✅ Ready to implement  
**Estimated time**: 2-3 hours to complete all phases
