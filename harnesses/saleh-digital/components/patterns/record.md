---
title: Record
slug: record
status: published
description: Harness record card.
chips:
  - Catalogue
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Design harness record card for the Catalogue view. Displays each record (foundation, component, pattern, intelligence file) with title, description, status chips, and metadata.

## Anatomy

```html
<article class="record-card" data-slug="chip">
  <header class="record-header">
    <h3 class="record-title">Chip</h3>
    <div class="chips">
      <span class="chip" data-status="published">Published</span>
      <span class="chip">Interactive</span>
    </div>
  </header>
  <p class="record-description">Rounded label for categories, tags, or states.</p>
  <footer class="record-meta">
    <span class="path">components/components/chip.md</span>
  </footer>
</article>
```

## Styling

Card:
```css
.record-card {
  padding: var(--para);
  border: 1px solid color-mix(in srgb, var(--dot) 12%, transparent);
  border-radius: 8px;
  background: var(--paper);
  cursor: pointer;
  transition: border-color 0.16s var(--ease-land), box-shadow 0.16s var(--ease-land);
}

.record-card:hover {
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--shadow) 8%, transparent);
}
```

Title:
```css
.record-title {
  font-size: 18px;
  line-height: 22px;
  font-weight: 600;
  letter-spacing: -0.72px;
  margin-bottom: 4px;
}
```

Description:
```css
.record-description {
  font-size: 14px;
  line-height: 20px;
  opacity: var(--op-peek);
  margin-top: var(--stack);
}
```

Meta:
```css
.record-meta {
  margin-top: var(--para);
  font-size: 12px;
  line-height: 16px;
  opacity: var(--op-meta);
  font-family: var(--mono);
}
```

## Status Chips

Status chips indicate record state (published, draft, deprecated).

See `chip.md` for styling.

## Grid

Records displayed in auto-fill grid:
```css
.catalogue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--gap);
}
```

## Usage

- Click card to open record detail
- Chips show status and tags
- Path shows file location
- Hover lifts card visually
