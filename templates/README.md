# Cover Templates

Questa directory contiene i template per la generazione delle copertine.

## 📁 Struttura

```
templates/
├── README.md                    # Questa documentazione
├── cover-template.html          # Template HTML base (riferimento)
├── examples/                    # Esempi e anteprime
│   ├── README.md
│   ├── alternative-templates.html  # Anteprima tutti i template
│   └── cover-design-final.html     # Design minimale (storico)
└── html/                        # Template statici per git
    ├── README.md
    ├── index.html               # Index con anteprima
    ├── 01-minimal.html          # Minimal Gradient
    ├── 02-dark.html             # Dark Geometric
    ├── 03-split.html            # Split Color
    ├── 04-glass.html            # Glassmorphism
    ├── 05-neon.html             # Neon Cyber
    ├── 06-magazine.html         # Magazine Style
    ├── 07-code.html             # Code Editor
    └── 08-mesh.html             # Gradient Mesh
```

## 📄 File

| Cartella/File | Descrizione |
|---------------|-------------|
| `html/` | **Template statici HTML** - Tracciati con git |
| `examples/` | Esempi e anteprime visive |
| `cover-template.html` | Template base (riferimento tecnico) |

## 🎨 Template Disponibili

I template sono implementati in `generate-cover.js` come funzioni JavaScript:

| Template | Funzione | ID |
|----------|----------|-----|
| Minimal Gradient | `generateMinimalTemplate()` | `minimal` |
| Dark Geometric | `generateDarkTemplate()` | `dark` |
| Split Color | `generateSplitTemplate()` | `split` |
| Glassmorphism | `generateGlassTemplate()` | `glass` |
| Neon Cyber | `generateNeonTemplate()` | `neon` |
| Magazine Style | `generateMagazineTemplate()` | `magazine` |
| Code Editor | `generateCodeTemplate()` | `code` |
| Gradient Mesh | `generateMeshTemplate()` | `mesh` |

## 🔧 Utilizzo

### Anteprima Template Statici (HTML)

Apri l'index per vedere tutti i template:

```bash
# macOS
open scripts/cover-generator/templates/html/index.html

# Linux
xdg-open scripts/cover-generator/templates/html/index.html
```

### Esempi e Anteprime

```bash
# Apri esempi alternativi
open scripts/cover-generator/templates/examples/alternative-templates.html
```

### Generazione con Template

```bash
# Usa template minimal (default)
npm run cover:gen -- content/posts/kafka/01-intro

# Usa template dark
npm run cover:gen -- content/posts/kafka/01-intro --template dark

# Usa template glass
npm run cover:gen -- content/posts/kafka/01-intro --template glass
```

## 📝 Aggiungere un Nuovo Template

1. Crea la funzione generatore in `generate-cover.js`:

```javascript
function generateMyTemplate(data, width, height) {
    const { title, categoryLabel, icon, colors } = data;
    
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        /* CSS del template */
        .cover {
            width: ${width}px;
            height: ${height}px;
            /* ... */
        }
    </style>
</head>
<body>
    <div class="cover">
        <!-- HTML del template -->
    </div>
</body>
</html>`;
}
```

2. Registra il template in `TEMPLATES`:

```javascript
const TEMPLATES = {
    minimal: { name: 'Minimal Gradient', generate: generateMinimalTemplate },
    mytemplate: { name: 'My Template', generate: generateMyTemplate },
    // ...
};
```

3. Usa il nuovo template:

```bash
npm run cover:gen -- content/posts/kafka/01-intro --template mytemplate
```

## 🎯 Struttura Template

Ogni template HTML deve:

1. Impostare dimensioni esplicite di `html`, `body` e `.cover`
2. Usare le dimensioni passate come parametri (`width`, `height`)
3. Includere tutti gli elementi necessari (titolo, categoria, icona, brand, meta)
4. Usare i colori dal parametro `data.colors`

### Elementi Richiesti

```html
<div class="cover">
    <!-- Icona (opzionale, dipende dal template) -->
    <div class="icon-box">${icon}</div>
    
    <!-- Categoria -->
    <div class="category">${categoryLabel}</div>
    
    <!-- Titolo -->
    <div class="title">${title}</div>
    
    <!-- Brand (posizione varia per template) -->
    <div class="brand">${data.brand}</div>
    
    <!-- Meta info (reading time) -->
    <div class="meta">
        <span>📖 Article</span>
        <span>⏱️ ${data.readTime} min</span>
    </div>
</div>
```

## 📐 Dimensioni Standard

| Formato | Width | Height | Aspect Ratio |
|---------|-------|--------|--------------|
| LinkedIn | 1200px | 627px | 1.91:1 |
| Blog | 1280px | 720px | 16:9 |

## 🎨 Variabili Template

Ogni funzione template riceve:

```javascript
{
    title: string,        // Titolo dell'articolo (senza virgolette)
    categoryLabel: string, // Label della categoria (es. "Kafka Series")
    icon: string,         // Emoji icona (es. "📡")
    colors: [string, string], // Array di 2 colori hex
    brand: string,        // Brand name (es. "francescomontelli.com")
    readTime: number      // Reading time in minuti
}
```

E le dimensioni:

```javascript
width: number   // Larghezza in pixel
height: number  // Altezza in pixel
```

## 🔗 Riferimenti

- [`generate-cover.js`](../generate-cover.js) - Implementazione template
- [`QUICKSTART.md`](../QUICKSTART.md) - Guida rapida
- [`COVER_GENERATOR.md`](../COVER_GENERATOR.md) - Documentazione completa
