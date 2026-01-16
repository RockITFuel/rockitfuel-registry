import { bisector } from "d3-array";
import {
  type Component,
  createEffect,
  createMemo,
  For,
  type JSX,
  on,
  Show,
  splitProps,
} from "solid-js";
import { Portal } from "solid-js/web";
import { useChart } from "./chart-context";
import type { DataPoint } from "./types";

export type ChartTooltipProps = {
  /** Positioning behavior */
  mode?: "cursor" | "snap";
  /** Visual indicator style */
  indicator?: "dot" | "line" | "none";
  /** Show cursor line */
  cursor?: boolean;
  /** Show all series at X position */
  shared?: boolean;
  /** Custom content */
  children?: JSX.Element;
  /** CSS class */
  class?: string;
};

export type ChartTooltipContentProps = {
  /** Key for tooltip label */
  labelKey?: string;
  /** Format label */
  labelFormatter?: (value: unknown) => string;
  /** Format values */
  valueFormatter?: (value: number) => string;
  /** Hide the label row */
  hideLabel?: boolean;
  /** Hide color indicators */
  hideIndicator?: boolean;
  /** CSS class */
  class?: string;
};

/**
 * Default label formatter
 */
function defaultLabelFormatter(value: unknown): string {
  if (value instanceof Date) {
    return value.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return String(value);
}

/**
 * Default value formatter
 */
function defaultValueFormatter(value: number): string {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

/**
 * ChartTooltip - Shows tooltip on hover
 */
export const ChartTooltip: Component<ChartTooltipProps> = (props) => {
  const [local, _others] = splitProps(props, [
    "mode",
    "indicator",
    "cursor",
    "shared",
    "children",
    "class",
  ]);

  const chart = useChart();

  const mode = () => local.mode ?? "cursor";
  const showCursor = () => local.cursor !== false;
  const indicator = () => local.indicator ?? "dot";

  // Find closest data point to mouse position
  const closestPoint = createMemo(() => {
    const mousePos = chart.mousePosition();
    if (!mousePos) return null;

    const data = chart.data();
    if (data.length === 0) return null;

    const xScale = chart.xScale();
    const xType = chart.xType();
    const xKey = chart.xKey();
    const margin = chart.dimensions().margin;

    // Adjust mouse position for margin
    const x = mousePos.x - margin.left;

    if (x < 0 || x > chart.dimensions().innerWidth) return null;

    if (xType === "band") {
      // For band scale, find which band the mouse is in
      const bandScale = xScale as d3.ScaleBand<string>;
      const step = bandScale.step();
      const index = Math.floor(x / step);
      return data[Math.min(index, data.length - 1)] ?? null;
    }

    // For time/linear scales, use bisector
    const continuousScale = xScale as d3.ScaleTime<number, number>;
    const xValue = continuousScale.invert(x);

    const bisect = bisector((d: DataPoint) => d[xKey] as Date | number).left;
    const index = bisect(data, xValue);

    // Get closest of two neighboring points
    const d0 = data[index - 1];
    const d1 = data[index];

    if (!d0) return d1 ?? null;
    if (!d1) return d0;

    const v0 = d0[xKey] as Date | number;
    const v1 = d1[xKey] as Date | number;
    const target = xValue instanceof Date ? xValue.getTime() : xValue;
    const t0 = v0 instanceof Date ? v0.getTime() : v0;
    const t1 = v1 instanceof Date ? v1.getTime() : v1;

    return target - t0 > t1 - target ? d1 : d0;
  });

  // Update hovered point in context
  createEffect(
    on(closestPoint, (point) => {
      if (point) {
        const index = chart.data().indexOf(point);
        chart.setHoveredPoint(point, index);
      } else {
        chart.setHoveredPoint(null, null);
      }
    })
  );

  // Tooltip position
  const tooltipPosition = createMemo(() => {
    const mousePos = chart.mousePosition();
    const point = closestPoint();
    if (!(mousePos && point)) return null;

    if (mode() === "snap") {
      // Snap to data point
      const xScale = chart.xScale();
      const yScale = chart.yScale();
      const xKey = chart.xKey();
      const dataKeys = chart.dataKeys();
      const margin = chart.dimensions().margin;

      const xVal = point[xKey];
      let x: number;

      const xType = chart.xType();
      if (xType === "band") {
        const bandScale = xScale as d3.ScaleBand<string>;
        x = (bandScale(String(xVal)) ?? 0) + bandScale.bandwidth() / 2;
      } else {
        x = (xScale as d3.ScaleTime<number, number>)(xVal as Date);
      }

      // Use average y position of all series
      let avgY = 0;
      let count = 0;
      for (const key of dataKeys) {
        const val = point[key];
        if (typeof val === "number") {
          avgY += yScale(val);
          count++;
        }
      }
      const y = count > 0 ? avgY / count : chart.dimensions().innerHeight / 2;

      return { x: x + margin.left, y: y + margin.top };
    }

    // Follow cursor
    return { x: mousePos.x, y: mousePos.y };
  });

  // Cursor line position
  const cursorX = createMemo(() => {
    const point = closestPoint();
    if (!point) return null;

    const xScale = chart.xScale();
    const xKey = chart.xKey();
    const xVal = point[xKey];
    const xType = chart.xType();

    if (xType === "band") {
      const bandScale = xScale as d3.ScaleBand<string>;
      return (bandScale(String(xVal)) ?? 0) + bandScale.bandwidth() / 2;
    }

    return (xScale as d3.ScaleTime<number, number>)(xVal as Date);
  });

  return (
    <>
      {/* Cursor line */}
      <Show when={showCursor() && cursorX() !== null}>
        <line
          pointer-events="none"
          stroke="hsl(var(--muted-foreground))"
          stroke-dasharray="4,4"
          stroke-width={1}
          x1={cursorX()!}
          x2={cursorX()!}
          y1={0}
          y2={chart.dimensions().innerHeight}
        />
      </Show>

      {/* Indicator dots */}
      <Show when={indicator() === "dot" && closestPoint()}>
        <For
          each={chart.dataKeys().filter((k) => !chart.hiddenSeries().has(k))}
        >
          {(key) => {
            const point = closestPoint()!;
            const val = point[key];
            if (typeof val !== "number") return null;

            const xScale = chart.xScale();
            const yScale = chart.yScale();
            const xKey = chart.xKey();
            const xVal = point[xKey];
            const xType = chart.xType();

            let cx: number;
            if (xType === "band") {
              const bandScale = xScale as d3.ScaleBand<string>;
              cx = (bandScale(String(xVal)) ?? 0) + bandScale.bandwidth() / 2;
            } else {
              cx = (xScale as d3.ScaleTime<number, number>)(xVal as Date);
            }

            const cy = yScale(val);
            const color = chart.colorScale()(key);

            return (
              <circle
                cx={cx}
                cy={cy}
                fill={color}
                pointer-events="none"
                r={5}
                stroke="hsl(var(--background))"
                stroke-width={2}
              />
            );
          }}
        </For>
      </Show>

      {/* Tooltip portal */}
      <Show when={tooltipPosition() && closestPoint()}>
        <Portal>
          <div
            class={`pointer-events-none fixed z-50 ${local.class ?? ""}`}
            style={{
              left: `${Math.min(tooltipPosition()!.x + 12, window.innerWidth - 200)}px`,
              top: `${Math.min(tooltipPosition()!.y + 12, window.innerHeight - 150)}px`,
            }}
          >
            {local.children ?? <ChartTooltipContent />}
          </div>
        </Portal>
      </Show>
    </>
  );
};

/**
 * ChartTooltipContent - Default tooltip content
 */
export const ChartTooltipContent: Component<ChartTooltipContentProps> = (
  props
) => {
  const [local, _others] = splitProps(props, [
    "labelKey",
    "labelFormatter",
    "valueFormatter",
    "hideLabel",
    "hideIndicator",
    "class",
  ]);

  const chart = useChart();

  const labelFormatter = () => local.labelFormatter ?? defaultLabelFormatter;
  const valueFormatter = () => local.valueFormatter ?? defaultValueFormatter;

  const tooltipData = createMemo(() => {
    const point = chart.hoveredPoint();
    if (!point) return null;

    const xKey = local.labelKey ?? chart.xKey();
    const label = labelFormatter()(point[xKey]);

    const items = chart
      .dataKeys()
      .filter((k) => !chart.hiddenSeries().has(k))
      .map((key) => {
        const val = point[key];
        const config = chart.config()[key];
        return {
          key,
          label: config?.label ?? key,
          value: typeof val === "number" ? val : 0,
          color: chart.colorScale()(key),
        };
      })
      .filter(
        (item) =>
          item.value !== 0 || chart.data().some((d) => d[item.key] === 0)
      );

    return { label, items };
  });

  return (
    <Show when={tooltipData()}>
      <div
        class={`rounded-lg border bg-popover px-3 py-2 shadow-md ${local.class ?? ""}`}
        style={{
          background: "hsl(var(--popover))",
          border: "1px solid hsl(var(--border))",
          color: "hsl(var(--popover-foreground))",
        }}
      >
        {/* Label */}
        <Show when={!local.hideLabel}>
          <div class="mb-1 text-muted-foreground text-xs">
            {tooltipData()!.label}
          </div>
        </Show>

        {/* Items */}
        <div class="flex flex-col gap-1">
          <For each={tooltipData()!.items}>
            {(item) => (
              <div class="flex items-center gap-2 text-sm">
                <Show when={!local.hideIndicator}>
                  <span
                    class="h-2 w-2 rounded-full"
                    style={{ background: item.color }}
                  />
                </Show>
                <span class="text-muted-foreground">{item.label}:</span>
                <span class="font-medium">{valueFormatter()(item.value)}</span>
              </div>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

export default ChartTooltip;
