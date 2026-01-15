# ArchiTechs Registry - Product Requirements Document

## Overview

**Product Name:** ArchiTechs Registry  
**Description:** A comprehensive SolidJS component registry and documentation site featuring base UI components, modular form wrappers, blocks, D3 charts, internal libraries, and utility functions. Built with bun-only tooling and shadcn-style installation.

**Target Audience:** Internal team initially, transitioning to public open-source registry  
**Tech Stack:** SolidJS, Bun, D3 (handmade charts), Vinxi, TailwindCSS

---

## Goals

1. Provide a unified registry for all reusable SolidJS components, hooks, utilities, and libraries
2. Enable shadcn-style installation via `bunx shadcn@latest add <name>` or URL
3. Document all registry items with consistent page templates, live demos, and copy-ready code
4. Rename "super-*" components to "modular-*" throughout the codebase
5. Build D3 chart system from scratch with SolidJS integration
6. Ship as a single milestone with all sections complete

---

## Sections & Features

### A. Global Site Framework

#### A1. Clipboard Utilities
- Copy buttons on all code blocks, install commands, and "Copy page URL"
- Toast notification on successful copy (using solid-sonner)

#### A2. Prev/Next Navigation
- Auto-generated from sidebar ordering
- Displayed at bottom of content pages

#### A3. On-Page Table of Contents
- Auto-generated from page headings (h2, h3)
- Scrollspy highlighting for active section
- Sticky positioning in right sidebar

#### A4. Command Palette Search (⌘K)
- Client-side fuzzy search across all content (FlexSearch/Fuse.js)
- Build-time index generation
- Categories: Components, Modular, Blocks, Charts, Libraries, Functions, Hooks

---

### B. Content System

#### B1. Page Authoring
- Pure TSX pages with embedded markdown strings (current approach)
- Frontmatter-equivalent via page metadata exports (title, description, keywords, category)

#### B2. Code Block Component
- Syntax highlighting (Shiki - already installed)
- Optional filename header
- Always-visible copy button
- Bun-only commands (no package manager tabs)

#### B3. Reusable Page Template
Standard sections for all registry item pages:
- Title & description
- Install command with copy button
- Dependencies chips (runtime vs dev optional distinction)
- Usage code snippet(s)
- Live demo preview (inline, not iframe)
- Examples (variants/states)
- Related items links

---

### C. Registry Infrastructure

#### C1. Registry JSON Endpoints
**Required:**
- `GET /r/<item>.json` - Individual item (existing pattern in `/public/r/`)

**Index endpoints:**
- `GET /r/registry.json` - Full registry index (exists)
- `GET /r/categories.json` - Category listing (to add)

#### C2. Registry Item Schema
Current schema (maintain compatibility):
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "string",
  "type": "registry:ui | registry:hook | registry:lib | registry:block | registry:chart | registry:function",
  "title": "string",
  "description": "string",
  "dependencies": ["string"],
  "registryDependencies": ["string"],
  "files": [{ "path": "string", "type": "string", "content": "string" }],
  "category": "string",
  "keywords": ["string"]
}
```

#### C3. Install Commands
All documentation uses bun-only:
- `bunx shadcn@latest init`
- `bunx shadcn@latest add <name>`
- `bunx shadcn@latest add <full-url>`
- `bun add <package>` for npm dependencies

#### C4. Dependency Display
- Chips/badges for each dependency
- Link to npm/registry item where applicable
- Visual distinction between runtime and dev dependencies (optional)

---

### D. Components Section (Base UI Primitives)

#### D1. Component Catalog
Pages for each primitive built on @ark-ui/solid and @kobalte/core:
- Alert, Avatar, Badge, Breadcrumb, Button
- Card, Carousel, Checkbox, Collapsible, Color Picker, Combobox, Command
- Context Menu, Date Picker, Dialog, Dropdown Menu
- Hover Card, Input, Label, Popover, Progress
- Select, Separator, Sheet, Skeleton, Switch
- Table, Tabs, Textarea, Tooltip

#### D2. Component Page Features
- Live inline demo preview
- Install command + copy
- Dependencies chips
- Usage snippet(s)
- Examples (variants/states)
- Related components links

#### D3. Base Libraries
- Primitives: @ark-ui/solid, @kobalte/core
- Icons: lucide-solid
- Animation: solid-motionone

---

### E. Modular Components Section (Form Wrappers)

#### E1. Rename Task
- Rename all "super-*" to "modular-*" in:
  - File names
  - Component names
  - Registry items
  - Documentation

#### E2. Purpose
- Dedicated section for @modular-forms/solid integrated wrappers
- Pre-built form field components with validation display, error states

#### E3. Navigation Structure
**Bundles:**
- Modular Form (bundle page)

**Individual Fields:**
- modular-input
- modular-textarea
- modular-select
- modular-searchable-select
- modular-combobox
- modular-date-picker
- modular-checkbox
- modular-switch
- (others as applicable)

#### E4. Bundle Page Features
- Install command for bundle JSON
- Aggregate dependencies chips
- "Included Components" grid with links to each field
- Usage patterns and validation behavior notes

#### E5. Individual Field Page Features
- Install command for single field
- Dependencies chips (only what's needed)
- Usage snippet with @modular-forms/solid integration
- Examples: required, disabled, error states, async options
- Related: link to base component (e.g., modular-select → select)

---

### F. Blocks Section

#### F1. Block Library
- Category tabs: Featured, Sidebar, Auth, Dashboard, Marketing, etc.
- Grid display of available blocks

#### F2. Block Viewer
- Preview/Code toggle
- "Open in New Tab" button
- "Refresh Preview" button
- Install command + copy
- File tree viewer
- Code panel per file with syntax highlighting

#### F3. Registry Integration
Blocks as registry items with:
- `type: "registry:block"`
- `files[]` array
- `dependencies` and `registryDependencies`

---

### G. Charts Section (D3 for SolidJS)

#### G1. Build from Scratch
- Handmade D3 integration for SolidJS
- No existing implementation to migrate

#### G2. Chart Gallery
Categories:
- Line charts
- Area charts
- Bar charts
- Stacked bar charts
- Scatter plots
- Tooltips
- Axes configurations

#### G3. Chart Example Pages
- Live preview (SolidJS component)
- Install command + copy (registry item)
- Dependencies chips (d3 modules)
- View code + copy code

#### G4. Shared Chart Core
Internal utilities:
- Scale/axis utilities
- Tooltip system
- Formatting helpers
- ResizeObserver for responsive charts
- Theme-aware styling (CSS variables)

---

### H. Libraries Section

#### H1. Library Catalog
- Gatehouse (authorization)
- Solid Convex (Convex integration)
- Date Utils
- (others as added)

#### H2. Library Page Template
- Install command (`bun add`) + copy
- Dependencies chips
- Usage examples
- API documentation links
- Related items

---

### I. Hooks Section

#### I1. Hooks Catalog
- use-bind-signal
- use-loading
- use-validated-search-params
- (others as added)

#### I2. Hook Page Template
- Install command + copy
- Dependencies chips
- TypeScript signature
- Usage examples
- Related hooks/utilities

---

### J. Functions Section

#### J1. Function Catalog
Categories:
- Date utilities
- String helpers
- Array utilities
- Object utilities
- Validation
- Formatting
- Highlighting (from solid-morgo reference)

#### J2. Function Page Template
- Install command (registry item) + copy
- Dependencies chips
- Function signature/API documentation
- Usage examples with code snippets
- TypeScript types documentation
- Related functions links

#### J3. Registry Integration
- `type: "registry:function"`
- Support single-file functions and bundles
- Tree-shakeable exports

---

### K. Quality & Accessibility

#### K1. Keyboard Navigation
- Full keyboard support for sidebar navigation
- Command palette (⌘K) keyboard shortcuts
- Focus management for dialogs/menus
- Visible focus rings throughout

#### K2. Accessibility
- ARIA labels for all icon buttons
- Semantic HTML structure
- Proper heading hierarchy
- Screen reader friendly

#### K3. Performance
- Route-level code splitting (Vinxi)
- Build-time search index generation
- Optimized bundle sizes

#### K4. Consistency
- Unified page template across all sections
- Consistent typography scale
- Standardized badge/chip styling
- Single copy interaction pattern everywhere

---

## Deployment

- **Runtime:** Bun server
- **Containerization:** Docker
- **Current hosting:** Coolify (solid-registry.coolify.wearearchitechs.dev)

---

## Out of Scope (for this milestone)

- Authentication/gating
- Versioning changes (keep current approach)
- Time estimates
- Post-launch iteration planning

---

## Success Criteria

1. All sections (Components, Modular, Blocks, Charts, Libraries, Hooks, Functions) have documentation pages
2. All registry items accessible via `/r/<item>.json`
3. Command palette search works across all content
4. Copy functionality works consistently throughout
5. "super-*" fully renamed to "modular-*"
6. D3 charts built and documented
7. Site deploys successfully via Docker/Bun