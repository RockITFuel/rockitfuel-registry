# Feature: Charts Navigation Section

## Overview

Add a dedicated Charts section to the navigation and sidebar, similar to shadcn/ui's Charts navigation. The registry already has D3-based chart components but they lack dedicated navigation.

## Current State

- Chart components exist in `src/components/ui/` (line-chart, bar-chart, area-chart, stacked-bar-chart)
- Chart utilities exist in `src/lib/chart-utils.ts`
- No dedicated Charts section in navigation
- Charts are not prominently discoverable

## Desired State

- "Charts" link in main navbar
- Charts section in sidebar with:
  - Overview/Introduction
  - Line Chart
  - Bar Chart
  - Area Chart
  - Stacked Bar Chart
  - Chart Utils (utilities documentation)
- Dedicated charts landing page at `/docs/charts`

## Implementation Steps

### 1. Update `src/config/docs.ts`

Add Charts to mainNav:

```typescript
mainNav: [
  { title: "Docs", href: "/docs/getting-started" },
  { title: "Components", href: "/docs/components" },
  { title: "Blocks", href: "/docs/blocks" },
  { title: "Charts", href: "/docs/charts" },  // NEW
  { title: "Libraries", href: "/docs/libraries" },
],
```

Add Charts section to sidebarNav:

```typescript
{
  title: "Charts",
  items: [
    { title: "Introduction", href: "/docs/charts" },
    { title: "Line Chart", href: "/docs/charts/line-chart" },
    { title: "Bar Chart", href: "/docs/charts/bar-chart" },
    { title: "Area Chart", href: "/docs/charts/area-chart" },
    { title: "Stacked Bar Chart", href: "/docs/charts/stacked-bar-chart" },
    { title: "Chart Utils", href: "/docs/charts/chart-utils" },
  ],
},
```

### 2. Create Chart Documentation Pages

Create `src/routes/(app)/docs/charts/` directory:

#### `index.tsx` - Charts Introduction

```tsx
export default function ChartsIntro() {
  return (
    <DocWrapper
      title="Charts"
      description="Beautiful, accessible charts built with D3.js for SolidJS applications."
    >
      <p>Overview of available chart components...</p>
      <ul>
        <li>Line Chart - For trends over time</li>
        <li>Bar Chart - For categorical comparisons</li>
        <li>Area Chart - For cumulative values</li>
        <li>Stacked Bar Chart - For part-to-whole relationships</li>
      </ul>
    </DocWrapper>
  );
}
```

#### Individual chart pages

- `line-chart.tsx`
- `bar-chart.tsx`
- `area-chart.tsx`
- `stacked-bar-chart.tsx`
- `chart-utils.tsx`

Each page should include:
- Component description
- Interactive example
- API reference
- Installation command
- Usage code example

### 3. Update Navbar Active State Logic

In `src/components/navbar.tsx`, update `isActive` function:

```typescript
const isActive = (href: string) => {
  if (href === "/docs/getting-started") {
    return (
      pathname().startsWith("/docs") &&
      ![
        "/docs/components",
        "/docs/blocks",
        "/docs/charts",     // ADD
        "/docs/libraries",
        "/docs/hooks",
      ].some((p) => pathname().startsWith(p))
    );
  }
  return pathname().startsWith(href);
};
```

### 4. Create Registry Entries

Ensure `public/r/` has JSON entries for:
- `line-chart.json`
- `bar-chart.json`
- `area-chart.json`
- `stacked-bar-chart.json`
- `chart-utils.json`

## Visual Design Notes

- Charts pages should show interactive examples prominently
- Use actual data visualizations in examples
- Include dark mode compatible styling
- Show responsive behavior

## Files to Create

- `src/routes/(app)/docs/charts/index.tsx`
- `src/routes/(app)/docs/charts/line-chart.tsx`
- `src/routes/(app)/docs/charts/bar-chart.tsx`
- `src/routes/(app)/docs/charts/area-chart.tsx`
- `src/routes/(app)/docs/charts/stacked-bar-chart.tsx`
- `src/routes/(app)/docs/charts/chart-utils.tsx`

## Files to Modify

- `src/config/docs.ts`
- `src/components/navbar.tsx`

## Dependencies

- Existing chart components
- D3.js (already installed)

## Testing

- Verify all chart pages render correctly
- Test chart interactivity
- Verify navigation active states
- Test mobile responsiveness
- Verify install commands work
