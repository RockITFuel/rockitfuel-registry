import {
  type CurveFactory,
  curveLinear,
  curveNatural,
  curveStep,
  line,
} from "d3-shape";
import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  on,
  Show,
  splitProps,
} from "solid-js";
import { useChart } from "./chart-context";
import type { DataPoint } from "./types";

export type DotProps = {
  /** Dot radius */
  r?: number;
  /** Fill color */
  fill?: string;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
};

export type ChartLineProps = {
  /** Key in data for Y values */
  dataKey: string;
  /** Key in data for X values */
  xKey?: string;
  /** Line stroke color */
  stroke?: string;
  /** Line stroke width */
  strokeWidth?: number;
  /** Dash pattern (e.g., "5,5") */
  strokeDasharray?: string;
  /** Interpolation type */
  curve?: "natural" | "linear" | "step";
  /** Connect across null values */
  connectNulls?: boolean;
  /** Show dots on points */
  dot?: boolean | DotProps;
  /** Show dot on hover */
  activeDot?: boolean | DotProps;
  /** Enable animations */
  animate?: boolean;
  /** Which Y axis to use */
  yAxisId?: "left" | "right";
  /** CSS class */
  class?: string;
};

/**
 * Get curve function from type
 */
function getCurve(curveType: "natural" | "linear" | "step"): CurveFactory {
  switch (curveType) {
    case "linear":
      return curveLinear;
    case "step":
      return curveStep;
    case "natural":
    default:
      return curveNatural;
  }
}

/**
 * ChartLine - Renders line series with support for dots
 *
 * Uses D3 line generator for path calculation with configurable
 * curve interpolation and optional data point dots.
 */
export const ChartLine: Component<ChartLineProps> = (props) => {
  const [local, _others] = splitProps(props, [
    "dataKey",
    "xKey",
    "stroke",
    "strokeWidth",
    "strokeDasharray",
    "curve",
    "connectNulls",
    "dot",
    "activeDot",
    "animate",
    "yAxisId",
    "class",
  ]);

  const chart = useChart();

  // State for animation
  const [pathLength, setPathLength] = createSignal(0);
  const [animationProgress, setAnimationProgress] = createSignal(
    local.animate !== false ? 0 : 1
  );

  let pathRef: SVGPathElement | undefined;

  const xKey = () => local.xKey ?? chart.xKey();
  const curveType = () => local.curve ?? "natural";
  const strokeWidth = () => local.strokeWidth ?? 2;
  const showDot = () => local.dot !== false && local.dot !== undefined;
  const showActiveDot = () => local.activeDot !== false;

  // Get color from config or prop
  const strokeColor = () => {
    if (local.stroke) return local.stroke;
    return chart.colorScale()(local.dataKey);
  };

  // Check if this series is hidden
  const isHidden = () => chart.hiddenSeries().has(local.dataKey);

  // Filter valid data points
  const validData = createMemo(() => {
    if (isHidden()) return [];

    const data = chart.data();
    const key = local.dataKey;
    const x = xKey();

    if (local.connectNulls) {
      return data.filter(
        (d) => d[x] != null && typeof d[key] === "number" && !isNaN(d[key])
      );
    }

    return data;
  });

  // Generate line path
  const linePath = createMemo(() => {
    const data = validData();
    if (data.length === 0) return "";

    const xScale = chart.xScale();
    const yScale = chart.yScale();
    const x = xKey();
    const key = local.dataKey;
    const xType = chart.xType();

    const lineGenerator = line<DataPoint>()
      .curve(getCurve(curveType()))
      .defined((d) => {
        const val = d[key];
        return typeof val === "number" && !isNaN(val);
      })
      .x((d) => {
        const xVal = d[x];
        if (xType === "band") {
          const bandScale = xScale as d3.ScaleBand<string>;
          return (bandScale(String(xVal)) ?? 0) + bandScale.bandwidth() / 2;
        }
        return (xScale as d3.ScaleTime<number, number>)(xVal as Date);
      })
      .y((d) => {
        const val = d[key];
        return yScale(val as number);
      });

    return lineGenerator(data) ?? "";
  });

  // Calculate dot positions
  const dotPositions = createMemo(() => {
    if (!showDot()) return [];

    const data = validData();
    const xScale = chart.xScale();
    const yScale = chart.yScale();
    const x = xKey();
    const key = local.dataKey;
    const xType = chart.xType();

    return data
      .filter((d) => {
        const val = d[key];
        return typeof val === "number" && !isNaN(val);
      })
      .map((d) => {
        const xVal = d[x];
        let cx: number;

        if (xType === "band") {
          const bandScale = xScale as d3.ScaleBand<string>;
          cx = (bandScale(String(xVal)) ?? 0) + bandScale.bandwidth() / 2;
        } else {
          cx = (xScale as d3.ScaleTime<number, number>)(xVal as Date);
        }

        const cy = yScale(d[key] as number);
        return { cx, cy, data: d };
      });
  });

  // Active dot position (on hover)
  const activeDotPosition = createMemo(() => {
    if (!showActiveDot()) return null;

    const hoveredPoint = chart.hoveredPoint();
    if (!hoveredPoint) return null;

    const val = hoveredPoint[local.dataKey];
    if (typeof val !== "number" || isNaN(val)) return null;

    const xScale = chart.xScale();
    const yScale = chart.yScale();
    const x = xKey();
    const xVal = hoveredPoint[x];
    const xType = chart.xType();

    let cx: number;
    if (xType === "band") {
      const bandScale = xScale as d3.ScaleBand<string>;
      cx = (bandScale(String(xVal)) ?? 0) + bandScale.bandwidth() / 2;
    } else {
      cx = (xScale as d3.ScaleTime<number, number>)(xVal as Date);
    }

    const cy = yScale(val);
    return { cx, cy };
  });

  // Get dot props
  const getDotProps = (propVal: boolean | DotProps | undefined): DotProps => {
    if (typeof propVal === "object") return propVal;
    return {};
  };

  // Animate on mount
  createEffect(
    on(
      () => pathRef,
      (ref) => {
        if (ref && local.animate !== false) {
          const length = ref.getTotalLength();
          setPathLength(length);

          // Animate progress from 0 to 1
          const duration = chart.animation().duration ?? 750;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setAnimationProgress(progress);

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

  const regularDotProps = getDotProps(local.dot);
  const activeDotPropsVal = getDotProps(local.activeDot);

  return (
    <g class={`chart-line ${local.class ?? ""}`}>
      {/* Line path */}
      <Show when={linePath()}>
        <path
          class="chart-line-path"
          d={linePath()}
          fill="none"
          ref={pathRef}
          stroke={strokeColor()}
          stroke-dasharray={
            local.animate !== false && animationProgress() < 1
              ? `${pathLength() * animationProgress()} ${pathLength()}`
              : local.strokeDasharray
          }
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width={strokeWidth()}
        />
      </Show>

      {/* Data point dots */}
      <Show when={showDot() && animationProgress() >= 1}>
        <For each={dotPositions()}>
          {(pos) => (
            <circle
              class="chart-line-dot"
              cx={pos.cx}
              cy={pos.cy}
              fill={regularDotProps.fill ?? strokeColor()}
              r={regularDotProps.r ?? 3}
              stroke={regularDotProps.stroke ?? "hsl(var(--background))"}
              stroke-width={regularDotProps.strokeWidth ?? 2}
            />
          )}
        </For>
      </Show>

      {/* Active dot on hover */}
      <Show when={activeDotPosition()}>
        <circle
          class="chart-line-active-dot"
          cx={activeDotPosition()!.cx}
          cy={activeDotPosition()!.cy}
          fill={activeDotPropsVal.fill ?? strokeColor()}
          r={activeDotPropsVal.r ?? 5}
          stroke={activeDotPropsVal.stroke ?? "hsl(var(--background))"}
          stroke-width={activeDotPropsVal.strokeWidth ?? 2}
        />
      </Show>
    </g>
  );
};

export default ChartLine;
