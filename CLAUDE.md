# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Playwright-based cover image generator for blog posts and LinkedIn. Reads Hugo frontmatter from `index.md` files, auto-detects category (colors, icon, label), and screenshots Handlebars HTML templates into PNGs. 16 templates, dual format output (LinkedIn 1200x627, Blog/OG 1280x720).

## Commands

```bash
# Install deps (from cover-generator directory)
npm install && npm run install-browser

# Generate cover for a single article
npm run gen -- content/posts/kafka/01-intro --template dark

# Batch generate for a series
npm run all -- kafka --template dark

# Export static HTML previews of all templates
npm run export

# Create a new template from scaffold
make new-template NAME=my-theme

# From Hugo site root (alternative)
npm run cover:gen -- content/posts/kafka/01-intro --template dark
npm run cover:all -- kafka --template dark
make -f scripts/cover-generator/Makefile gen POST=content/posts/kafka/01-intro TEMPLATE=dark
```

## Architecture

All configuration lives in **`config.js`** — branding, social links, categories (color gradients + icons), title keyword mappings, and output defaults.

### Pipeline

```
index.md → parseFrontMatter() → getCategoryConfig() → Handlebars template → Playwright → PNG
```

### Key Modules

- **`index.js`** — CLI entry point for single article generation. Parses args, reads frontmatter, launches Playwright, screenshots HTML.
- **`generate-all.js`** — Batch CLI. Walks a series directory, shells out to `index.js` for each article via `execSync`.
- **`lib/templates.js`** — Handlebars auto-discovery loader. Registers helpers (`hexToRgb`, `truncate`, `eq`), registers partials from `templates/partials/`, auto-discovers all `.hbs` files in `templates/` (skipping files starting with `_`), compiles them, and exposes the `TEMPLATES` registry mapping IDs to `{ name, generate }`.
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

1. Run `make new-template NAME=my-theme` (creates from `_scaffold.hbs`)
2. Edit the generated `templates/my-theme.hbs` — customize CSS and layout
3. The `{{!-- name: Display Name --}}` comment on line 1 sets the display name
4. Use `{{> social-footer theme="dark"}}` for the footer
5. It's automatically discovered — no code changes needed
6. Files starting with `_` are ignored by auto-discovery

### Output

Generated PNGs go to `output/` (gitignored). Naming: `{slug}-linkedin.png`, `{slug}-blog.png`.
