# Feature: Sidebar Section Quick Links

## Overview

Add a "Sections" quick links area at the top of the sidebar, similar to shadcn/ui. This provides fast navigation to main categories without scrolling.

## Current State

- Sidebar has collapsible sections (Getting Started, UI Components, Blocks, etc.)
- No quick jump links at the top
- Users must scroll to find sections

## Desired State

A horizontal/vertical quick links section at the top of the sidebar showing:
- Getting Started
- Components
- Blocks
- Modular Form
- Libraries
- Hooks
- Charts (new)

Clicking a quick link scrolls to and expands that section.

## Implementation Steps

### 1. Update `src/config/docs.ts`

Add a `sectionQuickLinks` array to the config:

```typescript
type QuickLink = {
  title: string;
  sectionTitle: string; // matches sidebarNav category title
  href: string; // optional direct link
};

sectionQuickLinks: [
  { title: "Get Started", sectionTitle: "Getting Started", href: "/docs/getting-started" },
  { title: "Components", sectionTitle: "UI Components", href: "/docs/components" },
  { title: "Blocks", sectionTitle: "Blocks", href: "/docs/blocks" },
  { title: "Forms", sectionTitle: "Modular Form", href: "/docs/modular-form" },
  { title: "Libraries", sectionTitle: "Libraries", href: "/docs/libraries" },
  { title: "Hooks", sectionTitle: "Hooks", href: "/docs/hooks" },
  { title: "Charts", sectionTitle: "Charts", href: "/docs/charts" },
]
```

### 2. Update `src/components/sidebar.tsx`

Add a quick links section at the top of the sidebar:

```tsx
<div class="mb-4 pb-4 border-b border-border/40">
  <span class="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
    Sections
  </span>
  <div class="mt-2 space-y-1">
    <For each={docsConfig.sectionQuickLinks}>
      {(link) => (
        <a
          href={link.href}
          onClick={(e) => {
            e.preventDefault();
            setExpandedSections(link.sectionTitle, true);
            // Scroll to section or navigate
          }}
          class={cn(
            "block px-2 py-1 text-sm rounded-md hover:bg-accent transition-colors",
            pathname().startsWith(link.href)
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          )}
        >
          {link.title}
        </a>
      )}
    </For>
  </div>
</div>
```

### 3. Add scroll-to-section functionality

Create a ref system to scroll to sections:

```tsx
const sectionRefs: Record<string, HTMLDivElement | undefined> = {};

// In the section render:
<div ref={(el) => (sectionRefs[category.title] = el)}>
  ...
</div>

// In quick link click:
const scrollToSection = (sectionTitle: string) => {
  setExpandedSections(sectionTitle, true);
  sectionRefs[sectionTitle]?.scrollIntoView({ behavior: "smooth", block: "start" });
};
```

## Visual Design Notes

- Quick links area has subtle border-bottom separator
- "Sections" label in uppercase, muted color, small text
- Links have hover background effect
- Active section link is highlighted
- Consistent with shadcn's minimal aesthetic

## Files to Modify

- `src/config/docs.ts` - Add sectionQuickLinks config
- `src/components/sidebar.tsx` - Add quick links section

## Dependencies

None

## Testing

- Verify quick links scroll to correct section
- Verify section expands when clicked
- Verify active state shows current section
- Test keyboard navigation
- Test on mobile (quick links should be hidden or adapted)
