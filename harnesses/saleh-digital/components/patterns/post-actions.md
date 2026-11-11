---
title: Post Actions
slug: post-actions
status: published
description: Meta actions row for articles.
chips:
  - Actions
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Action buttons row at the end of articles. Provides discuss, copy link, and sound toggle controls.

## Anatomy

```html
<div class="post-actions">
  <button class="meta-ico" id="discuss" aria-label="Discuss">
    <span class="ico" data-icon="discuss"></span>
    <span class="count">12</span>
  </button>
  <button class="meta-ico" id="copy" aria-label="Copy link">
    <span class="ico" data-icon="copy"></span>
  </button>
  <button class="meta-ico" id="sound" aria-label="Toggle sound">
    <span class="ico" data-icon="sound-on"></span>
  </button>
</div>
```

## Styling

Container:
```css
.post-actions {
  display: flex;
  align-items: center;
  gap: var(--para); /* ~16–30px */
  padding: var(--para) 0;
  border-top: 1px solid color-mix(in srgb, var(--dot) 16%, transparent);
  margin-top: calc(var(--para) * 2);
}
```

## Buttons

See `icon-button.md` for full button styling.

Each button is 16px icon with optional count.

## Actions

**Discuss:**
- Opens comments or discussion thread
- Shows count of existing comments
- Icon: speech bubble

**Copy Link:**
- Copies article URL to clipboard
- Morphs to checkmark on success
- Icon: link/chain

**Sound Toggle:**
- Toggles site sound on/off
- Icon: sound-on / sound-off
- State persists via localStorage

## Responsive

Desktop: horizontal row, gap = para
Mobile: same layout (icons scale well)

## Usage

- Always at end of article body
- Above footer
- Inline with reading flow
- Icon-only (no text labels, use aria-label)
