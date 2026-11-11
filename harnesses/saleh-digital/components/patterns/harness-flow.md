---
title: Harness flow
slug: harness-flow
status: published
description: The Before / After figure in "What is a design harness?". A black segmented switch, a row of outlined cards joined by arrows, dotted loops with labels, and a caption that defines the hovered card.
chips:
  - Embed ::harness-flow
  - Switch 34 tall
  - Cards 42 tall
  - Loops dotted 6px
created: 2026-11-11T18:00:00Z
updated: 2026-11-11T18:00:00Z
---

A classic black-and-white flowchart that sits straight on the page's paper. It is a full-width embed: on desktop it breaks out of the 540px column to `min(820px, …)` (see foundations/layout-grid.md). It opens on **After**.

## Markup

```html
<div class="embed embed-harness-flow" data-embed="harness-flow">
  <figure class="hf-fig">
    <div class="hf-toggle" role="group" aria-label="Show the work before or after a design harness">
      <button class="hf-tab" type="button" data-state="before" aria-pressed="false">Before</button>
      <button class="hf-tab" type="button" data-state="after" aria-pressed="true">After</button>
    </div>
    <div class="hf-canvas">
      <svg class="hf-wires" aria-hidden="true"><!-- arrows and loops, drawn from the card boxes --></svg>
      <div class="hf-row" data-state="after">
        <div class="hf-card hf-prompt"   tabindex="0" role="group" aria-label="Prompt"><span class="hf-ico"><!-- icon --></span><span class="hf-title">Prompt</span></div>
        <div class="hf-card hf-harness"  tabindex="0" role="group" aria-label="Harness"><span class="hf-ico"></span><span class="hf-title">Harness</span></div>
        <div class="hf-card hf-agent"    tabindex="0" role="group" aria-label="Agent"><span class="hf-ico"></span><span class="hf-title">Agent</span></div>
        <div class="hf-card hf-design"   tabindex="0" role="group" aria-label="Design"><span class="hf-ico"></span><span class="hf-title">Design</span></div>
        <div class="hf-card hf-complete" tabindex="0" role="group" aria-label="Design complete"><span class="hf-ico"></span><span class="hf-title">Design complete</span></div>
      </div>
      <div class="hf-labels">
        <span class="hf-label is-below">moves: steer, concept, tune, comment</span>
        <span class="hf-label is-above">fine-tune the harness: decisions kept as records</span>
      </div>
    </div>
    <figcaption class="hf-def" id="hf-def" aria-live="polite">
      <span class="hf-def-name">With a harness</span>
      <span class="hf-def-text">People fine-tune the harness, not the output. Every decision is kept, so each design starts further along than the last.</span>
    </figcaption>
  </figure>
</div>
```

Icons are 16px filled glyphs (comment, cube, sparkles, browser, shield-check) from **Amicons**, a commercial set (https://amicons.design/). They are not in this harness: license Amicons yourself, or leave `.hf-ico` as an empty 16px slot so the cards keep their live widths. Never copy Amicons path data.

## Content

| State | Cards | Loops (from → to, side, label) | Idle caption |
| --- | --- | --- | --- |
| After | Prompt, Harness, Agent, Design, Design complete | Design → Agent below "moves: steer, concept, tune, comment"; Design complete → Harness above "fine-tune the harness: decisions kept as records" | **With a harness.** People fine-tune the harness, not the output. Every decision is kept, so each design starts further along than the last. |
| Before | Prompt, Agent, Design, Design complete | Design → Prompt below "fine-tune the output, again and again" | **Without a harness.** People fine-tune each output by hand. Nothing they decide is kept, so the next design starts from zero. |

Hovering, focusing or clicking a card lights it (2px ring), lights its wires, and swaps the caption to that card's name and definition.

## CSS (css/embeds/harness-flow.css, as shipped)

```css
.embed-harness-flow { margin: calc(var(--para) * 0.5) 0; }
.hf-fig { margin: 0; display: flex; flex-direction: column; gap: 12px; }
.hf-canvas { position: relative; padding: 48px 0 48px; color: var(--ink); font: 400 14px/18px var(--ui); letter-spacing: -0.3px; }
.hf-wires { position: absolute; inset: 0; pointer-events: none; overflow: visible; }
.hf-labels { position: absolute; inset: 0; pointer-events: none; z-index: 2; }
.hf-row { position: relative; z-index: 1; display: flex; align-items: center; gap: 36px; }
.hf-card { display: flex; align-items: center; justify-content: center; gap: 6px; flex: none; min-width: 0; height: 34px; padding: 0 10px;
  border-radius: 8px; font-size: 13px; color: var(--ink); box-shadow: 0 0 0 1px var(--ink); outline: none; cursor: default;
  transition: box-shadow 160ms var(--ease-land); }
.hf-card.is-lit { box-shadow: 0 0 0 2px var(--ink); }
.hf-harness { box-shadow: 0 0 0 1.5px var(--ink); font-weight: 500; }
.hf-ico, .hf-ico svg { flex: none; display: grid; place-items: center; width: 14px; height: 14px; }
.hf-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hf-wire { fill: none; stroke: var(--ink); stroke-width: 1; stroke-linecap: round; stroke-linejoin: round; }
.hf-wire.is-lit { stroke-width: 2; }
.hf-dots { stroke-dasharray: 0 6; stroke-width: 2; stroke-linecap: round; }   /* the loops: round dots every 6px */
.hf-label { position: absolute; font-size: 11px; line-height: 13px; letter-spacing: -0.05px; color: var(--ink); white-space: nowrap; background: var(--paper); padding: 0 6px; }
.hf-label.is-above { transform: translate(-50%, calc(-100% - 4px)); }
.hf-label.is-below { transform: translate(-50%, 4px); }
.hf-def { display: flex; flex-direction: column; min-height: 40px; padding-top: 10px; border-top: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
  font: 400 14px/20px var(--ui); letter-spacing: -0.2px; color: var(--muted); }
.hf-def-name { color: var(--ink); }

/* the switch: two square segments on a 1px black rule, the chosen one filled black */
.hf-toggle { display: inline-flex; align-self: flex-start; border-radius: 8px; overflow: hidden; box-shadow: 0 0 0 1px var(--ink); background: var(--paper); }
.hf-tab { appearance: none; border: 0; margin: 0; padding: 0 14px; height: 30px; background: transparent; color: var(--ink);
  font: 400 13px/30px var(--ui); letter-spacing: -0.2px; cursor: pointer; transition: background-color 140ms var(--ease-land), color 140ms var(--ease-land); }
.hf-tab + .hf-tab { box-shadow: inset 1px 0 0 var(--ink); }
.hf-tab:hover { background: color-mix(in srgb, var(--ink) 6%, var(--paper)); }
.hf-tab[aria-pressed="true"] { background: var(--ink); color: var(--paper); }

@media (min-width: 600px) {
  .hf-row { gap: 44px; }
  .hf-card { height: 42px; padding: 0 14px; gap: 8px; border-radius: 10px; font-size: 15px; }
  .hf-ico, .hf-ico svg { width: 16px; height: 16px; }
  .hf-label { font-size: 12px; line-height: 15px; }
  .hf-canvas { padding: 56px 0; }
  .hf-tab { height: 34px; line-height: 34px; font-size: 14px; padding: 0 16px; }
  .hf-toggle { border-radius: 10px; }
}
@media (max-width: 599px) {
  .hf-canvas { padding: 8px 48px 8px 0; }
  .hf-row { flex-direction: column; align-items: stretch; gap: 24px; }
  .hf-label { display: none; }
  .hf-def { min-height: 80px; }
}
.hf-canvas, .hf-toggle { filter: url(#ink-diagram); }
```

## Drawing the wires (from the card boxes, after layout and on resize)

Measure each card's box relative to `.hf-canvas`, with `o = 4` px clearance:

- **Desktop:** a straight arrow between each pair of neighbours along the row's centre line, from `right + o` to the next card's `left - o`. Each loop runs from the centre of its `from` card, straight up or down to 30px beyond the card edge (`top - 30` above, `bottom + 30` below), across, and back to the centre of its `to` card, ending in an arrowhead. Its label sits centred on the horizontal run.
- **Under 600px:** the row is a column; arrows run down the centre; loops leave the right edge of the `from` card, go out 14px (plus 14px per extra loop), and come back into the right edge of the `to` card. Labels are hidden.
- Arrowhead: a 5px long, 3.5px half-width open V at the end point.
- Straight arrows are solid 1px; loops are dotted (`.hf-dots`). On the live site the loop dots are redrawn by a small three.js shader that makes them crawl along the path at 14px/s; with reduced motion the SVG dots stay.
