import { Title } from "@solidjs/meta";
import { CodeBlock } from "~/components/code-block";
import { H2 } from "~/components/doc-heading";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

const usageExample = `import { useLoading } from "~/hooks/use-loading"

function MyComponent() {
  const { isLoading, startLoading, stopLoading } = useLoading({
    delay: 200 // Only show loading after 200ms
  })

  const fetchData = async () => {
    startLoading()
    try {
      await api.fetchData()
    } finally {
      stopLoading()
    }
  }

  return (
    <div>
      {isLoading() && <Spinner />}
      <button onClick={fetchData}>Load Data</button>
    </div>
  )
}`;

export default function UseLoadingPage() {
  return (
    <>
      <Title>useLoading - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>useLoading</PageHeaderHeading>
        <PageHeaderDescription>
          Loading state hook with delayed activation to prevent UI flicker on
          fast operations.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <H2 class="mb-4 font-semibold text-xl">Installation</H2>
          <InstallCommand component="use-loading" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Usage</H2>
          <CodeBlock code={usageExample} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Features</H2>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Configurable delay before showing loading state</li>
            <li>Prevents UI flicker for fast operations</li>
            <li>Simple start/stop API</li>
            <li>Automatic cleanup on unmount</li>
          </ul>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Why Use Delayed Loading?</H2>
          <p class="text-muted-foreground">
            When operations complete quickly (under ~200ms), showing a loading
            spinner can actually make the UI feel slower due to the visual
            "flash". This hook only shows the loading state if the operation
            takes longer than the configured delay, resulting in a smoother user
            experience.
          </p>
        </section>
      </div>
    </>
  );
}
