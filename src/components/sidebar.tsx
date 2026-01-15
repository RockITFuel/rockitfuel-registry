import { makePersisted } from "@solid-primitives/storage";
import { A, useLocation } from "@solidjs/router";
import { createEffect, For, on, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { IconChevronRight } from "~/components/icons";
import { Badge } from "~/components/ui/badge";
import { docsConfig } from "~/config/docs";
import { cn } from "~/lib/utils";

// Find which section contains a given pathname
function getSectionForPath(pathname: string): string | null {
  for (const category of docsConfig.sidebarNav) {
    if (category.items.some((item) => item.href === pathname)) {
      return category.title;
    }
  }
  return null;
}

type ExpandedSections = Record<string, boolean>;

// Only use persistence on client to avoid hydration issues
const [baseStore, setBaseStore] = createStore<ExpandedSections>({});
const [expandedSections, setExpandedSections] = isServer
  ? [baseStore, setBaseStore]
  : makePersisted(createStore<ExpandedSections>({}), {
      name: "sidebar-sections-expanded",
    });

export const isExpanded = (sectionId: string) =>
  expandedSections[sectionId] ?? false;
export const toggleSection = (sectionId: string) => {
  setExpandedSections(sectionId, (prev) => !prev);
};
export const expandSection = (sectionId: string) => {
  setExpandedSections(sectionId, true);
};

export default function Sidebar() {
  const location = useLocation();

  // Auto-expand section containing current page on navigation
  createEffect(
    on(
      () => location.pathname,
      (pathname) => {
        const currentSection = getSectionForPath(pathname);
        if (currentSection && !isExpanded(currentSection)) {
          setExpandedSections(currentSection, true);
        }
      }
    )
  );

  // Check if a section contains the current page (for indicator when collapsed)
  const sectionContainsCurrentPath = (categoryTitle: string) =>
    docsConfig.sidebarNav
      .find((c) => c.title === categoryTitle)
      ?.items.some((item) => item.href === location.pathname) ?? false;

  // Check if quick link is active
  const isQuickLinkActive = (href: string) =>
    location.pathname.startsWith(href);

  return (
    <aside class="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-border/40 border-r md:sticky md:block dark:border-border">
      <div class="relative h-full overflow-y-auto py-4 pr-4">
        {/* Quick Links Section */}
        <div class="mb-4 border-border/40 border-b pb-4">
          <span class="mb-2 block px-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Sections
          </span>
          <div class="space-y-0.5">
            <For each={docsConfig.sectionQuickLinks}>
              {(link) => (
                <A
                  class={cn(
                    "block rounded-md px-2 py-1.5 text-sm transition-colors duration-150",
                    isQuickLinkActive(link.href)
                      ? "bg-accent/50 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                  href={link.href}
                  onClick={() => expandSection(link.sectionTitle)}
                >
                  {link.title}
                </A>
              )}
            </For>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div class="space-y-1">
          <For each={docsConfig.sidebarNav}>
            {(category) => (
              <div class="pb-2">
                <button
                  class={cn(
                    "mb-0.5 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5",
                    "font-semibold text-sm tracking-tight",
                    "transition-colors duration-150",
                    "hover:bg-accent/50",
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
                  <Show
                    when={
                      !isExpanded(category.title) &&
                      sectionContainsCurrentPath(category.title)
                    }
                  >
                    <span class="size-1.5 shrink-0 rounded-full bg-primary" />
                  </Show>
                </button>

                {/* Animated expand/collapse container */}
                <div
                  class={cn(
                    "grid transition-all duration-200 ease-out",
                    isExpanded(category.title)
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div class="overflow-hidden">
                    <div class="space-y-0.5 pt-0.5">
                      <For each={category.items}>
                        {(link) => (
                          <A
                            class={cn(
                              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 pl-8",
                              "text-sm transition-colors duration-150",
                              "hover:bg-accent/50",
                              link.href === location.pathname
                                ? "bg-accent/30 font-medium text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                            href={link.href}
                          >
                            <span class="truncate">{link.title}</span>
                            <Show when={link.status}>
                              <Badge
                                class="ml-auto shrink-0 px-1.5 py-0 text-[10px]"
                                variant={
                                  link.status === "new"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {link.status}
                              </Badge>
                            </Show>
                          </A>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </aside>
  );
}
