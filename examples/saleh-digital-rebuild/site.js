// saleh.digital rebuild: the small scripts the harness specifies.
// Grain: foundations/materials/texture.md. Wordmark fit + dot strips: components/patterns/footer.md.
// Flow wires: components/patterns/harness-flow.md. Phone menu: components/patterns/navigation.md.

document.documentElement.style.setProperty('--sbw', innerWidth - document.documentElement.clientWidth + 'px');

// ---- grain ----
const TILE = 256, FPS = 12, GRAIN_K = 0.45;
function makeTile(ink = [0, 0, 0], paper = [1, 1, 1]) {
  const I = ink.map(v => Math.round(v * 255)), P = paper.map(v => Math.round(v * 255));
  const c = document.createElement('canvas'); c.width = c.height = TILE;
  const x = c.getContext('2d'), img = x.createImageData(TILE, TILE), d = img.data;
  const half = TILE / 2, coarse = new Float32Array(half * half);
  for (let i = 0; i < coarse.length; i++) coarse[i] = Math.random();
  for (let y = 0; y < TILE; y++) for (let xx = 0; xx < TILE; xx++) {
    const g = Math.random(), g2 = coarse[(y >> 1) * half + (xx >> 1)];
    const v = g * 0.8 + g2 * 0.2, light = g >= 0.93;
    const a = light ? 2.2 * GRAIN_K : GRAIN_K * Math.pow(v, 1.7);
    const i = (y * TILE + xx) * 4, col = light ? P : I;
    d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = Math.round(Math.min(1, a) * 255);
  }
  x.putImageData(img, 0, 0);
  return c;
}
function startGrain() {
  const el = document.createElement('div'); el.id = 'grain'; el.setAttribute('aria-hidden', 'true');
  document.body.append(el);
  el.style.backgroundImage = `url(${makeTile().toDataURL()})`;
  // a theme change re-makes the tile in the new ink and paper (foundations/themes.md, js/grain.js)
  window.__sdRetint = (ink, paper) => { el.style.backgroundImage = `url(${makeTile(ink, paper).toDataURL()})`; document.querySelectorAll('.foot-dots').forEach(drawDots); };
  const dpr = window.devicePixelRatio || 1, t = TILE / dpr;
  el.style.backgroundSize = `${t}px ${t}px`;
  el.style.width = `calc(100vw + ${t}px)`; el.style.height = `calc(100vh + ${t}px)`;
  const jump = () => { const ox = Math.floor(Math.random() * TILE) / dpr, oy = Math.floor(Math.random() * TILE) / dpr;
    el.style.transform = `translate3d(${-ox}px, ${-oy}px, 0)`; };
  jump();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(jump, 1000 / FPS);
}
startGrain();

// ---- wordmark ----
const wm = document.querySelector('.wordmark');
function fitWordmark(svg) {
  const W = document.documentElement.clientWidth, side = 6, top = W < 900 ? 8 : 6;
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = '400 100px "Kult Luxury", "Times New Roman", serif';
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

// ---- footer dot strips: one frame of the recipe ----
function drawDots(cv, R) {
  const r0 = cv.getBoundingClientRect(), s = r0.width, h = r0.height; if (!s || !h) return;
  const dpr = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(s * dpr); cv.height = Math.round(h * dpr);
  const a = cv.getContext('2d'); a.setTransform(dpr, 0, 0, dpr, 0, 0); a.fillStyle = getComputedStyle(cv).color;
  const u = 4.8, big = 1.7, small = .45, time = 0;
  const smin = (p, q, k) => { const e = Math.max(k - Math.abs(p - q), 0) / k; return Math.min(p, q) - e * e * k * .25; };
  const sdf = (x, y) => { let e = 1e9; const C = Math.max(2, Math.round(s / 140));
    for (let m = 0; m < C; m++) { const l = m * 2.399 + R * 1.3, f = ((m + .5) / C + .06 * Math.sin(time * .21 + l)) * s,
      M = h * (.5 + .35 * Math.sin(time * .33 + l * 1.7)), p = 5 + 4 * (.5 + .5 * Math.sin(time * .27 + l * .9));
      e = smin(e, Math.hypot((x - f) * .55, y - M) - p, 10); }
    return e; };
  const n = Math.floor(s / u), rows = Math.floor(h / u), ox = (s - (n - 1) * u) / 2, oy = (h - (rows - 1) * u) / 2;
  a.beginPath();
  for (let j = 0; j < rows; j++) for (let i = 0; i < n; i++) { const X = ox + i * u, Y = oy + j * u;
    const g = 1 - Math.min(1, Math.max(0, (sdf(X, Y) + 2) / 8)), r = small + (big - small) * g * g * (3 - 2 * g);
    a.moveTo(X + r, Y); a.arc(X, Y, r, 0, Math.PI * 2); }
  a.fill();
}

// ---- harness flow wires ----
const SVGNS = 'http://www.w3.org/2000/svg';
const FLOW = {
  after: { name: 'With a harness', idle: 'People fine-tune the harness, not the output. Every decision is kept, so each design starts further along than the last.',
    steps: [['prompt', 'Prompt'], ['harness', 'Harness'], ['agent', 'Agent'], ['design', 'Design'], ['complete', 'Design complete']],
    loops: [{ from: 'design', to: 'agent', side: 'below', label: 'moves: steer, concept, tune, comment' },
            { from: 'complete', to: 'harness', side: 'above', label: 'fine-tune the harness: decisions kept as records' }] },
  before: { name: 'Without a harness', idle: 'People fine-tune each output by hand. Nothing they decide is kept, so the next design starts from zero.',
    steps: [['prompt', 'Prompt'], ['agent', 'Agent'], ['design', 'Design'], ['complete', 'Design complete']],
    loops: [{ from: 'design', to: 'prompt', side: 'below', label: 'fine-tune the output, again and again' }] },
};
function mountFlow(fig) {
  const canvas = fig.querySelector('.hf-canvas'), row = fig.querySelector('.hf-row'), labels = fig.querySelector('.hf-labels');
  let svg = canvas.querySelector('.hf-wires');
  if (!svg) { svg = document.createElementNS(SVGNS, 'svg'); svg.setAttribute('class', 'hf-wires'); svg.setAttribute('aria-hidden', 'true'); canvas.prepend(svg); }
  let state = 'after';
  const head = (e, t) => { const n = Math.sign(e[0] - t[0]), r = Math.sign(e[1] - t[1]), o = 5, i = 3.5, gx = e[0] - n * o, gy = e[1] - r * o;
    return ` M${gx + r * i} ${gy - n * i} L${e[0]} ${e[1]} L${gx - r * i} ${gy + n * i}`; };
  const path = (d, cls) => { const p = document.createElementNS(SVGNS, 'path'); p.setAttribute('d', d); p.setAttribute('class', cls); svg.append(p); };
  const line = pts => 'M' + pts.map(p => p.join(' ')).join(' L');
  function build() {
    const S = FLOW[state];
    row.replaceChildren(...S.steps.map(([k, t]) => { const c = document.createElement('div'); c.className = `hf-card hf-${k}`; c.dataset.key = k;
      c.tabIndex = 0; c.setAttribute('role', 'group'); c.setAttribute('aria-label', t);
      c.innerHTML = `<span class="hf-ico"></span><span class="hf-title">${t}</span>`; return c; }));
    fig.querySelectorAll('.hf-tab').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.state === state)));
    fig.querySelector('.hf-def-name').textContent = S.name; fig.querySelector('.hf-def-text').textContent = S.idle;
    draw();
  }
  function draw() {
    const W = canvas.clientWidth, H = canvas.clientHeight, cr = canvas.getBoundingClientRect(), o = 4;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', W); svg.setAttribute('height', H); svg.replaceChildren(); labels.replaceChildren();
    const S = FLOW[state], keys = S.steps.map(s => s[0]);
    const box = Object.fromEntries(keys.map(k => { const el = row.querySelector(`.hf-${k}`), r = el.getBoundingClientRect();
      return [k, { x: r.left - cr.left, y: r.top - cr.top, w: el.offsetWidth, h: el.offsetHeight }]; }));
    const narrow = matchMedia('(max-width: 599px)').matches, first = box[keys[0]];
    for (let i = 0; i < keys.length - 1; i++) { const a = box[keys[i]], b = box[keys[i + 1]];
      const pts = narrow ? [[first.x + first.w / 2, a.y + a.h + o], [first.x + first.w / 2, b.y - o]]
                         : [[a.x + a.w + o, first.y + first.h / 2], [b.x - o, first.y + first.h / 2]];
      path(line(pts) + head(pts[1], pts[0]), 'hf-wire'); }
    S.loops.forEach((L, n) => { const a = box[L.from], b = box[L.to]; let pts;
      if (narrow) { const X = a.x + a.w + 14 + n * 14; pts = [[a.x + a.w + o, a.y + a.h / 2], [X, a.y + a.h / 2], [X, b.y + b.h / 2], [b.x + b.w + o, b.y + b.h / 2]]; }
      else { const below = L.side === 'below', y0 = below ? a.y + a.h + o : a.y - o, y1 = below ? b.y + b.h + o : b.y - o, Y = below ? a.y + a.h + 30 : a.y - 30,
        ax = a.x + a.w / 2, bx = b.x + b.w / 2; pts = [[ax, y0], [ax, Y], [bx, Y], [bx, y1]];
        const s = document.createElement('span'); s.className = `hf-label ${below ? 'is-below' : 'is-above'}`; s.textContent = L.label;
        s.style.left = `${(ax + bx) / 2}px`; s.style.top = `${Y}px`; labels.append(s); }
      path(line(pts), 'hf-wire hf-dots'); path(head(pts[3], pts[2]).trim(), 'hf-wire'); });
  }
  fig.querySelectorAll('.hf-tab').forEach(b => b.addEventListener('click', () => { if (b.dataset.state !== state) { state = b.dataset.state; build(); } }));
  build();
  new ResizeObserver(() => requestAnimationFrame(draw)).observe(canvas);
  document.fonts?.ready?.then(draw);
}

// ---- phone menu sheet ----
const btn = document.querySelector('.nav-btn'), sheet = document.getElementById('nav-sheet');
if (btn && sheet) {
  sheet.querySelector('.nav-sheet-list').innerHTML = document.getElementById('nav').innerHTML;
  btn.addEventListener('click', () => { sheet.showModal(); btn.setAttribute('aria-expanded', 'true'); });
  sheet.addEventListener('close', () => btn.setAttribute('aria-expanded', 'false'));
  sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
}

function layout() { if (wm) fitWordmark(wm); document.querySelectorAll('.foot-dots').forEach(drawDots); }
document.querySelectorAll('.hf-fig').forEach(mountFlow);
layout();
document.fonts?.ready?.then(layout);
addEventListener('resize', layout);
