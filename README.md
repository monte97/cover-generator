# Cover Generator

**Automated cover image generation for blog posts and LinkedIn** — 16 Handlebars templates, category-aware colors, social footer with inline SVG icons. Everything is configurable from a single file: fork it, edit `config.js`, and you're ready to go.

Built with [Playwright](https://playwright.dev/) + [Handlebars](https://handlebarsjs.com/) + Chromium. Zero external image dependencies.

---

## Features

- **16 distinct templates** — Minimal, Dark, Split, Glass, Neon, Magazine, Code, Mesh, Terminal, Polaroid, Blueprint, Duotone, Retro, Wave, Outline, Stack
- **Standalone HTML templates** — each template is a `.hbs` file you can edit visually in any HTML editor
- **Auto-discovery** — drop a new `.hbs` file in `templates/` and it's immediately available
- **Category-aware** — colors and icons auto-detected from directory path, tags, title, or categories
- **Social footer** — shared Handlebars partial with inline SVG icons (GitHub, LinkedIn, email)
- **Dual format** — LinkedIn (1200x627) and Blog/OG (1280x720) in a single run
- **Single config file** — branding, social links, categories, defaults: all in one place
- **Batch mode** — generate covers for an entire series with one command
- **Makefile** — shortcuts for all common operations

## Quick Start

### Standalone (recommended for forks)

```bash
cd scripts/cover-generator   # or wherever you cloned the repo
npm install
npm run install-browser       # downloads Chromium for Playwright
npm run gen -- content/posts/kafka/01-intro --template dark
```

### From Hugo site root

```bash
make -f scripts/cover-generator/Makefile install
make -f scripts/cover-generator/Makefile gen POST=content/posts/kafka/01-intro TEMPLATE=dark
```

Edit `config.js` with your branding before generating covers (see below).

---

## Configuration

**`config.js` is the only file you need to touch.** It controls branding, social links, output paths, categories, and keyword detection. Every cover reads from this file at generation time.

### Branding

```js
module.exports = {
    brand: 'yourdomain.dev',            // shown in cover footer
    // ...
};
```

The `brand` string appears in the bottom-left corner of every template.

### Social Links

```js
    social: {
        github: 'your-username',         // set any field to null to hide it
        linkedin: 'your-profile-slug',
        email: 'you@example.com',
    },
```

Each non-null entry renders an inline SVG icon + text in the cover footer. To disable all social icons, set the entire `social` object to `null`.

### Output Defaults

```js
    defaults: {
        template: 'minimal',             // default template when --template is omitted
        format: 'both',                  // linkedin | blog | both
        outputDir: 'scripts/cover-generator/output',  // gitignored, inside the repo
        contentDir: 'content/posts',     // where the generator looks for articles
    },
```

Generated covers land in `output/` (gitignored). Override with `--output <dir>` to write elsewhere. All CLI options (`--template`, `--format`, `--output`) override these defaults.

### Categories

Each category maps a key (matched against paths, tags, titles) to a color gradient, icon, and label:

```js
    categories: {
        'python':  { colors: ['#3776AB', '#FFD43B'], icon: '🐍', label: 'Python' },
        'react':   { colors: ['#61DAFB', '#282C34'], icon: '⚛️', label: 'React' },
        'devops':  { colors: ['#4F46E5', '#7C3AED'], icon: '🚀', label: 'DevOps' },
        // add as many as you need
        'default': { colors: ['#475569', '#94A3B8'], icon: '📝', label: 'Article' },
    },
```

The `default` entry is used when no category matches.

### Title Keywords

Maps keywords found in article titles to category keys (used as detection priority 3):

```js
    titleKeywords: {
        'django': 'python',
        'flask': 'python',
        'nextjs': 'react',
        'k8s': 'kubernetes',
        // keyword (lowercase) → category key
    },
```

### Full Example

```js
// config.js
module.exports = {
    brand: 'janedoe.dev',

    social: {
        github: 'janedoe',
        linkedin: 'jane-doe',
        email: null,                     // hidden
    },

    defaults: {
        template: 'dark',
        format: 'both',
        outputDir: 'scripts/cover-generator/output',
        contentDir: 'content/posts',
    },

    categories: {
        'python':    { colors: ['#3776AB', '#FFD43B'], icon: '🐍', label: 'Python' },
        'rust':      { colors: ['#DEA584', '#000000'], icon: '🦀', label: 'Rust' },
        'devops':    { colors: ['#4F46E5', '#7C3AED'], icon: '🚀', label: 'DevOps' },
        'default':   { colors: ['#475569', '#94A3B8'], icon: '📝', label: 'Article' },
    },

    titleKeywords: {
        'django': 'python',
        'cargo': 'rust',
        'docker': 'devops',
    },
};
```

---

## Templates

Each template is a standalone `.hbs` (Handlebars) file in `templates/`. You can open them in any HTML editor, modify the layout and CSS, and see results immediately.

Static HTML previews of all templates are available in [`templates/examples/`](templates/examples/) — open [`index.html`](templates/examples/index.html) for a gallery view.

| ID | Name | Style | Preview | Best for |
|:---|:-----|:------|:--------|:---------|
| `minimal` | Minimal Gradient | Gradient background, icon box top-right | [preview](templates/examples/08-minimal.html) | LinkedIn, clean look |
| `dark` | Dark Geometric | Dark bg, accent bar, geometric shapes | [preview](templates/examples/03-dark.html) | Tech, backend |
| `split` | Split Color | 65/35 split: text \| large icon | [preview](templates/examples/13-split.html) | Visual impact, social |
| `glass` | Glassmorphism | Frosted glass card, blur effects | [preview](templates/examples/05-glass.html) | Modern, trendy |
| `neon` | Neon Cyber | Grid background, glow effects | [preview](templates/examples/09-neon.html) | Developer, cyberpunk |
| `magazine` | Magazine Style | Editorial layout, issue number | [preview](templates/examples/06-magazine.html) | Series, publications |
| `code` | Code Editor | VS Code-style title bar | [preview](templates/examples/02-code.html) | Developer content |
| `mesh` | Gradient Mesh | 3D radial gradient blobs | [preview](templates/examples/07-mesh.html) | Creative, modern |
| `terminal` | Terminal | CLI prompt with commands, scanlines | [preview](templates/examples/15-terminal.html) | DevOps, backend |
| `polaroid` | Polaroid | White card frame, shadow, dot grid | [preview](templates/examples/11-polaroid.html) | Photography, creative |
| `blueprint` | Blueprint | Technical grid, corner marks, reference ID | [preview](templates/examples/01-blueprint.html) | Architecture, infra |
| `duotone` | Duotone | Bold diagonal split, two flat colors | [preview](templates/examples/04-duotone.html) | Impact, branding |
| `retro` | Retro CRT | Scanlines, color stripes, vintage monitor | [preview](templates/examples/12-retro.html) | Retro, fun |
| `wave` | Wave | Layered wave shapes, dark background | [preview](templates/examples/16-wave.html) | Elegant, modern |
| `outline` | Outline | Light bg, colored border frame, circles | [preview](templates/examples/10-outline.html) | Clean, minimal |
| `stack` | Stack | Stacked rotated cards, dark background | [preview](templates/examples/14-stack.html) | Series, collections |

Regenerate previews after modifying templates:

```bash
make export
# or: npm run export
```

### Creating a New Template

The fastest way is the scaffold command:

```bash
make new-template NAME=my-theme
# → creates templates/my-theme.hbs from the scaffold
```

Or copy manually: `cp templates/_scaffold.hbs templates/my-theme.hbs`

#### Template structure

Every `.hbs` template is a self-contained HTML document with three parts:

```
{{!-- name: My Theme --}}       ← 1. Name comment (first line, required)
<!DOCTYPE html>
<html>
<head>
  <style>
    /* 2. CSS — all your styling lives here */
    html, body { width: {{width}}px; height: {{height}}px; }
    .cover { /* your layout */ }
  </style>
</head>
<body>
  <div class="cover">
    <!-- 3. HTML layout using Handlebars expressions -->
    <div class="category">{{categoryLabel}}</div>
    <div class="title">{{title}}</div>
    {{> social-footer theme="dark"}}
  </div>
</body>
</html>
```

#### Step by step

1. **Create the file** — `make new-template NAME=my-theme` generates `templates/my-theme.hbs` with all placeholders ready
2. **Customize the CSS** — modify colors, layout, fonts. The scaffold uses a gradient background; replace it with your design
3. **Preview with a real article** — `make gen POST=content/posts/kafka/01-intro TEMPLATE=my-theme`
4. **Export HTML preview** — `make export` regenerates `templates/html/` with your new template included
5. **Iterate** — edit the `.hbs` file and re-run `make gen` until you're happy

#### Tips

- Use `rgba({{hexToRgb colors.[0]}}, 0.15)` to create transparent versions of category colors
- Use `{{#if (eq format "linkedin")}}` for format-specific styling
- Use `{{truncate title 50}}` to cap long titles
- The social footer partial supports `theme="dark"` and `theme="light"`
- Files starting with `_` (like `_scaffold.hbs`) are ignored by auto-discovery

### Template Data

Every template receives these variables:

| Variable | Type | Example |
|:---------|:-----|:--------|
| `{{title}}` | string | `"Kafka in Pratica: Architettura..."` |
| `{{categoryLabel}}` | string | `"Kafka Series"` |
| `{{{icon}}}` | string (unescaped) | `📡` |
| `{{colors.[0]}}` / `{{colors.[1]}}` | hex color | `#8B5CF6` |
| `{{brand}}` | string | `montelli.dev` |
| `{{social.github}}` | string or null | `monte97` |
| `{{social.linkedin}}` | string or null | `francesco-montelli` |
| `{{social.email}}` | string or null | `francesco@montelli.dev` |
| `{{readTime}}` | number | `12` |
| `{{width}}` / `{{height}}` | number | `1200` / `627` |

### Handlebars Helpers

| Helper | Usage | Output |
|:-------|:------|:-------|
| `hexToRgb` | `rgba({{hexToRgb colors.[0]}}, 0.1)` | `rgba(139, 92, 246, 0.1)` |
| `truncate` | `{{truncate title 40}}` | First 40 chars + `...` |
| `eq` | `{{#if (eq theme "dark")}}...{{/if}}` | Equality check |

### Shared Partial

The social footer is a shared partial at `templates/partials/_social-footer.hbs`. Use it in templates:

```handlebars
{{> social-footer theme="dark"}}   {{!-- for dark backgrounds --}}
{{> social-footer theme="light"}}  {{!-- for light backgrounds --}}
```

---

## Usage

The Makefile works from **any directory** — it auto-detects paths relative to itself.

### Makefile (recommended)

```bash
# From the cover-generator directory:
make help
make install
make gen POST=../../content/posts/kafka/01-intro TEMPLATE=dark

# From the Hugo site root:
make -f scripts/cover-generator/Makefile gen POST=content/posts/kafka/01-intro TEMPLATE=dark
make -f scripts/cover-generator/Makefile all SERIES=kafka TEMPLATE=dark FORMAT=linkedin
make -f scripts/cover-generator/Makefile export
make -f scripts/cover-generator/Makefile new-template NAME=my-theme
make -f scripts/cover-generator/Makefile clean
```

### npm scripts (from cover-generator directory)

```bash
npm run gen -- <post-directory> [--template name] [--format type]
npm run all -- <series> [--template name] [--format type]
npm run export
```

### Node directly

```bash
node scripts/cover-generator/index.js <post-directory> [--template name] [--format type] [--output dir]
node scripts/cover-generator/generate-all.js <series> [--template name] [--format type]
node scripts/cover-generator/export-templates.js
```

## Output Formats

| Format | Size | Aspect Ratio | Use case |
|:-------|:-----|:-------------|:---------|
| `linkedin` | 1200 x 627 px | 1.91:1 | LinkedIn posts, Twitter/X cards |
| `blog` | 1280 x 720 px | 16:9 | Blog hero images, Open Graph |

Output path: `{outputDir}/{slug}-linkedin.png` and `{slug}-blog.png`

## Category Detection

The generator auto-detects category (colors, icon, label) in this priority order:

| Priority | Source | Example |
|:---------|:-------|:--------|
| 1 | **Directory path** | `content/posts/python/...` → matches `python` |
| 2 | **Tags** | `tags: ["Python", ...]` → matches `python` |
| 3 | **Title keywords** | Title contains "django" → maps to `python` via `titleKeywords` |
| 4 | **Categories** | `categories: ["DevOps"]` → matches `devops` |
| 5 | **Fallback** | No match → uses `default` entry |

All lookups are case-insensitive. Matching is done against keys in `config.categories`.

## How It Works

```text
index.md → parseFrontMatter() → getCategoryConfig() → Handlebars template → Playwright → PNG
                                        ↑                       ↑
                                    config.js              config.js
                                  (categories)          (brand, social)
```

1. Reads `index.md` frontmatter (title, tags, categories)
2. Detects category → picks colors, icon, and label from `config.js`
3. Estimates reading time (~200 words/min)
4. Builds data object: `{ title, colors, icon, categoryLabel, brand, social, readTime, width, height }`
5. Handlebars compiles the `.hbs` template with the data
6. Playwright screenshots the rendered HTML into a PNG

## Hugo Integration

Reference the generated cover in your article's frontmatter:

```yaml
---
title: "My Article"
images:
  - /images/covers/my-article-blog.png
---
```

Or in a Hugo layout for Open Graph:

```html
<meta property="og:image" content="{{ .Site.BaseURL }}/images/covers/{{ .File.ContentBaseName }}-linkedin.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="627" />
```

## Project Structure

```
scripts/cover-generator/
├── config.js              # YOUR configuration — edit this
├── Makefile               # CLI shortcuts (run from site root)
├── index.js               # CLI: single article
├── generate-all.js        # CLI: batch series
├── export-templates.js    # CLI: static HTML export
├── lib/
│   ├── templates.js       # Handlebars loader (auto-discovery, helpers, partials)
│   ├── frontmatter.js     # YAML parsing + reading time estimation
│   └── categories.js      # Category detection logic
└── templates/
    ├── *.hbs              # 16 Handlebars templates (one per file)
    ├── _scaffold.hbs      # Scaffold for new templates (ignored by auto-discovery)
    ├── partials/
    │   └── _social-footer.hbs  # Shared social footer partial
    ├── html/              # Generated HTML previews (via export, gitignored)
    └── examples/          # Design references
```

## Troubleshooting

| Error | Fix |
|:------|:----|
| `Playwright not installed` | `npm install && npm run install-browser` (from cover-generator dir) |
| `Cannot find module 'handlebars'` | `npm install` from cover-generator dir |
| `Template 'xyz' not found` | `make -f scripts/cover-generator/Makefile list-templates` |
| `Series 'xyz' not found` | `make -f scripts/cover-generator/Makefile list-series` |
| Fonts look different | Playwright uses system fonts — install `fonts-mulish` or equivalent |

## License

MIT
