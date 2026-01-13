import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For } from "solid-js";
import { IconChevronRight } from "~/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { docsConfig } from "~/config/docs";

export default function ComponentsIndex() {
  const components = () =>
    docsConfig.sidebarNav.find((cat) => cat.title === "UI Components")?.items ||
    [];

  return (
    <>
      <Title>Components - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>UI Components</PageHeaderHeading>
        <PageHeaderDescription>
          A collection of {components().length} beautifully designed, accessible
          UI components for SolidJS. Install any component directly into your
          project using the shadcn CLI.
        </PageHeaderDescription>
      </PageHeader>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <For each={components()}>
          {(component) => (
            <A
              class="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted"
              href={component.href}
            >
              <span class="font-medium">{component.title}</span>
              <IconChevronRight class="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </A>
          )}
        </For>
      </div>
    </>
  );
}
