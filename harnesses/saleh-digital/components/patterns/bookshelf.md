---
title: Bookshelf
slug: bookshelf
status: published
description: Grid of book covers.
chips:
  - Library
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Grid of book covers in the Library view. Displays collection of books with covers in a responsive masonry-style grid.

## Anatomy

```html
<section class="bookshelf">
  <div class="shelf-grid">
    <article class="book-card" data-book-id="1234">
      <img src="cover.jpg" alt="Book Title" class="cover" />
      <h3 class="title">Book Title</h3>
      <p class="author">Author Name</p>
    </article>
    <!-- more book cards -->
  </div>
</section>
```

## Grid Layout

Desktop (≥900px):
```css
.shelf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--gap); /* ~24–44px depending on density */
  padding: var(--para);
}
```

Mobile (<900px):
```css
.shelf-grid {
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: calc(var(--gap) * 0.6);
}
```

## Book Card

```css
.book-card {
  display: flex;
  flex-direction: column;
  gap: var(--stack); /* 4px */
  cursor: pointer;
  transition: transform 0.16s var(--ease-land);
}

.book-card:hover {
  transform: translateY(-2px);
}

.book-card .cover {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ink) 8%, transparent),
              0 10px 24px -14px color-mix(in srgb, var(--shadow) 40%, transparent);
}
```

## Typography

Title:
```css
.book-card .title {
  font-size: 13px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: -0.52px;
  opacity: 0.9;
}
```

Author:
```css
.book-card .author {
  font-size: 12px;
  line-height: 14px;
  opacity: var(--op-meta); /* 0.56 */
}
```

## Interaction

- Click: open book info modal
- Hover: subtle lift (translateY -2px)
- Focus: ring outline on card

## Usage

- Cover images at 3:4 aspect ratio
- Auto-fill grid adapts to container width
- Gap scales with density slider
- Minimal metadata (title + author)
- Click-to-open for full details
