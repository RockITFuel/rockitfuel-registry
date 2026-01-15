import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { CodeBlock } from "~/components/code-block";
import { DependencyChips } from "~/components/dependency-chips";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

const usage = `import { createForm } from "@modular-forms/solid";
import ModularCheckbox from "~/components/modular-form/modular-checkbox";

type SettingsForm = {
  notifications: boolean;
  marketing: boolean;
  terms: boolean;
};

export function SettingsForm() {
  const [form, { Form, Field }] = createForm<SettingsForm>();

  return (
    <Form onSubmit={handleSubmit}>
      <Field name="notifications" type="boolean">
        {(field, props) => (
          <ModularCheckbox
            {...props}
            label="Enable notifications"
            helperText="Receive updates about your account"
            value={field.value}
            error={field.error}
            onCheckedChange={(checked) => {
              // Handle change
            }}
          />
        )}
      </Field>

      <Field name="terms" type="boolean">
        {(field, props) => (
          <ModularCheckbox
            {...props}
            label="Accept terms and conditions"
            value={field.value}
            error={field.error}
            onCheckedChange={(checked) => {
              // Handle change
            }}
            required
          />
        )}
      </Field>
    </Form>
  );
}`;

const requiredExample = `<Field name="consent" type="boolean">
  {(field, props) => (
    <ModularCheckbox
      {...props}
      label="I agree to the privacy policy"
      value={field.value}
      error={field.error}
      onCheckedChange={handleChange}
      required
    />
  )}
</Field>`;

const disabledExample = `<ModularCheckbox
  name="readonly-field"
  label="Disabled checkbox"
  value={true}
  onCheckedChange={() => {}}
  disabled
/>`;

const errorExample = `<ModularCheckbox
  name="error-field"
  label="Accept terms"
  value={false}
  onCheckedChange={() => {}}
  error="You must accept the terms"
/>`;

const helperTextExample = `<ModularCheckbox
  {...props}
  label="Subscribe to newsletter"
  helperText="We'll send you updates about new features and promotions"
  value={field.value}
  onCheckedChange={handleChange}
/>`;

const noToggleLabelExample = `// Prevent clicking label from toggling
<ModularCheckbox
  {...props}
  label="Click only the checkbox"
  value={field.value}
  onCheckedChange={handleChange}
  disableToggleLabel
/>`;

const dependencies = ["@modular-forms/solid", "@kobalte/core"];

export default function ModularCheckboxPage() {
  return (
    <>
      <Title>Modular Checkbox - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Modular Checkbox</PageHeaderHeading>
        <PageHeaderDescription>
          A checkbox component integrated with @modular-forms/solid for boolean
          form fields. Includes label, helper text, error display, and
          accessible keyboard navigation.
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
            Use with @modular-forms/solid Field component with{" "}
            <code>type="boolean"</code>:
          </p>
          <CodeBlock code={usage} lang="tsx" />
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
                  <td class="py-2">Label text displayed next to checkbox</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>helperText</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Additional description text below label</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>value</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Current checked state</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>onCheckedChange</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>function</code>
                  </td>
                  <td class="py-2">
                    Required. Callback when checked state changes
                  </td>
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
                    <code>defaultChecked</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Initial checked state</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>disableToggleLabel</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Prevent label click from toggling</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>wrapperClass</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Additional class for wrapper element</td>
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
              <h3 class="mb-2 font-medium">With Helper Text</h3>
              <CodeBlock code={helperTextExample} lang="tsx" />
            </div>
            <div>
              <h3 class="mb-2 font-medium">Disable Label Toggle</h3>
              <CodeBlock code={noToggleLabelExample} lang="tsx" />
            </div>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Related</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/components/checkbox"
            >
              <h3 class="font-medium group-hover:underline">Checkbox</h3>
              <p class="text-muted-foreground text-sm">
                Base checkbox component without form integration
              </p>
            </A>
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/components/switch"
            >
              <h3 class="font-medium group-hover:underline">Switch</h3>
              <p class="text-muted-foreground text-sm">
                Toggle switch for boolean settings
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
