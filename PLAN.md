# Pomodoro Timer App — Implementation Plan

## Overview

A cross-platform Pomodoro timer (25-minute countdown) with animated pastel themes (Ocean, Forest, Sky/Moon & Stars). Shared codebase via a monorepo using React (web) and React Native (mobile).

---

## 1. Project Structure (Monorepo)

```
pomodoro/
├── packages/
│   ├── shared/                  # Shared logic & theme definitions
│   │   ├── themes/
│   │   │   ├── ocean.ts         # Ocean theme config (colors, animation params)
│   │   │   ├── forest.ts        # Forest theme config
│   │   │   └── sky.ts           # Sky/Moon & Stars theme config
│   │   ├── timer/
│   │   │   └── useTimer.ts      # Core timer hook (start, reset, tick, done)
│   │   └── types.ts             # Shared TypeScript types
│   │
│   ├── web/                     # React (Vite) web app
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── components/
│   │   │   │   ├── Timer.tsx           # Countdown display
│   │   │   │   ├── ThemeBar.tsx        # Theme selector bar
│   │   │   │   ├── Controls.tsx        # Start / Reset buttons
│   │   │   │   └── animations/
│   │   │   │       ├── OceanScene.tsx   # Animated ocean background
│   │   │   │       ├── ForestScene.tsx  # Animated forest background
│   │   │   │       └── SkyScene.tsx     # Animated sky/stars background
│   │   │   └── styles/
│   │   │       └── global.css
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── mobile/                  # React Native (Expo) app
│       ├── App.tsx
│       ├── src/
│       │   ├── components/
│       │   │   ├── Timer.tsx
│       │   │   ├── ThemeBar.tsx
│       │   │   ├── Controls.tsx
│       │   │   └── animations/
│       │   │       ├── OceanScene.tsx
│       │   │       ├── ForestScene.tsx
│       │   │       └── SkyScene.tsx
│       │   └── styles/
│       ├── app.json
│       └── package.json
│
├── package.json                 # Workspace root (npm workspaces)
├── tsconfig.base.json
└── PLAN.md
```

---

## 2. Themes

Each theme defines a **pastel color palette** and **animation configuration**.

### Ocean Theme
| Token              | Value               |
|--------------------|----------------------|
| `background`       | `#C8E6F5` (pastel blue)  |
| `surface`          | `#E0F2FE` (light foam)   |
| `accent`           | `#7EC8E3` (wave blue)    |
| `text`             | `#2B6B8A`               |
| `buttonPrimary`    | `#89CFF0`               |
| `buttonSecondary`  | `#B6E3F4`               |

**Animations:**
- Gentle wave motion across the bottom (CSS keyframe / Reanimated sine wave)
- Floating bubble particles drifting upward
- Subtle shimmer on the water surface

### Forest Theme
| Token              | Value               |
|--------------------|----------------------|
| `background`       | `#D5E8D4` (pastel green) |
| `surface`          | `#E8F5E9`               |
| `accent`           | `#A5D6A7` (leaf green)   |
| `text`             | `#33691E`               |
| `buttonPrimary`    | `#81C784`               |
| `buttonSecondary`  | `#C8E6C9`               |

**Animations:**
- Leaves gently falling from top (randomized paths, rotation)
- Soft swaying tree silhouettes in the background
- Firefly dots fading in and out

### Sky (Moon & Stars) Theme
| Token              | Value               |
|--------------------|----------------------|
| `background`       | `#D6D2E8` (pastel purple/dusk) |
| `surface`          | `#E8E4F0`               |
| `accent`           | `#B39DDB` (lavender)     |
| `text`             | `#4A3872`               |
| `buttonPrimary`    | `#CE93D8`               |
| `buttonSecondary`  | `#E1BEE7`               |

**Animations:**
- Twinkling stars (opacity pulse at random intervals)
- Slow-moving crescent moon with a soft glow
- Occasional shooting star streaking across the sky

---

## 3. Core Components

### `useTimer` Hook (shared)
```
State:
  - secondsRemaining: number (initial: 1500 = 25 min)
  - isRunning: boolean

Actions:
  - start(): begin countdown
  - reset(): stop and restore to 1500
  - tick(): decrement by 1 each second (via setInterval)

Derived:
  - minutes: Math.floor(secondsRemaining / 60)
  - seconds: secondsRemaining % 60
  - progress: 1 - (secondsRemaining / 1500)  // 0→1 for progress ring
```

### Timer Display
- Large centered countdown text: `MM:SS`
- Circular progress ring around the timer (SVG on web, react-native-svg on mobile)
- Ring color matches the active theme's `accent`

### Theme Bar
- Horizontal row of 3 circular/pill buttons (Ocean, Forest, Sky)
- Each button shows a small color swatch or icon
- Active theme is highlighted with a border/scale animation
- Positioned at the top or bottom of the screen

### Controls
- **Start** button — begins the countdown; label changes to **Pause** while running
- **Reset** button — stops the timer and returns to 25:00
- Styled with the active theme's `buttonPrimary` / `buttonSecondary`

---

## 4. Tech Stack

| Concern            | Web                        | Mobile                     |
|--------------------|----------------------------|----------------------------|
| Framework          | React 18 + Vite            | React Native (Expo SDK 51) |
| Language           | TypeScript                 | TypeScript                 |
| Animations         | CSS keyframes + Framer Motion | react-native-reanimated 3 |
| SVG (progress ring)| Inline `<svg>`             | react-native-svg           |
| State              | React useState/useRef (shared hook) | Same shared hook  |
| Styling            | CSS Modules or Tailwind    | StyleSheet / NativeWind    |
| Monorepo           | npm workspaces             | npm workspaces             |

---

## 5. Animation Strategy

### Web (Framer Motion + CSS)
- **Background scene** components render absolutely-positioned animated elements
- Framer Motion `motion.div` for particle animations (bubbles, leaves, stars)
- CSS `@keyframes` for continuous looping effects (waves, shimmer, twinkle)
- `AnimatePresence` for smooth theme-switching transitions

### Mobile (Reanimated + SVG)
- `react-native-reanimated` shared values for smooth 60fps animations
- `withRepeat`, `withTiming`, `withSequence` for looping effects
- Canvas-based particle systems (react-native-skia) or simple Animated.View for lightweight particles
- `Layout` transitions for theme-switch animations

---

## 6. Implementation Phases

### Phase 1 — Scaffolding & Shared Logic
- [ ] Initialize monorepo with npm workspaces
- [ ] Create `packages/shared` with TypeScript config
- [ ] Implement `useTimer` hook with start/pause/reset
- [ ] Define theme type definitions and all 3 theme configs
- [ ] Set up Vite web project (`packages/web`)
- [ ] Set up Expo project (`packages/mobile`)

### Phase 2 — Web App (Core UI)
- [ ] Build `Timer` component with SVG progress ring
- [ ] Build `ThemeBar` component with theme switching
- [ ] Build `Controls` component (Start/Pause + Reset)
- [ ] Wire up `useTimer` + theme context in `App.tsx`
- [ ] Basic responsive layout (centered, works on desktop & mobile browsers)

### Phase 3 — Web Animations
- [ ] Implement `OceanScene` (waves + bubbles)
- [ ] Implement `ForestScene` (falling leaves + fireflies)
- [ ] Implement `SkyScene` (twinkling stars + moon + shooting stars)
- [ ] Add theme-switch transition animation
- [ ] Polish timing, easing, and pastel color tuning

### Phase 4 — Mobile App (Core UI)
- [ ] Port `Timer`, `ThemeBar`, `Controls` to React Native
- [ ] Implement SVG progress ring with react-native-svg
- [ ] Wire up shared `useTimer` hook and theme context
- [ ] Adapt layout for phone screens (safe areas, sizing)

### Phase 5 — Mobile Animations
- [ ] Port `OceanScene` with Reanimated
- [ ] Port `ForestScene` with Reanimated
- [ ] Port `SkyScene` with Reanimated
- [ ] Theme-switch transitions

### Phase 6 — Polish & Ship
- [ ] Audio chime / vibration when timer completes
- [ ] Persist last-selected theme (AsyncStorage / localStorage)
- [ ] Accessibility (screen reader labels, reduced-motion media query)
- [ ] App icons and splash screen (Expo)
- [ ] Final QA on iOS, Android, and web browsers

---

## 7. UI Wireframe (ASCII)

```
┌─────────────────────────────────┐
│  ╭──────── Theme Bar ────────╮  │
│  │ (🌊) (🌲) (🌙)           │  │
│  ╰───────────────────────────╯  │
│                                 │
│     ┌─────────────────────┐     │
│     │                     │     │
│     │    ╭───────────╮    │     │
│     │    │           │    │     │  ← Animated background
│     │    │   25:00   │    │     │    fills entire screen
│     │    │           │    │     │
│     │    ╰───────────╯    │     │  ← Progress ring around time
│     │                     │     │
│     └─────────────────────┘     │
│                                 │
│      [ ▶ Start ]  [ ↺ Reset ]  │
│                                 │
└─────────────────────────────────┘
```

---

## 8. Key Design Decisions

1. **Monorepo with shared package** — maximizes code reuse for timer logic and theme definitions; only UI rendering and animation differ per platform.
2. **Framer Motion (web) vs Reanimated (mobile)** — each is the best-in-class animation library for its platform; no compromises.
3. **Pastel palette per theme** — soft, non-distracting colors keep focus on the timer while still feeling immersive.
4. **SVG progress ring** — lightweight, resolution-independent, and easy to animate on both platforms.
5. **Expo for mobile** — simplifies setup, build, and distribution; supports both iOS and Android from one codebase.
