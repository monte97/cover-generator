# Template Examples

Questa directory contiene anteprime HTML statiche di tutti i 16 template disponibili.

## Visualizzare le anteprime

Apri `index.html` nel browser per una galleria con tutti i template:

```bash
# Linux
xdg-open templates/examples/index.html

# macOS
open templates/examples/index.html
```

Oppure apri i singoli file per vedere un template specifico a dimensione reale.

## File generati

| File | Template |
|------|----------|
| [`01-blueprint.html`](01-blueprint.html) | Blueprint |
| [`02-code.html`](02-code.html) | Code Editor |
| [`03-dark.html`](03-dark.html) | Dark Geometric |
| [`04-duotone.html`](04-duotone.html) | Duotone |
| [`05-glass.html`](05-glass.html) | Glassmorphism |
| [`06-magazine.html`](06-magazine.html) | Magazine Style |
| [`07-mesh.html`](07-mesh.html) | Gradient Mesh |
| [`08-minimal.html`](08-minimal.html) | Minimal Gradient |
| [`09-neon.html`](09-neon.html) | Neon Cyber |
| [`10-outline.html`](10-outline.html) | Outline |
| [`11-polaroid.html`](11-polaroid.html) | Polaroid |
| [`12-retro.html`](12-retro.html) | Retro CRT |
| [`13-split.html`](13-split.html) | Split Color |
| [`14-stack.html`](14-stack.html) | Stack |
| [`15-terminal.html`](15-terminal.html) | Terminal |
| [`16-wave.html`](16-wave.html) | Wave |

## Rigenerare

Per rigenerare le anteprime dopo aver modificato un template:

```bash
make export
# oppure
npm run export
```

## File legacy

| File | Descrizione |
|------|-------------|
| `alternative-templates.html` | Vecchia anteprima degli 8 template originali |
| `cover-design-final.html` | Design minimale originale |
