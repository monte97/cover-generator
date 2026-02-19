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
const {
    generateMinimalTemplate,
    generateDarkTemplate,
    generateSplitTemplate,
    generateGlassTemplate,
    generateNeonTemplate,
    generateMagazineTemplate,
    generateCodeTemplate,
    generateMeshTemplate,
    generateTerminalTemplate,
    generatePolaroidTemplate,
    generateBlueprintTemplate,
    generateDuotoneTemplate,
    generateRetroTemplate,
    generateWaveTemplate,
    generateOutlineTemplate,
    generateStackTemplate,
} = require('./lib/templates');

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

const templateConfigs = [
    { id: '01-minimal',  name: 'Minimal Gradient', fn: generateMinimalTemplate },
    { id: '02-dark',     name: 'Dark Geometric',   fn: generateDarkTemplate },
    { id: '03-split',    name: 'Split Color',      fn: generateSplitTemplate },
    { id: '04-glass',    name: 'Glassmorphism',    fn: generateGlassTemplate },
    { id: '05-neon',      name: 'Neon Cyber',       fn: generateNeonTemplate },
    { id: '06-magazine',  name: 'Magazine Style',   fn: generateMagazineTemplate },
    { id: '07-code',      name: 'Code Editor',      fn: generateCodeTemplate },
    { id: '08-mesh',      name: 'Gradient Mesh',    fn: generateMeshTemplate },
    { id: '09-terminal',  name: 'Terminal',          fn: generateTerminalTemplate },
    { id: '10-polaroid',  name: 'Polaroid',          fn: generatePolaroidTemplate },
    { id: '11-blueprint', name: 'Blueprint',         fn: generateBlueprintTemplate },
    { id: '12-duotone',   name: 'Duotone',           fn: generateDuotoneTemplate },
    { id: '13-retro',     name: 'Retro CRT',         fn: generateRetroTemplate },
    { id: '14-wave',      name: 'Wave',              fn: generateWaveTemplate },
    { id: '15-outline',   name: 'Outline',           fn: generateOutlineTemplate },
    { id: '16-stack',     name: 'Stack',             fn: generateStackTemplate },
];

function main() {
    console.log('📐 Generating static HTML templates...\n');

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const tc of templateConfigs) {
        const fileName = `${tc.id}.html`;
        const outputPath = path.join(OUTPUT_DIR, fileName);

        try {
            const html = tc.fn(SAMPLE_DATA, LINKEDIN_DIMENSIONS.width, LINKEDIN_DIMENSIONS.height);
            fs.writeFileSync(outputPath, html, 'utf-8');

            console.log(`✅ Generated: ${outputPath}`);
            console.log(`   Template: ${tc.name}`);
            console.log(`   Category: ${SAMPLE_DATA.categoryLabel}`);
            console.log(`   Colors: ${SAMPLE_DATA.colors.join(' → ')}`);
            console.log('');
        } catch (error) {
            console.error(`❌ Error generating ${fileName}:`, error.message);
        }
    }

    generateIndexFile();

    console.log('🎉 Done!');
    console.log(`\n📂 Output directory: ${OUTPUT_DIR}/`);
    console.log('📄 Open: scripts/cover-generator/templates/html/index.html');
}

function generateIndexFile() {
    const indexHTML = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cover Templates - Index</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Mulish', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f0f1a;
            color: #fff;
            padding: 40px 20px;
        }

        h1 {
            text-align: center;
            margin-bottom: 10px;
        }

        .subtitle {
            text-align: center;
            color: #888;
            margin-bottom: 50px;
        }

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

        .card:hover {
            transform: translateY(-5px);
        }

        .card iframe {
            width: 100%;
            height: 320px;
            border: none;
        }

        .card-info {
            padding: 20px;
        }

        .card-info h3 {
            font-size: 18px;
            margin-bottom: 8px;
            color: #fff;
        }

        .card-info p {
            font-size: 14px;
            color: #888;
            margin-bottom: 12px;
        }

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

        .card-info a:hover {
            background: #7c3aed;
        }

        .meta {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>Cover Templates</h1>
    <p class="subtitle">Static HTML previews of all available templates</p>

    <div class="grid">
        ${templateConfigs.map(tc => `
        <div class="card">
            <iframe src="${tc.id}.html" title="${tc.name}"></iframe>
            <div class="card-info">
                <h3>${tc.name}</h3>
                <p>LinkedIn Format (1200x627)</p>
                <div class="meta">
                    <span>Kafka Series</span>
                    <span>12 min</span>
                </div>
                <div style="margin-top: 15px;">
                    <a href="${tc.id}.html" target="_blank">Open Full Size</a>
                </div>
            </div>
        </div>
        `).join('')}
    </div>

    <div style="margin-top: 60px; text-align: center; padding: 30px; background: rgba(255,255,255,0.05); border-radius: 12px; max-width: 800px; margin-left: auto; margin-right: auto;">
        <h3 style="margin-bottom: 15px;">Documentation</h3>
        <p style="color: #888; margin-bottom: 20px;">These are static HTML previews. The actual templates are implemented in JavaScript.</p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <a href="../../README.md" style="background: rgba(139, 92, 246, 0.2); color: #8B5CF6; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px;">README</a>
        </div>
    </div>
</body>
</html>`;

    const indexPath = path.join(OUTPUT_DIR, 'index.html');
    fs.writeFileSync(indexPath, indexHTML, 'utf-8');
    console.log(`✅ Generated index: ${indexPath}\n`);
}

main();
