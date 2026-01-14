import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";

type TooltipPosition = {
  x: number;
  y: number;
};

type TooltipState<T> = {
  visible: boolean;
  position: TooltipPosition;
  data: T | null;
};

type UseChartTooltipReturn<T> = {
  state: Accessor<TooltipState<T>>;
  show: (data: T, position: TooltipPosition) => void;
  hide: () => void;
  updatePosition: (position: TooltipPosition) => void;
  isVisible: Accessor<boolean>;
};

/**
 * Create a reactive tooltip state for chart interactions
 */
export function useChartTooltip<T>(): UseChartTooltipReturn<T> {
  const [state, setState] = createSignal<TooltipState<T>>({
    visible: false,
    position: { x: 0, y: 0 },
    data: null,
  });

  const show = (data: T, position: TooltipPosition) => {
    setState({
      visible: true,
      position,
      data,
    });
  };

  const hide = () => {
    setState((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const updatePosition = (position: TooltipPosition) => {
    setState((prev) => ({
      ...prev,
      position,
    }));
  };

  const isVisible = () => state().visible;

  return {
    state,
    show,
    hide,
    updatePosition,
    isVisible,
  };
}

type TooltipPositionOptions = {
  mouseX: number;
  mouseY: number;
  tooltipWidth: number;
  tooltipHeight: number;
  containerBounds: DOMRect;
  offsetX?: number;
  offsetY?: number;
};

/**
 * Calculate optimal tooltip position to keep it within bounds
 */
export function calculateTooltipPosition(
  options: TooltipPositionOptions
): TooltipPosition {
  const {
    mouseX,
    mouseY,
    tooltipWidth,
    tooltipHeight,
    containerBounds,
    offsetX = 10,
    offsetY = 10,
  } = options;

  let x = mouseX + offsetX;
  let y = mouseY + offsetY;

  // Adjust horizontal position if tooltip would overflow right
  if (x + tooltipWidth > containerBounds.width) {
    x = mouseX - tooltipWidth - offsetX;
  }

  // Adjust horizontal position if tooltip would overflow left
  if (x < 0) {
    x = offsetX;
  }

  // Adjust vertical position if tooltip would overflow bottom
  if (y + tooltipHeight > containerBounds.height) {
    y = mouseY - tooltipHeight - offsetY;
  }

  // Adjust vertical position if tooltip would overflow top
  if (y < 0) {
    y = offsetY;
  }

  return { x, y };
}

/**
 * Get the mouse position relative to an SVG element
 */
export function getRelativeMousePosition(
  event: MouseEvent,
  svgElement: SVGSVGElement
): TooltipPosition {
  const rect = svgElement.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

/**
 * Find the closest data point to the mouse position
 */
export function findClosestPoint<T extends { x: number; y: number }>(
  points: T[],
  mouseX: number,
  mouseY: number,
  threshold = 50
): T | null {
  let closest: T | null = null;
  let minDistance = threshold;

  for (const point of points) {
    const distance = Math.sqrt(
      (point.x - mouseX) ** 2 + (point.y - mouseY) ** 2
    );
    if (distance < minDistance) {
      minDistance = distance;
      closest = point;
    }
  }

  return closest;
}

/**
 * Find the closest data point on the x-axis (for line/area charts)
 */
export function findClosestPointByX<T extends { x: number }>(
  points: T[],
  mouseX: number
): T | null {
  if (points.length === 0) {
    return null;
  }

  let closest = points[0];
  let minDistance = Math.abs(points[0].x - mouseX);

  for (const point of points) {
    const distance = Math.abs(point.x - mouseX);
    if (distance < minDistance) {
      minDistance = distance;
      closest = point;
    }
  }

  return closest;
}

/**
 * Bisect to find the index of the closest point (for sorted data)
 */
export function bisectIndex<T>(
  data: T[],
  x: number,
  accessor: (d: T) => number
): number {
  let lo = 0;
  let hi = data.length;

  while (lo < hi) {
    // biome-ignore lint/suspicious/noBitwiseOperators: efficient integer division
    const mid = (lo + hi) >>> 1;
    if (accessor(data[mid]) < x) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  // Return the closer of the two adjacent points
  if (lo > 0 && lo < data.length) {
    const d0 = x - accessor(data[lo - 1]);
    const d1 = accessor(data[lo]) - x;
    return d1 < d0 ? lo : lo - 1;
  }

  return Math.max(0, Math.min(data.length - 1, lo));
}
