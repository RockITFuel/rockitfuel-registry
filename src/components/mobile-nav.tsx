import { A, useLocation } from "@solidjs/router";
import type { ComponentProps } from "solid-js";
import { createSignal, For, Show, splitProps } from "solid-js";

import {
  IconChevronRight,
  IconLogo,
  IconSidebarOpen,
} from "~/components/icons";
import { SearchButton } from "~/components/search";
import { expandSection, isExpanded, toggleSection } from "~/components/sidebar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { docsConfig } from "~/config/docs";
import { cn } from "~/lib/utils";

export function MobileNav() {
  const [open, setOpen] = createSignal(false);
  const location = useLocation();

  const isQuickLinkActive = (href: string) =>
    location.pathname.startsWith(href);

  return (
    <Sheet onOpenChange={setOpen} open={open()}>
      <SheetTrigger
        as={Button<"button">}
        class="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        variant="ghost"
      >
        <IconSidebarOpen class="size-6" />
        <span class="sr-only">Toggle Menu</span>
      </SheetTrigger>
      <SheetContent class="w-80 p-0" position="left">
        {/* Header with logo */}
        <div class="border-border/40 border-b p-4">
          <MobileLink
            class="flex items-center gap-2"
            href="/"
            onOpenChange={setOpen}
          >
            <IconLogo class="size-6" />
            <span class="font-bold">ArchiTechs Registry</span>
          </MobileLink>
        </div>

        {/* Search */}
        <div class="border-border/40 border-b p-4">
          <SearchButton />
        </div>

        {/* Quick Links Section */}
        <div class="border-border/40 border-b p-4">
          <span class="mb-2 block font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Sections
          </span>
          <div class="space-y-0.5">
            <For each={docsConfig.sectionQuickLinks}>
              {(link) => (
                <MobileLink
                  class={cn(
                    "block rounded-md px-2 py-1.5 text-sm transition-colors duration-150",
                    isQuickLinkActive(link.href)
                      ? "bg-accent/50 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                  href={link.href}
                  onClick={() => expandSection(link.sectionTitle)}
                  onOpenChange={setOpen}
                >
                  {link.title}
                </MobileLink>
              )}
            </For>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div class="h-[calc(100vh-20rem)] overflow-y-auto p-4">
          <div class="space-y-1">
            <For each={docsConfig.sidebarNav}>
              {(category) => (
                <div class="pb-2">
                  <button
                    class={cn(
                      "mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5",
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
                            <MobileLink
                              class={cn(
                                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 pl-8",
                                "text-sm transition-colors duration-150",
                                "hover:bg-accent/50",
                                link.href === location.pathname
                                  ? "bg-accent/30 font-medium text-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                              href={link.href}
                              onOpenChange={setOpen}
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
                            </MobileLink>
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
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends ComponentProps<typeof A> {
  onOpenChange?: (open: boolean) => void;
}

function MobileLink(props: MobileLinkProps) {
  const [local, others] = splitProps(props, [
    "href",
    "onClick",
    "onOpenChange",
  ]);
  return (
    <A
      href={local.href}
      onClick={(e) => {
        local.onClick?.(e);
        local.onOpenChange?.(false);
      }}
      {...others}
    />
  );
}
