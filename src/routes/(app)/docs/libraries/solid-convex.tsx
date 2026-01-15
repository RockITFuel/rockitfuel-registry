import { Title } from "@solidjs/meta";
import { CodeBlock } from "~/components/code-block";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

export default function SolidConvexPage() {
  return (
    <>
      <Title>Solid Convex - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Solid Convex</PageHeaderHeading>
        <PageHeaderDescription>
          Reactive Convex integration for SolidJS with caching, optimistic
          updates, and SSR support.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <h2 class="mb-4 font-semibold text-xl">Installation</h2>
          <InstallCommand component="solid-convex" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Dependencies</h2>
          <div class="flex flex-wrap gap-2">
            <code class="rounded bg-muted px-2 py-1 text-sm">convex</code>
            <code class="rounded bg-muted px-2 py-1 text-sm">
              @solid-primitives/map
            </code>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Features</h2>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Reactive queries with SolidJS signals</li>
            <li>Automatic caching and deduplication</li>
            <li>Optimistic updates for mutations</li>
            <li>SSR support with preloading</li>
            <li>TypeScript-first with full type inference</li>
          </ul>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Included Files</h2>
          <div class="grid gap-2 sm:grid-cols-2">
            <div class="rounded-md border px-3 py-2 text-sm">
              <code>index.tsx</code>
              <p class="mt-1 text-muted-foreground text-xs">
                Main exports and hooks
              </p>
            </div>
            <div class="rounded-md border px-3 py-2 text-sm">
              <code>convex-client.ts</code>
              <p class="mt-1 text-muted-foreground text-xs">
                Convex client setup
              </p>
            </div>
            <div class="rounded-md border px-3 py-2 text-sm">
              <code>server.ts</code>
              <p class="mt-1 text-muted-foreground text-xs">
                Server-side utilities
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Usage</h2>
          <CodeBlock
            code={`import { ConvexProvider, useQuery, useMutation } from "~/lib/solid-convex"
import { api } from "../convex/_generated/api"

// Wrap your app with ConvexProvider
function App() {
  return (
    <ConvexProvider client={convex}>
      <MyComponent />
    </ConvexProvider>
  )
}

// Use queries and mutations
function MyComponent() {
  const tasks = useQuery(api.tasks.list)
  const createTask = useMutation(api.tasks.create)

  return (
    <div>
      <For each={tasks()}>
        {(task) => <div>{task.title}</div>}
      </For>
      <button onClick={() => createTask({ title: "New Task" })}>
        Add Task
      </button>
    </div>
  )
}`}
            lang="tsx"
          />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Note</h2>
          <p class="text-muted-foreground">
            This library requires a Convex backend to be set up. See the{" "}
            <a
              class="font-medium underline underline-offset-4"
              href="https://docs.convex.dev/quickstart/solidjs"
              rel="noreferrer"
              target="_blank"
            >
              Convex documentation
            </a>{" "}
            for setup instructions.
          </p>
        </section>
      </div>
    </>
  );
}
