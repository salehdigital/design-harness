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

// the wordmark plays: a note per letter crossed (foundations/motion/hidden-extras.md › Playing the wordmark)
const wm = document.querySelector('.wordmark');
if (wm) {
  const WORD = 'salehdigital', mctx = document.createElement('canvas').getContext('2d');
  let last = -1, lx = 0, lt = 0;
  const centres = () => {
    const t = wm.querySelector('text'), r = wm.getBoundingClientRect();
    const fs = parseFloat(t.getAttribute('font-size')), x0 = parseFloat(t.getAttribute('x'));
    mctx.font = `400 ${fs}px "Kult Luxury", "Times New Roman", serif`;
    return [...WORD].map((ch, i) => r.left + x0 + mctx.measureText(WORD.slice(0, i)).width + mctx.measureText(ch).width / 2);
  };
  wm.addEventListener('pointermove', (e) => {
    const cs = centres(); let best = 0, bd = Infinity;
    cs.forEach((c, i) => { const d = Math.abs(c - e.clientX); if (d < bd) { bd = d; best = i; } });
    const t = performance.now(), speed = Math.min(1, Math.abs(e.clientX - lx) / Math.max(1, t - lt) / 2); lx = e.clientX; lt = t;
    if (best === last) return; last = best;
    bus.emit('wordmark:letter', { index: best, total: WORD.length, ch: WORD[best], speed, source: e.pointerType });
  });
  wm.addEventListener('pointerleave', () => { last = -1; });
}

// a console handle for checking it all by hand
window.salehdigital = { bus, audio, setTheme, PALETTE, readColors, streamIn };

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
