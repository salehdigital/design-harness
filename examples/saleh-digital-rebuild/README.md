# saleh.digital rebuild from the harness

A fidelity test for `harnesses/saleh-digital`. Three pages were rebuilt by following only the harness. The two round-1 pages were screenshotted next to the live site at the same sizes (`screenshots/`). The round-2 theme, streaming and sound work is checked by the selftest below; `shoot.sh` can also take light and dark captures, but none from round 2 are committed.

| Page | Rebuild | Live | Harness records used |
| --- | --- | --- | --- |
| Home / article "What is a design harness?" | `index.html` | https://saleh.digital/ | templates/home.md, templates/article.md, components/screens/reading.md, components/patterns/harness-flow.md, components/components/term.md |
| Record page, Lectures › Lead UX and Product Design Instructor | `inner.html` | https://saleh.digital/#/lectures/lead-ux-and-product-design-instructor | templates/record.md |
| Settings › Theme, Sound and MCP (`?page=theme`, `sound`, `mcp`) | `settings.html` | https://saleh.digital/#/settings/theme | templates/settings.md, foundations/themes.md, foundations/sound/sound.md |

Both pages also use foundations/layout-grid.md, spacing/spacing.md, typography/type.md, colors.md, motion/motion.md, materials/texture.md, components/patterns/navigation.md and components/patterns/footer.md. Each block in `style.css` and `site.js` names the record it came from.

## Theme, motion and sound (round 2)

The modules in `js/` are not hand-written. `tools/from-harness.py` copies them out of the fenced code blocks in the harness records, so the rebuild runs exactly the code the harness documents:

| File | Copied from |
| --- | --- |
| `js/state.js`, `js/tokens.js` | foundations/motion/motion.md |
| `js/theme.js` | foundations/themes.md |
| `js/audio.js`, `js/haptics.js` | foundations/sound/sound.md |
| `js/stream.js` | foundations/motion/streaming.md (the streaming half of `resolve.js`, lines 95 to 195) |
| `js/settings.js`, `js/mcp.js` | templates/settings.md (the contact address is stubbed) |

`js/boot.js` and `js/settings-page.js` are the only glue, and they are small. They do the following:

- **Theme.** Every page carries the harness's first-paint script (the Nov 11 version, with Ember as the default), so `?theme=dark`, `?theme=marathon-light&accent=red` and the stored choice apply before paint. A switch recolours the grain tile and the footer dots through `window.__sdRetint`.
- **Streaming.** The article streams in word by word through `streamIn` (one ink of 220 × 9/14 ≈ 141ms, at most 9ms between words), and the post meta waits for `stream:end`.
- **Sound and haptics.** The first key or pointer unlocks audio. Presses, hovers on items, icons and warm words, and pointer moves across the wordmark's letters reach `audio.js` and `haptics.js` as the same bus events the live site emits. Settings › Sound changes the palette and plays its preview.
- **Selftest.** `index.html?selftest` drives those paths headlessly and prints what fired. `shoot.sh` saves the result as `screenshots/selftest.json`.

## WebGL wordmark and shaders (round 3)

The wordmark and the footer dot strip render through the site's own WebGL layer. `tools/from-harness.py` copies it out of the harness too:

| File | Copied from |
| --- | --- |
| `js/gl.js` | foundations/motion/webgl-renderer.md (gl.js whole: three.js renderer, JFA SDF passes, render-target pool, frame loop, pausing, context loss) |
| `js/glsl.js` | foundations/motion/webgl-shaders.md (glsl.js whole: every vertex and fragment shader, verbatim) |
| `js/raster.js` | foundations/motion/webgl-wordmark.md (the 2D mask rasteriser the SDF is built from) |
| `js/orb.js` | foundations/motion/orbs.md |
| `js/wordmark.js` | foundations/motion/webgl-wordmark.md: the app.js blocks for hold and letters (562 to 604), fitWordmark (822 to 879) and bakeFooter (881 to 904), verbatim, plus a small preamble and `bootGL()` cut down from app.js `boot()` |

The pages load three.js 0.186.1 through the same importmap as the live site (jsDelivr) and carry `<canvas id="gl">`. `js/boot.js` calls `bootGL()` on every page: fonts load, `createGL` starts, `<html>` gets `.gl`, and the wordmark is fitted and the footer baked. When WebGL2 or `EXT_color_buffer_float` is missing, `createGL` throws, `.gl` is never set and the SVG/DOM wordmark stays visible, exactly as on the live site.

**Font.** The SDF is generated at runtime from whatever face the browser resolves for `"Kult Luxury"`. `style.css` points that family at the owner-supplied `fonts/Kult-Luxury.woff2` first and falls back to Instrument Serif (SIL OFL, from jsDelivr's Fontsource). Nothing is committed. With the fallback the fitted wordmark is taller (about 240px rather than 72px at 1440 wide), because Instrument Serif has different proportions. The Arabic hold field uses system fonts.

**Self-test.** `tools/gl-selftest.sh` serves this folder, starts headless Chrome with `--enable-unsafe-swiftshader --use-angle=swiftshader` and drives it over the DevTools protocol (`tools/gl-selftest.mjs`). `?selftest=gl` scrolls to the footer, reads the `#gl` canvas back and counts the lit pixels inside the wordmark's box and in the footer strip. For the readback only, it requests `preserveDrawingBuffer` through a test-only `getContext` shim. `NOGL=1` runs the same pages with WebGL disabled to check the fallback. The results from a clean clone (no owner fonts, so Instrument Serif) are in `screenshots/selftest-gl-*.json`. `--virtual-time-budget` with `--dump-dom` never returns here, because the render loop keeps virtual time busy, so the script waits in real time instead.

## Commercial assets: none are in this folder

- **Shinka** (Aeiou Tools) and **Kult Luxury** are commercial typefaces; **Amicons** is a commercial icon set. None of their files, SVGs, path data or base64 copies are committed.
- `style.css` loads fonts from `./fonts/`, which is gitignored. Put your own licensed files there (`Shinka-Regular.otf`, `Shinka-RegularItalic.otf`, `Kult-Luxury.woff2`, and Inter Display, which is open under the SIL OFL). Without them the stacks fall back to Georgia and Times New Roman, and the page sets a little wider. Kult Luxury falls back to Instrument Serif (OFL, loaded from jsDelivr) so that the WebGL wordmark still has a face to build its field from.
- The flow cards keep an empty 16px icon slot where the Amicons glyphs go. The four footer marks point at the owner's `assets/footer/*.png` masks, which are not here, so they paint nothing.
- The screenshots in `screenshots/` were taken with the owner's licensed fonts present locally. They are images of the page, not font files.

## Run it

```bash
cd examples/saleh-digital-rebuild
python3 tools/from-harness.py     # re-copy js/ from the harness records
tools/gl-selftest.sh              # WebGL readback self-test (SwiftShader); NOGL=1 for the fallback
LIVE_IP=153.52.255.122 ./shoot.sh screenshots   # serves on :8765; rebuild and live at 1440x900 and 390x844, light and dark, Settings › Theme, a mid-stream frame, and the selftest
```

## Copy changes

The rebuild uses the live article's text, with one edit. The first sentence's company name is replaced with "[company]". The work grid, architecture diagram, harness viewer, download actions and FAQ embeds are left out of the rebuild. The harness now documents them (components/patterns/work-grid.md, harness-diagram.md, harness-viewer.md, harness-actions.md and faq.md), but they are not rebuilt here. The WebGL wordmark and footer are rebuilt (see above). The footer marks have no masks here, and the orbs, gallery-grid shaders, TOC and Welcome page are documented but not rebuilt. Everything above the fold matches the live page.
