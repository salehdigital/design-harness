---
title: Icon Button
slug: icon-button
status: published
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Small icon-only button for meta actions (discuss, copy, sound toggle).

## Anatomy

```html
<button class="meta-ico" id="copy" type="button" aria-label="Copy link">
  <span class="ico" data-icon="copy" data-morph="ico-copy"></span>
</button>
```

## Styling

```css
.meta-ico {
  height: 16px;
  color: inherit;
  cursor: pointer;
  background: 0 0;
  border: 0;
  border-radius: 4px;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  display: inline-flex;
}

.meta-ico .ico {
  width: 16px;
  height: 16px;
  opacity: var(--op-meta);
  mask: var(--src) center / 16px 16px no-repeat;
  background: currentColor;
  display: block;
  translate: 0 -0.5px;
}
```

## States

**Rest:**
```css
.ico {
  opacity: var(--op-meta); /* 0.56 */
}
```

**Hover:**
```css
.meta-ico:hover .ico {
  opacity: 1;
}
```

**Hot (active/on):**
```css
.ico.is-hot {
  opacity: 1;
}
```

**Focus:**
```css
.meta-ico:focus-visible {
  outline: 1px solid var(--ring);
  outline-offset: 2px;
}
```

## With Count

```html
<button class="meta-ico" id="discuss">
  <span class="ico" data-icon="discuss"></span>
  <span class="count">24</span>
</button>
```

Count styling:
```css
.meta-ico .count {
  opacity: var(--op-faint);
  line-height: 16px;
}
```

## Icons

Icon set via CSS variable (Amicons, commercial):
```css
[data-icon="copy"] {
  --src: url(...); /* owner-supplied */
}
```

## Usage

- Always include `aria-label` (no visible text)
- 16×16px icon size
- Touch target minimum 24px (wrap or pad)
- Opacity transitions for visual feedback
- Hot state for toggles (sound on/off)
