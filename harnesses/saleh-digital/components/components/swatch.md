---
title: Swatch
slug: swatch
status: published
description: Color preview for theme/accent pickers.
chips:
  - Control
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Small color preview square for theme and accent selection in settings. Shows the accent color or a theme preview gradient.

## Anatomy

```html
<button class="swatch" data-accent="lime" aria-label="Lime accent">
  <span class="color" style="background: var(--lime);"></span>
</button>
```

## Styling

Button:
```css
.swatch {
  width: 32px;
  height: 32px;
  border: 1px solid color-mix(in srgb, var(--dot) 20%, transparent);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  transition: border-color 0.16s var(--ease-land);
}
```

Color fill:
```css
.swatch .color {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  display: block;
}
```

Active:
```css
.swatch.is-active {
  border-color: var(--accent);
  border-width: 2px;
  padding: 3px;
}
```

## Accent Swatches

Marathon accents:
- Lime: `#97ee2c`
- Cyan: `#33d8ff`
- Red: `#ff3350`
- Amber: `#ffbb14`
- Green: `#00cc88`

## Theme Swatches

For theme picker, show gradient preview:
```html
<button class="swatch" data-theme="dark">
  <span class="color" style="background: linear-gradient(135deg, #000 0%, #111 100%);"></span>
</button>
```

## Usage

- 32×32px clickable area
- Rounded corners (6px outer, 3px inner)
- Border thickens on active (2px vs 1px)
- Instant state change on click
- Always include aria-label
