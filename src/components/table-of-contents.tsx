import { For, Show } from "solid-js";
import { useScrollspy } from "~/hooks/use-scrollspy";
import { cn } from "~/lib/utils";

type TableOfContentsProps = {
  containerSelector?: string;
};

export function TableOfContents(props: TableOfContentsProps) {
  const { activeId, headings } = useScrollspy(
    props.containerSelector ?? "article"
  );

  const handleClick = (
    e: MouseEvent & { currentTarget: HTMLAnchorElement },
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Update URL hash without jumping
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <Show when={headings().length > 0}>
      <aside class="hidden xl:block">
        <div class="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto pt-6">
          <nav aria-label="Table of contents">
            <p class="mb-4 font-medium text-sm">On this page</p>
            <ul class="space-y-2 text-sm">
              <For each={headings()}>
                {(heading) => (
                  <li>
                    <a
                      class={cn(
                        "block text-muted-foreground transition-colors hover:text-foreground",
                        heading.level === 3 && "pl-4",
                        activeId() === heading.id &&
                          "font-medium text-foreground"
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
        </div>
      </aside>
    </Show>
  );
}
