import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { createMemo, For, Show } from "solid-js";
import { IconChevronRight } from "~/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { Badge } from "~/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";

type BlockCategory =
  | "featured"
  | "sidebar"
  | "auth"
  | "dashboard"
  | "marketing";

interface Block {
  title: string;
  href: string;
  description: string;
  categories: BlockCategory[];
  status?: "new";
}

const blocks: Block[] = [
  {
    title: "App Sidebar",
    href: "/docs/blocks/app-sidebar",
    description:
      "Responsive sidebar navigation with mobile support, keyboard shortcuts, and theme toggle.",
    categories: ["featured", "sidebar", "dashboard"],
    status: "new",
  },
  {
    title: "Modular Form",
    href: "/docs/blocks/modular-form",
    description:
      "Form components integrated with @modular-forms/solid - includes input, select, combobox, date picker, and more.",
    categories: ["featured", "dashboard", "auth"],
    status: "new",
  },
  {
    title: "Helpers",
    href: "/docs/blocks/helpers",
    description:
      "Utility components for actions, empty states, loading states, and more.",
    categories: ["featured", "dashboard"],
  },
];

const categories: { value: BlockCategory; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "sidebar", label: "Sidebar" },
  { value: "auth", label: "Auth" },
  { value: "dashboard", label: "Dashboard" },
  { value: "marketing", label: "Marketing" },
];

function BlockCard(props: { block: Block }) {
  return (
    <A
      class="group flex flex-col justify-between rounded-lg border bg-card p-6 transition-colors hover:bg-muted"
      href={props.block.href}
    >
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-semibold">{props.block.title}</span>
            <Show when={props.block.status === "new"}>
              <Badge variant="secondary">new</Badge>
            </Show>
          </div>
          <IconChevronRight class="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
        <p class="text-muted-foreground text-sm">{props.block.description}</p>
      </div>
    </A>
  );
}

function BlockGrid(props: { blocks: Block[] }) {
  return (
    <Show
      when={props.blocks.length > 0}
      fallback={
        <div class="py-12 text-center text-muted-foreground">
          No blocks available in this category yet.
        </div>
      }
    >
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <For each={props.blocks}>
          {(block) => <BlockCard block={block} />}
        </For>
      </div>
    </Show>
  );
}

export default function BlocksIndex() {
  const getBlocksByCategory = (category: BlockCategory) =>
    createMemo(() => blocks.filter((block) => block.categories.includes(category)));

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

      <Tabs defaultValue="featured" class="w-full">
        <TabsList class="mb-6 flex flex-wrap">
          <For each={categories}>
            {(category) => (
              <TabsTrigger value={category.value}>{category.label}</TabsTrigger>
            )}
          </For>
        </TabsList>

        <For each={categories}>
          {(category) => (
            <TabsContent value={category.value}>
              <BlockGrid blocks={getBlocksByCategory(category.value)()} />
            </TabsContent>
          )}
        </For>
      </Tabs>
    </>
  );
}
