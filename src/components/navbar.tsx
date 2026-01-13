import { A, useLocation } from "@solidjs/router";

import { IconBrandGithub, IconLogo } from "~/components/icons";
import { MobileNav } from "~/components/mobile-nav";
import { ModeToggle } from "~/components/mode-toggle";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const pathname = () => location.pathname;

  return (
    <header class="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div class="flex h-14 items-center px-4">
        <MobileNav />

        <div class="mr-4 hidden md:flex">
          <A class="mr-6 flex items-center space-x-2" href="/">
            <IconLogo class="size-6" />
            <span class="hidden font-bold sm:inline-block">
              ArchiTechs Registry
            </span>
          </A>
          <nav class="flex items-center gap-4 text-sm lg:gap-6">
            <A
              class={cn(
                "transition-colors hover:text-foreground/80",
                pathname().startsWith("/docs") &&
                  !pathname().startsWith("/docs/components") &&
                  !pathname().startsWith("/docs/blocks") &&
                  !pathname().startsWith("/docs/libraries") &&
                  !pathname().startsWith("/docs/hooks")
                  ? "text-foreground"
                  : "text-foreground/80"
              )}
              href="/docs/getting-started"
            >
              Docs
            </A>
            <A
              class={cn(
                "transition-colors hover:text-foreground/80",
                pathname().startsWith("/docs/components")
                  ? "text-foreground"
                  : "text-foreground/80"
              )}
              href="/docs/components"
            >
              Components
            </A>
            <A
              class={cn(
                "transition-colors hover:text-foreground/80",
                pathname().startsWith("/docs/blocks")
                  ? "text-foreground"
                  : "text-foreground/80"
              )}
              href="/docs/blocks"
            >
              Blocks
            </A>
            <A
              class={cn(
                "transition-colors hover:text-foreground/80",
                pathname().startsWith("/docs/libraries") ||
                  pathname().startsWith("/docs/hooks")
                  ? "text-foreground"
                  : "text-foreground/80"
              )}
              href="/docs/libraries"
            >
              Libraries
            </A>
          </nav>
        </div>
        <div class="flex flex-1 items-center justify-end space-x-2">
          <div class="flex items-center">
            <A
              href="https://github.com/RockITFuel/rockitfuel-registry"
              rel="noreferrer"
              target="_blank"
            >
              <div
                class={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <IconBrandGithub class="size-5" />
                <span class="sr-only">GitHub</span>
              </div>
            </A>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
