---
title: Marathon Accents
slug: marathon-accents
status: published
description: Accent color variants for Marathon themes.
chips:
  - Theme
  - Colors
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Five vivid accent color options for Marathon Dark and Marathon Light themes. Selected via `data-accent` attribute.

## Accent Colors

**Lime** (default):
```css
--accent: #97ee2c;
--accent-mark: #b4ff4d;
--accent-wash: rgba(151, 238, 44, 0.12);
```

**Cyan**:
```css
--accent: #33d8ff;
--accent-mark: #5ce5ff;
--accent-wash: rgba(51, 216, 255, 0.12);
```

**Red**:
```css
--accent: #ff3350;
--accent-mark: #ff5c75;
--accent-wash: rgba(255, 51, 80, 0.12);
```

**Amber**:
```css
--accent: #ffbb14;
--accent-mark: #ffd14d;
--accent-wash: rgba(255, 187, 20, 0.12);
```

**Green**:
```css
--accent: #00cc88;
--accent-mark: #1aff a5;
--accent-wash: rgba(0, 204, 136, 0.12);
```

## Usage

Set accent via attribute:
```html
<html data-theme="marathon-dark" data-accent="cyan">
```

## Applied To

- Active nav items
- Links in body text
- Focus rings
- Active state highlights
- Marathon Light: accent wash backgrounds on active nav items

## Selection

User chooses accent in settings via swatch picker. Preference persists in localStorage.

## Related

See `marathon-dark.md` and `marathon-light.md` for full theme specifications.
