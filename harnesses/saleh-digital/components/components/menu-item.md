---
title: Menu Item
slug: menu-item
status: published
order: 7
description: Navigation list item.
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Navigation list item. Used in primary nav, sub-nav, and mobile sheet.

## Anatomy

```html
<li><a class="item is-active" href="#/articles">Articles</a></li>
```

## Styling

```css
.item {
  white-space: nowrap;
  opacity: var(--op-rest);
  filter: url(#ink-ui);
  outline: none;
  display: inline-block;
  transition: opacity 0.16s var(--ease-land);
}
```

## States

**Rest:**
```css
opacity: var(--op-rest); /* ~0.39 */
```

**Hover/Peek:**
```css
.item.is-peek,
.item:hover {
  opacity: var(--op-peek); /* ~0.70 */
}
```

**Active:**
```css
.item.is-active {
  opacity: 1;
}

.col-nav .item.is-active {
  color: var(--accent-text);
}
```

**Marathon Light active:**
```css
[data-theme="marathon-light"] .item.is-active {
  background: linear-gradient(transparent 12%, var(--accent-wash) 12%, var(--accent-wash) 92%, transparent 92%);
  box-shadow: -3px 0 0 var(--accent-wash), 3px 0 0 var(--accent-wash);
}
```

**Focus:**
```css
.item:focus-visible {
  opacity: 1;
  text-underline-offset: 3px;
  text-decoration: underline 1px;
}
```

## Sizing

- Font: 16px UI
- Tracking: -0.64px
- Line height: 20px
- Gap between items: 4px (--stack)

## Usage

- Always use semantic `<a>` tags
- Include descriptive text (no icons-only nav)
- Opacity transitions for smooth hover
- Active state uses accent color or wash
