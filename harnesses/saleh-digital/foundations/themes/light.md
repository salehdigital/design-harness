---
title: Light
slug: light
status: published
chips:
  - Default
created: 2026-11-09T19:23:22Z
updated: 2026-11-09T19:23:22Z
---

The default light theme. Clean, high-contrast, neutral palette.

## Colors

**Surface:**
```css
--paper: #ffffff;
--ink: #000000;
--dot: #e0e0e0;
```

**Accent:**
```css
--accent: #000000;
--accent-text: var(--ink);
--accent-mark: var(--ink);
--accent-wash: transparent;
--on-accent: var(--paper);
```

**Feedback:**
```css
--ok: #1e9e57;
--signal: var(--ink);
--ring: var(--ink);
```

**Warm glow:**
```css
--glow: #ffc81a;
--warm: #d69600;
--warm-halo: #ffc400;
```

**Shadow:**
```css
--shade: #dad8d6;
--shadow: #000000;
--shadow-k: 1;
```

**Selection:**
```css
--select-bg: var(--ink);
--select-fg: var(--paper);
```

**Opacity:**
```css
--op-meta: 0.56;
--op-faint: 0.39;
--grain-k: 1;
```

## Usage

- Pure white background, pure black text
- Active nav items turn black (same as ink)
- Minimal color palette emphasizes typography and texture
- Shadows at natural intensity (shadow-k: 1)

## Theme Meta

```html
<meta name="theme-color" content="#ffffff">
```

## Color Scheme

```css
color-scheme: light;
```
