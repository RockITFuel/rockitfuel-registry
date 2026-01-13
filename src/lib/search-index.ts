import Fuse from "fuse.js";
import { docsConfig } from "~/config/docs";

// Top-level regex for performance
const WHITESPACE_REGEX = /\s+/;

export type SearchItem = {
  title: string;
  href: string;
  category: string;
  keywords: string[];
  status?: "new" | "updated";
};

// Build the search index at module load time (effectively build-time for static imports)
function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const category of docsConfig.sidebarNav) {
    for (const item of category.items) {
      items.push({
        title: item.title,
        href: item.href,
        category: category.title,
        keywords: generateKeywords(item.title, category.title),
        status: item.status,
      });
    }
  }

  return items;
}

// Generate searchable keywords from title and category
function generateKeywords(title: string, category: string): string[] {
  const words: string[] = [];

  // Add title words
  words.push(...title.toLowerCase().split(WHITESPACE_REGEX));

  // Add category
  words.push(category.toLowerCase());

  // Add common abbreviations and aliases
  const aliases: Record<string, string[]> = {
    button: ["btn"],
    dialog: ["modal", "popup"],
    dropdown: ["select", "menu"],
    carousel: ["slider", "slideshow"],
    checkbox: ["check", "toggle"],
    switch: ["toggle"],
    tooltip: ["hint", "tip"],
    popover: ["popup"],
    avatar: ["profile", "user"],
    skeleton: ["loading", "placeholder"],
    sonner: ["toast", "notification"],
    breadcrumb: ["nav", "navigation"],
    collapsible: ["accordion", "expand"],
    combobox: ["autocomplete", "typeahead"],
    context: ["right-click"],
    hover: ["mouseover"],
    sheet: ["drawer", "panel"],
    separator: ["divider", "line"],
    progress: ["loader", "loading"],
    input: ["text", "field"],
    table: ["grid", "data"],
    tabs: ["tab", "tabbed"],
    date: ["calendar", "datepicker"],
    color: ["colour", "picker"],
    command: ["palette", "cmdk", "search"],
    form: ["input", "validation"],
    sidebar: ["nav", "menu"],
  };

  const titleLower = title.toLowerCase();
  for (const [key, values] of Object.entries(aliases)) {
    if (titleLower.includes(key)) {
      words.push(...values);
    }
  }

  return [...new Set(words)];
}

// Pre-built search index
export const searchIndex = buildSearchIndex();

// Fuse.js instance with fuzzy search configuration
export const fuse = new Fuse(searchIndex, {
  keys: [
    { name: "title", weight: 2 },
    { name: "category", weight: 1 },
    { name: "keywords", weight: 0.5 },
  ],
  threshold: 0.4, // 0 = exact match, 1 = match anything
  distance: 100,
  includeScore: true,
  minMatchCharLength: 1,
});

// Search function that returns results grouped by category
export function search(query: string): SearchItem[] {
  if (!query.trim()) {
    return searchIndex;
  }

  const results = fuse.search(query);
  return results.map((result) => result.item);
}
