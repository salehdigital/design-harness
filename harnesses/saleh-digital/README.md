# saleh.digital Design Harness

This harness documents the design system, visual foundations, components, and design constraints for [saleh.digital](https://saleh.digital), Ahmed Saleh's personal website.

## Purpose

This harness enables AI agents to understand and recreate the saleh.digital design system. It contains:

- **Foundations**: Typography, colors, spacing, motion, themes, materials, sound, writing voice
- **Components**: UI building blocks, patterns, and screen layouts
- **Intelligence**: Agent context, policies, memories, vocabulary, skills, tools, and packages

## Commercial Assets

### ⚠️ LICENSING NOTICE

This design harness references **three commercially licensed assets** used by Saleh Digital:

1. **Shinka** (serif typeface) — Aeiou Tools
   - https://aeiou.tools/purchase/shinka
2. **Kult Luxury** (display typeface for wordmark) — commercial; buy a license from its foundry
   - (foundry link not recorded; the owner licensed it separately)
3. **Amicons** (icon set)
   - https://amicons.design/

**These assets are NOT included in this harness, the npm packages, or this repository.**

If you use this harness to build a project, you must either:
- Purchase your own licenses for Shinka, Kult Luxury, and Amicons
- Use the documented fallback alternatives (Georgia serif, Arial Black/Impact, open-source icons)

**Do NOT copy, redistribute, or bundle:**
- Shinka or Kult Luxury font files (`.woff`, `.woff2`, `.otf`, `.ttf`)
- Amicons SVG files, path data, sprite sheets, or base64 encodings

The owner supplies these assets separately for the live site.

### Other typefaces

- **Inter Display** (UI) — SIL Open Font License 1.1, https://rsms.me/inter/. Free to use; still not bundled here.
- **ABC Favorit Mono Trial** (`--mono`, rarely seen) and **Kufigraph** (the footer basmala) — not open licenses that this repo can grant. They are not bundled either; license them yourself or use the fallbacks in the stacks.

## Using This Harness

See the [main README](../../README.md) for installation and CLI usage.

**To recreate saleh.digital:**
1. Read `foundations/` for design tokens and visual system
2. Read `components/` for UI building blocks and patterns
3. Read `intelligence/` for agent context, policies, and vocabulary
4. Use fallback fonts/icons or supply your own licensed assets
5. Reference the rebuild example in `examples/saleh-digital-rebuild/`

## File Structure

```
saleh-digital/
├── foundations/
│   ├── typography.md (⚠️ notes Shinka license)
│   ├── colors.md
│   ├── spacing.md
│   ├── motion.md
│   ├── themes/
│   ├── icons.md (⚠️ notes Amicons license)
│   ├── materials.md
│   ├── sound.md
│   └── writing.md
├── components/
│   ├── components/
│   ├── patterns/
│   └── screens/
└── intelligence/
    ├── policy.md
    ├── memories/
    ├── vocabulary/
    ├── agents/
    ├── skills/
    ├── tools/
    └── packages/ (⚠️ includes shinka.md, kult-luxury.md, amicons.md with license notes)
```

## Content License

The design harness content (Markdown files) is licensed under **CC BY 4.0**.

The code examples in this repository are licensed under **MIT**.

See [LICENSE-CONTENT](../../LICENSE-CONTENT) for details.

## Links

- [saleh.digital](https://saleh.digital) — Live site
- [Design Harness Specification](../../spec/SPEC.md)
- [Aeiou Tools (Shinka)](https://aeiou.tools/purchase/shinka)
- Kult Luxury: buy a license from its foundry
- [Amicons](https://amicons.design/)
- [Inter (Inter Display)](https://rsms.me/inter/)
