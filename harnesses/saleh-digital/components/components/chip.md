---
title: Chip
slug: chip
status: published
order: 4
chips:
  - Label
  - Value
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Small label-value pills for metadata display (color swatches, dimensions, counts).

## Anatomy

```html
<div class="rec-chip">
  <span class="rec-swatch" style="background: #c2fe0b;"></span>
  <span class="rec-val">#c2fe0b</span>
</div>
```

## Styling

```css
.rec-chip {
  height: 22px;
  font: 400 12px/16px var(--ui);
  letter-spacing: -0.2px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--ink);
  background: color-mix(in srgb, var(--ink) 4%, var(--paper));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ink) 7%, transparent);
  border-radius: 6px;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  display: inline-flex;
}
```

## Variants

**With swatch:**
```html
<div class="rec-chip">
  <span class="rec-swatch" style="background: #ff0d1a;"></span>
  <span class="rec-val">Red</span>
</div>
```

Swatch: 10×10px, border-radius 3px, inset border

**Value only:**
```html
<div class="rec-chip">
  <span class="rec-val">540px</span>
</div>
```

## States

- Rest: light background, subtle border
- No hover state (display-only)

## Usage

- Record/harness metadata (colors, dimensions)
- Settings specimen chips
- Inline metadata badges
- Always display-only, never interactive
