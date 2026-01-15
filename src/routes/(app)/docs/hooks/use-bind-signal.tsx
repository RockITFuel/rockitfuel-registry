import { Title } from "@solidjs/meta";
import { CodeBlock } from "~/components/code-block";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

const usageExample = `import { useBindSignal } from "~/hooks/use-bind-signal"

function ControlledInput(props: {
  value?: string
  onChange?: (value: string) => void
}) {
  const [value, setValue] = useBindSignal(
    () => props.value ?? "",
    props.onChange
  )

  return (
    <input
      value={value()}
      onInput={(e) => setValue(e.currentTarget.value)}
    />
  )
}

// Usage
function Parent() {
  const [text, setText] = createSignal("Hello")
  
  return (
    <ControlledInput
      value={text()}
      onChange={setText}
    />
  )
}`;

export default function UseBindSignalPage() {
  return (
    <>
      <Title>useBindSignal - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>useBindSignal</PageHeaderHeading>
        <PageHeaderDescription>
          Two-way binding hook for controlled components in SolidJS. Simplifies
          managing component state that needs to be synchronized with a parent.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <h2 class="mb-4 font-semibold text-xl">Installation</h2>
          <InstallCommand component="use-bind-signal" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Usage</h2>
          <CodeBlock code={usageExample} lang="tsx" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Features</h2>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Simplifies controlled component patterns</li>
            <li>Automatic synchronization with parent state</li>
            <li>Works with any value type</li>
            <li>Memoized for performance</li>
          </ul>
        </section>
      </div>
    </>
  );
}
