import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

const components = [
  { name: "super-input", description: "Text input with label and validation" },
  { name: "super-text-area", description: "Multi-line text input" },
  { name: "super-select", description: "Select dropdown" },
  {
    name: "super-searchable-select",
    description: "Searchable select with filtering",
  },
  { name: "super-combobox", description: "Combobox with autocomplete" },
  { name: "super-date-picker", description: "Date selection with calendar" },
  { name: "super-color-picker", description: "Color selection" },
  { name: "super-checkbox", description: "Checkbox with label" },
  { name: "super-file-input-list", description: "Multiple file upload" },
  { name: "super-password-update", description: "Password change form" },
  { name: "super-label", description: "Form field label" },
  { name: "super-error", description: "Error message display" },
  {
    name: "modular-forms-select",
    description: "Select integrated with modular-forms",
  },
  {
    name: "modular-forms-combobox",
    description: "Combobox integrated with modular-forms",
  },
  { name: "modular-forms-toggle-button", description: "Toggle button" },
  {
    name: "modular-forms-toggle-button-group",
    description: "Toggle button group",
  },
];

export default function SuperFormPage() {
  return (
    <>
      <Title>Super Form - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Super Form</PageHeaderHeading>
        <PageHeaderDescription>
          A comprehensive set of form components integrated with
          @modular-forms/solid for validation and state management. Includes 16
          form field components.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <h2 class="mb-4 font-semibold text-xl">Installation</h2>
          <InstallCommand component="super-form" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Dependencies</h2>
          <div class="flex flex-wrap gap-2">
            <code class="rounded bg-muted px-2 py-1 text-sm">
              @modular-forms/solid
            </code>
            <code class="rounded bg-muted px-2 py-1 text-sm">
              @ark-ui/solid
            </code>
            <code class="rounded bg-muted px-2 py-1 text-sm">
              @internationalized/date
            </code>
            <code class="rounded bg-muted px-2 py-1 text-sm">date-fns</code>
            <code class="rounded bg-muted px-2 py-1 text-sm">
              solid-motionone
            </code>
            <code class="rounded bg-muted px-2 py-1 text-sm">debounce</code>
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
            <li>Full integration with @modular-forms/solid</li>
            <li>Built-in validation support</li>
            <li>Accessible form controls</li>
            <li>Consistent styling with shadcn/ui</li>
            <li>Date picker with @internationalized/date</li>
            <li>Searchable dropdowns and comboboxes</li>
          </ul>
        </section>
      </div>
    </>
  );
}
