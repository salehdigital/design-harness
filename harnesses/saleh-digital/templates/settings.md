---
title: Settings Template
slug: settings
status: published
description: Settings page layout.
chips:
  - Template
  - Settings
created: 2026-11-11T15:03:00Z
updated: 2026-11-11T15:03:00Z
---

Settings template for `/settings` route. Provides controls for themes, foundation sliders, sound, and preferences.

## Layout Structure

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Settings – Saleh Digital</title>
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/site.css">
</head>
<body>
  <div class="cols">
    <nav class="col-nav">
      <!-- Nav -->
    </nav>

    <div class="col-sub">
      <!-- Settings categories -->
    </div>

    <main class="col-main">
      <h1>Settings</h1>

      <section class="settings-group">
        <h2>Theme</h2>
        <div class="setting-row">
          <div class="setting-info">
            <label class="setting-label">Theme</label>
            <p class="setting-desc">Choose light, dark, or marathon mode.</p>
          </div>
          <div class="setting-control">
            <div class="swatch-group">
              <button class="swatch is-active" data-theme="light" aria-label="Light theme">...</button>
              <button class="swatch" data-theme="dark" aria-label="Dark theme">...</button>
              <button class="swatch" data-theme="marathon-dark" aria-label="Marathon Dark">...</button>
              <button class="swatch" data-theme="marathon-light" aria-label="Marathon Light">...</button>
            </div>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <label class="setting-label" for="accent">Accent Color</label>
            <p class="setting-desc">Marathon theme accent.</p>
          </div>
          <div class="setting-control">
            <div class="swatch-group">
              <button class="swatch is-active" data-accent="lime">...</button>
              <button class="swatch" data-accent="cyan">...</button>
              <button class="swatch" data-accent="red">...</button>
              <button class="swatch" data-accent="amber">...</button>
              <button class="swatch" data-accent="green">...</button>
            </div>
          </div>
        </div>
      </section>

      <section class="settings-group">
        <h2>Foundation Sliders</h2>
        <div class="setting-row">
          <div class="setting-info">
            <label class="setting-label" for="energy">Energy</label>
            <p class="setting-desc">Motion speed and responsiveness.</p>
          </div>
          <div class="setting-control">
            <input type="range" id="energy" min="0" max="1" step="0.1" value="0.5">
          </div>
        </div>
        <!-- More sliders: texture, focus, density, etc. -->
      </section>

      <section class="settings-group">
        <h2>Preferences</h2>
        <div class="setting-row">
          <div class="setting-info">
            <label class="setting-label" for="sound">Sound</label>
            <p class="setting-desc">Enable UI sound feedback.</p>
          </div>
          <div class="setting-control">
            <label class="switch">
              <input type="checkbox" id="sound" checked>
              <span class="track"></span>
            </label>
          </div>
        </div>
        <!-- More switches: view transitions, hidden extras, etc. -->
      </section>

      <button class="save-btn" type="button">Save</button>
    </main>

    <aside class="col-margin"></aside>
  </div>

  <footer class="site-footer">
    <!-- Footer -->
  </footer>
</body>
</html>
```

## Save Behavior

On save:
1. Store settings in localStorage
2. Apply changes to CSS custom properties
3. Show single green check mark (see `memories/single-green-check.md`)
4. Check fades after 1.5–2 seconds

## Related

See `patterns/settings-row.md`, `components/components/switch.md`, `components/components/swatch.md`.
