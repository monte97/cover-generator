# Handlebars Template Extraction — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract all 16 cover templates from hardcoded JS functions into standalone `.hbs` files, using Handlebars for rendering with a shared social footer partial.

**Architecture:** Each template becomes a `.hbs` file in `templates/`. The loader in `lib/templates.js` auto-discovers `.hbs` files, registers Handlebars helpers (`hexToRgb`, `truncate`) and partials (`_social-footer.hbs`), and exposes the same `TEMPLATES` interface. No changes to `index.js` or `generate-all.js`.

**Tech Stack:** Handlebars (npm), Node.js, Playwright (unchanged)

---

### Task 1: Install Handlebars dependency

**Files:**
- Modify: `package.json` (root)

**Step 1: Install handlebars**

Run: `npm install --save-dev handlebars` (from repo root `/home/monte97/Documents/1_WORK/1_AETE_RIORGANIZZATA/2_repo/CONTENT/website.github.io`)

**Step 2: Verify installation**

Run: `node -e "const hbs = require('handlebars'); console.log('Handlebars', hbs.VERSION)"`
Expected: prints Handlebars version without error

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add handlebars dependency for template extraction"
```

---

### Task 2: Create the social footer partial

**Files:**
- Create: `scripts/cover-generator/templates/partials/_social-footer.hbs`

**Step 1: Create partials directory**

Run: `mkdir -p scripts/cover-generator/templates/partials`

**Step 2: Write the partial**

Create `scripts/cover-generator/templates/partials/_social-footer.hbs` with:

```handlebars
{{!--
  Social footer partial.
  Context: { brand, social, readTime }
  Parameter: theme ("dark" or "light")
--}}
<span style="display:inline-flex;align-items:center;">
  <span>{{brand}}</span>
</span>
{{#if social}}
  {{#if social.github}}
  <span style="display:inline-flex;align-items:center;">
    <span style="display:inline-flex;align-items:center;gap:5px;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="{{#if (eq theme 'dark')}}#ccc{{else}}#64748b{{/if}}" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      {{social.github}}
    </span>
  </span>
  {{/if}}
  {{#if social.linkedin}}
  <span style="display:inline-flex;align-items:center;">
    <span style="display:inline-flex;align-items:center;gap:5px;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="{{#if (eq theme 'dark')}}#ccc{{else}}#64748b{{/if}}" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      {{social.linkedin}}
    </span>
  </span>
  {{/if}}
  {{#if social.email}}
  <span style="display:inline-flex;align-items:center;">
    <span style="display:inline-flex;align-items:center;gap:5px;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="{{#if (eq theme 'dark')}}#ccc{{else}}#64748b{{/if}}" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
      {{social.email}}
    </span>
  </span>
  {{/if}}
{{/if}}
<span style="display:inline-flex;align-items:center;">
  <span>⏱️ {{readTime}} min</span>
</span>
```

**Step 3: Commit**

```bash
git add scripts/cover-generator/templates/partials/_social-footer.hbs
git commit -m "feat: add social footer Handlebars partial"
```

---

### Task 3: Rewrite `lib/templates.js` as Handlebars loader

**Files:**
- Rewrite: `scripts/cover-generator/lib/templates.js`

**Step 1: Write the new template loader**

Replace `scripts/cover-generator/lib/templates.js` entirely with:

```js
/**
 * Template Loader
 * Auto-discovers .hbs templates, registers Handlebars helpers and partials.
 * Exposes the same TEMPLATES interface: { [id]: { name, generate(data, w, h) } }
 */

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const PARTIALS_DIR = path.join(TEMPLATES_DIR, 'partials');

// === Helpers ===

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '255, 255, 255';
}

Handlebars.registerHelper('hexToRgb', (hex) => new Handlebars.SafeString(hexToRgb(hex)));

Handlebars.registerHelper('truncate', (str, len) => {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '...' : str;
});

Handlebars.registerHelper('eq', (a, b) => a === b);

// === Register Partials ===

if (fs.existsSync(PARTIALS_DIR)) {
    for (const file of fs.readdirSync(PARTIALS_DIR)) {
        if (file.endsWith('.hbs')) {
            const name = path.basename(file, '.hbs').replace(/^_/, '');
            const source = fs.readFileSync(path.join(PARTIALS_DIR, file), 'utf-8');
            Handlebars.registerPartial(name, source);
        }
    }
}

// === Auto-discover Templates ===

function extractName(source) {
    const match = source.match(/\{\{!--\s*name:\s*(.+?)\s*--\}\}/);
    return match ? match[1] : null;
}

const TEMPLATES = {};

for (const file of fs.readdirSync(TEMPLATES_DIR)) {
    if (!file.endsWith('.hbs')) continue;

    const id = path.basename(file, '.hbs');
    const source = fs.readFileSync(path.join(TEMPLATES_DIR, file), 'utf-8');
    const compiled = Handlebars.compile(source);
    const displayName = extractName(source) || id;

    TEMPLATES[id] = {
        name: displayName,
        generate(data, width, height) {
            return compiled({ ...data, width, height });
        },
    };
}

module.exports = { hexToRgb, TEMPLATES };
```

**Step 2: Verify the module loads without error (no templates yet)**

Run: `node -e "const t = require('./scripts/cover-generator/lib/templates'); console.log('Templates found:', Object.keys(t.TEMPLATES).length)"`
Expected: `Templates found: 0` (no `.hbs` files created yet)

**Step 3: Commit**

```bash
git add scripts/cover-generator/lib/templates.js
git commit -m "feat: rewrite templates.js as Handlebars auto-discovery loader"
```

---

### Task 4: Convert the `minimal` template to `.hbs`

This task establishes the pattern. Convert the first template and verify end-to-end that it generates the same PNG.

**Files:**
- Create: `scripts/cover-generator/templates/minimal.hbs`

**Step 1: Write minimal.hbs**

Create `scripts/cover-generator/templates/minimal.hbs` by converting `generateMinimalTemplate` from the old `lib/templates.js`. Replace all JS interpolation (`${...}`) with Handlebars expressions. Use `{{> social-footer theme="dark"}}` for the footer. Use `{{hexToRgb colors.[0]}}` for RGB conversions.

The file should be a full HTML document starting with `{{!-- name: Minimal Gradient --}}`.

Reference: the original function is at lines 55-129 of the old `lib/templates.js` (read from git: `git show HEAD~1:scripts/cover-generator/lib/templates.js`).

Template variables available: `title`, `categoryLabel`, `icon`, `colors` (array, access via `colors.[0]`, `colors.[1]`), `brand`, `social` (object), `readTime`, `width`, `height`.

```handlebars
{{!-- name: Minimal Gradient --}}
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: {{width}}px; height: {{height}}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, BlinkMacSystemFont, sans-serif; }
        .cover {
            width: {{width}}px;
            height: {{height}}px;
            background: linear-gradient(135deg, {{colors.[0]}} 0%, {{colors.[1]}} 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 60px 80px;
            position: relative;
        }
        .icon-box {
            position: absolute;
            top: 50px;
            right: 80px;
            width: 100px;
            height: 100px;
            background: rgba(255,255,255,0.15);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
        }
        .category {
            font-size: 18px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 3px;
            opacity: 0.9;
            margin-bottom: 20px;
            color: rgba(255,255,255,0.95);
        }
        .title {
            font-size: 52px;
            font-weight: 700;
            line-height: 1.2;
            color: #ffffff;
            max-width: 85%;
        }
        .footer {
            position: absolute;
            bottom: 30px;
            left: 80px;
            right: 80px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: rgba(255,255,255,0.85);
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="icon-box">{{{icon}}}</div>
        <div class="category">{{categoryLabel}}</div>
        <div class="title">{{title}}</div>
        <div class="footer">
            {{> social-footer theme="dark"}}
        </div>
    </div>
</body>
</html>
```

Note: `{{{icon}}}` uses triple-braces because emoji icons should not be HTML-escaped.

**Step 2: Verify it loads**

Run: `node -e "const t = require('./scripts/cover-generator/lib/templates'); console.log(Object.keys(t.TEMPLATES)); console.log(t.TEMPLATES.minimal.name)"`
Expected: `['minimal']` and `Minimal Gradient`

**Step 3: Test end-to-end with a real article**

Run: `node scripts/cover-generator/index.js content/posts/kafka/01-intro --template minimal --format linkedin`
Expected: generates a PNG in `scripts/cover-generator/output/` without error

**Step 4: Commit**

```bash
git add scripts/cover-generator/templates/minimal.hbs
git commit -m "feat: convert minimal template to Handlebars"
```

---

### Task 5: Convert remaining 15 templates to `.hbs`

Convert each remaining template following the same pattern as Task 4. Each template is a standalone `.hbs` file in `scripts/cover-generator/templates/`.

**Files to create:**
- `scripts/cover-generator/templates/dark.hbs`
- `scripts/cover-generator/templates/split.hbs`
- `scripts/cover-generator/templates/glass.hbs`
- `scripts/cover-generator/templates/neon.hbs`
- `scripts/cover-generator/templates/magazine.hbs`
- `scripts/cover-generator/templates/code.hbs`
- `scripts/cover-generator/templates/mesh.hbs`
- `scripts/cover-generator/templates/terminal.hbs`
- `scripts/cover-generator/templates/polaroid.hbs`
- `scripts/cover-generator/templates/blueprint.hbs`
- `scripts/cover-generator/templates/duotone.hbs`
- `scripts/cover-generator/templates/retro.hbs`
- `scripts/cover-generator/templates/wave.hbs`
- `scripts/cover-generator/templates/outline.hbs`
- `scripts/cover-generator/templates/stack.hbs`

**Conversion rules (apply to all):**
- First line: `{{!-- name: <Display Name> --}}`
- Replace `${width}` → `{{width}}`, `${height}` → `{{height}}`
- Replace `${colors[0]}` → `{{colors.[0]}}`, `${colors[1]}` → `{{colors.[1]}}`
- Replace `${title}` → `{{title}}`, `${categoryLabel}` → `{{categoryLabel}}`
- Replace `${icon}` → `{{{icon}}}` (triple-brace, no escaping)
- Replace `${data.brand}` → `{{brand}}`, `${data.readTime}` → `{{readTime}}`
- Replace `hexToRgb(colors[0])` → `{{hexToRgb colors.[0]}}`, same for `colors[1]`
- Replace `renderSocialFooter(data, 'dark')` → `{{> social-footer theme="dark"}}`
- Replace `renderSocialFooter(data, 'light')` → `{{> social-footer theme="light"}}`
- For the `code` template: replace `title.substring(0, 40)` + length check → `{{truncate title 40}}`

**Reference:** Read each original function from git: `git show HEAD~2:scripts/cover-generator/lib/templates.js` (the commit before the rewrite). The original functions and their line ranges:

| Template | Function | Approx lines |
|----------|----------|-------------|
| dark | generateDarkTemplate | 131-224 |
| split | generateSplitTemplate | 226-317 |
| glass | generateGlassTemplate | 319-398 |
| neon | generateNeonTemplate | 400-498 |
| magazine | generateMagazineTemplate | 501-584 |
| code | generateCodeTemplate | 586-688 |
| mesh | generateMeshTemplate | 690-782 |
| terminal | generateTerminalTemplate | 786-899 |
| polaroid | generatePolaroidTemplate | 901-998 |
| blueprint | generateBlueprintTemplate | 1001-1132 |
| duotone | generateDuotoneTemplate | 1134-1240 |
| retro | generateRetroTemplate | 1242-1370 |
| wave | generateWaveTemplate | 1372-1500 |
| outline | generateOutlineTemplate | 1502-1618 |
| stack | generateStackTemplate | 1620-1721 |

**Step 1: Convert all 15 templates**

Create each `.hbs` file applying the conversion rules above.

**Step 2: Verify all 16 templates load**

Run: `node -e "const t = require('./scripts/cover-generator/lib/templates'); console.log('Templates:', Object.keys(t.TEMPLATES).length, Object.keys(t.TEMPLATES))"`
Expected: `Templates: 16 [minimal, dark, split, glass, neon, magazine, code, mesh, terminal, polaroid, blueprint, duotone, retro, wave, outline, stack]`

**Step 3: Test generation for a few templates**

Run:
```bash
node scripts/cover-generator/index.js content/posts/kafka/01-intro --template dark --format linkedin
node scripts/cover-generator/index.js content/posts/kafka/01-intro --template code --format linkedin
node scripts/cover-generator/index.js content/posts/kafka/01-intro --template terminal --format linkedin
```
Expected: each generates a PNG without error

**Step 4: Commit**

```bash
git add scripts/cover-generator/templates/*.hbs
git commit -m "feat: convert all 15 remaining templates to Handlebars"
```

---

### Task 6: Update `export-templates.js`

**Files:**
- Modify: `scripts/cover-generator/export-templates.js`

**Step 1: Rewrite to use the TEMPLATES registry**

The current file imports all 16 generate functions individually. Rewrite to use the auto-discovered `TEMPLATES` object from `lib/templates.js`.

```js
#!/usr/bin/env node

/**
 * Template HTML Generator
 * Generates static HTML files for each template for git tracking.
 *
 * Usage:
 *   node scripts/cover-generator/export-templates.js
 */

const fs = require('fs');
const path = require('path');

const config = require('./config');
const { TEMPLATES } = require('./lib/templates');

const OUTPUT_DIR = 'scripts/cover-generator/templates/html';

const SAMPLE_DATA = {
    title: 'Kafka in Pratica 1: Architettura di un Flusso di Eventi',
    categoryLabel: 'Kafka Series',
    icon: '📡',
    colors: ['#8B5CF6', '#F59E0B'],
    brand: config.brand,
    social: config.social,
    readTime: 12,
};

const LINKEDIN_DIMENSIONS = { width: 1200, height: 627 };

function main() {
    console.log('📐 Generating static HTML templates...\n');

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const templateIds = Object.keys(TEMPLATES).sort();

    for (const [index, id] of templateIds.entries()) {
        const template = TEMPLATES[id];
        const paddedIndex = String(index + 1).padStart(2, '0');
        const fileName = `${paddedIndex}-${id}.html`;
        const outputPath = path.join(OUTPUT_DIR, fileName);

        try {
            const html = template.generate(
                SAMPLE_DATA,
                LINKEDIN_DIMENSIONS.width,
                LINKEDIN_DIMENSIONS.height
            );
            fs.writeFileSync(outputPath, html, 'utf-8');

            console.log(`✅ Generated: ${outputPath}`);
            console.log(`   Template: ${template.name}`);
            console.log(`   Category: ${SAMPLE_DATA.categoryLabel}`);
            console.log(`   Colors: ${SAMPLE_DATA.colors.join(' → ')}`);
            console.log('');
        } catch (error) {
            console.error(`❌ Error generating ${fileName}:`, error.message);
        }
    }

    generateIndexFile(templateIds);

    console.log('🎉 Done!');
    console.log(`\n📂 Output directory: ${OUTPUT_DIR}/`);
    console.log('📄 Open: scripts/cover-generator/templates/html/index.html');
}

function generateIndexFile(templateIds) {
    const cards = templateIds.map((id, index) => {
        const template = TEMPLATES[id];
        const paddedIndex = String(index + 1).padStart(2, '0');
        const fileName = `${paddedIndex}-${id}.html`;

        return `
        <div class="card">
            <iframe src="${fileName}" title="${template.name}"></iframe>
            <div class="card-info">
                <h3>${template.name}</h3>
                <p>LinkedIn Format (1200x627)</p>
                <div class="meta">
                    <span>Kafka Series</span>
                    <span>12 min</span>
                </div>
                <div style="margin-top: 15px;">
                    <a href="${fileName}" target="_blank">Open Full Size</a>
                </div>
            </div>
        </div>`;
    }).join('');

    const indexHTML = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cover Templates - Index</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Mulish', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f0f1a;
            color: #fff;
            padding: 40px 20px;
        }
        h1 { text-align: center; margin-bottom: 10px; }
        .subtitle { text-align: center; color: #888; margin-bottom: 50px; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 30px;
            max-width: 1600px;
            margin: 0 auto;
        }
        .card {
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-5px); }
        .card iframe { width: 100%; height: 320px; border: none; }
        .card-info { padding: 20px; }
        .card-info h3 { font-size: 18px; margin-bottom: 8px; color: #fff; }
        .card-info p { font-size: 14px; color: #888; margin-bottom: 12px; }
        .card-info a {
            display: inline-block;
            background: #8B5CF6;
            color: #fff;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            transition: background 0.2s;
        }
        .card-info a:hover { background: #7c3aed; }
        .meta { display: flex; gap: 15px; margin-top: 10px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <h1>Cover Templates</h1>
    <p class="subtitle">Static HTML previews of all available templates</p>
    <div class="grid">${cards}</div>
</body>
</html>`;

    const indexPath = path.join(OUTPUT_DIR, 'index.html');
    fs.writeFileSync(indexPath, indexHTML, 'utf-8');
    console.log(`✅ Generated index: ${indexPath}\n`);
}

main();
```

**Step 2: Test export**

Run: `npm run cover:export`
Expected: generates HTML files for all 16 templates + index.html

**Step 3: Commit**

```bash
git add scripts/cover-generator/export-templates.js
git commit -m "refactor: simplify export-templates to use auto-discovered TEMPLATES"
```

---

### Task 7: Verify full pipeline and clean up

**Step 1: Run single article generation with all templates**

Run (from repo root):
```bash
for tpl in minimal dark split glass neon magazine code mesh terminal polaroid blueprint duotone retro wave outline stack; do
  echo "=== $tpl ==="
  node scripts/cover-generator/index.js content/posts/kafka/01-intro --template $tpl --format linkedin
done
```
Expected: all 16 generate without error

**Step 2: Run batch generation**

Run: `node scripts/cover-generator/generate-all.js kafka --template dark --format linkedin`
Expected: generates covers for all articles in the kafka series

**Step 3: Run template export**

Run: `npm run cover:export`
Expected: generates all HTML previews

**Step 4: Verify CLI help still works**

Run: `node scripts/cover-generator/index.js`
Expected: prints help with all 16 template names listed

**Step 5: Update CLAUDE.md**

Modify `scripts/cover-generator/CLAUDE.md` to reflect the new architecture (templates are now `.hbs` files, Handlebars loader, how to add a new template).

**Step 6: Commit**

```bash
git add scripts/cover-generator/CLAUDE.md
git commit -m "docs: update CLAUDE.md for Handlebars template architecture"
```
