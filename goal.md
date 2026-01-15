# Feature list for "ArchiTechs Registry" (SolidJS, bun-only, D3 charts, Modular Components)

## A. Global site framework

### SolidJS-based docs site

- File-based routing (recommended: SolidStart).

### Theme system

- Light/Dark/System toggle.
- Persist selection in local storage.
- CSS-variable token system for colors, radii, spacing.

### Clipboard utilities

- Copy buttons for code blocks, install commands, and "Copy page URL".
- Copy success feedback (toast).

### Prev/Next navigation

- Automatic based on sidebar ordering.

### On-page Table of Contents

- Auto-generated from headings; scrollspy active section.

### Internal-only access

- Auth gate (SSO/VPN/basic auth), environment banner, optional "internal" watermark.

## B. Content system (docs + page rendering)

### Markdown/MDX (or equivalent) pipeline

- Frontmatter for title/description/keywords/category.
- Supports callouts, tabs, code blocks, and embedded demos.
- check /home/luka/projects/solid-ui how this is done.

### Code block component

- Syntax highlight.
- Optional filename header.
- Copy button (always).
- No package-manager tabs (bun-only standard).

### Reusable page template

- Title, description, install section, dependencies chips, usage, examples, related items.

## C. Registry + install mechanism (shadcn-style, internal)

### Registry JSON endpoints

- `GET /r/<item>.json` for every installable item.

Optional indexes:

- `GET /registry/index.json` (search directory)
- `GET /registry/categories.json`

### Registry item schema

Fields: name, title, description, type, dependencies, registryDependencies, files[], category, keywords, preview.

### Bun-only install commands

- All docs show `bun add …` and `bunx …` only.

Standard command patterns:

- `bunx shadcn@latest init`
- `bunx shadcn@latest add <name>` or `<url>`

### Dependency display

- Dependencies rendered as "chips" (like screenshot).
- Distinguish runtime vs dev dependencies (optional).

### Included components list

- For bundles: show grid of included registry items and short descriptions.
- Each entry links to the individual item page.

## D. Components section (base UI primitives)

### Component catalog

- Pages for each primitive: Input, Select, Dialog, Dropdown Menu, Popover, Tooltip, Tabs, Table, etc.

### Component page features

- Live demo preview.
- Install command + copy.
- Dependencies chips.
- Usage snippet(s).
- Examples (variants/states).
- Related components links.

### Base UI library integration

- Standardize on one primitive system (e.g., @ark-ui/solid).
- Standard icons library (e.g., lucide-solid).
- Standard animation utility (optional, e.g., solid-motionone).

## E. Modular Components section (NEW; your "super-*" wrappers)

### Purpose

- A dedicated section for "modular form-ready" wrappers built on top of base UI components.
- Designed explicitly for @modular-forms/solid integration
- Rename the "super" prefix to "modular"

### Two-tier navigation

**Bundles (install sets)**

- e.g., Super Form bundle page

**Fields (install individually)**

- super-input, super-text-area, super-select, super-searchable-select, super-combobox, super-date-picker, etc.

### Bundle page features (e.g., Super Form)

- Install command for the bundle JSON.
- Dependencies chips (aggregate list).
- Included Components grid with links to each field item.
- Quick notes: intended usage patterns, supported validation behaviors.

### Individual modular component page features

- Install command for that single field wrapper.
- Dependencies chips (only what's needed).
- Usage snippet: minimal working integration with @modular-forms/solid.
- Examples: required/disabled/error states; async options where relevant.
- Related: base component link (e.g., super-select → select).


## F. Blocks section (internal templates)

### Block library

- Categories/tabs (Featured, Sidebar, Auth, etc.).

### Per-block viewer

- Preview/Code toggle.
- "Open in New Tab", "Refresh Preview".
- Install command + copy.
- File tree viewer + code panel per file.

### Registry-backed block definition

- Blocks as registry items with files[], dependencies, and registryDependencies.

## G. Charts section (handmade D3 for Solid)

### Charts gallery

- Categories: Line, Area, Bar, Stacked Bar, Scatter, Tooltips, Axes (as needed).

### Per-chart example page

- Live preview (Solid component).
- Install command + copy (registry item).
- Dependencies chips (d3 modules).
- View code + copy code.

### Shared chart core (internal)

- Scales/axes utilities, tooltip system, formatting helpers.
- Resize observer support for responsive charts.
- Theme-aware styling via CSS variables.

## H. Libraries section (internal packages)

### Library catalog

- Pages like Gatehouse, Solid Convex, Date Utils, etc.

### Library page template

- Install command (`bun add`) + copy.
- Dependencies, usage, API links, examples.
- Version/release notes (optional).

## I. Functions section (utility functions)

### Function catalog

- Pages for reusable utility functions and helpers.
- Categories: Date utilities, String helpers, Array utilities, Object utilities, Validation, Formatting, etc.

### Function page template

- Install command (registry item) + copy.
- Dependencies chips.
- Function signature/API documentation.
- Usage examples with code snippets.
- TypeScript types documentation.
- Related functions links.

### Function registry items

- Functions as registry items with files[], dependencies, and registryDependencies.
- Support for single-file functions and function bundles.
- Tree-shakeable exports.

## J. Quality, accessibility, and DX

### Accessibility

- Keyboard navigation for sidebar and command palette.
- Focus management for dialogs/menus.
- Visible focus rings; ARIA labels for icon buttons.

### Performance

- Route-level code splitting.
- Search index built at build time (or cached server-side).

### Consistency

- Unified page template and typography scale.
- Consistent badge styling for dependencies.
- Single "copy" interaction model everywhere.
