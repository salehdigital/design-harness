---
title: WebGL
slug: webgl
status: published
description: "One WebGL2 canvas (three.js 0.186.1) draws the live wordmark, the footer pass, every morph and the orbs, all on SDF fields built by jump flood, within strict budgets."
chips:
  - Motion
  - WebGL
  - Wordmark
  - Shader
created: 2026-11-11T16:03:37Z
updated: 2026-11-11T16:03:37Z
---

`js/gl.js` creates **one** WebGL context for the whole site: `#gl`, `position: fixed; inset: 0; pointer-events: none; z-index: 10`, above everything. It draws the live wordmark, the footer above it (bio, basmala, dot strips and marks), every resolve morph, and the yellow orbs. The paper grain is not GL; it is a CSS layer at z-index 11 ([texture](../materials/texture.md)). The gallery grids (Library, Experiments, Coffee table) each get their own canvas *under* the page (`canvas.grid-gl`, see the templates).

- **Library:** three.js 0.186.1 from jsDelivr through an import map:

  ```html
  <script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.186.1/examples/jsm/"}}</script>
  ```

- **Renderer:** `alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, failIfMajorPerformanceCaveat: true`. It needs WebGL2 and `EXT_color_buffer_float`; without them there is no GL and everything stays DOM (`html` without `.gl`).
- **When it starts:** after fonts load. On desktop it starts on `requestIdleCallback` (timeout 1500ms). On touch devices it waits for the first touchstart, scroll or click, or 5s. Until then, and whenever the context is lost, the DOM SVG wordmark and footer show.
- **Shapes:** every shape is an SDF built on the GPU by jump flood (JFA) from a 2D canvas raster of the text or image. Text is rasterised with the element's real computed font (`js/raster.js`).
- **Loop:** busy → every rAF. Idle but alive (wordmark or orb on screen, someone here) → a timer at 15 fps (30 with orbs). Otherwise it sleeps until an event. It stops when the tab is hidden.
- **Theme:** `theme:change` re-tints every uniform live (ink, swell, foot, glow).

## Budgets

Source: `site/js/gl.js`, lines 17 to 34

```js
const MAXL = 64;
const MB = 1 << 20;

export const BUDGET = {
  dpr: 1.5,               // the canvas never draws above 1.5 device px per CSS px
  dprScrolling: 1.2,      // reduce DPR while scrolling to improve performance
  fieldScale: 1,          // body and wordmark fields: texels per CSS px (the field is smooth)
  fieldMaxPx: 1.5e6,      // one field, texels (scale drops to fit)
  dispMaxPx: 3e6,         // one display raster, texels
  jfaMaxSide: 4096,       // jump-flood ping-pong pool, per side
  jfaMaxPx: 2.4e6,        // ...and its area: 2 x RGBA16F = 38MB at most
  texBytes: 64 * MB,      // every field and display raster alive at once
  cacheBytes: 16 * MB,    // the item field cache, by bytes...
  cacheEntries: 40,       // ...and by count
  buildsPerFrame: 8,      // jump-flood builds in one frame...
  buildPxPerFrame: 2.4e6, // ...and texels; past either, a morph is a crossfade
  maxMorphs: 40,          // morphs drawing at once
  poolIdleMs: 15000       // the pool and the scratch canvas are freed after this long unused
```


## The wordmark: fitting (DOM and GL)

The footer wordmark is an inline SVG `<svg class="wordmark" role="img" aria-label="salehdigital" tabindex="0"><text>salehdigital</text></svg>`, set in **Kult Luxury** 400 (commercial; the font file is not in this harness, see the [kult-luxury](../../intelligence/packages/kult-luxury.md) licence notice). It is fitted edge to edge on every width change (ResizeObserver, debounced 120ms):

- 6px side margins. The cap top is 6px under the bio's line box (8px below 900px). The baseline leaves `max(3, asc × .088)` below it, so the descending spur of each "a" bleeds off the bottom.
- `k = (clientWidth − 12) / inkWidth(100px)`, and the font size is `100k`, measured in a 2D canvas (`'400 100px "Kult Luxury"'`).
- At 1440 (clientWidth 1425 with a 15px scrollbar) this gives an svg 1425 × 239 with a font-size of 310.411.
- `.wordmark { display:block; width:100%; height:97px; overflow:hidden }` is the placeholder height; `fitWordmark` sets the real one.
- The DOM text is `fill: var(--foot); filter: url(#ink-ui)`. With GL on (`.gl`) it is `fill: transparent` and the field draws it.

Source: `site/js/app.js`, lines 711 to 769

```js
// ---------- wordmark: fit edge to edge ----------
const mctx = document.createElement('canvas').getContext('2d');
let fitKey = '';
function fitWordmark() {
  const vw = document.documentElement.clientWidth;
  // frame: 6px side margins, cap top 6px under the bio's line box (the text
  // ink sits about 2px clear), baseline 7px above the page edge, so the
  // descending spur of each "a" bleeds off the bottom
  const margin = 6, above = vw < 900 ? 8 : 6;
  mctx.font = '400 100px "Kult Luxury"';
  const m = mctx.measureText(WORD);
  const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const k = (vw - margin * 2) / inkW;
  const fs = 100 * k;
  const asc = m.actualBoundingBoxAscent * k, desc = m.actualBoundingBoxDescent * k;
  const below = Math.max(3, asc * 0.088);
  const h = Math.round(above + asc + below);
  const x = margin + m.actualBoundingBoxLeft * k, y = above + asc;
  wordSvg.setAttribute('viewBox', `0 0 ${vw} ${h}`);
  wordSvg.setAttribute('width', vw); wordSvg.setAttribute('height', h);
  wordSvg.style.height = h + 'px';
  Object.entries({ x: x.toFixed(2), y: y.toFixed(2), 'font-size': fs.toFixed(3) }).forEach(([a, v]) => wordText.setAttribute(a, v));
  if (gl && fitKey !== `${vw}`) {
    fitKey = `${vw}`;
    const r = wordSvg.getBoundingClientRect();
    const sx = window.scrollX, sy = window.scrollY;
    const font = `normal 400 ${fs}px "Kult Luxury"`;
    const run = { t: WORD, x: r.left + sx + x, y: r.top + sy + y, font, ls: 0, a: 1 };
    const snap = { runs: [run], rect: { x: r.left + sx + margin, y: r.top + sy + above, w: vw - margin * 2, h: asc + desc }, blur: 0, opacity: 1, sig: 'wordmark' };
    // the glyphs one by one, alternating into two fields, so adjacent letters
    // can melt into each other (smooth-min) as the wordmark comes alive
    const even = [], odd = [], glyphs = [];
    mctx.font = font;
    for (let i = 0; i < WORD.length; i++) {
      const gx = run.x + mctx.measureText(WORD.slice(0, i)).width;
      const gw = mctx.measureText(WORD[i]).width;
      (i % 2 ? odd : even).push({ ...run, t: WORD[i], x: gx });
      glyphs.push({ ch: WORD[i], cx: gx + gw / 2, cy: run.y - asc / 2 });
    }
    wordGlyphs = glyphs.map(g => ({ ...g }));
    gl.setWordmark(snap, wordSvg, {
      even: { ...snap, runs: even, sig: 'wm-even' }, odd: { ...snap, runs: odd, sig: 'wm-odd' }, glyphs, cap: asc
    });
    // the hold secret's second field: أحمد صالح, centred, about the wordmark's height
    mctx.font = '400 100px "Inter Display"'; mctx.direction = 'rtl'; mctx.textAlign = 'left';
    const ma = mctx.measureText(WORD_AR);
    mctx.direction = 'ltr';
    const inkH = ma.actualBoundingBoxAscent + ma.actualBoundingBoxDescent;
    const inkW = ma.actualBoundingBoxLeft + ma.actualBoundingBoxRight;
    const ka = Math.min((asc * 1.2) / inkH, (vw * 0.9) / inkW);
    const top = above + ((asc + below) - inkH * ka) / 2;
    const ax = (vw - inkW * ka) / 2 + ma.actualBoundingBoxLeft * ka;
    const ay = top + ma.actualBoundingBoxAscent * ka;
    const runA = { t: WORD_AR, x: r.left + sx + ax, y: r.top + sy + ay, font: `normal 400 ${100 * ka}px "Inter Display"`, ls: 0, a: 1, dir: 'rtl' };
    gl.setWordmarkAlt({ runs: [runA], rect: snap.rect, blur: 0, opacity: 1, sig: 'wordmark-ar' });
    updateLife();
  }
}
```


### Mobile overflow (live behaviour, measured)

At 390 wide (headless Chrome, 2026-11-11), the live footer shows only "salehdigi": the word runs off the right edge. **This happens with and without GL** (`?lite` shows the same thing), so it is not a shader bug. The cause is in the fonts: Kult Luxury is `font-display: optional`. `boot()` explicitly `document.fonts.load`s it, so the canvas measure in `fitWordmark` uses the real Kult metrics. The DOM's `<text>` had already fallen back (optional fonts that miss the first-paint window are not swapped in), so it renders in the fallback serif, which is much wider at the same font-size. The fitted size is right for Kult and too big for the fallback. On a warm cache, Kult renders and the word fits.

A rebuild that wants parity with the *intended* design should fit with the font that is actually rendering. One way is to measure only after `document.fonts.check('100px "Kult Luxury"')` and refit on `document.fonts` `loadingdone`. Another is to use `font-display: block` for the wordmark face. A rebuild that wants parity with the *live* pixels should keep `optional`.

## The wordmark's life (WORD_FRAG)

Life runs from 0 to 1 (`E.life()`, or `--fnd-life` when above 0). It layers five stages, each fading in as `life × 5` goes from k − 1 to k:

1. edge boil (`LIFE.boil` .7)
2. an ink halftone inside the strokes (dot pitch `LIFE.dotPitch` 2.4, drift .6)
3. iso-line ripples on the bar clock (92 bpm; spacing 9px, alpha .13, reach 46px)
4. letters melting at the joins (smooth-min `meld` .42), with dots flowing along the strokes (`flow` 6)
5. fully alive

Found secrets leave yellow traces and the Arabic ghost ([hidden extras](hidden-extras.md)). The cursor warps the word within `mouseR` 90px (gain `cursorGain` 2.2). A level rise first swells the word toward `--swell` (`LIFE.swell` 1.4) and settles over `settleMs` 1800. At rest it breathes `breathPx(E)` 0.9px. **On the live site, with emergence off, life is 0**: only the static edge noise, grain and the cursor response show.

### The footer pass

The bio, the basmala, the two dot strips and the four marks are baked into a second field and drawn in the same pass (`setFooter`), with `FOOT` = `{ bio: .3, marks: 1, scale: 2, maxWarp: .4 }`. At life 0 they are as crisp as the DOM. Their DOM steps aside (`.gl.gl-foot .bio { color: transparent }`) but stays selectable. Each mark has its own hover focus bump (`markHover`). Without GL they use the SVG ink filters.

Source: `site/js/app.js`, lines 770 to 794

```js
// ---------- the footer above the word, drawn in the wordmark's pass ----------
// The bio stays real DOM text (selectable, read aloud) but steps aside, colour
// transparent, while the field draws it; without WebGL, after a lost context
// or with ?lite the DOM shows as before.
async function bakeFooter() {
  const root = document.documentElement;
  if (!gl || LITE || !gl.setFooter) { root.classList.remove('gl-foot'); return; }
  const marks = [...document.querySelectorAll('#marks .mark')];
  await Promise.all(marks.map(m => preloadMask(m.dataset.maskSrc).decode?.().catch(() => {})));
  const bio = snapshot($('.bio'), 'bio');
  const links = [...document.querySelectorAll('#foot-links .foot-link')].map(a => snapshot(a, a.dataset.morph));
  const basmala = $('.basmala') ? snapshot($('.basmala'), 'basmala') : null; // drawn like the bio: the wordmark's ink and grain
  const parts = [bio, basmala, ...links, ...marks.map(m => snapshot(m, m.dataset.morph))].filter(p => p && !p.empty);
  const runs = parts.flatMap(p => p.runs);
  if (!runs.length) return;
  const x0 = Math.min(...parts.map(p => p.rect.x)), y0 = Math.min(...parts.map(p => p.rect.y));
  const x1 = Math.max(...parts.map(p => p.rect.x + p.rect.w)), y1 = Math.max(...parts.map(p => p.rect.y + p.rect.h));
  const snap = { runs, rect: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }, blur: 0, opacity: 1, sig: 'footer' };
  const geo = marks.map((m, i) => { const r = m.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, soft: MARKS[i]?.soft || 0 }; });
  const br = basmala && $('.basmala').getBoundingClientRect(); // the basmala takes the word's hover
  const bas = br && { x: br.left + scrollX, y: br.top + scrollY, w: br.width, h: br.height };
  const dots = [...document.querySelectorAll('.foot-dots')].map(c => { const r = c.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; });
  root.classList.toggle('gl-foot', !!gl.setFooter(snap, wordSvg, geo, bas, dots));
}
```


Source: `site/js/gl.js`, lines 390 to 540

```js
  // ---------- wordmark ----------
  let word = null;
  const wordU = {
    sdf: { value: blank }, box: { value: new THREE.Vector4(0, 0, 1, 1) },
    sdfB: { value: blank }, mixB: { value: 0 }, sdfE: { value: blank }, sdfO: { value: blank },
    st: { value: new THREE.Vector4() }, st5: { value: 0 }, reach: { value: 1e4 },
    bar: { value: 0 }, beat: { value: 0 }, cap: { value: 80 }, ghost: { value: 0 }, ripples: { value: 1 }, flowT: { value: 0 },
    kBoil: { value: LIFE.boil }, kCursor: { value: LIFE.cursorGain }, kPitch: { value: LIFE.dotPitch }, kDrift: { value: LIFE.dotDrift },
    kSpacing: { value: LIFE.rippleSpacing }, kRipple: { value: LIFE.rippleAlpha }, kReach: { value: LIFE.rippleReach }, kMeld: { value: LIFE.meld },
    traces: { value: [0, 1, 2, 3].map(() => new THREE.Vector4(0, 0, 0, 0)) },
    cYellow: { value: new THREE.Color(ORB.yellow) }, cRim: { value: new THREE.Color(ORB.rim) },
    time: { value: 0 }, breath: { value: 1 }, thinking: { value: 0 }, aa: { value: 0.4 },
    grain: { value: 0.1 }, ink: { value: 0.15 }, uInk: { value: INK }, uSwell: { value: SWELL }, uFoot: { value: FOOT_INK },
    mouse: { value: new THREE.Vector2(-1e4, -1e4) }, mouseOn: { value: 0 }, mouseR: { value: 90 },
    // the footer (bio + marks) baked into a second field, drawn in the same pass
    frame: { value: new THREE.Vector4(0, 0, 1, 1) }, sdfF: { value: blank }, boxF: { value: new THREE.Vector4(0, 0, 1, 1) },
    basF: { value: new THREE.Vector4() },
    dotR: { value: [0, 1].map(() => new THREE.Vector4()) }, dotB: { value: Array.from({ length: 16 }, () => new THREE.Vector4(0, 0, 0, -1)) },
    hasF: { value: 0 }, kF: { value: FOOT.bio }, kM: { value: FOOT.marks }, aaF: { value: 0.4 },
    marks: { value: [0, 1, 2, 3].map(() => new THREE.Vector4(0, 0, 0, 0)) }, markSoft: { value: new THREE.Vector4() }
  };
  const wordMesh = new THREE.Mesh(quad, new THREE.ShaderMaterial({ vertexShader: QUAD_VERT, fragmentShader: WORD_FRAG, uniforms: wordU, transparent: true, depthTest: false, depthWrite: false }));
  wordMesh.renderOrder = 0; wordMesh.frustumCulled = false; wordMesh.visible = false;
  scene.add(wordMesh);

  // ---------- the footer above the word: bio and marks in the wordmark's pass ----------
  // snap: runs (bio words + mark images) in document px; marks: [{ x, y, w, h, soft }]
  let foot = null;
  const markFocus = [0, 0, 0, 0], markTarget = [0, 0, 0, 0], dotT0 = performance.now();
  function setFooter(snap, anchor, marks = [], bas = null, dots = []) {
    if (lost) return false;
    const pad = 12;
    const box = { x: snap.rect.x - pad, y: snap.rect.y - pad, w: snap.rect.w + pad * 2, h: snap.rect.h + pad * 2 };
    const scale = fitScale(box, Math.min(FOOT.scale, dpr * FOOT.scale), BUDGET.fieldMaxPx); // ~2x for crisp 16px text, if the budget allows
    const mask = rasterize(snap, box, scale, 'mask', null, null, scratch);
    const px = mask.width * mask.height;
    if (!budgetOk(px) || !memOk(px * 2)) { dropFooter(); return false; }
    const rt = buildSDF(mask, scale);
    dropFooter();
    const ar = anchor.getBoundingClientRect();
    const ax = ar.left + window.scrollX, ay = ar.top + window.scrollY;
    foot = { rt, box, scale, off: { x: box.x - ax, y: box.y - ay },
      marks: marks.map(m => ({ x: m.x + m.w / 2 - ax, y: m.y + m.h / 2 - ay, r: Math.max(m.w, m.h) / 2 + 2, soft: m.soft || 0 })),
      bas: bas && { x: bas.x - ax, y: bas.y - ay, w: bas.w, h: bas.h }, // the basmala: the word's hover, at 18px
      dots: dots.slice(0, 2).map(d => ({ x: d.x - ax, y: d.y - ay, w: d.w, h: d.h })) }; // the dot strips, drawn here so they scroll with the rest
    wordU.sdfF.value = rt.texture; wordU.hasF.value = 1; wordU.aaF.value = 0.55 / dpr; wordU.basF.value.set(0, 0, 0, 0);
    wordU.markSoft.value.set(...[0, 1, 2, 3].map(i => foot.marks[i]?.soft || 0));
    needs = true; wake();
    return true;
  }
  function dropFooter() { if (!foot) return; freeField(foot.rt); foot = null; wordU.sdfF.value = blank; wordU.hasF.value = 0; wordU.dotR.value.forEach(v => v.set(0, 0, 0, 0)); }
  function markHover(i, on) { markTarget[i] = on ? 1 : 0; wake(); }

  // the wordmark's extra fields (the hold secret, the per-glyph melt) are built
  // lazily, one per frame, through this queue
  const wordQueue = [];
  function queueWord(kind) {
    if (!word || word[kind] || wordQueue.includes(kind)) return;
    if (kind === 'alt' ? !word.altSnap : !word.extra) return;
    wordQueue.push(kind); wake();
  }
  function buildWord(kind) {
    const i = wordQueue.indexOf(kind); if (i >= 0) wordQueue.splice(i, 1);
    if (!word || word[kind] || lost) return;
    const snap = kind === 'alt' ? word.altSnap : word.extra?.[kind];
    if (!snap) return;
    trimCache(word.px * 2);
    const rt = buildSDF(rasterize(snap, word.box, word.scale, 'mask', null, null, scratch), word.scale);
    word[kind] = rt;
    (kind === 'alt' ? wordU.sdfB : kind === 'even' ? wordU.sdfE : wordU.sdfO).value = rt.texture;
  }
  function drainWordQueue() {
    while (wordQueue.length && word && budgetOk(word.px)) buildWord(wordQueue[0]);
  }
  function dropWord() {
    if (!word) return;
    ['rt', 'alt', 'even', 'odd'].forEach(k => freeField(word[k]));
    wordU.sdf.value = wordU.sdfB.value = wordU.sdfE.value = wordU.sdfO.value = blank;
    wordQueue.length = 0;
    word = null;
  }

  // life: the wordmark eases to a new level; a rise swells it first
  let lifeTarget = 0, lifeShown = 0, lifeInit = false, flowT = 0;
  let traceIds = [], ghostWant = 0;
  function setLife(v) {
    v = Math.max(0, Math.min(1, v));
    if (!lifeInit) { lifeShown = v; lifeInit = true; }
    else if (v > lifeTarget + 0.004) thinkTarget = Math.max(thinkTarget, LIFE.swell);
    lifeTarget = v; wake();
  }
  function setTraces(ids) { traceIds = ids || []; placeTraces(); wake(); }
  function placeTraces() {
    if (!word || !word.glyphs) return;
    const tr = wordU.traces.value;
    tr.forEach(t => t.set(0, 0, 0, 0));
    ghostWant = 0;
    if (LITE) return;
    traceIds.slice(0, 4).forEach((id, i) => {
      const g = word.glyphs[LIFE.traceLetters[id] ?? i];
      if (g) tr[i].set(g.cx + word.dx, g.cy + word.dy, word.cap * LIFE.traceRadius, 1);
    });
    ghostWant = traceIds.includes('hold') ? LIFE.ghostAlpha : 0;
    ensureAlt();
  }
  // snap: a snapshot-like {runs, rect, blur:0, opacity:1}; anchor: the element it follows
  function setWordmark(snap, anchor, extra = null) {
    if (lost) return;
    const pad = 24;
    const box = { x: snap.rect.x - pad, y: snap.rect.y - pad, w: snap.rect.w + pad * 2, h: snap.rect.h + pad * 2 };
    const scale = fitScale(box, Math.min(BUDGET.fieldScale, dpr), BUDGET.fieldMaxPx);
    const altSnap = word?.altSnap || null;
    dropWord();
    const mask = rasterize(snap, box, scale, 'mask', null, null, scratch);
    trimCache(mask.width * mask.height * 2);
    const rt = buildSDF(mask, scale);
    const ar = anchor.getBoundingClientRect();
    word = { rt, box, anchor, scale, px: mask.width * mask.height, alt: null, even: null, odd: null, altSnap, off: { x: box.x - (ar.left + window.scrollX), y: box.y - (ar.top + window.scrollY) } };
    wordU.sdf.value = rt.texture;
    if (extra) {
      word.extra = extra; // the per-glyph fields are built only when life nears stage 4
      word.glyphs = extra.glyphs; word.cap = extra.cap; wordU.cap.value = extra.cap;
      word.dx = 0; word.dy = 0; word.base = { x: box.x, y: box.y };
      placeTraces();
    }
    wordU.aa.value = 0.6 / dpr;
    wordMesh.visible = true;
    needs = true; wake();
  }

  // the hold secret: a second field in the same box, and a mix that runs along the think ease
  let wordMix = { from: 0, to: 0, start: 0, dur: 1 };
  // built lazily: when a hold begins, or when the Arabic ghost is due
  function setWordmarkAlt(snap) { if (!word) return; word.altSnap = snap; freeField(word.alt); word.alt = null; wordU.sdfB.value = blank; ensureAlt(); }
  function ensureAlt() {
    if (!word || word.alt || !word.altSnap) return;
    if (ghostWant > 0 || wordMix.to > 0) queueWord('alt');
  }
  function wordmarkTo(v, dur) {
    if (v > 0 && word && !word.alt) buildWord('alt'); // a deliberate gesture: build it now
    wordMix = { from: wordU.mixB.value, to: v, start: performance.now(), dur: reducedMotion.matches ? 120 : dur };
    wake();
  }
  let hold = 0;
  function setHold(v) { hold = v; if (v > 0) queueWord('alt'); wake(); }
  function thinkUp(v) { thinkTarget = Math.max(thinkTarget, v); wake(); }

  // ---------- the yellow orbs ----------
  const orbs = new Map(); // id -> orb
  const orbCol = (hex) => new THREE.Color(hex);
  const GLOW = ORB.style !== 'dots';
```


## The shaders (verbatim)

Source: `site/js/glsl.js`, lines 1 to 418

```js
// Shared GLSL: simplex noise, fbm, hash, the think ease and the shader sources.
import { THINK_POW, THINK_LINEAR, ORB } from './tokens.js';

export const COMMON = /* glsl */`
#define PI 3.14159265
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){ float a=.5, s=0.; for(int i=0;i<3;i++){ s+=a*snoise(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=.5; } return s/.875; }
// two octaves: for slow, low-frequency warps where the third is under a pixel
float fbm2(vec3 p){ return (.5*snoise(p) + .25*snoise(p*2.03+vec3(1.7,9.2,3.1))) / .75; }
vec2 warp2(vec3 c){ return vec2(snoise(c), snoise(c + vec3(19.1, 3.3, -7.7))); }
float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float thinkEase(float t){ t=clamp(t,0.,1.); float u=2.*t-1.; float s=.5+.5*sign(u)*pow(abs(u),${THINK_POW.toFixed(3)}); return ${THINK_LINEAR.toFixed(3)}*t+${(1 - THINK_LINEAR).toFixed(3)}*s; }
`;

export const QUAD_VERT = /* glsl */`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

export const FS_VERT = /* glsl */`void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;

// Jump flood, in a grow-only pooled RGBA16F pair (js/gl.js). Each texel holds
// the OFFSET to its nearest seed, not the seed's position: offsets are whole
// pixels and stay small where the field matters, so half floats store them
// exactly (to 2048 px). RG: nearest inside pixel, BA: nearest outside pixel.
// res is the region in use (the pool is often larger), texSize the pool.
const JFA_FAR = /* glsl */`
#define FAR 16384.
#define NONE 8192.`;

export const JFA_SEED = /* glsl */`
${JFA_FAR}
uniform sampler2D src; uniform vec2 res;
void main(){
  vec2 p = gl_FragCoord.xy; float a = texture2D(src, p / res).a;
  gl_FragColor = a > 0.5 ? vec4(0., 0., FAR, FAR) : vec4(FAR, FAR, 0., 0.);
}`;

export const JFA_STEP = /* glsl */`
${JFA_FAR}
uniform sampler2D prev; uniform vec2 res, texSize; uniform float stepPx;
void main(){
  vec2 p = gl_FragCoord.xy; vec4 best = texture2D(prev, p / texSize);
  float dI = length(best.xy), dO = length(best.zw);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    if (i == 0 && j == 0) continue;
    vec2 off = vec2(float(i), float(j)) * stepPx;
    vec2 q = p + off;
    if (q.x < 0. || q.y < 0. || q.x > res.x || q.y > res.y) continue;
    vec4 s = texture2D(prev, q / texSize);
    if (s.x < NONE) { vec2 o = s.xy + off; float a = length(o); if (a < dI) { dI = a; best.xy = o; } }
    if (s.z < NONE) { vec2 o = s.zw + off; float b = length(o); if (b < dO) { dO = b; best.zw = o; } }
  }
  gl_FragColor = best;
}`;

// Signed distance in CSS px (negative inside), into a single-channel R16F
// target. Edge pixels use coverage for sub-pixel accuracy.
export const JFA_FINAL = /* glsl */`
uniform sampler2D jfa; uniform sampler2D src; uniform vec2 res, texSize; uniform float invScale;
void main(){
  vec2 p = gl_FragCoord.xy; vec4 s = texture2D(jfa, p / texSize); float a = texture2D(src, p / res).a;
  float dIn = length(s.xy), dOut = length(s.zw);
  float d = a > 0.5 ? -(dOut - 0.5) : (dIn - 0.5);
  if ((a > 0.5 ? dOut : dIn) < 1.01) d = 0.5 - a;
  gl_FragColor = vec4(clamp(d * invScale, -500., 500.), 0., 0., 1.);
}`;

// One morph item: field A to field B, noise peaking mid-flight, blur as a widened edge.
export const ITEM_FRAG = /* glsl */`
${COMMON}
uniform sampler2D sdfA, sdfB, dispA, dispB;
uniform vec4 boxA, boxB, frame;
uniform float hasA, hasB, t, raw, time, amp, bA, bB, oA, oB, grain, seed, aa;
uniform vec2 shift; // same text that moved: both fields travel together
uniform vec3 uInk; // the theme's ink (js/theme.js)
uniform float dots, pitch, blurPeak; // icon toggles: dissolve through a dot matrix mid-flight (0 = off)
varying vec2 vUv;
float fA(vec2 p){ if (hasA < .5) return 24.; return texture2D(sdfA, (p - boxA.xy) / boxA.zw).r; }
float fB(vec2 p){ if (hasB < .5) return 24.; return texture2D(sdfB, (p - boxB.xy) / boxB.zw).r; }
float gA(vec2 p){ if (hasA < .5) return 0.; vec2 u = (p - boxA.xy) / boxA.zw; return (u.x<0.||u.y<0.||u.x>1.||u.y>1.) ? 0. : texture2D(dispA, u).a; }
float gB(vec2 p){ if (hasB < .5) return 0.; vec2 u = (p - boxB.xy) / boxB.zw; return (u.x<0.||u.y<0.||u.x>1.||u.y>1.) ? 0. : texture2D(dispB, u).a; }
void main(){
  vec2 p = frame.xy + vec2(vUv.x, 1. - vUv.y) * frame.zw;
  float env = sin(PI * t);
  float n = amp * env;
  vec3 c = vec3(p * 0.06, time * 0.8 + seed);
  vec2 warp = vec2(fbm(c), fbm(c + vec3(17.3, -9.1, 4.7)));
  vec2 q = p + warp * n;
  float d = mix(fA(q - shift * t), fB(q + shift * (1. - t)), t);
  d += snoise(vec3(p * 0.4, time * 5. + seed)) * 0.2 * n;
  float b = mix(bA, bB, t);
  float w = aa + b * 1.6;
  float a = 1. - smoothstep(-w, w, d + b * 0.9);
  if (dots > 0.) {
    // the icon toggle: mid-flight the shape becomes a halftone. Dots sit on a
    // ~1.75px grid, their centres jittered by the fbm; each dot's radius follows
    // a widened (blurred) coverage of the field, so dots are fattest inside the
    // shape and shrink to nothing past its edge. Crisp at t = 0 and 1.
    float de = env * dots;
    float wd = aa + blurPeak * de;
    float cov = 1. - smoothstep(-wd, wd, d);
    vec2 cell = fract((p + warp * pitch * .4 * de) / pitch) - .5;
    float dotR = pitch * .64 * sqrt(cov);
    float dotA = 1. - smoothstep(dotR - aa, dotR + aa, length(cell) * pitch);
    dotA *= smoothstep(.02, .16, cov); // past the edge the dots shrink to nothing, not to an anti-aliased haze
    a = mix(a, dotA, smoothstep(0., .3, de));
  }
  a *= mix(oA, oB, t);
  float g = hash12(floor(p * 2.) + floor(time * 24.) * 7.31);
  a *= 1. - grain * env * g;
  a = mix(a, gA(p - shift * t), 1. - smoothstep(0., .14, raw));
  a = mix(a, gB(p + shift * (1. - t)), smoothstep(.86, 1., raw));
  gl_FragColor = vec4(uInk, a);
}`;

// Body: line by line, staggered top to bottom. Outgoing lines boil away,
// incoming lines condense from a noisy, wide field to sharp.
export const LINES_FRAG = /* glsl */`
${COMMON}
#define MAXL 64
uniform sampler2D sdfA, sdfB, dispA, dispB;
uniform vec4 boxA, boxB, frame;
uniform float hasA, hasB, elapsed, dur, stagger, inDelay, time, amp, aa, grain, blurMax;
uniform float linesA[MAXL]; uniform float linesB[MAXL];
uniform int nA, nB;
uniform vec3 uInk;
varying vec2 vUv;
float fA(vec2 p){ if (hasA < .5) return 24.; return texture2D(sdfA, (p - boxA.xy) / boxA.zw).r; }
float fB(vec2 p){ if (hasB < .5) return 24.; return texture2D(sdfB, (p - boxB.xy) / boxB.zw).r; }
float gA(vec2 p){ vec2 u = (p - boxA.xy) / boxA.zw; return (hasA<.5||u.x<0.||u.y<0.||u.x>1.||u.y>1.) ? 0. : texture2D(dispA, u).a; }
float gB(vec2 p){ vec2 u = (p - boxB.xy) / boxB.zw; return (hasB<.5||u.x<0.||u.y<0.||u.x>1.||u.y>1.) ? 0. : texture2D(dispB, u).a; }
void main(){
  vec2 p = frame.xy + vec2(vUv.x, 1. - vUv.y) * frame.zw;
  float iA = 0., iB = 0.;
  for (int i = 0; i < MAXL - 1; i++) { if (i >= nA - 1 || p.y <= linesA[i]) break; iA += 1.; }
  for (int i = 0; i < MAXL - 1; i++) { if (i >= nB - 1 || p.y <= linesB[i]) break; iB += 1.; }
  vec3 c = vec3(p * 0.05, time * 0.8);
  vec2 warp = vec2(fbm(c), fbm(c + vec3(17.3, -9.1, 4.7)));
  float boil = snoise(vec3(p * 0.35, time * 5.));

  // outgoing
  float to = clamp((elapsed - iA * stagger * 0.6) / (dur * 0.5), 0., 1.);
  float eo = thinkEase(to);
  float nO = amp * 1.2 * eo;
  float bo = blurMax * eo;
  float dO = fA(p + warp * nO) + boil * 0.25 * nO;
  float wO = aa + bo * 1.6;
  float aO = (1. - smoothstep(-wO, wO, dO + bo * 0.9)) * (1. - smoothstep(.3, 1., to));
  aO = mix(aO, gA(p), 1. - smoothstep(0., .12, to));

  // incoming
  float ti = clamp((elapsed - inDelay - iB * stagger) / dur, 0., 1.);
  float ei = thinkEase(ti);
  float nI = amp * 1.4 * (1. - ei);
  float bi = blurMax * (1. - ei);
  float dI = fB(p + warp * nI) + boil * 0.25 * nI;
  float wI = aa + bi * 1.6;
  float aI = (1. - smoothstep(-wI, wI, dI + bi * 0.9)) * smoothstep(0., .35, ti);
  aI *= 1. - grain * (1. - ei) * hash12(floor(p * 2.) + floor(time * 24.) * 7.31);
  aI = mix(aI, gB(p), smoothstep(.86, 1., ti));

  float a = aO + aI - aO * aI;
  gl_FragColor = vec4(uInk, a);
}`;

// The wordmark: a permanent live field and the visible resonance meter.
// life (0 to 1) layers five stages, each fading in as life*5 goes k-1 to k:
// 1 edge boil, 2 ink halftone in the strokes, 3 iso-line ripples on the bar
// clock, 4 letters melting at the joins with dots flowing along the strokes,
// 5 fully alive; secrets found leave yellow traces and an Arabic ghost.
// Cost: the stages arrive as uniforms (st = stages 1 to 4, st5) worked out once
// on the CPU, so each stage branch is uniform and free until life reaches it.
// Pixels further than 'reach' CSS px from every glyph (js/gl.js works out the
// most the warps, noise and ripples can move an edge) stop after one read.
export const WORD_FRAG = /* glsl */`
${COMMON}
uniform sampler2D sdf, sdfE, sdfO, sdfB; uniform vec4 box;
uniform float mixB;  // the hold secret: salehdigital -> أحمد صالح
uniform float time, breath, thinking, aa, grain, ink, reach;
uniform vec3 uInk, uSwell; // the theme's ink, and the colour it leans to at the peak of a thinking swell
uniform vec3 uFoot; // the footer's colour: the wordmark, bio and marks (the accent in Marathon)
uniform vec2 mouse; uniform float mouseOn, mouseR;
uniform vec4 st; uniform float st5;
uniform float bar, beat, cap, ghost, ripples, flowT;
uniform float kBoil, kCursor, kPitch, kDrift, kSpacing, kRipple, kReach, kMeld;
uniform vec4 traces[4];
uniform vec3 cYellow, cRim;
// the footer above the word (the bio and the four marks), baked into a second
// field and drawn in this same pass, with every stage attenuated by kF / kM
uniform sampler2D sdfF; uniform vec4 boxF, frame; uniform float hasF, kF, kM, aaF;
const vec3 BIO_INK = vec3(1.4, 3., .6); // bio ink edge: pitch /px, amplitude and bleed (x ink)
// the footer takes the word's cursor response, scaled to 18px (the basmala; bio and marks scale
// it in the shader): warp px, melt pitch /px, melt px, and the reach as a share of the word's (mouseR)
const vec4 FOOT_HOVER = vec4(1.2, .14, 1., .42);
// the footer's dot matrix (was js/footdots.js, which stays the DOM fallback): a 4.8px grid
// in each strip whose dots swell inside a few drifting blobs (CPU-placed) and one under the cursor
const float DOT_PITCH = 4.8, DOT_RMAX = 1.7, DOT_RMIN = .45;
const vec3 DOT_INK = vec3(1.4, 2.6, .6);       // rest: edge-noise pitch /px, amplitude and bleed (x ink), as BIO_INK but gentler
const vec4 DOT_HOVER = vec4(.8, .3, .8, .42);  // hover: warp px, melt pitch /px, melt px, reach (x mouseR)
uniform vec4 dotR[2];  // the two strips, document px (z = 0: none)
uniform vec4 dotB[16]; // blobs: xy centre, z radius, w strip (-1: unused)
float sminQ(float a, float b, float k){ float h = max(k - abs(a - b), 0.) / k; return min(a, b) - h * h * k * .25; }
uniform vec4 basF; // the basmala's box, document px (w = 0: none)
uniform vec4 marks[4]; uniform vec4 markSoft; // marks: xy centre, z half-size, w hover focus 0..1
varying vec2 vUv;
float smin(float a, float b, float k){ float h = clamp(.5 + .5 * (b - a) / k, 0., 1.); return mix(b, a, h) - k * h * (1. - h); }
void main(){
  vec2 p = frame.xy + vec2(vUv.x, 1. - vUv.y) * frame.zw;
  float s1 = st.x, s2 = st.y, s3 = st.z, s4 = st.w, s5 = st5;

  // ---- the footer: as crisp as the DOM at life 0; the stages at 25 to 35% ----
  float aF = 0., nearF = 1e3, gF = .5; // gF: the footer's grain (the bio takes the word's full grain)
  if (hasF > .5) {
    float df0 = texture2D(sdfF, (p - boxF.xy) / boxF.zw).r;
    nearF = df0;
    if (df0 < 12.) {
      float inM = 0., soft = 0., bump = 0.;
      for (int i = 0; i < 4; i++) {
        vec4 m = marks[i];
        vec2 dd = abs(p - m.xy);
        if (m.z > 0. && dd.x < m.z && dd.y < m.z) {
          inM = 1.;
          soft = markSoft[i] * .5 + .28 * (1. - m.w); // rest a hair soft, hover sharp
          bump = 4. * m.w * (1. - m.w);             // the hover's little noise, mid-flight
        }
      }
      float k = mix(kF, kM, inM);
      vec3 cf = vec3(p * 0.02, time * 0.08);
      vec2 wf = vec2(snoise(cf), snoise(cf + vec3(5.2, 1.3, 8.1)));
      // warp capped at 0.4px: the faintest breathing at life 0, a little more alive later
      float brf = min(mix(.4, 1.6, inM), breath * (.1 + k * (s1 * .6 + s5 * .4)) + thinking * mix(.3, 1., inM) * k); // marks breathe like the word
      vec2 qf = p + wf * brf;
      // the wordmark's hover on all of it (bio, basmala, marks): under the cursor the outline warps,
      // then melts and bleeds, with the word's easing (mouseOn) and level boost (kCursor), sized per
      // region: 16px bio .6 (its counters are about 2px, so less melt keeps it legible), 18px basmala 1, 20px marks .7 (their fine counters, like the bio's)
      float fB = 0.;
      if (mouseOn > .001) {
        vec2 dm = p - mouse; float rB = mouseR * FOOT_HOVER.w;
        float inB = (basF.z > 0. && all(greaterThan(p, basF.xy - 8.)) && all(lessThan(p, basF.xy + basF.zw + 8.))) ? 1. : 0.;
        float sc = inM > .5 ? .7 : mix(.6, 1., inB);
        fB = exp(-dot(dm, dm) / (rB * rB * (1. + s1 * .5))) * mouseOn * (1. + (kCursor - 1.) * s1) * sc;
        qf += wf.yx * fB * FOOT_HOVER.x;
      }
      float df = texture2D(sdfF, (qf - boxF.xy) / boxF.zw).r;
      if (fB > .002) df += fB * (snoise(vec3(p * FOOT_HOVER.y, time * .7)) * FOOT_HOVER.z - FOOT_HOVER.z * .46);
      df += bump * .45 * snoise(vec3(p * .6, time * 4.));
      // the bio, basmala and marks wear the word's ink: its static edge noise, a hair of bleed and
      // its grain, at a finer pitch for 16 to 20px shapes (the word's .42/px is cut for a 100px cap)
      df += snoise(vec3(p * BIO_INK.x, 3.7)) * ink * BIO_INK.y - ink * BIO_INK.z; gF = 1.6;
      if (s1 > 0.) df += k * s1 * kBoil * mix(.5, 1., inM) * snoise(vec3(p * .35, time * 1.3)); // 1: a quieter boil (full on the marks)
      float w = aaF + soft;
      float solidF = 1. - smoothstep(-w, w, df + soft * .3);
      // 2: dots only in a thin band at the edge, so 16px letterforms never break
      if (s2 > 0.) {
        float band = mix(1. - smoothstep(.12, .55, -df), 1. - smoothstep(.4, 2.2, -df), inM); // marks: halftone reaches inside, like the word
        float cdF = length(fract((p + warp2(cf) * kDrift * s2) / 1.2) - .5) * 1.2;
        float dotsF = 1. - smoothstep(.4 - aaF, .4 + aaF, cdF);
        solidF *= 1. - s2 * k * 1.6 * band * (1. - dotsF);
      }
      aF = solidF;
      // 3: its own faint, short ripples
      if (s3 > 0. && ripples > 0. && df > 0.) {
        float dist = abs(fract(df / 5. - bar + .5) - .5) * 5.;
        aF = max(aF, (1. - smoothstep(.2, .2 + aaF * 1.6, dist)) * exp(-df / 7.) * kRipple * k * s3 * ripples);
      }
    }
  }

  // the dot matrix: the nearest grid dot's radius, read off the blob field at its centre
  float aD = 0.;
  for (int sI = 0; sI < 2; sI++) {
    vec4 R = dotR[sI];
    if (R.z <= 0. || p.x < R.x || p.y < R.y || p.x > R.x + R.z || p.y > R.y + R.w) continue;
    vec2 n = floor(R.zw / DOT_PITCH + 1e-3);
    vec2 o = R.xy + (R.zw - (n - 1.) * DOT_PITCH) * .5;
    vec2 c = o + clamp(floor((p - o) / DOT_PITCH + .5), vec2(0.), n - 1.) * DOT_PITCH;
    float d = 1e5;
    for (int i = 0; i < 16; i++) {
      vec4 b = dotB[i];
      if (b.w != float(sI)) continue;
      vec2 q = c - b.xy;
      d = sminQ(d, length(vec2(q.x * .55, q.y)) - b.z, 10.);
    }
    vec2 mq = mouse - R.xy;
    if (mq.x > -40. && mq.x < R.z + 40. && mq.y > -40. && mq.y < R.w + 40.) d = sminQ(d, length(c - mouse) - 7., 14.);
    float k = 1. - clamp((d + 2.) / 8., 0., 1.);
    float r = DOT_RMIN + (DOT_RMAX - DOT_RMIN) * k * k * (3. - 2. * k);
    // the wordmark's ink on each dot, scaled by its size so the small ones keep the halftone:
    // edge noise and a hair of bleed at rest; under the cursor its warp and melt (the word's easing and level boost)
    float sz = r / DOT_RMAX, fD = 0.;
    vec2 qd = p;
    if (mouseOn > .001) {
      vec2 dm = p - mouse; float rD = mouseR * DOT_HOVER.w;
      fD = exp(-dot(dm, dm) / (rD * rD * (1. + s1 * .5))) * mouseOn * (1. + (kCursor - 1.) * s1);
      qd += vec2(snoise(vec3(p * .05, time * .3)), snoise(vec3(p * .05 + 7.1, time * .3))) * fD * DOT_HOVER.x;
    }
    float dd = length(qd - c) - r;
    dd += (snoise(vec3(p * DOT_INK.x, 3.7)) * DOT_INK.y - DOT_INK.z) * ink * (.4 + .6 * sz);
    if (fD > .002) dd += fD * (snoise(vec3(p * DOT_HOVER.y, time * .7)) - .46) * DOT_HOVER.z * (.5 + .5 * sz);
    aD = (1. - smoothstep(-aaF, aaF, dd)) * (1. - grain * 1.6 * hash12(floor(p * 2.) + floor(time * 15.) * 3.17)); // the bio's grain
  }

  // early out: no edge, ripple or ghost of the word can reach this pixel
  vec2 uv0 = (p - box.xy) / box.zw;
  float d0 = (uv0.x < 0. || uv0.y < 0. || uv0.x > 1. || uv0.y > 1.) ? 1e3 : texture2D(sdf, uv0).r;
  if (ghost > 0. || mixB > 0.) d0 = min(d0, texture2D(sdfB, uv0).r);
  if (d0 > reach) {
    if (aF <= 0. && aD <= 0.) discard;
    gl_FragColor = vec4(uFoot, max(aD, aF * (1. - grain * gF * hash12(floor(p * 2.) + floor(time * 15.) * 3.17))));
    return;
  }
  vec3 c = vec3(p * 0.0045, time * 0.06);
  vec2 warp = vec2(fbm2(c), fbm2(c + vec3(19.1, 3.3, -7.7)));
  float br = breath * (1. + thinking * 2.5) * (1. + s1 * .6 + s5 * .4);
  vec2 q = p + warp * br;
  float cg = 1. + (kCursor - 1.) * s1;
  float fall = 0.;
  if (mouseOn > 0.001) {
    vec2 dm = p - mouse;
    fall = exp(-dot(dm, dm) / (mouseR * mouseR * (1. + s1 * .5))) * mouseOn;
    q += warp.yx * fall * 3. * cg;
  }
  vec2 uv = (q - box.xy) / box.zw;
  float d = texture2D(sdf, uv).r;
  // 4: adjacent letters melt into each other at the joins
  if (s4 > 0.) {
    float k = cap * kMeld * .1 * s4 * (.75 + .25 * sin(time * .6));
    d = mix(d, smin(texture2D(sdfE, uv).r, texture2D(sdfO, uv).r, max(k, .001)), s4);
  }
  if (mixB > 0.) {
    float env = sin(PI * mixB);
    vec2 ub = (q + warp * env * 10. - box.xy) / box.zw;
    d = mix(texture2D(sdf, ub).r, texture2D(sdfB, ub).r, mixB);
    d += snoise(vec3(p * 0.06, time * 2.)) * env * 3.;
  }
  if (fall > .002) d += fall * (snoise(vec3(p * 0.035, time * 0.7)) * 2.4 - 1.1) * cg;
  if (thinking > .01) d += thinking * snoise(vec3(p * 0.05, time * 1.6)) * 1.6;
  d += snoise(vec3(p * 0.42, 3.7)) * ink;                       // static ink edge
  d += breath * 0.35 * snoise(vec3(p * 0.012, time * 0.11));    // edge breathing
  if (s1 > 0.) d += s1 * kBoil * snoise(vec3(p * 0.22, time * 1.3)); // 1: the edge boils
  float solid = 1. - smoothstep(-aa, aa, d);
  float a = solid, cd = 0.;

  // 2: an ink halftone inside the strokes; dots grow with depth, so the
  // letters read as points near their edges. 4: the grid flows along the strokes.
  if (s2 > 0. || ghost > 0. || traces[0].w > 0.) {
    vec2 tang = vec2(0.);
    if (s4 > 0.) {
      vec2 e = vec2(1.5, 0.) / box.zw;
      vec2 g = vec2(texture2D(sdf, uv + e.xy).r - texture2D(sdf, uv - e.xy).r, texture2D(sdf, uv + e.yx).r - texture2D(sdf, uv - e.yx).r);
      tang = normalize(vec2(-g.y, g.x) + 1e-5);
    }
    vec2 gp = p + warp * kDrift * 4. * s2 - tang * flowT * s4;
    cd = length(fract(gp / kPitch) - .5) * kPitch;
    float depth = clamp(-d / max(cap * .055, .5), 0., 1.);
    float dotR = kPitch * (.2 + .42 * depth);
    float dots = (1. - smoothstep(dotR - aa, dotR + aa, cd)) * solid;
    a = mix(solid, dots, s2 * .92);
  }

  // the Arabic ghost left by the hold secret, in the halftone
  if (ghost > 0.) {
    float da = texture2D(sdfB, uv).r;
    float gd = 1. - smoothstep(kPitch * .2 - aa, kPitch * .2 + aa, cd);
    a = max(a, gd * (1. - smoothstep(-aa, aa, da)) * ghost);
  }

  // 3: iso-lines ripple outward like heat or sonar, pulsing on the bar clock
  if (s3 > 0. && ripples > 0. && d > 0.) {
    float dist = abs(fract(d / kSpacing - bar + .5) - .5) * kSpacing;
    float line = 1. - smoothstep(.22, .22 + aa * 1.6, dist);
    float pulse = .55 + .45 * pow(1. - beat, 3.);
    a = max(a, line * exp(-d / kReach) * pulse * kRipple * s3 * ripples * smoothstep(1., 7., nearF)); // they pass around the footer
  }

  a = max(a, aF * (1. - grain * max(0., gF - 1.) * hash12(floor(p * 2.) + floor(time * 15.) * 3.17))); // the bio's extra grain; the word's comes next
  float anyTrace = traces[0].w + traces[1].w + traces[2].w + traces[3].w;
  if (a <= 0. && aD <= 0. && (anyTrace <= 0. || solid <= 0.)) discard;
  a *= 1. - grain * hash12(floor(p * 2.) + floor(time * 15.) * 3.17);
  a = max(a, aD); // the dots carry their own grain

  // 5: traces of found secrets, a yellow dot cluster lodged in a letter
  vec3 col = mix(uFoot, uSwell, smoothstep(.15, 1.2, thinking) * .85);
  for (int i = 0; i < 4; i++) {
    vec4 tr = traces[i];
    if (tr.w <= 0.) continue;
    float m = (1. - smoothstep(tr.z * .55, tr.z, length(p - tr.xy))) * tr.w * solid;
    float yd = 1. - smoothstep(kPitch * .34 - aa, kPitch * .34 + aa, cd);
    col = mix(col, mix(cRim, cYellow, yd), m);
    a = max(a, m * .95);
  }
  gl_FragColor = vec4(col, a);
}`;
```


## Raster and snapshot

Source: `site/js/raster.js`, whole file

```js
// Snapshots of real DOM text (exact font, size, tracking and position, word by
// word from DOM ranges) and their rasterisation to offscreen 2D canvases.

const mctx = document.createElement('canvas').getContext('2d');
const ascents = new Map();
const HAS_LS = 'letterSpacing' in mctx;

export function fontOf(cs) {
  return `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
}

const caps = new Map();
export function capHeightOf(font) {
  let c = caps.get(font);
  if (c == null) { mctx.font = font; c = mctx.measureText('H').actualBoundingBoxAscent; caps.set(font, c); }
  return c;
}

export function ascentOf(font) {
  let a = ascents.get(font);
  if (a == null) {
    mctx.font = font;
    const m = mctx.measureText('Hxg');
    a = m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent;
    ascents.set(font, a);
  }
  return a;
}

function parseBlur(filter) {
  const m = /blur\(([\d.]+)px\)/.exec(filter || '');
  return m ? parseFloat(m[1]) : 0;
}

const range = document.createRange();

// Image runs: an element with data-mask-src (the footer marks) is snapshotted
// as its picture, so it can resolve through the field like text does.
const images = new Map();
export function preloadMask(src) {
  if (images.has(src)) return images.get(src);
  const img = new Image(); img.decoding = 'async'; img.src = src;
  images.set(src, img);
  return img;
}

// clip: {top, bottom} in document px; words outside are skipped (long bodies)
export function snapshot(el, key, clip = null) {
  const cs = getComputedStyle(el);
  const sx = window.scrollX, sy = window.scrollY;
  if (el.dataset.maskSrc) {
    const br = el.getBoundingClientRect();
    const img = preloadMask(el.dataset.maskSrc);
    const rect = { x: br.left + sx, y: br.top + sy, w: br.width, h: br.height };
    const ok = img.complete && img.naturalWidth > 0;
    return {
      key, el, rect, runs: ok ? [{ img: el.dataset.maskSrc, x: rect.x, y: rect.y, w: rect.w, h: rect.h, a: 1, top: rect.y, bottom: rect.y + rect.h }] : [],
      sig: `img|${el.dataset.maskSrc}|${rect.w.toFixed(2)}|${rect.h.toFixed(2)}`,
      blur: parseBlur(cs.filter), opacity: parseFloat(cs.opacity), empty: !ok
    };
  }
  const runs = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  while ((n = walker.nextNode())) {
    const parent = n.parentElement;
    if (!parent || parent.closest('.sr-only')) continue;
    const pcs = parent === el ? cs : getComputedStyle(parent);
    if (pcs.display === 'none' || pcs.visibility === 'hidden') continue;
    const font = fontOf(pcs);
    const ls = parseFloat(pcs.letterSpacing) || 0;
    const wt = parseFloat(pcs.webkitTextStrokeWidth || pcs.getPropertyValue('-webkit-text-stroke-width')) || 0;
    const asc = ascentOf(font);
    let alpha = 1;
    for (let p = parent; p && p !== el; p = p.parentElement) alpha *= parseFloat(getComputedStyle(p).opacity);
    const re = /\S+/g; let m;
    while ((m = re.exec(n.data))) {
      range.setStart(n, m.index); range.setEnd(n, m.index + m[0].length);
      const rects = range.getClientRects();
      if (!rects.length) continue;
      // a word broken across lines (at a hyphen, say) becomes one piece per line
      const pieces = [];
      if (rects.length === 1) pieces.push({ t: m[0], r: rects[0] });
      else {
        let cur = null;
        for (let k = 0; k < m[0].length; k++) {
          range.setStart(n, m.index + k); range.setEnd(n, m.index + k + 1);
          const cr = range.getBoundingClientRect();
          if (!cr.width && !cr.height) continue;
          if (cur && Math.abs(cr.top - cur.r.top) < 2) { cur.t += m[0][k]; cur.right = cr.right; }
          else { cur = { t: m[0][k], r: cr, right: cr.right }; pieces.push(cur); }
        }
        pieces.forEach(pc => { pc.r = { left: pc.r.left, top: pc.r.top, bottom: pc.r.bottom, right: pc.right }; });
      }
      for (const { t: word, r } of pieces) {
        const top = r.top + sy, bottom = r.bottom + sy;
        if (clip && (bottom < clip.top || top > clip.bottom)) continue;
        runs.push({ t: word, x: r.left + sx, y: top + asc, top, bottom, font, ls, a: alpha, wt });
        minX = Math.min(minX, r.left + sx); maxX = Math.max(maxX, r.right + sx);
        minY = Math.min(minY, top); maxY = Math.max(maxY, bottom);
      }
    }
  }
  const br = el.getBoundingClientRect();
  const rect = runs.length
    ? { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
    : { x: br.left + sx, y: br.top + sy, w: br.width, h: br.height };
  const sig = runs.map(r => `${r.t}|${(r.x - rect.x).toFixed(2)}|${(r.y - rect.y).toFixed(2)}|${r.font}|${r.ls}|${r.a}|${r.wt}`).join('~');
  return {
    key, el, runs, rect, sig,
    blur: parseBlur(cs.filter),
    opacity: parseFloat(cs.opacity),
    empty: runs.length === 0
  };
}

// Lines for staggered body resolves: tops grouped within 3px.
export function linesOf(snap) {
  const lines = [];
  for (const r of snap.runs) {
    let l = lines.find(L => Math.abs(L.top - r.top) < 3);
    if (!l) { l = { top: r.top, bottom: r.bottom }; lines.push(l); }
    l.bottom = Math.max(l.bottom, r.bottom);
  }
  lines.sort((a, b) => a.top - b.top);
  // boundaries between consecutive lines, document px
  const bounds = [];
  for (let i = 0; i < lines.length - 1; i++) bounds.push((lines[i].bottom + lines[i + 1].top) / 2);
  return { count: lines.length, bounds };
}

// box: {x, y, w, h} document px. mode 'mask' (sharp, opaque: SDF source) or
// 'display' (as the DOM shows it: opacity and blur).
// into: a scratch canvas to reuse (js/gl.js uploads it at once), so a morph
// never leaves big 2D canvases waiting on garbage collection.
export function rasterize(snap, box, scale, mode, blurOverride = null, opacityOverride = null, into = null) {
  const c = into || document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(box.w * scale));
  c.height = Math.max(1, Math.ceil(box.h * scale));
  const ctx = c.getContext('2d');
  ctx.setTransform(scale, 0, 0, scale, -box.x * scale, -box.y * scale);
  ctx.fillStyle = '#000';
  ctx.textBaseline = 'alphabetic';
  const display = mode === 'display';
  const blur = display ? (blurOverride ?? snap.blur) : 0;
  const op = display ? (opacityOverride ?? snap.opacity) : 1;
  if (blur > 0.05) ctx.filter = `blur(${(blur * scale).toFixed(2)}px)`;
  for (const r of snap.runs) {
    if (r.img) { ctx.globalAlpha = display ? r.a * op : 1; ctx.drawImage(images.get(r.img), r.x, r.y, r.w, r.h); continue; }
    ctx.font = r.font;
    ctx.globalAlpha = display ? r.a * op : 1;
    ctx.direction = r.dir || 'ltr'; ctx.textAlign = 'left';
    if (HAS_LS) {
      ctx.letterSpacing = `${r.ls}px`;
      ctx.fillText(r.t, r.x, r.y);
      if (r.wt) { ctx.lineWidth = r.wt; ctx.strokeStyle = '#000'; ctx.lineJoin = 'round'; ctx.strokeText(r.t, r.x, r.y); }
    } else {
      let x = r.x;
      for (const ch of r.t) { ctx.fillText(ch, x, r.y); x += ctx.measureText(ch).width + r.ls; }
    }
  }
  return c;
}
```
