---
title: Library Template
slug: library
status: published
description: Library/bookshelf layout.
chips:
  - Template
  - Library
created: 2026-11-11T15:03:00Z
updated: 2026-11-11T15:03:00Z
---

Library template for `/library` route. Features coffee table (featured books) and bookshelf (full collection) grids.

## Layout Structure

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Library – Saleh Digital</title>
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/site.css">
</head>
<body>
  <div class="cols">
    <nav class="col-nav">
      <!-- Nav -->
    </nav>

    <div class="col-sub">
      <!-- Filters or search -->
    </div>

    <main class="col-main">
      <section class="coffee-table">
        <h2>On the Table</h2>
        <div class="table-grid">
          <article class="featured-book">
            <img src="/covers/book-1.jpg" alt="Book Title" class="cover">
            <div class="book-info">
              <h3>Book Title</h3>
              <p class="author">Author Name</p>
              <p class="excerpt">Brief description or excerpt...</p>
            </div>
          </article>
          <!-- More featured books -->
        </div>
      </section>

      <section class="bookshelf">
        <h2>Collection</h2>
        <div class="shelf-grid">
          <article class="book-card">
            <img src="/covers/book-10.jpg" alt="Book Title" class="cover">
            <h3 class="title">Book Title</h3>
            <p class="author">Author Name</p>
          </article>
          <!-- More books -->
        </div>
      </section>
    </main>

    <aside class="col-margin"></aside>
  </div>

  <footer class="site-footer">
    <!-- Footer -->
  </footer>
</body>
</html>
```

## Grids

**Coffee Table** (featured):
```css
.table-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: calc(var(--gap) * 1.6);
}
```

**Bookshelf** (full collection):
```css
.shelf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--gap);
}
```

## Click Behavior

Clicking a book navigates to `/library/book/:id` (in-place detail view, NOT a modal). See `memories/no-modals-for-books.md`.

## Related

See `patterns/coffee-table.md`, `patterns/bookshelf.md`, and `components/components/cover.md`.
