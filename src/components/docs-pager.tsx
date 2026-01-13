import { A, useLocation } from "@solidjs/router";
import { createMemo, Show } from "solid-js";
import { IconChevronLeft, IconChevronRight } from "~/components/icons";
import { docsConfig } from "~/config/docs";

type NavItem = {
  title: string;
  href: string;
};

function getFlattenedNav(): NavItem[] {
  return docsConfig.sidebarNav.flatMap((category) =>
    category.items.map((item) => ({
      title: item.title,
      href: item.href,
    }))
  );
}

function getPagerLinks(pathname: string): {
  prev: NavItem | null;
  next: NavItem | null;
} {
  const flatNav = getFlattenedNav();
  const currentIndex = flatNav.findIndex((item) => item.href === pathname);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? flatNav[currentIndex - 1] : null,
    next: currentIndex < flatNav.length - 1 ? flatNav[currentIndex + 1] : null,
  };
}

export function DocsPager() {
  const location = useLocation();
  const pagerLinks = createMemo(() => getPagerLinks(location.pathname));

  return (
    <nav
      aria-label="Page navigation"
      class="mt-12 flex flex-row items-center justify-between"
    >
      <Show when={pagerLinks().prev}>
        {(prev) => (
          <A
            class="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            href={prev().href}
          >
            <IconChevronLeft class="size-4" />
            <span>{prev().title}</span>
          </A>
        )}
      </Show>
      <div class="flex-1" />
      <Show when={pagerLinks().next}>
        {(next) => (
          <A
            class="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            href={next().href}
          >
            <span>{next().title}</span>
            <IconChevronRight class="size-4" />
          </A>
        )}
      </Show>
    </nav>
  );
}
