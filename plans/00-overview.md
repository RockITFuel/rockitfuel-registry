# Navigation Redesign - Overview

## Summary

This document outlines the features needed to make the RockITFuel Registry navigation look similar to shadcn/ui, with a focus on collapsible sidebar sections.

## Feature Plans

| # | Feature | File | Priority | Complexity |
|---|---------|------|----------|------------|
| 01 | Sidebar Section Quick Links | `01-sidebar-section-quick-links.md` | High | Low |
| 02 | Charts Navigation Section | `02-charts-navigation-section.md` | Medium | Medium |
| 03 | Mobile Navigation Collapsible | `03-mobile-navigation-collapsible-sections.md` | High | Medium |
| 04 | Sidebar Visual Polish | `04-sidebar-visual-polish.md` | High | Low |
| 05 | Search Command Palette | `05-search-command-palette.md` | Medium | Medium |
| 06 | Navbar Enhancements | `06-navbar-enhancements.md` | Low | Low |

## Suggested Implementation Order

### Phase 1: Core Navigation (Foundation)
1. **04 - Sidebar Visual Polish** - Improve existing sidebar styling first
2. **01 - Sidebar Section Quick Links** - Add quick navigation at top of sidebar

### Phase 2: Mobile & Consistency
3. **03 - Mobile Navigation Collapsible** - Ensure mobile matches desktop
4. **06 - Navbar Enhancements** - Polish the top navigation

### Phase 3: Content & Features
5. **02 - Charts Navigation Section** - Add charts to navigation
6. **05 - Search Command Palette** - Enhance search experience

## Key Differences from shadcn/ui

| Feature | shadcn/ui | Current Registry | Action |
|---------|-----------|------------------|--------|
| Section quick links | Yes | No | Add |
| Collapsible sections | Yes | Yes | Polish |
| Active indicator (dot) | Yes | Yes | Keep |
| Charts nav section | Yes | No | Add |
| Command palette search | Yes (⌘K) | Basic | Enhance |
| GitHub stars badge | Yes | No | Optional |
| Mobile collapsible nav | Yes | Unknown | Verify/Add |

## Shared Dependencies

These modules/stores will be shared across features:

1. **Sidebar State Store** (`src/stores/sidebar-state.ts`)
   - Persisted expanded sections
   - Used by: Sidebar, Mobile Nav

2. **Docs Config** (`src/config/docs.ts`)
   - Already exists, will be extended
   - Add: sectionQuickLinks, charts section

3. **Search Index** (`src/lib/search-index.ts`)
   - Built from docs config
   - Used by: Search dialog

## Design System Alignment

Ensure consistency with these values:

```
--radius: 6px
--transition-fast: 150ms
--transition-normal: 200ms
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--font-sm: 14px
--font-xs: 12px
```

## Testing Strategy

Each feature should be tested for:
- Visual appearance (light/dark mode)
- Responsive behavior (mobile/tablet/desktop)
- Keyboard accessibility
- Screen reader compatibility
- Animation smoothness
- State persistence (where applicable)

## Notes

- Current sidebar already has good foundation with collapsible sections
- Main focus is visual polish and adding quick links
- Mobile navigation needs verification of current state
- Charts content already exists, just needs navigation integration
