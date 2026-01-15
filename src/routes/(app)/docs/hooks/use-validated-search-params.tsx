import { Title } from "@solidjs/meta";
import { CodeBlock } from "~/components/code-block";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

const usageExample = `import { useValidatedSearchParams } from "~/hooks/use-validated-search-params"
import { z } from "zod"

const schema = z.object({
  page: z.number().default(1),
  search: z.string().optional(),
  tags: z.array(z.string()).default([]),
  sortBy: z.enum(["name", "date", "popularity"]).default("date")
})

function ProductList() {
  const [params, setParams] = useValidatedSearchParams({
    schema,
    defaultValue: { page: 1, tags: [], sortBy: "date" }
  })

  return (
    <div>
      <input
        placeholder="Search..."
        value={params().search ?? ""}
        onInput={(e) => setParams({ search: e.currentTarget.value })}
      />

      <select
        value={params().sortBy}
        onChange={(e) => setParams({ sortBy: e.currentTarget.value })}
      >
        <option value="name">Name</option>
        <option value="date">Date</option>
        <option value="popularity">Popularity</option>
      </select>

      <button onClick={() => setParams((prev) => ({ page: prev.page + 1 }))}>
        Next Page (Current: {params().page})
      </button>
    </div>
  )
}`;

export default function UseValidatedSearchParamsPage() {
  return (
    <>
      <Title>useValidatedSearchParams - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>useValidatedSearchParams</PageHeaderHeading>
        <PageHeaderDescription>
          Type-safe URL search params with Zod validation. Synchronizes URL
          state with your component while ensuring data integrity.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <h2 class="mb-4 font-semibold text-xl">Installation</h2>
          <InstallCommand component="use-validated-search-params" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Usage</h2>
          <CodeBlock code={usageExample} lang="tsx" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Features</h2>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Full Zod schema validation for search params</li>
            <li>
              Automatic type conversion (strings to numbers, booleans, arrays)
            </li>
            <li>Reactive URL synchronization</li>
            <li>Functional setter with access to previous state</li>
            <li>Invalid updates are rejected with console warnings</li>
            <li>Falls back to defaults when validation fails</li>
          </ul>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Supported Types</h2>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground">
            <li>
              <code class="rounded bg-muted px-1">z.string()</code> - Strings
            </li>
            <li>
              <code class="rounded bg-muted px-1">z.number()</code> - Numbers
              (auto-parsed from URL)
            </li>
            <li>
              <code class="rounded bg-muted px-1">z.boolean()</code> - Booleans
              ("true"/"1" = true)
            </li>
            <li>
              <code class="rounded bg-muted px-1">z.array()</code> - Arrays
              (comma-separated or multiple params)
            </li>
            <li>
              <code class="rounded bg-muted px-1">z.enum()</code> - Enums
            </li>
            <li>
              <code class="rounded bg-muted px-1">.optional()</code>,{" "}
              <code class="rounded bg-muted px-1">.nullable()</code>,{" "}
              <code class="rounded bg-muted px-1">.default()</code> - Modifiers
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
