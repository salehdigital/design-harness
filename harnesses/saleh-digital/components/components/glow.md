---
title: Glow
slug: glow
status: published
order: 5
description: Warm highlight on emphasized words.
chips:
  - Hover
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Warm glow effect applied to emphasized words/phrases in body text. Interactive hover state.

## Anatomy

```html
<span class="warm">highlighted phrase</span>
```

## Styling

**Rest:**
```css
.warm {
  cursor: pointer;
  text-shadow: 0 0 0.6px color-mix(in srgb, var(--warm) 55%, transparent),
               0 0 5px color-mix(in srgb, var(--warm-halo) 14%, transparent);
  border-radius: 2px;
  outline: none;
}
```

**Lit (active/hover):**
```css
.warm.is-lit {
  -webkit-text-stroke: 0.42px currentColor;
  text-shadow: 0 0 0.6px color-mix(in srgb, var(--warm) 70%, transparent),
               0 0 7px color-mix(in srgb, var(--warm-halo) 26%, transparent);
}
```

**Focus:**
```css
.warm:focus-visible {
  -webkit-text-stroke: 0.42px currentColor;
  box-shadow: 0 1px 0 color-mix(in srgb, var(--warm) 80%, var(--ink));
}
```

## Colors

- `--warm`: `#d69600` (light), `#ffb81a` (dark)
- `--warm-halo`: `#ffc400` (both themes)

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .warm {
    text-shadow: 0 0 0.6px color-mix(in srgb, var(--warm) 55%, transparent);
  }
}
```

## Usage

- Emphasize key terms or phrases
- Inline in body text only (not headings)
- Clickable/interactive (can trigger actions)
- Subtle at rest, more pronounced on hover
- Gold/amber glow suggests warmth, importance
