---
title: Cover
slug: cover
status: published
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Book cover image component for library items. Used in bookshelf, coffee table, and info modals.

## Anatomy

```html
<img src="cover.jpg" alt="Book title" />
```

## Styling

**In bookshelf/coffee table:**
```css
img {
  width: 100%;
  height: auto;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ink) 8%, transparent),
              0 10px 24px -14px color-mix(in srgb, var(--shadow) calc(40% * var(--shadow-k)), transparent);
  border-radius: 2px;
}
```

**In info modal:**
```css
.info-cover img {
  width: 100%;
  height: auto;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ink) 8%, transparent),
              0 12px 32px -12px color-mix(in srgb, var(--shadow) calc(35% * var(--shadow-k)), transparent);
  border-radius: 2px;
}
```

**In viewer:**
```css
.viewer-img {
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ink) 8%, transparent),
              0 24px 64px -24px color-mix(in srgb, var(--shadow) calc(25% * var(--shadow-k)), transparent);
  border-radius: 16px;
}
```

## Aspect Ratio

Typical: 3:4 (portrait books)

## States

- Rest: full color
- Loading: blur filter during image load
- WebGL mode: cover texture mapped to 3D object

## Usage

- Always include alt text with book title
- Use 1px–2px border radius (minimal to preserve paper texture)
- Shadow intensity scales with theme (shadow-k)
- Supports click-to-enlarge in viewer
