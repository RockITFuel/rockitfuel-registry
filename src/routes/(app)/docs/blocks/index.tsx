import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For } from "solid-js";
import { IconChevronRight } from "~/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { Badge } from "~/components/ui/badge";

const blocks = [
  {
    title: "App Sidebar",
    href: "/docs/blocks/app-sidebar",
    description:
      "Responsive sidebar navigation with mobile support, keyboard shortcuts, and theme toggle.",
    status: "new" as const,
  },
  {
    title: "Super Form",
    href: "/docs/blocks/super-form",
    description:
      "Form components integrated with @modular-forms/solid - includes input, select, combobox, date picker, and more.",
    status: "new" as const,
  },
  {
    title: "Helpers",
    href: "/docs/blocks/helpers",
    description:
      "Utility components for actions, empty states, loading states, and more.",
  },
];

export default function BlocksIndex() {
  return (
    <>
      <Title>Blocks - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Blocks</PageHeaderHeading>
        <PageHeaderDescription>
          Pre-built component blocks that you can drop into your application.
          These are larger, composed components that provide complete features
          out of the box.
        </PageHeaderDescription>
      </PageHeader>

      <div class="grid gap-4">
        <For each={blocks}>
          {(block) => (
            <A
              class="group flex items-center justify-between rounded-lg border p-6 transition-colors hover:bg-muted"
              href={block.href}
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-semibold">{block.title}</span>
                  {block.status === "new" && (
                    <Badge variant="secondary">new</Badge>
                  )}
                </div>
                <p class="text-muted-foreground text-sm">{block.description}</p>
              </div>
              <IconChevronRight class="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </A>
          )}
        </For>
      </div>
    </>
  );
}
