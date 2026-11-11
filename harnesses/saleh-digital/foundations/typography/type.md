---
title: Type
slug: type
status: published
order: 2
description: Shinka for reading, Inter Display for interface and everything around it, and Kult Luxury, drawn as a shader, for the wordmark.
chips:
  - Shinka 16/20.8
  - Inter Display 16/16
  - Kult Luxury
  - Tracking −0.64
created: 2026-11-09T14:21:21Z
updated: 2026-11-09T17:23:21Z
---


Three faces, each with one job. Shinka is the reading face, Inter Display is everything around the reading, and Kult Luxury is only the footer wordmark.

> **Licensing.** Shinka (Aeiou Tools, https://aeiou.tools/purchase/shinka) and Kult Luxury are commercial typefaces. They are not in this repository or its npm packages. If you build with this harness, buy your own licenses or use the fallbacks below. Never commit, bundle or base64 the font files.

## Stacks (`css/tokens.css`)

```css
:root {
  --ui:    "Inter Display", "Helvetica Neue", Arial, sans-serif;
  --serif: "Shinka", Georgia, serif;
  --mono:  "ABC Favorit Mono Trial", "SF Mono", ui-monospace, Menlo, monospace;
  --track: -.64px;
}
```

## Faces (`css/site.css`), with owner-supplied files

```css
@font-face { font-family: "Inter Display"; src: url(../fonts/InterDisplay-Regular.woff2) format("woff2"); font-weight: 400; font-style: normal; font-display: swap; size-adjust: 100.06%; ascent-override: 90%; descent-override: 22%; line-gap-override: 0%; }
@font-face { font-family: "Inter Display"; src: url(../fonts/InterDisplay-Italic.woff2) format("woff2"); font-weight: 400; font-style: italic; font-display: swap; size-adjust: 100.06%; ascent-override: 90%; descent-override: 22%; line-gap-override: 0%; }
@font-face { font-family: "Inter Display"; src: url(../fonts/InterDisplay-Medium.woff2) format("woff2"); font-weight: 500; font-style: normal; font-display: swap; size-adjust: 100.06%; ascent-override: 90%; descent-override: 22%; line-gap-override: 0%; }
/* commercial: supply your own licensed files at these paths */
@font-face { font-family: "Shinka"; src: url(../fonts/Shinka-Regular.otf) format("opentype"); font-weight: 400; font-style: normal; font-display: swap; size-adjust: 100%; ascent-override: 91%; descent-override: 25%; line-gap-override: 0%; }
@font-face { font-family: "Shinka"; src: url(../fonts/Shinka-RegularItalic.otf) format("opentype"); font-weight: 400; font-style: italic; font-display: swap; size-adjust: 100%; ascent-override: 91%; descent-override: 25%; line-gap-override: 0%; }
@font-face { font-family: "Kult Luxury"; src: url(../fonts/Kult-Luxury.woff2) format("woff2"); font-weight: 400; font-style: normal; font-display: optional; }
@font-face { font-family: "Kufigraph"; src: url(../fonts/Kufigraph-Light.otf) format("opentype"); font-weight: 300; font-style: normal; font-display: optional; }
```

Shinka has a single weight. Bold is drawn, not loaded: `.col-body strong { font-weight: 400; -webkit-text-stroke: .5px currentColor; }`.

## Scale

| Role | Face | Size / line | Tracking |
| --- | --- | --- | --- |
| Body copy (`.col-body`) | Shinka | 16 / 20.8 | -0.64 |
| Post heading `h2`, desktop | Inter Display 400 | 28 / 32 | -1.1 |
| Post heading `h2`, below 900px | Inter Display 400 | 24 / 28 | -0.9 |
| Post heading `h3` | Inter Display 400 | 20 / 24 | -0.6 |
| Menu, page titles, UI (`body`) | Inter Display 400 | 16 / 16 (4px stack, 20px pitch) | -0.64 |
| Record title | Inter Display 400 | 16 / 20 | -0.64 |
| Record meta line, figure caption | Inter Display 400 | 14 / 20 | -0.2 |
| Flow cards | Inter Display 400 (Harness card 500) | 15 (13 under 600px) | inherit |
| Before / After tabs | Inter Display 400 | 14 / 34 (13 / 30 under 600px) | -0.2 |
| Phone menu sheet items | Inter Display 400 | 24 / 28 | -0.96 |
| Footer bio | Inter Display 400 | 16 / 19.2 | -0.64 |
| Footer basmala | Kufigraph 300 | 18 / 19.2 | 0 |
| Wordmark | Kult Luxury 400 | fitted to the window width (see brand/wordmark.md) | 0 |

There is no post title on the page: the `h1` is `.sr-only`, and the current page title is shown in the section list (column 2). The first visible line of an article is its first `h2`.

```css
.col-body { font: 400 16px/20.8px var(--serif); letter-spacing: var(--track); font-kerning: normal; }
.col-body h2, .col-body h3 { margin: 0; font: 400 16px/20px var(--ui); letter-spacing: var(--track); text-wrap: balance; }
.col-body h2 { font-size: 28px; line-height: 32px; letter-spacing: -1.1px; }
.col-body h3 { font-size: 20px; line-height: 24px; letter-spacing: -0.6px; }
@media (max-width: 899px) { .col-body h2 { font-size: 24px; line-height: 28px; letter-spacing: -0.9px; } }
.col-body em { font-style: italic; }
```

## Fallbacks when you have no license

- Shinka → `Georgia, serif`. Georgia sets wider than Shinka, so expect each line to hold a few fewer words. Keep 16 / 20.8.
- Kult Luxury → any high-contrast book serif (for example `"Times New Roman", serif`); keep the fitting rule so the word still spans the window.
- Inter Display is open (SIL OFL 1.1, https://rsms.me/inter/); fallback `"Helvetica Neue", Arial, sans-serif`.

## Rules

- Never set body copy in Inter Display or headings in Shinka.
- No bold weights in the UI. Weight 500 appears in one place, the Harness card of the flow diagram.
- All type gets the ink filter (see materials/texture.md); without it the page looks digital and flat.
