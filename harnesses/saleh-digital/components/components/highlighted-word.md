---
title: Highlighted Word
slug: highlighted-word
status: published
description: Inline marked text.
chips:
  - Emphasis
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Inline highlighted word or phrase with subtle background wash. Used in body text for emphasis (non-interactive, distinct from glow).

## Anatomy

```html
<mark>important term</mark>
```

## Styling

```css
mark {
  background: color-mix(in srgb, var(--accent) 6%, transparent);
  color: inherit;
  padding: 0.5px 1px;
  border-radius: 1px;
}
```

Light theme:
```css
[data-theme="light"] mark {
  background: color-mix(in srgb, var(--accent) 5%, transparent);
}
```

Dark theme:
```css
[data-theme="dark"] mark {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
}
```

Marathon theme:
```css
[data-theme^="marathon"] mark {
  background: color-mix(in srgb, var(--accent) 9%, transparent);
}
```

## Difference from Glow

- **Highlight (`<mark>`)**: static, non-interactive, subtle wash background
- **Glow (`.warm`)**: interactive hover, warm gold text-shadow, no background

Use `<mark>` for definitional terms or passive emphasis; `.warm` for interactive/clickable phrases.

## Usage

- Semantic HTML `<mark>` tag
- Very subtle alpha (5–9% accent)
- No bold or font change
- No user interaction
- Used in articles and glossary definitions
