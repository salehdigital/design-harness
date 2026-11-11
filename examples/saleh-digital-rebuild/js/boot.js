// saleh.digital rebuild: wires the harness's own modules (js/*.js, generated from the
// records by tools/from-harness.py) into the static pages. Hand-written; each step names its record.
import { bus } from './state.js';
import { onTheme, readColors, setTheme, PALETTE } from './theme.js';   // foundations/themes.md
import { audio } from './audio.js';                                   // foundations/sound/sound.md
import './haptics.js';                                                 // foundations/sound/sound.md › Haptics
import { streamIn } from './stream.js';                                // foundations/motion/streaming.md

// theme: the grain and the footer dot strips re-tint on every theme:change (foundations/themes.md)
onTheme((c) => { window.__sdRetint?.(c.ink, c.paper); });

// streaming: the post writes itself on arrival (foundations/motion/streaming.md › When it runs)
const article = document.getElementById('article');
const meta = document.querySelector('.post-meta');
if (article && !document.querySelector('.settings-root')) {
  meta?.classList.add('is-away');
  streamIn(article, 'load');
}
bus.on('stream:end', () => requestAnimationFrame(() => meta?.classList.remove('is-away')));

// sound: the route's chord (resolve:start carries the section slug; foundations/sound/sound.md › Harmony)
const section = document.documentElement.dataset.section || 'articles';
bus.emit('resolve:start', { id: 0, kind: 'load', dur: 0, section: 0, item: 0, sectionSlug: section });

// hover: menu items and icon buttons emit 'hover' (the droplet; foundations/motion/resolve.md › Hover and focus)
document.querySelectorAll('.item, .meta-ico, .warm').forEach((a) => {
  a.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') { a.classList.add('is-peek'); bus.emit('hover', { el: a, source: e.pointerType }); } });
  a.addEventListener('pointerleave', () => a.classList.remove('is-peek'));
  a.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') bus.emit('hover', { el: a, source: 'touch' }); });
});

// the wordmark: the GL layer, its fit, the footer pass, and the hold and letter hooks, all the site's own code
// (js/wordmark.js and js/gl.js, generated from foundations/motion/webgl*.md)
import { bootGL, glHandle } from './wordmark.js';
const wm = document.querySelector('.wordmark');
const glReady = bootGL();

// a console handle for checking it all by hand
window.salehdigital = { bus, audio, setTheme, PALETTE, readColors, streamIn, get gl() { return glHandle(); } };

// ?selftest: drive the real event paths headlessly and print what fired (used by shoot.sh)
if (new URLSearchParams(location.search).has('selftest')) {
  const log = { streamed: false, themes: [], sounds: [] };
  bus.on('stream:end', () => { log.streamed = true; });
  bus.on('sound:play', (d) => log.sounds.push(d.id));
  addEventListener('theme:change', () => log.themes.push(document.documentElement.dataset.theme + (document.documentElement.dataset.accent ? '/' + document.documentElement.dataset.accent : '')));
  setTimeout(() => {
    const item = document.querySelector('#nav .item:not(.is-active)');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));                  // the unlock gesture
    item.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' })); // press
    item.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));       // hover droplet
    const r = wm?.getBoundingClientRect();
    if (r) [0.1, 0.5, 0.9].forEach((f, i) => setTimeout(() => wm.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + r.width * f, clientY: r.top + 20, pointerType: 'mouse' })), 300 + i * 60));
    setTimeout(() => { setTheme('dark', null); setTheme('marathon-light', 'cyan'); setTheme(null); }, 600);
  }, 400);
  setTimeout(() => {
    const pre = document.createElement('pre'); pre.id = 'selftest';
    pre.textContent = JSON.stringify({ ...log, audio: audio.status() });
    document.body.append(pre);
  }, 2500);
}

// ?selftest=gl: does the wordmark really render through WebGL? Reads the #gl canvas back and counts
// non-transparent pixels inside the wordmark's box. (Test only: the drawing buffer is kept so it can be read.)
if (new URLSearchParams(location.search).get('selftest') === 'gl') {
  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    return orig.call(this, type, this.id === 'gl' && /webgl/.test(type) ? { ...attrs, preserveDrawingBuffer: true } : attrs);
  };
  glReady.then((gl) => { scrollTo(0, document.documentElement.scrollHeight); setTimeout(() => {
    const out = { gl: !!gl, htmlGl: document.documentElement.classList.contains('gl'), glFoot: document.documentElement.classList.contains('gl-foot') };
    const cv = document.getElementById('gl');
    const ctx = cv.getContext('webgl2');
    out.webgl2 = !!ctx; out.renderer = ctx && ctx.getParameter(ctx.RENDERER);
    const W = cv.width, H = cv.height, k = W / cv.clientWidth;
    const c2 = document.createElement('canvas'); c2.width = W; c2.height = H;
    const x = c2.getContext('2d'); x.drawImage(cv, 0, 0);
    const px = x.getImageData(0, 0, W, H).data;
    const count = (r) => { let n = 0; for (let y = Math.max(0, r.y0); y < Math.min(H, r.y1); y++) for (let i = Math.max(0, r.x0); i < Math.min(W, r.x1); i++) if (px[(y * W + i) * 4 + 3] > 8) n++; return n; };
    const wr = wm.getBoundingClientRect();
    const box = { x0: Math.floor(wr.left * k), x1: Math.ceil(wr.right * k), y0: Math.floor(wr.top * k), y1: Math.ceil(wr.bottom * k) };
    out.canvas = [W, H]; out.wordmarkBox = box;
    out.wordmarkPixels = count(box); out.wordmarkArea = (box.x1 - box.x0) * Math.max(0, Math.min(H, box.y1) - Math.max(0, box.y0));
    const fr = document.querySelector('.foot-row').getBoundingClientRect();
    out.footerPixels = count({ x0: Math.floor(fr.left * k), x1: Math.ceil(fr.right * k), y0: Math.floor(fr.top * k), y1: Math.ceil(fr.bottom * k) });
    out.allPixels = count({ x0: 0, x1: W, y0: 0, y1: H });
    out.wordmarkFont = getComputedStyle(wm.querySelector('text')).fontFamily;
    out.kultLoaded = document.fonts.check('100px "Kult Luxury"');
    out.stats = gl?.stats();
    const pre = document.createElement('pre'); pre.id = 'selftest-gl'; pre.textContent = JSON.stringify(out); document.body.append(pre);
  }, 2500); });
}
