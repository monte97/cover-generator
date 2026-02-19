# Design: Extract Templates to Handlebars Files

**Date:** 2026-02-19
**Status:** Approved

## Problem

All 16 cover templates are hardcoded as JS functions in `lib/templates.js` (~1750 lines). This makes them hard to edit visually and the file unwieldy to navigate.

## Goals

1. Each template is a standalone `.hbs` file editable in any HTML editor
2. Social footer is a shared partial (DRY)
3. Auto-discovery of templates (add a file, it appears automatically)
4. The CLI interface (`index.js`, `generate-all.js`) remains unchanged

## Approach: Handlebars `.hbs` files

### File Structure

```
templates/
  minimal.hbs
  dark.hbs
  split.hbs
  glass.hbs
  neon.hbs
  magazine.hbs
  code.hbs
  mesh.hbs
  terminal.hbs
  polaroid.hbs
  blueprint.hbs
  duotone.hbs
  retro.hbs
  wave.hbs
  outline.hbs
  stack.hbs
  partials/
    _social-footer.hbs
```

### Template Metadata

Each `.hbs` file starts with a Handlebars comment containing the display name:

```html
{{!-- name: Minimal Gradient --}}
<!DOCTYPE html>
...
```

### Template Data

Every template receives:

```js
{ title, categoryLabel, icon, colors, brand, social, readTime, width, height }
```

`width` and `height` are injected by the loader (previously they were function parameters).

### Handlebars Helpers

Registered globally:

- `{{hexToRgb color}}` — converts `#8B5CF6` to `"139, 92, 246"` for CSS `rgba()` usage
- `{{truncate str len}}` — truncates string to `len` chars + "..." (used by `code` template)

### Social Footer Partial

`partials/_social-footer.hbs` — contains the SVG inline icons and conditional logic:

```handlebars
{{> socialFooter theme="dark"}}
```

Uses `{{#if social.github}}` for conditional rendering of each social icon.

### Template Loader (`lib/templates.js` rewrite)

1. Register Handlebars helpers (`hexToRgb`, `truncate`)
2. Register partials from `templates/partials/`
3. Auto-discover all `*.hbs` files in `templates/`
4. Extract display name from `{{!-- name: ... --}}` comment
5. Compile each into a Handlebars template
6. Expose `TEMPLATES` object with same `{ name, generate(data, w, h) }` interface

### Impact on Other Files

- **`index.js`**: No changes — same `TEMPLATES[name].generate(data, w, h)` call
- **`generate-all.js`**: No changes
- **`export-templates.js`**: Simplified — reads from auto-discovered `TEMPLATES` registry instead of importing 16 individual functions

### Dependency

Add `handlebars` to `devDependencies` in root `package.json`.
