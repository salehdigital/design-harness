---
title: Carousel
slug: carousel
status: published
description: Horizontal scrolling gallery.
chips:
  - Gallery
created: 2026-11-09T21:04:27Z
updated: 2026-11-09T21:04:27Z
---

Horizontal scrolling carousel for images or cards. Used in articles for image galleries and experiments for project previews.

## Anatomy

```html
<div class="carousel">
  <div class="carousel-track">
    <figure class="carousel-item">
      <img src="image1.jpg" alt="Description" />
      <figcaption>Caption text</figcaption>
    </figure>
    <figure class="carousel-item">
      <img src="image2.jpg" alt="Description" />
      <figcaption>Caption text</figcaption>
    </figure>
    <!-- more items -->
  </div>
  <button class="carousel-prev" aria-label="Previous"></button>
  <button class="carousel-next" aria-label="Next"></button>
</div>
```

## Styling

Container:
```css
.carousel {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.carousel-track {
  display: flex;
  gap: var(--gap);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none; /* hide scrollbar */
  -webkit-overflow-scrolling: touch;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}
```

Item:
```css
.carousel-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: 100%;
  max-width: 640px;
}

.carousel-item img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.carousel-item figcaption {
  margin-top: var(--stack);
  font-size: 13px;
  line-height: 16px;
  opacity: var(--op-meta);
  text-align: center;
}
```

## Navigation Buttons

```css
.carousel-prev,
.carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: color-mix(in srgb, var(--paper) 90%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--dot) 20%, transparent);
  border-radius: 20px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s var(--ease-land);
}

.carousel:hover .carousel-prev,
.carousel:hover .carousel-next {
  opacity: 1;
}

.carousel-prev {
  left: var(--para);
}

.carousel-next {
  right: var(--para);
}
```

## Scroll Behavior

- Snap to item on scroll
- Smooth scroll animation
- Touch/swipe enabled on mobile
- Arrow key navigation supported

## Usage

- Full-width images
- Scroll snap for precise alignment
- Navigation buttons on hover (desktop)
- Swipe gestures (mobile)
- Optional captions below images
