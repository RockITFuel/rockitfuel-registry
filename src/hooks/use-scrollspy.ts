import { useLocation } from "@solidjs/router";
import { createEffect, createSignal, on, onCleanup } from "solid-js";

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

/**
 * Determines the active heading based on scroll position.
 * Returns the ID of the heading that is currently at or above the offset line.
 */
function getActiveHeadingFromScroll(
  items: TocItem[],
  offset = 100
): string | null {
  let closestId: string | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const item of items) {
    const el = document.getElementById(item.id);
    if (!el) {
      continue;
    }

    const rect = el.getBoundingClientRect();
    const distance = Math.abs(rect.top - offset);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestId = item.id;
    }
  }

  if (closestId) {
    return closestId;
  }

  // If no heading is above the offset, check if there's a hash that matches
  const hash = window.location.hash.slice(1);
  if (hash) {
    const matchingItem = items.find((item) => item.id === hash);
    if (matchingItem) {
      return matchingItem.id;
    }
  }

  // Fall back to the first heading
  return items.length > 0 ? items[0].id : null;
}

export function useScrollspy(containerSelector: string) {
  const location = useLocation();
  const [activeId, setActiveId] = createSignal<string>("");
  const [headings, setHeadings] = createSignal<TocItem[]>([]);

  let scrollHandler: (() => void) | null = null;

  const updateActiveHeading = () => {
    const items = headings();
    if (items.length === 0) {
      return;
    }

    const activeHeading = getActiveHeadingFromScroll(items);
    if (activeHeading) {
      setActiveId(activeHeading);
    }
  };

  // Setup scroll listener
  const setupScrollListener = () => {
    // Remove previous listener if exists
    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler);
    }

    // Create throttled scroll handler
    let ticking = false;
    scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveHeading();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });

    // Set initial active heading
    updateActiveHeading();
  };

  // Re-run when pathname changes
  createEffect(
    on(
      () => location.pathname,
      () => {
        // Small delay to ensure DOM is updated after navigation
        setTimeout(() => {
          const container = document.querySelector(containerSelector);
          if (!container) {
            setHeadings([]);
            return;
          }

          const items = extractHeadings(container);
          setHeadings(items);

          if (items.length === 0) {
            return;
          }

          setupScrollListener();
        }, 100);
      }
    )
  );

  // Also update when hash changes (e.g., clicking TOC links)
  createEffect(
    on(
      () => location.hash,
      () => {
        // Small delay to allow scroll to complete
        setTimeout(updateActiveHeading, 150);
      }
    )
  );

  onCleanup(() => {
    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler);
    }
  });

  return { activeId, headings };
}
