import { type Component, createMemo, For, splitProps } from "solid-js";
import { useChart } from "./chart-context";

export type ChartGridProps = {
  /** Show horizontal grid lines */
  horizontal?: boolean;
  /** Show vertical grid lines */
  vertical?: boolean;
  /** Grid line color */
  stroke?: string;
  /** Grid line opacity */
  strokeOpacity?: number;
  /** Dash pattern (e.g., "3,3") */
  strokeDasharray?: string;
  /** CSS class */
  class?: string;
};

/**
 * ChartGrid - Renders grid lines for better readability
 *
 * Uses theme CSS variables by default for minimal shadcn-style aesthetic.
 */
export const ChartGrid: Component<ChartGridProps> = (props) => {
  const [local, _others] = splitProps(props, [
    "horizontal",
    "vertical",
    "stroke",
    "strokeOpacity",
    "strokeDasharray",
    "class",
  ]);

  const chart = useChart();

  // Default to horizontal only
  const showHorizontal = () => local.horizontal !== false;
  const showVertical = () => local.vertical === true;

  const stroke = () => local.stroke ?? "hsl(var(--border))";
  const strokeOpacity = () => local.strokeOpacity ?? 0.5;
  const strokeDasharray = () => local.strokeDasharray;

  // Horizontal grid lines (based on Y scale ticks)
  const horizontalLines = createMemo(() => {
    if (!showHorizontal()) return [];

    const yScale = chart.yScale();
    const { innerWidth } = chart.dimensions();
    const ticks = yScale.ticks(5);

    return ticks.map((tick) => ({
      y: yScale(tick),
      x1: 0,
      x2: innerWidth,
    }));
  });

  // Vertical grid lines (based on X scale ticks)
  const verticalLines = createMemo(() => {
    if (!showVertical()) return [];

    const xScale = chart.xScale();
    const { innerHeight } = chart.dimensions();
    const xType = chart.xType();

    if (xType === "band") {
      // For band scale, draw lines at band centers
      const bandScale = xScale as d3.ScaleBand<string>;
      const domain = bandScale.domain();
      const bandwidth = bandScale.bandwidth();

      return domain.map((d) => ({
        x: (bandScale(d) ?? 0) + bandwidth / 2,
        y1: 0,
        y2: innerHeight,
      }));
    }

    // For time/linear scales, use ticks
    const ticks = (xScale as d3.ScaleTime<number, number>).ticks(6);
    return ticks.map((tick) => ({
      x: xScale(tick as Date & number),
      y1: 0,
      y2: innerHeight,
    }));
  });

  return (
    <g class={local.class ?? "chart-grid"}>
      <For each={horizontalLines()}>
        {(line) => (
          <line
            stroke={stroke()}
            stroke-dasharray={strokeDasharray()}
            stroke-opacity={strokeOpacity()}
            x1={line.x1}
            x2={line.x2}
            y1={line.y}
            y2={line.y}
          />
        )}
      </For>
      <For each={verticalLines()}>
        {(line) => (
          <line
            stroke={stroke()}
            stroke-dasharray={strokeDasharray()}
            stroke-opacity={strokeOpacity()}
            x1={line.x}
            x2={line.x}
            y1={line.y1}
            y2={line.y2}
          />
        )}
      </For>
    </g>
  );
};

export default ChartGrid;
