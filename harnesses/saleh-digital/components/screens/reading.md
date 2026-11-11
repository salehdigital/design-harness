---
title: Reading
slug: reading
status: published
description: Article/post reading view.
chips:
  - Screen
  - Layout
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Full article/post reading screen. Used for `/articles/:slug` routes.

## Layout Grid

```css
.reading-grid {
  display: grid;
  grid-template-columns: var(--col-nav) var(--col-sub) minmax(0, 540px) minmax(0, 1fr);
  column-gap: var(--gap);
  min-height: 100vh;
}
```

Columns:
1. Nav (89px): primary navigation
2. Spine/Sub (248px): metadata spine, vertical text
3. Content (max 540px): article body
4. Margin (1fr): breathing room

## Content Column

Article body:
```css
.article-body {
  max-width: 540px;
  padding: calc(var(--para) * 2) 0;
}

.article-body h1 {
  font-size: 32px;
  line-height: 40px;
  font-weight: 600;
  letter-spacing: -1.28px;
  margin-bottom: var(--para);
}

.article-body p {
  font-size: 17px;
  line-height: 28px;
  letter-spacing: -0.34px;
  margin-bottom: var(--para);
  filter: url(#ink-body);
}
```

## Spine Column

Shows reading metadata rotated vertically:
```html
<aside class="spine">
  <span class="text">8 min · Nov 4, 2026 · Article</span>
</aside>
```

## Responsive

Mobile (<900px):
```css
.reading-grid {
  display: flex;
  flex-direction: column;
  padding: 0 var(--para);
}

.spine {
  display: none; /* hide on narrow screens */
}

.article-body {
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
}
```

## Scrolling

Smooth scroll, snap to sections (optional).

## Footer

Post actions row at end of article (see `post-actions.md`).

## Usage

- Clean single-column reading
- Minimal distractions
- Optimal line length (540px)
- Metadata in margin (spine)
- Ink filter on body text for texture
