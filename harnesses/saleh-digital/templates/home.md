---
title: Home Template
slug: home
status: published
description: Homepage layout and structure.
chips:
  - Template
  - Layout
created: 2026-11-11T15:03:00Z
updated: 2026-11-11T15:03:00Z
---

There is no separate home layout. `https://saleh.digital/` resolves to the newest article and renders it with the article template (`templates/article.md`): Articles is active in the menu, the article title is the only item in column 2, the canonical URL is `https://saleh.digital/articles/what-is-a-design-harness/`, and the page `<title>` is "What is a design harness?, Ahmed Saleh".

So a rebuild of the home page is the article page. Do not add a hero, a welcome line, a list of recent posts, a header logo or a "Home" menu item.

## Head (from the live page)

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>What is a design harness?, Ahmed Saleh</title>
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="Ahmed Saleh — writing" href="https://saleh.digital/feed.xml">
<link rel="preload" href="fonts/InterDisplay-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

Other rooms (Lectures, Speaking, Library, …) are reached from the menu; see `templates/record.md` for a record page such as a lecture and `templates/library.md` for the grid rooms.
