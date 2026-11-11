---
title: Layout Grid
slug: layout-grid
status: published
description: Four-column grid system for desktop layout.
chips:
  - Foundation
  - Layout
created: 2026-11-11T15:03:00Z
updated: 2026-11-11T15:03:00Z
---

The core 4-column grid layout system used across all pages on Saleh Digital.

## Grid Structure

```css
.cols {
  display: grid;
  grid-template-columns: var(--col-nav, 89px) var(--col-sub, 248px) minmax(0, 540px) minmax(0, 1fr);
  column-gap: var(--gap);
  min-height: 100vh;
}
```

## Columns

**Column 1: Navigation** (`--col-nav: 89px`)
- Primary site navigation
- Fixed narrow width
- Vertical list of links

**Column 2: Sub / Spine** (`--col-sub: 248px`)
- Secondary navigation or context
- Article spine (rotated metadata)
- Filters or search

**Column 3: Main Content** (`minmax(0, 540px)`)
- Primary content area
- Articles, posts, library grids
- Optimal reading width: 540px max

**Column 4: Margin** (`minmax(0, 1fr)`)
- Breathing room
- Auxiliary content (rare)
- Expands to fill remaining space

## Gap

```css
--gap: calc(24px + (.3 - var(--fnd-density)) * 20px);
```

Scales with `--fnd-density` slider:
- Low density (0): 44px gap
- Default (0.3): 24px gap
- High density (1): 10px gap

## Responsive Collapse

Mobile (<900px):
```css
@media (max-width: 899px) {
  .cols {
    display: flex;
    flex-direction: column;
    padding: 0 var(--para);
  }

  .col-nav {
    display: none; /* Moved to bottom sheet modal */
  }

  .spine {
    display: none; /* Hidden on narrow screens */
  }

  .col-main {
    width: 100%;
    max-width: 540px;
    margin: 0 auto;
  }
}
```

## Navigation Modal

On mobile, navigation moves to a bottom sheet `<dialog>`:
```html
<dialog class="nav-sheet">
  <nav>
    <ul class="nav-list">
      <!-- Same nav items -->
    </ul>
  </nav>
</dialog>
```

Triggered by hamburger button (top-left corner).

## Usage

Apply `.cols` to the main page container on every page. Content flows into the 4 columns based on semantic role.

## Related

See `templates/*.md` for page-specific implementations and `spacing.md` for gap calculations.
