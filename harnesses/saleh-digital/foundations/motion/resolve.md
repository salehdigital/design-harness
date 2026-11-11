---
title: Resolve
slug: resolve
status: published
description: Transition timing from thinking to rested state.
chips:
  - Motion
  - Timing
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

The duration and easing for transitions from active/thinking states to final rested states. Communicates "done."

## Token

```css
--motion-resolve: calc(.6s - .18s * var(--fnd-energy));
```

## Range

- Energy 0 (low): 600ms (slower, calmer)
- Energy 0.5 (default): 510ms
- Energy 1 (high): 420ms (faster, snappier)

## Easing

Use `--ease-land`: `cubic-bezier(.2, 0, 0, 1)`
Strong deceleration, feels like "landing" or "settling."

## Usage

Apply to state transitions:
```css
.is-thinking {
  opacity: 0.56;
}

.is-resolved {
  opacity: 1;
  transition: opacity var(--motion-resolve) var(--ease-land);
}
```

Examples:
- Spinner → content
- Shimmer → final text
- Loading → loaded
- Processing → complete

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-resolve: 0.1s;
  }
}
```

## Related

See `motion.md` for motion principles and `vocabulary/resolve.md` for conceptual definition.
