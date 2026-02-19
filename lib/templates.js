/**
 * Template Generators
 * Single source of truth for all cover templates.
 * Each generator receives { title, categoryLabel, icon, colors, brand, social, readTime }.
 */

// === Helpers ===

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '255, 255, 255';
}

// SVG icons for social footer (14px, inline)
const SOCIAL_SVGS = {
    github: (color) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
    linkedin: (color) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    email: (color) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
};

/**
 * Render social footer HTML.
 * @param {object} data - { brand, social, readTime }
 * @param {'light'|'dark'} theme - color scheme
 * @returns {string} HTML for social items
 */
function renderSocialFooter(data, theme) {
    const color = theme === 'dark' ? '#888' : '#64748b';
    const iconColor = theme === 'dark' ? '#aaa' : '#64748b';
    const items = [];

    items.push(`<span>${data.brand}</span>`);

    if (data.social) {
        if (data.social.github) {
            items.push(`<span style="display:inline-flex;align-items:center;gap:5px;">${SOCIAL_SVGS.github(iconColor)} ${data.social.github}</span>`);
        }
        if (data.social.linkedin) {
            items.push(`<span style="display:inline-flex;align-items:center;gap:5px;">${SOCIAL_SVGS.linkedin(iconColor)} ${data.social.linkedin}</span>`);
        }
        if (data.social.email) {
            items.push(`<span style="display:inline-flex;align-items:center;gap:5px;">${SOCIAL_SVGS.email(iconColor)} ${data.social.email}</span>`);
        }
    }

    items.push(`<span>⏱️ ${data.readTime} min</span>`);

    return items.map(i => `<span style="display:inline-flex;align-items:center;">${i}</span>`).join('');
}

// === Template Generators ===

function generateMinimalTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, BlinkMacSystemFont, sans-serif; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%);
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
        <div class="icon-box">${icon}</div>
        <div class="category">${categoryLabel}</div>
        <div class="title">${title}</div>
        <div class="footer">
            ${renderSocialFooter(data, 'dark')}
        </div>
    </div>
</body>
</html>`;
}

function generateDarkTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; background: #0a0a0f; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: #0a0a0f;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 50px;
            position: relative;
            overflow: hidden;
        }
        .accent-bar {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 6px;
            background: linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 100%);
        }
        .bg-shape {
            position: absolute;
            top: 0;
            right: 0;
            width: 50%;
            height: 100%;
            background: linear-gradient(135deg, transparent 0%, rgba(${hexToRgb(colors[0])}, 0.1) 100%);
            clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);
        }
        .icon-badge {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            margin-bottom: 25px;
        }
        .category {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: ${colors[0]};
            margin-bottom: 12px;
        }
        .title {
            font-size: 34px;
            font-weight: 700;
            line-height: 1.3;
            color: #fff;
        }
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px 50px;
            background: rgba(255,255,255,0.03);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="accent-bar"></div>
        <div class="bg-shape"></div>
        <div class="icon-badge">${icon}</div>
        <div class="category">${categoryLabel}</div>
        <div class="title">${title}</div>
        <div class="footer">
            ${renderSocialFooter(data, 'dark')}
        </div>
    </div>
</body>
</html>`;
}

function generateSplitTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            display: flex;
            position: relative;
        }
        .left {
            width: 65%;
            background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 50px;
            position: relative;
        }
        .right {
            width: 35%;
            background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .right::before {
            content: '';
            position: absolute;
            inset: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .icon-large {
            font-size: 120px;
            position: relative;
            z-index: 1;
        }
        .category {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #60a5fa;
            margin-bottom: 15px;
        }
        .title {
            font-size: 32px;
            font-weight: 700;
            line-height: 1.3;
            color: #fff;
        }
        .footer-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 36px;
            background: rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 50px;
            font-size: 11px;
            color: #94a3b8;
            z-index: 2;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="left">
            <div class="category">${categoryLabel}</div>
            <div class="title">${title}</div>
        </div>
        <div class="right">
            <div class="icon-large">${icon}</div>
        </div>
        <div class="footer-bar">
            ${renderSocialFooter(data, 'dark')}
        </div>
    </div>
</body>
</html>`;
}

function generateGlassTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 50px;
            position: relative;
            overflow: hidden;
        }
        .bg-shape {
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
        }
        .shape-1 { width: 300px; height: 300px; top: -100px; right: -50px; }
        .shape-2 { width: 200px; height: 200px; bottom: -50px; left: -50px; }
        .glass-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 20px;
            padding: 35px;
            position: relative;
            z-index: 1;
        }
        .category {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255,255,255,0.8);
            margin-bottom: 12px;
        }
        .title {
            font-size: 30px;
            font-weight: 700;
            line-height: 1.3;
            color: #fff;
        }
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.2);
            font-size: 13px;
            color: rgba(255,255,255,0.7);
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
        <div class="glass-card">
            <div class="category">${categoryLabel}</div>
            <div class="title">${title}</div>
            <div class="footer">
                ${renderSocialFooter(data, 'dark')}
            </div>
        </div>
    </div>
</body>
</html>`;
}

function generateNeonTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; background: #0a0a0a; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: #0a0a0a;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 50px;
            position: relative;
            overflow: hidden;
        }
        .grid-bg {
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(${hexToRgb(colors[0])}, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(${hexToRgb(colors[0])}, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: 0.3;
        }
        .glow-line {
            position: absolute;
            top: 0;
            left: 50%;
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 100%);
            box-shadow: 0 0 20px ${colors[0]};
        }
        .content { position: relative; z-index: 1; }
        .icon-glow {
            width: 70px;
            height: 70px;
            background: rgba(${hexToRgb(colors[0])}, 0.2);
            border: 2px solid ${colors[0]};
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin-bottom: 20px;
            box-shadow: 0 0 30px rgba(${hexToRgb(colors[0])}, 0.5);
        }
        .category {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: ${colors[0]};
            margin-bottom: 12px;
        }
        .title {
            font-size: 32px;
            font-weight: 700;
            line-height: 1.3;
            color: #fff;
            text-shadow: 0 0 20px rgba(${hexToRgb(colors[0])}, 0.5);
        }
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 15px 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #666;
            background: rgba(0,0,0,0.5);
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="grid-bg"></div>
        <div class="glow-line"></div>
        <div class="content">
            <div class="icon-glow">${icon}</div>
            <div class="category">${categoryLabel}</div>
            <div class="title">${title}</div>
        </div>
        <div class="footer">
            ${renderSocialFooter(data, 'dark')}
        </div>
    </div>
</body>
</html>`;
}

function generateMagazineTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%);
            display: flex;
            flex-direction: column;
            padding: 40px;
            position: relative;
        }
        .issue-number {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 60px;
            font-weight: 900;
            color: rgba(${hexToRgb(colors[0])}, 0.15);
            line-height: 1;
        }
        .eyebrow {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: ${colors[0]};
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .title {
            font-size: 38px;
            font-weight: 900;
            line-height: 1.1;
            color: #0f172a;
            margin-bottom: 25px;
        }
        .description {
            font-size: 15px;
            color: #475569;
            line-height: 1.6;
            max-width: 80%;
        }
        .footer {
            position: absolute;
            bottom: 25px;
            left: 40px;
            right: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 20px;
            border-top: 2px solid ${colors[0]};
            font-size: 13px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="issue-number">01</div>
        <div class="eyebrow">
            <span>${icon}</span>
            ${categoryLabel}
        </div>
        <div class="title">${title}</div>
        <div class="description">Approfondimento tecnico su ${categoryLabel}</div>
        <div class="footer">
            ${renderSocialFooter(data, 'light')}
        </div>
    </div>
</body>
</html>`;
}

function generateCodeTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: #1e1e2e;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }
        .title-bar {
            background: #181825;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        .dot.red { background: #ff5f56; }
        .dot.yellow { background: #ffbd2e; }
        .dot.green { background: #27ca4b; }
        .content {
            flex: 1;
            padding: 30px 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .code-line {
            font-family: 'Fira Code', 'JetBrains Mono', monospace;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .keyword { color: #c678dd; }
        .string { color: #98c379; }
        .function { color: #61afef; }
        .comment { color: #5c6370; font-style: italic; }
        .category-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(${hexToRgb(colors[0])}, 0.2);
            color: ${colors[0]};
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 12px;
            font-family: monospace;
            width: fit-content;
            margin-bottom: 15px;
        }
        .title {
            font-size: 28px;
            font-weight: 700;
            color: #abb2bf;
            line-height: 1.4;
        }
        .footer {
            padding: 12px 40px;
            background: #181825;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #5c6370;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="title-bar">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
        </div>
        <div class="content">
            <div class="category-badge">${icon} ${categoryLabel}</div>
            <div class="code-line"><span class="keyword">const</span> <span class="function">articolo</span> = {</div>
            <div class="code-line" style="padding-left: 20px;"><span class="string">titolo</span>: <span class="string">"${title.substring(0, 40)}${title.length > 40 ? '...' : ''}"</span>,</div>
            <div class="code-line" style="padding-left: 20px;"><span class="string">tempo</span>: <span class="string">"${data.readTime} min"</span></div>
            <div class="code-line">};</div>
            <div class="code-line comment">// Leggi l'articolo completo →</div>
        </div>
        <div class="footer">
            ${renderSocialFooter(data, 'dark')}
        </div>
    </div>
</body>
</html>`;
}

function generateMeshTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; background: #0f0f1a; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: #0f0f1a;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 50px;
            position: relative;
            overflow: hidden;
        }
        .mesh-gradient {
            position: absolute;
            inset: 0;
            background:
                radial-gradient(at 40% 20%, hsla(257, 76%, 63%, 0.4) 0px, transparent 50%),
                radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.3) 0px, transparent 50%),
                radial-gradient(at 0% 50%, hsla(355, 85%, 63%, 0.3) 0px, transparent 50%),
                radial-gradient(at 80% 50%, hsla(340, 80%, 60%, 0.3) 0px, transparent 50%),
                radial-gradient(at 0% 100%, hsla(22, 100%, 60%, 0.3) 0px, transparent 50%);
            filter: blur(40px);
        }
        .content { position: relative; z-index: 1; }
        .icon-float {
            width: 90px;
            height: 90px;
            background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin-bottom: 25px;
            backdrop-filter: blur(10px);
        }
        .category {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255,255,255,0.7);
            margin-bottom: 12px;
        }
        .title {
            font-size: 34px;
            font-weight: 700;
            line-height: 1.3;
            color: #fff;
        }
        .footer-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 36px;
            background: rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 50px;
            font-size: 11px;
            color: #888;
            z-index: 2;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="mesh-gradient"></div>
        <div class="content">
            <div class="icon-float">${icon}</div>
            <div class="category">${categoryLabel}</div>
            <div class="title">${title}</div>
        </div>
        <div class="footer-bar">
            ${renderSocialFooter(data, 'dark')}
        </div>
    </div>
</body>
</html>`;
}

// === New Templates ===

function generateTerminalTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Fira Code', 'JetBrains Mono', 'Courier New', monospace; background: #0c0c0c; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: #0c0c0c;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }
        .scanlines {
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.15) 2px,
                rgba(0,0,0,0.15) 4px
            );
            pointer-events: none;
            z-index: 3;
        }
        .tab-bar {
            background: #1a1a2e;
            padding: 10px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid #333;
        }
        .tab {
            padding: 6px 16px;
            border-radius: 6px 6px 0 0;
            font-size: 12px;
            color: #888;
        }
        .tab.active {
            background: #0c0c0c;
            color: ${colors[0]};
        }
        .terminal {
            flex: 1;
            padding: 30px 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            z-index: 1;
        }
        .line {
            font-size: 15px;
            line-height: 2;
            color: #c0c0c0;
        }
        .prompt { color: ${colors[0]}; }
        .flag { color: ${colors[1]}; }
        .str { color: #98c379; }
        .dim { color: #555; }
        .comment { color: #555; font-style: italic; }
        .cursor {
            display: inline-block;
            width: 10px;
            height: 18px;
            background: ${colors[0]};
            vertical-align: text-bottom;
            opacity: 0.8;
        }
        .footer {
            padding: 12px 40px;
            background: #1a1a2e;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #555;
            font-family: 'Fira Code', 'JetBrains Mono', monospace;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="scanlines"></div>
        <div class="tab-bar">
            <span class="tab active">${icon} ${categoryLabel}</span>
            <span class="tab">zsh</span>
        </div>
        <div class="terminal">
            <div class="line"><span class="dim"># ${categoryLabel}</span></div>
            <div class="line"><span class="prompt">$</span> cat <span class="str">article.md</span> <span class="flag">--title</span></div>
            <div class="line"><span class="str">"${title}"</span></div>
            <div class="line"></div>
            <div class="line"><span class="prompt">$</span> read <span class="flag">--estimate</span></div>
            <div class="line">⏱️  ${data.readTime} min</div>
            <div class="line"></div>
            <div class="line"><span class="prompt">$</span> <span class="cursor"></span></div>
        </div>
        <div class="footer">
            ${renderSocialFooter(data, 'dark')}
        </div>
    </div>
</body>
</html>`;
}

function generatePolaroidTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .bg-dots {
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
            background-size: 24px 24px;
            opacity: 0.5;
        }
        .card {
            width: 82%;
            background: #fff;
            border-radius: 4px;
            box-shadow: 0 25px 60px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
            padding: 30px 30px 40px 30px;
            position: relative;
            z-index: 1;
            transform: rotate(-1.5deg);
        }
        .photo {
            width: 100%;
            height: 55%;
            background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%);
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
            position: relative;
            min-height: 280px;
        }
        .photo-icon {
            font-size: 80px;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
        }
        .photo-label {
            position: absolute;
            top: 16px;
            left: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255,255,255,0.85);
            background: rgba(0,0,0,0.2);
            padding: 4px 12px;
            border-radius: 4px;
        }
        .caption {
            font-size: 22px;
            font-weight: 700;
            color: #1e293b;
            line-height: 1.3;
            margin-bottom: 10px;
        }
        .meta-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="bg-dots"></div>
        <div class="card">
            <div class="photo">
                <span class="photo-label">${categoryLabel}</span>
                <span class="photo-icon">${icon}</span>
            </div>
            <div class="caption">${title}</div>
            <div class="meta-row">
                ${renderSocialFooter(data, 'light')}
            </div>
        </div>
    </div>
</body>
</html>`;
}

function generateBlueprintTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: ${colors[0]};
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 50px 60px;
            position: relative;
            overflow: hidden;
        }
        .grid {
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
            background-size: 30px 30px;
        }
        .grid-major {
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px);
            background-size: 150px 150px;
        }
        .corner-mark {
            position: absolute;
            width: 40px;
            height: 40px;
            border: 2px solid rgba(255,255,255,0.25);
        }
        .corner-tl { top: 30px; left: 30px; border-right: none; border-bottom: none; }
        .corner-tr { top: 30px; right: 30px; border-left: none; border-bottom: none; }
        .corner-bl { bottom: 30px; left: 30px; border-right: none; border-top: none; }
        .corner-br { bottom: 30px; right: 30px; border-left: none; border-top: none; }
        .content { position: relative; z-index: 1; }
        .ref-number {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: rgba(255,255,255,0.4);
            margin-bottom: 20px;
            font-family: 'Fira Code', monospace;
        }
        .icon-circle {
            width: 70px;
            height: 70px;
            border: 2px solid rgba(255,255,255,0.4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin-bottom: 20px;
        }
        .title {
            font-size: 36px;
            font-weight: 700;
            line-height: 1.25;
            color: #fff;
            max-width: 90%;
        }
        .dimension-line {
            position: absolute;
            right: 60px;
            top: 50%;
            transform: translateY(-50%);
            width: 2px;
            height: 60%;
            background: rgba(255,255,255,0.15);
        }
        .dimension-line::before, .dimension-line::after {
            content: '';
            position: absolute;
            left: -4px;
            width: 10px;
            height: 2px;
            background: rgba(255,255,255,0.15);
        }
        .dimension-line::before { top: 0; }
        .dimension-line::after { bottom: 0; }
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 15px 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: rgba(255,255,255,0.45);
            border-top: 1px solid rgba(255,255,255,0.1);
            z-index: 1;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="grid"></div>
        <div class="grid-major"></div>
        <div class="corner-mark corner-tl"></div>
        <div class="corner-mark corner-tr"></div>
        <div class="corner-mark corner-bl"></div>
        <div class="corner-mark corner-br"></div>
        <div class="dimension-line"></div>
        <div class="content">
            <div class="ref-number">REF. ${categoryLabel}</div>
            <div class="icon-circle">${icon}</div>
            <div class="title">${title}</div>
        </div>
        <div class="footer">
            ${renderSocialFooter(data, 'dark')}
        </div>
    </div>
</body>
</html>`;
}

function generateDuotoneTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            position: relative;
            overflow: hidden;
        }
        .bg-left {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${colors[0]};
        }
        .bg-right {
            position: absolute;
            top: 0;
            right: 0;
            width: 55%;
            height: 100%;
            background: ${colors[1]};
            clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
        }
        .content {
            position: relative;
            z-index: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 50px 60px;
        }
        .icon-row {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
        }
        .icon-bg {
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
        }
        .category {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: rgba(255,255,255,0.85);
        }
        .title {
            font-size: 48px;
            font-weight: 900;
            line-height: 1.1;
            color: #fff;
            max-width: 75%;
        }
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: rgba(255,255,255,0.7);
            z-index: 1;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="bg-left"></div>
        <div class="bg-right"></div>
        <div class="content">
            <div class="icon-row">
                <div class="icon-bg">${icon}</div>
                <div class="category">${categoryLabel}</div>
            </div>
            <div class="title">${title}</div>
        </div>
        <div class="footer">
            ${renderSocialFooter(data, 'dark')}
        </div>
    </div>
</body>
</html>`;
}

function generateRetroTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Courier New', monospace; background: #1a1a2e; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: #1a1a2e;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 50px 60px;
            position: relative;
            overflow: hidden;
        }
        .scanlines {
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(0,0,0,0.2) 3px,
                rgba(0,0,0,0.2) 6px
            );
            pointer-events: none;
            z-index: 3;
        }
        .noise {
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%);
            z-index: 2;
        }
        .stripe-top, .stripe-bottom {
            position: absolute;
            left: 0;
            right: 0;
            height: 4px;
        }
        .stripe-top {
            top: 40px;
            background: linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[0]});
        }
        .stripe-bottom {
            bottom: 60px;
            background: linear-gradient(90deg, ${colors[1]}, ${colors[0]}, ${colors[1]});
        }
        .content { position: relative; z-index: 1; }
        .header-line {
            font-size: 11px;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: ${colors[0]};
            margin-bottom: 8px;
            opacity: 0.8;
        }
        .icon-text {
            font-size: 60px;
            margin-bottom: 16px;
        }
        .category {
            display: inline-block;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: #1a1a2e;
            background: ${colors[0]};
            padding: 5px 14px;
            margin-bottom: 16px;
        }
        .title {
            font-size: 32px;
            font-weight: 700;
            line-height: 1.35;
            color: #e0e0e0;
            font-family: 'Mulish', -apple-system, sans-serif;
            max-width: 85%;
        }
        .blink-line {
            margin-top: 20px;
            font-size: 14px;
            color: ${colors[1]};
        }
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 12px 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #555;
            z-index: 4;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="scanlines"></div>
        <div class="noise"></div>
        <div class="stripe-top"></div>
        <div class="stripe-bottom"></div>
        <div class="content">
            <div class="header-line">/// ${data.brand} ///</div>
            <div class="icon-text">${icon}</div>
            <div class="category">${categoryLabel}</div>
            <div class="title">${title}</div>
            <div class="blink-line">> READ MORE _ ⏱️ ${data.readTime} min</div>
        </div>
        <div class="footer">
            ${renderSocialFooter(data, 'dark')}
        </div>
    </div>
</body>
</html>`;
}

function generateWaveTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;
    const r0 = hexToRgb(colors[0]);
    const r1 = hexToRgb(colors[1]);

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: #0f172a;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 50px 60px;
            position: relative;
            overflow: hidden;
        }
        .wave {
            position: absolute;
            left: 0;
            right: 0;
            height: 200px;
        }
        .wave-1 {
            bottom: -20px;
            background: linear-gradient(135deg, rgba(${r0}, 0.6), rgba(${r1}, 0.6));
            clip-path: polygon(
                0% 60%, 5% 55%, 10% 52%, 15% 50%, 20% 50%, 25% 52%,
                30% 55%, 35% 58%, 40% 60%, 45% 58%, 50% 55%, 55% 50%,
                60% 48%, 65% 50%, 70% 55%, 75% 60%, 80% 62%, 85% 58%,
                90% 52%, 95% 50%, 100% 52%, 100% 100%, 0% 100%
            );
            z-index: 1;
        }
        .wave-2 {
            bottom: -40px;
            background: linear-gradient(135deg, rgba(${r0}, 0.3), rgba(${r1}, 0.3));
            clip-path: polygon(
                0% 70%, 5% 65%, 10% 60%, 15% 58%, 20% 60%, 25% 65%,
                30% 68%, 35% 70%, 40% 68%, 45% 62%, 50% 58%, 55% 55%,
                60% 58%, 65% 62%, 70% 68%, 75% 72%, 80% 70%, 85% 65%,
                90% 60%, 95% 58%, 100% 62%, 100% 100%, 0% 100%
            );
        }
        .wave-3 {
            bottom: -60px;
            background: linear-gradient(135deg, rgba(${r0}, 0.15), rgba(${r1}, 0.15));
            clip-path: polygon(
                0% 80%, 5% 75%, 10% 72%, 15% 70%, 20% 72%, 25% 75%,
                30% 78%, 35% 80%, 40% 78%, 45% 72%, 50% 68%, 55% 65%,
                60% 68%, 65% 72%, 70% 78%, 75% 82%, 80% 80%, 85% 75%,
                90% 70%, 95% 68%, 100% 72%, 100% 100%, 0% 100%
            );
        }
        .top-glow {
            position: absolute;
            top: -80px;
            right: -80px;
            width: 350px;
            height: 350px;
            background: radial-gradient(circle, rgba(${r0}, 0.2) 0%, transparent 70%);
        }
        .content { position: relative; z-index: 2; }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.12);
            padding: 8px 18px;
            border-radius: 50px;
            font-size: 13px;
            color: ${colors[0]};
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
            width: fit-content;
        }
        .title {
            font-size: 40px;
            font-weight: 800;
            line-height: 1.15;
            color: #fff;
            max-width: 80%;
        }
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 14px 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: rgba(255,255,255,0.4);
            z-index: 3;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="top-glow"></div>
        <div class="wave wave-3"></div>
        <div class="wave wave-2"></div>
        <div class="wave wave-1"></div>
        <div class="content">
            <div class="badge">
                <span>${icon}</span>
                <span>${categoryLabel}</span>
            </div>
            <div class="title">${title}</div>
        </div>
        <div class="footer">
            ${renderSocialFooter(data, 'dark')}
        </div>
    </div>
</body>
</html>`;
}

function generateOutlineTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: #fafafa;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 50px 60px;
            position: relative;
            overflow: hidden;
        }
        .border-frame {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid ${colors[0]};
            border-radius: 8px;
        }
        .accent-dot {
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 2px solid ${colors[1]};
            top: -30px;
            right: -30px;
            opacity: 0.3;
        }
        .accent-dot-2 {
            position: absolute;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 2px solid ${colors[0]};
            bottom: 60px;
            right: 80px;
            opacity: 0.15;
        }
        .content { position: relative; z-index: 1; }
        .icon-outline {
            width: 64px;
            height: 64px;
            border: 2px solid ${colors[0]};
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin-bottom: 24px;
        }
        .category {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: ${colors[0]};
            margin-bottom: 12px;
        }
        .title {
            font-size: 38px;
            font-weight: 800;
            line-height: 1.15;
            color: #1a1a1a;
            max-width: 85%;
        }
        .accent-line {
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, ${colors[0]}, ${colors[1]});
            border-radius: 2px;
            margin-top: 24px;
        }
        .footer {
            position: absolute;
            bottom: 30px;
            left: 60px;
            right: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #999;
            z-index: 1;
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="border-frame"></div>
        <div class="accent-dot"></div>
        <div class="accent-dot-2"></div>
        <div class="content">
            <div class="icon-outline">${icon}</div>
            <div class="category">${categoryLabel}</div>
            <div class="title">${title}</div>
            <div class="accent-line"></div>
        </div>
        <div class="footer">
            ${renderSocialFooter(data, 'light')}
        </div>
    </div>
</body>
</html>`;
}

function generateStackTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;

    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
        body { font-family: 'Mulish', -apple-system, sans-serif; }
        .cover {
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        .card-back-2 {
            position: absolute;
            width: 76%;
            height: 72%;
            background: rgba(${hexToRgb(colors[0])}, 0.15);
            border-radius: 16px;
            transform: rotate(4deg) translateY(-8px);
            border: 1px solid rgba(${hexToRgb(colors[0])}, 0.2);
        }
        .card-back-1 {
            position: absolute;
            width: 78%;
            height: 74%;
            background: rgba(${hexToRgb(colors[0])}, 0.25);
            border-radius: 16px;
            transform: rotate(2deg) translateY(-4px);
            border: 1px solid rgba(${hexToRgb(colors[0])}, 0.3);
        }
        .card-main {
            position: relative;
            width: 80%;
            height: 76%;
            background: linear-gradient(160deg, ${colors[0]}ee, ${colors[1]}dd);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 40px 50px;
            z-index: 1;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            padding: 6px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 1px;
            width: fit-content;
            margin-bottom: 20px;
        }
        .title {
            font-size: 34px;
            font-weight: 700;
            line-height: 1.25;
            color: #fff;
            max-width: 90%;
        }
        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.2);
            font-size: 12px;
            color: rgba(255,255,255,0.7);
        }
    </style>
</head>
<body>
    <div class="cover">
        <div class="card-back-2"></div>
        <div class="card-back-1"></div>
        <div class="card-main">
            <div class="badge">${icon} ${categoryLabel}</div>
            <div class="title">${title}</div>
            <div class="card-footer">
                ${renderSocialFooter(data, 'dark')}
            </div>
        </div>
    </div>
</body>
</html>`;
}

// === Template Registry ===

const TEMPLATES = {
    minimal:   { name: 'Minimal Gradient', generate: generateMinimalTemplate },
    dark:      { name: 'Dark Geometric',   generate: generateDarkTemplate },
    split:     { name: 'Split Color',      generate: generateSplitTemplate },
    glass:     { name: 'Glassmorphism',    generate: generateGlassTemplate },
    neon:      { name: 'Neon Cyber',       generate: generateNeonTemplate },
    magazine:  { name: 'Magazine Style',   generate: generateMagazineTemplate },
    code:      { name: 'Code Editor',      generate: generateCodeTemplate },
    mesh:      { name: 'Gradient Mesh',    generate: generateMeshTemplate },
    terminal:  { name: 'Terminal',         generate: generateTerminalTemplate },
    polaroid:  { name: 'Polaroid',         generate: generatePolaroidTemplate },
    blueprint: { name: 'Blueprint',        generate: generateBlueprintTemplate },
    duotone:   { name: 'Duotone',          generate: generateDuotoneTemplate },
    retro:     { name: 'Retro CRT',        generate: generateRetroTemplate },
    wave:      { name: 'Wave',             generate: generateWaveTemplate },
    outline:   { name: 'Outline',          generate: generateOutlineTemplate },
    stack:     { name: 'Stack',            generate: generateStackTemplate },
};

module.exports = {
    hexToRgb,
    renderSocialFooter,
    TEMPLATES,
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
};
