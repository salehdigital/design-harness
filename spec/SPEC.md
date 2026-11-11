# Design Harness Specification

A design harness is a structured collection of design records organized into groups and folders.

## Structure

```
design-harness/
├── foundations/     # Visual foundations
├── intelligence/    # Agent instructions and memory
└── components/      # Components, patterns, screens
```

## Groups

### Foundations
Visual foundations: brand, typography, colors, themes, spacing, icons, materials, motion, sound, writing.

### Intelligence
Agent context and instructions: policy, memories, vocabulary, agents, tools, skills, packages.

### Components
UI building blocks: components, patterns, screens.

## Record Format

Each folder contains:
- An index file (e.g., `brand.md`, `colors.md`) describing the folder
- Individual records (e.g., `wordmark.md`, `light.md`)

All files use Markdown with YAML frontmatter. See `record.schema.json` for the complete schema.

### Frontmatter Fields

- `title` (required): Human-readable title
- `slug` (required): URL-friendly identifier, unique within folder
- `description` (optional): One-line summary
- `status` (optional): `draft` | `published` | `archived`
- `group` (optional): `Foundations` | `Intelligence` | `Components`
- `order` (optional): Display order (integer)
- `chips` (optional): Array of short labels/tags
- `discuss` (optional): Comment count (integer)
- `created` (optional): ISO 8601 timestamp
- `updated` (optional): ISO 8601 timestamp

### Body

The body after frontmatter contains the design rule, reasoning, or instruction. Bodies may be empty for structural/index files.

## Validation Rules

1. Every record must have `title` and `slug`
2. Slugs must be unique within their folder
3. If present, `status` must be a valid enum value
4. If present, `group` must be a valid enum value
5. Timestamps must be valid ISO 8601 format
6. `chips` must be an array of strings

## File Naming

- Index files match their folder name (e.g., `foundations/brand.md`)
- Record files use kebab-case (e.g., `marathon-light.md`)
- Example/template files use `_example.md`
