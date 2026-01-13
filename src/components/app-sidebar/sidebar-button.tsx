import { A, useLocation } from "@solidjs/router";
import { type Component, createMemo, Show } from "solid-js";
import { Button } from "~/components/ui/button";

export type SidebarButtonProps = {
  title: string;
  href: string;
  icon: Component;
};

export default function SidebarButton(props: SidebarButtonProps) {
  const location = useLocation();

  const isActiveRoute = createMemo(() =>
    location.pathname.startsWith(props.href)
  );

  return (
    <Button
      as={A}
      class="group relative h-9 w-full justify-start gap-3 overflow-hidden rounded-lg border border-transparent px-3 py-2 transition-all duration-300 ease-out"
      classList={{
        "bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 border-primary/20 dark:shadow-primary/10":
          isActiveRoute(),
        "hover:bg-gradient-to-r hover:from-accent/80 hover:to-accent/60 hover:shadow-md hover:shadow-accent/20 hover:border-accent/20 dark:hover:from-accent/60 dark:hover:to-accent/40":
          !isActiveRoute(),
      }}
      href={props.href}
      variant="ghost"
    >
      {/* Active indicator */}
      <Show when={isActiveRoute()}>
        <div class="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-foreground shadow-sm dark:bg-primary-foreground" />
      </Show>

      <div class="relative z-10 flex w-full items-center gap-2">
        <div
          class="flex h-5 w-5 items-center justify-center rounded-md transition-all duration-300"
          classList={{
            "bg-primary-foreground/20 dark:bg-primary-foreground/30":
              isActiveRoute(),
            "bg-muted/50 group-hover:bg-primary/10 dark:bg-muted/30 dark:group-hover:bg-primary/20":
              !isActiveRoute(),
          }}
        >
          <props.icon
            class="h-3.5 w-3.5 transition-all duration-300 group-hover:scale-110"
            classList={{
              "text-primary-foreground dark:text-primary-foreground":
                isActiveRoute(),
              "text-muted-foreground group-hover:text-primary dark:text-muted-foreground dark:group-hover:text-primary":
                !isActiveRoute(),
            }}
          />
        </div>
        <span
          class="truncate font-medium text-sm tracking-wide transition-all duration-300 group-hover:translate-x-0.5"
          classList={{
            "text-primary-foreground dark:text-primary-foreground":
              isActiveRoute(),
            "text-foreground group-hover:text-foreground dark:text-foreground dark:group-hover:text-foreground":
              !isActiveRoute(),
          }}
        >
          {props.title}
        </span>
      </div>

      {/* Subtle glow effect for active state */}
      <Show when={isActiveRoute()}>
        <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent dark:from-white/5" />
      </Show>
    </Button>
  );
}
