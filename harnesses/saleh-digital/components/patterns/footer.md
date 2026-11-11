---
title: Footer
slug: footer
status: published
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

The footer is one quiet line and one huge word. On desktop the line holds the bio on the left, the basmala in the dead centre and four small marks on the right, with a live dot matrix filling each gap. Under it, the `salehdigital` wordmark runs edge to edge across the whole window.

## Placement

The footer is the last child of `.site` (a `min-height: 100vh` flex column, see foundations/layout-grid.md). On a short page it sits on the bottom edge of the window; on a long post it follows the last block of the post after the page's 48px bottom padding (40px on phones). Never place it inside `.cols`, and never give it a fixed position.

## Markup

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
      <ul class="foot-links" id="foot-links" aria-label="More" hidden></ul>
      <ul class="marks" id="marks" aria-label="Marks">
        <li><span class="mark" role="img" aria-label="Mark 1" style="--w: 22.4px; --src: url(assets/footer/27-45.png)"></span></li>
        <li><span class="mark" role="img" aria-label="Mark 2" style="--w: 18.6px; --src: url(assets/footer/27-48.png); --soft: 0.42px"></span></li>
        <li><span class="mark" role="img" aria-label="Mark 3" style="--w: 20px; --src: url(assets/footer/27-49.png)"></span></li>
        <li><span class="mark" role="img" aria-label="Mark 4" style="--w: 18px; --src: url(assets/footer/27-50.png)"></span></li>
      </ul>
    </div>
  </div>
  <svg class="wordmark" role="img" aria-label="salehdigital" tabindex="0"><text>salehdigital</text></svg>
</footer>
```

The marks are the owner's own PNG masks (`assets/footer/*.png`), not part of this harness. Without them, leave the `<li>`s empty-masked (a mask that fails to load paints nothing) or drop the list; do not draw substitutes.

## CSS

```css
.foot { padding: 0; color: var(--foot); }            /* --foot is --ink in light and dark */
.foot-row { display: grid; grid-template-columns: minmax(min-content, 1fr) auto minmax(min-content, 1fr); align-items: end; column-gap: 0; row-gap: 10px; }
.foot-side { display: flex; align-items: flex-end; column-gap: 0; min-width: 0; }
.foot-end { display: flex; align-items: flex-end; column-gap: 0; row-gap: 10px; margin-left: 0; }
.bio { margin: 0; padding: 0 0 0 12px; white-space: nowrap; line-height: 19.2px; filter: url(#ink-bio); }
.bio [lang="ar"] { unicode-bidi: isolate; }
.basmala { margin: 0; font: 300 18px/19.2px "Kufigraph", var(--ui); letter-spacing: 0; white-space: nowrap; filter: url(#ink-bas); }
.foot-dots { flex: 1 1 0; width: 0; min-width: 12px; height: 19.2px; align-self: flex-end; display: block; filter: url(#ink-dots); }
.marks { list-style: none; display: flex; align-items: flex-end; gap: 8px; margin: 0; padding: 0 8px; }
.mark { display: block; height: 20px; width: var(--w); background: currentColor;
  -webkit-mask: var(--src) center / contain no-repeat; mask: var(--src) center / contain no-repeat;
  filter: url(#ink-mark) blur(calc(var(--soft, 0px) + .55px)); }
.wordmark { display: block; width: 100%; height: 97px; overflow: hidden; user-select: none; outline: none; }
.wordmark text { font-family: "Kult Luxury"; letter-spacing: 0; fill: var(--foot); filter: url(#ink-ui); }

@media (max-width: 899px) {
  .bio { padding: 0 12px; width: auto; max-width: calc(310px + 12px); white-space: normal; }
  .foot-end { flex: 1 1 100%; justify-content: space-between; padding-left: 12px; }
  .foot-dots { display: none; }
  .foot-row { grid-template-columns: 1fr auto; row-gap: 10px; }
  .foot-row > .foot-side:first-child { grid-column: 1 / -1; }
  .basmala { padding-left: 12px; justify-self: start; }
}
```

On phones the bio wraps to two lines (max 310px of text), the basmala goes under it on the left, the marks stay right, and the dot strips are hidden.

## The wordmark fit (js/app.js `fitWordmark`)

The word is fitted so its ink spans the window minus 6px on each side, and the svg is cropped just under the baseline so the descender of the g is cut off by the page edge:

```js
function fitWordmark(svg) {
  const W = document.documentElement.clientWidth, side = 6, top = W < 900 ? 8 : 6;
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = '400 100px "Kult Luxury"';
  const m = ctx.measureText('salehdigital');
  const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const k = (W - side * 2) / inkW, size = 100 * k;
  const asc = m.actualBoundingBoxAscent * k, pad = Math.max(3, asc * 0.088);
  const H = Math.round(top + asc + pad);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', W); svg.setAttribute('height', H); svg.style.height = H + 'px';
  const t = svg.querySelector('text');
  t.setAttribute('x', (side + m.actualBoundingBoxLeft * k).toFixed(2));
  t.setAttribute('y', (top + asc).toFixed(2));
  t.setAttribute('font-size', size.toFixed(3));
}
// run after fonts load and on resize: document.fonts.ready.then(() => fitWordmark(svg)); addEventListener('resize', ...)
```

On the live site a WebGL pass redraws the bio, basmala, dot strips and wordmark in the same place (and lets the wordmark react to hover); the DOM above is the exact fallback and has the same geometry.

## The dot strips (js/footdots.js)

Each `.foot-dots` canvas draws a grid of dots on a 4.8px pitch in the footer colour. Each dot's radius goes from 0.45px to 1.7px, larger inside a few soft blobs (one per 140px of width, minimum 2) that drift slowly with time and follow the pointer. Smoothstep the radius: `r = 0.45 + (1.7 - 0.45) * g*g*(3 - 2*g)`. A static rebuild may draw a single frame.

## Rules

- Bio copy exactly: "Ahmed Saleh أحمد صالح is a designer-founder in pursuit of the infinite."
- No links, columns of links, social icons or copyright line in the footer.
- The wordmark is always the full window width and always last on the page.
