# Feature: Mobile Navigation Collapsible Sections

## Overview

Enhance the mobile navigation to include collapsible sections similar to the desktop sidebar, providing better navigation on mobile devices.

## Current State

Looking at `src/components/mobile-nav.tsx`:
- Mobile nav likely uses a sheet/drawer pattern
- May not have the same collapsible section behavior as desktop
- Needs to match the enhanced desktop sidebar experience

## Desired State

- Mobile nav opens as a sheet from the left
- Shows same collapsible sections as desktop sidebar
- Section quick links at top (from Plan 01)
- Persisted expansion state shared with desktop
- Smooth animations for expand/collapse
- Search accessible from mobile nav

## Implementation Steps

### 1. Review Current Mobile Nav

First, examine `src/components/mobile-nav.tsx` to understand current implementation.

### 2. Update Mobile Nav Component

```tsx
// src/components/mobile-nav.tsx
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { createSignal, For, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { IconMenu, IconChevronRight } from "~/components/icons";
import { docsConfig } from "~/config/docs";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";

export function MobileNav() {
  const [open, setOpen] = createSignal(false);
  const location = useLocation();

  // Use same expandedSections store as desktop sidebar
  // Import from sidebar.tsx or create shared store

  return (
    <Sheet open={open()} onOpenChange={setOpen}>
      <SheetTrigger class="md:hidden">
        <IconMenu class="size-5" />
        <span class="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="left" class="w-80 p-0">
        <div class="flex flex-col h-full">
          {/* Logo/Brand */}
          <div class="p-4 border-b border-border">
            <A href="/" class="flex items-center gap-2" onClick={() => setOpen(false)}>
              <IconLogo class="size-6" />
              <span class="font-bold">ArchiTechs Registry</span>
            </A>
          </div>

          {/* Search Button */}
          <div class="p-4 border-b border-border">
            <SearchButton />
          </div>

          {/* Quick Links */}
          <div class="p-4 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sections
            </span>
            <div class="mt-2 space-y-1">
              <For each={docsConfig.sectionQuickLinks}>
                {(link) => (
                  <A
                    href={link.href}
                    onClick={() => setOpen(false)}
                    class={cn(
                      "block px-2 py-1.5 text-sm rounded-md",
                      location.pathname.startsWith(link.href)
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50"
                    )}
                  >
                    {link.title}
                  </A>
                )}
              </For>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div class="flex-1 overflow-y-auto p-4">
            <For each={docsConfig.sidebarNav}>
              {(category) => (
                <div class="pb-4">
                  <button
                    class="flex w-full items-center gap-1 px-2 py-1.5 font-semibold text-sm rounded-md hover:bg-accent"
                    onClick={() => toggleSection(category.title)}
                    type="button"
                  >
                    <IconChevronRight
                      class={cn(
                        "size-4 transition-transform",
                        isExpanded(category.title) && "rotate-90"
                      )}
                    />
                    {category.title}
                  </button>
                  <Show when={isExpanded(category.title)}>
                    <div class="mt-1 space-y-1">
                      <For each={category.items}>
                        {(item) => (
                          <A
                            href={item.href}
                            onClick={() => setOpen(false)}
                            class={cn(
                              "flex items-center gap-2 pl-7 pr-2 py-1.5 text-sm rounded-md",
                              item.href === location.pathname
                                ? "bg-accent text-foreground font-medium"
                                : "text-muted-foreground hover:bg-accent/50"
                            )}
                          >
                            {item.title}
                            <Show when={item.status === "new"}>
                              <Badge variant="secondary" class="text-xs">new</Badge>
                            </Show>
                          </A>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
              )}
            </For>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

### 3. Create Shared Expanded State Store

Extract the expanded sections state to a shared module:

```tsx
// src/stores/sidebar-state.ts
import { makePersisted } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";

type ExpandedSections = Record<string, boolean>;

const [baseStore, setBaseStore] = createStore<ExpandedSections>({});
const [expandedSections, setExpandedSections] = isServer
  ? [baseStore, setBaseStore]
  : makePersisted(createStore<ExpandedSections>({}), {
      name: "sidebar-sections-expanded",
    });

export const isExpanded = (sectionId: string) => expandedSections[sectionId] ?? false;
export const toggleSection = (sectionId: string) => {
  setExpandedSections(sectionId, (prev) => !prev);
};
export const expandSection = (sectionId: string) => {
  setExpandedSections(sectionId, true);
};
```

### 4. Update Both Sidebar and MobileNav

Import shared state in both components to ensure sync.

## Visual Design Notes

- Sheet slides in from left
- Smooth expand/collapse animations (use CSS transitions)
- Touch-friendly tap targets (min 44px)
- Visual feedback on tap
- Close on navigation
- Logo in header
- Search prominently placed

## Files to Create

- `src/stores/sidebar-state.ts` - Shared state store

## Files to Modify

- `src/components/mobile-nav.tsx` - Full redesign
- `src/components/sidebar.tsx` - Import shared state

## Dependencies

- Sheet component (likely already exists)
- Shared primitives for persistence

## Testing

- Test on actual mobile devices
- Verify expand/collapse animations
- Test navigation closes sheet
- Verify state persists across sessions
- Test with keyboard
- Test scroll behavior with many items
