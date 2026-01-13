import { Title } from "@solidjs/meta";
import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { InstallCommand } from "~/components/install-command";
import {
  CopyPageUrlButton,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

type ComponentPageProps = {
  name: string;
  title: string;
  description: string;
  registryName: string;
  dependencies?: string[];
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
            <div class="flex flex-wrap gap-2">
              {props.dependencies?.map((dep) => (
                <code class="rounded bg-muted px-2 py-1 text-sm">{dep}</code>
              ))}
            </div>
          </section>
        </Show>

        <Show when={props.children}>
          <section>
            <h2 class="mb-4 font-semibold text-xl">Preview</h2>
            <div class="flex min-h-[200px] items-center justify-center rounded-md border bg-muted/50 p-4">
              {props.children}
            </div>
          </section>
        </Show>
      </div>
    </>
  );
}
