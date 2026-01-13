import { createSignal, onCleanup, onMount } from "solid-js";

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

function extractHeadings(container: Element): TocItem[] {
  const elements = container.querySelectorAll("h2, h3");
  const items: TocItem[] = [];

  for (const el of elements) {
    const text = el.textContent?.trim() ?? "";
    if (!text) {
      continue;
    }

    // Generate id if not present
    let id = el.id;
    if (!id) {
      id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      el.id = id;
    }

    items.push({
      id,
      text,
      level: el.tagName === "H2" ? 2 : 3,
    });
  }

  return items;
}

function setupScrollspy(
  items: TocItem[],
  setActiveId: (id: string) => void
): IntersectionObserver {
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        const topEntry = visibleEntries.reduce((prev, current) =>
          prev.boundingClientRect.top < current.boundingClientRect.top
            ? prev
            : current
        );
        setActiveId(topEntry.target.id);
      }
    },
    {
      rootMargin: "-80px 0px -70% 0px",
      threshold: 0,
    }
  );

  for (const item of items) {
    const el = document.getElementById(item.id);
    if (el) {
      observer.observe(el);
    }
  }

  return observer;
}

export function useScrollspy(containerSelector: string) {
  const [activeId, setActiveId] = createSignal<string>("");
  const [headings, setHeadings] = createSignal<TocItem[]>([]);

  onMount(() => {
    const container = document.querySelector(containerSelector);
    if (!container) {
      return;
    }

    const items = extractHeadings(container);
    setHeadings(items);

    if (items.length === 0) {
      return;
    }

    const observer = setupScrollspy(items, setActiveId);
    onCleanup(() => observer.disconnect());
  });

  return { activeId, headings };
}
