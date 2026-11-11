---
title: Hidden Extras
slug: hidden-extras
status: published
description: Subtle motion details and easter eggs.
chips:
  - Motion
  - Details
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Subtle motion details and hidden interactions that reward close attention. Optional refinements controlled by `--fnd-sparkle` slider or hidden-extras setting.

## Examples

**Basmala ink hover**: Footer Arabic calligraphy subtly warps on hover via ink filter intensification.

**Wordmark dot wave**: Dots in footer wordmark ripple outward from cursor on hover.

**Nav item micro-bounce**: Active nav item has barely perceptible spring bounce on activation.

**Chip shimmer**: Chips occasionally shimmer when idle (very rare, ~1% chance per minute).

**Glow pulse**: `.warm` glow pulses gently when hovered for >2 seconds.

## Implementation

These are controlled by:
1. `--fnd-sparkle` slider (0 = off, 1 = maximum)
2. `hidden-extras` feature flag in settings

When disabled, all extras are skipped for performance or user preference.

## Detection

```js
const sparkleEnabled = getComputedStyle(document.documentElement)
  .getPropertyValue('--fnd-sparkle').trim() > 0;

if (sparkleEnabled) {
  applyHiddenExtra();
}
```

## Performance

Hidden extras use requestAnimationFrame and throttling to avoid jank. Disable automatically on low-end devices.

## Reduced Motion

All hidden extras are disabled when `prefers-reduced-motion: reduce`.

## Related

See `motion.md` for motion principles and `vocabulary/felt.md` for interaction tactility.
