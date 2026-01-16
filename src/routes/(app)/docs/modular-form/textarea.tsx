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

const usage = `import { createForm, required, minLength } from "@modular-forms/solid";
import { ModularTextArea } from "~/components/modular-form/modular-text-area";

type FeedbackForm = {
  message: string;
  comments: string;
};

export function FeedbackForm() {
  const [form, { Form, Field }] = createForm<FeedbackForm>();

  return (
    <Form onSubmit={handleSubmit}>
      <Field
        name="message"
        validate={[
          required("Message is required"),
          minLength(10, "Message must be at least 10 characters"),
        ]}
      >
        {(field, props) => (
          <ModularTextArea
            {...props}
            label="Message"
            value={field.value}
            error={field.error}
            placeholder="Enter your message..."
            rows={4}
          />
        )}
      </Field>

      <Field name="comments">
        {(field, props) => (
          <ModularTextArea
            {...props}
            label="Additional Comments"
            value={field.value}
            error={field.error}
            placeholder="Optional comments..."
          />
        )}
      </Field>
    </Form>
  );
}`;

const requiredExample = `<Field name="description" validate={required("Description is required")}>
  {(field, props) => (
    <ModularTextArea
      {...props}
      label="Description"
      value={field.value}
      error={field.error}
      required
    />
  )}
</Field>`;

const disabledExample = `<ModularTextArea
  name="readonly-field"
  label="Disabled Textarea"
  value="This content cannot be edited"
  disabled
/>`;

const errorExample = `<ModularTextArea
  name="error-field"
  label="With Error"
  value=""
  error="This field has an error"
/>`;

const noResizeExample = `<ModularTextArea
  name="fixed-size"
  label="Fixed Size"
  value=""
  disableResize
  rows={5}
/>`;

const dependencies = ["@modular-forms/solid"];

export default function ModularTextareaPage() {
  return (
    <>
      <Title>Modular Textarea - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Modular Textarea</PageHeaderHeading>
        <PageHeaderDescription>
          A multi-line text input component integrated with @modular-forms/solid
          for validation and state management. Includes label, error display,
          and optional resize control.
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
                  <td class="py-2">Label text displayed above textarea</td>
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
                    <code>disableResize</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Prevent user from resizing the textarea</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>rows</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>number</code>
                  </td>
                  <td class="py-2">Number of visible text lines</td>
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
              <h3 class="mb-2 font-medium">Disabled Resize</h3>
              <CodeBlock code={noResizeExample} lang="tsx" />
            </div>
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Related</H2>
          <div class="grid gap-4 sm:grid-cols-2">
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/components/textarea"
            >
              <h3 class="font-medium group-hover:underline">Textarea</h3>
              <p class="text-muted-foreground text-sm">
                Base textarea component without form integration
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
