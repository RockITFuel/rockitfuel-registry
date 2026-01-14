import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { DependencyChips } from "~/components/dependency-chips";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

const usage = `import { createForm, required } from "@modular-forms/solid";
import ModularCombobox from "~/components/modular-form/modular-combobox";

type SearchForm = {
  product: string;
};

const products = [
  { value: "1", label: "MacBook Pro" },
  { value: "2", label: "MacBook Air" },
  { value: "3", label: "iPad Pro" },
  { value: "4", label: "iPhone 15" },
];

export function SearchForm() {
  const [form, { Form, Field }] = createForm<SearchForm>();

  return (
    <Form onSubmit={handleSubmit}>
      <Field name="product" validate={required("Product is required")}>
        {(field, props) => (
          <ModularCombobox
            {...props}
            label="Product"
            value={field.value}
            error={field.error}
            options={products}
            onValueChange={(value) => {
              // Handle selection
            }}
            placeholder="Search products..."
          />
        )}
      </Field>
    </Form>
  );
}`;

const requiredExample = `<Field name="city" validate={required("City is required")}>
  {(field, props) => (
    <ModularCombobox
      {...props}
      label="City"
      value={field.value}
      error={field.error}
      options={cities}
      onValueChange={handleCityChange}
      required
    />
  )}
</Field>`;

const clearableExample = `<ModularCombobox
  {...props}
  label="Search"
  value={field.value}
  options={options}
  onValueChange={handleChange}
  clearable
/>`;

const disabledExample = `<ModularCombobox
  name="readonly-field"
  label="Disabled Combobox"
  value="option1"
  options={[{ value: "option1", label: "Option 1" }]}
  onValueChange={() => {}}
  disabled
/>`;

const errorExample = `<ModularCombobox
  name="error-field"
  label="With Error"
  value=""
  options={[]}
  onValueChange={() => {}}
  error="Please select an option"
/>`;

const actionOptionsExample = `// Add custom action items
<ModularCombobox
  {...props}
  label="Category"
  options={categories}
  onValueChange={handleChange}
  firstActionOptions={[
    {
      value: "create",
      label: "Create new category",
      icon: <PlusIcon class="size-4" />,
      action: () => openCreateDialog(),
    },
  ]}
  lastActionOptions={[
    {
      value: "manage",
      label: "Manage categories",
      icon: <SettingsIcon class="size-4" />,
      action: () => openManageDialog(),
    },
  ]}
/>`;

const dependencies = ["@modular-forms/solid", "solid-motionone"];

export default function ModularComboboxPage() {
  return (
    <>
      <Title>Modular Combobox - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Modular Combobox</PageHeaderHeading>
        <PageHeaderDescription>
          A combobox component with autocomplete integrated with
          @modular-forms/solid. Supports type-ahead filtering, clearable state,
          and custom action options.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <h2 class="mb-4 font-semibold text-xl">Installation</h2>
          <p class="mb-4 text-muted-foreground text-sm">
            Install the complete modular form bundle:
          </p>
          <InstallCommand component="modular-form" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Dependencies</h2>
          <DependencyChips dependencies={dependencies} />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Usage</h2>
          <p class="mb-4 text-muted-foreground text-sm">
            Use with @modular-forms/solid Field component:
          </p>
          <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
            <code>{usage}</code>
          </pre>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Props</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="py-2 pr-4 text-left font-medium">Prop</th>
                  <th class="py-2 pr-4 text-left font-medium">Type</th>
                  <th class="py-2 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody class="text-muted-foreground">
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>name</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Required. Form field name</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>label</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Label text displayed above combobox</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>options</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>array</code>
                  </td>
                  <td class="py-2">Array of option objects</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>onValueChange</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>function</code>
                  </td>
                  <td class="py-2">Required. Callback when value changes</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>clearable</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Show clear button when value is selected</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>optionValue</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Key for option value (default: "value")</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>optionTextValue</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Key for option label (default: "label")</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>error</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Error message to display</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>firstActionOptions</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>array</code>
                  </td>
                  <td class="py-2">Action options at the start of the list</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>lastActionOptions</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>array</code>
                  </td>
                  <td class="py-2">Action options at the end of the list</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Examples</h2>
          <div class="space-y-6">
            <div>
              <h3 class="mb-2 font-medium">Required Field</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{requiredExample}</code>
              </pre>
            </div>
            <div>
              <h3 class="mb-2 font-medium">Clearable</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{clearableExample}</code>
              </pre>
            </div>
            <div>
              <h3 class="mb-2 font-medium">Disabled State</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{disabledExample}</code>
              </pre>
            </div>
            <div>
              <h3 class="mb-2 font-medium">Error State</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{errorExample}</code>
              </pre>
            </div>
            <div>
              <h3 class="mb-2 font-medium">Custom Action Options</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{actionOptionsExample}</code>
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Related</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/components/combobox"
            >
              <h3 class="font-medium group-hover:underline">Combobox</h3>
              <p class="text-muted-foreground text-sm">
                Base combobox component without form integration
              </p>
            </A>
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/blocks/modular-searchable-select"
            >
              <h3 class="font-medium group-hover:underline">
                Modular Searchable Select
              </h3>
              <p class="text-muted-foreground text-sm">
                Searchable select with multiple selection
              </p>
            </A>
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/blocks/modular-form"
            >
              <h3 class="font-medium group-hover:underline">Modular Form</h3>
              <p class="text-muted-foreground text-sm">
                Complete form component bundle
              </p>
            </A>
          </div>
        </section>
      </div>
    </>
  );
}
