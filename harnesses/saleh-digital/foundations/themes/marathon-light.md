---
title: Marathon Light
slug: marathon-light
status: published
chips:
  - Neon
  - Lime
created: 2026-11-09T19:23:22Z
updated: 2026-11-09T19:23:22Z
---

High-contrast light theme with neon accent system. Default accent: lime green.

## Colors

**Surface:**
```css
--paper: #f1f3f7;  /* cool light grey */
--ink: #29324f;    /* dark blue-grey */
--dot: #d5dae4;
```

**Accent (Lime, default):**
```css
--accent: #c2fe0b;
--accent-text: var(--ink);
--accent-mark: #587c00;  /* darker for contrast */
--accent-wash: #c2fe0b;
--on-accent: var(--ink);
```

**Signal:**
```css
--signal: #ff0d1a;  /* red */
--swell: var(--signal);
```

**Feedback:**
```css
--ok: #38801a;
--glow: var(--accent);
--ring: var(--accent-mark);
```

**Footer:**
```css
--foot: var(--accent-mark);
```

**Selection:**
```css
--select-bg: var(--accent-wash);
--select-fg: var(--ink);
```

**Shadow:**
```css
--shade: #c3c9d6;
--shadow: #29324f;
--shadow-k: 1.2;
```

**Opacity:**
```css
--op-meta: 0.78;
--op-faint: 0.72;
--grain-k: 1.1;
```

## Accent Variants

### Cyan
```css
[data-accent="cyan"] {
  --accent: #01ffff;
  --accent-mark: #007f88;
  --warm: #00b3bf;
}
```

### Red
```css
[data-accent="red"] {
  --accent: #ff0d1a;
  --accent-wash: #f88088;
  --accent-mark: #e00012;
  --signal: #fd6c1d;
  --warm: #ff0d1a;
}
```

### Amber
```css
[data-accent="amber"] {
  --accent: #ffb000;
  --accent-wash: #ffd47a;
  --accent-mark: #9a6200;
  --warm: #e09a00;
}
```

### Green
```css
[data-accent="green"] {
  --accent: #59b41d;
  --accent-wash: #96cd74;
  --accent-mark: #38801a;
  --warm: #59b41d;
}
```

## Usage

- Cool-toned light background with dark blue-grey text
- Neon accent appears as wash behind active nav (12%–92% gradient)
- Accent mark (darker) used for footer, focus rings
- Signal (red) for streaming/alerts
- Box shadow on active nav: `-3px 0 0 var(--accent-wash), 3px 0 0 var(--accent-wash)`

## Theme Meta

```html
<meta name="theme-color" content="#f1f3f7">
```

## Color Scheme

```css
color-scheme: light;
```
