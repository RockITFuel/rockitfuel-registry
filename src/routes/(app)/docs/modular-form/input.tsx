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

const usage = `import { createForm, required, email } from "@modular-forms/solid";
import ModularInput from "~/components/modular-form/modular-input";

type LoginForm = {
  email: string;
  password: string;
};

export function LoginForm() {
  const [form, { Form, Field }] = createForm<LoginForm>();

  return (
    <Form onSubmit={handleSubmit}>
      <Field
        name="email"
        validate={[
          required("Email is required"),
          email("Please enter a valid email"),
        ]}
      >
        {(field, props) => (
          <ModularInput
            {...props}
            type="email"
            label="Email"
            value={field.value}
            error={field.error}
            placeholder="Enter your email"
          />
        )}
      </Field>

      <Field name="password" validate={required("Password is required")}>
        {(field, props) => (
          <ModularInput
            {...props}
            type="password"
            label="Password"
            value={field.value}
            error={field.error}
            placeholder="Enter your password"
          />
        )}
      </Field>
    </Form>
  );
}`;

const requiredExample = `<Field name="email" validate={required("Email is required")}>
  {(field, props) => (
    <ModularInput
      {...props}
      label="Email"
      value={field.value}
      error={field.error}
      required
    />
  )}
</Field>`;

const disabledExample = `<ModularInput
  name="readonly-field"
  label="Disabled Input"
  value="Cannot edit this"
  disabled
/>`;

const errorExample = `<ModularInput
  name="error-field"
  label="With Error"
  value=""
  error="This field has an error"
/>`;

const clearableExample = `<ModularInput
  name="search"
  label="Search"
  value={searchValue()}
  clearable
  icon={<SearchIcon class="size-4" />}
/>`;

const dependencies = ["@modular-forms/solid", "solid-motionone"];

export default function ModularInputPage() {
  return (
    <>
      <Title>Modular Input - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Modular Input</PageHeaderHeading>
        <PageHeaderDescription>
          A text input component integrated with @modular-forms/solid for
          validation and state management. Includes label, error display, and
          optional clearable functionality.
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
                  <td class="py-2">Label text displayed above input</td>
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
                    <code>clearable</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Show clear button when input has value</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>icon</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>JSX.Element</code>
                  </td>
                  <td class="py-2">Icon to display on the left side</td>
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
              <h3 class="mb-2 font-medium">Clearable with Icon</h3>
              <CodeBlock code={clearableExample} lang="tsx" />
            </div>
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Related</H2>
          <div class="grid gap-4 sm:grid-cols-2">
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/components/input"
            >
              <h3 class="font-medium group-hover:underline">Input</h3>
              <p class="text-muted-foreground text-sm">
                Base input component without form integration
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
