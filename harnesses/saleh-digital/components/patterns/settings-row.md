---
title: Settings Row
slug: settings-row
status: published
description: Setting control row.
chips:
  - Settings
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Setting row with label, description, and control (switch, slider, swatch picker). Used in /settings view for preferences.

## Anatomy

```html
<div class="setting-row">
  <div class="setting-info">
    <label class="setting-label" for="sound">Sound</label>
    <p class="setting-desc">Enable UI sound feedback.</p>
  </div>
  <div class="setting-control">
    <label class="switch">
      <input type="checkbox" id="sound" checked />
      <span class="track"></span>
    </label>
  </div>
</div>
```

## Styling

Row:
```css
.setting-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--para);
  padding: var(--para) 0;
  border-bottom: 1px solid color-mix(in srgb, var(--dot) 10%, transparent);
  align-items: center;
}

.setting-row:last-child {
  border-bottom: none;
}
```

Label:
```css
.setting-label {
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.64px;
  margin-bottom: 2px;
  display: block;
}
```

Description:
```css
.setting-desc {
  font-size: 13px;
  line-height: 18px;
  opacity: var(--op-meta);
}
```

## Control Types

**Switch:**
See `switch.md` for full styling.

**Slider:**
```html
<input type="range" class="slider" min="0" max="100" value="50" />
```

**Swatch Picker:**
```html
<div class="swatch-group">
  <button class="swatch is-active" data-accent="lime">...</button>
  <button class="swatch" data-accent="cyan">...</button>
</div>
```

## Mobile

On narrow screens (<600px), stack vertically:
```css
@media (max-width: 599px) {
  .setting-row {
    grid-template-columns: 1fr;
    gap: var(--stack);
  }
}
```

## Usage

- Label and description on left
- Control on right (switch, slider, or picker)
- Divider line between rows
- Last row has no bottom border
- Stacks on mobile for better touch targets
