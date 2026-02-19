/**
 * Front Matter Parsing
 * Extracts YAML front matter and estimates reading time.
 */

/**
 * Parse front matter from markdown content.
 * @param {string} content - Markdown file content
 * @returns {object} Parsed front matter key-value pairs
 */
function parseFrontMatter(content) {
    const frontMatter = {};
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);

    if (match) {
        const lines = match[1].split('\n');
        let currentKey = null;
        let currentValue = [];

        for (const line of lines) {
            const keyMatch = line.match(/^(\w+):\s*(.*)$/);
            if (keyMatch) {
                if (currentKey) {
                    frontMatter[currentKey] = currentValue.join('\n').trim();
                }
                currentKey = keyMatch[1];
                currentValue = [keyMatch[2]];
            } else if (currentKey) {
                currentValue.push(line);
            }
        }

        if (currentKey) {
            frontMatter[currentKey] = currentValue.join('\n').trim();
        }

        // Parse arrays
        for (const [key, value] of Object.entries(frontMatter)) {
            if (value.startsWith('[') && value.endsWith(']')) {
                frontMatter[key] = JSON.parse(value);
            }
        }
    }

    return frontMatter;
}

/**
 * Estimate reading time from word count (~200 words/min).
 * @param {string} content - Full markdown content
 * @returns {number} Estimated minutes
 */
function estimateReadingTime(content) {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
}

module.exports = { parseFrontMatter, estimateReadingTime };
