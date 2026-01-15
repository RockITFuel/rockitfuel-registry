import { A, useLocation } from "@solidjs/router";
import { For } from "solid-js";

import { IconBrandGithub, IconLogo } from "~/components/icons";
import { MobileNav } from "~/components/mobile-nav";
import { ModeToggle } from "~/components/mode-toggle";
import { SearchButton } from "~/components/search";
import { buttonVariants } from "~/components/ui/button";
import { WidescreenToggle } from "~/components/widescreen-toggle";
import { docsConfig } from "~/config/docs";
import { cn } from "~/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const pathname = () => location.pathname;

  const isActive = (href: string) => {
    if (href === "/docs/getting-started") {
      // Special case for root docs to avoid highlighting when in sub-sections
      return (
        pathname().startsWith("/docs") &&
        ![
          "/docs/components",
          "/docs/blocks",
          "/docs/libraries",
          "/docs/hooks",
          "/docs/modular-form",
        ].some((p) => pathname().startsWith(p))
      );
    }
    return pathname().startsWith(href);
  };

  return (
    <header class="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div class="container flex h-14 items-center">
        {/* Desktop Logo and Nav */}
        <div class="mr-4 hidden md:flex">
          <A class="group mr-6 flex items-center gap-2" href="/">
            <IconLogo class="size-6 transition-transform group-hover:scale-105" />
            <span class="hidden font-bold text-lg tracking-tight lg:inline-block">
              ArchiTechs
            </span>
          </A>
          <nav class="flex items-center gap-1 text-sm">
            <For each={docsConfig.mainNav}>
              {(item) => (
                <A
                  class={cn(
                    "rounded-md px-3 py-2 transition-colors duration-150",
                    "hover:bg-accent/50 hover:text-accent-foreground",
                    isActive(item.href)
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                  href={item.href}
                >
                  {item.title}
                </A>
              )}
            </For>
          </nav>
        </div>

        {/* Mobile Nav */}
        <MobileNav />

        {/* Mobile Logo (centered) */}
        <A class="flex items-center gap-2 md:hidden" href="/">
          <IconLogo class="size-6" />
          <span class="font-bold">ArchiTechs</span>
        </A>

        {/* Right Side Actions */}
        <div class="ml-auto flex items-center gap-1">
          <SearchButton />
          <A
            class={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-9"
            )}
            href="https://github.com/WeAreArchiTechs/rockitfuel-registry"
            rel="noreferrer"
            target="_blank"
          >
            <IconBrandGithub class="size-5" />
            <span class="sr-only">GitHub</span>
          </A>
          <WidescreenToggle />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
