---
title: Themes
slug: themes
status: published
group: Foundations
order: 2
discuss: 0
created: 2026-11-09T19:23:22Z
updated: 2026-11-09T19:23:22Z
---

Four themes adapt the color system: Light (default), Dark, Marathon Dark, and Marathon Light. Marathon themes support accent color variants.

## Available Themes

### Light
Clean, high-contrast, neutral palette. Pure white background, pure black text.

- Paper: `#ffffff`
- Ink: `#000000`
- Accent: black (same as ink)
- Shadow multiplier: 1

See `themes/light.md` for details.

### Dark
Near-black background with warm off-white text. Stronger shadows and grain.

- Paper: `#0b0b0c` (near-black)
- Ink: `#ece8e1` (warm off-white)
- Accent: same as ink
- Shadow multiplier: 2.4

See `themes/dark.md` for details.

### Marathon Dark
High-contrast dark with neon accent system. Default: lime green.

- Paper: `#0b0b0c`
- Ink: `#ece8e1`
- Accent: `#c2fe0b` (lime)
- Signal: `#01ffff` (cyan)
- Shadow multiplier: 2.4
- **Accent variants:** lime, cyan, red, amber, green

See `themes/marathon-dark.md` for details.

### Marathon Light
High-contrast light with neon accent system. Default: lime green.

- Paper: `#f1f3f7` (cool grey)
- Ink: `#29324f` (dark blue-grey)
- Accent: `#c2fe0b` (lime)
- Signal: `#ff0d1a` (red)
- Shadow multiplier: 1.2
- **Accent variants:** lime, cyan, red, amber, green

See `themes/marathon-light.md` for details.

## Switching Themes

**HTML attribute:**
```html
<html data-theme="dark">
<html data-theme="marathon-dark" data-accent="cyan">
```

**Theme meta tag:**
```html
<meta name="theme-color" content="#ffffff">
```

Values: `#ffffff` (light), `#0b0b0c` (dark/marathon-dark), `#f1f3f7` (marathon-light)

## Accent Colors (Marathon only)

Marathon themes support accent swapping via `data-accent`:

- **Lime** (default): `#c2fe0b`
- **Cyan**: `#01ffff`
- **Red**: `#ff0d1a`
- **Amber**: `#ffb000`
- **Green**: `#59b41d`

Accent affects: active nav, footer, focus rings, selection, glow, signal.

## Storage

User preference stored in `localStorage`:

```javascript
localStorage.setItem('sd.theme', JSON.stringify({
  theme: 'marathon-dark',
  accent: 'cyan'
}));
```

## Automatic Detection

If no stored preference, default is system preference:

```javascript
const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
const theme = prefersDark ? 'dark' : 'light';
```

## Usage

- Light: default, minimal color
- Dark: comfortable low-light reading
- Marathon: high-energy technical work, accent customization
- Always provide theme switcher in Settings
- Respect system preference as default
- Persist user choice
