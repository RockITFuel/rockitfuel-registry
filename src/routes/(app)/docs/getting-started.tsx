import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { CodeBlock } from "~/components/code-block";
import { H2 } from "~/components/doc-heading";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { REGISTRY_URL } from "~/config/docs";

export default function GettingStarted() {
  const initCommand = "bunx shadcn@latest init";
  const addCommand = `bunx shadcn@latest add ${REGISTRY_URL}/r/button.json`;

  return (
    <>
      <Title>Getting Started - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Getting Started</PageHeaderHeading>
        <PageHeaderDescription>
          A custom component registry for SolidJS powered by shadcn/ui. Install
          beautiful, accessible components directly into your project.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <H2 class="mb-4 font-semibold text-2xl">What is this?</H2>
          <p class="text-muted-foreground">
            ArchiTechs Registry is a collection of reusable SolidJS components
            built on top of{" "}
            <A
              class="font-medium underline underline-offset-4"
              href="https://solid-ui.com"
              rel="noreferrer"
              target="_blank"
            >
              solid-ui
            </A>{" "}
            and{" "}
            <A
              class="font-medium underline underline-offset-4"
              href="https://ui.shadcn.com"
              rel="noreferrer"
              target="_blank"
            >
              shadcn/ui
            </A>
            . Components can be installed directly into your project using the
            shadcn CLI.
          </p>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-2xl">Prerequisites</H2>
          <p class="mb-4 text-muted-foreground">
            Before installing components, make sure your project is set up with
            shadcn:
          </p>
          <CodeBlock code={initCommand} lang="bash" />
          <p class="mt-4 text-muted-foreground text-sm">
            Follow the prompts to configure your project. Make sure to select
            SolidJS as your framework.
          </p>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-2xl">Installing Components</H2>
          <p class="mb-4 text-muted-foreground">
            Install components from this registry using the shadcn CLI with our
            registry URL:
          </p>
          <CodeBlock code={addCommand} lang="bash" />
          <p class="mt-4 text-muted-foreground text-sm">
            Replace{" "}
            <code class="rounded bg-muted-foreground/20 px-1.5 py-0.5">
              button
            </code>{" "}
            with any component name from the sidebar.
          </p>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-2xl">Available Items</H2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div class="rounded-lg border p-4">
              <h3 class="font-semibold">UI Components</h3>
              <p class="text-muted-foreground text-sm">
                29 components including Button, Card, Dialog, Select, and more.
              </p>
            </div>
            <div class="rounded-lg border p-4">
              <h3 class="font-semibold">Blocks</h3>
              <p class="text-muted-foreground text-sm">
                App Sidebar, Super Form, and Helper components for building full
                features.
              </p>
            </div>
            <div class="rounded-lg border p-4">
              <h3 class="font-semibold">Libraries</h3>
              <p class="text-muted-foreground text-sm">
                Gatehouse (authorization), Solid Convex, and Date Utils.
              </p>
            </div>
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-2xl">Credits</H2>
          <p class="text-muted-foreground">
            Built by{" "}
            <A
              class="font-medium underline underline-offset-4"
              href="https://github.com/WeAreArchiTechs"
              rel="noreferrer"
              target="_blank"
            >
              ArchiTechs
            </A>
            . Components are based on{" "}
            <A
              class="font-medium underline underline-offset-4"
              href="https://solid-ui.com"
              rel="noreferrer"
              target="_blank"
            >
              solid-ui
            </A>{" "}
            by Stefan E-K. Gatehouse-TS by{" "}
            <A
              class="font-medium underline underline-offset-4"
              href="https://github.com/9Morello/gatehouse-ts"
              rel="noreferrer"
              target="_blank"
            >
              9Morello
            </A>
            .
          </p>
        </section>
      </div>
    </>
  );
}
