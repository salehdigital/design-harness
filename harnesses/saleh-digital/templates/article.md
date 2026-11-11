---
title: Article Template
slug: article
status: published
description: Article/post reading layout.
chips:
  - Template
  - Reading
created: 2026-11-11T15:03:00Z
updated: 2026-11-11T15:03:00Z
---

Article reading template for `/articles/:slug` routes. Optimized for long-form reading with spine metadata column.

## Layout Structure

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Article Title – Saleh Digital</title>
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/site.css">
</head>
<body>
  <div class="reading-grid">
    <nav class="col-nav">
      <!-- Same nav as home -->
    </nav>

    <aside class="spine">
      <span class="text">8 min · Nov 4, 2026 · Article</span>
    </aside>

    <main class="article-body">
      <h1>What is a design harness</h1>
      
      <p>Design harnesses are specifications written in Markdown that tell AI agents how to recreate a design system...</p>
      
      <h2>Structure</h2>
      <p>A harness is organized into foundations, components, and intelligence...</p>
      
      <figure>
        <img src="/images/harness-example.jpg" alt="Harness file structure">
        <figcaption>File structure of a design harness</figcaption>
      </figure>
      
      <!-- More content -->

      <div class="post-actions">
        <button class="meta-ico" aria-label="Discuss">
          <span class="ico" data-icon="discuss"></span>
          <span class="count">12</span>
        </button>
        <button class="meta-ico" aria-label="Copy link">
          <span class="ico" data-icon="copy"></span>
        </button>
        <button class="meta-ico" aria-label="Toggle sound">
          <span class="ico" data-icon="sound-on"></span>
        </button>
      </div>
    </main>

    <div class="col-margin">
      <!-- Empty or auxiliary content -->
    </div>
  </div>

  <footer class="site-footer">
    <!-- Footer -->
  </footer>
</body>
</html>
```

## Typography

```css
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

.article-body img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  margin: calc(var(--para) * 2) 0;
}
```

## Spine Column

Shows rotated metadata (reading time, date, type). Hidden on mobile.

## Related

See `components/screens/reading.md`, `components/patterns/post-actions.md`, and `components/components/spine.md`.
