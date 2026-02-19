/**
 * Category Detection
 * Determines category config (colors, icon, label) from frontmatter and path.
 */

const path = require('path');

/**
 * Get category config based on front matter and directory path.
 * Priority: 1. path-based series, 2. tags, 3. title keywords, 4. categories field.
 *
 * @param {object} frontMatter - Parsed front matter
 * @param {string} postDir - Post directory path
 * @param {object} config - Full config object (from config.js)
 * @returns {{ colors: string[], icon: string, label: string }}
 */
function getCategoryConfig(frontMatter, postDir, config) {
    const categories = frontMatter.categories || [];
    const tags = frontMatter.tags || [];
    const catMap = config.categories;

    // Extract series from directory path (e.g., content/posts/kafka/...)
    const pathParts = postDir.split(path.sep);
    const seriesIndex = pathParts.indexOf('posts');
    let seriesFromPath = null;
    if (seriesIndex >= 0 && pathParts.length > seriesIndex + 1) {
        seriesFromPath = pathParts[seriesIndex + 1].toLowerCase();
    }

    // Priority 1: Check path-based series
    if (seriesFromPath && catMap[seriesFromPath]) {
        const entry = catMap[seriesFromPath];
        return {
            colors: entry.colors,
            icon: entry.icon,
            label: entry.label || seriesFromPath.charAt(0).toUpperCase() + seriesFromPath.slice(1),
        };
    }

    // Priority 2: Check tags
    for (const tag of tags) {
        const term = tag.toLowerCase();
        if (catMap[term]) {
            return catMap[term];
        }
    }

    // Priority 3: Check title keywords
    const title = (frontMatter.title || '').toLowerCase();
    for (const [keyword, categoryKey] of Object.entries(config.titleKeywords || {})) {
        if (title.includes(keyword) && catMap[categoryKey]) {
            return catMap[categoryKey];
        }
    }

    // Priority 4: Check categories
    for (const category of categories) {
        const term = category.toLowerCase();
        if (catMap[term]) {
            return catMap[term];
        }
    }

    return catMap['default'];
}

module.exports = { getCategoryConfig };
