---
title: Navigation
slug: navigation
status: published
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Two-column navigation: main sections (left) and sub-navigation (right).

## Structure

```html
<nav class="col col-nav" aria-label="Sections">
  <ul id="nav">
    <li><a class="item is-active" href="#/articles">Articles</a></li>
    <li><a class="item" href="#/library">Library</a></li>
    <!-- more items -->
  </ul>
</nav>

<nav class="col col-sub" aria-label="In this section">
  <ul id="sub">
    <div class="sub-group">Recent</div>
    <li><a class="item is-active" href="#/articles/...">Title</a></li>
    <!-- more items -->
  </ul>
</nav>
```

## Main Navigation (.col-nav)

- Left column, 89px width
- Vertical stack, 4px gap
- Items: 16px UI font, `-0.64px` tracking
- Opacity: `--op-rest` (rest), `--op-peek` (hover), `1` (active)
- Active state: `--accent-text` color
- Marathon Light: active items have accent-wash gradient background

## Sub-Navigation (.col-sub)

- Second column, 248px width
- Grouped by category
- Group headers: `opacity: var(--op-meta)`, cursor default
- Items inherit main nav styles
- Text wraps (normal, not nowrap)

## States

**Rest:**
```css
.item {
  opacity: var(--op-rest);
  filter: url(#ink-ui);
}
```

**Hover (.is-peek):**
```css
.item.is-peek {
  opacity: var(--op-peek);
}
```

**Active (.is-active):**
```css
.item.is-active {
  opacity: 1;
  color: var(--accent-text); /* in .col-nav */
}
```

**Marathon Light active:**
```css
[data-theme="marathon-light"] .item.is-active {
  background: linear-gradient(transparent 12%, var(--accent-wash) 12%, var(--accent-wash) 92%, transparent 92%);
  box-shadow: -3px 0 0 var(--accent-wash), 3px 0 0 var(--accent-wash);
}
```

## Mobile (<900px)

Navigation collapses into a bottom sheet:

**Trigger button:**
```html
<button class="nav-btn" aria-expanded="false" aria-controls="nav-sheet">
  <span class="nav-btn-l"></span>
  <span class="nav-btn-l"></span>
</button>
```

**Sheet:**
```html
<dialog class="nav-sheet" id="nav-sheet" open>
  <div class="nav-sheet-grab"><span></span></div>
  <nav>
    <ul class="nav-sheet-list">
      <li><a class="item is-active" href="#/articles">Articles</a></li>
      <!-- more items -->
    </ul>
  </nav>
</dialog>
```

Sheet: 
- Fixed bottom, max-height 85dvh
- Glass background (blur + saturation)
- 16px border-radius top corners
- Draggable to dismiss

## Focus

```css
.item:focus-visible {
  opacity: 1;
  text-underline-offset: 3px;
  text-decoration: underline 1px;
}
```

## Usage

- Main nav: top-level sections
- Sub-nav: current section's content
- Groups in sub-nav for categorization
- Mobile: single-column sheet
- Hash-based routing (`#/articles`)
