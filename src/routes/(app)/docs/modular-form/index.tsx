import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { CodeBlock } from "~/components/code-block";
import { DependencyChips } from "~/components/dependency-chips";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

const components = [
  {
    name: "modular-input",
    description: "Text input with label and validation",
    baseComponent: "/docs/components/input",
  },
  {
    name: "modular-text-area",
    description: "Multi-line text input",
    baseComponent: "/docs/components/textarea",
  },
  {
    name: "modular-select",
    description: "Select dropdown",
    baseComponent: "/docs/components/select",
  },
  {
    name: "modular-searchable-select",
    description: "Searchable select with filtering",
    baseComponent: "/docs/components/select",
  },
  {
    name: "modular-combobox",
    description: "Combobox with autocomplete",
    baseComponent: "/docs/components/combobox",
  },
  {
    name: "modular-date-picker",
    description: "Date selection with calendar",
    baseComponent: "/docs/components/date-picker",
  },
  {
    name: "modular-color-picker",
    description: "Color selection",
    baseComponent: "/docs/components/color-picker",
  },
  {
    name: "modular-checkbox",
    description: "Checkbox with label",
    baseComponent: "/docs/components/checkbox",
  },
  { name: "modular-file-input-list", description: "Multiple file upload" },
  { name: "modular-password-update", description: "Password change form" },
  {
    name: "modular-label",
    description: "Form field label",
    baseComponent: "/docs/components/label",
  },
  { name: "modular-error", description: "Error message display" },
  {
    name: "modular-forms-select",
    description: "Select integrated with modular-forms",
    baseComponent: "/docs/components/select",
  },
  {
    name: "modular-forms-combobox",
    description: "Combobox integrated with modular-forms",
    baseComponent: "/docs/components/combobox",
  },
  { name: "modular-forms-toggle-button", description: "Toggle button" },
  {
    name: "modular-forms-toggle-button-group",
    description: "Toggle button group",
  },
];

const dependencies = [
  "@modular-forms/solid",
  "@ark-ui/solid",
  "@internationalized/date",
  "date-fns",
  "solid-motionone",
  "debounce",
];

const usageExample = `import { createForm, required, email } from "@modular-forms/solid";
import { ModularInput } from "~/components/modular-form/modular-input";
import { ModularSelect } from "~/components/modular-form/modular-select";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
};

export function ContactForm() {
  const [form, { Form, Field }] = createForm<ContactForm>();

  return (
    <Form onSubmit={handleSubmit}>
      <Field name="name" validate={required("Name is required")}>
        {(field, props) => (
          <ModularInput
            {...props}
            label="Name"
            value={field.value}
            error={field.error}
          />
        )}
      </Field>

      <Field name="email" validate={[
        required("Email is required"),
        email("Please enter a valid email")
      ]}>
        {(field, props) => (
          <ModularInput
            {...props}
            type="email"
            label="Email"
            value={field.value}
            error={field.error}
          />
        )}
      </Field>

      <Field name="subject">
        {(field, props) => (
          <ModularSelect
            {...props}
            label="Subject"
            value={field.value}
            options={["General", "Support", "Sales"]}
          />
        )}
      </Field>
    </Form>
  );
}`;

export default function ModularFormPage() {
  return (
    <>
      <Title>Modular Form - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Modular Form</PageHeaderHeading>
        <PageHeaderDescription>
          A comprehensive set of form components integrated with
          @modular-forms/solid for validation and state management. Includes 16
          form field components.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <h2 class="mb-4 font-semibold text-xl">Installation</h2>
          <InstallCommand component="modular-form" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Dependencies</h2>
          <DependencyChips dependencies={dependencies} />
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
                  <Show keyed when={component.baseComponent}>
                    {(href) => (
                      <A
                        class="mt-2 inline-block text-primary text-xs hover:underline"
                        href={href}
                      >
                        View base component →
                      </A>
                    )}
                  </Show>
                </div>
              )}
            </For>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Usage</h2>
          <p class="mb-4 text-muted-foreground text-sm">
            Use with @modular-forms/solid to create validated forms:
          </p>
          <CodeBlock code={usageExample} lang="tsx" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Validation Behavior</h2>
          <p class="mb-4 text-muted-foreground text-sm">
            All modular form components integrate with @modular-forms/solid
            validation:
          </p>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground text-sm">
            <li>
              <strong>Error display:</strong> Errors appear below the field when
              validation fails
            </li>
            <li>
              <strong>Touch state:</strong> Errors only show after the field has
              been touched
            </li>
            <li>
              <strong>Real-time validation:</strong> Fields can validate on
              change, blur, or submit
            </li>
            <li>
              <strong>Custom validators:</strong> Use built-in validators or
              create custom validation functions
            </li>
            <li>
              <strong>Async validation:</strong> Support for async validators
              (e.g., checking email availability)
            </li>
          </ul>
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
