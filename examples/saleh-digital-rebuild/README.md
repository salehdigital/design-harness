# saleh.digital Rebuild from Harness

This is a **fidelity test** of the saleh-digital design harness. The goal: rebuild the home page using **ONLY** the information in `harnesses/saleh-digital/`, without looking at the live site's source code.

## Rules

1. **Only use the harness** — Read only `harnesses/saleh-digital/**/*.md`
2. **No peeking** — Don't inspect the live site's HTML/CSS/JS
3. **Commercial assets** — Use fallbacks (Georgia, Arial Black, no icons)
4. **Minimal scope** — Home page layout + footer, no interactions or WebGL

## What's Included

- Grid layout (nav + sub + body)
- Typography system (sizes, weights, tracking)
- Color tokens (light theme)
- Spacing tokens (gap, para, stack)
- Navigation (items, states, opacity)
- Article body (h2, h3, p, strong, em)
- Footer (bio, basmala, marks, wordmark)
- Mobile responsive breakpoint

## What's Missing

- Ink texture filters (SVG filters not in harness yet)
- WebGL effects
- Dot matrix canvases
- Theme switcher
- Motion/transitions
- Commercial fonts (Shinka, Kult, Kufigraph)
- Icons (Amicons)
- Marathon themes
- Materials (glass, shadows)

## Commercial Asset Fallbacks

Per licensing requirements:

- **Shinka** → Georgia serif
- **Kult Luxury** → Arial Black / Impact
- **Kufigraph** → UI font fallback
- **Amicons** → Simple colored circles (marks)

## Comparison

See `comparison-*.png` screenshots for side-by-side:

- `comparison-desktop-1440.png` — Desktop layout
- `comparison-mobile-390.png` — Mobile layout

## Learnings

This test validates:
- Typography specs are accurate (sizes, weights, tracking)
- Color tokens are correct (hex values)
- Spacing system is documented (gap, para, stack)
- Grid layout is reproducible
- Mobile breakpoints are documented
- Footer structure is clear
- Commercial asset notices are prominent

## Next Steps

Based on this rebuild:
1. Fill remaining harness files (materials, more components)
2. Add SVG filter specs
3. Document glass/shadow system
4. Complete component patterns
5. Fill intelligence files
