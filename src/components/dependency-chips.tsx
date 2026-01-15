import { For, Show } from "solid-js";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

type Dependency = {
  name: string;
  dev?: boolean;
};

type DependencyChipsProps = {
  dependencies: (string | Dependency)[];
  class?: string;
};

function getNpmUrl(packageName: string): string {
  return `https://www.npmjs.com/package/${encodeURIComponent(packageName)}`;
}

function parseDependency(dep: string | Dependency): Dependency {
  if (typeof dep === "string") {
    return { name: dep, dev: false };
  }
  return dep;
}

export function DependencyChips(props: DependencyChipsProps) {
  return (
    <div class={cn("flex flex-wrap gap-2", props.class)}>
      <For each={props.dependencies}>
        {(dep) => {
          const parsed = parseDependency(dep);
          return (
            <a
              class="group"
              href={getNpmUrl(parsed.name)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Badge
                class="cursor-pointer transition-opacity group-hover:opacity-80"
                variant={parsed.dev ? "outline" : "secondary"}
              >
                {parsed.name}
                <Show when={parsed.dev}>
                  <span class="ml-1 text-muted-foreground">(dev)</span>
                </Show>
              </Badge>
            </a>
          );
        }}
      </For>
    </div>
  );
}
