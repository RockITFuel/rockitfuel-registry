import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import { CodeBlock } from "~/components/code-block";
import { DependencyChips } from "~/components/dependency-chips";
import { H2 } from "~/components/doc-heading";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { ModularSearchableSelect } from "~/components/super-form/modular-searchable-select";
import { Card, CardContent } from "~/components/ui/card";

// Sample data for interactive examples
const SIMPLE_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
];

const USER_OPTIONS = [
  { id: "1", name: "John Doe", role: "Admin" },
  { id: "2", name: "Jane Smith", role: "Editor" },
  { id: "3", name: "Bob Wilson", role: "Viewer" },
  { id: "4", name: "Alice Brown", role: "Editor", disabled: true },
  { id: "5", name: "Charlie Davis", role: "Admin" },
];

const COLOR_OPTIONS = [
  { id: "red", label: "Red", color: "#ef4444" },
  { id: "green", label: "Green", color: "#22c55e" },
  { id: "blue", label: "Blue", color: "#3b82f6" },
  { id: "yellow", label: "Yellow", color: "#eab308" },
  { id: "purple", label: "Purple", color: "#a855f7" },
  { id: "pink", label: "Pink", color: "#ec4899" },
];

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
  // State for interactive examples
  const [singleValue, setSingleValue] = createSignal<string | null>(null);
  const [multiValue, setMultiValue] = createSignal<string[] | null>(null);
  const [userValue, setUserValue] = createSignal<string | null>(null);
  const [errorValue, setErrorValue] = createSignal<string | null>(null);
  const [noSearchValue, setNoSearchValue] = createSignal<string | null>(null);

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
          <H2 class="mb-4 font-semibold text-xl">Installation</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Install the complete modular form bundle:
          </p>
          <InstallCommand component="modular-form" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Dependencies</H2>
          <DependencyChips dependencies={dependencies} />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Usage</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Use with @modular-forms/solid Field component:
          </p>
          <CodeBlock code={usage} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Props</H2>
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
          <H2 class="mb-4 font-semibold text-xl">Examples</H2>
          <div class="space-y-8">
            {/* Single Selection */}
            <div class="space-y-4">
              <h3 class="font-medium">Single Selection</h3>
              <CodeBlock code={usage} lang="tsx" />
              <Card>
                <CardContent class="space-y-4 pt-6">
                  <ModularSearchableSelect
                    label="Select Fruit"
                    name="demo-single"
                    onValueChange={(v) => setSingleValue(v as string | null)}
                    options={SIMPLE_OPTIONS}
                    placeholder="Choose a fruit..."
                    value={singleValue()}
                  />
                  <p class="text-muted-foreground text-sm">
                    Value: {singleValue() ?? "null"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Multiple Selection */}
            <div class="space-y-4">
              <h3 class="font-medium">Multiple Selection</h3>
              <CodeBlock code={multipleExample} lang="tsx" />
              <Card>
                <CardContent class="space-y-4 pt-6">
                  <ModularSearchableSelect
                    label="Select Colors"
                    multiple
                    name="demo-colors"
                    onValueChange={(v) => setMultiValue(v as string[] | null)}
                    optionColor="color"
                    optionLabel="label"
                    options={COLOR_OPTIONS}
                    optionValue="id"
                    placeholder="Choose colors..."
                    value={multiValue()}
                  />
                  <p class="text-muted-foreground text-sm">
                    Values: {JSON.stringify(multiValue())}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Required Field */}
            <div class="space-y-4">
              <h3 class="font-medium">Required Field</h3>
              <CodeBlock code={requiredExample} lang="tsx" />
              <Card>
                <CardContent class="space-y-4 pt-6">
                  <ModularSearchableSelect
                    error={errorValue() ? undefined : "This field is required"}
                    label="Required Field"
                    name="demo-error"
                    onValueChange={(v) => setErrorValue(v as string | null)}
                    options={SIMPLE_OPTIONS}
                    placeholder="Select an option..."
                    required
                    value={errorValue()}
                  />
                  <p class="text-muted-foreground text-sm">
                    Value: {errorValue() ?? "null"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Disabled State */}
            <div class="space-y-4">
              <h3 class="font-medium">Disabled State</h3>
              <CodeBlock code={disabledExample} lang="tsx" />
              <Card>
                <CardContent class="space-y-4 pt-6">
                  <ModularSearchableSelect
                    disabled
                    label="Disabled Select"
                    name="demo-disabled"
                    options={SIMPLE_OPTIONS}
                    placeholder="Disabled..."
                    value="apple"
                  />
                  <p class="text-muted-foreground text-sm">
                    Pre-selected and disabled
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Error State */}
            <div class="space-y-4">
              <h3 class="font-medium">Error State</h3>
              <CodeBlock code={errorExample} lang="tsx" />
              <Card>
                <CardContent class="space-y-4 pt-6">
                  <ModularSearchableSelect
                    error="Please select an option"
                    label="With Error"
                    name="demo-error-display"
                    options={SIMPLE_OPTIONS}
                    placeholder="Select an option..."
                  />
                </CardContent>
              </Card>
            </div>

            {/* Colored Chips */}
            <div class="space-y-4">
              <h3 class="font-medium">Colored Chips</h3>
              <CodeBlock code={colorChipsExample} lang="tsx" />
              <Card>
                <CardContent class="space-y-4 pt-6">
                  <ModularSearchableSelect
                    label="Priority"
                    multiple
                    name="demo-priority"
                    optionColor="color"
                    optionLabel="label"
                    options={COLOR_OPTIONS}
                    optionValue="id"
                    placeholder="Select priorities..."
                    value={["red", "green"]}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Custom Option Keys */}
            <div class="space-y-4">
              <h3 class="font-medium">Custom Option Keys</h3>
              <p class="text-muted-foreground text-sm">
                Use <code>optionValue</code>, <code>optionLabel</code>, and{" "}
                <code>optionDisabled</code> to map custom object properties:
              </p>
              <Card>
                <CardContent class="space-y-4 pt-6">
                  <ModularSearchableSelect
                    label="Select User"
                    name="demo-users"
                    onValueChange={(v) => setUserValue(v as string | null)}
                    optionDisabled="disabled"
                    optionLabel="name"
                    options={USER_OPTIONS}
                    optionValue="id"
                    placeholder="Choose a user..."
                    value={userValue()}
                  />
                  <p class="text-muted-foreground text-sm">
                    Value: {userValue() ?? "null"} (Alice Brown is disabled)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Non-Searchable */}
            <div class="space-y-4">
              <h3 class="font-medium">Non-Searchable</h3>
              <p class="text-muted-foreground text-sm">
                Set <code>searchable=&#123;false&#125;</code> to disable the
                search input:
              </p>
              <Card>
                <CardContent class="space-y-4 pt-6">
                  <ModularSearchableSelect
                    label="Dropdown Only"
                    name="demo-no-search"
                    onValueChange={(v) => setNoSearchValue(v as string | null)}
                    options={SIMPLE_OPTIONS}
                    placeholder="Select without search..."
                    searchable={false}
                    value={noSearchValue()}
                  />
                  <p class="text-muted-foreground text-sm">
                    Value: {noSearchValue() ?? "null"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Initial Values */}
            <div class="space-y-4">
              <h3 class="font-medium">Initial Values</h3>
              <p class="text-muted-foreground text-sm">
                Pass a value or array of values to pre-select options:
              </p>
              <div class="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent class="pt-6">
                    <ModularSearchableSelect
                      label="Pre-selected User"
                      name="demo-initial"
                      optionLabel="name"
                      options={USER_OPTIONS}
                      optionValue="id"
                      placeholder="Choose a user..."
                      value="2"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent class="pt-6">
                    <ModularSearchableSelect
                      label="Pre-selected Colors"
                      multiple
                      name="demo-initial-multi"
                      optionColor="color"
                      optionLabel="label"
                      options={COLOR_OPTIONS}
                      optionValue="id"
                      placeholder="Choose colors..."
                      value={["red", "blue"]}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Related</H2>
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
              href="/docs/modular-form/select"
            >
              <h3 class="font-medium group-hover:underline">Modular Select</h3>
              <p class="text-muted-foreground text-sm">
                Simple select without search filtering
              </p>
            </A>
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/modular-form/combobox"
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
              href="/docs/modular-form"
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
