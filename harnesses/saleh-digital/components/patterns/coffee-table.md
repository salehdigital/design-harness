---
title: Coffee Table
slug: coffee-table
status: published
description: Featured books grid.
chips:
  - Library
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Featured books display in Library view. Larger, more prominent grid for highlighting selected books.

## Anatomy

```html
<section class="coffee-table">
  <h2 class="section-title">On the Table</h2>
  <div class="table-grid">
    <article class="featured-book" data-book-id="5678">
      <img src="cover.jpg" alt="Book Title" class="cover" />
      <div class="book-info">
        <h3 class="title">Book Title</h3>
        <p class="author">Author Name</p>
        <p class="excerpt">Brief excerpt or description...</p>
      </div>
    </article>
    <!-- more featured books -->
  </div>
</section>
```

## Grid Layout

Desktop (≥900px):
```css
.table-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: calc(var(--gap) * 1.6); /* larger gap than bookshelf */
  padding: var(--para);
}
```

Mobile (<900px):
```css
.table-grid {
  grid-template-columns: 1fr;
  gap: var(--gap);
}
```

## Featured Book Card

```css
.featured-book {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: var(--para);
  cursor: pointer;
  transition: transform 0.2s var(--ease-land);
}

.featured-book:hover {
  transform: scale(1.02);
}

.featured-book .cover {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ink) 10%, transparent),
              0 12px 32px -12px color-mix(in srgb, var(--shadow) 35%, transparent);
}
```

## Typography

Title:
```css
.featured-book .title {
  font-size: 18px;
  line-height: 22px;
  font-weight: 600;
  letter-spacing: -0.72px;
  margin-bottom: 4px;
}
```

Author:
```css
.featured-book .author {
  font-size: 14px;
  line-height: 18px;
  opacity: var(--op-meta);
  margin-bottom: var(--stack);
}
```

Excerpt:
```css
.featured-book .excerpt {
  font-size: 14px;
  line-height: 20px;
  opacity: var(--op-peek);
  max-width: 36ch;
}
```

## Difference from Bookshelf

- **Coffee Table**: larger covers (160px vs 140px), includes excerpt text, two-column card layout, more spacing
- **Bookshelf**: compact grid, cover + title + author only, denser

## Usage

- Highlight currently reading or featured books
- Richer metadata (excerpt/description)
- Larger covers for visual prominence
- Click-to-open for full details
