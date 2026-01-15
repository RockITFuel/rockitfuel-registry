import { For, Show } from "solid-js";
import { useScrollspy } from "~/hooks/use-scrollspy";
import { cn } from "~/lib/utils";

type TableOfContentsProps = {
  /** CSS selector for the container to scan for headings (default: "article") */
  containerSelector?: string;
  /** Custom class for the outer aside element */
  class?: string;
  /** Title to display above the TOC (default: "On this page") */
  title?: string;
  /** Whether to hide when no headings are found (default: true) */
  hideWhenEmpty?: boolean;
};

/**
 * Scrolls an element into view with offset for navbar
 */
export function scrollToHeading(id: string) {
  const element = document.getElementById(id);
  if (element) {
    const navbarHeight = 56; // 3.5rem = 56px
    const offset = navbarHeight + 24; // navbar + some padding
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
    // Update URL hash without jumping
    window.history.pushState(null, "", `#${id}`);
  }
}

/**
 * Hook to get TOC data and scroll handler - useful for custom TOC implementations
 */
export function useTableOfContents(containerSelector = "article") {
  const { activeId, headings } = useScrollspy(containerSelector);

  const handleClick = (
    e: MouseEvent & { currentTarget: HTMLAnchorElement },
    id: string
  ) => {
    e.preventDefault();
    scrollToHeading(id);
  };

  return { activeId, headings, handleClick, scrollToHeading };
}

/**
 * Table of Contents component that displays a list of headings from the page.
 * Can be used in any layout - just provide appropriate classes for positioning.
 *
 * @example
 * // In a docs layout (sticky sidebar)
 * <TableOfContents class="hidden xl:sticky xl:top-14 xl:block" />
 *
 * @example
 * // In a simple page (inline)
 * <TableOfContents class="my-8 p-4 border rounded" title="Contents" />
 *
 * @example
 * // Custom container selector
 * <TableOfContents containerSelector="main" />
 */
export function TableOfContents(props: TableOfContentsProps) {
  const { activeId, headings, handleClick } = useTableOfContents(
    props.containerSelector
  );

  const title = () => props.title ?? "On this page";
  const hideWhenEmpty = () => props.hideWhenEmpty ?? true;

  return (
    <Show when={!hideWhenEmpty() || headings().length > 0}>
      <aside class={cn("", props.class)}>
        <nav aria-label="Table of contents">
          <p class="mb-4 font-medium text-sm">{title()}</p>
          <ul class="space-y-2 text-sm">
            <For each={headings()}>
              {(heading) => (
                <li>
                  <a
                    class={cn(
                      "block text-muted-foreground transition-colors hover:text-foreground",
                      heading.level === 3 && "pl-4",
                      activeId() === heading.id && "font-medium text-foreground"
                    )}
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                  >
                    {heading.text}
                  </a>
                </li>
              )}
            </For>
          </ul>
        </nav>
      </aside>
    </Show>
  );
}

/**
 * Pre-configured TableOfContents for docs layouts with sticky positioning.
 * Drop-in replacement for existing docs usage.
 */
export function DocsToc(props: Omit<TableOfContentsProps, "class">) {
  return (
    <TableOfContents
      {...props}
      class="hidden xl:sticky xl:top-14 xl:block xl:h-[calc(100vh-3.5rem)] xl:overflow-y-auto xl:pt-6"
    />
  );
}
