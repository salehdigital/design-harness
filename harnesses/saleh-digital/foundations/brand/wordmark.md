---
title: Wordmark
slug: wordmark
status: published
description: salehdigital logotype and dot matrix rendering.
chips:
  - Brand
  - SDF
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

The "salehdigital" wordmark rendered as SDF dot matrix in the footer. Single lowercase word, no spaces, no icon.

## Wordmark Text

`salehdigital` (all lowercase, no separators)

## Rendering

Signed-distance field (SDF) dot matrix rendering on `<canvas>`:
- Dot size: 2px
- Dot gap: 4px
- Threshold: 0.5
- Smoothing: 0.1
- Font: Kult Luxury (commercial, see `intelligence/packages/kult-luxury.md`) or fallback monospace

## Footer Placement

Full-width row at bottom of footer, spanning all 4 grid columns. Centered or left-aligned depending on viewport width.

## Styling

```css
.wordmark-canvas {
  width: 100%;
  max-width: 600px;
  height: 64px;
  opacity: var(--op-meta);
  transition: opacity 0.2s var(--ease-land);
}

.wordmark-canvas:hover {
  opacity: 1;
}
```

## Interaction

Hover increases opacity. Click navigates to home or triggers easter egg (optional).

## Fallback

If canvas/SDF fails, show plain text:
```html
<span class="wordmark-text">salehdigital</span>
```

## Related

See `vocabulary/glyph-matrix.md` for SDF rendering technique and `tools/wordmark-shader-bench.md` for optimization.
