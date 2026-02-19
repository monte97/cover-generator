# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Playwright-based cover image generator for blog posts and LinkedIn. Reads Hugo frontmatter from `index.md` files, auto-detects category (colors, icon, label), and screenshots Handlebars HTML templates into PNGs. 16 templates, dual format output (LinkedIn 1200x627, Blog/OG 1280x720).

## Commands

```bash
# Install deps (run from repo root: website.github.io/)
npm install && npm run cover:install

# Generate cover for a single article
node scripts/cover-generator/index.js content/posts/kafka/01-intro --template dark

# Batch generate for a series
node scripts/cover-generator/generate-all.js kafka --template dark

# Export static HTML previews of all templates
npm run cover:export

# List available templates (run without arguments)
node scripts/cover-generator/index.js

# List available series (run without arguments)
node scripts/cover-generator/generate-all.js
```

**Note:** The `cover:gen` and `cover:all` npm scripts in `package.json` point to `scripts/cover-gen.js` and `scripts/cover-all.js` which don't exist. Use the full paths above instead.

## Architecture

All configuration lives in **`config.js`** — branding, social links, categories (color gradients + icons), title keyword mappings, and output defaults.

### Pipeline

```
index.md → parseFrontMatter() → getCategoryConfig() → Handlebars template → Playwright → PNG
```

### Key Modules

- **`index.js`** — CLI entry point for single article generation. Parses args, reads frontmatter, launches Playwright, screenshots HTML.
- **`generate-all.js`** — Batch CLI. Walks a series directory, shells out to `index.js` for each article via `execSync`.
- **`lib/templates.js`** — Handlebars auto-discovery loader. Registers helpers (`hexToRgb`, `truncate`, `eq`), registers partials from `templates/partials/`, auto-discovers all `.hbs` files in `templates/`, compiles them, and exposes the `TEMPLATES` registry mapping IDs to `{ name, generate }`.
- **`lib/categories.js`** — `getCategoryConfig()` resolves category in priority order: directory path → tags → title keywords → categories field → default fallback.
- **`lib/frontmatter.js`** — Lightweight YAML parser (regex-based) + reading time estimator (~200 wpm).
- **`export-templates.js`** — Generates static HTML preview files from the `TEMPLATES` registry.

### Templates

Each template is a standalone `.hbs` file in `templates/`:

```
templates/
  minimal.hbs          # Each file is a full HTML document with Handlebars expressions
  dark.hbs
  ...
  partials/
    _social-footer.hbs  # Shared footer partial (SVG icons, conditional rendering)
```

Metadata comment on first line: `{{!-- name: Display Name --}}`

Available Handlebars helpers: `{{hexToRgb color}}`, `{{truncate str len}}`, `{{#if (eq a b)}}`

Template data: `{ title, categoryLabel, icon, colors, brand, social, readTime, width, height }`

### Adding a New Template

1. Create `templates/your-template.hbs` — a full HTML document with Handlebars expressions
2. Add `{{!-- name: Your Template Name --}}` as the first line
3. Use `{{> social-footer theme="dark"}}` for the footer
4. It's automatically discovered — no code changes needed

### Output

Generated PNGs go to `output/` (gitignored). Naming: `{slug}-linkedin.png`, `{slug}-blog.png`.
