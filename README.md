# Cover Generator

**Automated cover image generation for blog posts and LinkedIn** — 8 templates, category-aware colors, social footer with inline SVG icons. Everything is configurable from a single file: fork it, edit `config.js`, and you're ready to go.

Built with [Playwright](https://playwright.dev/) + Chromium. Zero external image dependencies.

---

## Features

- **8 distinct templates** — Minimal, Dark, Split, Glass, Neon, Magazine, Code, Mesh
- **Category-aware** — colors and icons auto-detected from directory path, tags, title, or categories
- **Social footer** — inline SVG icons (GitHub, LinkedIn, email) rendered in every cover
- **Dual format** — LinkedIn (1200x627) and Blog/OG (1280x720) in a single run
- **Single config file** — branding, social links, categories, defaults: all in one place
- **Batch mode** — generate covers for an entire series with one command

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browser
npm run cover:install

# 3. Edit config.js with your branding (see below)

# 4. Generate a cover
npm run cover:gen -- content/posts/kafka/01-intro --template dark
```

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
        outputDir: 'static/images/covers',
        contentDir: 'content/posts',     // where the generator looks for articles
    },
```

All CLI options (`--template`, `--format`, `--output`) override these defaults.

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
        outputDir: 'static/images/covers',
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

| ID | Name | Style | Best for |
|:---|:-----|:------|:---------|
| `minimal` | Minimal Gradient | Gradient background, icon box top-right | LinkedIn, clean look |
| `dark` | Dark Geometric | Dark bg, accent bar, geometric shapes | Tech, backend |
| `split` | Split Color | 65/35 split: text \| large icon | Visual impact, social |
| `glass` | Glassmorphism | Frosted glass card, blur effects | Modern, trendy |
| `neon` | Neon Cyber | Grid background, glow effects | Developer, cyberpunk |
| `magazine` | Magazine Style | Editorial layout, issue number | Series, publications |
| `code` | Code Editor | VS Code-style title bar | Developer content |
| `mesh` | Gradient Mesh | 3D radial gradient blobs | Creative, modern |

Preview all templates locally:

```bash
npm run cover:export
open scripts/cover-generator/templates/html/index.html
```

## Usage

### Single article

```bash
npm run cover:gen -- <post-directory> [options]
```

| Option | Description | Default (from config) |
|:-------|:-----------|:----------------------|
| `--template <name>` | Template ID | `defaults.template` |
| `--format <type>` | `linkedin`, `blog`, or `both` | `defaults.format` |
| `--output <dir>` | Output directory | `defaults.outputDir` |

```bash
# Uses defaults from config.js
npm run cover:gen -- content/posts/my-article

# Override template and format
npm run cover:gen -- content/posts/my-article --template dark --format linkedin
```

### Batch (entire series)

```bash
npm run cover:all -- <series-name> [options]
```

```bash
# All articles in a series
npm run cover:all -- python --template dark

# LinkedIn only
npm run cover:all -- devops --template magazine --format linkedin
```

### List available series

```bash
npm run cover:all
```

### Export static HTML previews

```bash
npm run cover:export
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
index.md → parseFrontMatter() → getCategoryConfig() → template.generate() → Playwright → PNG
                                        ↑                       ↑
                                    config.js              config.js
                                  (categories)          (brand, social)
```

1. Reads `index.md` frontmatter (title, tags, categories)
2. Detects category → picks colors, icon, and label from `config.js`
3. Estimates reading time (~200 words/min)
4. Builds data object: `{ title, colors, icon, categoryLabel, brand, social, readTime }`
5. Selected template renders HTML with inline SVG social icons
6. Playwright screenshots the HTML into a PNG

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
├── index.js               # CLI: single article
├── generate-all.js        # CLI: batch series
├── export-templates.js    # CLI: static HTML export
├── lib/
│   ├── templates.js       # 8 template generators + social footer renderer
│   ├── frontmatter.js     # YAML parsing + reading time estimation
│   └── categories.js      # Category detection logic
└── templates/
    ├── html/              # Generated HTML previews (via cover:export)
    └── examples/          # Design references
```

## npm Scripts

| Script | Command | Description |
|:-------|:--------|:------------|
| `cover:gen` | `npm run cover:gen -- <path> [opts]` | Generate cover for one article |
| `cover:all` | `npm run cover:all -- <series> [opts]` | Batch generate for a series |
| `cover:export` | `npm run cover:export` | Export static HTML previews |
| `cover:install` | `npm run cover:install` | Install Playwright Chromium |

## Troubleshooting

| Error | Fix |
|:------|:----|
| `Cannot find module 'playwright'` | `npm install && npm run cover:install` |
| `Template 'xyz' not found` | Run `node scripts/cover-generator/index.js` to list templates |
| `Series 'xyz' not found` | Run `npm run cover:all` to list available series |
| Fonts look different | Playwright uses system fonts — install `fonts-mulish` or equivalent |

## License

MIT
