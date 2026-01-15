import { makePersisted } from "@solid-primitives/storage";
import { createSignal, For } from "solid-js";
import { CopyButton } from "~/components/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { REGISTRY_URL } from "~/config/docs";

type PackageManager = "bun" | "pnpm" | "npm" | "yarn";

const packageManagers: { id: PackageManager; label: string }[] = [
  { id: "bun", label: "bun" },
  { id: "pnpm", label: "pnpm" },
  { id: "npm", label: "npm" },
  { id: "yarn", label: "yarn" },
];

function getCommand(pm: PackageManager, component: string): string {
  const url = `${REGISTRY_URL}/r/${component}.json`;
  switch (pm) {
    case "bun":
      return `bunx --bun shadcn@latest add ${url}`;
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${url}`;
    case "npm":
      return `bunx shadcn@latest add ${url}`;
    case "yarn":
      return `bunx shadcn@latest add ${url}`;
  }
}

// Persisted package manager preference
const [preferredPM, setPreferredPM] = makePersisted(
  createSignal<PackageManager>("bun"),
  { name: "preferred-package-manager" }
);

type InstallCommandProps = {
  component: string;
};

export function InstallCommand(props: InstallCommandProps) {
  return (
    <Tabs
      class="relative"
      onChange={(value) => setPreferredPM(value as PackageManager)}
      value={preferredPM()}
    >
      <TabsList class="h-9 rounded-b-none border-b-0">
        <For each={packageManagers}>
          {(pm) => (
            <TabsTrigger class="px-3 py-1 text-xs" value={pm.id}>
              {pm.label}
            </TabsTrigger>
          )}
        </For>
      </TabsList>
      <For each={packageManagers}>
        {(pm) => (
          <TabsContent class="mt-0" value={pm.id}>
            <div class="relative rounded-md rounded-tl-none bg-muted">
              <pre class="scrollbar-code overflow-x-auto p-4 pr-12 text-sm">
                <code>{getCommand(pm.id, props.component)}</code>
              </pre>
              <CopyButton
                class="absolute top-2 right-2"
                value={getCommand(pm.id, props.component)}
              />
            </div>
          </TabsContent>
        )}
      </For>
    </Tabs>
  );
}
