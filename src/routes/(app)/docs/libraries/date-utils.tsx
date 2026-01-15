import { Title } from "@solidjs/meta";
import { CodeBlock } from "~/components/code-block";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

export default function DateUtilsPage() {
  return (
    <>
      <Title>Date Utils - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Date Utils</PageHeaderHeading>
        <PageHeaderDescription>
          Date conversion and parsing utilities with support for Dutch date
          formats and timezone handling.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <h2 class="mb-4 font-semibold text-xl">Installation</h2>
          <InstallCommand component="date-utils" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Dependencies</h2>
          <div class="flex flex-wrap gap-2">
            <code class="rounded bg-muted px-2 py-1 text-sm">
              @internationalized/date
            </code>
            <code class="rounded bg-muted px-2 py-1 text-sm">date-fns</code>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Features</h2>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground">
            <li>
              Convert between JavaScript Date and @internationalized/date types
            </li>
            <li>Parse Dutch date strings (e.g., "23-12-2024")</li>
            <li>Format dates for display</li>
            <li>Timezone-aware conversions</li>
          </ul>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Usage</h2>
          <CodeBlock
            code={`import {
  dateToCalendarDate,
  calendarDateToDate,
  parseDutchDate,
  formatDate
} from "~/lib/date-utils"

// Convert JS Date to CalendarDate
const calDate = dateToCalendarDate(new Date())

// Convert CalendarDate to JS Date
const jsDate = calendarDateToDate(calDate)

// Parse Dutch date string
const parsed = parseDutchDate("23-12-2024")

// Format date for display
const formatted = formatDate(new Date(), "dd-MM-yyyy")`}
            lang="typescript"
          />
        </section>
      </div>
    </>
  );
}
