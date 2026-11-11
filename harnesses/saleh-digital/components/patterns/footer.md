---
title: Footer
slug: footer
status: published
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

The footer contains: bio (left), basmala (center), marks (right), and wordmark (full-width below).

## Structure

```html
<footer class="foot">
  <div class="foot-row">
    <div class="foot-side">
      <p class="bio">Ahmed Saleh <span lang="ar" dir="rtl">أحمد صالح</span> is a designer-founder in pursuit of the infinite.</p>
      <canvas class="foot-dots" aria-hidden="true"></canvas>
    </div>
    
    <p class="basmala" lang="ar" dir="rtl">بسم الله الرحمن الرحيم</p>
    
    <div class="foot-side foot-end">
      <canvas class="foot-dots" aria-hidden="true"></canvas>
      <ul class="marks" id="marks" aria-label="Marks"></ul>
    </div>
  </div>
  
  <svg class="wordmark" role="img" aria-label="salehdigital" width="1920" height="100">
    <text x="6" y="90" font-size="120">salehdigital</text>
  </svg>
</footer>
```

## Layout

Desktop:
- Grid: `minmax(min-content, 1fr) auto minmax(min-content, 1fr)`
- Bio on left, basmala center, marks right
- Dot matrices fill gaps with SDF rendering
- Wordmark full-width below

Mobile (<900px):
- Bio: full-width first row
- Basmala: second row, left-aligned
- Marks: third row, right-aligned with links
- Dots hidden
- Wordmark below

## Bio

```css
.bio {
  white-space: nowrap;
  filter: url(#ink-bio);
  padding: 0 0 0 12px;
  line-height: 19.2px;
}
```

- 16px UI font
- Heavy ink texture
- Inline Arabic with `lang="ar" dir="rtl"`

## Basmala

```css
.basmala {
  font: 300 18px/19.2px "Kufigraph", var(--ui);
  letter-spacing: 0;
  filter: url(#ink-bas);
}
```

- Kufigraph Light 300
- Arabic right-to-left
- Heavy ink texture

## Dot Matrices

SDF-rendered dot strips fill horizontal gaps:

```html
<canvas class="foot-dots" aria-hidden="true"></canvas>
```

- Flex: 1, min-width 12px, height 19.2px
- Filter: `url(#ink-dots)`
- JS renders animated dot matrix (see `js/footdots.js`)

## Marks

Four symbolic marks (exact meaning undocumented):

```html
<li><span class="mark" style="--w:20px; --src:url(...)"></span></li>
```

```css
.mark {
  height: 20px;
  width: var(--w);
  mask: var(--src) center / contain no-repeat;
  filter: var(--ink, url(#ink-mark)) blur(calc(var(--soft, 0px) + 0.55px));
  background: currentColor;
}
```

- Variable width, 20px height
- CSS mask with currentColor
- Ink filter + blur
- Hover reduces blur (`.is-peek`)

## Wordmark

```css
.wordmark text {
  letter-spacing: 0;
  fill: var(--foot);
  filter: url(#ink-ui);
  font-family: "Kult Luxury";
}
```

- ⚠️ **Kult Luxury is commercial** (see packages/kult-luxury.md)
- 120px font in 100px viewBox
- Inherits `--foot` color
- Focusable: `tabindex="0"`, underline focus ring

## Color

Footer color (`--foot`):
- Light/Dark: `var(--ink)`
- Marathon Dark: `var(--accent)`
- Marathon Light: `var(--accent-mark)`

## WebGL Mode

When `html.gl.gl-foot`:
- Bio, basmala, marks, wordmark text become transparent
- WebGL canvas renders them
- Dot matrices hidden

## Usage

- Always at bottom of `.site`
- Bio and basmala are fixed text
- Marks are owner-supplied SVG masks
- Wordmark is SVG text with commercial font
- Dot matrices animate on hover (WebGL off)
