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

const OUTPUT_DIR = path.join(__dirname, 'templates', 'examples');

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
    console.log(`📄 Open: ${path.join(OUTPUT_DIR, 'index.html')}`);
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
