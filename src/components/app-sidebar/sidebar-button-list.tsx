import { A } from "@solidjs/router";
import { ChevronDown, ChevronRight } from "lucide-solid";
import { For, Show } from "solid-js";
import type { Route } from "~/types/route";
import SidebarButton from "./sidebar-button";
import { useSidebar } from "./sidebar-provider";

export type SidebarButtonListProps = {
  id: string;
  title?: string;
  routes: Route[];
};

export default function SidebarButtonList(props: SidebarButtonListProps) {
  const { isSectionExpanded, toggleSection } = useSidebar();

  return (
    <nav class="space-y-3">
      <div class="group flex w-full items-center justify-between px-3 py-1.5 transition-colors hover:bg-accent/50">
        <A
          class="cursor-pointer font-medium text-muted-foreground text-xs uppercase tracking-wider transition-colors group-hover:text-foreground dark:text-muted-foreground dark:group-hover:text-foreground"
          href={props.routes[0]?.href ?? "#"}
        >
          {props.title || "Menu"}
        </A>
        <button
          class="cursor-pointer rounded p-0.5 transition-colors hover:bg-accent"
          onClick={() => toggleSection(props.id)}
          type="button"
        >
          <Show
            fallback={
              <ChevronRight class="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            }
            when={isSectionExpanded(props.id)}
          >
            <ChevronDown class="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </Show>
        </button>
      </div>
      <Show when={isSectionExpanded(props.id)}>
        <div class="space-y-1 px-2">
          <For each={props.routes}>
            {(route) => (
              <SidebarButton
                href={route.href}
                icon={route.icon}
                title={route.title}
              />
            )}
          </For>
        </div>
      </Show>
    </nav>
  );
}
