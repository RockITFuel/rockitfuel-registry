import { useNavigate } from "@solidjs/router";
import { Blocks, FileText, Hash, Layers, Library, Search } from "lucide-solid";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { type SearchItem, search } from "~/lib/search-index";

// Icon mapping for categories
const categoryIcons: Record<string, typeof FileText> = {
  "Getting Started": FileText,
  "UI Components": Layers,
  Blocks,
  Libraries: Library,
  Hooks: Hash,
};

// Group search results by category
function groupByCategory(items: SearchItem[]): Record<string, SearchItem[]> {
  const groups: Record<string, SearchItem[]> = {};

  for (const item of items) {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
  }

  return groups;
}

export function SearchButton() {
  const [open, setOpen] = createSignal(false);
  const [query, setQuery] = createSignal("");
  const navigate = useNavigate();

  // Fuzzy search results
  const results = createMemo(() => search(query()));
  const groupedResults = createMemo(() => groupByCategory(results()));

  // Keyboard shortcut: Cmd/Ctrl + K (client-only)
  onMount(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };

    document.addEventListener("keydown", down);
    onCleanup(() => document.removeEventListener("keydown", down));
  });

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    navigate(href);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setQuery("");
    }
  };

  return (
    <>
      <Button
        class="relative h-9 w-9 p-0 md:h-9 md:w-60 md:justify-start md:px-3 md:py-2"
        onClick={() => setOpen(true)}
        variant="outline"
      >
        <Search class="size-4 md:mr-2" />
        <span class="hidden md:inline-flex">Search...</span>
        <kbd class="pointer-events-none absolute top-1.5 right-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 md:flex">
          <span class="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog onOpenChange={handleOpenChange} open={open()}>
        <CommandInput
          onValueChange={setQuery}
          placeholder="Search components, blocks, libraries..."
          value={query()}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <For each={Object.entries(groupedResults())}>
            {([category, items]) => {
              const Icon = categoryIcons[category] || FileText;
              return (
                <CommandGroup heading={category}>
                  <For each={items}>
                    {(item) => (
                      <CommandItem
                        class="cursor-pointer"
                        onSelect={() => handleSelect(item.href)}
                        value={`${item.category} ${item.title}`}
                      >
                        <Icon class="mr-2 size-4" />
                        <span>{item.title}</span>
                        {item.status ? (
                          <span class="ml-auto text-muted-foreground text-xs capitalize">
                            {item.status}
                          </span>
                        ) : null}
                      </CommandItem>
                    )}
                  </For>
                </CommandGroup>
              );
            }}
          </For>
        </CommandList>
      </CommandDialog>
    </>
  );
}
