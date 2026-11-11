---
title: Home Template
slug: home
status: published
description: Homepage layout and structure.
chips:
  - Template
  - Layout
created: 2026-11-11T15:03:00Z
updated: 2026-11-11T15:03:00Z
---

Homepage template for saleh.digital. Features 4-column grid with navigation, featured content, and footer.

## Layout Structure

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saleh Digital</title>
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/site.css">
</head>
<body>
  <div class="cols">
    <nav class="col-nav">
      <ul class="nav-list">
        <li><a href="/" class="item is-active">Home</a></li>
        <li><a href="/articles" class="item">Articles</a></li>
        <li><a href="/library" class="item">Library</a></li>
        <li><a href="/experiments" class="item">Experiments</a></li>
        <li><a href="/settings" class="item">Settings</a></li>
      </ul>
    </nav>

    <div class="col-sub">
      <!-- Sub-navigation or context -->
    </div>

    <main class="col-main">
      <header class="home-header">
        <h1>Ahmed Saleh أحمد صالح</h1>
        <p class="tagline">Designer-founder in pursuit of the infinite.</p>
      </header>

      <section class="featured-articles">
        <h2>Recent Articles</h2>
        <article class="article-card">
          <h3><a href="/articles/what-is-a-design-harness">What is a design harness</a></h3>
          <p class="meta">8 min · Nov 4, 2026</p>
          <p class="excerpt">Design harnesses are specifications that help AI agents...</p>
        </article>
        <!-- More article cards -->
      </section>

      <section class="featured-experiments">
        <h2>Experiments</h2>
        <!-- Experiment cards -->
      </section>
    </main>

    <aside class="col-margin">
      <!-- Auxiliary content -->
    </aside>
  </div>

  <footer class="site-footer">
    <!-- Footer from patterns/footer.md -->
  </footer>
</body>
</html>
```

## Grid Layout

```css
.cols {
  display: grid;
  grid-template-columns: var(--col-nav, 89px) var(--col-sub, 248px) minmax(0, 540px) minmax(0, 1fr);
  column-gap: var(--gap);
  min-height: 100vh;
}
```

## Content Sections

**Header**: Name in English and Arabic, tagline.

**Featured Articles**: 3–5 recent articles with title, meta, and excerpt.

**Experiments**: Grid of project cards with images.

## Responsive

Mobile (<900px):
- Collapse to flex column
- Show nav in bottom sheet modal
- Full-width main content

## Related

See `foundations/layout-grid.md`, `patterns/footer.md`, and `components/screens/footer.md`.
