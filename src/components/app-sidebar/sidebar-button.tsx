import { A, useLocation } from "@solidjs/router";
import { Component, createMemo, Show } from "solid-js";
import { Button } from "~/components/ui/button";

export type SidebarButtonProps = {
  title: string;
  href: string;
  icon: Component;
};

export default function SidebarButton(props: SidebarButtonProps) {
  const location = useLocation();

  const isActiveRoute = createMemo(() => {
    return location.pathname.startsWith(props.href);
  });

  return (
    <Button
      as={A}
      href={props.href}
      variant="ghost"
      class="w-full justify-start gap-3 px-3 py-2 h-9 rounded-lg transition-all duration-300 ease-out group relative overflow-hidden border border-transparent"
      classList={{
        "bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 border-primary/20 dark:shadow-primary/10":
          isActiveRoute(),
        "hover:bg-gradient-to-r hover:from-accent/80 hover:to-accent/60 hover:shadow-md hover:shadow-accent/20 hover:border-accent/20 dark:hover:from-accent/60 dark:hover:to-accent/40":
          !isActiveRoute(),
      }}
    >
      {/* Active indicator */}
      <Show when={isActiveRoute()}>
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground dark:bg-primary-foreground rounded-r-full shadow-sm" />
      </Show>

      <div class="relative z-10 flex items-center gap-2 w-full">
        <div
          class="flex items-center justify-center w-5 h-5 rounded-md transition-all duration-300"
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
          class="text-sm font-medium tracking-wide truncate transition-all duration-300 group-hover:translate-x-0.5"
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
        <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent dark:from-white/5 rounded-lg" />
      </Show>
    </Button>
  );
}
