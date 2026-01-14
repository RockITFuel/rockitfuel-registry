import type { Accessor } from "solid-js";
import { createSignal, onCleanup, onMount } from "solid-js";
import { calculateDimensions } from "./scales";
import type { ChartDimensions, ChartMargin } from "./types";

type UseResizeObserverOptions = {
  debounceMs?: number;
};

type ContainerSize = {
  width: number;
  height: number;
};

/**
 * Hook to observe container size changes with optional debounce
 */
export function useResizeObserver(
  containerRef: () => HTMLElement | null | undefined,
  options?: UseResizeObserverOptions
): Accessor<ContainerSize> {
  const [size, setSize] = createSignal<ContainerSize>({ width: 0, height: 0 });
  let resizeObserver: ResizeObserver | null = null;
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  const updateSize = (entries: ResizeObserverEntry[]) => {
    const entry = entries[0];
    if (!entry) {
      return;
    }

    const { width, height } = entry.contentRect;

    if (options?.debounceMs) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(() => {
        setSize({ width, height });
      }, options.debounceMs);
    } else {
      setSize({ width, height });
    }
  };

  onMount(() => {
    const container = containerRef();
    if (!container) {
      return;
    }

    // Initial size
    const rect = container.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    // Create observer
    resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
  });

  onCleanup(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  });

  return size;
}

/**
 * Hook that provides reactive chart dimensions based on container size
 */
export function useChartDimensions(
  containerRef: () => HTMLElement | null | undefined,
  margin?: Partial<ChartMargin>,
  options?: UseResizeObserverOptions
): Accessor<ChartDimensions> {
  const size = useResizeObserver(containerRef, options);

  return () => calculateDimensions(size().width, size().height, margin);
}

/**
 * Get device pixel ratio for crisp rendering on high-DPI displays
 */
export function getDevicePixelRatio(): number {
  return typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
}

/**
 * Scale canvas for high-DPI displays
 */
export function scaleCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const dpr = getDevicePixelRatio();

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.scale(dpr, dpr);
}

/**
 * Set SVG viewBox for responsive sizing
 */
export function setSvgViewBox(
  svg: SVGSVGElement,
  width: number,
  height: number
): void {
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
}

/**
 * Get the bounding rect of an SVG element relative to its container
 */
export function getElementBounds(element: Element): DOMRect {
  return element.getBoundingClientRect();
}

/**
 * Check if an element is visible in the viewport
 */
export function isElementVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
