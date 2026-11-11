# saleh.digital rebuild from the harness

A fidelity test for `harnesses/saleh-digital`. Two pages were rebuilt by following only the harness text, then screenshotted next to the live site at the same sizes.

| Page | Rebuild | Live | Harness records used |
| --- | --- | --- | --- |
| Home / article "What is a design harness?" | `index.html` | https://saleh.digital/ | templates/home.md, templates/article.md, components/screens/reading.md, components/patterns/harness-flow.md, components/components/term.md |
| Record page, Lectures › Lead UX and Product Design Instructor | `inner.html` | https://saleh.digital/#/lectures/lead-ux-and-product-design-instructor | templates/record.md |

Both pages also use foundations/layout-grid.md, spacing/spacing.md, typography/type.md, colors.md, motion/motion.md, materials/texture.md, components/patterns/navigation.md and components/patterns/footer.md. Each block in `style.css` and `site.js` names the record it came from.

## Commercial assets: none are in this folder

- **Shinka** (Aeiou Tools) and **Kult Luxury** are commercial typefaces; **Amicons** is a commercial icon set. None of their files, SVGs, path data or base64 copies are committed.
- `style.css` loads fonts from `./fonts/`, which is gitignored. Put your own licensed files there (`Shinka-Regular.otf`, `Shinka-RegularItalic.otf`, `Kult-Luxury.woff2`, and Inter Display, which is open under the SIL OFL). Without them the stacks fall back to Georgia and Times New Roman, and the page sets a little wider.
- The flow cards keep an empty 16px icon slot where the Amicons glyphs go. The four footer marks point at the owner's `assets/footer/*.png` masks, which are not here, so they paint nothing.
- The screenshots in `screenshots/` were taken with the owner's licensed fonts present locally. They are images of the page, not font files.

## Run it

```bash
cd examples/saleh-digital-rebuild
./shoot.sh screenshots     # serves this folder on :8765 and screenshots rebuild and live at 1440x900 and 390x844
```

## Copy changes

The rebuild uses the live article's text, with one edit. The first sentence's company name is replaced with "[company]". The work grid, architecture diagram, harness viewer, download actions and FAQ embeds are left out, because the harness does not specify them yet. Everything above the fold matches the live page.
