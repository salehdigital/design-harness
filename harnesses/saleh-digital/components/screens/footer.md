---
title: Footer
slug: footer
status: published
description: Site-wide footer.
chips:
  - Screen
  - Layout
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Site-wide footer with bio, dot matrix canvases, basmala, and wordmark. Appears at bottom of all pages.

## Anatomy

See `patterns/footer.md` for full anatomy and styling.

## Grid Layout

```css
.foot-grid {
  display: grid;
  grid-template-columns: var(--col-nav) var(--col-sub) minmax(0, 540px) minmax(0, 1fr);
  column-gap: var(--gap);
  padding: calc(var(--para) * 3) 0;
  border-top: 1px solid color-mix(in srgb, var(--dot) 16%, transparent);
}
```

## Rows

**.foot-row** (first row):
- Col 1 (nav): empty
- Col 2 (sub): `.bio` text
- Col 3 (content): `.foot-dots` canvas
- Col 4 (margin): `.basmala` + `.marks`

**.foot-wordmark** (second row, full width):
- Spans all 4 columns
- Dot matrix canvas with "salehdigital" text
- SDF-rendered

## Responsive

Mobile (<900px):
```css
.foot-grid {
  display: flex;
  flex-direction: column;
  gap: calc(var(--para) * 2);
  padding: var(--para);
}

.foot-row {
  flex-direction: column;
  gap: var(--para);
}

.foot-wordmark {
  width: 100%;
}
```

## Usage

- Consistent across all pages
- SDF dot matrix aesthetic
- Arabic calligraphy (basmala)
- Bio in owner's voice
- Wordmark as final signature
