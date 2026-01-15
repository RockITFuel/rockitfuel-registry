# Feature: Sidebar Visual Polish

## Overview

Enhance the sidebar's visual appearance to match shadcn/ui's clean, minimal aesthetic with better spacing, typography, and active state indicators.

## Current State

- Basic collapsible sections work
- Chevron rotation animation exists
- Active link highlighting exists
- "new" and "updated" badges exist

## Desired State

- Refined spacing and padding
- Better visual hierarchy
- Smooth hover transitions
- Active section indicator (dot when collapsed)
- Improved badge styling
- Consistent with shadcn's minimal design language

## Implementation Steps

### 1. Improve Section Header Styling

```tsx
<button
  class={cn(
    "mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5",
    "text-sm font-semibold tracking-tight",
    "hover:bg-accent/50 transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  )}
  onClick={() => toggleSection(category.title)}
  type="button"
>
  <IconChevronRight
    class={cn(
      "size-3.5 shrink-0 text-muted-foreground",
      "transition-transform duration-200 ease-out",
      isExpanded(category.title) && "rotate-90"
    )}
  />
  <span class="flex-1 text-left">{category.title}</span>
  <Show when={!isExpanded(category.title) && sectionContainsCurrentPath(category.title)}>
    <span class="size-1.5 shrink-0 rounded-full bg-primary animate-in fade-in" />
  </Show>
</button>
```

### 2. Improve Link Styling

```tsx
<a
  href={link.href}
  class={cn(
    "group flex w-full items-center gap-2",
    "rounded-md px-2 py-1.5 pl-8",
    "text-sm transition-colors duration-150",
    "hover:bg-accent/50",
    link.href === location.pathname
      ? "font-medium text-foreground bg-accent/30"
      : "text-muted-foreground hover:text-foreground"
  )}
>
  <span class="truncate">{link.title}</span>
  <Show when={link.status}>
    <Badge
      variant={link.status === "new" ? "default" : "outline"}
      class={cn(
        "ml-auto shrink-0 text-[10px] px-1.5 py-0",
        link.status === "new" && "bg-primary/10 text-primary border-primary/20"
      )}
    >
      {link.status}
    </Badge>
  </Show>
</a>
```

### 3. Add Section Dividers

Add subtle dividers between major sections:

```tsx
<For each={docsConfig.sidebarNav}>
  {(category, index) => (
    <>
      <Show when={index() > 0}>
        <div class="my-2 h-px bg-border/50" />
      </Show>
      <div class="pb-2">
        {/* Section content */}
      </div>
    </>
  )}
</For>
```

### 4. Improve Scroll Area

Wrap sidebar content in a better scroll container:

```tsx
<aside class="...">
  <div class="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
    <div class="py-4 pr-4 space-y-1">
      {/* Quick links section */}
      {/* Collapsible sections */}
    </div>
  </div>
</aside>
```

### 5. Add Animation for Section Expand

Use CSS for smooth height transitions:

```tsx
// Instead of <Show when={isExpanded(...)}>
<div
  class={cn(
    "grid transition-all duration-200 ease-out",
    isExpanded(category.title)
      ? "grid-rows-[1fr] opacity-100"
      : "grid-rows-[0fr] opacity-0"
  )}
>
  <div class="overflow-hidden">
    {/* Links */}
  </div>
</div>
```

### 6. Update Badge Component (if needed)

Ensure badges support smaller sizes:

```tsx
// In badge.tsx variants
size: {
  default: "px-2.5 py-0.5 text-xs",
  sm: "px-1.5 py-0 text-[10px]",
}
```

## CSS Additions

Add to `src/app.css`:

```css
/* Custom scrollbar styling */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-border::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
  border-radius: 9999px;
}

.scrollbar-track-transparent::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar {
  width: 6px;
}
```

## Visual Design Specifications

| Element | Value |
|---------|-------|
| Section header font | 14px, semibold |
| Link font | 14px, regular |
| Active link font | 14px, medium |
| Padding (section header) | 8px 8px |
| Padding (link) | 6px 8px 6px 32px |
| Border radius | 6px |
| Chevron size | 14px |
| Indicator dot | 6px |
| Badge font | 10px |
| Transition duration | 150-200ms |

## Files to Modify

- `src/components/sidebar.tsx`
- `src/components/ui/badge.tsx` (optional)
- `src/app.css` (scrollbar styles)

## Dependencies

None

## Testing

- Visual regression test
- Test hover states
- Test active states
- Test expand/collapse animation smoothness
- Test scrollbar on long lists
- Test in dark mode
- Test at different viewport widths
