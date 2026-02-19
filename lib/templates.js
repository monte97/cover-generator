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
