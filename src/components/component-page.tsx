import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import type { JSX } from "solid-js";
import { For, Show } from "solid-js";
import { CodeBlock } from "~/components/code-block";
import { DependencyChips } from "~/components/dependency-chips";
import { InstallCommand } from "~/components/install-command";
import {
  CopyPageUrlButton,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

type Example = {
  title: string;
  description?: string;
  component: JSX.Element;
};

type RelatedItem = {
  title: string;
  href: string;
  description?: string;
};

type ComponentPageProps = {
  name: string;
  title: string;
  description: string;
  registryName: string;
  dependencies?: string[];
  usage?: string;
  usageLang?: string;
  examples?: Example[];
  related?: RelatedItem[];
  children?: JSX.Element;
};

export function ComponentPage(props: ComponentPageProps) {
  return (
    <>
      <Title>{props.title} - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>{props.title}</PageHeaderHeading>
        <PageHeaderDescription>{props.description}</PageHeaderDescription>
        <PageHeaderActions>
          <CopyPageUrlButton />
        </PageHeaderActions>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <h2 class="mb-4 font-semibold text-xl">Installation</h2>
          <InstallCommand component={props.registryName} />
        </section>

        <Show when={props.dependencies && props.dependencies.length > 0}>
          <section>
            <h2 class="mb-4 font-semibold text-xl">Dependencies</h2>
            <DependencyChips dependencies={props.dependencies} />
          </section>
        </Show>

        <Show keyed when={props.usage}>
          {(usage) => (
            <section>
              <h2 class="mb-4 font-semibold text-xl">Usage</h2>
              <CodeBlock code={usage} lang={props.usageLang ?? "tsx"} />
            </section>
          )}
        </Show>

        <Show when={props.children}>
          <section>
            <h2 class="mb-4 font-semibold text-xl">Preview</h2>
            <div class="flex min-h-[200px] items-center justify-center rounded-md border bg-muted/50 p-4">
              {props.children}
            </div>
          </section>
        </Show>

        <Show when={props.examples && props.examples.length > 0}>
          <section>
            <h2 class="mb-4 font-semibold text-xl">Examples</h2>
            <div class="space-y-6">
              <For each={props.examples}>
                {(example) => (
                  <div class="space-y-3">
                    <div>
                      <h3 class="font-medium">{example.title}</h3>
                      <Show when={example.description}>
                        <p class="text-muted-foreground text-sm">
                          {example.description}
                        </p>
                      </Show>
                    </div>
                    <div class="flex min-h-[100px] items-center justify-center rounded-md border bg-muted/50 p-4">
                      {example.component}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </section>
        </Show>

        <Show when={props.related && props.related.length > 0}>
          <section>
            <h2 class="mb-4 font-semibold text-xl">Related</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <For each={props.related}>
                {(item) => (
                  <A
                    class="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    href={item.href}
                  >
                    <h3 class="font-medium group-hover:underline">
                      {item.title}
                    </h3>
                    <Show when={item.description}>
                      <p class="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </Show>
                  </A>
                )}
              </For>
            </div>
          </section>
        </Show>
      </div>
    </>
  );
}
