import { For } from "solid-js";
import SidebarButton from "./sidebar-button";
import type { Route } from "~/types/route";

export type SidebarButtonListProps = {
  title?: string;
  routes: Route[];
};

export default function SidebarButtonList(props: SidebarButtonListProps) {
  return (
    <nav class="space-y-3">
      <div class="px-3 py-1.5">
        <span class="text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
          {props.title || "Menu"}
        </span>
      </div>
      <div class="space-y-1 px-2">
        <For each={props.routes}>
          {(route) => (
            <SidebarButton
              title={route.title}
              href={route.href}
              icon={route.icon}
            />
          )}
        </For>
      </div>
    </nav>
  );
}
