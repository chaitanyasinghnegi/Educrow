# EduCrow — UI & Design System Reference

> **Purpose:** Documents the current visual design, layout structure, color palette, typography, component patterns, and frameworks used. Read this before making any UI changes.

---

## Frameworks & Libraries

| Layer | Technology |
|-------|-----------|
| **CSS Framework** | Tailwind CSS v3.4 (via `@astrojs/tailwind` integration) |
| **UI Component Library** | Chakra UI v2.8 (used in React components only — `CodeEditor`, `LanguageSelector`, `Output`) |
| **Tailwind Config** | Minimal — no custom theme extensions, no plugins (`tailwind.config.mjs`) |
| **Chakra Theme** | Dark mode forced (`initialColorMode: "dark"`, `useSystemColorMode: false`) — defined in `src/theme.js` |

> **Note:** Chakra UI's dark mode config exists in `theme.js` but is not clearly applied via a `ChakraProvider` wrapper in the Astro layouts. Chakra components render inline.

---

## Overall Layout Structure

```
┌──────────────────────────────────────┐
│  Navigation (top bar)                │
├──────────────────────────────────────┤
│                                      │
│  Main Content Area                   │
│  (container mx-auto px-4 py-8)       │
│                                      │
├──────────────────────────────────────┤
│  Footer                             │
└──────────────────────────────────────┘
```

- **Layout file:** `src/layouts/MainLayout.astro` — wraps every page except the landing page's outer shell.
- **Body:** `min-h-screen bg-gray-50` — light gray background.
- **Main:** `container mx-auto px-4 py-8` — centered, padded content area.
- **No sidebar.** Navigation is a horizontal top bar only.
- **Secondary layout:** `src/layouts/Layout.astro` (unused by most pages) — has a dark background (`#13151a`) and CSS custom properties.

---

## Color Palette

### Primary / Accent Colors
| Usage | Color | Utility Class / Value |
|-------|-------|----------------------|
| Primary action buttons | Indigo 600 | `bg-indigo-600` / `#4F46E5` |
| Primary hover | Indigo 700 | `bg-indigo-700` / `#4338CA` |
| Primary text/links | Indigo 600 | `text-indigo-600` |
| Link hover | Indigo 800 | `text-indigo-800` |
| Active pill / badge bg | Indigo 100 | `bg-indigo-100` |
| Active pill text | Indigo 700 | `text-indigo-700` |

### Landing Page Gradient
| Element | Value |
|---------|-------|
| Background | `bg-gradient-to-br from-indigo-500 to-purple-600` |
| Card glass | `bg-white/10 backdrop-blur-lg` |
| Sign Up button | `bg-purple-700` with `border-purple-400` |
| Subtitle text | `text-purple-100` |

### Difficulty Badges
| Level | Background | Text |
|-------|-----------|------|
| Easy / Beginner | `bg-green-100` | `text-green-800` |
| Medium / Intermediate | `bg-yellow-100` | `text-yellow-800` |
| Hard / Advanced | `bg-red-100` | `text-red-800` |

### Neutral / Background
| Usage | Value |
|-------|-------|
| Page background | `bg-gray-50` (`#F9FAFB`) |
| Navigation background | `bg-white` with `shadow-lg` |
| Footer background | `bg-gray-800` (`#1F2937`) |
| Card background | `bg-white` |
| Code block background | `#f3f4f6` (gray-100) |
| Text primary | `text-gray-800` / `text-gray-900` |
| Text secondary | `text-gray-600` |
| Text muted | `text-gray-500` |
| Error text | `text-red-500` |

### Layout.astro CSS Custom Properties (Alternative Layout)
| Variable | Value |
|----------|-------|
| `--accent` | `136, 58, 234` (purple, RGB) |
| `--accent-light` | `224, 204, 250` |
| `--accent-dark` | `49, 10, 101` |
| HTML background | `#13151a` |
| Card background | `#23262d` |

### Code Editor (Chakra/Monaco)
| Element | Value |
|---------|-------|
| Language selector menu bg | `#110c1b` |
| Active language color | `blue.400` |
| Output border (normal) | `#333` |
| Output border (error) | `red.500` |
| Output text (error) | `red.400` |

---

## Typography

| Property | Value |
|----------|-------|
| **Body font** | `system-ui, sans-serif` (set in `Layout.astro`) — Tailwind default also applies |
| **Code font** | `Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace` |
| **No custom Google Fonts loaded.** | |

### Heading Sizes (Tailwind classes used)
| Context | Class | Size |
|---------|-------|------|
| Landing page hero | `text-6xl font-bold` | 3.75rem |
| Page titles | `text-4xl font-bold` | 2.25rem |
| Section titles | `text-3xl font-bold` | 1.875rem |
| Card headings | `text-xl font-semibold` or `text-2xl font-bold` | 1.25–1.5rem |
| Body text | `text-base` (default) | 1rem |
| Small text / badges | `text-sm` | 0.875rem |

### Prose Styles (Cheatsheet Modal)
| Element | Style |
|---------|-------|
| `.prose` color | `#374151` (gray-700) |
| `.prose h1` | `2.25rem`, bold |
| `.prose h2` | `1.5rem`, semibold, `margin-top: 2rem` |
| `.prose p` | `line-height: 1.6` |
| `.prose code` | gray-100 bg, `0.875em` |
| `.prose pre` | gray-100 bg, `1rem` padding, rounded |

---

## Component Patterns

### Cards
| Component | Style |
|-----------|-------|
| `FeatureCard.astro` | `bg-white rounded-lg shadow-md hover:shadow-lg`, emoji icon + title + description |
| `VideoCard.astro` | `bg-white rounded-lg shadow-md`, thumbnail image + title + difficulty badge + duration + "Watch Now" link. Hover: `-translate-y-1`. Staggered fade-in animation. |
| `Card.astro` | Dark card style (`#23262d`), gradient hover using CSS variables. Used in the alternative `Layout.astro`. |
| `AnimatedButton.astro` | `bg-white rounded-lg shadow-lg`, emoji icon + name + pill badge. Hover lift (`-translate-y-1`), gradient overlay on hover. Fade-in animation with configurable `--delay`. |
| `LanguageCard.astro` | `bg-white rounded-lg shadow-md hover:shadow-lg`, emoji icon + name + description. Links to `/videos/[id]`. |
| Glass cards (landing page) | `bg-white/10 backdrop-blur-lg rounded-xl`, hover to `bg-white/20` |

### Buttons
| Variant | Style |
|---------|-------|
| Primary (CTA) | `bg-indigo-600 text-white rounded-md/lg hover:bg-indigo-700`, focus ring |
| Rounded pill (landing) | `rounded-full px-8 py-3 font-semibold text-lg` |
| Filter (active) | `bg-indigo-600 text-white rounded-full text-sm font-medium` |
| Filter (inactive) | `bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full` |
| Run Code (Chakra) | Chakra `Button`, `variant="outline"`, `colorScheme="green"` |
| Text button | `text-indigo-600 hover:text-indigo-800` (e.g., "View Cheatsheet →") |

### Modals
- **Cheatsheet modal:** Dynamically created `div` with `fixed inset-0 bg-black bg-opacity-50`, a white inner panel (`rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto`), and a blue Close button. Dismissed on backdrop or button click.

### Badges
- Rounded pills for difficulty: `px-3 py-1 rounded-full text-sm` with difficulty-specific colors (see Difficulty Badges above).

---

## Animations

| Animation | Usage | Keyframes |
|-----------|-------|-----------|
| `fade-in` | Landing page hero title | `opacity: 0, translateY(-20px)` → `opacity: 1, translateY(0)` |
| `fadeIn` | `AnimatedButton.astro` | `opacity: 0, translateY(20px)` → `opacity: 1, translateY(0)` with `--delay` |
| `fadeInUp` | Video tutorial cards | Same as fadeIn, `--delay` based on card index |
| Hover lift | Cards, buttons | `hover:-translate-y-1` with `transition-all duration-300` |
| Hover shadow | Cards | `hover:shadow-lg` or `hover:shadow-xl` |
| Hover scale | `AnimatedButton` icon | `group-hover:scale-110` |

---

## Responsive Behavior

| Breakpoint | Behavior |
|-----------|----------|
| **Default (mobile)** | Single column grids, navigation links hidden (`hidden md:flex`) |
| **`md` (768px)** | 2-column grids for features, problems, cheatsheets, videos. Navigation links visible. |
| **`lg` (1024px)** | 3-column grids for video cards, cheatsheet cards. 4-column grid on landing page. |
| **No mobile menu** | The navigation has no hamburger/drawer for small screens. |
