import { For } from "solid-js";
import type { Route } from "~/types/route";
import SidebarButton from "./sidebar-button";

export type SidebarButtonListProps = {
  title?: string;
  routes: Route[];
};

export default function SidebarButtonList(props: SidebarButtonListProps) {
  return (
    <nav class="space-y-3">
      <div class="px-3 py-1.5">
        <span class="font-medium text-muted-foreground text-xs uppercase tracking-wider dark:text-muted-foreground">
          {props.title || "Menu"}
        </span>
      </div>
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
    </nav>
  );
}
