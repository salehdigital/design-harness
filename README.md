# Design Harness

A design harness is a structured collection of design records that agents read to understand your design system, visual foundations, and design constraints. This monorepo publishes design harnesses as npm packages, plus a CLI and MCP server for working with them.

## What is a design harness?

A design harness contains:

- **Foundations**: Visual design system values (brand, typography, colors, themes, spacing, icons, materials, motion, sound, writing)
- **Intelligence**: Agent context (policy, memories, vocabulary, agents, tools, skills, packages)
- **Components**: UI building blocks (components, patterns, screens)

Each piece is a Markdown file with frontmatter (title, slug, description, chips) and plain text notes. Agents read the harness before designing.

See the [specification](spec/SPEC.md) for details.

## Install

```bash
# Initialize a harness in ./design-harness
npx @salehdigital/harness init

# Or use the starter template
npx @salehdigital/harness init --starter
```

## CLI

```bash
# Initialize harness (default: saleh-digital)
npx @salehdigital/harness init [name]
npx @salehdigital/harness init --starter
npx @salehdigital/harness init custom-name --force

# List all folders
npx @salehdigital/harness list

# Validate harness structure
npx @salehdigital/harness validate [dir]

# Help
npx @salehdigital/harness --help
```

## MCP Server

The MCP server exposes design harness tools to AI agents via the [Model Context Protocol](https://modelcontextprotocol.io).

### Configuration

#### Claude Code

```bash
# Add via Claude Code CLI
claude mcp add design-harness -- npx -y @salehdigital/harness-mcp

# Or manually add to .mcp.json
{
  "design-harness": {
    "command": "npx",
    "args": ["-y", "@salehdigital/harness-mcp"]
  }
}
```

#### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "design-harness": {
      "command": "npx",
      "args": ["-y", "@salehdigital/harness-mcp"]
    }
  }
}
```

#### Codex

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.design-harness]
command = "npx"
args = ["-y", "@salehdigital/harness-mcp"]
```

#### Grok

Grok currently supports remote MCP servers only. Visit [saleh.digital/mcp](https://saleh.digital/mcp) for the hosted endpoint. (Tools for the harness are coming.)

### MCP Tools

- `list_folders` - List all folders in the harness
- `list_records(folder)` - List records in a folder
- `get_record(path or slug)` - Get a specific record
- `search_records(query)` - Search records by text
- `get_brief_context` - Get foundations, policy, and memories
- `validate_harness(dir)` - Validate harness structure
- `init_harness(dir, name)` - Initialize a new harness (write operation)

### Custom harness directory

```bash
# Serve a local harness directory instead of the bundled one
npx @salehdigital/harness-mcp --dir ./my-design-harness
```

Update your MCP config to pass `--dir`:

```json
{
  "design-harness": {
    "command": "npx",
    "args": ["-y", "@salehdigital/harness-mcp", "--dir", "./my-design-harness"]
  }
}
```

## Packages

This monorepo publishes three packages:

- **[@salehdigital/harness](packages/harness)** - CLI for managing design harnesses
- **[@salehdigital/harness-mcp](packages/harness-mcp)** - MCP server for design harnesses
- **[@salehdigital/harness-core](packages/core)** - Core parsing and validation (internal)

## Bundled harnesses

Two harnesses are bundled in published packages:

- **saleh-digital** - Ahmed Saleh's design harness for [saleh.digital](https://saleh.digital)
- **starter** - Empty schema with example files

## Specification

See [spec/SPEC.md](spec/SPEC.md) for the complete design harness specification and [spec/record.schema.json](spec/record.schema.json) for the JSON Schema.

## Using in other languages

Design harnesses are plain Markdown files with JSON Schema-validated frontmatter. You can use them in any language:

```bash
# Clone or download a harness
git clone https://github.com/salehdigital/design-harness.git
cd design-harness/harnesses/saleh-digital

# Or via degit
npx degit salehdigital/design-harness/harnesses/saleh-digital my-harness

# Or download the npm tarball
npm pack @salehdigital/harness
tar -xzf salehdigital-harness-*.tgz
cd package/harnesses/saleh-digital
```

Then read the Markdown files and parse the frontmatter in your language of choice.

## Publishing (maintainers)

First-time setup before the release workflow can run:

1. **Create npm organization**: Create the `salehdigital` organization at [npmjs.com](https://www.npmjs.com)

2. **Enable 2FA**: Enable two-factor authentication on your npm account

3. **Manual first publish** for each package:
   ```bash
   cd packages/harness
   npm publish --access public
   
   cd ../harness-mcp
   npm publish --access public
   
   cd ../core
   npm publish --access public
   ```

4. **Configure npm trusted publishing** at [npmjs.com](https://www.npmjs.com):
   - Go to each package settings
   - Add GitHub Actions OIDC provider
   - Repository: `salehdigital/design-harness`
   - Workflow: `release.yml`

5. **Enable the release workflow**:
   - Set repository variable `NPM_PUBLISH_ENABLED=true` in GitHub settings, or
   - Remove the `workflow_dispatch` condition from `.github/workflows/release.yml`

After setup, releases are automated via [Changesets](https://github.com/changesets/changesets):

```bash
# Add a changeset
pnpm changeset

# Version and release (automated via GitHub Actions on merge to main)
pnpm version
pnpm release
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## License

- **Code** (packages/): MIT License - see [LICENSE](LICENSE)
- **Content** (harnesses/): CC BY 4.0 - see [LICENSE-CONTENT](LICENSE-CONTENT)

Copyright © 2026 Saleh Digital / Ahmed Saleh

## Links

- [saleh.digital](https://saleh.digital) - Ahmed Saleh's website
- [MCP Documentation](https://modelcontextprotocol.io) - Model Context Protocol
- [Changesets](https://github.com/changesets/changesets) - Release automation
