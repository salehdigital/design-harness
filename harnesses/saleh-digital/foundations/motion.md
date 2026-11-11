---
title: Motion
slug: motion
status: published
group: Foundations
order: 7
discuss: 0
created: 2026-11-09T19:23:22Z
updated: 2026-11-09T19:23:22Z
---

The motion system uses two foundation-responsive timing tokens and two easing curves. Motion scales with `--fnd-energy` (default `0.5`).

## Timing Tokens

### Resolve (page transitions, major state changes)
```css
--motion-resolve: calc(0.6s - 0.18s * var(--fnd-energy));
```
Default: `0.51s` at energy `0.5`

Used for view transitions, navigation, major layout shifts.

### Stagger (sequential reveals)
```css
--motion-stagger: 12ms;
```
Fixed delay between items in a staggered sequence.

## Easing Curves

### Ease Land (standard ease-out)
```css
--ease-land: cubic-bezier(0.2, 0, 0, 1);
```
Default easing for most transitions (hover, opacity, color, transform).

### Ease Think (anticipation / overshoot)
```css
--ease-think: cubic-bezier(0.1, 0.72, 0.9, 0.28);
```
Used for expandable UI (accordion, dropdown) that "thinks" before opening.

## Common Durations

**Instant (< 100ms):**
- Button active state: `0.12s`
- Copy feedback: `90ms` (away state)

**Quick (100–300ms):**
- Hover states: `0.16s` to `0.26s`
- Color transitions: `0.16s`
- Opacity: `0.2s` to `0.28s`
- Transform (scale, translate): `0.16s` to `0.22s`

**Medium (300–600ms):**
- Blur effects: `0.32s` to `0.56s`
- Filter transitions: `0.36s` to `0.52s`
- Accordion expand: `0.36s` (ease-think), `0.52s` (ease-land)

**Long (> 600ms):**
- View transitions: `var(--motion-resolve)` (~0.51s)
- Image reveal: `0.42s` to `0.56s`
- Mask animation: `0.52s cubic-bezier(0.5, 0, 0.2, 1)`

## Staggered Sequences

Items animate in sequence with `--motion-stagger` (12ms) delay:

**Example (footer dots):**
```css
.viewer-btn .dm circle {
  animation-delay: calc(var(--o) * -260ms - var(--r) * 0.4s);
}
```

**Example (quick switch dots):**
```css
.qs[aria-checked="true"] .qs-dots i:nth-child(2) {
  transition-delay: 50ms;
}
.qs[aria-checked="true"] .qs-dots i:nth-child(3) {
  transition-delay: 0.1s;
}
```

## View Transitions

Page-level transitions use the native View Transition API:

```css
::view-transition-old(root) {
  animation: vt-out var(--vt-ms) var(--ease-land) both;
}
::view-transition-new(root) {
  animation: vt-in var(--vt-ms) var(--ease-land) both;
}

@keyframes vt-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes vt-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

Where:
```css
--vt-ms: calc(0.26s - 80ms * var(--fnd-energy)); /* ~0.22s at energy 0.5 */
```

## Hover & Focus

**Standard hover transition:**
```css
transition: opacity 0.16s var(--ease-land),
            transform 0.16s var(--ease-land);
```

**Button press:**
```css
:active {
  transform: scale(0.97);
  transition: transform 0.12s var(--ease-land);
}
```

**Dot hover:**
```css
.dot {
  transition: background-color 0.16s var(--ease-land),
              transform 0.16s var(--ease-land);
}
.dot:active {
  transform: scale(0.84);
}
```

## Blur Transitions

Blur-in/out for away states:

```css
.post-meta {
  transition: opacity 0.26s var(--ease-land),
              transform 0.32s var(--ease-land),
              filter 0.26s var(--ease-land);
}
.post-meta.is-away {
  opacity: 0;
  filter: url(#ink-ui) blur(3px);
  transform: translateY(4px);
  transition-duration: 90ms;
}
```

## Mask Reveal

Images reveal with a dot-matrix mask:

```css
.media-img {
  mask: radial-gradient(
    circle,
    #000 var(--mask-dot),
    transparent calc(var(--mask-dot) + 0.8px)
  ) 0 0 / 5px 5px;
  transition: opacity 0.28s var(--ease-land),
              filter 0.56s var(--ease-land),
              --mask-dot 0.52s cubic-bezier(0.5, 0, 0.2, 1);
}
.media-img.is-in {
  --mask-dot: 4px; /* expands dots to fill */
}
```

## Breathing Animation

Dot-matrix buttons breathe (scale loop):

```css
@keyframes dm-breathe {
  0%, 100% { scale: 1; }
  50% { scale: calc(1 + 0.22 * var(--k) + 0.9 * var(--h) * (1 - var(--k)) + 0.35 * (1 - var(--h))); }
}

.viewer-btn .dm circle {
  animation: dm-breathe calc(2.8s + var(--r) * 0.8s) ease-in-out infinite;
}
```

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable animations */
  .media-img,
  .media-slot.is-leaving .media-fig,
  .rec-notes,
  .rec-more .v,
  .viewer-btn .dm circle {
    transition: opacity 0.12s linear;
    animation: none;
    transform: none;
    filter: none;
  }
  
  /* Simplify view transitions */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.12s;
    animation-timing-function: linear;
  }
}
```

## Usage

- **Hover/focus/color:** `0.16s var(--ease-land)`
- **Active press:** `0.12s var(--ease-land), scale(0.97)`
- **Opacity fade:** `0.2s–0.28s var(--ease-land)`
- **Blur effects:** `0.32s–0.56s var(--ease-land)`
- **Page transitions:** `var(--motion-resolve) var(--ease-land)`
- **Expandable UI:** `0.36s var(--ease-think)` (open), `0.52s var(--ease-land)` (close)
- **Stagger items:** `animation-delay: calc(var(--o) * var(--motion-stagger))`
- Always provide `prefers-reduced-motion: reduce` fallback

