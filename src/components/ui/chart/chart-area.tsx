import {
  area,
  type CurveFactory,
  curveLinear,
  curveNatural,
  curveStep,
} from "d3-shape";
import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  on,
  Show,
  splitProps,
} from "solid-js";
import { useChart } from "./chart-context";
import type { DataPoint } from "./types";

export type ChartAreaProps = {
  /** Key in data for Y values */
  dataKey: string;
  /** Key in data for X values */
  xKey?: string;
  /** Line stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Area fill color */
  fill?: string;
  /** Fill opacity */
  fillOpacity?: number;
  /** Interpolation type */
  curve?: "natural" | "linear" | "step";
  /** Stacking mode */
  stack?: "none" | "stacked" | "expanded";
  /** Group ID for stacking multiple areas */
  stackId?: string;
  /** Connect across null values */
  connectNulls?: boolean;
  /** Enable animations */
  animate?: boolean;
  /** Show dots on data points */
  dot?: boolean;
  /** Use gradient fill */
  gradient?: boolean;
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
 * ChartArea - Renders filled area series
 *
 * Uses D3 area generator for path calculation with configurable
 * curve interpolation, stacking modes, and optional gradient fills.
 */
export const ChartArea: Component<ChartAreaProps> = (props) => {
  const [local, _others] = splitProps(props, [
    "dataKey",
    "xKey",
    "stroke",
    "strokeWidth",
    "fill",
    "fillOpacity",
    "curve",
    "stack",
    "stackId",
    "connectNulls",
    "animate",
    "dot",
    "gradient",
    "class",
  ]);

  const chart = useChart();
  const gradientId = createUniqueId();

  // State for animation
  const [animationProgress, setAnimationProgress] = createSignal(
    local.animate !== false ? 0 : 1
  );

  const xKey = () => local.xKey ?? chart.xKey();
  const curveType = () => local.curve ?? "natural";
  const fillOpacity = () => local.fillOpacity ?? 0.3;
  const strokeWidth = () => local.strokeWidth ?? 2;
  const showDot = () => local.dot === true;

  // Get color from config or prop
  const fillColor = () => {
    if (local.fill) return local.fill;
    return chart.colorScale()(local.dataKey);
  };

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

  // Generate area path
  const areaPath = createMemo(() => {
    const data = validData();
    if (data.length === 0) return "";

    const xScale = chart.xScale();
    const yScale = chart.yScale();
    const x = xKey();
    const key = local.dataKey;
    const xType = chart.xType();
    const innerHeight = chart.dimensions().innerHeight;

    const areaGenerator = area<DataPoint>()
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
      .y0(innerHeight)
      .y1((d) => {
        const val = d[key];
        return yScale(val as number);
      });

    return areaGenerator(data) ?? "";
  });

  // Generate line path (top edge of area)
  const linePath = createMemo(() => {
    const data = validData();
    if (data.length === 0) return "";

    const xScale = chart.xScale();
    const yScale = chart.yScale();
    const x = xKey();
    const key = local.dataKey;
    const xType = chart.xType();

    const points = data
      .filter((d) => {
        const val = d[key];
        return typeof val === "number" && !isNaN(val);
      })
      .map((d) => {
        const xVal = d[x];
        let px: number;

        if (xType === "band") {
          const bandScale = xScale as d3.ScaleBand<string>;
          px = (bandScale(String(xVal)) ?? 0) + bandScale.bandwidth() / 2;
        } else {
          px = (xScale as d3.ScaleTime<number, number>)(xVal as Date);
        }

        const py = yScale(d[key] as number);
        return `${px},${py}`;
      });

    if (points.length === 0) return "";
    return `M${points.join("L")}`;
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
        return { cx, cy };
      });
  });

  // Animate on mount
  createEffect(
    on(
      () => validData(),
      () => {
        if (local.animate !== false) {
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

  return (
    <g class={`chart-area ${local.class ?? ""}`}>
      {/* Gradient definition */}
      <Show when={local.gradient}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color={fillColor()} stop-opacity={0.8} />
            <stop offset="100%" stop-color={fillColor()} stop-opacity={0.1} />
          </linearGradient>
        </defs>
      </Show>

      {/* Area fill */}
      <Show when={areaPath()}>
        <path
          class="chart-area-fill"
          d={areaPath()}
          fill={local.gradient ? `url(#${gradientId})` : fillColor()}
          opacity={
            local.animate !== false
              ? fillOpacity() * animationProgress()
              : fillOpacity()
          }
          stroke="none"
        />
      </Show>

      {/* Top edge stroke */}
      <Show when={linePath() && strokeWidth() > 0}>
        <path
          class="chart-area-stroke"
          d={linePath()}
          fill="none"
          opacity={local.animate !== false ? animationProgress() : 1}
          stroke={strokeColor()}
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
              class="chart-area-dot"
              cx={pos.cx}
              cy={pos.cy}
              fill={strokeColor()}
              r={3}
              stroke="hsl(var(--background))"
              stroke-width={2}
            />
          )}
        </For>
      </Show>
    </g>
  );
};

export default ChartArea;
