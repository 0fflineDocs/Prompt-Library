# Project – Style Guide

## Typography

### Primary Font
- **Font Family**: Space Grotesk
- **Source**: Google Fonts
- **Weights Used**: 500 (Medium), 700 (Bold)
- **Usage**: Logo/branding text in header

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
```

### System Font Stack (Tailwind Default)
The rest of the UI uses Tailwind's default sans-serif font stack:
```
ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

### Font Sizes
| Element | Tailwind Class | Description |
|---------|---------------|-------------|
| Logo | `text-2xl font-bold` | 1.5rem / 24px, bold |
| Section Title | `text-xl font-semibold` | 1.25rem / 20px |
| Modal Title | `text-lg font-semibold` | 1.125rem / 18px |
| Card Title | `text-sm font-semibold` | 0.875rem / 14px |
| Body Text | `text-sm` | 0.875rem / 14px |
| Small Text | `text-xs` | 0.75rem / 12px |
| Monospace | `font-mono text-xs` | For IDs and codes |

---

## Color Palette

### Background Colors
| Layer | Tailwind Class | Hex Value |
|-------|---------------|-----------|
| Body / Base | `bg-slate-900` | `#0F172A` |
| Surface | `bg-slate-800` | `#1E293B` |
| Surface (muted) | `bg-slate-800/50` | `#1E293B` @ 50% |
| Overlay | `bg-black/60` | Black @ 60% |

### Text Colors
| Usage | Tailwind Class | Description |
|-------|---------------|-------------|
| Primary Text | `text-slate-100` | Bright text |
| Heading | `text-slate-50` | Brightest text |
| Secondary Text | `text-slate-200` | Slightly muted |
| Muted Text | `text-slate-300` | Supporting content |
| Tertiary Text | `text-slate-400` | Descriptions, labels |
| Disabled/Subtle | `text-slate-500` | IDs, timestamps, hints |

### Border Colors
| Usage | Tailwind Class |
|-------|---------------|
| Default | `border-slate-700/50` |
| Hover | `border-slate-600/50` |
| Header | `border-slate-800/50` |
| Dividers | `border-slate-700/30` |

---

## Framework Accent Colors

Each compliance framework has a dedicated color scheme:

| Framework | Primary Color | Accent Name | Hex |
|-----------|--------------|-------------|-----|
| NCSC | Blue | `blue` | `#60A5FA` |
| NIS2 | Emerald | `emerald` | `#34D399` |
| DORA | Amber | `amber` | `#FCD34D` |

### Accent Usage
- Left border on cards: `border-l-{color}-400/40`
- Active tab indicator: `bg-{color}12` (12% opacity)
- Framework link color: Dynamic via `style={{ color: framework.color }}`

---

## Priority Badge Colors

| Priority | Background | Text |
|----------|-----------|------|
| Critical | `bg-red-500/10` | `text-red-400` |
| High | `bg-orange-500/10` | `text-orange-400` |
| Medium | `bg-yellow-500/10` | `text-yellow-400` |

---

## License Badge Colors

| License Tier | Background | Text | Border |
|--------------|-----------|------|--------|
| Microsoft 365 E3 | `bg-sky-500/8` | `text-sky-400` | `border-sky-500/20` |
| Microsoft 365 E5 | `bg-purple-500/8` | `text-purple-400` | `border-purple-500/20` |
| M365 E5 Security | `bg-rose-500/8` | `text-rose-400` | `border-rose-500/20` |
| M365 E5 Compliance | `bg-indigo-500/8` | `text-indigo-400` | `border-indigo-500/20` |
| Entra ID P1 | `bg-teal-500/8` | `text-teal-400` | `border-teal-500/20` |
| Entra ID P2 | `bg-cyan-500/8` | `text-cyan-400` | `border-cyan-500/20` |
| Standalone | `bg-slate-500/8` | `text-slate-400` | `border-slate-500/20` |
| Included | `bg-emerald-500/8` | `text-emerald-400` | `border-emerald-500/20` |

---

## Complexity Indicator Colors

| Complexity | Text Color | Bar Fill |
|------------|-----------|----------|
| Low | `text-emerald-400` | `bg-emerald-400` |
| Medium | `text-amber-400` | `bg-amber-400` |
| High | `text-red-400` | `bg-red-400` |

---

## Component Styling

### Cards
```css
/* Requirement Card */
rounded-lg
border border-slate-700/50
border-l-2 border-l-{accent}-400/40
bg-slate-800/50
p-5

/* Hover State */
hover:bg-slate-800
hover:border-slate-600/50
```

### Buttons
```css
/* Primary Navigation Tab */
px-4 py-2
rounded-lg
text-sm font-medium
transition-colors duration-200

/* Active: */
color: {framework.color}
background: {color}12

/* Inactive: */
text-slate-400
hover:text-slate-200
```

### Input Fields
```css
w-full
px-4 py-2.5
bg-slate-800/50
border border-slate-700/50
rounded-lg
text-slate-200
placeholder-slate-500
text-sm
transition-all duration-200
outline-none

/* Focused: */
border-slate-600
ring-1 ring-slate-600/50
```

### Badges (Pill Style)
```css
inline-flex items-center
px-2.5 py-0.5
rounded-full
text-xs font-medium
```

### Badges (Tag Style)
```css
inline-flex items-center
px-2.5 py-1
rounded-md
text-xs font-medium
border
```

### Modals
```css
/* Overlay */
fixed inset-0 z-50
bg-black/60 backdrop-blur-sm

/* Modal Container */
w-full max-w-2xl max-h-[85vh]
overflow-y-auto
rounded-xl
bg-slate-900
border border-slate-700/50
shadow-2xl
```

---

## Effects & Interactions

### Backdrop Blur
- Header: `backdrop-blur-md`
- Modal overlay: `backdrop-blur-sm`
- Sticky sections: `backdrop-blur-sm`

### Shadows
- Cards: None (relies on borders)
- Modals: `shadow-2xl`
- Dropdowns: `shadow-xl shadow-black/20`

### Transitions
| Property | Duration | Easing |
|----------|----------|--------|
| Colors | `200ms` | Default |
| All | `200ms` | Default |
| Framer Motion entry | `300-400ms` | `easeOut` |
| Spring animations | `damping: 25, stiffness: 300` | Spring |

---

## Layout

### Container
```css
max-w-7xl mx-auto
px-4 sm:px-6 lg:px-8
```

### Main Content
```css
py-8
```

### Header
```css
sticky top-0 z-40
h-16
bg-slate-900/95
backdrop-blur-md
border-b border-slate-800/50
```

### Grid (Cards)
```css
grid gap-4
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## Animation Patterns (Framer Motion)

### Fade Up Entry
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
```

### Staggered Cards
```javascript
transition={{ duration: 0.3, delay: index * 0.05 }}
```

### Modal Entry
```javascript
initial={{ opacity: 0, scale: 0.95, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
transition={{ type: 'spring', damping: 25, stiffness: 300 }}
```

### Layout Animation (Active Indicator)
```javascript
layoutId="activeFramework"
transition={{ type: 'spring', damping: 25, stiffness: 300 }}
```

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| TypeScript | ~5.9.3 | Type Safety |
| Tailwind CSS | 4.1.18 | Styling |
| Framer Motion | 12.33.0 | Animations |
| Lucide React | 0.563.0 | Icons |
| Vite | 7.2.4 | Build Tool |

---

## File Structure

```
src/
├── components/
│   ├── layout/          # Layout wrappers
│   ├── sections/        # Page sections
│   └── ui/              # Reusable UI components
├── data/                # Static data files
└── types/               # TypeScript types
```
