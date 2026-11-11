// The Settings page of the rebuild: the site's own settingsBody (js/settings.js, from
// templates/settings.md) mounted into the static shell. ?page=theme|sound|mcp picks the page.
import { settingsBody } from './settings.js';
import { streamIn } from './stream.js';
import './boot.js';

const page = new URLSearchParams(location.search).get('page') || 'theme';
const item = { slug: ['theme', 'sound', 'mcp'].includes(page) ? page : 'theme', section: {} };
// the small kit Settings › MCP borrows from the app (copy icons; templates/settings.md)
const kit = {
  setIcon: (el, key) => { el.dataset.icon = key; el.classList.toggle('is-ok', key === 'copied'); },
  iconTo: (el, key) => { el.dataset.icon = key; el.classList.toggle('is-ok', key === 'copied'); },
  bindIcon: () => {}, announce: () => {}, holdMs: () => 380 + 1600,
};
const root = document.querySelector('.settings-root');
root.replaceChildren(...settingsBody(item, kit));
document.querySelectorAll('#sub .item').forEach(a => {
  const on = a.dataset.page === item.slug;
  a.classList.toggle('is-active', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
});
document.querySelector('#article h1').textContent = `${item.slug[0].toUpperCase() + item.slug.slice(1)}, Settings`;
if (item.slug === 'mcp') streamIn(root, 'load');
// the controls glide in (foundations/motion/resolve.md › flowIn)
if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
  [...root.querySelectorAll('.settings:not(.settings-mcp) > *')].slice(0, 14).forEach((el, i) => el.animate([
    { opacity: 0, transform: 'translateY(6px)', filter: 'blur(4px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }
  ], { duration: 240, delay: Math.min(i, 8) * 22, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'backwards' }));
