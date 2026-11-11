---
title: Marathon Dark
slug: marathon-dark
status: published
chips:
  - Neon
  - Lime
created: 2026-11-09T19:23:22Z
updated: 2026-11-09T19:23:22Z
---

High-contrast dark theme with neon accent system. Default accent: lime green.

## Colors

**Surface:**
```css
--paper: #0b0b0c;
--ink: #ece8e1;
--dot: #2b2a28;
```

**Accent (Lime, default):**
```css
--accent: #c2fe0b;
--accent-text: #c2fe0b;
--accent-mark: #c2fe0b;
--accent-wash: #c2fe0b;
--on-accent: #0b0b0c;
```

**Signal:**
```css
--signal: #01ffff;  /* cyan */
--tint: var(--signal);
--swell: var(--signal);
```

**Feedback:**
```css
--ok: var(--accent);
--glow: var(--accent);
--ring: var(--accent-mark);
```

**Footer:**
```css
--foot: var(--accent);
```

**Selection:**
```css
--select-bg: var(--accent);
--select-fg: var(--on-accent);
```

**Shadow:**
```css
--shadow-k: 2.4;
--op-meta: 0.64;
--op-faint: 0.52;
--grain-k: 1.4;
```

## Accent Variants

### Cyan
```css
[data-accent="cyan"] {
  --accent: #01ffff;
  --signal: #c2fe0b;  /* lime becomes signal */
}
```

### Red
```css
[data-accent="red"] {
  --accent: #ff0d1a;
  --accent-text: #ff4d55;
  --accent-mark: #ff4d55;
  --ok: #59b41d;
  --on-accent: #fff;
}
```

### Amber
```css
[data-accent="amber"] {
  --accent: #ffb000;
}
```

### Green
```css
[data-accent="green"] {
  --accent: #59b41d;
}
```

## Usage

- Neon accent highlights active nav, footer, focus rings
- Signal (cyan) used for streaming/real-time indicators
- Accent system can be swapped via `data-accent` attribute
- High-energy, technical aesthetic
- Stronger grain (1.4×) for texture

## Theme Meta

```html
<meta name="theme-color" content="#1c2338">
```

## Color Scheme

```css
color-scheme: dark;
```
