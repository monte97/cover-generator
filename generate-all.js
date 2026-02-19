#!/usr/bin/env node

/**
 * Batch Cover Generator
 * Generates covers for all articles in a series.
 *
 * Usage:
 *   node scripts/cover-generator/generate-all.js <series> [options]
 *   node scripts/cover-generator/generate-all.js kafka --template dark
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const config = require('./config');

const CONTENT_DIR = config.defaults.contentDir;
const INDEX_SCRIPT = path.join(__dirname, 'index.js');

function findArticles(series) {
    const seriesPath = path.join(CONTENT_DIR, series);

    if (!fs.existsSync(seriesPath)) {
        console.error(`❌ Series '${series}' not found in ${seriesPath}`);
        return [];
    }

    const articles = [];

    function walkDir(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                const indexFile = path.join(filePath, 'index.md');
                if (fs.existsSync(indexFile)) {
                    articles.push(filePath);
                }
                walkDir(filePath);
            }
        }
    }

    walkDir(seriesPath);
    return articles;
}

function parseArgs(args) {
    const options = {
        series: null,
        template: null,
        format: null,
    };

    let i = 0;
    while (i < args.length) {
        const arg = args[i];

        if (arg === '--template' && args[i + 1]) {
            options.template = args[i + 1];
            i += 2;
        } else if (arg === '--format' && args[i + 1]) {
            options.format = args[i + 1];
            i += 2;
        } else if (!arg.startsWith('--') && !options.series) {
            options.series = arg;
            i++;
        } else {
            i++;
        }
    }

    return options;
}

function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    if (!options.series) {
        console.log('Batch Cover Generator');
        console.log('');
        console.log('Usage: node scripts/cover-generator/generate-all.js <series> [options]');
        console.log('');
        console.log('Options:');
        console.log('  --template <name>   Template to use (minimal, dark, split, glass, neon, magazine, code, mesh)');
        console.log('  --format <format>   Output format: linkedin, blog, or both');
        console.log('');
        console.log('Available series:');

        const seriesDirs = fs.readdirSync(CONTENT_DIR)
            .filter(f => fs.statSync(path.join(CONTENT_DIR, f)).isDirectory());

        seriesDirs.forEach(s => {
            const count = findArticles(s).length;
            if (count > 0) {
                console.log(`  - ${s} (${count} articles)`);
            }
        });

        process.exit(0);
    }

    const articles = findArticles(options.series);

    if (articles.length === 0) {
        console.error(`❌ No articles found in series '${options.series}'`);
        process.exit(1);
    }

    console.log(`📚 Found ${articles.length} articles in '${options.series}' series:\n`);

    articles.forEach((article, i) => {
        console.log(`  ${i + 1}. ${path.basename(article)}`);
    });

    console.log(`\n🚀 Generating covers...\n`);

    let success = 0;
    let failed = 0;

    for (const article of articles) {
        try {
            let cmd = `node "${INDEX_SCRIPT}" ${article}`;

            if (options.template) {
                cmd += ` --template ${options.template}`;
            }

            if (options.format) {
                cmd += ` --format ${options.format}`;
            }

            execSync(cmd, { stdio: 'inherit' });
            success++;
        } catch (error) {
            console.error(`❌ Failed to generate cover for ${article}`);
            failed++;
        }
        console.log('');
    }

    console.log('='.repeat(50));
    console.log(`✅ Completed: ${success} successful, ${failed} failed`);
}

main();
