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
import ModularDatePicker from "~/components/modular-form/modular-date-picker";

type BookingForm = {
  startDate: Date;
  endDate: Date;
};

export function BookingForm() {
  const [form, { Form, Field }] = createForm<BookingForm>();

  return (
    <Form onSubmit={handleSubmit}>
      <Field name="startDate" validate={required("Start date is required")}>
        {(field, props) => (
          <ModularDatePicker
            {...props}
            label="Start Date"
            value={field.value}
            error={field.error}
            onDateChange={(date) => {
              // Handle date change
            }}
          />
        )}
      </Field>

      <Field name="endDate" validate={required("End date is required")}>
        {(field, props) => (
          <ModularDatePicker
            {...props}
            label="End Date"
            value={field.value}
            error={field.error}
            min="2024-01-01"
          />
        )}
      </Field>
    </Form>
  );
}`;

const requiredExample = `<Field name="dueDate" validate={required("Due date is required")}>
  {(field, props) => (
    <ModularDatePicker
      {...props}
      label="Due Date"
      value={field.value}
      error={field.error}
      required
    />
  )}
</Field>`;

const disabledExample = `<ModularDatePicker
  name="readonly-field"
  label="Disabled Date"
  value={new Date()}
  disabled
/>`;

const errorExample = `<ModularDatePicker
  name="error-field"
  label="With Error"
  value={undefined}
  error="Please select a date"
/>`;

const constraintsExample = `// Disable weekends and past dates
<ModularDatePicker
  {...props}
  label="Business Day"
  value={field.value}
  error={field.error}
  disableWeekends
  disablePast
/>`;

const weekNumbersExample = `// Show ISO week numbers
<ModularDatePicker
  {...props}
  label="Week Selection"
  value={field.value}
  error={field.error}
  showWeekNumbers
/>`;

const clearableExample = `<ModularDatePicker
  {...props}
  label="Optional Date"
  value={field.value}
  error={field.error}
  clearButton
/>`;

const minMaxExample = `// Set date range constraints
<ModularDatePicker
  {...props}
  label="Appointment"
  value={field.value}
  error={field.error}
  min="2024-01-01"
  max="2024-12-31"
/>`;

const dependencies = [
  "@modular-forms/solid",
  "@ark-ui/solid",
  "@internationalized/date",
  "date-fns",
];

export default function ModularDatePickerPage() {
  return (
    <>
      <Title>Modular Date Picker - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Modular Date Picker</PageHeaderHeading>
        <PageHeaderDescription>
          A date picker component integrated with @modular-forms/solid. Supports
          Dutch date format (dd-MM-yyyy), flexible input parsing, week numbers,
          and various date constraints.
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
                  <td class="py-2">Label text displayed above picker</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>value</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>Date | number</code>
                  </td>
                  <td class="py-2">Current date value (Date or timestamp)</td>
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
                    <code>min</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Minimum date (yyyy-mm-dd format)</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>max</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>string</code>
                  </td>
                  <td class="py-2">Maximum date (yyyy-mm-dd format)</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>showWeekNumbers</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Show ISO week numbers in calendar</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>disableWeekends</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Disable Saturday and Sunday</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>disablePast</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Disable past dates</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>disableToday</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Disable today's date</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>clearButton</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>boolean</code>
                  </td>
                  <td class="py-2">Show clear button</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4">
                    <code>onDateChange</code>
                  </td>
                  <td class="py-2 pr-4">
                    <code>function</code>
                  </td>
                  <td class="py-2">Callback when date changes</td>
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
              <h3 class="mb-2 font-medium">Date Constraints</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{constraintsExample}</code>
              </pre>
            </div>
            <div>
              <h3 class="mb-2 font-medium">Week Numbers</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{weekNumbersExample}</code>
              </pre>
            </div>
            <div>
              <h3 class="mb-2 font-medium">Clearable</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{clearableExample}</code>
              </pre>
            </div>
            <div>
              <h3 class="mb-2 font-medium">Min/Max Range</h3>
              <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{minMaxExample}</code>
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Date Input Format</h2>
          <p class="mb-4 text-muted-foreground text-sm">
            The component supports flexible Dutch date input. Users can type
            dates in various formats:
          </p>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground text-sm">
            <li>
              <code>02-02-2025</code> - Standard Dutch format
            </li>
            <li>
              <code>02022025</code> - Without separators
            </li>
            <li>
              <code>2-2-2025</code> - Single digit day/month
            </li>
          </ul>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Related</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/components/date-picker"
            >
              <h3 class="font-medium group-hover:underline">Date Picker</h3>
              <p class="text-muted-foreground text-sm">
                Base date picker component without form integration
              </p>
            </A>
            <A
              class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
              href="/docs/libraries/date-utils"
            >
              <h3 class="font-medium group-hover:underline">Date Utils</h3>
              <p class="text-muted-foreground text-sm">
                Utility functions for date handling
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
