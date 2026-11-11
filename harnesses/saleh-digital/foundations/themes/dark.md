---
title: Dark
slug: dark
status: published
created: 2026-11-09T19:23:22Z
updated: 2026-11-09T19:23:22Z
---

The dark theme. Near-black background with warm off-white text.

## Colors

**Surface:**
```css
--paper: #0b0b0c;  /* near-black */
--ink: #ece8e1;    /* warm off-white */
--dot: #2b2a28;
```

**Accent:**
```css
--accent: var(--ink);  /* accent = text color */
```

**Feedback:**
```css
--ok: #3ecf7e;  /* brighter green */
--glow: #ffc81a;
```

**Warm glow:**
```css
--warm: #ffb81a;
--warm-halo: #ffc400;
```

**Shadow:**
```css
--shade: #000000;
--shadow: #000000;
--shadow-k: 2.4;  /* stronger shadows */
```

**Opacity:**
```css
--op-meta: 0.60;
--op-faint: 0.50;
--grain-k: 1.5;  /* more visible grain */
```

**Blend mode:**
```css
--blend-ink: screen;
```

## Usage

- Very dark background (~11,11,12) with warm text
- Stronger shadows (2.4×) for depth
- More visible grain texture (1.5×)
- Accent = ink (no separate accent color)
- Screen blend mode for ink overlays

## Theme Meta

```html
<meta name="theme-color" content="#0b0b0c">
```

## Color Scheme

```css
color-scheme: dark;
```
