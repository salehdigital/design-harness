---
title: Spine
slug: spine
status: published
description: Vertical divider with metadata.
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Vertical metadata divider in reading/article view. Displays reading info (time, date, type) rotated 90°.

## Anatomy

```html
<aside class="spine">
  <span class="text">8 min · Nov 4, 2026 · Article</span>
</aside>
```

## Styling

```css
.spine {
  writing-mode: vertical-rl;
  white-space: nowrap;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.08em;
  opacity: var(--op-meta);
  filter: url(#ink-ui);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.spine .text {
  transform: rotate(180deg);
}
```

## Content Format

`{minutes} min · {date} · {type}`

- Minutes: reading time
- Date: formatted as "Mon DD, YYYY"
- Type: Article, Experiment, Post, etc.

## Desktop Layout

```css
.reading-grid {
  grid-template-columns: var(--col-nav) var(--col-sub) minmax(0, 540px) minmax(0, 1fr);
}

.spine {
  grid-column: 2;
}
```

## Mobile

Hidden on narrow screens (<900px).

## Usage

- Shows contextual metadata for long-form content
- Rotated vertical text saves horizontal space
- Metadata opacity (op-meta ~ 0.56)
- Ink-ui filter for texture
