/**
 * Cover Generator Configuration
 * Single source of truth for branding, social links, categories, and defaults.
 */

module.exports = {
    // Branding
    brand: 'montelli.dev',

    // Social links (shown in cover footer)
    // Set to null to hide a specific icon
    social: {
        github: 'monte97',
        linkedin: 'francesco-montelli',
        email: 'francesco@montelli.dev',
    },

    // Output defaults
    defaults: {
        template: 'gen-random',
        format: 'both',           // linkedin | blog | both
        outputDir: 'scripts/cover-generator/output',
        contentDir: 'content/posts',
    },

    // Category configuration: colors, icons, labels
    categories: {
        'kafka': {
            colors: ['#8B5CF6', '#F59E0B'],
            icon: '📡',
            label: 'Kafka Series',
        },
        'keycloak': {
            colors: ['#DC2626', '#EC4899'],
            icon: '🔑',
            label: 'Security',
        },
        'security': {
            colors: ['#7F1D1D', '#DC2626'],
            icon: '🔒',
            label: 'Security',
        },
        'kubernetes': {
            colors: ['#2563EB', '#06B6D4'],
            icon: '☸️',
            label: 'Cloud Native',
        },
        'cloud native': {
            colors: ['#2563EB', '#06B6D4'],
            icon: '☁️',
            label: 'Cloud Native',
        },
        'testing': {
            colors: ['#059669', '#10B981'],
            icon: '🧪',
            label: 'Testing',
        },
        'e2e testing': {
            colors: ['#059669', '#10B981'],
            icon: '🎯',
            label: 'E2E Testing',
        },
        'quality engineering': {
            colors: ['#059669', '#10B981'],
            icon: '✅',
            label: 'Quality Engineering',
        },
        'devops': {
            colors: ['#4F46E5', '#7C3AED'],
            icon: '🚀',
            label: 'DevOps',
        },
        'cicd': {
            colors: ['#4F46E5', '#7C3AED'],
            icon: '🔄',
            label: 'CI/CD',
        },
        'ci/cd': {
            colors: ['#4F46E5', '#7C3AED'],
            icon: '🔄',
            label: 'CI/CD',
        },
        'web development': {
            colors: ['#0891B2', '#14B8A6'],
            icon: '🌐',
            label: 'Web Development',
        },
        'frontend': {
            colors: ['#0891B2', '#14B8A6'],
            icon: '⚛️',
            label: 'Frontend',
        },
        'backend': {
            colors: ['#0891B2', '#14B8A6'],
            icon: '⚙️',
            label: 'Backend',
        },
        'observability': {
            colors: ['#0E7490', '#06B6D4'],
            icon: '📊',
            label: 'Observability',
        },
        'monitoring': {
            colors: ['#0E7490', '#06B6D4'],
            icon: '📈',
            label: 'Monitoring',
        },
        'platform engineering': {
            colors: ['#6D28D9', '#A855F7'],
            icon: '🏗️',
            label: 'Platform Engineering',
        },
        'homelab': {
            colors: ['#047857', '#34D399'],
            icon: '🏠',
            label: 'Homelab',
        },
        'infrastruttura': {
            colors: ['#64748B', '#94A3B8'],
            icon: '🖥️',
            label: 'Infrastructure',
        },
        'infrastructure': {
            colors: ['#64748B', '#94A3B8'],
            icon: '🖥️',
            label: 'Infrastructure',
        },
        'performance engineering': {
            colors: ['#EA580C', '#FB923C'],
            icon: '⚡',
            label: 'Performance',
        },
        'event-driven': {
            colors: ['#8B5CF6', '#F59E0B'],
            icon: '📡',
            label: 'Event-Driven',
        },
        'identity management': {
            colors: ['#DC2626', '#EC4899'],
            icon: '🆔',
            label: 'Identity',
        },
        'automazione': {
            colors: ['#4F46E5', '#7C3AED'],
            icon: '🤖',
            label: 'Automation',
        },
        'automation': {
            colors: ['#4F46E5', '#7C3AED'],
            icon: '🤖',
            label: 'Automation',
        },
        'default': {
            colors: ['#475569', '#94A3B8'],
            icon: '📝',
            label: 'Article',
        },
    },

    // Keyword matching for title-based detection (Priority 3)
    titleKeywords: {
        'kafka': 'kafka',
        'keycloak': 'keycloak',
        'kubernetes': 'kubernetes',
        'k8s': 'kubernetes',
        'playwright': 'testing',
        'testing': 'testing',
        'opentelemetry': 'observability',
        'otel': 'observability',
        'cluster api': 'kubernetes',
        'capi': 'kubernetes',
        'vue': 'web development',
    },
};
