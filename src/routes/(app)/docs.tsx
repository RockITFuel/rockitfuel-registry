import type { RouteProps } from "@solidjs/router";

import { DocsPager } from "~/components/docs-pager";
import Sidebar from "~/components/sidebar";
import { DocsToc } from "~/components/table-of-contents";
import { cn } from "~/lib/utils";
import { isWidescreen } from "~/stores/widescreen";

export default function DocsLayout(props: RouteProps<string>) {
  return (
    <div
      class={cn(
        "flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-0 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_200px]",
        isWidescreen() ? "px-6 lg:px-10" : "mx-auto max-w-screen-2xl"
      )}
    >
      <Sidebar />
      <main
        class={cn(
          "relative py-6 md:px-6 lg:gap-10 lg:px-10 lg:py-8",
          isWidescreen() && "mx-auto max-w-4xl"
        )}
      >
        <div class="mx-auto w-full min-w-0">
          <article>{props.children}</article>
          <DocsPager />
        </div>
      </main>
      <DocsToc />
    </div>
  );
}
