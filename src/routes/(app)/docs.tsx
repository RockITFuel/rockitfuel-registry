import type { RouteProps } from "@solidjs/router";

import { DocsPager } from "~/components/docs-pager";
import Sidebar from "~/components/sidebar";
import { TableOfContents } from "~/components/table-of-contents";

export default function DocsLayout(props: RouteProps<string>) {
  return (
    <div class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[240px_minmax(0,1fr)_200px]">
      <Sidebar />
      <main class="relative py-6 lg:gap-10 lg:py-8">
        <div class="mx-auto w-full min-w-0">
          <article>{props.children}</article>
          <DocsPager />
        </div>
      </main>
      <TableOfContents />
    </div>
  );
}
