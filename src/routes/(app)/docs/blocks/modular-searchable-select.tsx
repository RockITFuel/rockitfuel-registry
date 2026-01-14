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
import { ModularSearchableSelect } from "~/components/modular-form/modular-searchable-select";

type TeamForm = {
  member: string;
  tags: string[];
};

const members = [
  { value: "1", label: "Alice Johnson" },
  { value: "2", label: "Bob Smith" },
  { value: "3", label: "Carol Williams" },
  { value: "4", label: "David Brown" },
];

export function TeamForm() {
  const [form, { Form, Field }] = createForm<TeamForm>();

  return (
    <Form onSubmit={handleSubmit}>
      <Field name="member" validate={required("Member is required")}>
        {(field, props) => (
          <ModularSearchableSelect
            {...props}
            label="Team Member"
            value={field.value}
            error={field.error}
            options={members}
            placeholder="Search for a member..."
            searchPlaceholder="Type to filter..."
          />
        )}
      </Field>
    </Form>
  );
}`;

const multipleExample = `<Field name="tags">
  {(field, props) => (
    <ModularSearchableSelect
      {...props}
      label="Tags"
      value={field.value}
      error={field.error}
      options={tags}
      multiple
      placeholder="Select tags..."
    />
  )}
</Field>`;

const requiredExample = `<Field name="category" validate={required("Category is required")}>
  {(field, props) => (
    <ModularSearchableSelect
      {...props}
      label="Category"
      value={field.value}
      error={field.error}
      options={categories}
      required
    />
  )}
</Field>`;

const disabledExample = `<ModularSearchableSelect
  name="readonly-field"
  label="Disabled Select"
  value="option1"
  options={[{ value: "option1", label: "Option 1" }]}
  disabled
/>`;

const errorExample = `<ModularSearchableSelect
  name="error-field"
  label="With Error"
  value=""
  options={[]}
  error="Please select an option"
/>`;

const colorChipsExample = `// Options with color chips
const priorities = [
  { value: "high", label: "High", color: "#ef4444" },
  { value: "medium", label: "Medium", color: "#f59e0b" },
  { value: "low", label: "Low", color: "#22c55e" },
];

<ModularSearchableSelect
  {...props}
  label="Priority"
  options={priorities}
  optionColor="color"
  multiple
/>`;

const dependencies = ["@modular-forms/solid"];

export default function ModularSearchableSelectPage() {
  return (
    <>
      <Title>Modular Searchable Select - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Modular Searchable Select</PageHeaderHeading>
        <PageHeaderDescription>
          A searchable select component integrated with @modular-forms/solid.
          Supports filtering, multiple selection, colored chips, and async data
          fetching.
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
                  <td class="py-2">Label text displayed above select</td>
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
                    <code>multiple</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Enable multiple selection mode</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>searchable</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Enable search filtering (default: true)</td>
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
                    <code>optionLabel</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Key for option label (default: "label")</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>optionColor</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Key for chip color (hex, rgb, hsl)</td>
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
                    <code>placeholder</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Placeholder when no selection</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>searchPlaceholder</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Placeholder for search input</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Examples</h2>
          <div class="space-y-6">
            <div>
              <h3 class="mb-2 font-medium">Multiple Selection</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{multipleExample}</code>
              </pre>
            </div>
            <div>
              <h3 class="mb-2 font-medium">Required Field</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{requiredExample}</code>
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
              <h3 class="mb-2 font-medium">Colored Chips</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{colorChipsExample}</code>
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Related</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/components/select"
            >
              <h3 class="font-medium group-hover:underline">Select</h3>
              <p class="text-muted-foreground text-sm">
                Base select component without form integration
              </p>
            </A>
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/blocks/modular-select"
            >
              <h3 class="font-medium group-hover:underline">Modular Select</h3>
              <p class="text-muted-foreground text-sm">
                Simple select without search filtering
              </p>
            </A>
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/blocks/modular-combobox"
            >
              <h3 class="font-medium group-hover:underline">
                Modular Combobox
              </h3>
              <p class="text-muted-foreground text-sm">
                Combobox with autocomplete functionality
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
