import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { CodeBlock } from "~/components/code-block";
import { DependencyChips } from "~/components/dependency-chips";
import { H2 } from "~/components/doc-heading";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

const usage = `import { createForm, required } from "@modular-forms/solid";
import ModularSelect from "~/components/modular-form/modular-select";

type ProfileForm = {
  country: string;
  language: string;
};

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "nl", label: "Netherlands" },
  { value: "de", label: "Germany" },
];

export function ProfileForm() {
  const [form, { Form, Field }] = createForm<ProfileForm>();

  return (
    <Form onSubmit={handleSubmit}>
      <Field name="country" validate={required("Country is required")}>
        {(field, props) => (
          <ModularSelect
            {...props}
            label="Country"
            value={field.value}
            error={field.error}
            options={countries}
            placeholder="Select a country"
          />
        )}
      </Field>
    </Form>
  );
}`;

const requiredExample = `<Field name="status" validate={required("Status is required")}>
  {(field, props) => (
    <ModularSelect
      {...props}
      label="Status"
      value={field.value}
      error={field.error}
      options={[
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]}
      required
    />
  )}
</Field>`;

const disabledExample = `<ModularSelect
  name="readonly-field"
  label="Disabled Select"
  value="option1"
  options={[{ value: "option1", label: "Option 1" }]}
  disabled
/>`;

const errorExample = `<ModularSelect
  name="error-field"
  label="With Error"
  value=""
  options={[]}
  error="Please select an option"
/>`;

const queryFnExample = `// Fetch options from an API
<ModularSelect
  {...props}
  label="Category"
  value={field.value}
  error={field.error}
  queryFn={async () => {
    const response = await fetch("/api/categories");
    return response.json();
  }}
  optionValue="id"
  optionTextValue="name"
/>`;

const dependencies = ["@modular-forms/solid"];

export default function ModularSelectPage() {
  return (
    <>
      <Title>Modular Select - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Modular Select</PageHeaderHeading>
        <PageHeaderDescription>
          A select dropdown component integrated with @modular-forms/solid for
          validation and state management. Supports static options or async data
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
                    <code>queryFn</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>function</code>
                  </td>
                  <td class="py-2">
                    Async function to fetch options (alternative to options)
                  </td>
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
                    <code>placeholder</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Placeholder text when no selection</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Examples</H2>
          <div class="space-y-6">
            <div>
              <h3 class="mb-2 font-medium">Required Field</h3>
              <CodeBlock code={requiredExample} lang="tsx" />
            </div>
            <div>
              <h3 class="mb-2 font-medium">Disabled State</h3>
              <CodeBlock code={disabledExample} lang="tsx" />
            </div>
            <div>
              <h3 class="mb-2 font-medium">Error State</h3>
              <CodeBlock code={errorExample} lang="tsx" />
            </div>
            <div>
              <h3 class="mb-2 font-medium">Async Options with queryFn</h3>
              <CodeBlock code={queryFnExample} lang="tsx" />
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
              href="/docs/modular-form/searchable-select"
            >
              <h3 class="font-medium group-hover:underline">
                Modular Searchable Select
              </h3>
              <p class="text-muted-foreground text-sm">
                Select with search filtering capability
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
