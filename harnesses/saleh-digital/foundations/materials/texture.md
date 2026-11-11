---
title: Texture
slug: texture
status: published
description: Grain, ink, and paper texture effects.
chips:
  - Foundation
  - Materials
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Texture effects applied via SVG filters and overlays to create paper-like tactility and depth.

## Grain Overlay

Noise texture overlaid on entire page:
```css
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,..."); /* noise pattern */
  opacity: calc(0.02 + 0.03 * var(--fnd-texture));
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: overlay;
}
```

Opacity scales with `--fnd-texture` slider (0.02–0.05 range).

## Ink Filters

SVG filters for text/UI texture (see `materials.md` for full filter code):

- `#ink-ui`: Minimal texture for UI text
- `#ink-body`: Moderate texture for body text
- `#ink-bio`: Strong texture for footer bio
- `#ink-diagram`: Sharp edges for technical diagrams

Applied via CSS:
```css
.ui-text { filter: url(#ink-ui); }
.body-text { filter: url(#ink-body); }
```

## Texture Slider

Foundation slider `--fnd-texture` (0–1) controls texture intensity:
- 0: Minimal (crisp digital)
- 0.4: Default (subtle paper feel)
- 1: Maximum (strong tactile presence)

## Theme Variations

Marathon themes reduce texture for maximum clarity:
```css
[data-theme^="marathon"] {
  --fnd-texture: 0.1; /* force low */
}
```

## Related

See `materials.md` for full SVG filter definitions.
