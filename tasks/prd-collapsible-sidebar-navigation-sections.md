# PRD: Collapsible Sidebar Navigation Sections

## Overview
Add collapsible functionality to the sidebar navigation sections, allowing users to expand/collapse category groups to manage visual clutter and improve navigation efficiency.

## Requirements

### Collapse Behavior
- **Chevron toggle**: Each section header displays a chevron icon that toggles expand/collapse state
- **Section title navigation**: Clicking the section title text navigates to the section's first item (if applicable), separate from collapse behavior
- **Default collapsed**: All sections start collapsed when first visiting the site
- **Persistent state**: Expanded/collapsed state persists across page loads using localStorage

### Animation
- **Instant toggle**: No animation when expanding/collapsing - immediate show/hide of section items

### Visual Design
- Chevron icon rotates to indicate state (right = collapsed, down = expanded)
- Chevron should be clearly clickable with appropriate hover state
- Collapsed sections show only the section header with chevron
- Expanded sections show header + all child navigation items

### State Management
- Store collapsed/expanded state in localStorage with key like `sidebar-collapsed-sections`
- On page load, read from localStorage to restore previous state
- If no stored state exists, default all sections to collapsed

## Technical Approach
1. Add state management for tracking which sections are expanded (array of section IDs or object)
2. Add chevron icon to each section header
3. Wire up click handler on chevron to toggle section state
4. Persist state changes to localStorage
5. Read initial state from localStorage on component mount

## Files to Modify
- `src/components/sidebar.tsx` - Primary implementation

## Testing Requirements

### Playwright E2E Tests
Create `tests/sidebar-collapse.spec.ts` with the following test cases:

1. **Default state**: Verify all sections are collapsed on initial page load
2. **Expand section**: Click chevron and verify section items become visible
3. **Collapse section**: Click chevron on expanded section and verify items are hidden
4. **Multiple sections**: Expand multiple sections simultaneously, verify independent behavior
5. **Chevron rotation**: Verify chevron icon rotates correctly for collapsed/expanded states
6. **LocalStorage persistence**: 
   - Expand a section
   - Reload the page
   - Verify the section remains expanded
7. **Section title click**: Verify clicking section title navigates (doesn't toggle collapse)

### Test Setup
- Use `page.evaluate()` to clear localStorage before persistence tests
- Use appropriate selectors for chevron icons and section content
- Test on a route that displays the sidebar (e.g., `/docs/introduction`)

## Out of Scope
- Keyboard shortcuts for expand/collapse all
- Mobile-specific collapse behavior changes
- Nested collapsible subsections