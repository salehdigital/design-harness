---
title: Streaming
slug: streaming
status: published
description: Motion for real-time generative content.
chips:
  - Motion
  - AI
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Motion and timing for content that generates incrementally (AI text streaming, live updates).

## Characteristics

**No resolve delay**: Text appears immediately as it generates, word by word or character by character.

**Cursor pulse**: Show blinking cursor at generation point.
```css
.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: var(--accent);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

**Smooth scroll**: Auto-scroll viewport to keep cursor visible as content grows.

**No stagger**: Unlike emergence (page load), streaming content appears in document order without artificial delay.

## States

**Streaming**: Content + cursor, real-time append
**Complete**: Cursor fades out, content remains

## Completion Transition

```css
.cursor {
  transition: opacity 0.3s var(--ease-land);
}

.is-complete .cursor {
  opacity: 0;
}
```

## Usage

- AI-generated article drafts
- Live chat responses
- Real-time search results

## Reduced Motion

Streaming still appears in real-time, but disable cursor blink:
```css
@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
    opacity: 1;
  }
}
```

## Related

See `vocabulary/thinking.md` for thinking/loading states and `motion.md` for motion principles.
