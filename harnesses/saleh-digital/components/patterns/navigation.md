---
title: Navigation
slug: navigation
status: published
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Two lists on the left of every page: the rooms (column 1) and the pages of the current room (column 2). Plain words, no icons, no underlines, no blur. The current item is full ink; everything else recedes to about 39% opacity.

## Markup (desktop and phone are the same DOM)

```html
<nav class="col col-nav" aria-label="Sections">
  <button type="button" class="nav-btn" aria-label="Menu" aria-expanded="false" aria-controls="nav-sheet">
    <span class="nav-btn-l" aria-hidden="true"></span><span class="nav-btn-l" aria-hidden="true"></span>
  </button>
  <ul id="nav">
    <li><a class="item is-active" href="#/articles" aria-current="page">Articles</a></li>
    <li><a class="item" href="#/lectures">Lectures</a></li>
    <li><a class="item" href="#/talks">Speaking</a></li>
    <li><a class="item" href="#/experiments">Experiments</a></li>
    <li><a class="item" href="#/library">Library</a></li>
    <li><a class="item" href="#/coffee-table">Coffee table</a></li>
    <li class="nav-step"><a class="item" href="#/contact">Contact</a></li>
    <li><a class="item" href="#/settings">Settings</a></li>
  </ul>
</nav>
<nav class="col col-sub" aria-label="In this section">
  <ul id="sub" aria-label="Articles">
    <li><a class="item is-active" href="#/articles/what-is-a-design-harness" aria-current="page">What is a design harness?</a></li>
  </ul>
</nav>
```

These are the live menu labels, in this order. Six rooms, then a step of air, then Contact and Settings. Column 2 lists only the pages of the current room: on Articles that is the one article title; on Lectures it is "Philosophy of design" and "Lead UX and Product Design Instructor".

## CSS

```css
.col ul { display: flex; flex-direction: column; gap: var(--stack); }      /* 16px lines, 4px apart */
.item { display: inline-block; white-space: nowrap; opacity: var(--op-rest); filter: url(#ink-ui); outline: none; }
.item.is-peek   { opacity: var(--op-peek); filter: url(#ink-ui); }           /* hover / attention */
.item.is-active { opacity: 1; filter: url(#ink-ui); }
.col-nav .item.is-active { color: var(--accent-text); }
.item:focus-visible { opacity: 1; filter: url(#ink-ui); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
.col-nav .nav-step { margin-top: calc(var(--para) - var(--stack)); }        /* 12px: Contact starts a new group */
.sub-group { opacity: var(--op-meta); filter: url(#ink-ui); white-space: nowrap; cursor: default; user-select: none; }
.sub-group:not(:first-child), .sub-one:not(:first-child) { margin-top: calc(var(--para) - var(--stack)); }
/* a long page title wraps instead of widening the column */
.col-sub .item { white-space: normal; max-width: 100%; text-wrap: balance; }
```

`--op-rest` is `calc(.85 - .766 * var(--fnd-focus))` = 0.3904 at the default focus. Resting items are only faded, never blurred.

Type: the menu inherits `body` (`400 16px/16px var(--ui)`, tracking `-0.64px`).

## Phone (below 900px): the two-line glyph and a bottom sheet

`<html>` carries `class="has-nav-sheet"`. Below 900px the `#nav` list is hidden and the glyph shows at the top left. Column 2 (the current page title) stays visible under it.

```css
.nav-btn { display: none; }
.nav-sheet { display: none; }
@media (max-width: 899px) {
  html.has-nav-sheet .col-nav #nav { display: none; }
  .nav-btn { display: grid; align-content: center; justify-items: start; gap: 6px; width: 44px; height: 44px;
    margin: -12px 0 -12px -12px; padding: 0 12px; border: 0; background: none; color: var(--ink); cursor: pointer;
    -webkit-tap-highlight-color: transparent; filter: url(#ink-ui); }
  .nav-btn-l { display: block; width: 20px; height: 1.5px; border-radius: 1px; background: currentColor;
    transition: transform 240ms var(--ease-land), width 240ms var(--ease-land); }
  .nav-btn-l + .nav-btn-l { width: 13px; }                     /* the short second line */
  .nav-btn:hover .nav-btn-l + .nav-btn-l { width: 20px; }
  .nav-btn[aria-expanded="true"] .nav-btn-l { width: 20px; transform: translateY(3.75px) rotate(45deg); }
  .nav-btn[aria-expanded="true"] .nav-btn-l + .nav-btn-l { transform: translateY(-3.75px) rotate(-45deg); }
}
```

So on a 390px phone: the two lines start at x 12, the first 20px long and the second 13px, centred in a 44px tap target that overhangs the 20px top padding; the page title starts 20px under the glyph row; the post starts 28px under the title.

The glyph opens `<dialog id="nav-sheet" class="nav-sheet">`, a liquid-glass bottom sheet:

```css
@media (max-width: 899px) {
  .nav-sheet[open] { display: block; position: fixed; inset: auto 0 0 0; width: 100%; max-width: none; max-height: 85dvh; margin: 0;
    padding: 0 0 max(24px, env(safe-area-inset-bottom)); overflow: auto; overscroll-behavior: contain;
    border: 0; border-radius: 16px 16px 0 0; color: var(--ink); font: 400 16px/20px var(--ui); letter-spacing: var(--track);
    background: color-mix(in srgb, var(--paper) 68%, transparent);
    -webkit-backdrop-filter: blur(20px) saturate(1.3); backdrop-filter: blur(20px) saturate(1.3);
    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--paper) 62%, transparent),
                inset 0 0 0 1px color-mix(in srgb, var(--ink) 7%, transparent),
                0 -12px 40px color-mix(in srgb, var(--shadow) calc(16% * var(--shadow-k)), transparent); }
  .nav-sheet::backdrop { background: color-mix(in srgb, var(--shadow) 20%, transparent); }
  .nav-sheet-grab { display: grid; place-items: center; height: 28px; }
  .nav-sheet-grab span { width: 36px; height: 4px; border-radius: 2px; background: color-mix(in srgb, var(--ink) 18%, transparent); }
  .nav-sheet nav { padding: 4px 24px 0; }
  .nav-sheet-list li { padding: 9px 0; }
  .nav-sheet-list .item { font: 400 24px/28px var(--ui); letter-spacing: -0.96px; opacity: var(--op-meta); }
  .nav-sheet-list .item.is-active { opacity: 1; color: var(--accent-text); }
}
```

The sheet lists the same eight items as `#nav`, drags down to close, and closes on Escape or a tap on the scrim.

## Rules

- Exactly these labels; do not add Home, Recent, Work or icons.
- No underline at rest, no blur on inactive items.
- On phones, never show the menu as a horizontal row of links.
