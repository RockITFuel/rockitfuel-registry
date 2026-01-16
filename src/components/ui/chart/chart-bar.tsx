import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  on,
  splitProps,
} from "solid-js";
import { useChart } from "./chart-context";

export type ChartBarProps = {
  /** Key in data for Y values */
  dataKey: string;
  /** Key in data for X values */
  xKey?: string;
  /** Bar fill color */
  fill?: string;
  /** Border radius [topLeft, topRight, bottomRight, bottomLeft] or single value */
  radius?: number | [number, number, number, number];
  /** Stacking mode */
  stack?: "none" | "stacked" | "expanded";
  /** Group ID for stacking */
  stackId?: string;
  /** Bar orientation */
  layout?: "vertical" | "horizontal";
  /** Fixed bar width */
  barSize?: number;
  /** Maximum bar width */
  maxBarSize?: number;
  /** Minimum bar width */
  minBarSize?: number;
  /** Enable animations */
  animate?: boolean;
  /** Highlight on hover */
  activeBar?: boolean;
  /** CSS class */
  class?: string;
};

/**
 * Generate SVG path for a rounded rect
 */
function roundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: [number, number, number, number]
): string {
  const [tl, tr, br, bl] = radius;

  // Clamp radius to half of smallest dimension
  const maxR = Math.min(width, height) / 2;
  const rtl = Math.min(tl, maxR);
  const rtr = Math.min(tr, maxR);
  const rbr = Math.min(br, maxR);
  const rbl = Math.min(bl, maxR);

  return `
    M ${x + rtl} ${y}
    L ${x + width - rtr} ${y}
    Q ${x + width} ${y} ${x + width} ${y + rtr}
    L ${x + width} ${y + height - rbr}
    Q ${x + width} ${y + height} ${x + width - rbr} ${y + height}
    L ${x + rbl} ${y + height}
    Q ${x} ${y + height} ${x} ${y + height - rbl}
    L ${x} ${y + rtl}
    Q ${x} ${y} ${x + rtl} ${y}
    Z
  `.trim();
}

/**
 * ChartBar - Renders bar series with grouping and stacking
 *
 * Supports vertical and horizontal layouts, rounded corners,
 * and animated entrance.
 */
export const ChartBar: Component<ChartBarProps> = (props) => {
  const [local, _others] = splitProps(props, [
    "dataKey",
    "xKey",
    "fill",
    "radius",
    "stack",
    "stackId",
    "layout",
    "barSize",
    "maxBarSize",
    "minBarSize",
    "animate",
    "activeBar",
    "class",
  ]);

  const chart = useChart();

  // Animation state
  const [animationProgress, setAnimationProgress] = createSignal(
    local.animate !== false ? 0 : 1
  );

  const xKey = () => local.xKey ?? chart.xKey();
  const layout = () => local.layout ?? "vertical";
  const maxBarSize = () => local.maxBarSize ?? 50;
  const minBarSize = () => local.minBarSize ?? 2;

  // Parse radius prop
  const radius = (): [number, number, number, number] => {
    const r = local.radius;
    if (typeof r === "number") return [r, r, r, r];
    if (Array.isArray(r)) return r;
    return [4, 4, 0, 0]; // Default: rounded top corners
  };

  // Get color from config or prop
  const fillColor = () => {
    if (local.fill) return local.fill;
    return chart.colorScale()(local.dataKey);
  };

  // Check if this series is hidden
  const isHidden = () => chart.hiddenSeries().has(local.dataKey);

  // Get hovered bar index
  const hoveredIndex = () => chart.hoveredPointIndex();

  // Calculate bar positions and dimensions
  const bars = createMemo(() => {
    if (isHidden()) return [];

    const data = chart.data();
    const xScale = chart.xScale();
    const yScale = chart.yScale();
    const x = xKey();
    const key = local.dataKey;
    const xType = chart.xType();
    const innerHeight = chart.dimensions().innerHeight;

    if (layout() === "vertical") {
      // Vertical bars (standard bar chart)
      if (xType !== "band") {
        console.warn(
          "ChartBar with vertical layout requires band scale for X axis"
        );
        return [];
      }

      const bandScale = xScale as d3.ScaleBand<string>;
      let barWidth = local.barSize ?? bandScale.bandwidth();

      // Apply size constraints
      barWidth = Math.max(minBarSize(), Math.min(maxBarSize(), barWidth));

      return data
        .map((d, index) => {
          const xVal = d[x];
          const yVal = d[key];

          if (typeof yVal !== "number" || isNaN(yVal)) {
            return null;
          }

          const bandX = bandScale(String(xVal)) ?? 0;
          const bandCenter = bandX + bandScale.bandwidth() / 2;
          const barX = bandCenter - barWidth / 2;

          const y = yScale(yVal);
          const height = innerHeight - y;

          return {
            x: barX,
            y,
            width: barWidth,
            height: Math.max(0, height),
            value: yVal,
            index,
          };
        })
        .filter(Boolean) as Array<{
        x: number;
        y: number;
        width: number;
        height: number;
        value: number;
        index: number;
      }>;
    }

    // Horizontal bars
    const innerWidth = chart.dimensions().innerWidth;
    const bandScale = yScale as unknown as d3.ScaleBand<string>;

    if (typeof bandScale.bandwidth !== "function") {
      console.warn(
        "ChartBar with horizontal layout requires band scale for Y axis"
      );
      return [];
    }

    let barHeight = local.barSize ?? bandScale.bandwidth();
    barHeight = Math.max(minBarSize(), Math.min(maxBarSize(), barHeight));

    return data
      .map((d, index) => {
        const xVal = d[key];
        const yVal = d[x];

        if (typeof xVal !== "number" || isNaN(xVal)) {
          return null;
        }

        const bandY = bandScale(String(yVal)) ?? 0;
        const bandCenter = bandY + bandScale.bandwidth() / 2;
        const barY = bandCenter - barHeight / 2;

        const width = (xScale as d3.ScaleLinear<number, number>)(xVal);

        return {
          x: 0,
          y: barY,
          width: Math.max(0, width),
          height: barHeight,
          value: xVal,
          index,
        };
      })
      .filter(Boolean) as Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      value: number;
      index: number;
    }>;
  });

  // Animate on mount
  createEffect(
    on(
      () => bars(),
      () => {
        if (local.animate !== false) {
          const duration = chart.animation().duration ?? 750;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const eased = 1 - (1 - progress) ** 3;
            setAnimationProgress(eased);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      }
    )
  );

  // Hide if series is hidden
  if (isHidden()) return null;

  return (
    <g class={`chart-bar ${local.class ?? ""}`}>
      <For each={bars()}>
        {(bar) => {
          const progress = animationProgress();
          const isHovered = local.activeBar && hoveredIndex() === bar.index;

          // Animate from bottom (vertical) or left (horizontal)
          let animatedHeight = bar.height;
          let animatedY = bar.y;
          let animatedWidth = bar.width;
          const animatedX = bar.x;

          if (layout() === "vertical") {
            animatedHeight = bar.height * progress;
            animatedY = bar.y + bar.height * (1 - progress);
          } else {
            animatedWidth = bar.width * progress;
          }

          // Apply radius only for top corners when animating from bottom
          const r = radius();
          const animatedRadius: [number, number, number, number] =
            layout() === "vertical"
              ? [r[0], r[1], r[2], r[3]]
              : [r[0], r[1], r[2], r[3]];

          return (
            <path
              class="chart-bar-rect"
              d={roundedRect(
                animatedX,
                animatedY,
                animatedWidth,
                animatedHeight,
                animatedRadius
              )}
              fill={fillColor()}
              opacity={isHovered ? 1 : 0.9}
              style={{
                transition: local.activeBar ? "opacity 150ms" : undefined,
                filter: isHovered ? "brightness(1.1)" : undefined,
              }}
            />
          );
        }}
      </For>
    </g>
  );
};

export default ChartBar;
