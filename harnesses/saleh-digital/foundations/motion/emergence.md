---
title: Emergence
slug: emergence
status: published
description: Page-load staggered animation.
chips:
  - Motion
  - Animation
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Staggered reveal animation for elements appearing on page load. Each element fades in with slight upward motion.

## Animation

```css
@keyframes emerge {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.emerge {
  animation: emerge var(--motion-resolve) var(--ease-land);
  animation-delay: calc(var(--emerge-index, 0) * var(--motion-stagger));
}
```

## Stagger

Siblings increment `--emerge-index`:
```css
.item:nth-child(1) { --emerge-index: 0; }
.item:nth-child(2) { --emerge-index: 1; }
.item:nth-child(3) { --emerge-index: 2; }
```

Delay per item: `--motion-stagger` (12ms)

## Parameters

- Distance: 8px translateY
- Duration: `--motion-resolve` (~420–600ms)
- Easing: `--ease-land`
- Stagger: 12ms

## Usage

Apply on initial render only:
```js
if (isInitialLoad) {
  elements.forEach((el, i) => {
    el.style.setProperty('--emerge-index', i);
    el.classList.add('emerge');
  });
}
```

Do not re-apply on subsequent navigations (use View Transitions instead).

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .emerge {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

## Related

See `vocabulary/emergence.md` and `motion/hidden-extras.md`.
