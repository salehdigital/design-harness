---
title: Motion
slug: motion
status: published
order: 1
description: "One curve, called think: quick off the mark, lingering through the middle, gentle to land."
chips:
  - Think ease
  - Resolve 510ms
  - Focus 360ms
  - Stream 14ms a word
created: 2026-11-09T14:21:21Z
updated: 2026-11-09T17:23:21Z
---


Motion on saleh.digital is quiet and short. One expressive curve (think) and one landing curve (land), and every duration derives from one energy value.

```css
:root {
  --fnd-energy: .5;
  --fnd-focus: .6;
  --motion-resolve: calc(.6s - .18s * var(--fnd-energy));  /* 510ms */
  --motion-stagger: 12ms;
  --ease-think: cubic-bezier(.1, .72, .9, .28);            /* quick off the mark, lingers in the middle */
  --ease-land:  cubic-bezier(.2, 0, 0, 1);                 /* gentle to land */
  --blur-rest: calc(4px * (.4 + var(--fnd-focus)));
  --op-rest:   calc(.85 - .766 * var(--fnd-focus));         /* 0.3904: resting menu items */
  --blur-peek: calc(var(--blur-rest) * .375);
  --op-peek:   calc((var(--op-rest) + 1) / 2);              /* hovered menu items */
}
```

## Where durations come from

| Interaction | Duration / curve |
| --- | --- |
| Link underline colour, hover washes, tabs | 140 to 160ms, `--ease-land` |
| Phone menu glyph lines | 240ms, `--ease-land` |
| Record details open | 360ms grid-rows, `--ease-land`; chevron 360ms `--ease-think` |
| Image reveal | opacity 280ms, blur 560ms, dot mask 520ms `cubic-bezier(.5, 0, .2, 1)` |
| Post actions leaving / arriving | 90ms out, 260 to 320ms back |
| Grain jitter | 12 jumps a second (see materials/texture.md) |
| Page change | text resolves over `--motion-resolve` with `--motion-stagger` between words (see resolve.md, streaming.md) |

## Reduced motion

Every transition has a `@media (prefers-reduced-motion: reduce)` override: transforms off, a 120 to 200ms linear opacity fade instead, the grain stops jumping, streaming is skipped. Build that branch for anything you add.

## For a static rebuild

Motion does not change layout. A static rebuild can skip it, but must keep the resting states it produces: resting menu items at `opacity: var(--op-rest)`, the active one at 1.
