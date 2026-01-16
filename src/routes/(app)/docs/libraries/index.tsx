import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For } from "solid-js";
import { H2 } from "~/components/doc-heading";
import { IconChevronRight } from "~/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { Badge } from "~/components/ui/badge";

const libraries = [
  {
    title: "Gatehouse",
    href: "/docs/libraries/gatehouse",
    description:
      "A flexible, zero-dependencies authorization TypeScript library supporting RBAC, ABAC, and ReBAC.",
    status: "new" as const,
  },
  {
    title: "Solid Convex",
    href: "/docs/libraries/solid-convex",
    description:
      "Reactive Convex integration for SolidJS with caching, optimistic updates, and SSR support.",
  },
  {
    title: "Date Utils",
    href: "/docs/libraries/date-utils",
    description:
      "Date conversion and parsing utilities for Dutch date format support.",
  },
];

const hooks = [
  {
    title: "useBindSignal",
    href: "/docs/hooks/use-bind-signal",
    description: "Two-way binding hook for controlled components in SolidJS.",
  },
  {
    title: "useLoading",
    href: "/docs/hooks/use-loading",
    description:
      "Loading state hook with delayed activation to prevent flicker.",
  },
];

export default function LibrariesIndex() {
  return (
    <>
      <Title>Libraries - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Libraries & Hooks</PageHeaderHeading>
        <PageHeaderDescription>
          Standalone libraries and custom hooks that can be installed into your
          SolidJS project.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <H2 class="mb-4 font-semibold text-xl">Libraries</H2>
          <div class="grid gap-4">
            <For each={libraries}>
              {(lib) => (
                <A
                  class="group flex items-center justify-between rounded-lg border p-6 transition-colors hover:bg-muted"
                  href={lib.href}
                >
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold">{lib.title}</span>
                      {lib.status === "new" && (
                        <Badge variant="secondary">new</Badge>
                      )}
                    </div>
                    <p class="text-muted-foreground text-sm">
                      {lib.description}
                    </p>
                  </div>
                  <IconChevronRight class="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </A>
              )}
            </For>
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Hooks</H2>
          <div class="grid gap-4 sm:grid-cols-2">
            <For each={hooks}>
              {(hook) => (
                <A
                  class="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted"
                  href={hook.href}
                >
                  <div class="space-y-1">
                    <span class="font-medium">{hook.title}</span>
                    <p class="text-muted-foreground text-sm">
                      {hook.description}
                    </p>
                  </div>
                  <IconChevronRight class="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </A>
              )}
            </For>
          </div>
        </section>
      </div>
    </>
  );
}
