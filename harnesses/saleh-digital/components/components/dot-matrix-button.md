---
title: Dot Matrix Button
slug: dot-matrix-button
status: published
description: SDF dot-rendered button.
chips:
  - SDF
  - Canvas
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Footer button rendered as a signed-distance field (SDF) dot matrix. Used for wordmark and footer link buttons.

## Anatomy

```html
<button class="dot-btn" id="wordmark-btn">
  <canvas class="dot-canvas" width="480" height="64"></canvas>
  <span class="label">salehdigital</span>
</button>
```

## Canvas Rendering

Rendered at 2× device pixel ratio with SDF dot shader:

```js
// Pseudo-code for dot matrix rendering
function renderDotMatrix(ctx, text, dotSize, dotGap) {
  const glyphs = textToGlyphData(text);
  for (let y = 0; y < height; y += dotGap) {
    for (let x = 0; x < width; x += dotGap) {
      const sdf = sampleSDF(glyphs, x, y);
      if (sdf > threshold) {
        const opacity = smoothstep(sdf);
        ctx.fillStyle = `rgba(var(--dot-rgb), ${opacity})`;
        ctx.fillRect(x, y, dotSize, dotSize);
      }
    }
  }
}
```

## Parameters

- Dot size: 2px
- Dot gap: 4px
- Threshold: 0.5
- Smoothing: 0.1

## States

**Rest:**
```css
.dot-btn .dot-canvas {
  opacity: var(--op-rest);
  transition: opacity 0.2s var(--ease-land);
}
```

**Hover:**
```css
.dot-btn:hover .dot-canvas {
  opacity: 1;
}
```

## Colors

Dot fill: `--dot` (theme-aware)

## Label

Hidden but present for accessibility:
```css
.dot-btn .label {
  position: absolute;
  clip: rect(0,0,0,0);
  pointer-events: none;
}
```

## Usage

- Footer wordmark and navigation
- 2× canvas for crisp rendering on retina
- SDF-based glyph rendering for smooth scaling
- Dot matrix aesthetic (retro display feel)
- Label text required for screen readers
