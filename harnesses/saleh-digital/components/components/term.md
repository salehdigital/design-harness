---
title: Term
slug: term
status: published
description: A defined word inside a sentence. Same type as the sentence, a dotted underline, and a small card with the definition on hover or tap.
chips:
  - Dotted underline 1px
  - Offset 3px
  - Ink 45%
  - Card 320 wide
created: 2026-11-11T18:00:00Z
updated: 2026-11-11T18:00:00Z
---

Terms mark the words the article defines ("design harness", "agent-native", "coding harness", "design complete"). They read as part of the sentence: the only signal is a **dotted** underline. Ordinary links use a thin **solid** underline instead (see components/screens/reading.md).

```html
<p>A <button type="button" class="term" data-term="design-harness" aria-haspopup="dialog" aria-expanded="false"
  aria-controls="term-pop" aria-describedby="term-def-design-harness">design harness</button> is an opinionated schema …</p>
<div id="term-defs" hidden><span id="term-def-design-harness">An opinionated schema for an agent-native design system. …</span></div>
```

```css
.term {
  --term-wash: color-mix(in srgb, var(--ink) 8%, transparent);
  all: unset; display: inline; font: inherit; letter-spacing: inherit; color: inherit; cursor: help;
  border-radius: 3px; padding: 0 2px; margin: 0 -2px;           /* the wash breathes past the word; the text does not move */
  -webkit-box-decoration-break: clone; box-decoration-break: clone;
  text-decoration: underline dotted; text-decoration-thickness: 1px; text-underline-offset: 3px;
  text-decoration-color: color-mix(in srgb, var(--ink) 45%, transparent);
  transition: background-color 160ms var(--ease-land), text-decoration-color 160ms var(--ease-land);
}
.term:hover, .term[aria-expanded="true"] { background: var(--term-wash); text-decoration-color: currentColor; }
.term:focus-visible { background: var(--term-wash); text-decoration-color: currentColor; outline: 1.5px solid var(--ring); outline-offset: 1px; }

.term-pop { position: fixed; z-index: 60; width: min(320px, calc(100vw - 24px)); padding: 14px 16px 6px;
  background: var(--paper); color: var(--ink); border-radius: 12px; text-align: left;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ink) calc(10% * var(--shadow-k)), transparent),
              0 2px 6px -2px color-mix(in srgb, var(--shadow) calc(10% * var(--shadow-k)), transparent),
              0 24px 64px -24px color-mix(in srgb, var(--shadow) calc(25% * var(--shadow-k)), transparent); }
```

The definitions shipped with the article:

- **design harness**: An opinionated schema for an agent-native design system. It gives an agent an "eye" for design, the way a coding harness gives it "hands".
- **agent-native**: Written for agents to read and act on as well as for people: explicit, structured and complete enough that nothing relies on a designer filling the gaps.
- **coding harness**: The software that translates a model into a system that can affect its environment (Rubric Labs). It lets an agent act: read files, run code, call tools.
- **design complete**: Finished to the standard you would ship: every state, edge and detail resolved, not just a convincing first pass.
