# Feature: Search Command Palette Enhancement

## Overview

Enhance the existing search functionality to provide a polished command palette experience similar to shadcn/ui's Cmd+K search.

## Current State

- Search button exists in navbar (`SearchButton` component)
- Basic search functionality likely exists
- Need to verify current implementation

## Desired State

- Beautiful command palette UI
- Cmd+K (Mac) / Ctrl+K (Windows) keyboard shortcut
- Search across:
  - Components
  - Blocks
  - Charts
  - Libraries
  - Hooks
  - Documentation pages
- Recent searches
- Keyboard navigation
- Category grouping in results
- Quick actions (theme toggle, etc.)

## Implementation Steps

### 1. Review Current Search Implementation

Check `src/components/search.tsx` to understand current state.

### 2. Enhance Search Button

```tsx
// src/components/search.tsx
export function SearchButton() {
  const [open, setOpen] = createSignal(false);

  // Global keyboard shortcut
  createEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        class={cn(
          "relative h-9 w-full justify-start rounded-md",
          "border border-input bg-background px-3",
          "text-sm text-muted-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "lg:w-64 lg:pr-12"
        )}
      >
        <IconSearch class="mr-2 size-4" />
        <span class="hidden lg:inline-flex">Search documentation...</span>
        <span class="inline-flex lg:hidden">Search...</span>
        <kbd class="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
          <span class="text-xs">⌘</span>K
        </kbd>
      </button>
      <SearchDialog open={open()} onOpenChange={setOpen} />
    </>
  );
}
```

### 3. Create Search Dialog Component

```tsx
// src/components/search-dialog.tsx
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "~/components/ui/command";
import { Dialog, DialogContent } from "~/components/ui/dialog";

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchDialog(props: SearchDialogProps) {
  const navigate = useNavigate();

  const handleSelect = (href: string) => {
    props.onOpenChange(false);
    navigate(href);
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent class="overflow-hidden p-0">
        <Command class="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <CommandInput placeholder="Type to search..." />
          <CommandList class="max-h-[300px] overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>

            {/* Getting Started */}
            <CommandGroup heading="Getting Started">
              <For each={gettingStartedItems}>
                {(item) => (
                  <CommandItem onSelect={() => handleSelect(item.href)}>
                    <IconFile class="mr-2 size-4" />
                    {item.title}
                  </CommandItem>
                )}
              </For>
            </CommandGroup>

            {/* Components */}
            <CommandGroup heading="Components">
              <For each={componentItems}>
                {(item) => (
                  <CommandItem onSelect={() => handleSelect(item.href)}>
                    <IconComponent class="mr-2 size-4" />
                    {item.title}
                  </CommandItem>
                )}
              </For>
            </CommandGroup>

            {/* Charts */}
            <CommandGroup heading="Charts">
              <For each={chartItems}>
                {(item) => (
                  <CommandItem onSelect={() => handleSelect(item.href)}>
                    <IconChart class="mr-2 size-4" />
                    {item.title}
                  </CommandItem>
                )}
              </For>
            </CommandGroup>

            {/* Theme Toggle */}
            <CommandGroup heading="Theme">
              <CommandItem onSelect={() => toggleTheme()}>
                <IconSun class="mr-2 size-4" />
                Toggle theme
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
```

### 4. Build Search Index

Create a search index from docs config:

```tsx
// src/lib/search-index.ts
import { docsConfig } from "~/config/docs";

export type SearchItem = {
  title: string;
  href: string;
  category: string;
  keywords?: string[];
};

export const searchIndex: SearchItem[] = docsConfig.sidebarNav.flatMap(
  (category) =>
    category.items.map((item) => ({
      title: item.title,
      href: item.href,
      category: category.title,
    }))
);

export function searchDocs(query: string): SearchItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return searchIndex.filter(
    (item) =>
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery) ||
      item.keywords?.some((k) => k.toLowerCase().includes(normalizedQuery))
  );
}
```

### 5. Add Fuzzy Search (Optional Enhancement)

Use a library like `fuse.js` for better search:

```bash
bun add fuse.js
```

```tsx
import Fuse from "fuse.js";

const fuse = new Fuse(searchIndex, {
  keys: ["title", "category", "keywords"],
  threshold: 0.3,
});

export function fuzzySearch(query: string) {
  return fuse.search(query).map((result) => result.item);
}
```

## Visual Design Notes

- Dialog appears centered, overlaying content
- Subtle backdrop blur
- Input with search icon
- Results grouped by category
- Keyboard hints for navigation
- Hover/focus states on items
- Icons per category type

## Files to Create

- `src/components/search-dialog.tsx`
- `src/lib/search-index.ts`

## Files to Modify

- `src/components/search.tsx` (if exists, enhance)

## Dependencies

- Command component (should exist)
- Dialog component (should exist)
- Optional: fuse.js for fuzzy search

## Testing

- Test Cmd+K shortcut (Mac)
- Test Ctrl+K shortcut (Windows)
- Test search filtering
- Test keyboard navigation (arrow keys, enter)
- Test escape to close
- Test clicking result navigates correctly
- Test empty state
- Test mobile experience
