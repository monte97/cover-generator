#!/usr/bin/env node

/**
 * Article Cover Generator
 * Generates cover images for blog posts and LinkedIn from front matter metadata.
 *
 * Usage:
 *   node scripts/cover-generator/index.js <post-directory> [options]
 *
 * Options:
 *   --template <name>     Template to use (minimal, dark, split, glass, neon, magazine, code, mesh)
 *   --format <format>     Output format (linkedin, blog, both)
 *   --output <dir>        Output directory
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const config = require('./config');
const { TEMPLATES } = require('./lib/templates');
const { parseFrontMatter, estimateReadingTime } = require('./lib/frontmatter');
const { getCategoryConfig } = require('./lib/categories');

function parseArgs(args) {
    const options = {
        postDir: null,
        template: config.defaults.template,
        format: config.defaults.format,
        outputDir: config.defaults.outputDir,
    };

    let i = 0;
    while (i < args.length) {
        const arg = args[i];

        if (arg === '--template' && args[i + 1]) {
            options.template = args[i + 1].toLowerCase();
            i += 2;
        } else if (arg === '--format' && args[i + 1]) {
            options.format = args[i + 1].toLowerCase();
            i += 2;
        } else if (arg === '--output' && args[i + 1]) {
            options.outputDir = args[i + 1];
            i += 2;
        } else if (!arg.startsWith('--') && !options.postDir) {
            options.postDir = arg;
            i++;
        } else {
            i++;
        }
    }

    return options;
}

async function generateCover(options) {
    const { postDir, template: templateName, format: formatOption, outputDir } = options;

    console.log(`📐 Generating covers for: ${postDir}`);
    console.log(`🎨 Template: ${templateName}`);
    console.log(`📐 Format: ${formatOption}`);

    if (!TEMPLATES[templateName]) {
        console.error(`❌ Template '${templateName}' not found.`);
        console.log(`Available templates: ${Object.keys(TEMPLATES).join(', ')}`);
        process.exit(1);
    }

    const indexFile = path.join(postDir, 'index.md');
    if (!fs.existsSync(indexFile)) {
        console.error(`❌ index.md not found in ${postDir}`);
        process.exit(1);
    }

    const content = fs.readFileSync(indexFile, 'utf-8');
    const frontMatter = parseFrontMatter(content);

    if (!frontMatter.title) {
        console.error('❌ No title found in front matter');
        process.exit(1);
    }

    const catConfig = getCategoryConfig(frontMatter, postDir, config);
    const readTime = estimateReadingTime(content);

    console.log(`📝 Title: ${frontMatter.title}`);
    console.log(`🎨 Category: ${catConfig.label}`);
    console.log(`🎨 Colors: ${catConfig.colors.join(' → ')}`);
    console.log(`📊 Read time: ~${readTime} min`);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const slug = path.basename(postDir);
    const formats = formatOption === 'both'
        ? ['linkedin', 'blog']
        : [formatOption];

    const browser = await chromium.launch();

    for (const format of formats) {
        const dimensions = format === 'linkedin'
            ? { width: 1200, height: 627 }
            : { width: 1280, height: 720 };

        const page = await browser.newPage({
            viewport: { width: dimensions.width, height: dimensions.height },
        });

        const template = TEMPLATES[templateName];
        const html = template.generate({
            title: frontMatter.title.replace(/^["']|["']$/g, '').trim(),
            categoryLabel: catConfig.label,
            icon: catConfig.icon,
            colors: catConfig.colors,
            brand: config.brand,
            social: config.social,
            readTime,
        }, dimensions.width, dimensions.height);

        await page.setContent(html);

        const filename = format === 'linkedin'
            ? `${slug}-linkedin.png`
            : `${slug}-blog.png`;

        const outputPath = path.join(outputDir, filename);

        await page.screenshot({
            path: outputPath,
            type: 'png',
            clip: { x: 0, y: 0, width: dimensions.width, height: dimensions.height },
        });

        await page.close();

        console.log(`✅ Generated: ${outputPath} (${dimensions.width}x${dimensions.height})`);
    }

    await browser.close();
    console.log('🎉 Done!');
}

// === CLI ===

const args = process.argv.slice(2);
const options = parseArgs(args);

if (!options.postDir) {
    console.log('Article Cover Generator');
    console.log('');
    console.log('Usage: node scripts/cover-generator/index.js <post-directory> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --template <name>   Template to use (default: minimal)');
    console.log('  --format <format>   Output format: linkedin, blog, or both (default: both)');
    console.log('  --output <dir>      Output directory (default: static/images/covers)');
    console.log('');
    console.log('Available templates:');
    Object.entries(TEMPLATES).forEach(([key, value]) => {
        console.log(`  ${key.padEnd(12)} ${value.name}`);
    });
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/cover-generator/index.js content/posts/kafka/01-intro');
    console.log('  node scripts/cover-generator/index.js content/posts/kafka/01-intro --template dark');
    console.log('  node scripts/cover-generator/index.js content/posts/kafka/01-intro --template glass --format linkedin');
    process.exit(0);
}

generateCover(options).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
