---
title: Switch
slug: switch
status: published
description: Binary toggle control.
chips:
  - Control
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Binary on/off toggle. Used in settings rows for preferences (sound, view-transitions, hidden-extras, marathon mode).

## Anatomy

```html
<label class="switch">
  <input type="checkbox" checked />
  <span class="track"></span>
</label>
```

## Styling

Track:
```css
.switch .track {
  width: 40px;
  height: 24px;
  background: color-mix(in srgb, var(--dot) 24%, transparent);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s var(--ease-land);
}
```

Thumb:
```css
.switch .track::before {
  content: '';
  width: 20px;
  height: 20px;
  background: var(--paper);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--dot) 12%, transparent),
              0 2px 4px color-mix(in srgb, var(--shadow) 24%, transparent);
  border-radius: 10px;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: left 0.2s var(--ease-land);
}
```

Checked:
```css
.switch input:checked + .track {
  background: var(--ok);
}

.switch input:checked + .track::before {
  left: 18px;
}
```

## Colors

- Off track: `--dot` at 24% alpha
- On track: `--ok` (green)
- Thumb: `--paper`

## States

- Off: thumb left, gray track
- On: thumb right, green track
- Focus: outline on hidden checkbox

## Usage

- Always wrap with semantic `<label>`
- Hidden `<input type="checkbox">`
- Settings-only (not for data toggles)
- Instant visual feedback
- Single green check mark after save (not persistent on switch)
