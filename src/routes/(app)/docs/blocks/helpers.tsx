import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

const components = [
  {
    name: "action-wrapper",
    description: "Wrapper for async actions with loading state",
  },
  { name: "action-button", description: "Button that handles async actions" },
  {
    name: "empty-state",
    description: "Empty state placeholder with icon and message",
  },
  { name: "empty-table", description: "Empty state for tables" },
  { name: "loading-table", description: "Loading skeleton for tables" },
  { name: "expandable", description: "Expandable/collapsible content section" },
  { name: "re-route", description: "Programmatic navigation component" },
  { name: "role-badge", description: "Badge displaying user roles" },
  {
    name: "upsert-dialog-trigger",
    description: "Dialog trigger for create/update operations",
  },
  {
    name: "date-range-with-popover",
    description: "Date range picker with popover",
  },
];

export default function HelpersPage() {
  return (
    <>
      <Title>Helpers - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Helper Components</PageHeaderHeading>
        <PageHeaderDescription>
          Utility components for common UI patterns like actions, empty states,
          loading states, and more. These components help reduce boilerplate in
          your application.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <h2 class="mb-4 font-semibold text-xl">Installation</h2>
          <InstallCommand component="helpers" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Dependencies</h2>
          <div class="flex flex-wrap gap-2">
            <code class="rounded bg-muted px-2 py-1 text-sm">debounce</code>
            <code class="rounded bg-muted px-2 py-1 text-sm">lucide-solid</code>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Included Components</h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <For each={components}>
              {(component) => (
                <div class="rounded-md border p-3">
                  <code class="font-medium text-sm">{component.name}</code>
                  <p class="mt-1 text-muted-foreground text-xs">
                    {component.description}
                  </p>
                </div>
              )}
            </For>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Features</h2>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Action wrappers with automatic loading state</li>
            <li>Empty state components for tables and lists</li>
            <li>Loading skeletons for common patterns</li>
            <li>Date range selection with popover</li>
            <li>CRUD dialog triggers</li>
          </ul>
        </section>
      </div>
    </>
  );
}
